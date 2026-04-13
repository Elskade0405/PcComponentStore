import React from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, onAdd }) => {
    const { addToCart } = useCart();
    // Determine image, use placeholder if missing
    const backendUrl = 'http://localhost:5285';
    const imgUrl = product.imageUrl
        ? `${backendUrl}${product.imageUrl}`
        : 'https://via.placeholder.com/200x200?text=No+Image';
    // Fake old price logic for visual effect (10% higher)
    const oldPrice = product.price * 1.1;

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

    // Parse attributes if they come from the new SQL DB
    let parsedAttributes = null;
    if (product.attributes && typeof product.attributes === 'string') {
        try {
            parsedAttributes = JSON.parse(product.attributes);
        } catch (e) {
            console.error("Failed to parse attributes JSON");
        }
    }

    return (
        <div className="card" style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            padding: '0.75rem', /* Reduced padding */
            position: 'relative'
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
                <div style={{ height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>
                    {oldPrice.toLocaleString('vi-VN')}đ
                </span>
                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-red)' }}>
                    {product.price.toLocaleString('vi-VN')}đ
                </span>
            </div>

            {parsedAttributes && (
                <div style={{ marginTop: 'auto', marginBottom: '0.5rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {parsedAttributes.socket && (
                        <span style={{ backgroundColor: '#f3f4f6', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', color: '#4b5563', fontWeight: 600 }}>
                            {parsedAttributes.socket}
                        </span>
                    )}
                    {parsedAttributes.cores && (
                        <span style={{ backgroundColor: '#f3f4f6', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', color: '#4b5563', fontWeight: 600 }}>
                            {parsedAttributes.cores}
                        </span>
                    )}
                </div>
            )}

            <button
                className="btn btn-outline"
                style={{ width: '100%', fontSize: '0.8rem', padding: '0.35rem', zIndex: 2 }}
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
            >
                {product.stockQuantity > 0 ? 'Thêm giỏ hàng' : 'Hết hàng'}
            </button>
        </div>
    );
};

export default ProductCard;
