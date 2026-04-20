import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { ChevronDown, Filter, ChevronUp, X } from 'lucide-react';

const GenericCategory = () => {
    const { alias } = useParams();
    const [searchParams] = useSearchParams();
    
    // Retrieve title and search parameters from URL or fallback to alias
    const displayTitle = searchParams.get('title') || alias.replace(/-/g, ' ').toUpperCase();
    const searchKey = (searchParams.get('search') || displayTitle).toLowerCase();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilterDropdown, setActiveFilterDropdown] = useState(null);

    // Filter States
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(100000000);
    const [inStock, setInStock] = useState(false);

    const toggleSelection = (list, setList, item) => {
        if (list.includes(item)) setList(list.filter(i => i !== item));
        else setList([...list, item]);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await api.get('/products');
                const allProds = res.data;
                const filtered = allProds.filter(p => {
                    const nameLower = p.name.toLowerCase();
                    const descLower = p.description ? p.description.toLowerCase() : '';
                    if (searchKey === 'tất cả' || alias === 'all') return true;
                    
                    // Specific complex matching logic can go here. For now, substring match.
                    return nameLower.includes(searchKey) || descLower.includes(searchKey);
                });

                if (filtered.length === 0) {
                    // Fallback to mock data to show the UI
                    setProducts(allProds.slice(0, 8));
                } else {
                    setProducts(filtered);
                }
            } catch (err) {
                console.error("Failed to load products", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [alias, searchKey]);

    const filters = [
        { label: 'Tình trạng sản phẩm' },
        { label: 'Khoảng giá' },
        { label: 'Hãng' },
    ];

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '4rem' }}>Đang tải dữ liệu {displayTitle}...</div>;
    }

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '4rem' }}>
            {/* Breadcrumb Area */}
            <div style={{ backgroundColor: 'white', padding: '0.75rem 0', borderBottom: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                <div className="container" style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    <Link to="/" style={{ color: '#0ea5e9', textDecoration: 'none' }}>Trang chủ</Link> /
                    <span style={{ color: '#334155', marginLeft: '0.5rem', fontWeight: 600 }}>{displayTitle}</span>
                </div>
            </div>

            <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Filter Header Box */}
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                            <div 
                                onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'All' ? null : 'All')}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '0.9rem', fontWeight: 600, color: '#334155', cursor: 'pointer', backgroundColor: activeFilterDropdown === 'All' ? '#e2e8f0' : 'white' }}
                            >
                                <Filter size={16} /> Lọc nâng cao
                            </div>

                            {/* Dropdown 1: Tình trạng */}
                            <div style={{ position: 'relative' }}>
                                <div 
                                    onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'Status' ? null : 'Status')}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '0.9rem', color: '#334155', cursor: 'pointer', backgroundColor: activeFilterDropdown === 'Status' ? '#e2e8f0' : '#f8fafc' }}
                                >
                                    Tình trạng <ChevronDown size={14} />
                                </div>
                                {activeFilterDropdown === 'Status' && (
                                    <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '0.5rem', backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0', zIndex: 100, minWidth: '200px' }}>
                                        <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>Tình trạng sản phẩm</div>
                                        <button 
                                            onClick={() => setInStock(!inStock)}
                                            style={{ 
                                                padding: '0.5rem 1.5rem', backgroundColor: 'white', 
                                                border: `1px solid ${inStock ? '#ef4444' : '#cbd5e1'}`, 
                                                borderRadius: '4px', fontWeight: inStock ? 600 : 500, 
                                                color: inStock ? '#ef4444' : '#334155', 
                                                cursor: 'pointer', transition: 'all 0.2s', width: '100%'
                                            }}
                                        >
                                            Sẵn hàng
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Dropdown 2: Khoảng giá */}
                            <div style={{ position: 'relative' }}>
                                <div 
                                    onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'Price' ? null : 'Price')}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '0.9rem', color: '#334155', cursor: 'pointer', backgroundColor: activeFilterDropdown === 'Price' ? '#e2e8f0' : '#f8fafc' }}
                                >
                                    Khoảng giá <ChevronDown size={14} />
                                </div>
                                {activeFilterDropdown === 'Price' && (
                                    <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '0.5rem', backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0', zIndex: 100, minWidth: '300px' }}>
                                        <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>Khoảng giá</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                            <input 
                                                type="text" value={`${minPrice.toLocaleString('vi-VN')}đ`} readOnly
                                                style={{ width: '100px', padding: '0.4rem', border: '1px solid #e2e8f0', borderRadius: '4px', textAlign: 'center', fontSize: '0.85rem', outline: 'none', backgroundColor: '#f8fafc' }} 
                                            />
                                            <span style={{ borderTop: '1px solid #94a3b8', width: '20px' }}></span>
                                            <input 
                                                type="text" value={`${maxPrice.toLocaleString('vi-VN')}đ`} readOnly
                                                style={{ width: '100px', padding: '0.4rem', border: '1px solid #e2e8f0', borderRadius: '4px', textAlign: 'center', fontSize: '0.85rem', outline: 'none', backgroundColor: '#f8fafc' }} 
                                            />
                                        </div>
                                        <div style={{ position: 'relative', width: '230px', height: '20px' }}>
                                            <div style={{ position: 'absolute', top: '8px', left: 0, right: 0, height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px' }} />
                                            <div style={{ 
                                                position: 'absolute', top: '8px', left: `${(minPrice / 100000000) * 100}%`, right: `${100 - (maxPrice / 100000000) * 100}%`, 
                                                height: '4px', backgroundColor: '#16a34a', borderRadius: '2px' 
                                            }} />
                                            <input type="range" min="0" max="100000000" step="500000" value={minPrice} onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice))} style={{ position: 'absolute', top: 0, left: 0, width: '100%', margin: 0, pointerEvents: 'none', appearance: 'none', background: 'transparent' }} className="custom-range" />
                                            <input type="range" min="0" max="100000000" step="500000" value={maxPrice} onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice))} style={{ position: 'absolute', top: 0, left: 0, width: '100%', margin: 0, pointerEvents: 'none', appearance: 'none', background: 'transparent' }} className="custom-range" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Dropdown 3: Hãng */}
                            <div style={{ position: 'relative' }}>
                                <div 
                                    onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'Brand' ? null : 'Brand')}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '0.9rem', color: '#334155', cursor: 'pointer', backgroundColor: activeFilterDropdown === 'Brand' ? '#e2e8f0' : '#f8fafc' }}
                                >
                                    Hãng sản xuất <ChevronDown size={14} />
                                </div>
                                {activeFilterDropdown === 'Brand' && (
                                    <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '0.5rem', backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0', zIndex: 100, minWidth: '250px' }}>
                                        <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>Hãng phổ biến</div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                            {['Asus', 'GIGABYTE', 'MSI', 'Intel', 'AMD', 'Corsair', 'Kingston'].map(brand => {
                                                const isSelected = selectedBrands.includes(brand);
                                                return (
                                                    <button 
                                                        key={brand} 
                                                        onClick={() => toggleSelection(selectedBrands, setSelectedBrands, brand)}
                                                        style={{ 
                                                            padding: '0.4rem 0.5rem', backgroundColor: 'white', 
                                                            border: `1px solid ${isSelected ? '#ef4444' : '#cbd5e1'}`, 
                                                            borderRadius: '4px', fontSize: '0.85rem', 
                                                            color: isSelected ? '#ef4444' : '#334155', 
                                                            fontWeight: isSelected ? 600 : 400,
                                                            cursor: 'pointer', transition: 'all 0.2s', width: '100%', textAlign: 'center'
                                                        }}
                                                    >
                                                        {brand}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', textTransform: 'uppercase' }}>
                            {displayTitle}
                        </h1>
                    </div>

                    {/* All Filters Giant Dropdown for 'Lọc Nâng Cao' */}
                    {activeFilterDropdown === 'All' && (
                        <div style={{ 
                            position: 'relative', marginTop: '1rem', 
                            backgroundColor: '#f8fafc', padding: '2rem', borderRadius: '8px', 
                            border: '1px dashed #cbd5e1' 
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                                <button onClick={() => setActiveFilterDropdown(null)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, color: '#334155' }}>
                                    <X size={16} /> Thu gọn bộ lọc
                                </button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 1fr) minmax(250px, 1.5fr) 2fr', gap: '2rem' }}>
                                <div>
                                    <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>Tình trạng sản phẩm</div>
                                    <button 
                                        onClick={() => setInStock(!inStock)}
                                        style={{ 
                                            padding: '0.5rem 1.5rem', backgroundColor: 'white', 
                                            border: `1px solid ${inStock ? '#ef4444' : '#cbd5e1'}`, 
                                            borderRadius: '4px', fontWeight: inStock ? 600 : 500, 
                                            color: inStock ? '#ef4444' : '#334155', cursor: 'pointer' 
                                        }}
                                    > Sẵn hàng </button>
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>Khoảng giá</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <input type="text" value={`${minPrice.toLocaleString('vi-VN')}đ`} readOnly style={{ width: '100px', padding: '0.4rem', border: '1px solid #e2e8f0', borderRadius: '4px', textAlign: 'center', fontSize: '0.85rem' }} />
                                        <span style={{ borderTop: '1px solid #94a3b8', width: '20px' }}></span>
                                        <input type="text" value={`${maxPrice.toLocaleString('vi-VN')}đ`} readOnly style={{ width: '100px', padding: '0.4rem', border: '1px solid #e2e8f0', borderRadius: '4px', textAlign: 'center', fontSize: '0.85rem' }} />
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>Hãng sản xuất</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {['Asus', 'GIGABYTE', 'MSI', 'Intel', 'AMD', 'Corsair', 'Kingston'].map(brand => {
                                            const isSelected = selectedBrands.includes(brand);
                                            return (
                                                <button key={brand} onClick={() => toggleSelection(selectedBrands, setSelectedBrands, brand)} style={{ padding: '0.4rem 0.8rem', backgroundColor: 'white', border: `1px solid ${isSelected ? '#ef4444' : '#cbd5e1'}`, borderRadius: '4px', fontSize: '0.85rem', color: isSelected ? '#ef4444' : '#334155', fontWeight: isSelected ? 600 : 400, cursor: 'pointer' }}>
                                                    {brand}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sort Header */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#334155' }}>
                        Sắp xếp theo:
                        <select style={{ padding: '0.4rem', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', backgroundColor: 'white', fontWeight: 600 }}>
                            <option>Nổi bật</option>
                            <option>Giá tăng dần</option>
                            <option>Giá giảm dần</option>
                        </select>
                    </div>
                </div>

                {/* Product Grid */}
                {products.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1rem' }}>
                        {products.map((p, i) => (
                            <div key={i} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '4px', transition: 'box-shadow 0.2s', ':hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } }}>
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        Không có sản phẩm nào cho mục này.
                    </div>
                )}

                {/* Load More Button */}
                {products.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                        <button style={{
                            border: '1px solid #0ea5e9', color: '#0ea5e9', backgroundColor: 'white',
                            padding: '0.6rem 3rem', borderRadius: '4px', fontWeight: 600, cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                            onMouseEnter={(e) => { e.target.style.backgroundColor = '#0ea5e9'; e.target.style.color = 'white'; }}
                            onMouseLeave={(e) => { e.target.style.backgroundColor = 'white'; e.target.style.color = '#0ea5e9'; }}
                        >
                            Xem thêm sản phẩm {displayTitle}
                        </button>
                    </div>
                )}
            </div>
            
            <style>{`
                .custom-range::-webkit-slider-thumb {
                    pointer-events: auto;
                    appearance: none;
                    width: 14px;
                    height: 14px;
                    background-color: #16a34a;
                    border-radius: 50%;
                    cursor: pointer;
                    position: relative;
                    top: -2px;
                }
                .product-card-hover:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
            `}</style>
        </div>
    );
};

export default GenericCategory;
