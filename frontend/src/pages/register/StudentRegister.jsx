import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronRight, ChevronLeft, Check, User, Phone, BookOpen, Users, FileText, Lock } from 'lucide-react';
import AuthLayout from '../../components/Layout/AuthLayout';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

const steps = [
    { id: 1, title: 'Basic Details', icon: User },
    { id: 2, title: 'Contact', icon: Phone },
    { id: 3, title: 'Academic', icon: BookOpen },
    { id: 4, title: 'Parent', icon: Users },
    { id: 5, title: 'Other', icon: FileText },
    { id: 6, title: 'Account', icon: Lock },
];

const StudentRegister = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                ...formData,
                role: 'student'
            });
            localStorage.setItem('token', response.data.token);
            navigate('/student-home');
        } catch (err) {
            alert(err.response?.data?.message || 'Registration failed');
        }
    };

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6">Student Basic Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Full Name" name="fullName" placeholder="John Doe" onChange={handleChange} />
                            <Select label="Gender" name="gender" options={["Male", "Female", "Other"]} onChange={handleChange} />
                            <Input label="Date of Birth" name="dob" type="date" onChange={handleChange} />
                            <Input label="Age" name="age" type="number" placeholder="18" onChange={handleChange} />
                            <Input label="Student ID / Roll Number" name="studentId" placeholder="REQ123456" onChange={handleChange} />
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Mobile Number" name="mobile" placeholder="9876543210" onChange={handleChange} />
                            <Input label="Email ID" name="email" type="email" placeholder="john@example.com" onChange={handleChange} />
                        </div>
                        <Input label="Address" name="address" placeholder="123 Main St" onChange={handleChange} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input label="City / District" name="city" placeholder="New York" onChange={handleChange} />
                            <Input label="State" name="state" placeholder="NY" onChange={handleChange} />
                            <Input label="Pincode" name="pincode" placeholder="10001" onChange={handleChange} />
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Academic Details</h3>
                        <Input label="School / College Name" name="school" placeholder="University of Tech" onChange={handleChange} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Course / Department" name="course" placeholder="B.Tech CS" onChange={handleChange} />
                            <Select label="Class / Year / Semester" name="year" options={["1st Year", "2nd Year", "3rd Year", "4th Year"]} onChange={handleChange} />
                            <Select label="Registered Category" name="category" options={["MRB", "AIAPGET"]} onChange={handleChange} />
                            <Input label="Register Number" name="regNo" placeholder="REG-2024-001" onChange={handleChange} />
                            <Input label="Academic Year" name="academicYear" placeholder="2024-2025" onChange={handleChange} />
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Parent / Guardian Details</h3>
                        <Input label="Father / Mother / Guardian Name" name="parentName" placeholder="Parent Name" onChange={handleChange} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Parent Mobile Number" name="parentMobile" placeholder="9876543210" onChange={handleChange} />
                            <Input label="Occupation" name="occupation" placeholder="Engineer" onChange={handleChange} />
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Other Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select label="Blood Group" name="bloodGroup" options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]} onChange={handleChange} />
                            <Input label="Nationality" name="nationality" placeholder="Indian" onChange={handleChange} />
                            <Input label="Religion / Community (Optional)" name="religion" placeholder="Hindu / BC" onChange={handleChange} />
                            <Select label="Hostel / Day Scholar" name="residenceType" options={["Hosteller", "Day Scholar"]} onChange={handleChange} />
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Account Setup</h3>
                        <Input label="Email (Login Username)" name="loginEmail" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} />
                        <Input label="Password" name="password" type="password" placeholder="Create a strong password" onChange={handleChange} />
                        <Input label="Confirm Password" name="confirmPassword" type="password" placeholder="Repeat password" onChange={handleChange} />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <AuthLayout title="Student Registration" subtitle="Join our academic community">
            <div className="mb-8">
                {/* Progress Bar */}
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10" />
                    <div
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-[#0F172A] transition-all duration-300 -z-10"
                        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    />

                    {steps.map((step) => {
                        const Icon = step.icon;
                        const isActive = step.id === currentStep;
                        const isCompleted = step.id < currentStep;

                        return (
                            <div key={step.id} className="flex flex-col items-center gap-2">
                                <motion.div
                                    initial={false}
                                    animate={{
                                        scale: isActive ? 1.2 : 1,
                                        backgroundColor: isActive || isCompleted ? '#0F172A' : '#fff',
                                        borderColor: isActive || isCompleted ? '#0F172A' : '#e5e7eb'
                                    }}
                                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-colors duration-300 ${isActive || isCompleted ? 'text-white' : 'text-gray-400'}`}
                                >
                                    {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                                </motion.div>
                                <span className={`text-xs font-semibold ${isActive ? 'text-[#0F172A]' : 'text-gray-400'}`}>
                                    {step.title}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="min-h-[300px]"
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>

                <div className="flex gap-4 mt-8 pt-4 border-t border-gray-100">
                    {currentStep > 1 && (
                        <Button onClick={prevStep} variant="outline" className="flex-1">
                            <ChevronLeft size={20} /> Previous
                        </Button>
                    )}

                    {currentStep < steps.length ? (
                        <Button onClick={nextStep} className="flex-1 !bg-[#0F172A] !hover:bg-[#1e293b] !shadow-[#0F172A]/20">
                            Next <ChevronRight size={20} />
                        </Button>
                    ) : (
                        <Button type="submit" className="flex-1 !bg-[#0F172A] !hover:bg-[#1e293b] !shadow-[#0F172A]/20">
                            Complete Registration <Check size={20} />
                        </Button>
                    )}
                </div>
            </form>

            <div className="text-center mt-6">
                <p className="text-sm text-gray-500">
                    Already have an account? <Link to="/login/student" className="text-[#0F172A] font-medium hover:underline">Sign in</Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default StudentRegister;
