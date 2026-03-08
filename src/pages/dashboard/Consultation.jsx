import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ClipboardList, MessageSquare, History, User, ExternalLink, Calendar, Check, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Consultation = () => {
    const { consultations, requestFollowUp, addTicket } = useData();
    const [showFollowUp, setShowFollowUp] = useState(false);
    const [selectedConsultation, setSelectedConsultation] = useState(null);
    const [followUpData, setFollowUpData] = useState({ date: '', time: '' });
    const [questionData, setQuestionData] = useState({ subject: '', dept: 'General Medicine', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleFollowUp = (e) => {
        e.preventDefault();
        requestFollowUp(selectedConsultation.doctor, followUpData.date, followUpData.time);
        setShowFollowUp(false);
        setSelectedConsultation(null);
    };

    const handleAskQuestion = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(() => {
            addTicket({
                subject: questionData.subject,
                type: "Technical", // Simplified
                message: questionData.message
            });
            setQuestionData({ subject: '', dept: 'General Medicine', message: '' });
            setSubmitting(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1500);
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Consultation</h1>
                    <p className="text-neutral-500 text-lg">Your medical history and follow-up requests</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* History Table */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary"><History size={24} /></div>
                        <h2 className="text-2xl font-bold">Past Consultations</h2>
                    </div>

                    <div className="table-container shadow-xl">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Doctor / Department</th>
                                    <th>Notes</th>
                                    <th>Follow-up</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {consultations.map(c => (
                                    <tr key={c.id} className="hover:bg-neutral-50 transition-colors">
                                        <td className="font-bold text-neutral-800">{c.date}</td>
                                        <td>
                                            <div className="font-bold">{c.doctor}</div>
                                            <div className="text-xs text-neutral-400">{c.department}</div>
                                        </td>
                                        <td>
                                            <div className="text-sm text-neutral-500 line-clamp-1 max-w-[200px]" title={c.notes}>{c.notes}</div>
                                        </td>
                                        <td>
                                            <span className={`badge ${c.followUp === 'Yes' ? 'badge-warning' : 'badge-info'}`}>
                                                {c.followUp === 'Yes' ? 'Required' : 'None'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => { setSelectedConsultation(c); setShowFollowUp(true); }}
                                                className="btn btn-secondary p-2 rounded-xl text-primary hover:bg-primary-light"
                                            >
                                                <ExternalLink size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Ask a Question Form */}
                <div className="lg:col-span-1">
                    <div className="card shadow-xl border-t-8 border-primary space-y-8 h-fit">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary"><MessageSquare size={24} /></div>
                            <h2 className="text-2xl font-bold">Ask a Question</h2>
                        </div>
                        <p className="text-sm text-neutral-500">Have a concern or need clarification? Ask our experts directly.</p>

                        <form onSubmit={handleAskQuestion} className="space-y-6">
                            <div className="input-group">
                                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Subject</label>
                                <input
                                    type="text"
                                    placeholder="E.g. Medication inquiry"
                                    className="w-full h-12 bg-neutral-50 rounded-xl"
                                    value={questionData.subject}
                                    onChange={(e) => setQuestionData({ ...questionData, subject: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Department</label>
                                <select
                                    className="w-full h-12 bg-neutral-50 rounded-xl"
                                    value={questionData.dept}
                                    onChange={(e) => setQuestionData({ ...questionData, dept: e.target.value })}
                                >
                                    <option>General Medicine</option>
                                    <option>Cardiology</option>
                                    <option>Neurology</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Message</label>
                                <textarea
                                    className="w-full p-4 h-32 bg-neutral-50 rounded-xl resize-none"
                                    placeholder="Type your question..."
                                    value={questionData.message}
                                    onChange={(e) => setQuestionData({ ...questionData, message: e.target.value })}
                                    required
                                ></textarea>
                            </div>

                            <button disabled={submitting} className="w-full btn btn-primary h-14 justify-center text-lg shadow-lg shadow-primary/20">
                                {submitting ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    showSuccess ? <><Check size={20} /> Sent!</> : <><Send size={20} /> Send Question</>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Follow-up Modal */}
            <AnimatePresence>
                {showFollowUp && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowFollowUp(false)}
                            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
                        ></motion.div>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 space-y-8 relative"
                        >
                            <h2 className="text-2xl font-bold">Request Follow-up</h2>
                            <p className="text-neutral-500">Requesting a follow-up for your visit with <strong>{selectedConsultation.doctor}</strong></p>

                            <form onSubmit={handleFollowUp} className="space-y-6">
                                <div className="input-group">
                                    <label className="text-sm font-bold text-neutral-700 mb-2 block uppercase tracking-wider">Preferred Date</label>
                                    <input type="date" required className="w-full h-14 bg-neutral-50 rounded-xl" onChange={e => setFollowUpData({ ...followUpData, date: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label className="text-sm font-bold text-neutral-700 mb-2 block uppercase tracking-wider">Preferred Time</label>
                                    <input type="time" required className="w-full h-14 bg-neutral-50 rounded-xl" onChange={e => setFollowUpData({ ...followUpData, time: e.target.value })} />
                                </div>
                                <button className="w-full btn btn-primary h-14 shadow-xl shadow-primary/20">Submit Request</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Consultation;
