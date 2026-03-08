import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Search, Filter, Calendar, MapPin, Clock, X, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { departments } from '../../data/mockData';

const DoctorAvailability = () => {
    const { doctors, bookAppointment } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDept, setSelectedDept] = useState('All');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [bookingData, setBookingData] = useState({ date: '', time: '', notes: '' });
    const [bookingStep, setBookingStep] = useState(1); // 1: form, 2: success

    const filteredDoctors = doctors.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = selectedDept === 'All' || doc.department === selectedDept;
        return matchesSearch && matchesDept;
    });

    const handleBook = (e) => {
        e.preventDefault();
        bookAppointment(selectedDoctor, `${bookingData.date}T${bookingData.time}`, bookingData.notes);
        setBookingStep(2);
        setTimeout(() => {
            setSelectedDoctor(null);
            setBookingStep(1);
            setBookingData({ date: '', time: '', notes: '' });
        }, 2500);
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Doctor Availability</h1>
                    <p className="text-neutral-500 text-lg">Find and book appointments with our specialists</p>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap gap-4 p-6 bg-white rounded-3xl shadow-sm border border-neutral-100">
                <div className="flex-1 min-w-[300px] relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or specialty..."
                        className="w-full pl-12 h-14 bg-neutral-50 rounded-2xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-[250px] relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <select
                        className="w-full pl-12 h-14 bg-neutral-50 rounded-2xl appearance-none"
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                    >
                        <option value="All">All Departments</option>
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
            </div>

            {/* Grid of Doctors */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredDoctors.map((doc) => (
                    <motion.div
                        layout
                        key={doc.id}
                        className="card group hover:shadow-xl hover:-translate-y-1 transition-all p-0 overflow-hidden"
                    >
                        <div className={`h-3 ${doc.status === 'Available' ? 'bg-primary' : doc.status === 'Fully Booked' ? 'bg-orange-400' : 'bg-red-400'}`}></div>
                        <div className="p-8 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center text-primary-dark font-bold text-2xl group-hover:bg-primary-light transition-colors">
                                    {doc.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${doc.status === 'Available' ? 'bg-primary-light text-primary-dark' :
                                        doc.status === 'Fully Booked' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
                                    }`}>
                                    {doc.status}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{doc.name}</h3>
                                <p className="text-sm text-neutral-500 font-medium">{doc.specialty}</p>
                                <div className="flex items-center gap-2 mt-4 text-xs text-neutral-400 uppercase tracking-widest font-bold">
                                    <MapPin size={14} className="text-primary" /> {doc.department}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-neutral-50">
                                <button
                                    disabled={doc.status !== 'Available'}
                                    onClick={() => setSelectedDoctor(doc)}
                                    className={`w-full btn ${doc.status === 'Available' ? 'btn-primary' : 'btn-secondary opacity-50 cursor-not-allowed'} justify-center`}
                                >
                                    Book Appointment
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Booking Modal */}
            <AnimatePresence>
                {selectedDoctor && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedDoctor(null)}
                            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
                        ></motion.div>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden relative"
                        >
                            {bookingStep === 1 ? (
                                <div className="p-10 space-y-8">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h2 className="text-2xl font-bold">Book Appointment</h2>
                                            <p className="text-neutral-500">With {selectedDoctor.name}</p>
                                        </div>
                                        <button onClick={() => setSelectedDoctor(null)} className="p-2 hover:bg-neutral-100 rounded-xl transition-colors">
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleBook} className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="input-group">
                                                <label className="text-sm font-bold text-neutral-700 mb-2 block uppercase tracking-wider">Date</label>
                                                <div className="relative">
                                                    <input
                                                        type="date"
                                                        required
                                                        className="w-full h-14 bg-neutral-50 px-4 rounded-xl border border-neutral-100"
                                                        value={bookingData.date}
                                                        onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="input-group">
                                                <label className="text-sm font-bold text-neutral-700 mb-2 block uppercase tracking-wider">Time</label>
                                                <div className="relative">
                                                    <input
                                                        type="time"
                                                        required
                                                        className="w-full h-14 bg-neutral-50 px-4 rounded-xl border border-neutral-100"
                                                        value={bookingData.time}
                                                        onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="input-group">
                                            <label className="text-sm font-bold text-neutral-700 mb-2 block uppercase tracking-wider">Notes (Optional)</label>
                                            <textarea
                                                className="w-full p-4 h-32 bg-neutral-50 rounded-xl border border-neutral-100 resize-none"
                                                placeholder="E.g. Symptoms, previous history..."
                                                value={bookingData.notes}
                                                onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                                            ></textarea>
                                        </div>

                                        <button className="w-full btn btn-primary h-14 justify-center text-lg shadow-xl shadow-primary/20">
                                            Confirm Booking
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="p-16 text-center space-y-6">
                                    <div className="w-24 h-24 bg-primary-light text-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                        <Check size={48} />
                                    </div>
                                    <h2 className="text-3xl font-bold">Booking Successful!</h2>
                                    <p className="text-neutral-500">Your appointment request has been sent to the hospital for approval. You'll be notified soon.</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DoctorAvailability;
