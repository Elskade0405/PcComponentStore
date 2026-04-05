import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import CategoryBlock from '../components/CategoryBlock';
import api from '../services/api';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                // Backend returns sorted by CreatedAt DESC. Limit to 8 for sliders.
                setProducts(res.data.slice(0, 8));
            } catch (err) {
                console.error("Failed to load products", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '4rem', backgroundColor: '#f3f4f6' }}>
            
            {/* Hero Banner Section */}
            <section style={{ backgroundColor: 'white', borderBottom: '1px solid var(--border-color)' }}>
                <div className="container" style={{ padding: '0 0' }}>
                    <img 
                        src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop" 
                        alt="Hero Banner MSI" 
                        style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'cover', display: 'block' }}
                    />
                </div>
            </section>

            {/* New Products Container (No side banner) */}
            <section className="container" style={{ marginTop: '2rem' }}>
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--border-radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>Sản phẩm mới</h2>
                        <Link to="/products" className="text-blue" style={{ fontSize: '0.9rem', textDecoration: 'underline' }}>Xem thêm</Link>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <div style={{
                            position: 'absolute', left: '-1rem', top: '50%', transform: 'translateY(-50%)',
                            width: '32px', height: '32px', backgroundColor: '#e5e7eb', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10
                        }}>
                            <ChevronLeft size={20} color="var(--text-secondary)" />
                        </div>

                        <div style={{ 
                            display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem',
                            scrollSnapType: 'x mandatory'
                        }} className="no-scrollbar">
                            {loading ? (
                                <p style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>Đang tải dữ liệu...</p>
                            ) : products.length > 0 ? (
                                products.map(product => (
                                    <div key={product.id} style={{ minWidth: '220px', flex: '0 0 220px', scrollSnapAlign: 'start' }}>
                                        <ProductCard product={product} />
                                    </div>
                                ))
                            ) : (
                                <p style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>Chưa có sản phẩm nào.</p>
                            )}
                        </div>

                        <div style={{
                            position: 'absolute', right: '-1rem', top: '50%', transform: 'translateY(-50%)',
                            width: '32px', height: '32px', backgroundColor: '#e5e7eb', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10
                        }}>
                            <ChevronRight size={20} color="var(--text-secondary)" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Reusable Category Blocks */}
            <CategoryBlock 
                title="Máy bàn" 
                categoryLink="/products?category=pc" 
                bannerImage="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&q=80" 
                products={products} 
            />
            
            <CategoryBlock 
                title="Màn hình Gaming" 
                categoryLink="/products?category=monitor" 
                bannerImage="https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=500&q=80" 
                products={products} 
            />

            <CategoryBlock 
                title="Card đồ hoạ" 
                categoryLink="/products?category=vga" 
                bannerImage="https://images.unsplash.com/photo-1601244093863-144f77c3a070?w=500&q=80" 
                products={products} 
            />

            <CategoryBlock 
                title="CPU" 
                categoryLink="/products?category=cpu" 
                bannerImage="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&q=80" 
                products={products} 
            />

            <CategoryBlock 
                title="RAM" 
                categoryLink="/products?category=ram" 
                bannerImage="https://images.unsplash.com/photo-1562976540-1502f75d231b?w=500&q=80" 
                products={products} 
            />

            {/* Brand Logos Row */}
            <section className="container" style={{ marginTop: '4rem', marginBottom: '1rem' }}>
                <div style={{ 
                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '3rem', flexWrap: 'wrap',
                    padding: '2rem', backgroundColor: 'transparent'
                }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#444' }}>ROCCAT</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#e30019', fontStyle: 'italic' }}>msi</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', letterSpacing: '2px' }}>RAZER</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#333' }}>thermaltake</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563eb' }}>ADATA</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e3a8a' }}>HP</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#000' }}>GIGABYTE</span>
                </div>
            </section>
        </div>
    );
};

export default Home;
