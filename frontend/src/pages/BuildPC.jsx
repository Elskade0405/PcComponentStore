import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { Cpu, HardDrive, Filter, Monitor, Mouse, Keyboard, Plus, Minus, Trash2, X, RefreshCw, ShoppingCart, Info, Search, Sparkles } from 'lucide-react';
import API_URL from '../config';

// Custom icons based on lucide for various parts
const partIcons = {
    cpu: <Cpu size={24} />,
    mainboard: <HardDrive size={24} />,
    vga: <Monitor size={24} />,
    ram: <HardDrive size={24} />,
    ssd: <HardDrive size={24} />,
    hdd: <HardDrive size={24} />,
    psu: <HardDrive size={24} />,
    cooler: <RefreshCw size={24} />,
    monitor: <Monitor size={24} />,
    mouse: <Mouse size={24} />,
    keyboard: <Keyboard size={24} />
};

import ComponentPickerModal, { BUILD_SLOTS } from '../components/ComponentPickerModal';
import RealtimeAiAssistant from '../components/RealtimeAiAssistant';

const BuildPC = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // selectedParts object: { [slotId]: { product: {...}, quantity: 1 } }
    const [selectedParts, setSelectedParts] = useState({});
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeSlot, setActiveSlot] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                setAllProducts(res.data);
            } catch (err) {
                console.error("Failed to load products", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);



    const handleOpenModal = (slotId) => {
        setActiveSlot(slotId);
        setIsModalOpen(true);
    };

    const handleSelectProduct = (product) => {
        setSelectedParts(prev => ({
            ...prev,
            [activeSlot]: { product, quantity: 1 }
        }));
        setIsModalOpen(false);
    };

    const handleRemovePart = (slotId) => {
        setSelectedParts(prev => {
            const newParts = { ...prev };
            delete newParts[slotId];
            return newParts;
        });
    };

    const handleQuantityChange = (slotId, delta) => {
        setSelectedParts(prev => {
            const currentItem = prev[slotId];
            if (!currentItem) return prev;
            
            const newQuantity = currentItem.quantity + delta;
            if (newQuantity < 1) return prev;
            if (currentItem.product.stockQuantity && newQuantity > currentItem.product.stockQuantity) {
                alert(`Sản phẩm này chỉ còn ${currentItem.product.stockQuantity} chiếc.`);
                return prev;
            }

            return {
                ...prev,
                [slotId]: { ...currentItem, quantity: newQuantity }
            };
        });
    };

    const handleClearAll = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ cấu hình đang xây dựng?')) {
            setSelectedParts({});
        }
    };

    const handleAddAllToCart = () => {
        const parts = Object.values(selectedParts);
        if (parts.length === 0) {
            alert('Vui lòng chọn ít nhất 1 linh kiện trước khi thêm vào giỏ hàng.');
            return;
        }

        parts.forEach(part => {
            addToCart(part.product, part.quantity);
        });

        alert('Đã thêm toàn bộ linh kiện vào giỏ hàng!');
        navigate('/cart');
    };

    const totalCost = useMemo(() => {
        return Object.values(selectedParts).reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    }, [selectedParts]);

    if (loading) {
        return <div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Đang tải dữ liệu gốc...</div>;
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem', color: '#333' }}>Build PC</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Chọn các linh kiện máy tính bạn cần để xây dựng cấu hình máy hoàn chỉnh</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '2rem', alignItems: 'start' }}>
                
                {/* Left Column: Build List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button 
                            onClick={handleClearAll}
                            className="btn btn-outline" 
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', fontSize: '0.9rem', color: '#ea580c', borderColor: '#ea580c' }}
                        >
                            <RefreshCw size={16} /> Chọn lại từ đầu
                        </button>
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                        {BUILD_SLOTS.filter(s => !s.hiddenInBuildPc).map(slot => {
                            const selectedItem = selectedParts[slot.id];
                            let resolvedImage = '';
                            if (selectedItem && selectedItem.product) {
                                const p = selectedItem.product;
                                let parsedAttr = {};
                                try { if (p.attributes) parsedAttr = JSON.parse(p.attributes); } catch(e) {}
                                resolvedImage = parsedAttr.thumbnailUrl || parsedAttr.imageUrl || p.imageUrl || '';
                            }

                            return (
                                <div key={slot.id} style={{ 
                                    padding: '1rem', 
                                    borderBottom: '1px solid #f1f5f9', 
                                    backgroundColor: selectedItem ? '#fff' : '#f8fafc',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    transition: 'all 0.2s ease'
                                }}>
                                    {/* Icon Column */}
                                    <div style={{ width: '50px', display: 'flex', justifyContent: 'center', color: selectedItem ? 'var(--accent-blue)' : '#94a3b8' }}>
                                        {partIcons[slot.id] || <HardDrive size={24} />}
                                    </div>

                                    {/* Content Column */}
                                    {!selectedItem ? (
                                        // Empty State for Slot
                                        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ fontWeight: 600, color: '#334155' }}>
                                                {slot.label}
                                            </div>
                                            <button 
                                                className="btn btn-primary"
                                                onClick={() => handleOpenModal(slot.id)}
                                                style={{ padding: '0.4rem 1.5rem', borderRadius: '4px', fontSize: '0.85rem' }}
                                            >
                                                Chọn
                                            </button>
                                        </div>
                                    ) : (
                                        // Selected Item State
                                        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                                                <div style={{ width: '60px', height: '60px', backgroundColor: 'white', padding: '4px', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                                                    <img 
                                                        src={resolvedImage ? `${API_URL}${resolvedImage}` : 'https://via.placeholder.com/60?text=No+Img'} 
                                                        alt={selectedItem.product.name} 
                                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                                                        onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/60?text=No+Img'; }}
                                                    />
                                                </div>
                                                <div style={{ flex: 1, paddingRight: '1rem' }}>
                                                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                                                        {slot.label}
                                                    </div>
                                                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                        {selectedItem.product.name}
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', overflow: 'hidden', height: '30px' }}>
                                                            <button 
                                                                onClick={() => handleQuantityChange(slot.id, -1)}
                                                                style={{ padding: '0 0.5rem', height: '100%', backgroundColor: '#f8fafc', border: 'none', cursor: 'pointer', borderRight: '1px solid #cbd5e1' }}
                                                            ><Minus size={14} /></button>
                                                            <span style={{ fontSize: '0.9rem', width: '40px', textAlign: 'center', fontWeight: 600 }}>{selectedItem.quantity}</span>
                                                            <button 
                                                                onClick={() => handleQuantityChange(slot.id, 1)}
                                                                style={{ padding: '0 0.5rem', height: '100%', backgroundColor: '#f8fafc', border: 'none', cursor: 'pointer', borderLeft: '1px solid #cbd5e1' }}
                                                            ><Plus size={14} /></button>
                                                        </div>
                                                        <button 
                                                            onClick={() => handleRemovePart(slot.id)}
                                                            style={{ background: 'none', border: 'none', color: 'var(--accent-red)', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                                                        ><Trash2 size={14} /> Xóa</button>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                                                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-red)' }}>
                                                    {(selectedItem.product.price * selectedItem.quantity).toLocaleString('vi-VN')}đ
                                                </div>
                                                <button 
                                                    onClick={() => handleOpenModal(slot.id)}
                                                    style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', fontSize: '0.85rem', cursor: 'pointer', marginTop: '0.5rem', textDecoration: 'underline' }}
                                                >Thay đổi »</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column: Sticky Summary */}
                <div style={{ position: 'sticky', top: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid var(--border-color)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#334155' }}>Tạm tính:</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-red)' }}>{totalCost.toLocaleString('vi-VN')}đ</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>
                            Giá chưa bao gồm ưu đãi Build PC. <a href="#" style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}>Xem chi tiết</a>
                        </p>
                    </div>

                    <RealtimeAiAssistant selectedParts={selectedParts} />

                    <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)', padding: '1.5rem', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155', marginBottom: '1rem' }}>Bạn cần thắc mắc về cấu hình?</h3>
                        <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', borderColor: '#7dd3fc', color: '#0284c7', backgroundColor: '#e0f2fe' }}>
                            <Info size={16} /> Liên hệ tư vấn
                        </button>
                    </div>

                    <button 
                        onClick={handleAddAllToCart}
                        className="btn btn-primary" 
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', fontSize: '1.1rem', fontWeight: 700 }}
                    >
                        Thêm vào giỏ hàng <ShoppingCart size={20} />
                    </button>
                </div>
            </div>

            <ComponentPickerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                activeSlot={activeSlot}
                onSelectProduct={handleSelectProduct}
                allProducts={allProducts}
            />
        </div>
    );
};

export default BuildPC;
