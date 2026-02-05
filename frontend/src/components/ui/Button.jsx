import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, type = "button", variant = "primary", className, disabled }) => {
    const variants = {
        primary: "bg-[#B35900] text-white shadow-[#B35900]/20 hover:bg-[#A35200]",
        secondary: "bg-white text-[#B35900] border-2 border-[#B35900]/10 hover:bg-orange-50",
        outline: "border-2 border-gray-100 text-gray-600 hover:border-gray-200 hover:bg-gray-50",
        ghost: "text-[#B35900] hover:bg-orange-50",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
        w-full py-4 px-6 rounded-xl font-bold text-base
        shadow-lg transition-all duration-200 flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
        >
            {children}
        </motion.button>
    );
};

export default Button;
