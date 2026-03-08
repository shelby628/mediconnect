import React, { useState } from 'react';
import { Bell, User as UserIcon, LogOut, Settings, ChevronDown } from 'lucide-react';
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
        <header className="h-[80px] border-b border-neutral-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-neutral-800">Welcome, <span className="text-primary">{user?.fullName?.split(' ')[0]}</span></h2>
            </div>

            <div className="flex items-center gap-6">
                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); }}
                        className="p-3 rounded-xl bg-neutral-100 text-neutral-500 hover:text-primary transition-all relative"
                    >
                        <Bell size={22} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
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
                                className="absolute right-0 mt-4 w-[350px] bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden"
                            >
                                <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
                                    <span className="font-bold text-sm">Notifications</span>
                                    <span className="text-xs text-primary font-semibold cursor-pointer">Mark all as read</span>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map(notif => (
                                            <div
                                                key={notif.id}
                                                onClick={() => markRead(notif.id)}
                                                className={`p-4 border-b border-neutral-50 cursor-pointer hover:bg-neutral-50 transition-colors ${!notif.read ? 'bg-primary/5' : ''}`}
                                            >
                                                <div className="text-sm font-bold mb-1">{notif.title}</div>
                                                <div className="text-xs text-neutral-500 line-clamp-2">{notif.message}</div>
                                                <div className="text-[10px] text-neutral-400 mt-2">{notif.date}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-neutral-400 text-sm">No notifications yet.</div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Profile */}
                <div className="relative">
                    <button
                        onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }}
                        className="flex items-center gap-3 p-2 pr-4 rounded-xl hover:bg-neutral-50 transition-all border border-transparent hover:border-neutral-200"
                    >
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold">
                            {user?.fullName?.charAt(0)}
                        </div>
                        <div className="hidden md:block text-left">
                            <div className="text-sm font-bold text-neutral-800 leading-tight">{user?.fullName}</div>
                            <div className="text-xs text-neutral-500 capitalize">{user?.role}</div>
                        </div>
                        <ChevronDown size={14} className={`text-neutral-400 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {showProfile && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-4 w-[200px] bg-white rounded-2xl shadow-2xl border border-neutral-100 py-2"
                            >
                                <Link to="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-all">
                                    <UserIcon size={18} /> View Profile
                                </Link>
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-all border-t border-neutral-50 mt-2"
                                >
                                    <LogOut size={18} /> Logout
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
