import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register, login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        if (formData.password.length < 8) {
            return setError('Password must be at least 8 characters long');
        }

        setLoading(true);

        const result = await register(formData.fullName, formData.email, formData.password);
        if (result.success) {
            // Auto-login after successful registration
            await login(formData.email, formData.password);
            navigate('/');
        } else {
            setError(result.message || 'Registration failed. Please check your inputs.');
        }
        setLoading(false);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem' }}>Create Account</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Join NovaPC and build your dream machine</p>
                </div>

                {error && (
                    <div style={{ padding: '0.75rem', marginBottom: '1.5rem', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--border-radius-md)', color: 'var(--danger)', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label" htmlFor="fullName">Full Name</label>
                        <input
                            id="fullName"
                            type="text"
                            className="input-field"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            className="input-field"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="input-field"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                        <small style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                            Must contain 8+ chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char.
                        </small>
                    </div>

                    <div className="input-group" style={{ marginBottom: '2rem' }}>
                        <label className="input-label" htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            className="input-field"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : (
                            <>
                                <UserPlus size={18} />
                                Create Account
                            </>
                        )}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)' }}>Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
