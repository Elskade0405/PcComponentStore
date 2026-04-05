import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ShoppingCart, Filter, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [productsRes, categoriesRes] = await Promise.all([
                api.get('/products'),
                api.get('/categories')
            ]);
            setProducts(productsRes.data);
            setCategories(categoriesRes.data);
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
            // Already in cart - theoretically increase quantity later in cart page
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

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'All' || product.categoryId.toString() === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading catalog...</div>;
    }

    return (
        <div className="animate-fade-in container" style={{ padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Components Catalog</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Find everything you need for your next build.</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem', alignItems: 'start' }}>
                {/* Sidebar Filters */}
                <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '2rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                        <Filter size={18} /> Filters
                    </h3>

                    <div className="input-group">
                        <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Search size={14} /> Search
                        </label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="e.g. RTX 4090"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <label className="input-label">Categories</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <button
                                onClick={() => setSelectedCategory('All')}
                                style={{
                                    textAlign: 'left',
                                    padding: '0.5rem 0.75rem',
                                    borderRadius: 'var(--border-radius-sm)',
                                    background: selectedCategory === 'All' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                                    color: selectedCategory === 'All' ? 'var(--accent-primary)' : 'var(--text-primary)',
                                    transition: 'background var(--transition-fast)'
                                }}
                            >
                                All Components
                            </button>
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id.toString())}
                                    style={{
                                        textAlign: 'left',
                                        padding: '0.5rem 0.75rem',
                                        borderRadius: 'var(--border-radius-sm)',
                                        background: selectedCategory === category.id.toString() ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                                        color: selectedCategory === category.id.toString() ? 'var(--accent-primary)' : 'var(--text-primary)',
                                        transition: 'background var(--transition-fast)'
                                    }}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div>
                    {filteredProducts.length === 0 ? (
                        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                            <h3 style={{ color: 'var(--text-secondary)' }}>No products found matching your criteria.</h3>
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
