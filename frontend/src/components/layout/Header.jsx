import React, { useState } from 'react';
import { Bell, User as UserIcon, LogOut, ChevronDown, Sun, Moon, Sunset } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Header = () => {
    const { user, logout } = useAuth();
    const { notifications, markRead, markAllRead } = useData();
    const [showNotifs, setShowNotifs] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;

    // ✅ Extract first name safely
    const firstName = user?.fullName?.split(' ')[0] || 'User';

    // ── Greeting based on time of day ──
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return { text: 'Good morning', icon: <Sun size={16} /> };
        if (hour < 17) return { text: 'Good afternoon', icon: <Sunset size={16} /> };
        return { text: 'Good evening', icon: <Moon size={16} /> };
    };

    const greeting = getGreeting();

    return (
        <header style={{
            height: 80,
            background: '#ffffff',
            borderBottom: '1px solid #E8E2DC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 36px',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            flexShrink: 0,
            gap: 20,
        }}>

            {/* ── Left — Welcome ── */}
            <div style={{ flex: 1 }}>

                {/* Greeting row */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 4,
                }}>
                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#9A8A7A',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                    }}>
                        {greeting.icon}
                        {greeting.text},
                        <span style={{ color: '#6D2932' }}>{firstName}</span>
                    </span>
                </div>

                {/* Name + Role row */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    flexWrap: 'wrap',
                }}>
                    <h2 style={{
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: '#1A1008',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        letterSpacing: '-0.02em',
                    }}>
                        {firstName}
                        <span style={{ color: '#6D2932' }}>.</span>
                    </h2>

                    {/* Role badge */}
                    <span style={{
                        background: 'rgba(109,41,50,0.08)',
                        color: '#6D2932',
                        border: '1px solid rgba(109,41,50,0.15)',
                        padding: '2px 10px',
                        borderRadius: 50,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'capitalize',
                        letterSpacing: '0.04em',
                    }}>
                        {user?.role}
                    </span>
                </div>

            </div>

            {/* ── Right — Bell + Profile ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>

                {/* Bell */}
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); }}
                        style={{
                            width: 42, height: 42,
                            borderRadius: 12,
                            background: '#F4F0EB',
                            border: 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#6B6460',
                            cursor: 'pointer',
                            position: 'relative',
                        }}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span style={{
                                position: 'absolute', top: -4, right: -4,
                                width: 18, height: 18,
                                background: '#6D2932',
                                color: 'white',
                                fontSize: '0.6rem',
                                fontWeight: 800,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                borderRadius: '50%',
                                border: '2px solid white',
                            }}>
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {showNotifs && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                style={{
                                    position: 'absolute', right: 0, top: 52,
                                    width: 340,
                                    background: 'white',
                                    borderRadius: 16,
                                    boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
                                    border: '1px solid #E8E2DC',
                                }}
                            >
                                {/* notifications unchanged */}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Profile */}
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '6px 12px 6px 6px',
                            borderRadius: 12,
                            border: '1px solid #E8E2DC',
                            background: 'white',
                            cursor: 'pointer',
                        }}
                    >
                        <div style={{
                            width: 36, height: 36,
                            background: 'linear-gradient(135deg, #F5E6E8, #EDD5D8)',
                            borderRadius: 10,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#6D2932',
                            fontWeight: 800,
                        }}>
                            {firstName.charAt(0)}
                        </div>

                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                                {firstName}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#6B6460' }}>
                                {user?.role}
                            </div>
                        </div>

                        <ChevronDown size={14} />
                    </button>

                    <AnimatePresence>
                        {showProfile && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                style={{
                                    position: 'absolute', right: 0, top: 52,
                                    width: 200,
                                    background: 'white',
                                    borderRadius: 14,
                                    boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
                                    border: '1px solid #E8E2DC',
                                    padding: '6px',
                                }}
                            >
                                <Link to="/dashboard/profile">View Profile</Link><br />
                                <button onClick={logout}>Logout</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </header>
    );
};

export default Header;