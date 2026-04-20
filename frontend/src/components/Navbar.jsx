import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Search, ShoppingCart, User, Settings, Facebook, Instagram, Menu, ChevronRight } from 'lucide-react';
import api from '../services/api';

const Navbar = () => {
    const { user, isAdmin, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('pc-gaming');
    
    // Search suggestions logic
    const [searchQuery, setSearchQuery] = useState('');
    const [allProducts, setAllProducts] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

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
            setSuggestions(filtered.slice(0, 5)); // show up to 5 results
        }
    }, [searchQuery, allProducts]);

    const menuData = [
        {
            id: 'pc-gaming',
            label: 'PC GAMING',
            columns: [
                { title: 'MÁY TÍNH CHƠI GAME', items: ['PC ĐẸP', 'PC GAMING GIÁ RẺ', 'PC GAMING TRUNG CẤP', 'PC GAMING CAO CẤP'] },
                { title: 'PC STREAM', items: [] },
                { title: 'THEO KHOẢNG GIÁ', items: ['Dưới 10 triệu', '10-15 triệu', '15-20 triệu', '20-25 triệu', '25-30 triệu', '30-40 triệu', '40-50 triệu', 'Trên 50 triệu'] },
                { title: 'FULL BỘ PC KÈM MÀN HÌNH', items: [] }
            ]
        },
        { 
            id: 'pc-workstation', 
            label: 'PC Workstation 2D 3D', 
            columns: [
                { title: 'PC VIDEO EDITING', items: ['PC RENDER'] },
                { title: 'PC PHOTO EDITING', items: ['PC Architecture - CAD'] },
                { title: 'PC 3D DESIGN - ANIMATION', items: ['PC MACHINE LEARNING/AI'] }
            ] 
        },
        { id: 'pc-office', label: 'PC VĂN PHÒNG', columns: [] },
        { id: 'pc-emulator', label: 'PC GIẢ LẬP', columns: [] },
        { 
            id: 'components', 
            label: 'LINH KIỆN MÁY TÍNH', 
            columns: [
                { title: 'CPU', items: ['CPU Intel', 'CPU AMD'] },
                { title: 'Mainboard - Bo Mạch Chủ', items: ['Mainboard cho CPU Intel', 'Mainboard cho CPU AMD'] },
                { title: 'RAM', items: ['DDR4', 'DDR5'] },
                { title: 'VGA - Card Màn Hình', items: ['VGA NVIDIA', 'VGA AMD', 'VGA RTX 5000 SERIES'] }
            ] 
        },
        { id: 'monitor', label: 'MÀN HÌNH MÁY TÍNH', columns: [] },
        { id: 'accessories', label: 'PHỤ KIỆN', columns: [] },
        { id: 'onsale', label: 'OnSale', columns: [] },
    ];

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

                    {/* Live Search Suggestions Dropdown */}
                    {showSuggestions && searchQuery.trim() !== '' && suggestions.length > 0 && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px', marginTop: '4px', zIndex: 120, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {suggestions.map(s => {
                                    const imgUrl = s.imageUrl ? `http://localhost:5285${s.imageUrl}` : 'https://via.placeholder.com/50x50?text=SP';
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
                
                {/* Mega Menu Wrapper */}
                <div 
                    style={{ position: 'relative' }} 
                    onMouseEnter={() => setIsMenuOpen(true)}
                    onMouseLeave={() => setIsMenuOpen(false)}
                >
                    <div style={{ 
                        display: 'flex', alignItems: 'center', gap: '0.5rem', 
                        border: '1px solid var(--accent-blue)', borderRadius: 'var(--border-radius-full)', 
                        padding: '0.4rem 1.2rem', cursor: 'pointer', 
                        backgroundColor: isMenuOpen ? 'var(--accent-blue)' : 'white', 
                        color: isMenuOpen ? 'white' : 'var(--accent-blue)' 
                    }}>
                        <Menu size={16} /> Danh mục sản phẩm
                    </div>

                    {/* Dropdown Container */}
                    {isMenuOpen && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 110, display: 'flex', width: '900px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                            {/* Left Vertical Menu */}
                            <div style={{ width: '260px', backgroundColor: 'white', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
                                {menuData.map(menu => (
                                    <div 
                                        key={menu.id}
                                        onMouseEnter={() => setActiveMenu(menu.id)}
                                        style={{
                                            padding: '0.75rem 1rem', 
                                            borderBottom: '1px solid #e5e7eb',
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            backgroundColor: activeMenu === menu.id ? '#e30019' : 'white',
                                            color: activeMenu === menu.id ? 'white' : '#333',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        <span style={{ textTransform: 'uppercase' }}>{menu.label}</span>
                                        <ChevronRight size={16} />
                                    </div>
                                ))}
                            </div>

                            {/* Right Mega Menu Content */}
                            {menuData.find(m => m.id === activeMenu)?.columns?.length > 0 ? (
                                <div style={{ flex: 1, backgroundColor: 'white', border: '1px solid #e5e7eb', borderLeft: 'none', padding: '1.5rem', display: 'flex', gap: '2rem' }}>
                                    {menuData.find(m => m.id === activeMenu).columns.map((col, idx) => (
                                        <div key={idx} style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 700, color: '#e30019', marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                                                {col.title}
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                {col.items.map((item, i) => {
                                                    const generateSlug = (text) => text.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
                                                    
                                                    // Map explicitly created categories if needed, but we can now use generic for everything safely.
                                                    // If you still want to route VGA/CPU to their old pages, you can uncomment this:
                                                    // let targetUrl = "/products";
                                                    // if (item.includes('VGA')) targetUrl = "/category/vga";
                                                    // else if (item.includes('CPU')) targetUrl = "/category/cpu";
                                                    
                                                    // Switch everything to dynamic GenericCategory
                                                    let targetUrl = `/collection/${generateSlug(item)}?title=${encodeURIComponent(item)}`;

                                                    return (
                                                        <Link key={i} to={targetUrl} style={{ color: '#333', fontSize: '0.85rem', textDecoration: 'none' }}>
                                                            {item}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ flex: 1, backgroundColor: 'white', border: '1px solid #e5e7eb', borderLeft: 'none' }}></div>
                            )}
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', color: 'var(--accent-blue)' }}>
                    <Link to="#">Laptop</Link>
                    <Link to="#">Màn hình</Link>
                    <Link to="#">Thiết bị văn phòng</Link>
                    <Link to="#">Linh kiện PC</Link>
                </div>
                <Link to="/build-pc" className="text-blue" style={{ border: '1px solid var(--accent-blue)', borderRadius: 'var(--border-radius-full)', padding: '0.4rem 1rem', textDecoration: 'none' }}>
                    Xây dựng cấu hình PC
                </Link>
            </div>
        </header>
    );
};

export default Navbar;
