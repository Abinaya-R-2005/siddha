import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    GraduationCap,
    CheckCircle2,
    Clock,
    Target,
    Phone,
    Mail,
    MapPin,
    ChevronRight,
    ArrowRight,
    Send,
    Award
} from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-[#FDFCFB] font-sans text-slate-900 overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="bg-[#0F172A] p-2 rounded-lg">
                            <GraduationCap className="text-white" size={24} />
                        </div>
                        <span className="text-xl font-serif font-bold tracking-tight text-[#0F172A]">JCL Siddha Academy</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
                        <a href="#about" className="hover:text-[#0F172A] transition-colors">About Us</a>
                        <a href="#features" className="hover:text-[#0F172A] transition-colors">Methodology</a>
                        <a href="#faq" className="hover:text-[#0F172A] transition-colors">FAQ</a>
                        <a href="#contact" className="hover:text-[#0F172A] transition-colors">Contact</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-bold text-[#0F172A] hover:opacity-70">Sign In</Link>
                        <Link to="/register/student" className="bg-[#0F172A] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#1e293b] shadow-lg shadow-slate-900/20 transition-all">
                            Join Now
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 text-center md:text-left"
                    >
                        <motion.span
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest mb-6"
                        >
                            Academic Excellence in Siddha
                        </motion.span>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#0F172A] leading-tight mb-6">
                            We Build Your <span className="text-blue-600">Journey</span> Easy
                        </h1>
                        <p className="text-xl text-slate-500 mb-10 leading-relaxed max-w-2xl mx-auto md:mx-0">
                            Join us and prepare smarter for your exams with expert guidance, structured tests, and consistent support. Your success begins here.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <Link to="/register/student" className="bg-[#0F172A] text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#1e293b] shadow-xl shadow-slate-900/20 transition-all group">
                                Join Now <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a href="#contact" className="bg-white text-[#0F172A] border-2 border-slate-100 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:border-[#0F172A] transition-all">
                                Enquire Now
                            </a>
                        </div>

                        <div className="mt-12 flex items-center gap-6 justify-center md:justify-start">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" />
                                ))}
                            </div>
                            <p className="text-sm font-medium text-slate-500">
                                <span className="text-[#0F172A] font-bold">500+</span> Students Joined Recently
                            </p>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 relative"
                    >
                        <div className="aspect-square bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[4rem] relative overflow-hidden p-8 shadow-inner">
                            <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]" />
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="bg-white p-6 rounded-3xl shadow-2xl relative z-10 border border-slate-50"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-green-100 p-2 rounded-lg text-green-600"><Award size={24} /></div>
                                    <h4 className="font-bold text-[#0F172A]">MRB & AIAPGET</h4>
                                </div>
                                <p className="text-sm text-slate-500">Comprehensive coaching for medical entrance exams.</p>
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, 20, 0] }}
                                transition={{ duration: 5, repeat: Infinity }}
                                className="bg-white p-6 rounded-3xl shadow-2xl absolute right-0 bottom-12 z-10 border border-slate-50"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><CheckCircle2 size={24} /></div>
                                    <h4 className="font-bold text-[#0F172A]">Online Classes</h4>
                                </div>
                                <p className="text-sm text-slate-500">Live sessions from anywhere.</p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#0F172A] mb-4">Prepare Confidently</h2>
                        <p className="text-slate-500">Everything you need to excel in your competitive exams.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={Send}
                            title="Daily Telegram Questions"
                            desc="Daily practice questions in our Telegram group to keep you engaged."
                            color="bg-sky-50 text-sky-600"
                        />
                        <FeatureCard
                            icon={Clock}
                            title="Timed Tests"
                            desc="Regular timed tests and in-depth discussions to build speed and accuracy."
                            color="bg-orange-50 text-orange-600"
                        />
                        <FeatureCard
                            icon={Target}
                            title="Exam-Oriented"
                            desc="Focused topics and frequently asked questions for AIAPGET & MRB."
                            color="bg-indigo-50 text-indigo-600"
                        />
                    </div>

                    <div className="mt-20 p-12 bg-[#0F172A] rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
                        <div className="relative z-10 flex-1">
                            <h3 className="text-3xl font-serif font-bold mb-6 italic text-blue-400">"Competitive exams demand clarity, speed, and accuracy."</h3>
                            <p className="text-slate-400 mb-8 max-w-xl">Our preparation focuses on transforming your approach to learning through repeated exposure and conceptual understanding.</p>
                            <ul className="space-y-4">
                                {[
                                    "Repeated exposure to exam-level questions",
                                    "Understanding concepts through answers",
                                    "Learning how questions are framed in exams",
                                    "Improving confidence through practice"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative z-10 flex-1 flex justify-center">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="w-32 h-32 rounded-3xl bg-white/5 backdrop-blur-md flex flex-col items-center justify-center border border-white/10">
                                    <span className="text-3xl font-bold">100%</span>
                                    <span className="text-[10px] uppercase font-bold text-slate-400">Online</span>
                                </div>
                                <div className="w-32 h-32 rounded-3xl bg-blue-500/20 backdrop-blur-md flex flex-col items-center justify-center border border-blue-500/10 mt-8">
                                    <span className="text-3xl font-bold">24/7</span>
                                    <span className="text-[10px] uppercase font-bold text-blue-400">Support</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 filter blur-[150px] opacity-10 rounded-full" />
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section id="about" className="py-24 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-20">
                        <div className="flex-1">
                            <motion.span className="text-blue-600 font-bold text-sm tracking-widest uppercase mb-4 inline-block">About Us</motion.span>
                            <h2 className="text-4xl font-serif font-bold text-[#0F172A] mb-8 leading-tight">JCL Siddha Academy</h2>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                JCL Siddha Academy is committed to guiding students toward success in competitive medical entrance and recruitment examinations. Our goal is to make preparation simple, smart, and effective through well-planned teaching and regular assessments.
                            </p>
                            <p className="text-lg text-slate-600 mb-10 leading-relaxed italic">
                                We believe every student can succeed with the right direction, practice, and motivation.
                            </p>

                            <div className="space-y-8">
                                <div className="flex gap-6">
                                    <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 h-fit"><Award size={24} /></div>
                                    <div>
                                        <h4 className="font-bold text-[#0F172A] text-xl mb-2">Our Vision</h4>
                                        <p className="text-slate-500">To create confident, well-prepared professionals through quality education and disciplined preparation.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600 h-fit"><Target size={24} /></div>
                                    <div>
                                        <h4 className="font-bold text-[#0F172A] text-xl mb-2">Our Mission</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                            {[
                                                "Coaching for Excellence",
                                                "Exam-Oriented Prep",
                                                "Affordable Effective Education",
                                                "Continuous Support"
                                            ].map((m, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                                    <CheckCircle2 size={16} className="text-blue-500" /> {m}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 relative">
                            <div className="rounded-[4rem] overflow-hidden shadow-2xl">
                                <div className="bg-[#0F172A] p-2 aspect-[4/5] flex items-center justify-center">
                                    <div className="text-white flex flex-col items-center gap-6">
                                        <GraduationCap size={120} className="text-blue-500 opacity-20" />
                                        <h3 className="text-4xl font-serif text-center px-12 italic">"Simplifying Success for Every Student"</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-24 bg-slate-50 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#0F172A] mb-4">Frequently Asked Questions</h2>
                        <p className="text-slate-500 italic">Got questions? We have answers.</p>
                    </div>

                    <div className="space-y-4">
                        <FAQItem
                            q="What is the teaching method followed here?"
                            a="We follow a question–answer based preparation method. Students practice exam-oriented questions and learn concepts through clear, structured answers."
                        />
                        <FAQItem
                            q="Are classes conducted online or offline?"
                            a="All sessions are conducted in online mode, allowing students to attend from anywhere."
                        />
                        <FAQItem
                            q="How are questions provided?"
                            a="Questions are shared topic-wise and exam-oriented, focusing on important concepts and frequently asked areas."
                        />
                        <FAQItem
                            q="Are tests conducted regularly?"
                            a="Yes. Regular online tests are conducted to help students assess their preparation and improve performance."
                        />
                        <FAQItem
                            q="Will answers be explained after tests?"
                            a="Yes. Detailed answer discussions are conducted to ensure concept clarity and to understand the correct approach to solving questions."
                        />
                        <FAQItem
                            q="Is previous year question practice included?"
                            a="Yes. Practice includes questions based on previous exam patterns to help students understand how questions are framed."
                        />
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 px-6 border-b border-slate-100">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16">
                    <div className="flex-1">
                        <h2 className="text-4xl font-serif font-bold text-[#0F172A] mb-8">Get in Touch</h2>
                        <p className="text-slate-500 mb-12">We are here to help you start your journey. Connect with us through any of these channels.</p>

                        <div className="space-y-8">
                            <ContactInfo icon={Phone} label="Phone / WhatsApp" value="7092061802" />
                            <ContactInfo icon={Mail} label="Email ID" value="jclsiddhaacademy@gmail.com" />
                            <ContactInfo icon={MapPin} label="Location" value="Online Mode – Learn from Anywhere" />
                        </div>
                    </div>
                    <div className="flex-[1.5] bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-50">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Name</label>
                                    <input type="text" className="w-full bg-slate-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-blue-600 transition-all outline-none" placeholder="Enter your name" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Phone</label>
                                    <input type="text" className="w-full bg-slate-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-blue-600 transition-all outline-none" placeholder="Enter phone number" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Waitlist / Enquiry Message</label>
                                <textarea className="w-full bg-slate-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-blue-600 transition-all outline-none" rows="4" placeholder="How can we help you?"></textarea>
                            </div>
                            <button className="w-full bg-[#0F172A] text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#1e293b] shadow-xl shadow-slate-900/10 transition-all">
                                Submit Enquiry <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 bg-white">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="bg-[#0F172A] p-2 rounded-lg">
                            <GraduationCap className="text-white" size={20} />
                        </div>
                        <span className="text-lg font-serif font-bold text-[#0F172A]">JCL Siddha Academy</span>
                    </div>
                    <p className="text-slate-400 text-sm italic pr-4">"Building the next generation of Siddha Professionals"</p>
                    <div className="flex gap-8 text-sm text-slate-500">
                        <p>© {new Date().getFullYear()} JCL Siddha Academy. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Helper Components
const FeatureCard = ({ icon: Icon, title, desc, color }) => (
    <motion.div
        whileHover={{ y: -10 }}
        className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all h-full"
    >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${color}`}>
            <Icon size={28} />
        </div>
        <h3 className="text-xl font-bold text-[#0F172A] mb-4">{title}</h3>
        <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
    </motion.div>
);

const FAQItem = ({ q, a }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all shadow-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-6 text-left flex items-center justify-between gap-4"
            >
                <span className="font-bold text-[#0F172A] text-lg">{q}</span>
                <div className={`transition-transform flex-shrink-0 ${isOpen ? 'rotate-180 text-[#0F172A]' : 'text-slate-400'}`}>
                    <ChevronRight />
                </div>
            </button>
            <motion.div
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                className="px-6 pb-6 overflow-hidden"
            >
                <div className="pt-2 text-slate-600 leading-relaxed border-t border-slate-50 mt-2">
                    {a}
                </div>
            </motion.div>
        </div>
    );
};

const ContactInfo = ({ icon: Icon, label, value }) => (
    <div className="flex gap-6 items-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Icon size={24} />
        </div>
        <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-xl font-bold text-[#0F172A]">{value}</p>
        </div>
    </div>
);

export default Home;
