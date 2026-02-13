import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({ label, type = "text", placeholder, icon: Icon, value, onChange, name, className, required }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <div className={`w-full mb-5 ${className}`}>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-0.5">
                {label}
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    {Icon && <Icon className={`h-5 w-5 transition-colors duration-200 ${isFocused ? 'text-black' : 'text-gray-400'}`} />}
                </div>
                <input
                    type={inputType}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    required={required}
                    className={`
            block w-full ${Icon ? 'pl-11' : 'pl-4'} pr-11 py-3 
            border rounded-xl text-base text-gray-900
            outline-none transition-all duration-200
            ${isFocused
                            ? 'border-black ring-4 ring-black/5 bg-white shadow-sm'
                            : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                        }
          `}
                    placeholder={placeholder}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-black transition-colors duration-200"
                    >
                        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Input;
