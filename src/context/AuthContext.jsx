import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } catch (error) {
                console.error('Error restoring session:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/login', { email, password });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Login failed' };
        }
    };

    const verifyOtp = async (email, otp) => {
        try {
            const response = await api.post('/verify-otp', { email, otp });
            const { token, user } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            setUser(user);
            setIsAuthenticated(true);
            
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'OTP verification failed' };
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete api.defaults.headers.common['Authorization'];
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const value = {
        user,
        setUser,
        loading,
        isAuthenticated,
        login,
        verifyOtp,
        logout,
        isAdmin: () => user?.role?.slug === 'admin' || user?.role_id === 1,
        isProjectManager: () => user?.role?.slug === 'project-manager' || user?.role_id === 2,
        isTeamLeader: () => user?.role?.slug === 'team-leader' || user?.role_id === 3,
        isTeamMember: () => user?.role?.slug === 'team-member' || user?.role_id === 4,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};