import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    User,
    Search,
    Calendar,
    ClipboardList,
    LifeBuoy,
    Info,
    LayoutDashboard
} from 'lucide-react';

const Sidebar = () => {
    const menuItems = [
        { name: "Profile", path: "/dashboard/profile", icon: <User size={20} /> },
        { name: "Doctor Availability", path: "/dashboard/doctors", icon: <Search size={20} /> },
        { name: "Appointments", path: "/dashboard/appointments", icon: <Calendar size={20} /> },
        { name: "Consultation", path: "/dashboard/consultation", icon: <ClipboardList size={20} /> },
        { name: "Customer Care", path: "/dashboard/support", icon: <LifeBuoy size={20} /> },
        { name: "About", path: "/dashboard/about", icon: <Info size={20} /> }
    ];

    return (
        <aside className="layout-sidebar border-r border-neutral-100 flex flex-col justify-between py-10">
            <div className="space-y-12">
                <div className="px-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">M</div>
                    <span className="text-2xl font-bold brand-gradient tracking-tight">MediConnect</span>
                </div>

                <nav className="px-4 space-y-2">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-medium ${isActive
                                    ? 'bg-primary-light text-primary-dark shadow-sm'
                                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-primary transition-colors hover:translate-x-1'
                                }`
                            }
                        >
                            {item.icon}
                            <span className="text-sm">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="px-8 mt-auto pt-8 border-t border-neutral-100/50">
                <div className="p-4 bg-neutral-50/50 rounded-2xl space-y-3 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-x-12 -translate-y-12 transition-transform group-hover:scale-150"></div>
                    <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Storage Used</div>
                    <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden">
                        <div className="h-full w-14 bg-primary rounded-full"></div>
                    </div>
                    <p className="text-[10px] text-neutral-500">Your health data is safe.</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
