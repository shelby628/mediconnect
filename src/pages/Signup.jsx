import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import PremiumModal from '../components/common/PremiumModal';

const Signup = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        dob: '',
        nationalId: '',
        gender: 'Male',
        phone: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await signup(formData);
        if (result.success) {
            navigate('/dashboard');
        } else {
            const msg = result.message || '';
            if (msg.toLowerCase().includes("already")) {
                setShowModal(true);
            } else {
                setError(msg);
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center section-padding pt-24">
            <Link to="/" className="absolute top-10 left-10 flex items-center gap-2 text-primary font-bold hover:text-primary-dark transition-colors">
                <ArrowLeft size={20} /> Home
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl"
            >
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black mb-2">Create Account</h1>
                    <p className="text-text-muted font-medium">Please enter your details to register</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center mb-6 text-sm font-bold border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/40 p-10 rounded-[2.5rem] backdrop-blur-sm border border-white/20 shadow-xl">
                    <div className="md:col-span-2">
                        <label className="input-label">Full Name</label>
                        <input name="fullName" type="text" required className="input-premium" value={formData.fullName} onChange={handleChange} />
                    </div>

                    <div>
                        <label className="input-label">Date of Birth</label>
                        <input name="dob" type="date" required className="input-premium" value={formData.dob} onChange={handleChange} />
                    </div>

                    <div>
                        <label className="input-label">National ID</label>
                        <input name="nationalId" type="text" required className="input-premium" value={formData.nationalId} onChange={handleChange} />
                    </div>

                    <div>
                        <label className="input-label">Gender</label>
                        <select name="gender" className="input-premium appearance-none" value={formData.gender} onChange={handleChange}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="input-label">Phone</label>
                        <input name="phone" type="tel" required className="input-premium" value={formData.phone} onChange={handleChange} />
                    </div>

                    <div className="md:col-span-2 relative">
                        <label className="input-label">Password</label>
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            className="input-premium pr-14"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-[42px] text-text-muted hover:text-primary transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <div className="md:col-span-2 pt-6">
                        <button type="submit" disabled={loading} className="btn-premium w-full h-16 text-lg justify-center">
                            {loading ? "Processing..." : "Create Account"}
                        </button>
                    </div>

                    <p className="md:col-span-2 text-center text-sm font-semibold text-text-muted mt-4">
                        Already have an account? <Link to="/login" className="text-primary hover:underline">Sign In</Link>
                    </p>
                </form>
            </motion.div>

            <PremiumModal
                isOpen={showModal}
                title="ACCOUNT ALREADY CREATED"
                message="An account with this National ID or email already exists. Please sign in to access your dashboard."
                onAction={() => navigate('/login')}
                onClose={() => setShowModal(false)}
            />
        </div>
    );
};

export default Signup;
