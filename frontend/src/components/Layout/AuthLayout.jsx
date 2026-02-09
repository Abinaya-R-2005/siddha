import React from 'react';
import { motion } from 'framer-motion';

const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row">
            {/* Left Side: Branding */}
            <div className="hidden md:flex md:w-5/12 bg-navy text-white flex-col justify-center p-12 lg:p-20 relative overflow-hidden">
                {/* Subtle decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-1/4 -left-20 w-80 h-80 border border-white rounded-full" />
                    <div className="absolute bottom-1/4 -right-20 w-80 h-80 border border-white rounded-full opacity-50" />
                </div>

                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-10"
                >
     <motion.div
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="relative z-10"
>
    

    
    <div className="mt-12 h-1 w-24 bg-gradient-to-r from-cyan-500 to-transparent rounded-full" />
</motion.div>
                    <h1 className="text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
                        JCL Siddha Academy
                    </h1>
                    <p className="text-xl lg:text-2xl text-blue-200 font-light max-w-md">
                        The Modern Archive of Ancient Wisdom
                    </p>

                    <div className="mt-12 h-1 w-24 bg-gradient-to-r from-cyan-500 to-transparent rounded-full" />
                </motion.div>
            </div>

            {/* Right Side: Form Area */}
            <div className="flex-1 bg-white flex flex-col items-center justify-center p-6 md:p-12 lg:p-20 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-lg"
                >
                    {children}
                </motion.div>
            </div>
        </div>
    );
};

export default AuthLayout;
