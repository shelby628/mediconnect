import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = '/api';

export const useAuth = () => useContext(AuthContext);

// 🔧 Normalize backend user → frontend user
const normalizeUser = (user) => ({
    id: user.id,
    fullName: user.full_name,
    role: user.role,
    phone: user.phone,
    gender: user.gender,
    dob: user.dob,
    nationalId: user.national_id
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ── RESTORE SESSION ──
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('access_token');

        if (savedUser && savedToken && savedToken !== 'undefined') {
            axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
            setUser(JSON.parse(savedUser));
        }

        setLoading(false);
    }, []);

    // ── LOGIN ──
    const login = async (nationalId, password) => {
        try {
            const response = await axios.post(`${API_URL}/login/`, {
                nationalId,
                password
            });

            const { user, tokens } = response.data;

            if (!tokens?.access) {
                return { success: false, message: 'No token received' };
            }

            const normalizedUser = normalizeUser(user);

            axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;

            setUser(normalizedUser);
            localStorage.setItem('user', JSON.stringify(normalizedUser));
            localStorage.setItem('access_token', tokens.access);
            localStorage.setItem('refresh_token', tokens.refresh);

            return {
                success: true,
                role: normalizedUser.role,
                token: tokens.access
            };

        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Login failed."
            };
        }
    };

    // ── SIGNUP ──
    const signup = async (userData) => {
        try {
            const payload = {
                full_name: userData.fullName,
                national_id: userData.nationalId,
                dob: userData.dob,
                gender: userData.gender,
                phone: userData.phone,
                password: userData.password,
            };

            const response = await axios.post(`${API_URL}/signup/`, payload);

            const { user, tokens } = response.data;

            if (!tokens?.access) {
                return { success: false, message: 'No token received from server' };
            }

            const normalizedUser = normalizeUser(user);

            axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;

            setUser(normalizedUser);
            localStorage.setItem('user', JSON.stringify(normalizedUser));
            localStorage.setItem('access_token', tokens.access);
            localStorage.setItem('refresh_token', tokens.refresh);

            return {
                success: true,
                token: tokens.access
            };

        } catch (error) {
            let errorMessage = "Signup failed.";

            if (error.response?.data) {
                const data = error.response.data;

                if (data.message) {
                    errorMessage = data.message;
                } else {
                    const firstKey = Object.keys(data)[0];
                    const firstError = data[firstKey];
                    errorMessage = Array.isArray(firstError)
                        ? firstError[0]
                        : firstError;
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