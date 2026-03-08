import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, History, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
    return (
        <div className="min-h-screen">
            {/* Navbar */}
            <nav className="px-[10%] py-12 flex items-center bg-transparent absolute top-0 w-full z-50">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-3xl">M</div>
                    <span className="text-4xl font-black text-primary-dark tracking-tighter">MediConnect</span>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="min-h-screen flex flex-col items-center justify-center text-center section-padding pt-32">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl"
                >
                    <h1 className="hero-title">
                        Modern Care for <br />
                        <span className="text-primary italic">Modern Patients</span>
                    </h1>
                    <p className="sub-title mx-auto mb-12">
                        MediConnect is a smart hospital management system designed to reduce queues and streamline your healthcare journey with elegant, digital-first solutions.
                    </p>
                    <Link to="/signup" className="btn-premium text-lg px-12 py-5">
                        Get Started <ArrowRight size={22} />
                    </Link>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="section-padding bg-[#DECFB5]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard
                            icon={<Search size={28} />}
                            title="Doctor Availability"
                            description="Real-time status of doctors across all hospital departments."
                        />
                        <FeatureCard
                            icon={<Calendar size={28} />}
                            title="Smart Booking"
                            description="Secure your appointment instantly with our intuitive booking system."
                        />
                        <FeatureCard
                            icon={<History size={28} />}
                            title="Consultation History"
                            description="Keep a private, digital record of every visit and medical note."
                        />
                        <FeatureCard
                            icon={<ShieldCheck size={28} />}
                            title="Secure Medical Records"
                            description="Your data is encrypted and protected with industry-leading security."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 text-center text-text-muted text-sm border-t border-white/10">
                &copy; 2024 MediConnect. Elegant Healthcare Solutions.
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="glass-card flex flex-col items-start gap-6">
        <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center">
            {icon}
        </div>
        <div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-text-muted leading-relaxed text-sm">{description}</p>
        </div>
    </div>
);

export default LandingPage;
