import React from 'react';
import { Info, MapPin, Phone, Mail, Clock, ShieldCheck, HeartPulse, Building2 } from 'lucide-react';

const About = () => {
    return (
        <div className="space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto">
                    <Info size={40} />
                </div>
                <h1 className="text-5xl font-black tracking-tight">About <span className="brand-gradient">MediConnect</span></h1>
                <p className="text-xl text-neutral-500 leading-relaxed">
                    MediConnect is a next-generation hospital management system designed to bridge the gap between patients and quality healthcare.
                    Our mission is to eliminate wait times and empower patients with 24/7 access to medical services.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <Building2 className="text-primary" /> Hospital Information
                    </h2>
                    <div className="card grid grid-cols-1 md:grid-cols-2 gap-8 shadow-xl">
                        <ContactItem icon={<MapPin />} label="Address" value="123 Health Avenue, Medical District, Nairobi, Kenya" />
                        <ContactItem icon={<Phone />} label="Emergency Phone" value="+254 711 000 999" />
                        <ContactItem icon={<Mail />} label="Email Support" value="help@mediconnect.com" />
                        <ContactItem icon={<Clock />} label="Operating Hours" value="24/7 Emergency Services" />
                    </div>
                </div>

                {/* Departments */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <HeartPulse className="text-secondary" /> Our Departments
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {["Cardiology", "Neurology", "Pediatrics", "Orthopedics", "General Medicine", "Dermatology", "Oncology", "Radiology"].map(dept => (
                            <div key={dept} className="p-4 bg-white rounded-2xl border border-neutral-100 flex items-center gap-3 shadow-sm hover:border-primary/20 transition-all cursor-default group">
                                <div className="w-2 h-2 rounded-full bg-primary group-hover:scale-150 transition-transform"></div>
                                <span className="font-bold text-sm text-neutral-700">{dept}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Philosophy */}
            <div className="card bg-neutral-900 text-white p-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div className="space-y-4">
                        <div className="text-primary font-bold text-4xl">100+</div>
                        <div className="text-neutral-400 font-bold uppercase tracking-widest text-xs">Specialized Doctors</div>
                    </div>
                    <div className="space-y-4">
                        <div className="text-secondary font-bold text-4xl">50k+</div>
                        <div className="text-neutral-400 font-bold uppercase tracking-widest text-xs">Happy Patients</div>
                    </div>
                    <div className="space-y-4">
                        <div className="text-accent font-bold text-4xl">15+</div>
                        <div className="text-neutral-400 font-bold uppercase tracking-widest text-xs">Medical Centers</div>
                    </div>
                </div>
                <div className="mt-12 flex items-center justify-center gap-4 text-primary font-bold">
                    <ShieldCheck size={20} /> ISO 27001 Certified for Health Data Security
                </div>
            </div>
        </div>
    );
};

const ContactItem = ({ icon, label, value }) => (
    <div className="flex gap-4">
        <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-400">
            {React.cloneElement(icon, { size: 20 })}
        </div>
        <div>
            <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider mb-1">{label}</div>
            <div className="text-sm font-bold text-neutral-800 leading-relaxed">{value}</div>
        </div>
    </div>
);

export default About;
