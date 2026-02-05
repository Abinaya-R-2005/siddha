import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const Select = ({ label, options, value, onChange, name, placeholder, icon: Icon }) => {
    return (
        <div className="w-full mb-6 relative">
            <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                {label}
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {Icon && <Icon className="h-5 w-5 text-gray-400" />}
                </div>
                <motion.select
                    whileFocus={{ scale: 1.01 }}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={`
            block w-full pl-10 pr-10 py-3 
            border-2 border-gray-200 rounded-xl text-base 
            outline-none transition-all duration-200
            appearance-none bg-gray-50/50
            focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:shadow-lg
            hover:border-gray-300
          `}
                >
                    <option value="" disabled>{placeholder || "Select an option"}</option>
                    {options.map((option) => (
                        <option key={option.value || option} value={option.value || option}>
                            {option.label || option}
                        </option>
                    ))}
                </motion.select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
            </div>
        </div>
    );
};

export default Select;
