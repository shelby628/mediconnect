import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = https://mediconnect-pa9z.onrender.com;
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ── Restore user from localStorage on page refresh ──
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('access_token');

        if (savedUser &&
            savedToken &&
            savedToken !== 'undefined' &&
            savedToken !== 'null') {

            // ← Set axios FIRST before anything
            axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;

            // ← Then restore user
            setUser(JSON.parse(savedUser));

            console.log('✅ Token restored:', savedToken.substring(0, 30) + '...');
        } else {
            console.log('❌ No valid token in localStorage');
        }

        setLoading(false);
    }, []);

    // ── LOGIN ──
    const login = async (nationalId, password) => {
        try {
            console.log('🔵 Login attempt:', nationalId);

            const response = await axios.post(`${API_URL}/login/`, {
                nationalId,
                password
            });

            console.log('🔵 Raw response:', response);
            console.log('🔵 Response data:', response.data);
            console.log('🔵 Tokens object:', response.data.tokens);
            console.log('🔵 Access token:', response.data.tokens?.access);

            const { user, tokens } = response.data;

            if (!tokens || !tokens.access) {
                console.error('❌ NO TOKEN!', response.data);
                return { success: false, message: 'No token received' };
            }

            console.log('🔵 Setting localStorage...');
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('access_token', tokens.access);
            localStorage.setItem('refresh_token', tokens.refresh);

            console.log('🔵 localStorage after set:');
            console.log('   user:', localStorage.getItem('user'));
            console.log('   token:', localStorage.getItem('access_token'));

            axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;
            setUser(user);

            return { success: true, role: user.role, token: tokens.access };

        } catch (error) {
            console.error('❌ Login error:', error);
            return {
                success: false,
                message: error.response?.data?.message || "Login failed."
            };
        }
    };

    // ── SIGNUP ──
    const signup = async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/signup/`, userData);
            const { user, tokens } = response.data;

            if (!tokens || !tokens.access) {
                return { success: false, message: 'No token received from server' };
            }

            // ← Set axios IMMEDIATELY
            axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;

            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('access_token', tokens.access);
            localStorage.setItem('refresh_token', tokens.refresh);

            console.log('✅ Signup successful, token set');

            return { success: true, token: tokens.access };

        } catch (error) {
            let errorMessage = "Signup failed.";
            if (error.response?.data) {
                if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (typeof error.response.data === 'object') {
                    const firstKey = Object.keys(error.response.data)[0];
                    const firstError = error.response.data[firstKey];
                    errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
                }
            }
            return { success: false, message: errorMessage };
        }
    };

    // ── LOGOUT ──
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        delete axios.defaults.headers.common['Authorization'];
        console.log('✅ Logged out, token cleared');
    };

    // ── UPDATE PROFILE ──
    const updateProfile = (updatedData) => {
        const updated = { ...user, ...updatedData };
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            signup,
            logout,
            updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};