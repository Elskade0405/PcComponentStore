import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });
        setLoading(true);

        // Simulation for now since there might not be a backend forgot password endpoint yet
        setTimeout(() => {
            setStatus({ type: 'success', message: 'Hướng dẫn khôi phục mật khẩu đã được gửi đến email của bạn.' });
            setLoading(false);
        }, 1000);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#222222', padding: '2rem' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '100%', maxWidth: '420px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                {/* Header */}
                <div style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #e2e8f0' }}>
                    <h1 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827', margin: 0, letterSpacing: '0.5px' }}>
                        QUÊN MẬT KHẨU
                    </h1>
                    <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                        <X size={24} strokeWidth={1.5} />
                    </button>
                </div>

                <div style={{ padding: '1.5rem' }}>
                    {status.message && (
                        <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: status.type === 'success' ? '#dcfce7' : 'rgba(239,68,68,0.1)', border: `1px solid ${status.type === 'success' ? '#86efac' : 'rgba(239,68,68,0.3)'}`, borderRadius: '4px', color: status.type === 'success' ? '#166534' : '#ef4444', fontSize: '0.85rem', textAlign: 'center' }}>
                            {status.message}
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                        <Link to="/login" style={{ fontSize: '0.75rem', color: '#64748b', textDecoration: 'underline' }}>
                            Quay lại
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                                style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.9rem', outline: 'none' }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{ 
                                width: '100%', padding: '0.8rem', backgroundColor: '#ff0000', color: 'white', 
                                border: 'none', borderRadius: '4px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#cc0000'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#ff0000'}
                        >
                            {loading ? 'Đang xử lý...' : 'GỬI YÊU CẦU'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
                        <div style={{ flex: 1, borderBottom: '1px dashed #cbd5e1' }}></div>
                        <span style={{ padding: '0 10px', color: '#64748b', fontSize: '0.75rem' }}>Hoặc đăng nhập bằng</span>
                        <div style={{ flex: 1, borderBottom: '1px dashed #cbd5e1' }}></div>
                    </div>

                    {/* Social Buttons */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button style={{ 
                            flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', 
                            padding: '0.6rem', backgroundColor: '#ea4335', color: 'white', border: 'none', borderRadius: '4px', 
                            fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' 
                        }}>
                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>G+</span> Google
                        </button>
                        <button style={{ 
                            flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', 
                            padding: '0.6rem', backgroundColor: '#3b5998', color: 'white', border: 'none', borderRadius: '4px', 
                            fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' 
                        }}>
                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>f</span> Facebook
                        </button>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: '#334155' }}>
                        Bạn chưa có tài khoản? <Link to="/register" style={{ color: '#0ea5e9', fontWeight: '600', textDecoration: 'underline' }}>Đăng ký ngay!</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
