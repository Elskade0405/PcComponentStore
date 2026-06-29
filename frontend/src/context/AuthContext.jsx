import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        const role = localStorage.getItem('role');
        const userId = localStorage.getItem('userId');

        if (token && token !== 'undefined' && email && email !== 'undefined') {
            setUser({ email, role, token, userId });
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            localStorage.removeItem('role');
            localStorage.removeItem('userId');
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const token = response.data.token || response.data.Token;
            const role = response.data.role || response.data.Role;
            const userId = response.data.userId || response.data.UserId || (response.data.user && response.data.user.id) || (response.data.User && response.data.User.Id);

            if (!token) throw new Error("Token missing from response");

            localStorage.setItem('token', token);
            localStorage.setItem('email', email);
            localStorage.setItem('role', role);
            if (userId) localStorage.setItem('userId', userId);

            setUser({ email, role, token, userId });
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    const register = async (fullName, email, password) => {
        try {
            await api.post('/auth/register', { fullName, email, password });
            return { success: true };
        } catch (error) {
            console.error('Registration failed:', error);
            if (error.response && error.response.data) {
                 const errorMessage = error.response.data.message || error.response.data.Message;
                 if (errorMessage) {
                     return { success: false, message: errorMessage };
                 }
            }
            return { success: false, message: 'Registration failed. Server error.' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isAdmin: user?.role === 'Admin'
    };

    if (loading) {
        return <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', marginTop: '4rem' }}>Loading authentication...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
