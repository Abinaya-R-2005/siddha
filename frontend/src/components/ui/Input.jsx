import React, { useState } from 'react';

const Input = ({ label, type = "text", placeholder, icon: Icon, value, onChange, name, className }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className={`w-full mb-5 ${className}`}>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-0.5">
                {label}
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    {Icon && <Icon className={`h-5 w-5 transition-colors duration-200 ${isFocused ? 'text-[#B35900]' : 'text-gray-400'}`} />}
                </div>
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`
            block w-full pl-11 pr-4 py-3 
            border rounded-xl text-base 
            outline-none transition-all duration-200
            ${isFocused
                            ? 'border-[#B35900] ring-4 ring-[#B35900]/5 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }
          `}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
};

export default Input;
