import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Stethoscope, Users, ClipboardList, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { name: "Manage Doctors", path: "/admin/doctors", icon: <Stethoscope size={18} /> },
        { name: "Manage Patients", path: "/admin/patients", icon: <Users size={18} /> },
        { name: "Consultations", path: "/admin/consultations", icon: <ClipboardList size={18} /> },
    ];

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <aside style={{ position: 'fixed', top: 0, left: 0, width: '260px', height: '100vh', background: '#1A1310', display: 'flex', flexDirection: 'column', zIndex: 100, overflowY: 'auto' }}>
            <div style={{ padding: '28px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 38, height: 38, background: '#6D2932', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '1.1rem', flexShrink: 0, boxShadow: '0 4px 12px rgba(109,41,50,0.4)' }}>M</div>
                    <div>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>MediConnect</div>
                        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#6D2932', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Admin Panel</div>
                    </div>
                </div>
            </div>

            <nav style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {menuItems.map((item) => (
                    <NavLink key={item.path} to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '13px 16px', borderRadius: 10,
                            fontSize: '0.875rem', fontWeight: isActive ? 700 : 500,
                            color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                            background: isActive ? '#6D2932' : 'transparent',
                            textDecoration: 'none', transition: 'all 0.18s ease',
                        })}
                        onMouseEnter={e => { if (!e.currentTarget.getAttribute('aria-current')) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; } }}
                        onMouseLeave={e => { if (!e.currentTarget.getAttribute('aria-current')) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; } }}
                    >
                        <span style={{ flexShrink: 0 }}>{item.icon}</span>
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div style={{ padding: '16px 12px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderRadius: 10, width: '100%', fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.15)'; e.currentTarget.style.color = '#f87171'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                ><LogOut size={18} /> Logout</button>
            </div>
        </aside>
    );
};

export default AdminSidebar;