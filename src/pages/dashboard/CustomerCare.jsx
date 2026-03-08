import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { LifeBuoy, Plus, Search, Tag, MessageSquare, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomerCare = () => {
    const { tickets, addTicket } = useData();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ subject: '', type: 'Technical', message: '' });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(() => {
            addTicket(formData);
            setSubmitting(false);
            setShowForm(false);
            setFormData({ subject: '', type: 'Technical', message: '' });
        }, 1500);
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Customer Care</h1>
                    <p className="text-neutral-500 text-lg">We're here to help you 24/7</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn btn-primary shadow-xl shadow-primary/20"
                >
                    <Plus size={20} /> Create New Ticket
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <SupportStat cardClass="bg-primary/5" icon={<MessageSquare className="text-primary" />} label="Total Tickets" value={tickets.length} />
                <SupportStat cardClass="bg-orange-50" icon={<Clock className="text-orange-500" />} label="Pending Response" value={tickets.filter(t => t.status === 'Pending').length} />
                <SupportStat cardClass="bg-green-50" icon={<CheckCircle2 className="text-green-500" />} label="Resolved Tickets" value={tickets.filter(t => t.status === 'Resolved' || t.status === 'Responded').length} />
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-2xl font-bold">Recent Tickets</h2>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                            <input type="text" placeholder="Search tickets..." className="pl-10 h-10 w-64 bg-white rounded-xl border border-neutral-100 text-sm" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {tickets.map(ticket => (
                        <motion.div
                            layout
                            key={ticket.id}
                            className="card p-6 flex items-center justify-between hover:bg-neutral-50 transition-colors border-l-4 border-l-primary"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center text-neutral-400 font-bold">
                                    {ticket.type[0]}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-sm font-bold text-neutral-800">{ticket.subject}</span>
                                        <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest px-2 py-0.5 bg-neutral-100 rounded-full">{ticket.id}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                                        <span className="flex items-center gap-1"><Tag size={12} /> {ticket.type}</span>
                                        <span className="flex items-center gap-1"><Clock size={12} /> {ticket.date}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <span className={`badge ${ticket.status === 'Pending' ? 'badge-warning' :
                                        ticket.status === 'Responded' ? 'badge-info' : 'badge-success'
                                    }`}>
                                    {ticket.status}
                                </span>
                                <button className="text-neutral-300 hover:text-primary transition-colors">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* New Ticket Modal */}
            <AnimatePresence>
                {showForm && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowForm(false)}
                            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
                        ></motion.div>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg p-12 space-y-8 relative"
                        >
                            <h2 className="text-3xl font-bold tracking-tight">How can we help?</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="input-group">
                                    <label className="text-sm font-bold text-neutral-700 uppercase mb-2">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full h-14 bg-neutral-50 rounded-xl px-4"
                                        placeholder="Brief summary of the issue"
                                        value={formData.subject}
                                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="text-sm font-bold text-neutral-700 uppercase mb-2">Ticket Type</label>
                                    <select
                                        className="w-full h-14 bg-neutral-50 rounded-xl px-4"
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option>Technical</option>
                                        <option>Appointment</option>
                                        <option>Billing</option>
                                        <option>Medical Record</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label className="text-sm font-bold text-neutral-700 uppercase mb-2">Message</label>
                                    <textarea
                                        required
                                        className="w-full p-4 h-40 bg-neutral-50 rounded-xl resize-none"
                                        placeholder="Describe your issue in detail..."
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className="flex gap-4">
                                    <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary flex-1 h-14">Cancel</button>
                                    <button disabled={submitting} className="btn btn-primary flex-1 h-14 justify-center">
                                        {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Submit Ticket'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const SupportStat = ({ icon, label, value, cardClass }) => (
    <div className={`card p-6 flex items-center gap-6 ${cardClass} border-transparent shadow-none`}>
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
            {icon}
        </div>
        <div>
            <div className="text-xs text-neutral-500 font-bold uppercase tracking-wider">{label}</div>
            <div className="text-3xl font-black text-neutral-800">{value}</div>
        </div>
    </div>
);

export default CustomerCare;
