import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import CategoryBlock from '../components/CategoryBlock';
import api from '../services/api';

// Image Assets
import imgMayBan from '../assets/Images/HomePage/Mayban.png';
import imgMonitor from '../assets/Images/HomePage/Monitor.png';
import imgVGA from '../assets/Images/HomePage/VGA.png';
import imgCPU from '../assets/Images/HomePage/CPU.jpg';
import imgRAM from '../assets/Images/HomePage/RAM.png';

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
                                    <div key={product.id} style={{ minWidth: '190px', flex: '0 0 190px', scrollSnapAlign: 'start' }}>
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
                bannerImage={imgMayBan} 
                products={products} 
            />
            
            <CategoryBlock 
                title="Màn hình Gaming" 
                categoryLink="/products?category=monitor" 
                bannerImage={imgMonitor} 
                products={products} 
            />

            <CategoryBlock 
                title="Card đồ hoạ" 
                categoryLink="/products?category=vga" 
                bannerImage={imgVGA} 
                products={products} 
            />

            <CategoryBlock 
                title="CPU" 
                categoryLink="/products?category=cpu" 
                bannerImage={imgCPU} 
                products={products} 
            />

            <CategoryBlock 
                title="RAM" 
                categoryLink="/products?category=ram" 
                bannerImage={imgRAM} 
                products={products} 
            />

            {/* Brand Logos Row */}
            <section className="container" style={{ marginTop: '4rem', marginBottom: '1rem' }}>
                <div style={{ 
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    padding: '1rem', backgroundColor: 'transparent'
                }}>
                    <img 
                        src="/brands_banner.png" 
                        alt="Đội ngũ đối tác các hãng" 
                        style={{ width: '100%', maxWidth: '1200px', objectFit: 'contain', mixBlendMode: 'multiply' }}
                    />
                </div>
            </section>
        </div>
    );
};

export default Home;
