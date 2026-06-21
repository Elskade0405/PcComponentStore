import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X } from 'lucide-react';
import api from '../services/api';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });
        setLoading(true);

        try {
            const res = await api.post('/auth/forgot-password', { email });
            setStatus({ type: 'success', message: res.data.message || 'Mã OTP đã được gửi đến email của bạn.' });
            setStep(2);
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu.' });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });
        
        if (newPassword.length < 6) {
            setStatus({ type: 'error', message: 'Mật khẩu phải có ít nhất 6 ký tự.' });
            return;
        }

        setLoading(true);

        try {
            const res = await api.post('/auth/reset-password', { email, otp, newPassword });
            setStatus({ type: 'success', message: res.data.message || 'Khôi phục mật khẩu thành công!' });
            
            // Wait 2 seconds then redirect to login
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.message || 'Mã OTP không hợp lệ hoặc đã hết hạn.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-secondary)', padding: '2rem' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '100%', maxWidth: '420px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
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

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        {step === 2 && (
                            <button onClick={() => setStep(1)} style={{ fontSize: '0.75rem', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
                                Nhập lại email
                            </button>
                        )}
                        <Link to="/login" style={{ fontSize: '0.75rem', color: '#64748b', textDecoration: 'underline', marginLeft: 'auto' }}>
                            Quay lại đăng nhập
                        </Link>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleRequestOtp}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem' }}>
                                    Vui lòng nhập địa chỉ email đã đăng ký. Chúng tôi sẽ gửi một mã xác thực (OTP) đến email của bạn.
                                </p>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Nhập Email của bạn"
                                    required
                                    style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.9rem', outline: 'none' }}
                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                    onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !email}
                                style={{ 
                                    width: '100%', padding: '0.8rem', backgroundColor: '#ff0000', color: 'white', 
                                    border: 'none', borderRadius: '4px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer',
                                    transition: 'background-color 0.2s', opacity: (loading || !email) ? 0.7 : 1
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#cc0000'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#ff0000'}
                            >
                                {loading ? 'Đang xử lý...' : 'GỬI YÊU CẦU OTP'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword}>
                            <div style={{ marginBottom: '1rem' }}>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Nhập mã OTP (6 số)"
                                    required
                                    maxLength={6}
                                    style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.9rem', outline: 'none', textAlign: 'center', letterSpacing: '2px' }}
                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                    onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                                />
                            </div>
                            
                            <div style={{ marginBottom: '1.5rem' }}>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Nhập mật khẩu mới"
                                    required
                                    style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.9rem', outline: 'none' }}
                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                    onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !otp || !newPassword}
                                style={{ 
                                    width: '100%', padding: '0.8rem', backgroundColor: '#10b981', color: 'white', 
                                    border: 'none', borderRadius: '4px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer',
                                    transition: 'background-color 0.2s', opacity: (loading || !otp || !newPassword) ? 0.7 : 1
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                            >
                                {loading ? 'Đang xử lý...' : 'XÁC NHẬN ĐỔI MẬT KHẨU'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
