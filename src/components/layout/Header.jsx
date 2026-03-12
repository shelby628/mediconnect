import React, { useState } from 'react';
import { Bell, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Header = () => {
    const { user, logout } = useAuth();
    const { notifications, markRead } = useData();
    const [showNotifs, setShowNotifs] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header style={{
            height: 72,
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

            {/* Left — Welcome */}
            <div style={{ flex: 1 }}>
                <h2 style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: '#6B6460',
                    whiteSpace: 'nowrap',
                    margin: 0,
                }}>
                    Welcome,{' '}
                    <span style={{ color: '#6D2932', fontWeight: 800 }}>
                        {user?.fullName?.split(' ')[0]}
                    </span>
                </h2>
            </div>

            {/* Right — Bell + Profile */}
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
                                    <span style={{ fontWeight: 800, fontSize: '0.875rem' }}>Notifications</span>
                                    <span style={{ fontSize: '0.75rem', color: '#6D2932', fontWeight: 700, cursor: 'pointer' }}>
                                        Mark all as read
                                    </span>
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
                                            }}
                                        >
                                            <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: 4 }}>{notif.title}</div>
                                            <div style={{ fontSize: '0.78rem', color: '#6B6460' }}>{notif.message}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#aaa', marginTop: 6 }}>{notif.date}</div>
                                        </div>
                                    )) : (
                                        <div style={{ padding: '32px 16px', textAlign: 'center', color: '#aaa', fontSize: '0.875rem' }}>
                                            No notifications yet.
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
                        onMouseEnter={e => { e.currentTarget.style.background = '#FAF7F4'; e.currentTarget.style.borderColor = '#c8c0b8'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#E8E2DC'; }}
                    >
                        <div style={{
                            width: 36, height: 36,
                            background: '#F5E6E8',
                            borderRadius: 10,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#6D2932',
                            fontWeight: 800,
                            fontSize: '0.95rem',
                            flexShrink: 0,
                        }}>
                            {user?.fullName?.charAt(0)}
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1A1310', lineHeight: 1.2 }}>
                                {user?.fullName}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#6B6460', textTransform: 'capitalize' }}>
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
                                    width: 190,
                                    background: 'white',
                                    borderRadius: 14,
                                    boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
                                    border: '1px solid #E8E2DC',
                                    overflow: 'hidden',
                                    zIndex: 300,
                                    padding: '6px',
                                }}
                            >
                                <Link
                                    to="/dashboard/profile"
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