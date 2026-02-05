import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, GraduationCap, ShieldCheck, ChevronRight } from 'lucide-react';
import AuthLayout from '../components/Layout/AuthLayout';

const RoleCard = ({ icon: Icon, title, description, to, color }) => (
    <Link to={to} className="w-full">
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 flex items-center gap-6 group cursor-pointer"
        >
            <div className={`p-4 rounded-xl ${color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={32} />
            </div>
            <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{title}</h3>
                <p className="text-gray-500 text-sm">{description}</p>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all duration-300" />
        </motion.div>
    </Link>
);

const Home = () => {
    return (
        <AuthLayout
            title="Welcome to Portals"
            subtitle="Select your role to continue"
        >
            <div className="grid gap-6">
                <RoleCard
                    icon={GraduationCap}
                    title="Student"
                    description="Access courses, grades, and academic profile"
                    to="/login/student"
                    color="bg-gradient-to-br from-blue-500 to-cyan-500"
                />
                <RoleCard
                    icon={User}
                    title="Faculty"
                    description="Manage classes, students, and curriculum"
                    to="/login/faculty"
                    color="bg-gradient-to-br from-indigo-500 to-purple-500"
                />
                <RoleCard
                    icon={ShieldCheck}
                    title="Admin"
                    description="System administration and management"
                    to="/login/admin"
                    color="bg-gradient-to-br from-rose-500 to-orange-500"
                />
            </div>
        </AuthLayout>
    );
};

export default Home;
