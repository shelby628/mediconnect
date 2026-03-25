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
                        gap: 5,
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#9A8A7A',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                    }}>
                        {greeting.icon}
                        {greeting.text}
                    </span>
                </div>

                {/* Name + Date row */}
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
                        {user?.fullName?.split(' ')[0]}
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
                            transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F5E6E8'}
                        onMouseLeave={e => e.currentTarget.style.background = '#F4F0EB'}
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
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                style={{
                                    position: 'absolute', right: 0, top: 52,
                                    width: 340,
                                    background: 'white',
                                    borderRadius: 16,
                                    boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
                                    border: '1px solid #E8E2DC',
                                    overflow: 'hidden',
                                    zIndex: 300,
                                }}
                            >
                                <div style={{
                                    padding: '14px 16px',
                                    borderBottom: '1px solid #E8E2DC',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    background: '#FAF7F4',
                                }}>
                                    <div>
                                        <span style={{ fontWeight: 800, fontSize: '0.875rem' }}>
                                            Notifications
                                        </span>
                                        {unreadCount > 0 && (
                                            <span style={{
                                                marginLeft: 8,
                                                background: '#6D2932',
                                                color: 'white',
                                                fontSize: '0.65rem',
                                                fontWeight: 800,
                                                padding: '1px 7px',
                                                borderRadius: 50,
                                            }}>
                                                {unreadCount} new
                                            </span>
                                        )}
                                    </div>
                                    {unreadCount > 0 && (
                                        <span
                                            onClick={markAllRead}
                                            style={{
                                                fontSize: '0.75rem',
                                                color: '#6D2932',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Mark all read
                                        </span>
                                    )}
                                </div>
                                <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                                    {notifications.length > 0 ? notifications.map(notif => (
                                        <div
                                            key={notif.id}
                                            onClick={() => markRead(notif.id)}
                                            style={{
                                                padding: '14px 16px',
                                                borderBottom: '1px solid #F4F0EB',
                                                cursor: 'pointer',
                                                background: !notif.read ? '#FDF5F6' : 'white',
                                                transition: 'background 0.15s',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#FAF7F4'}
                                            onMouseLeave={e => e.currentTarget.style.background = !notif.read ? '#FDF5F6' : 'white'}
                                        >
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                marginBottom: 4,
                                            }}>
                                                <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                                                    {notif.title}
                                                </span>
                                                {!notif.read && (
                                                    <span style={{
                                                        width: 7, height: 7,
                                                        borderRadius: '50%',
                                                        background: '#6D2932',
                                                        flexShrink: 0,
                                                        marginTop: 4,
                                                    }} />
                                                )}
                                            </div>
                                            <div style={{ fontSize: '0.78rem', color: '#6B6460' }}>
                                                {notif.message}
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: '#aaa', marginTop: 6 }}>
                                                {notif.date}
                                            </div>
                                        </div>
                                    )) : (
                                        <div style={{
                                            padding: '40px 16px',
                                            textAlign: 'center',
                                            color: '#aaa',
                                            fontSize: '0.875rem',
                                        }}>
                                            <Bell size={28} style={{ opacity: 0.2, marginBottom: 8 }} />
                                            <div>No notifications yet</div>
                                        </div>
                                    )}
                                </div>
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
                            transition: 'background 0.2s, border-color 0.2s',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = '#FAF7F4';
                            e.currentTarget.style.borderColor = '#c8c0b8';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.borderColor = '#E8E2DC';
                        }}
                    >
                        <div style={{
                            width: 36, height: 36,
                            background: 'linear-gradient(135deg, #F5E6E8, #EDD5D8)',
                            borderRadius: 10,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#6D2932',
                            fontWeight: 800,
                            fontSize: '0.95rem',
                            flexShrink: 0,
                            border: '1.5px solid rgba(109,41,50,0.15)',
                        }}>
                            {user?.fullName?.charAt(0)}
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                color: '#1A1310',
                                lineHeight: 1.2,
                            }}>
                                {user?.fullName?.split(' ')[0]}
                            </div>
                            <div style={{
                                fontSize: '0.72rem',
                                color: '#6B6460',
                                textTransform: 'capitalize',
                            }}>
                                {user?.role}
                            </div>
                        </div>
                        <ChevronDown
                            size={14}
                            style={{
                                color: '#6B6460',
                                transform: showProfile ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s',
                            }}
                        />
                    </button>

                    <AnimatePresence>
                        {showProfile && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                style={{
                                    position: 'absolute', right: 0, top: 52,
                                    width: 200,
                                    background: 'white',
                                    borderRadius: 14,
                                    boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
                                    border: '1px solid #E8E2DC',
                                    overflow: 'hidden',
                                    zIndex: 300,
                                    padding: '6px',
                                }}
                            >
                                {/* User info in dropdown */}
                                <div style={{
                                    padding: '10px 12px 12px',
                                    borderBottom: '1px solid #E8E2DC',
                                    marginBottom: 4,
                                }}>
                                    <div style={{
                                        fontSize: '0.82rem',
                                        fontWeight: 700,
                                        color: '#1A1310',
                                    }}>
                                        {user?.fullName}
                                    </div>
                                    <div style={{
                                        fontSize: '0.72rem',
                                        color: '#9A8A7A',
                                        marginTop: 2,
                                    }}>
                                        ID: {user?.nationalId}
                                    </div>
                                </div>

                                <Link
                                    to="/dashboard/profile"
                                    onClick={() => setShowProfile(false)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        padding: '10px 12px',
                                        borderRadius: 8,
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        color: '#1A1310',
                                        textDecoration: 'none',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#FAF7F4'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <UserIcon size={16} /> View Profile
                                </Link>

                                <div style={{ height: 1, background: '#E8E2DC', margin: '4px 0' }} />

                                <button
                                    onClick={logout}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        padding: '10px 12px',
                                        borderRadius: 8,
                                        width: '100%',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        color: '#DC2626',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default Header;
