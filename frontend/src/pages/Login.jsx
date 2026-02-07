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
                <div className="flex bg-gray-100 p-1 rounded-2xl mb-10 w-fit mx-auto md:mx-0">
                    <button
                        onClick={() => handleRoleChange('student')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${role === 'student'
                            ? 'bg-white text-gray-800 shadow-sm font-bold'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <GraduationCap size={20} />
                        <span>Student Scholar</span>
                    </button>
                    <button
                        onClick={() => handleRoleChange('faculty')}
                        className={`flex items-center gap-2 px-6 py-4 rounded-xl transition-all duration-300 ${role === 'faculty'
                            ? 'bg-[#0A1629] text-white shadow-lg font-bold'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <ShieldCheck size={20} />
                        <span>Admin Faculty</span>
                    </button>
                </div>

                <div className="mb-10">
                    <h2 className="text-4xl font-serif font-bold text-gray-900 mb-2">Welcome Back</h2>
                    <p className="text-gray-500">
                        Sign in to access your {role === 'student' ? 'educational' : 'administrative'} dashboard
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}> {/* Added onSubmit */}
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

                    <div className="flex items-center justify-between text-sm mb-8">
                        <label className="flex items-center text-gray-600 cursor-pointer">
                            <input type="checkbox" className="mr-2 w-4 h-4 rounded border-gray-300 text-[#0A1629] focus:ring-[#0A1629]/20" />
                            Remember me
                        </label>
                        <button type="button" className="font-semibold text-[#0A1629] hover:text-[#060e1a] transition-colors">
                            Forgot password?
                        </button>
                    </div>

                    <Button type="submit" className="w-full !bg-[#0A1629] !hover:bg-[#060e1a] !shadow-[#0A1629]/20">
                        Sign In
                    </Button>

                    <div className="text-center mt-8 text-gray-500 font-medium">
                        Don't have an account?{' '}
                        <Link
                            to={`/register/${role}`}
                            className="text-[#0A1629] hover:underline font-bold"
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