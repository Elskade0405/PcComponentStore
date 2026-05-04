import React, { useState, useEffect, useRef } from 'react';
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
    const sliderRef = useRef(null);

    const scrollLeft = () => {
        if (sliderRef.current) sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    };
    const scrollRight = () => {
        if (sliderRef.current) sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                // Store all products for category blocks
                setProducts(res.data);
            } catch (err) {
                console.error("Failed to load products", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <>
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
                            <div onClick={scrollLeft} style={{
                                position: 'absolute', left: '-1rem', top: '50%', transform: 'translateY(-50%)',
                                width: '32px', height: '32px', backgroundColor: '#e5e7eb', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10
                            }}>
                                <ChevronLeft size={20} color="var(--text-secondary)" />
                            </div>

                            <div ref={sliderRef} style={{
                                display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem',
                                scrollSnapType: 'x mandatory'
                            }} className="no-scrollbar">
                                {loading ? (
                                    <p style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>Đang tải dữ liệu...</p>
                                ) : products.length > 0 ? (
                                    products.slice(0, 8).map(product => (
                                        <div key={product.id} style={{ minWidth: '190px', flex: '0 0 190px', scrollSnapAlign: 'start' }}>
                                            <ProductCard product={product} />
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>Chưa có sản phẩm nào.</p>
                                )}
                            </div>

                            <div onClick={scrollRight} style={{
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
                    products={products.filter(p => p.categoryName === 'pc')}
                />

                <CategoryBlock
                    title="Màn hình Gaming"
                    categoryLink="/products?category=monitor"
                    bannerImage={imgMonitor}
                    products={products.filter(p => p.categoryName === 'monitor')}
                />

                <CategoryBlock
                    title="Card đồ hoạ"
                    categoryLink="/products?category=vga"
                    bannerImage={imgVGA}
                    products={products.filter(p => p.categoryName === 'vga')}
                />

                <CategoryBlock
                    title="CPU"
                    categoryLink="/products?category=cpu"
                    bannerImage={imgCPU}
                    products={products.filter(p => p.categoryName === 'cpu')}
                />

                <CategoryBlock
                    title="RAM"
                    categoryLink="/products?category=ram"
                    bannerImage={imgRAM}
                    products={products.filter(p => p.categoryName === 'ram')}
                />

                <CategoryBlock
                    title="Bo mạch chủ (Mainboard)"
                    categoryLink="/products?category=mainboard"
                    bannerImage={imgCPU}
                    products={products.filter(p => p.categoryName === 'mainboard')}
                />

                <CategoryBlock
                    title="Ổ cứng (SSD/HDD)"
                    categoryLink="/products?category=storage"
                    bannerImage={imgRAM}
                    products={products.filter(p => p.categoryName === 'storage')}
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

            {/* Left and Right Floating Banners (Hidden on small screens) */}
            <div className="side-banner side-banner-left" style={{
                position: 'fixed', top: '100px', right: 'calc(50% + 610px)', zIndex: 40, display: 'none'
            }}>
                <a href="#chuyen-muc-khuyen-mai">
                    <img
                        src="/pull-up-banner-1__1_.png"
                        alt="Left Promo"
                        style={{ width: '180px', height: '600px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                    />
                </a>
            </div>

            <div className="side-banner side-banner-right" style={{
                position: 'fixed', top: '100px', left: 'calc(50% + 610px)', zIndex: 40, display: 'none'
            }}>
                <a href="#giai-dau-esport">
                    <img
                        src="/pull-up-banner-2.png"
                        alt="Right Promo"
                        style={{ width: '180px', height: '600px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                    />
                </a>
            </div>

            <style>{`
                @media (min-width: 1400px) {
                    .side-banner {
                        display: block !important;
                    }
                }
            `}</style>
        </>
    );
};

export default Home;
