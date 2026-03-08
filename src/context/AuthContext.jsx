import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = 'http://localhost:8001/api';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (fullName, password) => {
        try {
            const response = await axios.post(`${API_URL}/login/`, { fullName, password });
            setUser(response.data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Login failed."
            };
        }
    };

    const signup = async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/signup/`, userData);
            setUser(response.data);
            return { success: true };
        } catch (error) {
            console.error("Signup error:", error.response?.data);
            let errorMessage = "Signup failed.";
            if (error.response?.data) {
                if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (typeof error.response.data === 'object') {
                    // Extract first error message from field-specific errors
                    const firstKey = Object.keys(error.response.data)[0];
                    const firstError = error.response.data[firstKey];
                    errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
                }
            }
            return {
                success: false,
                message: errorMessage
            };
        }
    };

    const logout = () => setUser(null);

    const updateProfile = (updatedData) => {
        // In a real app, this would be a PATCH to the backend
        setUser({ ...user, ...updatedData });
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
