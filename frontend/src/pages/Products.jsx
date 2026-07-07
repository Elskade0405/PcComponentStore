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

    const filteredProducts = products.filter(product => {
        const catLower = (product.categoryName || '').toLowerCase();
        const matchesCategory = selectedCategory === 'All' || catLower === selectedCategory;

        if (!searchTerm.trim()) return matchesCategory;

        const nameLower = (product.name || '').toLowerCase();
        const query = searchTerm.toLowerCase();
        const matchesSearch = nameLower.includes(query);

        return matchesCategory && matchesSearch;
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
                        <label className="input-label">Danh mục</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
                                Tất cả ({products.length})
                            </button>
                            {categoryList.map(cat => {
                                const count = products.filter(p => (p.categoryName || '').toLowerCase() === cat).length;
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
                                        {cat} ({count})
                                    </button>
                                );
                            })}
                        </div>
                    </div>
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
