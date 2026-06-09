import React from 'react';
import API_URL from '../config';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, onAdd }) => {
    const { addToCart } = useCart();
    const backendUrl = API_URL;
    
    // Parse attributes if they come from the new SQL DB
    let parsedAttributes = null;
    if (product.attributes && typeof product.attributes === 'string') {
        try {
            parsedAttributes = JSON.parse(product.attributes);
        } catch (e) {
            console.error("Failed to parse attributes JSON");
        }
    }

    const resolvedImage = parsedAttributes?.thumbnailUrl || parsedAttributes?.imageUrl || product.imageUrl;
    const imgUrl = resolvedImage
        ? (resolvedImage.startsWith('http') || resolvedImage.startsWith('data:image') ? resolvedImage : `${backendUrl}${resolvedImage}`)
        : 'https://via.placeholder.com/200x200?text=No+Image';

    // Parse the original price from Attributes (fallback to normal price if it's 0 or missing to avoid weird displays)
    const oldPrice = (parsedAttributes?.originalPrice && parsedAttributes.originalPrice > product.price) 
                        ? parsedAttributes.originalPrice 
                        : null;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onAdd) {
            onAdd(product);
        } else {
            addToCart(product, 1);
            alert('Đã thêm vào giỏ hàng!');
        }
    };
    return (
        <div className="card" style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            padding: '0.75rem', /* Reduced padding */
            position: 'relative',
            height: '100%'
        }}>
            {/* New Badge */}
            <div style={{
                position: 'absolute',
                top: '0.75rem',
                left: '0.75rem',
                backgroundColor: 'var(--accent-red)',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                zIndex: 1
            }}>
                MỚI
            </div>

            <Link to={`/product/${product.id}`} style={{ display: 'flex', flexDirection: 'column', flex: 1, textDecoration: 'none', color: 'inherit' }}>
                <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                    <img src={imgUrl} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    {/* Rating - Hardcoded to 5 stars per design */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.25rem' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={12} fill="#f59e0b" color="#f59e0b" />
                        ))}
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginLeft: '4px' }}>Review (3)</span>
                    </div>

                    <h3 style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.3 }}>
                        {product.name}
                    </h3>
                </div>
            </Link>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', marginBottom: '0.5rem' }}>
                    <div style={{ color: '#e30019', fontWeight: 700, fontSize: '1.1rem' }}>
                        {product.price.toLocaleString('vi-VN')} đ
                    </div>
                    {oldPrice && (
                        <div style={{ color: '#9ca3af', textDecoration: 'line-through', fontSize: '0.85rem' }}>
                            {oldPrice.toLocaleString('vi-VN')} đ
                        </div>
                    )}
                </div>

                <div style={{ minHeight: '1.5rem', marginBottom: '0.5rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {parsedAttributes?.socket && (
                        <span style={{ backgroundColor: '#f3f4f6', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', color: '#4b5563', fontWeight: 600 }}>
                            {parsedAttributes.socket}
                        </span>
                    )}
                    {parsedAttributes?.cores && (
                        <span style={{ backgroundColor: '#f3f4f6', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', color: '#4b5563', fontWeight: 600 }}>
                            {parsedAttributes.cores}
                        </span>
                    )}
                    {parsedAttributes?.gpu && (
                        <span style={{ backgroundColor: '#f3f4f6', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', color: '#4b5563', fontWeight: 600 }}>
                            {parsedAttributes.gpu}
                        </span>
                    )}
                    {parsedAttributes?.vram && (
                        <span style={{ backgroundColor: '#f3f4f6', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', color: '#4b5563', fontWeight: 600 }}>
                            {parsedAttributes.vram}
                        </span>
                    )}
                    {parsedAttributes?.type && (
                        <span style={{ backgroundColor: '#f3f4f6', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', color: '#4b5563', fontWeight: 600 }}>
                            {parsedAttributes.type}
                        </span>
                    )}
                    {parsedAttributes?.capacity && (
                        <span style={{ backgroundColor: '#f3f4f6', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', color: '#4b5563', fontWeight: 600 }}>
                            {parsedAttributes.capacity}
                        </span>
                    )}
                    {parsedAttributes?.bus && (
                        <span style={{ backgroundColor: '#f3f4f6', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', color: '#4b5563', fontWeight: 600 }}>
                            {parsedAttributes.bus}
                        </span>
                    )}
                    {parsedAttributes?.chipset && (
                        <span style={{ backgroundColor: '#f3f4f6', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', color: '#4b5563', fontWeight: 600 }}>
                            {parsedAttributes.chipset}
                        </span>
                    )}
                    {parsedAttributes?.formFactor && (
                        <span style={{ backgroundColor: '#f3f4f6', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', color: '#4b5563', fontWeight: 600 }}>
                            {parsedAttributes.formFactor}
                        </span>
                    )}
                    {parsedAttributes?.wattage && (
                        <span style={{ backgroundColor: '#f3f4f6', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', color: '#4b5563', fontWeight: 600 }}>
                            {parsedAttributes.wattage}
                        </span>
                    )}
                    {parsedAttributes?.efficiency && (
                        <span style={{ backgroundColor: '#f3f4f6', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', color: '#4b5563', fontWeight: 600 }}>
                            {parsedAttributes.efficiency}
                        </span>
                    )}
                    {parsedAttributes?.resolution && (
                        <span style={{ backgroundColor: '#f3f4f6', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', color: '#4b5563', fontWeight: 600 }}>
                            {parsedAttributes.resolution}
                        </span>
                    )}
                    {parsedAttributes?.refreshRate && (
                        <span style={{ backgroundColor: '#f3f4f6', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', color: '#4b5563', fontWeight: 600 }}>
                            {parsedAttributes.refreshRate}
                        </span>
                    )}
                    {parsedAttributes?.panel && (
                        <span style={{ backgroundColor: '#f3f4f6', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', color: '#4b5563', fontWeight: 600 }}>
                            Tấm nền {parsedAttributes.panel}
                        </span>
                    )}
                    {/* Laptop attributes */}
                    {parsedAttributes?.category === 'laptop' && (
                        <>
                            {parsedAttributes?.cpu && (
                                <span style={{ backgroundColor: '#e0f2fe', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', color: '#0369a1', fontWeight: 600 }}>
                                    {parsedAttributes.cpu}
                                </span>
                            )}
                            {parsedAttributes?.ram && (
                                <span style={{ backgroundColor: '#dcfce7', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', color: '#15803d', fontWeight: 600 }}>
                                    {parsedAttributes.ram}
                                </span>
                            )}
                            {parsedAttributes?.gpu && (
                                <span style={{ backgroundColor: '#f3e8ff', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', color: '#7e22ce', fontWeight: 600 }}>
                                    {parsedAttributes.gpu}
                                </span>
                            )}
                            {parsedAttributes?.storage && (
                                <span style={{ backgroundColor: '#fef9c3', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', color: '#a16207', fontWeight: 600 }}>
                                    {parsedAttributes.storage}
                                </span>
                            )}
                            {parsedAttributes?.weight && (
                                <span style={{ backgroundColor: '#f3f4f6', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', color: '#4b5563', fontWeight: 600 }}>
                                    {parsedAttributes.weight}
                                </span>
                            )}
                        </>
                    )}
                </div>

                <button
                    className="btn btn-outline"
                    style={{ width: '100%', fontSize: '0.8rem', padding: '0.35rem', zIndex: 2 }}
                    onClick={handleAddToCart}
                    disabled={product.stockQuantity === 0}
                >
                    {product.stockQuantity > 0 ? 'Thêm giỏ hàng' : 'Hết hàng'}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
