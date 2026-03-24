import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { User, Search, Calendar, ClipboardList, LifeBuoy, Info, X, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
    const { user, logout } = useAuth();

    const menuItems = [
        { name: "Profile", path: "/dashboard/profile", icon: <User size={18} /> },
        { name: "Doctor Availability", path: "/dashboard/doctors", icon: <Search size={18} /> },
        { name: "Appointments", path: "/dashboard/appointments", icon: <Calendar size={18} /> },
        { name: "Consultation", path: "/dashboard/consultation", icon: <ClipboardList size={18} /> },
        { name: "Support", path: "/dashboard/support", icon: <LifeBuoy size={18} /> },
        { name: "About", path: "/dashboard/about", icon: <Info size={18} /> },
    ];

    // ── Listen for screen resize ──
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 900;
            setIsMobile(mobile);
            if (!mobile) setIsOpen(false); // close drawer on desktop
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // ── Close sidebar when route changes on mobile ──
    const handleNavClick = () => {
        if (isMobile) setIsOpen(false);
    };

    const sidebarContent = (
        <aside style={{
            width: '260px',
            height: '100vh',
            background: '#fff',
            borderRight: '1px solid #E8E2DC',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            position: 'relative',
            zIndex: 101,
        }}>
            {/* Logo */}
            <div style={{
                padding: '28px 20px 20px',
                borderBottom: '1px solid #E8E2DC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: 38, height: 38,
                        background: '#6D2932',
                        borderRadius: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 900, fontSize: '1.1rem',
                        flexShrink: 0,
                        boxShadow: '0 4px 12px rgba(109,41,50,0.25)',
                    }}>M</div>
                    <span style={{
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        color: '#561C24',
                        letterSpacing: '-0.02em',
                    }}>MediConnect</span>
                </div>

                {/* Close button — mobile only */}
                {isMobile && (
                    <button
                        onClick={() => setIsOpen(false)}
                        style={{
                            background: '#FAF7F4',
                            border: 'none',
                            borderRadius: 8,
                            width: 32, height: 32,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: '#6D2932',
                        }}
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* User info */}
            {user && (
                <div style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #E8E2DC',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                }}>
                    <div style={{
                        width: 36, height: 36,
                        borderRadius: '50%',
                        background: '#F5E6E8',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#6D2932', fontWeight: 800, fontSize: '0.9rem',
                        flexShrink: 0,
                    }}>
                        {user.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1A1008' }}>
                            {user.fullName}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#7A6A58', textTransform: 'capitalize' }}>
                            {user.role}
                        </div>
                    </div>
                </div>
            )}

            {/* Nav */}
            <nav style={{
                padding: '16px 12px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
            }}>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={handleNavClick}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '12px 16px',
                            borderRadius: 10,
                            fontSize: '0.875rem',
                            fontWeight: isActive ? 700 : 600,
                            color: isActive ? '#6D2932' : '#6B6460',
                            background: isActive ? '#F5E6E8' : 'transparent',
                            textDecoration: 'none',
                            transition: 'all 0.18s ease',
                        })}
                        onMouseEnter={e => {
                            if (!e.currentTarget.getAttribute('aria-current')) {
                                e.currentTarget.style.background = '#F5E6E8';
                                e.currentTarget.style.color = '#6D2932';
                            }
                        }}
                        onMouseLeave={e => {
                            if (!e.currentTarget.getAttribute('aria-current')) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#6B6460';
                            }
                        }}
                    >
                        <span style={{ flexShrink: 0, opacity: 0.85 }}>{item.icon}</span>
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div style={{ padding: '16px 16px 24px', borderTop: '1px solid #E8E2DC' }}>
                <div style={{
                    background: '#FAF7F4',
                    borderRadius: 12,
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                }}>
                    <p style={{ fontSize: '0.72rem', color: '#000', fontWeight: 800 }}>
                        Your health data is safe.
                    </p>
                </div>

                {/* Logout button */}

            </div>
        </aside>
    );

    // ── DESKTOP — always visible ──
    if (!isMobile) {
        return (
            <div style={{ position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100 }}>
                {sidebarContent}
            </div>
        );
    }

    // ── MOBILE — hamburger + slide-in drawer ──
    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    top: 16, left: 16,
                    zIndex: 200,
                    background: '#6D2932',
                    border: 'none',
                    borderRadius: 10,
                    width: 42, height: 42,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(109,41,50,0.3)',
                }}
            >
                <Menu size={20} color="white" />
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(26,16,8,0.45)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 100,
                        animation: 'fadeIn 0.2s ease',
                    }}
                />
            )}

            {/* Slide-in Drawer */}
            <div style={{
                position: 'fixed',
                top: 0, left: 0,
                height: '100vh',
                zIndex: 101,
                transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
                {sidebarContent}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
            `}</style>
        </>
    );
};

export default Sidebar;