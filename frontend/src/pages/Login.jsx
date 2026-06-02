import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import api from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const success = await login(email, password);
        if (success) {
            navigate('/');
        } else {
            setError('Email hoặc mật khẩu không đúng');
        }
        setLoading(false);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#222222', padding: '2rem' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '100%', maxWidth: '420px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                {/* Header */}
                <div style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #e2e8f0' }}>
                    <h1 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827', margin: 0, letterSpacing: '0.5px' }}>
                        ĐĂNG NHẬP HOẶC TẠO TÀI KHOẢN
                    </h1>
                    <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                        <X size={24} strokeWidth={1.5} />
                    </button>
                </div>

                <div style={{ padding: '1.5rem' }}>
                    {error && (
                        <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '4px', color: '#ef4444', fontSize: '0.85rem', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                        <Link to="/phone-login" style={{ fontSize: '0.75rem', color: '#64748b', textDecoration: 'none' }}>
                            Đăng nhập bằng số điện thoại
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1rem' }}>
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

                        <div style={{ marginBottom: '0.5rem' }}>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mật khẩu"
                                required
                                style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.9rem', outline: 'none' }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                            <Link to="/forgot-password" style={{ fontSize: '0.75rem', color: '#64748b', textDecoration: 'underline' }}>
                                Quên mật khẩu?
                            </Link>
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
                            {loading ? 'Đang xử lý...' : 'ĐĂNG NHẬP'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
                        <div style={{ flex: 1, borderBottom: '1px dashed #cbd5e1' }}></div>
                        <span style={{ padding: '0 10px', color: '#64748b', fontSize: '0.75rem' }}>Hoặc đăng nhập bằng</span>
                        <div style={{ flex: 1, borderBottom: '1px dashed #cbd5e1' }}></div>
                    </div>

                    {/* Social Buttons */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                            <GoogleLogin
                                onSuccess={async (credentialResponse) => {
                                    setLoading(true);
                                    try {
                                        const res = await api.post('/auth/google-login', { credential: credentialResponse.credential });
                                        if (res.data && res.data.token) {
                                            localStorage.setItem('token', res.data.token);
                                            localStorage.setItem('user', JSON.stringify(res.data.user));
                                            window.location.href = '/';
                                        }
                                    } catch (err) {
                                        console.error(err);
                                        setError('Đăng nhập bằng Google thất bại');
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                onError={() => {
                                    setError('Đăng nhập bằng Google thất bại');
                                }}
                                useOneTap
                            />
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: '#334155' }}>
                        Bạn chưa có tài khoản? <Link to="/register" style={{ color: '#0ea5e9', fontWeight: '600', textDecoration: 'underline' }}>Đăng ký ngay!</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
