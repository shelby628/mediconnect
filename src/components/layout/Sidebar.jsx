import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    User,
    Search,
    Calendar,
    ClipboardList,
    LifeBuoy,
    Info,
} from 'lucide-react';

const Sidebar = () => {
    const menuItems = [
        { name: "Profile", path: "/dashboard/profile", icon: <User size={18} /> },
        { name: "Doctor Availability", path: "/dashboard/doctors", icon: <Search size={18} /> },
        { name: "Appointments", path: "/dashboard/appointments", icon: <Calendar size={18} /> },
        { name: "Consultation", path: "/dashboard/consultation", icon: <ClipboardList size={18} /> },
        { name: "Customer Care", path: "/dashboard/support", icon: <LifeBuoy size={18} /> },
        { name: "About", path: "/dashboard/about", icon: <Info size={18} /> },
    ];

    return (
        <aside style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '260px',
            height: '100vh',
            background: '#fff',
            borderRight: '1px solid #E8E2DC',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 100,
            overflowY: 'auto',
        }}>
            {/* Logo */}
            <div style={{ padding: '28px 20px 20px', borderBottom: '1px solid #E8E2DC' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: 38, height: 38,
                        background: '#6D2932',
                        borderRadius: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 900, fontSize: '1.1rem',
                        flexShrink: 0,
                        boxShadow: '0 4px 12px rgba(109,41,50,0.25)',
                    }}></div>
                    <span style={{
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        color: '#561C24',
                        letterSpacing: '-0.02em',
                    }}>MediConnect</span>
                </div>
            </div>

            {/* Nav */}
            <nav style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '14px 16px',
                            borderRadius: 10,
                            fontSize: '0.875rem',
                            fontWeight: isActive ? 700 : 600,
                            color: isActive ? '#6D2932' : '#6B6460',
                            background: isActive ? '#F5E6E8' : 'transparent',
                            textDecoration: 'none',
                            transition: 'all 0.18s ease',
                            border: 'none',
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

            {/* Footer / Storage */}
            <div style={{ padding: '16px 16px 24px', borderTop: '1px solid #E8E2DC' }}>
                <div style={{
                    background: '#FAF7F4',
                    borderRadius: 12,
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6B6460' }}>
                        Storage Used
                    </div>
                    <div style={{ height: 6, background: '#E8E2DC', borderRadius: 100, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: '22%', background: '#6D2932', borderRadius: 100 }}></div>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: '#6B6460', fontWeight: 500 }}>Your health data is safe.</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;