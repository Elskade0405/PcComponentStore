import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { Cpu, HardDrive, Filter, Monitor, Mouse, Keyboard, Plus, Minus, Trash2, X, RefreshCw, ShoppingCart, Info, Search } from 'lucide-react';

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

const BUILD_SLOTS = [
    { id: 'cpu', label: 'Bộ vi xử lý (CPU)', searchKeys: ['cpu', 'bộ vi xử lý', 'intel', 'amd', 'ryzen', 'core'] },
    { id: 'mainboard', label: 'Bo mạch chủ (Mainboard)', searchKeys: ['mainboard', 'bo mạch chủ', 'motherboard'] },
    { id: 'vga', label: 'Card màn hình (VGA)', searchKeys: ['vga', 'card đồ họa', 'card màn hình', 'rtx', 'gtx', 'rx'] },
    { id: 'ram', label: 'Bộ nhớ RAM', searchKeys: ['ram', 'bộ nhớ'] },
    { id: 'ssd', label: 'Ổ cứng SSD', searchKeys: ['ssd', 'ổ cứng rắn', 'nvme', 'sata'] },
    { id: 'hdd', label: 'Ổ cứng HDD', searchKeys: ['hdd', 'ổ cứng', 'ổ đĩa cứng'] },
    { id: 'psu', label: 'Nguồn máy tính (PSU)', searchKeys: ['psu', 'nguồn', 'power'] },
    { id: 'cooler', label: 'Tản nhiệt', searchKeys: ['tản nhiệt', 'cooler', 'fan', 'tản'] },
    { id: 'monitor', label: 'Màn hình', searchKeys: ['màn hình', 'monitor'] },
    { id: 'mouse', label: 'Chuột máy tính', searchKeys: ['chuột', 'mouse'] },
    { id: 'keyboard', label: 'Bàn phím', searchKeys: ['bàn phím', 'keyboard', 'phím'] }
];

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
    const [searchQuery, setSearchQuery] = useState('');

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

    // Filter products for the active slot inside the modal
    const modalProducts = useMemo(() => {
        if (!activeSlot) return [];
        const slotConfig = BUILD_SLOTS.find(s => s.id === activeSlot);
        if (!slotConfig) return [];

        let filtered = allProducts;
        
        // Smart filtering based on slot's search keys (since DB might not have exact sub-categories linked properly)
        filtered = filtered.filter(p => {
            const nameLower = p.name.toLowerCase();
            const descLower = p.description ? p.description.toLowerCase() : '';
            return slotConfig.searchKeys.some(key => nameLower.includes(key) || descLower.includes(key));
        });

        // Apply manual search query inside modal if any
        if (searchQuery.trim()) {
            const queryLower = searchQuery.toLowerCase();
            filtered = filtered.filter(p => p.name.toLowerCase().includes(queryLower));
        }

        return filtered;
    }, [activeSlot, allProducts, searchQuery]);

    const handleOpenModal = (slotId) => {
        setActiveSlot(slotId);
        setSearchQuery('');
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
                        {BUILD_SLOTS.map(slot => {
                            const selectedItem = selectedParts[slot.id];

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
                                                        src={`http://localhost:5285${selectedItem.product.imageUrl}`} 
                                                        alt={selectedItem.product.name} 
                                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                                                        onError={e => e.target.src = 'https://via.placeholder.com/60?text=No+Img'}
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

                    <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)', padding: '1.5rem', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155', marginBottom: '1rem' }}>Bạn cần thắc mắc về cấu hình ?</h3>
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

            {/* Selection Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '100%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                                Chọn {BUILD_SLOTS.find(s => s.id === activeSlot)?.label}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                            <div className="input-group" style={{ position: 'relative' }}>
                                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input 
                                    type="text" 
                                    className="input-field" 
                                    placeholder="Bạn đang quan tâm sản phẩm nào?" 
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    style={{ paddingLeft: '2.5rem' }}
                                />
                            </div>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                            {modalProducts.length === 0 ? (
                                <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Không tìm thấy sản phẩm nào phù hợp.</p>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                                    {modalProducts.map(p => (
                                        <div key={p.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ height: '140px', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
                                                <img src={`http://localhost:5285${p.imageUrl}`} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} onError={e => e.target.src = 'https://via.placeholder.com/150'} />
                                            </div>
                                            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</div>
                                                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-red)', marginBottom: '1rem' }}>{p.price.toLocaleString('vi-VN')}đ</div>
                                                <button 
                                                    className="btn btn-primary" 
                                                    style={{ width: '100%', padding: '0.4rem', fontSize: '0.85rem', marginTop: 'auto' }}
                                                    onClick={() => handleSelectProduct(p)}
                                                    disabled={p.stockQuantity === 0}
                                                >
                                                    {p.stockQuantity > 0 ? '+ Chọn' : 'Hết hàng'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div style={{ padding: '1rem 1.5rem', textAlign: 'right', backgroundColor: '#f8fafc' }}>
                            <button className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuildPC;
