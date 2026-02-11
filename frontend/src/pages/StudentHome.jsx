import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    GraduationCap,
    CheckCircle2,
    Clock,
    BookOpen,
    Target,
    Phone,
    Mail,
    MapPin,
    ChevronRight,
    ArrowRight,
    Send,
    Award,
    User,
    LogOut,
    Sparkles,
    TrendingUp,
    Users,
    Zap
} from 'lucide-react';

const StudentHome = () => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 font-sans text-slate-900 overflow-x-hidden">
            {/* Floating Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-xl z-50 border-b border-white/20 shadow-lg shadow-slate-900/5">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3"
                        >
                            <div className="bg-white p-1 rounded-xl shadow-lg border border-slate-100">
                                <img src="/LOGO.jpeg" alt="Logo" className="w-10 h-10 object-contain rounded-lg" />
                            </div>
                            <div>
                                <span className="text-xl font-serif font-bold tracking-tight text-[#0F172A] block">JCL Siddha Academy</span>
                                <span className="text-xs text-blue-600 font-semibold">Excellence in Education</span>
                            </div>
                        </motion.div>
                        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
                            <a href="#about" className="hover:text-blue-600 transition-colors relative group">
                                About
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all"></span>
                            </a>
                            <a href="#features" className="hover:text-blue-600 transition-colors relative group">
                                Methodology
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all"></span>
                            </a>
                            <a href="#faq" className="hover:text-blue-600 transition-colors relative group">
                                FAQ
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all"></span>
                            </a>
                            <a href="#contact" className="hover:text-blue-600 transition-colors relative group">
                                Contact
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all"></span>
                            </a>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link to="/dashboard" className="flex items-center gap-2 text-sm font-bold text-[#0F172A] hover:text-blue-600 transition-colors px-4 py-2 rounded-xl hover:bg-blue-50">
                                <User size={18} />
                                Dashboard
                            </Link>
                            <button onClick={handleLogout} className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-red-500/30 transition-all">
                                <LogOut size={18} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200/50 text-blue-700 text-sm font-bold mb-8"
                            >
                                <Sparkles size={16} className="animate-pulse" />
                                JCL Siddha Academy
                            </motion.div>

                            <h1 className="text-6xl md:text-7xl font-serif font-bold text-[#0F172A] leading-tight mb-6">
                                We Build Your{' '}
                                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Journey
                                </span>{' '}
                                Easy
                            </h1>

                            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                                Join us and prepare smarter for your exams with expert guidance, structured tests, and consistent support.
                            </p>

                            {/* Success Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="relative bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white/40 shadow-2xl shadow-blue-500/10 mb-10 overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-2xl"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl">
                                            <TrendingUp className="text-white" size={24} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-[#0F172A]">Your Success Begins Here</h3>
                                    </div>
                                    <p className="text-lg text-slate-600 mb-6">
                                        Prepare confidently for <span className="font-bold text-blue-600">MRB & AIAPGET</span> exams
                                    </p>
                                    <div className="grid grid-cols-1 gap-3">
                                        {[
                                            { icon: CheckCircle2, text: 'Online Classes', color: 'from-green-500 to-emerald-600' },
                                            { icon: Send, text: 'Daily Practice Questions in Telegram', color: 'from-blue-500 to-cyan-600' },
                                            { icon: Clock, text: 'Timed Tests & Discussions', color: 'from-purple-500 to-pink-600' }
                                        ].map((item, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 + idx * 0.1 }}
                                                className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-100 hover:shadow-lg transition-all group"
                                            >
                                                <div className={`bg-gradient-to-br ${item.color} p-2 rounded-lg group-hover:scale-110 transition-transform`}>
                                                    <item.icon className="text-white" size={20} />
                                                </div>
                                                <span className="font-semibold text-slate-700">{item.text}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <motion.a
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    href="#contact"
                                    className="bg-gradient-to-r from-[#0F172A] to-blue-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-2xl shadow-blue-900/30 hover:shadow-blue-900/50 transition-all group"
                                >
                                    Enquire Now
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                </motion.a>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link to="/dashboard" className="bg-white/80 backdrop-blur-sm text-[#0F172A] border-2 border-slate-200 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50 transition-all">
                                        Go to Dashboard
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Animated Cards */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="relative"
                        >
                            <div className="relative aspect-square">
                                {/* Main Card */}
                                <motion.div
                                    animate={{ y: [0, -15, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-0 left-0 right-20 bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-[3rem] shadow-2xl"
                                >
                                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="bg-white/20 p-3 rounded-xl">
                                                <Award className="text-white" size={32} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-xl">MRB</h4>
                                                <p className="text-blue-100 text-sm">Medical Recruitment</p>
                                            </div>
                                        </div>
                                        <p className="text-white/90 text-sm leading-relaxed">Elite coaching for Medical Recruitment Board exams</p>
                                    </div>
                                    <div className="mt-4 bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="bg-white/20 p-3 rounded-xl">
                                                <Target className="text-white" size={32} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-xl">AIAPGET</h4>
                                                <p className="text-blue-100 text-sm">Post Graduate Entrance</p>
                                            </div>
                                        </div>
                                        <p className="text-white/90 text-sm leading-relaxed">Master your AIAPGET journey with our expert guidance</p>
                                    </div>
                                </motion.div>

                                {/* Floating Card 1 */}
                                <motion.div
                                    animate={{ y: [0, 20, 0], rotate: [0, 5, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                    className="absolute bottom-0 right-0 left-20 bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/40"
                                >
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-xl">
                                            <CheckCircle2 className="text-white" size={24} />
                                        </div>
                                        <h4 className="font-bold text-[#0F172A] text-lg">Online Classes</h4>
                                    </div>
                                    <p className="text-slate-600 text-sm">Learn from anywhere, anytime</p>
                                </motion.div>

                                {/* Stats Badge */}
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="absolute top-10 right-0 bg-gradient-to-br from-purple-500 to-pink-600 text-white px-6 py-4 rounded-2xl shadow-xl"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <Users size={20} />
                                        <span className="text-2xl font-bold">500+</span>
                                    </div>
                                    <p className="text-xs text-purple-100">Active Students</p>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Methodology Section */}
            <section id="features" className="relative py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-blue-600 font-bold text-sm tracking-widest uppercase mb-4 inline-block">Our Approach</span>
                        <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#0F172A] mb-4">
                            Preparation <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Methodology</span>
                        </h2>
                        <p className="text-slate-600 text-lg italic">Competitive exams demand clarity, speed, and accuracy</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative bg-gradient-to-br from-[#0F172A] via-blue-900 to-indigo-900 p-12 rounded-[3rem] overflow-hidden shadow-2xl"
                    >
                        {/* Animated Background */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="bg-blue-500/20 p-3 rounded-2xl">
                                    <Zap className="text-blue-400" size={32} />
                                </div>
                                <h3 className="text-3xl font-serif font-bold text-white">Our Focus Areas</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { icon: Target, text: 'Repeated exposure to exam-level questions', color: 'from-blue-400 to-cyan-500' },
                                    { icon: BookOpen, text: 'Understanding concepts through answers', color: 'from-purple-400 to-pink-500' },
                                    { icon: Sparkles, text: 'Learning how questions are framed in exams', color: 'from-green-400 to-emerald-500' },
                                    { icon: TrendingUp, text: 'Improving confidence through practice', color: 'from-orange-400 to-red-500' }
                                ].map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/15 transition-all group cursor-pointer"
                                    >
                                        <div className={`bg-gradient-to-br ${item.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                                            <item.icon className="text-white" size={24} />
                                        </div>
                                        <span className="text-lg text-white font-semibold">{item.text}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="relative py-24 px-6 bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-blue-600 font-bold text-sm tracking-widest uppercase mb-4 inline-block">About Us</span>
                        <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#0F172A]">
                            About <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">JCL Siddha Academy</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                JCL Siddha Academy is committed to guiding students toward success in competitive medical entrance and recruitment examinations. Our goal is to make preparation simple, smart, and effective through well-planned teaching and regular assessments.
                            </p>
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 mb-8">
                                <p className="text-lg text-slate-700 italic font-semibold">
                                    "We believe every student can succeed with the right direction, practice, and motivation."
                                </p>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { icon: Award, title: 'Our Vision', desc: 'To create confident, well-prepared professionals through quality education and disciplined preparation.', color: 'from-blue-500 to-cyan-600' },
                                    { icon: Target, title: 'Our Mission', desc: 'To provide affordable and effective coaching, focus on exam-oriented preparation, and support students at every stage of learning.', color: 'from-indigo-500 to-purple-600' }
                                ].map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.2 }}
                                        className="flex gap-6 bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-100 hover:shadow-xl transition-all group"
                                    >
                                        <div className={`bg-gradient-to-br ${item.color} p-4 rounded-2xl h-fit group-hover:scale-110 transition-transform`}>
                                            <item.icon className="text-white" size={28} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#0F172A] text-xl mb-2">{item.title}</h4>
                                            <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl">
                                <div className="bg-gradient-to-br from-[#0F172A] via-blue-900 to-indigo-900 p-16 aspect-[4/5] flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
                                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
                                    </div>
                                    <div className="relative z-10 text-center">
                                        <motion.div
                                            animate={{ rotate: [0, 5, -5, 0] }}
                                            transition={{ duration: 6, repeat: Infinity }}
                                        >
                                            <GraduationCap size={120} className="text-blue-400 opacity-30 mx-auto mb-8" />
                                        </motion.div>
                                        <h3 className="text-4xl font-serif text-white italic leading-relaxed">
                                            "Simplifying Success for Every Student"
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="relative py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-blue-600 font-bold text-sm tracking-widest uppercase mb-4 inline-block">FAQ</span>
                        <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#0F172A] mb-4">
                            Frequently Asked <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Questions</span>
                        </h2>
                        <p className="text-slate-600 italic">Got questions? We have answers.</p>
                    </motion.div>

                    <div className="space-y-4">
                        {[
                            { q: 'What is the teaching method followed here?', a: 'We follow a question–answer based preparation method. Students practice exam-oriented questions and learn concepts through clear, structured answers.' },
                            { q: 'Are classes conducted online or offline?', a: 'All sessions are conducted in online mode, allowing students to attend from anywhere.' },
                            { q: 'How are questions provided?', a: 'Questions are shared topic-wise and exam-oriented, focusing on important concepts and frequently asked areas.' },
                            { q: 'Are tests conducted regularly?', a: 'Yes. Regular online tests are conducted to help students assess their preparation and improve performance.' },
                            { q: 'Will answers be explained after tests?', a: 'Yes. Detailed answer discussions are conducted to ensure concept clarity and to understand the correct approach to solving questions.' },
                            { q: 'Is previous year question practice included?', a: 'Yes. Practice includes questions based on previous exam patterns to help students understand how questions are framed.' }
                        ].map((faq, idx) => (
                            <FAQItem key={idx} q={faq.q} a={faq.a} index={idx} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="relative py-24 px-6 bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-blue-600 font-bold text-sm tracking-widest uppercase mb-4 inline-block">Contact Us</span>
                        <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#0F172A]">
                            Get in <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Touch</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            {[
                                { icon: Phone, label: 'Phone / WhatsApp', value: '7092061802', color: 'from-green-500 to-emerald-600' },
                                { icon: Mail, label: 'Email ID', value: 'jclsiddhaacademy@gmail.com', color: 'from-blue-500 to-cyan-600' },
                                { icon: MapPin, label: 'Location', value: 'Online Mode – Learn from Anywhere', color: 'from-purple-500 to-pink-600' }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex gap-6 items-center bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-100 hover:shadow-xl transition-all group"
                                >
                                    <div className={`bg-gradient-to-br ${item.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                                        <item.icon className="text-white" size={28} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                                        <p className="text-xl font-bold text-[#0F172A]">{item.value}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-10 shadow-2xl border border-white/40"
                        >
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Name</label>
                                        <input type="text" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-xl p-4 transition-all outline-none" placeholder="Your name" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Phone</label>
                                        <input type="text" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-xl p-4 transition-all outline-none" placeholder="Phone number" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Message</label>
                                    <textarea className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-xl p-4 transition-all outline-none" rows="4" placeholder="How can we help you?"></textarea>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-gradient-to-r from-[#0F172A] to-blue-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-2xl shadow-blue-900/30 hover:shadow-blue-900/50 transition-all"
                                >
                                    Submit Enquiry <Send size={20} />
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative py-12 px-6 bg-gradient-to-br from-[#0F172A] to-blue-900 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-1 rounded-xl shadow-lg border border-slate-100">
                                <img src="/LOGO.jpeg" alt="Logo" className="w-10 h-10 object-contain rounded-lg" />
                            </div>
                            <div>
                                <span className="text-xl font-serif font-bold block">JCL Siddha Academy</span>
                                <span className="text-xs text-blue-300">Excellence in Education</span>
                            </div>
                        </div>
                        <p className="text-blue-200 italic">"Building the next generation of Siddha Professionals"</p>
                        <p className="text-sm text-blue-300">© {new Date().getFullYear()} All rights reserved</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// FAQ Component
const FAQItem = ({ q, a, index }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 group"
            >
                <span className="font-bold text-[#0F172A] text-lg group-hover:text-blue-600 transition-colors">{q}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    className={`flex-shrink-0 ${isOpen ? 'text-blue-600' : 'text-slate-400'}`}
                >
                    <ChevronRight size={24} />
                </motion.div>
            </button>
            <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                className="overflow-hidden"
            >
                <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {a}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default StudentHome;
