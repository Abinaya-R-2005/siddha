import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Mail, Lock, GraduationCap, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import AuthLayout from '../components/Layout/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Login = () => {
    const navigate = useNavigate(); // Initialize navigate
    const [role, setRole] = useState('student');
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (newRole) => {
        setRole(newRole);
    };

    // New function to handle the login submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { ...formData, role });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            if (user.role === 'admin') {
                navigate('/admin');
            } else if (user.role === 'student') {
                navigate('/student-home');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <AuthLayout>
            <div className="w-full">
                <div className="flex bg-[#F1F5F9] p-1 rounded-xl mb-6 w-fit mx-auto md:mx-0 shadow-inner">
                    <button
                        onClick={() => handleRoleChange('student')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all duration-300 ${role === 'student'
                            ? 'bg-white text-[#0A1629] shadow-md font-bold'
                            : 'text-gray-500 hover:text-gray-800'
                            }`}
                    >
                        <GraduationCap size={20} className={role === 'student' ? 'text-[#0A1629]' : 'text-gray-400'} />
                        <span className="text-sm tracking-wide">Student</span>
                    </button>
                    <button
                        onClick={() => handleRoleChange('faculty')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all duration-300 ${role === 'faculty'
                            ? 'bg-[#0F172A] text-white shadow-xl font-bold'
                            : 'text-gray-500 hover:text-gray-800'
                            }`}
                    >
                        <ShieldCheck size={20} className={role === 'faculty' ? 'text-cyan-400' : 'text-gray-400'} />
                        <span className="text-sm tracking-wide">Faculty</span>
                    </button>
                </div>

                <div className="mb-8">
                    <h2 className="text-3xl font-serif font-black text-[#0A1629] mb-2 tracking-tight">Welcome Back</h2>
                    <p className="text-gray-500 text-base leading-relaxed max-w-sm">
                        Sign in to access your {role === 'student' ? 'educational' : 'administrative'} dashboard
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            placeholder="scholar@siddha.edu"
                            icon={Mail}
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            icon={Lock}
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm py-1">
                        <label className="flex items-center text-gray-600 cursor-pointer group">
                            <input
                                type="checkbox"
                                className="mr-2 w-4 h-4 rounded-md border-gray-300 text-[#0F172A] focus:ring-[#0F172A]/20 transition-all cursor-pointer"
                            />
                            <span className="group-hover:text-gray-900 transition-colors">Remember me</span>
                        </label>
                        <button type="button" className="font-bold text-[#0F172A] hover:text-cyan-600 transition-colors">
                            Forgot password?
                        </button>
                    </div>

                    <Button type="submit" className="w-full !py-3 !rounded-xl !bg-[#0F172A] hover:!bg-[#1e293b] !text-base !font-bold !shadow-lg !shadow-[#0F172A]/20">
                        Sign In
                    </Button>

                    <div className="text-center mt-6 text-gray-500 font-medium">
                        Don't have an account?{' '}
                        <Link
                            to={`/register/${role}`}
                            className="text-[#0F172A] hover:text-cyan-600 font-bold"
                        >
                            Request Access
                        </Link>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
};

export default Login;