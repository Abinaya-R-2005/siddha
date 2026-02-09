import React from 'react';
import { motion } from 'framer-motion';

const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row font-sans">
            {/* Left Side: Branding */}
            <div className="hidden md:flex md:w-5/12 bg-[#0A1629] text-white flex-col justify-center p-12 lg:p-20 relative overflow-hidden">
                {/* Subtle decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.1, 0.15, 0.1]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/4 -left-20 w-80 h-80 border border-white rounded-full"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.05, 0.1, 0.05]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-1/4 -right-20 w-80 h-80 border border-white rounded-full"
                    />
                </div>

                <div className="relative z-10 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="mb-8"
                    >
                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="bg-white p-4 rounded-3xl shadow-2xl shadow-cyan-500/20"
                        >
                            <img
                                src="/LOGO.jpeg"
                                alt="JCL Siddha Academy Logo"
                                className="w-40 h-40 object-contain rounded-2xl"
                            />
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-4 leading-tight">
                            JCL <span className="text-cyan-400">Siddha</span> Academy
                        </h1>
                        <p className="text-lg lg:text-xl text-blue-200/80 font-light max-w-md mx-auto">
                            The Modern Archive of Ancient Wisdom
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: 96 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="mt-8 h-1 bg-gradient-to-r from-cyan-500 to-transparent rounded-full"
                    />
                </div>
            </div>

            {/* Right Side: Form Area */}
            <div className="flex-1 bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8 lg:p-12 overflow-hidden">
                {/* Mobile Logo */}
                <div className="md:hidden mb-4 flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-2.5 rounded-2xl shadow-lg mb-3"
                    >
                        <img
                            src="/LOGO.jpeg"
                            alt="Logo"
                            className="w-14 h-14 object-contain rounded-lg"
                        />
                    </motion.div>
                    <h2 className="text-xl font-serif font-bold text-[#0A1629]">JCL Siddha Academy</h2>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-lg"
                >
                    <div className="bg-white md:shadow-2xl md:shadow-gray-200/50 rounded-[2rem] p-6 md:p-10">
                        {children}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AuthLayout;
