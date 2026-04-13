import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const CategoryBlock = ({ title, bannerImage, categoryLink, products }) => {
    return (
        <section className="container" style={{ marginTop: '2.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexDirection: 'row', minHeight: '310px' }}>
                {/* Left Banner */}
                <div style={{ 
                    width: '240px', 
                    minWidth: '240px',
                    backgroundColor: '#111', 
                    color: 'white',
                    borderRadius: 'var(--border-radius-md)', 
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '1.5rem'
                }}>
                    <img 
                        src={bannerImage} 
                        alt={title} 
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} 
                    />
                    <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', textTransform: 'uppercase' }}>{title}</h2>
                        <Link to={categoryLink} style={{ fontSize: '0.9rem', textDecoration: 'underline' }}>Xem tất cả</Link>
                    </div>
                    {/* Floating Right Mock Arrow on the banner */}
                    <div style={{
                        position: 'absolute', right: '-16px', top: '50%', transform: 'translateY(-50%)',
                        width: '32px', height: '32px', backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
                    }}>
                        <ChevronRight size={18} color="var(--text-secondary)" />
                    </div>
                </div>

                {/* Product Grid inside Category Block */}
                <div style={{ 
                    flex: 1, 
                    backgroundColor: 'white', 
                    padding: '1.5rem', 
                    borderRadius: 'var(--border-radius-md)', 
                    boxShadow: 'var(--shadow-sm)',
                    position: 'relative',
                    maxWidth: 'calc(100% - 316px)' /* Account for banner gap */ 
                }}>
                    <div style={{ 
                        display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem', height: '100%',
                        scrollSnapType: 'x mandatory'
                    }} className="no-scrollbar">
                        {products && products.length > 0 ? (
                            products.map(product => (
                                <div key={product.id} style={{ minWidth: '190px', flex: '0 0 190px', scrollSnapAlign: 'start' }}>
                                    <ProductCard product={product} />
                                </div>
                            ))
                        ) : (
                            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', color: 'var(--text-secondary)' }}>
                                Chưa có sản phẩm
                            </p>
                        )}
                    </div>
                    
                    {/* Mock Right Scroll Arrow */}
                    <div style={{
                        position: 'absolute', right: '-16px', top: '50%', transform: 'translateY(-50%)',
                        width: '32px', height: '32px', backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10
                    }}>
                        <ChevronRight size={18} color="var(--text-secondary)" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategoryBlock;
