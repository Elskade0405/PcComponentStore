import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = () => {
        const items = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(items);
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;

        const updatedCart = cartItems.map(item => {
            if (item.productId === productId) {
                return { ...item, quantity: Math.min(newQuantity, item.maxStock) };
            }
            return item;
        });

        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const removeItem = (productId) => {
        const updatedCart = cartItems.filter(item => item.productId !== productId);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (cartItems.length === 0) return;

        try {
            setLoading(true);
            const orderData = {
                items: cartItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity
                }))
            };

            await api.post('/orders', orderData);

            // Clear cart
            localStorage.removeItem('cart');
            setCartItems([]);
            alert('Order placed successfully!');
            navigate('/');
        } catch (error) {
            console.error('Checkout failed:', error);
            alert(error.response?.data || 'Checkout failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="animate-fade-in" style={{ textAlign: 'center', padding: '6rem 2rem' }}>
                <div style={{
                    width: '80px', height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.5rem auto',
                    color: 'var(--text-secondary)'
                }}>
                    <ShoppingBag size={40} />
                </div>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your cart is empty</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Looks like you haven't added any components to your build yet.</p>
                <Link to="/products" className="btn btn-primary">
                    Browse Catalog
                </Link>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Shopping Cart</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
                {/* Cart Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {cartItems.map(item => (
                        <div key={item.productId} className="glass-panel" style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', gap: '1.5rem' }}>
                            <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 'var(--border-radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.name} style={{ maxHeight: '100%', objectFit: 'contain' }} />
                                ) : (
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>No Img</span>
                                )}
                            </div>

                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{item.name}</h3>
                                <div style={{ color: 'var(--success)', fontWeight: 600 }}>${item.price.toFixed(2)}</div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 'var(--border-radius-sm)', overflow: 'hidden' }}>
                                    <button
                                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                        style={{ padding: '0.5rem 0.75rem', color: 'var(--text-primary)' }}
                                        disabled={item.quantity <= 1}
                                    >-</button>
                                    <span style={{ padding: '0 0.5rem', minWidth: '2rem', textAlign: 'center' }}>{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                        style={{ padding: '0.5rem 0.75rem', color: 'var(--text-primary)' }}
                                        disabled={item.quantity >= item.maxStock}
                                    >+</button>
                                </div>

                                <div style={{ fontWeight: 600, minWidth: '80px', textAlign: 'right' }}>
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>

                                <button
                                    onClick={() => removeItem(item.productId)}
                                    className="btn btn-danger"
                                    style={{ padding: '0.6rem' }}
                                    title="Remove Item"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="glass-panel" style={{ padding: '2rem', position: 'sticky', top: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Order Summary</h3>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                        <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                        <span>Shipping</span>
                        <span style={{ color: 'var(--success)' }}>Free</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '1.25rem', fontWeight: 600 }}>
                        <span>Total</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                    </div>

                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem' }}
                        onClick={handleCheckout}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : (
                            <>
                                Proceed to Checkout <ArrowRight size={18} />
                            </>
                        )}
                    </button>

                    {!user && (
                        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            You will be asked to <Link to="/login" style={{ color: 'var(--accent-primary)' }}>sign in</Link> before checking out.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
