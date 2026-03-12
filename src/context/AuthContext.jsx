import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = 'http://localhost:8001/api';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (fullName, password) => {
        // Admin shortcut
        if (fullName === 'Admin' && password === 'admin123') {
            setUser({ fullName: 'Admin', role: 'admin' });
            return { success: true, role: 'admin' };  // ← add role here
        }
        try {
            const response = await axios.post(`${API_URL}/login/`, { fullName, password });
            setUser({ ...response.data, role: response.data.role || 'patient' });
            return { success: true, role: response.data.role || 'patient' };  // ← add role here
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Login failed." };
        }
    };

    const signup = async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/signup/`, userData);
            setUser({ ...response.data, role: 'patient' });
            return { success: true };
        } catch (error) {
            let errorMessage = "Signup failed.";
            if (error.response?.data) {
                if (typeof error.response.data === 'string') errorMessage = error.response.data;
                else if (error.response.data.message) errorMessage = error.response.data.message;
                else if (typeof error.response.data === 'object') {
                    const firstKey = Object.keys(error.response.data)[0];
                    const firstError = error.response.data[firstKey];
                    errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
                }
            }
            return { success: false, message: errorMessage };
        }
    };

    const logout = () => setUser(null);
    const updateProfile = (updatedData) => setUser({ ...user, ...updatedData });

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};