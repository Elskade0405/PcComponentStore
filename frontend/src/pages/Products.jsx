import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { ShoppingCart, Filter, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const urlSearch = searchParams.get('search') || '';
    const [searchTerm, setSearchTerm] = useState(urlSearch);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState('all');
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [inStockOnly, setInStockOnly] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const q = searchParams.get('search') || '';
        setSearchTerm(q);
    }, [searchParams]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const productsRes = await api.get('/products');
            setProducts(productsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product) => {
        if (!user) {
            navigate('/login');
            return;
        }

        const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItemIndex = currentCart.findIndex(item => item.productId === product.id);

        if (existingItemIndex > -1) {
            alert('Added to cart!');
        } else {
            currentCart.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                quantity: 1,
                maxStock: product.stockQuantity
            });
            localStorage.setItem('cart', JSON.stringify(currentCart));
            alert('Added to cart!');
        }
    };

    const categoryList = [...new Set(products.map(p => (p.categoryName || '').toLowerCase()).filter(Boolean))];
    const brandList = [...new Set(products.map(p => p.brand).filter(Boolean))].sort();

    const handleBrandToggle = (brand) => {
        setSelectedBrands(prev => 
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('All');
        setPriceRange('all');
        setSelectedBrands([]);
        setInStockOnly(false);
    };

    const filteredProducts = products.filter(product => {
        const catLower = (product.categoryName || '').toLowerCase();
        const matchesCategory = selectedCategory === 'All' || catLower === selectedCategory;

        const nameLower = (product.name || '').toLowerCase();
        const query = searchTerm.toLowerCase();
        const matchesSearch = !searchTerm.trim() || nameLower.includes(query);

        const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
        const matchesStock = !inStockOnly || (product.stockQuantity > 0);

        let matchesPrice = true;
        if (priceRange !== 'all') {
            const price = product.price || 0;
            if (priceRange === 'under2') matchesPrice = price < 2000000;
            else if (priceRange === '2to5') matchesPrice = price >= 2000000 && price <= 5000000;
            else if (priceRange === '5to10') matchesPrice = price >= 5000000 && price <= 10000000;
            else if (priceRange === '10to20') matchesPrice = price >= 10000000 && price <= 20000000;
            else if (priceRange === 'over20') matchesPrice = price > 20000000;
        }

        return matchesCategory && matchesSearch && matchesBrand && matchesStock && matchesPrice;
    });

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading catalog...</div>;
    }

    return (
        <div className="animate-fade-in container" style={{ padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        {searchTerm ? `Kết quả tìm kiếm: "${searchTerm}"` : 'Tất cả sản phẩm'}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {filteredProducts.length} sản phẩm được tìm thấy
                    </p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem', alignItems: 'start' }}>
                
                <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '2rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                        <Filter size={18} /> Bộ lọc
                    </h3>

                    <div className="input-group">
                        <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Search size={14} /> Tìm kiếm
                        </label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="VD: RTX 4090, Intel i7..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label className="input-label" style={{ margin: 0 }}>Danh mục</label>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                            <button
                                onClick={() => setSelectedCategory('All')}
                                style={{
                                    textAlign: 'left',
                                    padding: '0.5rem 0.75rem',
                                    borderRadius: 'var(--border-radius-sm)',
                                    background: selectedCategory === 'All' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                                    color: selectedCategory === 'All' ? 'var(--accent-primary)' : 'var(--text-primary)',
                                    transition: 'background var(--transition-fast)',
                                    border: 'none', cursor: 'pointer', fontSize: '0.9rem'
                                }}
                            >
                                Tất cả
                            </button>
                            {categoryList.map(cat => {
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        style={{
                                            textAlign: 'left',
                                            padding: '0.5rem 0.75rem',
                                            borderRadius: 'var(--border-radius-sm)',
                                            background: selectedCategory === cat ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                                            color: selectedCategory === cat ? 'var(--accent-primary)' : 'var(--text-primary)',
                                            transition: 'background var(--transition-fast)',
                                            border: 'none', cursor: 'pointer', fontSize: '0.9rem',
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Price Range Filter */}
                    <div style={{ marginTop: '2rem' }}>
                        <label className="input-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Khoảng giá</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[
                                { id: 'all', label: 'Tất cả mức giá' },
                                { id: 'under2', label: 'Dưới 2 triệu' },
                                { id: '2to5', label: 'Từ 2 - 5 triệu' },
                                { id: '5to10', label: 'Từ 5 - 10 triệu' },
                                { id: '10to20', label: 'Từ 10 - 20 triệu' },
                                { id: 'over20', label: 'Trên 20 triệu' }
                            ].map(range => (
                                <label key={range.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                    <input 
                                        type="radio" 
                                        name="priceRange" 
                                        checked={priceRange === range.id}
                                        onChange={() => setPriceRange(range.id)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    {range.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Brand Filter */}
                    {brandList.length > 0 && (
                        <div style={{ marginTop: '2rem' }}>
                            <label className="input-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Thương hiệu</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '200px', overflowY: 'auto' }}>
                                {brandList.map(brand => (
                                    <label key={brand} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedBrands.includes(brand)}
                                            onChange={() => handleBrandToggle(brand)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                        {brand}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Availability Filter */}
                    <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            <input 
                                type="checkbox" 
                                checked={inStockOnly}
                                onChange={(e) => setInStockOnly(e.target.checked)}
                                style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                            />
                            Chỉ hiện sản phẩm còn hàng
                        </label>
                    </div>

                    <button 
                        onClick={handleClearFilters}
                        style={{ width: '100%', marginTop: '2rem', padding: '0.75rem', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '4px', color: '#475569', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#e2e8f0'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                    >
                        Xóa tất cả bộ lọc
                    </button>
                </div>

                
                <div>
                    {filteredProducts.length === 0 ? (
                        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                            <h3 style={{ color: 'var(--text-secondary)' }}>Không tìm thấy sản phẩm phù hợp.</h3>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '1.5rem'
                        }}>
                            {filteredProducts.map(product => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    onAdd={addToCart} 
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;
