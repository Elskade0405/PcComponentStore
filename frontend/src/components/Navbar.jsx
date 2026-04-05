import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, ShoppingCart, User, Settings, Facebook, Instagram } from 'lucide-react';

const Navbar = () => {
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    // Fake cart count logic
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <header style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 100 }}>
            {/* Tier 1: Top Bar (Black) */}
            <div style={{ backgroundColor: 'black', color: 'white', padding: '0.4rem 0', fontSize: '0.75rem' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <span>Giờ làm việc: <strong>8:00 AM - 9:30 PM</strong></span>
                        <span>Địa chỉ: 123 Đường ABC, Hà Nội</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <span>Hotline: <strong>1234 5678</strong></span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Facebook size={14} />
                            <Instagram size={14} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tier 2: Main Header (Logo, Search, Icons) */}
            <div className="container" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem' }}>
                
                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
                    <Settings className="text-red" size={28} />
                    <span>HGEARS</span>
                </Link>
                
                {/* Search Bar */}
                <div style={{ flex: 1, position: 'relative', maxWidth: '600px' }}>
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm sản phẩm..."
                        style={{
                            width: '100%',
                            padding: '0.7rem 1rem',
                            borderRadius: 'var(--border-radius-full)',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'white',
                            fontSize: '0.85rem'
                        }}
                    />
                    <Search size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                </div>
                
                {/* User & Cart Icons */}
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => isAdmin && navigate('/admin')}>
                                <div style={{ 
                                    width: '36px', height: '36px', 
                                    border: '2px solid var(--accent-blue)', 
                                    backgroundColor: '#eff6ff',
                                    borderRadius: '50%', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--accent-blue)' 
                                }}>
                                    <User size={18} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                        {isAdmin ? 'Admin' : 'Tài khoản'}
                                    </span>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                        {user.email.split('@')[0]}
                                    </span>
                                </div>
                            </div>
                            <span 
                                onClick={logout} 
                                style={{ cursor: 'pointer', fontSize: '0.8rem', color: 'var(--danger)', textDecoration: 'underline' }}
                            >
                                Đăng xuất
                            </span>
                        </div>
                    ) : (
                        <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                            <div style={{ 
                                width: '36px', height: '36px', 
                                border: '1.5px solid var(--border-color)', 
                                borderRadius: '50%', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--text-secondary)' 
                            }}>
                                 <User size={18} />
                            </div>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Đăng nhập</span>
                        </Link>
                    )}

                    <Link to="/cart" style={{ display: 'flex', alignItems: 'center', position: 'relative', padding: '0.5rem' }}>
                        <ShoppingCart size={24} />
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '0',
                                right: '0',
                                backgroundColor: 'var(--accent-blue)',
                                color: 'white',
                                fontSize: '0.65rem',
                                fontWeight: 'bold',
                                minWidth: '16px',
                                height: '16px',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '0 4px'
                            }}>
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Tier 3: Navigation Links */}
            <div className="container" style={{ padding: '0.5rem 1rem', display: 'flex', justifyContent: 'center', gap: '3rem', fontSize: '0.85rem', fontWeight: 600 }}>
                <Link to="/products" className="text-blue" style={{ border: '1px solid var(--accent-blue)', borderRadius: 'var(--border-radius-full)', padding: '0.4rem 1rem' }}>
                    Danh mục sản phẩm
                </Link>
                <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', color: 'var(--accent-blue)' }}>
                    <Link to="#">Laptop</Link>
                    <Link to="#">Màn hình</Link>
                    <Link to="#">Thiết bị văn phòng</Link>
                    <Link to="#">Linh kiện PC</Link>
                </div>
                <Link to="#" className="text-blue" style={{ border: '1px solid var(--accent-blue)', borderRadius: 'var(--border-radius-full)', padding: '0.4rem 1rem' }}>
                    Xây dựng cấu hình PC
                </Link>
            </div>
        </header>
    );
};

export default Navbar;
