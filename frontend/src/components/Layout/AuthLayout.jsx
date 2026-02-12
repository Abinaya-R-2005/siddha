import React from 'react';
import { motion } from 'framer-motion';

const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row font-sans">
            {/* Left Side: Branding */}
            <div className="hidden md:flex md:w-5/12 bg-black text-white flex-col justify-center p-0 relative overflow-hidden">
                <div className="relative z-10 w-full h-full flex items-center justify-center p-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="w-full max-w-sm"
                    >
                        <motion.div
                            animate={{
                                y: [0, -5, 0],
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="bg-white p-2 rounded-[2rem] shadow-2xl shadow-white/5"
                        >
                            <img
                                src="/LOGO.jpeg"
                                alt="JCL Siddha Academy Logo"
                                className="w-full h-full object-contain rounded-[1.8rem]"
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side: Form Area */}
            <div className="flex-1 bg-white flex flex-col items-center justify-center p-4 md:p-8 lg:p-12 overflow-hidden relative">

                {/* Mobile Logo */}
                <div className="md:hidden mb-8 flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-2 rounded-2xl shadow-xl border border-gray-100"
                    >
                        <img
                            src="/LOGO.jpeg"
                            alt="Logo"
                            className="w-20 h-20 object-contain rounded-xl"
                        />
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-lg relative z-10 px-2 md:px-0"
                >
                    <div className="bg-white rounded-[2.5rem] p-4 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 relative overflow-hidden">
                        <div className="relative z-20">
                            {children}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AuthLayout;
