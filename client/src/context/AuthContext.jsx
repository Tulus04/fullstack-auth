import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authServices';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        const userData = await authService.login(credentials);
        setUser(userData);
        return userData;
    };

    const register = async (userInfo) => {
        const newUser = await authService.register(userInfo);
        setUser(newUser);
        return newUser;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user,login, register, logout , loading }}>
            {children}
        </AuthContext.Provider>
    );
};