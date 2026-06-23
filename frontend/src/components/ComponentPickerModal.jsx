import React, { useState, useMemo, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import API_URL from '../config';

export const BUILD_SLOTS = [
    { 
        id: 'cpu', label: 'Bộ vi xử lý (CPU)', searchKeys: ['cpu', 'bộ vi xử lý', 'intel', 'amd', 'ryzen', 'core'], brands: ['Tất cả', 'INTEL', 'AMD'], 
        filters: [
            { name: 'Giá', options: ['Dưới 2 triệu', '2 - 5 triệu', '5 - 10 triệu', 'Trên 10 triệu'] },
            { name: 'Dòng CPU', options: ['Core i3', 'Core i5', 'Core i7', 'Core i9', 'Ryzen 3', 'Ryzen 5', 'Ryzen 7', 'Ryzen 9'] },
            { name: 'Socket', options: ['1200', '1700', 'AM4', 'AM5'] }
        ] 
    },
    { 
        id: 'mainboard', label: 'Bo mạch chủ (Mainboard)', searchKeys: ['mainboard', 'bo mạch chủ', 'motherboard'], brands: ['Tất cả', 'ASUS', 'GIGABYTE', 'MSI', 'ASROCK'], 
        filters: [
            { name: 'Giá', options: ['Dưới 2 triệu', '2 - 5 triệu', 'Trên 5 triệu'] },
            { name: 'Chipset', options: ['H610', 'B660', 'B760', 'Z690', 'Z790', 'A520', 'B450', 'B550', 'X570', 'X670'] },
            { name: 'Kích thước', options: ['ATX', 'Micro-ATX', 'Mini-ITX'] }
        ] 
    },
    { 
        id: 'vga', label: 'Card màn hình (VGA)', searchKeys: ['vga', 'card đồ họa', 'card màn hình', 'rtx', 'gtx', 'rx'], brands: ['Tất cả', 'ASUS', 'GIGABYTE', 'MSI', 'GALAX'], 
        filters: [
            { name: 'Giá', options: ['Dưới 5 triệu', '5 - 10 triệu', '10 - 20 triệu', 'Trên 20 triệu'] },
            { name: 'GPU', options: ['GTX 1650', 'RTX 3050', 'RTX 3060', 'RTX 4060', 'RTX 4070', 'RTX 4080', 'RTX 4090', 'RX 6600', 'RX 7600'] },
            { name: 'Dung lượng', options: ['4GB', '6GB', '8GB', '12GB', '16GB', '24GB'] }
        ] 
    },
    { 
        id: 'ram', label: 'Bộ nhớ RAM', searchKeys: ['ram', 'bộ nhớ'], brands: ['Tất cả', 'KINGSTON', 'CORSAIR', 'G.SKILL'], 
        filters: [
            { name: 'Giá', options: ['Dưới 1 triệu', '1 - 2 triệu', 'Trên 2 triệu'] },
            { name: 'Chuẩn RAM', options: ['DDR4', 'DDR5'] },
            { name: 'Dung lượng', options: ['8GB', '16GB', '32GB', '64GB'] },
            { name: 'Bus', options: ['3200MHz', '3600MHz', '4800MHz', '5200MHz', '5600MHz', '6000MHz'] }
        ] 
    },
    { 
        id: 'ssd', label: 'Ổ cứng SSD', searchKeys: ['ssd', 'ổ cứng rắn', 'nvme', 'sata'], brands: ['Tất cả', 'SAMSUNG', 'WD', 'KINGSTON', 'KIOXIA'], 
        filters: [
            { name: 'Giá', options: ['Dưới 1 triệu', '1 - 2 triệu', 'Trên 2 triệu'] },
            { name: 'Dung lượng', options: ['256GB', '500GB', '512GB', '1TB', '2TB'] },
            { name: 'Chuẩn cắm', options: ['SATA 3', 'M.2 NVMe', 'M.2 PCIe'] }
        ] 
    },
    { 
        id: 'hdd', label: 'Ổ cứng HDD', searchKeys: ['hdd', 'ổ cứng', 'ổ đĩa cứng'], brands: ['Tất cả', 'WD', 'SEAGATE', 'TOSHIBA'], 
        filters: [
            { name: 'Giá', options: ['Dưới 1 triệu', '1 - 2 triệu', 'Trên 2 triệu'] },
            { name: 'Dung lượng', options: ['1TB', '2TB', '4TB', '6TB'] }
        ] 
    },
    { 
        id: 'storage', label: 'Ổ cứng (SSD/HDD)', searchKeys: ['ssd', 'hdd', 'ổ cứng'], brands: ['Tất cả', 'SAMSUNG', 'WD', 'KINGSTON', 'SEAGATE'], 
        hiddenInBuildPc: true,
        filters: [
            { name: 'Giá', options: ['Dưới 1 triệu', '1 - 2 triệu', 'Trên 2 triệu'] },
            { name: 'Dung lượng', options: ['256GB', '512GB', '1TB', '2TB', '4TB'] }
        ] 
    },
    { 
        id: 'psu', label: 'Nguồn máy tính (PSU)', searchKeys: ['psu', 'nguồn', 'power'], brands: ['Tất cả', 'CORSAIR', 'COOLER MASTER', 'GIGABYTE', 'MSI'], 
        filters: [
            { name: 'Giá', options: ['Dưới 1 triệu', '1 - 2 triệu', 'Trên 2 triệu'] },
            { name: 'Công suất', options: ['450W', '550W', '650W', '750W', '850W', '1000W'] },
            { name: 'Chuẩn', options: ['White', 'Bronze', 'Gold', 'Platinum'] }
        ] 
    },
    { 
        id: 'cooler', label: 'Tản nhiệt', searchKeys: ['tản nhiệt', 'cooler', 'fan', 'tản'], brands: ['Tất cả', 'COOLER MASTER', 'NOCTUA', 'NZXT', 'THERMALRIGHT'], 
        filters: [
            { name: 'Giá', options: ['Dưới 500k', '500k - 1 triệu', 'Trên 1 triệu'] },
            { name: 'Loại tản', options: ['Tản khí', 'Tản nước AIO'] }
        ] 
    },
    { 
        id: 'case', label: 'Vỏ máy tính (Case)', searchKeys: ['case', 'vỏ', 'chassis'], brands: ['Tất cả', 'MONTECH', 'XIGMATEK', 'NZXT', 'DEEPCOOL'], 
        filters: [
            { name: 'Giá', options: ['Dưới 500k', '500k - 1 triệu', 'Trên 1 triệu'] },
            { name: 'Kích thước', options: ['ATX', 'Micro-ATX'] }
        ] 
    },
    { 
        id: 'monitor', label: 'Màn hình', searchKeys: ['màn hình', 'monitor'], brands: ['Tất cả', 'DELL', 'LG', 'SAMSUNG', 'ASUS', 'AOC'], 
        filters: [
            { name: 'Giá', options: ['Dưới 3 triệu', '3 - 5 triệu', '5 - 10 triệu', 'Trên 10 triệu'] },
            { name: 'Kích thước', options: ['24 inch', '27 inch', '32 inch', '34 inch'] },
            { name: 'Độ phân giải', options: ['FHD', '2K', '4K'] },
            { name: 'Tần số quét', options: ['60Hz', '75Hz', '144Hz', '165Hz', '240Hz'] }
        ] 
    },
    { 
        id: 'mouse', label: 'Chuột máy tính', searchKeys: ['chuột', 'mouse'], brands: ['Tất cả', 'LOGITECH', 'RAZER', 'CORSAIR', 'DAREU'], 
        filters: [
            { name: 'Giá', options: ['Dưới 500k', '500k - 1 triệu', 'Trên 1 triệu'] },
            { name: 'Kết nối', options: ['Có dây', 'Không dây', 'Bluetooth'] }
        ] 
    },
    { 
        id: 'keyboard', label: 'Bàn phím', searchKeys: ['bàn phím', 'keyboard', 'phím'], brands: ['Tất cả', 'LOGITECH', 'RAZER', 'AKKO', 'DAREU'], 
        filters: [
            { name: 'Giá', options: ['Dưới 1 triệu', '1 - 2 triệu', 'Trên 2 triệu'] },
            { name: 'Kết nối', options: ['Có dây', 'Không dây'] },
            { name: 'Loại phím', options: ['Cơ', 'Giả cơ'] }
        ] 
    }
];

const ComponentPickerModal = ({ isOpen, onClose, activeSlot, onSelectProduct, allProducts }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('Tất cả');
    const [sortBy, setSortBy] = useState('Mặc định');
    const [openFilterDropdown, setOpenFilterDropdown] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState({});

    // Reset filters when modal opens for a new slot
    useEffect(() => {
        if (isOpen) {
            setSearchQuery('');
            setSelectedBrand('Tất cả');
            setSortBy('Mặc định');
            setOpenFilterDropdown(null);
            setSelectedFilters({});
        }
    }, [isOpen, activeSlot]);

    const modalProducts = useMemo(() => {
        if (!activeSlot) return [];
        const slotConfig = BUILD_SLOTS.find(s => s.id === activeSlot);
        if (!slotConfig) return [];

        let filtered = allProducts;
        
        // Smart filtering based on exact category name
        filtered = filtered.filter(p => {
            const catLower = (p.categoryName || '').toLowerCase();
            if (activeSlot === 'cpu' && catLower === 'cpu') return true;
            if (activeSlot === 'mainboard' && catLower === 'mainboard') return true;
            if (activeSlot === 'vga' && catLower === 'vga') return true;
            if (activeSlot === 'ram' && catLower === 'ram') return true;
            if ((activeSlot === 'ssd' || activeSlot === 'hdd' || activeSlot === 'storage') && catLower === 'storage') return true;
            if (activeSlot === 'psu' && catLower === 'psu') return true;
            if (activeSlot === 'cooler' && catLower === 'cooling') return true;
            if (activeSlot === 'case' && catLower === 'case') return true;
            if (activeSlot === 'monitor' && catLower === 'monitor') return true;

            // Only fallback to name search if category is somehow missing
            if (!catLower) {
                const nameLower = p.name ? p.name.toLowerCase() : '';
                return slotConfig.searchKeys.some(key => nameLower.includes(key));
            }
            return false;
        });

        // Brand filtering
        if (selectedBrand !== 'Tất cả') {
            filtered = filtered.filter(p => {
                if (p.brand && typeof p.brand === 'string') {
                    return p.brand.toLowerCase() === selectedBrand.toLowerCase();
                }
                return p.name ? p.name.toLowerCase().includes(selectedBrand.toLowerCase()) : false; // fallback
            });
        }

        // Dropdown Filters Logic
        if (selectedFilters['Giá']) {
            const priceFilter = selectedFilters['Giá'];
            const parsePrice = (priceStr) => {
                const num = parseInt(priceStr.replace(/[^0-9]/g, ''));
                if (priceStr.includes('triệu')) return num * 1000000;
                if (priceStr.includes('k')) return num * 1000;
                return num;
            };
            if (priceFilter.includes('Dưới')) {
                const maxPrice = parsePrice(priceFilter);
                filtered = filtered.filter(p => p.price < maxPrice);
            } else if (priceFilter.includes('Trên')) {
                const minPrice = parsePrice(priceFilter);
                filtered = filtered.filter(p => p.price > minPrice);
            } else if (priceFilter.includes('-')) {
                const parts = priceFilter.split('-');
                const minPrice = parsePrice(parts[0]);
                const maxPrice = parsePrice(parts[1]);
                filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);
            }
        }
        
        Object.keys(selectedFilters).forEach(key => {
            if (key !== 'Giá' && selectedFilters[key]) {
                const expectedValue = selectedFilters[key].toLowerCase();
                filtered = filtered.filter(p => {
                    const nameLower = p.name ? p.name.toLowerCase() : '';
                    const descLower = p.description ? p.description.toLowerCase() : '';
                    return nameLower.includes(expectedValue) || descLower.includes(expectedValue);
                });
            }
        });

        // Apply manual search query inside modal if any
        if (searchQuery.trim()) {
            const queryLower = searchQuery.toLowerCase();
            filtered = filtered.filter(p => p.name ? p.name.toLowerCase().includes(queryLower) : false);
        }

        // Apply sorting
        if (sortBy === 'Giá (Thấp đến Cao)') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'Giá (Cao đến Thấp)') {
            filtered.sort((a, b) => b.price - a.price);
        }

        return filtered;
    }, [activeSlot, allProducts, searchQuery, selectedBrand, sortBy, selectedFilters]);

    if (!isOpen) return null;

    const currentSlotData = BUILD_SLOTS.find(s => s.id === activeSlot);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', width: '100%', maxWidth: '1000px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f1f5f9' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: '#1e293b', textTransform: 'uppercase' }}>
                        {activeSlot === 'cpu' ? 'CPU' : currentSlotData?.label || 'Chưa rõ'}
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                        <X size={36} strokeWidth={1} />
                    </button>
                </div>
                
                {/* Filter Section */}
                <div style={{ padding: '1.5rem', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Brands and Filters */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
                        {/* Brand Selection */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#000' }}>Chọn thương hiệu:</span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {(currentSlotData?.brands || ['Tất cả']).map(brand => (
                                    <button 
                                        key={brand}
                                        onClick={() => setSelectedBrand(brand)}
                                        style={{
                                            padding: '0.3rem 1rem',
                                            fontSize: '0.85rem',
                                            fontWeight: selectedBrand === brand ? 600 : 400,
                                            backgroundColor: selectedBrand === brand ? '#fee2e2' : '#fff',
                                            color: selectedBrand === brand ? '#ef4444' : '#64748b',
                                            border: `1px solid ${selectedBrand === brand ? '#ef4444' : '#cbd5e1'}`,
                                            cursor: 'pointer',
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        {brand}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Pseudo Filters */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#000' }}>Lọc theo:</span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {(currentSlotData?.filters || []).map(filterObj => (
                                    <div key={filterObj.name} style={{ position: 'relative' }}>
                                        <button 
                                            onClick={() => setOpenFilterDropdown(openFilterDropdown === filterObj.name ? null : filterObj.name)}
                                            style={{
                                                padding: '0.3rem 0.8rem',
                                                fontSize: '0.85rem',
                                                backgroundColor: (openFilterDropdown === filterObj.name || selectedFilters[filterObj.name]) ? '#f0f9ff' : '#fff',
                                                color: (openFilterDropdown === filterObj.name || selectedFilters[filterObj.name]) ? '#0ea5e9' : '#64748b',
                                                border: `1px solid ${(openFilterDropdown === filterObj.name || selectedFilters[filterObj.name]) ? '#38bdf8' : '#cbd5e1'}`,
                                                borderRadius: '16px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            {selectedFilters[filterObj.name] || filterObj.name} <span style={{ fontSize: '0.6rem', transform: openFilterDropdown === filterObj.name ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                                        </button>
                                        
                                        {/* Dropdown Menu */}
                                        {openFilterDropdown === filterObj.name && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '100%',
                                                left: 0,
                                                marginTop: '0.5rem',
                                                backgroundColor: '#fff',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '8px',
                                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                                zIndex: 50,
                                                minWidth: '200px',
                                                overflow: 'hidden',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}>
                                                <div 
                                                    style={{ padding: '0.6rem 1rem', borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem', color: !selectedFilters[filterObj.name] ? '#0ea5e9' : '#334155', fontWeight: !selectedFilters[filterObj.name] ? 600 : 400, cursor: 'pointer', backgroundColor: !selectedFilters[filterObj.name] ? '#f8fafc' : '#fff' }}
                                                    onClick={() => {
                                                        const newFilters = { ...selectedFilters };
                                                        delete newFilters[filterObj.name];
                                                        setSelectedFilters(newFilters);
                                                        setOpenFilterDropdown(null);
                                                    }}
                                                >
                                                    Tất cả {filterObj.name}
                                                </div>
                                                {filterObj.options.map((option, idx) => (
                                                    <div 
                                                        key={option}
                                                        style={{ padding: '0.6rem 1rem', borderBottom: idx < filterObj.options.length - 1 ? '1px solid #f1f5f9' : 'none', fontSize: '0.85rem', color: selectedFilters[filterObj.name] === option ? '#0ea5e9' : '#334155', fontWeight: selectedFilters[filterObj.name] === option ? 600 : 400, cursor: 'pointer', backgroundColor: selectedFilters[filterObj.name] === option ? '#f8fafc' : '#fff' }}
                                                        onClick={() => {
                                                            setSelectedFilters(prev => ({ ...prev, [filterObj.name]: option }));
                                                            setOpenFilterDropdown(null);
                                                        }}
                                                    >
                                                        {option}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Search and Sort */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
                        <div className="input-group" style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: 0 }}>
                            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input 
                                type="text" 
                                placeholder="Bạn cần tìm gì" 
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                style={{ 
                                    width: '100%', 
                                    padding: '0.6rem 2.5rem', 
                                    borderRadius: '4px', 
                                    border: '1px solid #cbd5e1',
                                    backgroundColor: '#f8fafc',
                                    fontSize: '0.9rem',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Sắp xếp</span>
                            <select 
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{ 
                                    padding: '0.4rem 0.8rem', 
                                    borderRadius: '4px', 
                                    border: '1px solid #cbd5e1', 
                                    outline: 'none', 
                                    fontSize: '0.85rem',
                                    cursor: 'pointer' 
                                }}
                            >
                                <option>Mặc định</option>
                                <option>Giá (Thấp đến Cao)</option>
                                <option>Giá (Cao đến Thấp)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Product Grid Area */}
                <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#e0f2fe', padding: '1.5rem', position: 'relative' }}>
                    {modalProducts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', fontSize: '1.1rem' }}>
                            Không tìm thấy sản phẩm nào phù hợp.
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1rem' }}>
                            {modalProducts.map(p => {
                                let parsedAttr = {};
                                try { if (p.attributes) parsedAttr = JSON.parse(p.attributes); } catch(e) {}
                                const oldPrice = (parsedAttr.originalPrice && parsedAttr.originalPrice > p.price) ? parsedAttr.originalPrice : null;
                                const resolvedImage = parsedAttr.thumbnailUrl || parsedAttr.imageUrl || p.imageUrl || '';
                                const imageSrc = resolvedImage ? (resolvedImage.startsWith('http') ? resolvedImage : `${API_URL}${resolvedImage}`) : 'https://via.placeholder.com/180?text=No+Image';
                                
                                return (
                                <div key={p.id} style={{ backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ height: '180px', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                                        <img src={imageSrc} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/180?text=No+Image'; }} />
                                    </div>
                                    <div style={{ padding: '0.75rem 1rem 1rem 1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
                                            {p.name}
                                        </div>
                                        <div style={{ minHeight: '16px', marginBottom: '0.1rem' }}>
                                            {oldPrice && (
                                                <span style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                                                    {oldPrice.toLocaleString('vi-VN')}đ
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ef4444', marginBottom: '1rem' }}>
                                            {p.price.toLocaleString('vi-VN')}đ
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                            <a href={`/product/${p.id}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
                                                Xem chi tiết
                                            </a>
                                            <button 
                                                style={{ 
                                                    padding: '0.3rem 1.2rem', 
                                                    fontSize: '0.8rem', 
                                                    fontWeight: 600,
                                                    backgroundColor: '#2563eb', 
                                                    color: '#fff', 
                                                    border: 'none', 
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => onSelectProduct(p)}
                                            >
                                                Chọn
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )})}
                        </div>
                    )}

                    {/* Show More Button */}
                    {modalProducts.length > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                            <button style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                backgroundColor: '#fef2f2',
                                color: '#ef4444',
                                border: '1px solid #fca5a5',
                                padding: '0.5rem 1.5rem',
                                borderRadius: '4px',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}>
                                <span style={{ transform: 'scaleY(0.7)', fontSize: '1rem', fontWeight: 800 }}>✓</span> Hiển thị thêm sản phẩm
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComponentPickerModal;
