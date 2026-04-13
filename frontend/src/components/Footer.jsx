import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border-color)', padding: '4rem 0 2rem 0', marginTop: 'auto' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>

                    {/* Column 1 */}
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', textTransform: 'uppercase' }}>Về HGEARS</h3>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            <li><Link to="#">Giới thiệu</Link></li>
                            <li><Link to="#">Tuyển dụng</Link></li>
                        </ul>
                    </div>

                    {/* Column 2 */}
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', textTransform: 'uppercase' }}>Chính sách</h3>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            <li><Link to="#">Chính Sách Bảo Hành</Link></li>
                            <li><Link to="#">Chính Sách Giao Hàng</Link></li>
                            <li><Link to="#">Chính Sách Bảo Mật</Link></li>
                            <li><Link to="#">Chính Sách Đổi Trả</Link></li>
                            <li><Link to="#">Điều Khoản Sử Dụng</Link></li>
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', textTransform: 'uppercase' }}>Thông tin liên hệ</h3>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Phone size={18} /> 0123456789
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Mail size={18} /> abc@gmail.com
                            </li>
                        </ul>
                    </div>

                    {/* Column 4 */}
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', textTransform: 'uppercase' }}>Tài khoản ngân hàng</h3>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            <li><Link to="#">Tài Khoản Ngân Hàng</Link></li>
                            <li><Link to="#">Tìm Kiếm Phương Thức Thanh Toán</Link></li>
                        </ul>
                    </div>

                </div>

                <div style={{ textAlign: 'center', marginTop: '4rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    &copy; {new Date().getFullYear()} HGEARS Store. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
