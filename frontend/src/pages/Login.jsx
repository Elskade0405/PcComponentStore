import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

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
            setError('Invalid email or password');
        }
        setLoading(false);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Enter your credentials to access your account</p>
                </div>

                {error && (
                    <div style={{ padding: '0.75rem', marginBottom: '1.5rem', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--border-radius-md)', color: 'var(--danger)', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label" htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="input-group" style={{ marginBottom: '2rem' }}>
                        <label className="input-label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        {loading ? 'Signing in...' : (
                            <>
                                <LogIn size={18} />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--accent-primary)' }}>Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
