import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronRight, ChevronLeft, Check, User, Phone, BookOpen, Briefcase, Building, FileText, Lock } from 'lucide-react';
import AuthLayout from '../../components/Layout/AuthLayout';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

const steps = [
    { id: 1, title: 'Personal', icon: User },
    { id: 2, title: 'Contact', icon: Phone },
    { id: 3, title: 'Education', icon: BookOpen },
    { id: 4, title: 'Professional', icon: Briefcase },
    { id: 5, title: 'Employment', icon: Building },
    { id: 6, title: 'Other & Docs', icon: FileText },
    { id: 7, title: 'Login Setup', icon: Lock },
];

const FacultyRegister = () => {
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
                role: 'faculty'
            });
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
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
                        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6">Personal Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Full Name" name="fullName" placeholder="Dr. Jane Smith" onChange={handleChange} />
                            <Select label="Gender" name="gender" options={["Male", "Female", "Other"]} onChange={handleChange} />
                            <Input label="Date of Birth" name="dob" type="date" onChange={handleChange} />
                            <Input label="Age" name="age" type="number" placeholder="35" onChange={handleChange} />
                            <Input label="Faculty ID (Auto/Manual)" name="facultyId" placeholder="FAC-2024-001" onChange={handleChange} />
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Mobile Number" name="mobile" placeholder="9876543210" onChange={handleChange} />
                            <Input label="Email ID" name="email" type="email" placeholder="jane@example.com" onChange={handleChange} />
                        </div>
                        <Input label="Current Address" name="currentAddress" placeholder="123 Faculty Lane" onChange={handleChange} />
                        <Input label="Permanent Address" name="permanentAddress" placeholder="456 Home Town" onChange={handleChange} />
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Educational Qualification</h3>
                        <Select label="Highest Qualification" name="qualification" options={["UG", "PG", "PhD"]} onChange={handleChange} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Degree & Specialization" name="degree" placeholder="M.Sc Computer Science" onChange={handleChange} />
                            <Input label="Year of Passing" name="yearPassing" placeholder="2015" onChange={handleChange} />
                        </div>
                        <Input label="University / Institution Name" name="university" placeholder="Example University" onChange={handleChange} />
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Professional Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select label="Designation" name="designation" options={["Assistant Prof", "Associate Prof", "Professor"]} onChange={handleChange} />
                            <Input label="Department" name="department" placeholder="Computer Science" onChange={handleChange} />
                            <Input label="Teaching Experience (Years)" name="teachingExp" type="number" placeholder="5" onChange={handleChange} />
                            <Input label="Industry Experience (Years)" name="industryExp" type="number" placeholder="2" onChange={handleChange} />
                        </div>
                        <Input label="Area of Expertise" name="expertise" placeholder="AI, Machine Learning, Web Dev" onChange={handleChange} />
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Employment Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Date of Joining" name="doj" type="date" onChange={handleChange} />
                            <Select label="Employment Type" name="empType" options={["Full-time", "Part-time", "Guest"]} onChange={handleChange} />
                            <Input label="Salary Grade (Optional)" name="salaryGrade" placeholder="Grade A" onChange={handleChange} />
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Other & Documents</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select label="Blood Group" name="bloodGroup" options={["A+", "A-", "O+", "O-"]} onChange={handleChange} />
                            <Input label="Nationality" name="nationality" placeholder="Indian" onChange={handleChange} />
                            <Input label="Aadhar / ID Number" name="aadhar" placeholder="1234 5678 9012" onChange={handleChange} />
                        </div>

                        <div className="space-y-3 pt-4 border-t border-gray-100">
                            <p className="text-sm font-medium text-gray-700">Document Upload</p>
                            <Input label="Passport Size Photo" name="photo" type="file" onChange={handleChange} />
                            <Input label="Resume / CV" name="resume" type="file" onChange={handleChange} />
                            <Input label="Certificates (PDF)" name="certificates" type="file" onChange={handleChange} />
                        </div>
                    </div>
                );
            case 7:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Login Details</h3>
                        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6">Login Details</h3>
                        <Input label="Username / Email" name="loginUser" placeholder="jane.smith" onChange={handleChange} />
                        <Input label="Password" name="password" type="password" placeholder="Create password" onChange={handleChange} />
                        <Input label="Confirm Password" name="confirmPassword" type="password" placeholder="Confirm password" onChange={handleChange} />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <AuthLayout title="Faculty Registration" subtitle="Join our academic staff">
            <div className="mb-8">
                {/* Progress Bar */}
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10" />
                    <div
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-[#0A1629] transition-all duration-300 -z-10"
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
                                        backgroundColor: isActive || isCompleted ? '#0A1629' : '#fff',
                                        borderColor: isActive || isCompleted ? '#0A1629' : '#e5e7eb'
                                    }}
                                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-colors duration-300 ${isActive || isCompleted ? 'text-white' : 'text-gray-400'}`}
                                >
                                    {isCompleted ? <Check size={20} /> : <Icon size={16} />}
                                </motion.div>
                                {/* Hide title on small screens for faculty form due to many steps */}
                                <span className={`hidden md:block text-xs font-semibold ${isActive ? 'text-[#0A1629]' : 'text-gray-400'}`}>
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
                        <Button onClick={nextStep} className="flex-1 !bg-[#0A1629] !hover:bg-[#060e1a] !shadow-[#0A1629]/20">
                            Next <ChevronRight size={20} />
                        </Button>
                    ) : (
                        <Button type="submit" className="flex-1 !bg-[#0A1629] !hover:bg-[#060e1a] !shadow-[#0A1629]/20">
                            Complete Registration <Check size={20} />
                        </Button>
                    )}
                </div>
            </form>

            <div className="text-center mt-8">
                <p className="text-sm text-gray-500 font-medium">
                    Already have an account? <Link to="/login" className="text-[#0A1629] font-bold hover:underline">Sign in</Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default FacultyRegister;
