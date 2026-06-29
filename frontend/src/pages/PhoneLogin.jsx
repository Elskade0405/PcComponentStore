import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X, Smartphone } from 'lucide-react';

const PhoneLogin = () => {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Tính năng gửi mã OTP qua tin nhắn SMS hiện đang được bảo trì hoặc đang trong quá trình phát triển. Vui lòng quay lại sau!');
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-secondary)', padding: '2rem' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '100%', maxWidth: '420px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                
                <div style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #e2e8f0' }}>
                    <h1 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827', margin: 0, letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Smartphone size={20} /> ĐĂNG NHẬP BẰNG SĐT
                    </h1>
                    <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                        <X size={24} strokeWidth={1.5} />
                    </button>
                </div>

                <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                        <Link to="/login" style={{ fontSize: '0.75rem', color: '#64748b', textDecoration: 'underline' }}>
                            Quay lại đăng nhập bằng Email
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Nhập số điện thoại của bạn"
                                required
                                style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.9rem', outline: 'none' }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                            />
                        </div>

                        <button
                            type="submit"
                            style={{ 
                                width: '100%', padding: '0.8rem', backgroundColor: '#3b82f6', color: 'white', 
                                border: 'none', borderRadius: '4px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                        >
                            NHẬN MÃ OTP
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PhoneLogin;
