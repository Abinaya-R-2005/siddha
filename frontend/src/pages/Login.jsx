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
            } else if (user.role === 'faculty') {
                navigate('/dashboard');
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
                <div className="flex bg-[#F1F3F5] p-1 rounded-2xl mb-8 w-full max-w-[300px] mx-auto md:mx-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] border border-gray-200/50">
                    <button
                        type="button"
                        onClick={() => handleRoleChange('student')}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-400 ${role === 'student'
                            ? 'bg-white text-black shadow-md font-bold'
                            : 'text-gray-500 hover:text-gray-800'
                            }`}
                    >
                        <GraduationCap size={16} className={role === 'student' ? 'text-black' : 'text-gray-400'} />
                        <span className="text-[13px] font-bold tracking-tight">Student</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleRoleChange('faculty')}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-400 ${role === 'faculty'
                            ? 'bg-black text-white shadow-md font-bold scale-[1.02]'
                            : 'text-gray-500 hover:text-gray-800'
                            }`}
                    >
                        <ShieldCheck size={16} className={role === 'faculty' ? 'text-white' : 'text-gray-400'} />
                        <span className="text-[13px] font-bold tracking-tight">Faculty</span>
                    </button>
                </div>

                <div className="mb-8">
                    <h2 className="text-3xl font-serif font-black text-black mb-2 tracking-tight">Welcome Back</h2>
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
                                className="mr-2 w-4 h-4 rounded-md border-gray-300 text-black focus:ring-black/20 transition-all cursor-pointer"
                            />
                            <span className="group-hover:text-black transition-colors">Remember me</span>
                        </label>
                        <button type="button" className="font-bold text-black hover:text-gray-700 transition-colors">
                            Forgot password?
                        </button>
                    </div>

                    <Button type="submit" className="w-full !py-3 !rounded-xl !bg-black hover:!bg-gray-800 !text-white !text-base !font-bold !shadow-lg">
                        Sign In
                    </Button>

                    <div className="text-center mt-6 text-gray-500 font-medium">
                        Don't have an account?{' '}
                        <Link
                            to={`/register/${role}`}
                            className="text-black hover:text-gray-700 font-bold"
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