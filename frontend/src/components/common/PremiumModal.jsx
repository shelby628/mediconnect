import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowRight } from 'lucide-react';

const PremiumModal = ({ isOpen, title, message, onClose, onAction }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-dark-accent/40 backdrop-blur-md"
                    ></motion.div>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 30 }}
                        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-10 text-center relative z-10"
                    >
                        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-primary-dark mb-4">{title}</h2>
                        <p className="text-text-muted mb-8 font-medium">{message}</p>
                        <button
                            onClick={onAction || onClose}
                            className="btn-premium w-full h-14"
                        >
                            Continue to Login <ArrowRight size={20} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PremiumModal;
