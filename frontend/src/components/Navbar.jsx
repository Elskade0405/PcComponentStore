import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Search, ShoppingCart, User, Settings, Facebook, Instagram, Menu, ChevronRight, ClipboardList, KeyRound, LogOut, ShieldAlert } from 'lucide-react';
import api from '../services/api';
import API_URL from '../config';
import MegaMenu from './MegaMenu';
const Navbar = () => {
    const { user, isAdmin, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [allProducts, setAllProducts] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showAccountMenu, setShowAccountMenu] = useState(false);
    const accountMenuRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
                setShowAccountMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/Products');
                setAllProducts(res.data);
            } catch (err) {
                console.error("Failed to load products for search", err);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSuggestions([]);
        } else {
            const lowerQuery = searchQuery.toLowerCase();
            const filtered = allProducts.filter(p => p.name.toLowerCase().includes(lowerQuery));
            setSuggestions(filtered.slice(0, 5)); 
        }
    }, [searchQuery, allProducts]);



    return (
        <header style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 100 }}>
            
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

            
            <div className="container" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem' }}>
                
                
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
                    <Settings className="text-red" size={28} />
                    <span>HGEARS</span>
                </Link>
                
                
                <div style={{ flex: 1, position: 'relative', maxWidth: '600px' }}>
                    <form onSubmit={(e) => { e.preventDefault(); navigate(`/products?search=${searchQuery}`); setShowSuggestions(false); }}>
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            style={{
                                width: '100%',
                                padding: '0.7rem 1rem',
                                borderRadius: 'var(--border-radius-full)',
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'white',
                                fontSize: '0.85rem'
                            }}
                        />
                        <button type="submit" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                            <Search size={18} />
                        </button>
                    </form>

                    
                    {showSuggestions && searchQuery.trim() !== '' && suggestions.length > 0 && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px', marginTop: '4px', zIndex: 120, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {suggestions.map(s => {
                                    const imgUrl = s.imageUrl ? `${API_URL}${s.imageUrl}` : 'https://via.placeholder.com/50x50?text=SP';
                                    return (
                                        <Link 
                                            key={s.id} 
                                            to={`/product/${s.id}`} 
                                            onClick={() => setShowSuggestions(false)}
                                            style={{ display: 'flex', padding: '0.75rem 1rem', borderBottom: '1px solid #eee', textDecoration: 'none', color: 'inherit' }}
                                        >
                                            <div style={{ width: '50px', height: '50px', marginRight: '1rem', flexShrink: 0 }}>
                                                <img src={imgUrl} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#333', marginBottom: '0.25rem' }}>{s.name}</div>
                                                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e30019' }}>{s.price.toLocaleString('vi-VN')}đ</div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                            <div 
                                style={{ backgroundColor: '#eeeeee', padding: '0.5rem', textAlign: 'center', fontSize: '0.8rem', color: '#333', cursor: 'pointer' }} 
                                onClick={() => navigate(`/products?search=${searchQuery}`)}
                            >
                                Xem tất cả {allProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length} kết quả tìm được
                            </div>
                        </div>
                    )}
                </div>
                
                
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    {user ? (
                        <div style={{ position: 'relative' }} ref={accountMenuRef}>
                            <div 
                                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }} 
                                onClick={() => setShowAccountMenu(!showAccountMenu)}
                            >
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

                            
                            {showAccountMenu && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    marginTop: '0.5rem',
                                    width: '220px',
                                    backgroundColor: 'white',
                                    borderRadius: '8px',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                    border: '1px solid #e5e7eb',
                                    zIndex: 100,
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    {isAdmin && (
                                        <button 
                                            onClick={() => { setShowAccountMenu(false); navigate('/admin'); }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem 1rem', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', color: '#374151', borderBottom: '1px solid #f3f4f6' }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                        >
                                            <ShieldAlert size={16} /> <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Trang Quản Trị</span>
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => { setShowAccountMenu(false); navigate('/order-history'); }}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem 1rem', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', color: '#374151', borderBottom: '1px solid #f3f4f6' }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                    >
                                        <ClipboardList size={16} /> <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Lịch sử đơn hàng</span>
                                    </button>
                                    <button 
                                        onClick={() => { setShowAccountMenu(false); navigate('/change-password'); }}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem 1rem', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', color: '#374151', borderBottom: '1px solid #f3f4f6' }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                    >
                                        <KeyRound size={16} /> <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Đổi mật khẩu</span>
                                    </button>
                                    <button 
                                        onClick={() => { setShowAccountMenu(false); logout(); }}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem 1rem', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', color: '#e30019' }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                    >
                                        <LogOut size={16} /> <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Đăng xuất</span>
                                    </button>
                                </div>
                            )}
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

            
            <div className="container" style={{ padding: '0.5rem 1rem', display: 'flex', justifyContent: 'center', gap: '3rem', fontSize: '0.85rem', fontWeight: 600 }}>
                
                <MegaMenu />

                <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', color: 'var(--accent-blue)' }}>
                    <Link to="/collection/laptop">Laptop</Link>
                    <Link to="/collection/man-hinh-may-tinh">Màn hình</Link>
                    <Link to="/collection/thiet-bi-van-phong">Thiết bị văn phòng</Link>
                    <Link to="/products">Linh kiện PC</Link>
                </div>
                <Link to="/build-pc" className="text-blue" style={{ border: '1px solid var(--accent-blue)', borderRadius: 'var(--border-radius-full)', padding: '0.4rem 1rem', textDecoration: 'none' }}>
                    Xây dựng cấu hình PC
                </Link>
            </div>
        </header>
    );
};

export default Navbar;
