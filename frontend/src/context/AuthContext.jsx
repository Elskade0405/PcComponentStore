import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for token on mount
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        const role = localStorage.getItem('role');

        if (token && token !== 'undefined' && email && email !== 'undefined') {
            setUser({ email, role, token });
        } else {
            // Clean up bad state
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            localStorage.removeItem('role');
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            
            // Handle both camelCase and PascalCase from .NET responses
            const token = response.data.token || response.data.Token;
            const role = response.data.role || response.data.Role;

            if (!token) throw new Error("Token missing from response");

            localStorage.setItem('token', token);
            localStorage.setItem('email', email);
            localStorage.setItem('role', role);

            setUser({ email, role, token });
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
            // Return specific backend error message if available
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
