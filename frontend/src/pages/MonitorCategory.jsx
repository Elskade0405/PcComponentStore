import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { ChevronDown, Filter, ChevronUp, X } from 'lucide-react';

const MonitorCategory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedResolutions, setSelectedResolutions] = useState([]);
    const [selectedRefreshRates, setSelectedRefreshRates] = useState([]);
    const [selectedPanels, setSelectedPanels] = useState([]);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(100000000);

    const toggleSelection = (list, setList, item) => {
        if (list.includes(item)) setList(list.filter(i => i !== item));
        else setList([...list, item]);
    };

    useEffect(() => {
        const fetchMonitorProducts = async () => {
            try {
                const res = await api.get('/products');
                const allProds = res.data;
                const monitors = allProds.filter(p => {
                    let isMonitor = false;
                    try {
                        if (p.attributes) {
                            const attr = JSON.parse(p.attributes);
                            if (attr.category === 'monitor') isMonitor = true;
                        }
                    } catch (e) {}
                    
                    const nameStr = p.name.toLowerCase();
                    const isNameMonitor = nameStr.includes('màn hình') && !nameStr.includes('card') && !nameStr.includes('vga');
                    
                    return isMonitor || isNameMonitor || p.categoryName === 'monitor';
                });

                setProducts(monitors);
            } catch (err) {
                console.error("Failed to load Monitor products", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMonitorProducts();
    }, []);

    const filters = [
        { label: 'Tình trạng sản phẩm' },
        { label: 'Khoảng giá' },
        { label: 'Hãng' },
        { label: 'Độ phân giải' },
        { label: 'Tần số quét' },
        { label: 'Tấm nền' }
    ];

    const displayProducts = products.filter(p => {
        if (p.price < minPrice || p.price > maxPrice) return false;
        
        let attr = {};
        try { if (p.attributes) attr = JSON.parse(p.attributes); } catch(e){}

        if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand || attr.brand)) return false;
        if (selectedResolutions.length > 0 && !selectedResolutions.includes(attr.resolution)) return false;
        if (selectedRefreshRates.length > 0 && !selectedRefreshRates.includes(attr.refreshRate)) return false;
        if (selectedPanels.length > 0 && !selectedPanels.includes(attr.panel)) return false;

        return true;
    });

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '4rem' }}>Đang tải dữ liệu màn hình...</div>;
    }

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '4rem' }}>
            <div style={{ backgroundColor: 'white', padding: '0.75rem 0', borderBottom: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                <div className="container" style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    <Link to="/" style={{ color: '#0ea5e9', textDecoration: 'none' }}>Trang chủ</Link> /
                    <span style={{ color: '#334155', marginLeft: '0.5rem', fontWeight: 600 }}>Màn hình máy tính</span>
                </div>
            </div>

            <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', position: 'relative' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                        <div 
                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '0.9rem', fontWeight: 600, color: '#334155', cursor: 'pointer', backgroundColor: showFilterMenu ? '#f1f5f9' : 'white' }}
                        >
                            <Filter size={16} /> Bộ lọc
                        </div>

                        {filters.map((f, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '0.9rem', color: '#334155', cursor: 'pointer', backgroundColor: '#f8fafc' }}>
                                {f.label} <ChevronDown size={14} />
                            </div>
                        ))}
                    </div>

                    {showFilterMenu && (
                        <div style={{ 
                            position: 'absolute', top: '100%', left: 0, right: 0, 
                            backgroundColor: 'white', zIndex: 10, padding: '2rem', 
                            border: '1px solid #e2e8f0', borderTop: 'none', 
                            borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                                
                                <div>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>Thương hiệu</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {['ASUS', 'DELL', 'LG', 'GIGABYTE', 'SAMSUNG'].map(brand => (
                                            <label key={brand} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                                                <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleSelection(selectedBrands, setSelectedBrands, brand)} />
                                                {brand}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>Độ phân giải</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {['Full HD (1080p)', '2K (1440p)', '4K (2160p)'].map(res => (
                                            <label key={res} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                                                <input type="checkbox" checked={selectedResolutions.includes(res)} onChange={() => toggleSelection(selectedResolutions, setSelectedResolutions, res)} />
                                                {res}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>Tần số quét</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {['60Hz - 75Hz', '144Hz - 165Hz', '240Hz+'].map(hz => (
                                            <label key={hz} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                                                <input type="checkbox" checked={selectedRefreshRates.includes(hz)} onChange={() => toggleSelection(selectedRefreshRates, setSelectedRefreshRates, hz)} />
                                                {hz}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>Tấm nền</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {['IPS', 'VA', 'OLED', 'TN'].map(panel => (
                                            <label key={panel} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                                                <input type="checkbox" checked={selectedPanels.includes(panel)} onChange={() => toggleSelection(selectedPanels, setSelectedPanels, panel)} />
                                                {panel}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                            </div>

                            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button className="btn btn-outline" onClick={() => {
                                    setSelectedBrands([]); setSelectedResolutions([]); setSelectedRefreshRates([]); setSelectedPanels([]);
                                }}>Bỏ chọn tất cả</button>
                                <button className="btn btn-primary" onClick={() => setShowFilterMenu(false)}>Áp dụng bộ lọc</button>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                    {displayProducts.map(p => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                    {displayProducts.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', backgroundColor: 'white', borderRadius: '8px' }}>
                            Không tìm thấy màn hình nào phù hợp với tiêu chí lọc.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MonitorCategory;
