import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [formData, setFormData] = useState({ fullName: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(formData.fullName, formData.password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center section-padding">
            <Link to="/" className="absolute top-10 left-10 flex items-center gap-2 text-primary font-bold hover:text-primary-dark transition-colors">
                <ArrowLeft size={20} /> Home
            </Link>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black mb-2">Welcome Back</h1>
                    <p className="text-text-muted font-medium">Please sign in to your account</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center mb-6 text-sm font-bold border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white/40 p-10 rounded-[2.5rem] backdrop-blur-sm border border-white/20 shadow-xl space-y-6">
                    <div>
                        <label className="input-label">Full Name</label>
                        <input
                            type="text"
                            required
                            className="input-premium"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="input-label">Password</label>
                        <input
                            type="password"
                            required
                            className="input-premium"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <div className="pt-4">
                        <button disabled={loading} className="btn-premium w-full h-16 text-lg justify-center">
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </div>

                    <p className="text-center text-sm font-semibold text-text-muted mt-4">
                        Don't have an account? <Link to="/signup" className="text-primary hover:underline">Register Now</Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
