import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ArrowRight, ArrowLeft, GraduationCap } from 'lucide-react';

const TestimonialsSection = () => {
    const [reviews, setReviews] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/reviews/approved');
                if (response.ok) {
                    const data = await response.json();
                    setReviews(data);
                }
            } catch (error) {
                console.error("Failed to fetch reviews", error);
            }
        };
        fetchReviews();
    }, []);

    // Auto-play functionality
    useEffect(() => {
        if (reviews.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % reviews.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [reviews.length]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    if (reviews.length === 0) return null;

    const currentReview = reviews[currentIndex];

    return (
        <section className="relative py-24 px-6 bg-white overflow-hidden">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-blue-600 font-bold text-xs tracking-[0.2em] uppercase mb-4 block">Testimonials</span>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#0F172A] mb-4">
                        What Our Students Say
                    </h2>
                    <p className="text-slate-500 text-lg">
                        Join hundreds of successful students who have achieved their dreams with our guidance.
                    </p>
                </motion.div>

                <div className="relative">
                    {/* Card Container */}
                    <div className="flex justify-center">
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="w-full max-w-4xl"
                            >
                                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-emerald-100 shadow-[0_20px_50px_-12px_rgba(16,185,129,0.1)] relative overflow-hidden min-h-[300px] flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">

                                    {/* Decorative Background Shape */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-bl-[10rem] -z-0 opacity-50" />

                                    {/* Profile Image Section */}
                                    <div className="relative shrink-0 z-10 flex flex-col items-center">
                                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-emerald-50 flex items-center justify-center bg-white shadow-sm overflow-hidden relative">
                                            {/* Icon Placeholder instead of Name */}
                                            <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                                                <GraduationCap size={48} className="text-blue-300" />
                                            </div>
                                        </div>
                                        {/* Quote Badge */}
                                        <div className="absolute -bottom-3 -right-3 md:bottom-2 md:right-0 bg-emerald-500 text-white p-3 rounded-full border-4 border-white shadow-lg z-20">
                                            <Quote size={20} fill="currentColor" />
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="flex-1 text-center md:text-left z-10 w-full flex flex-col justify-between h-full pt-2">
                                        <div>
                                            <h3 className="text-2xl font-bold text-[#0F172A] mb-1">
                                                {currentReview.name}
                                            </h3>
                                            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-6 block">
                                                {currentReview.role || "Student"}
                                            </span>

                                            <div className="relative">
                                                <p className="text-slate-600 text-lg italic leading-relaxed mb-8 relative z-10">
                                                    "{currentReview.text}"
                                                </p>
                                            </div>
                                        </div>

                                        <div className="border-t border-slate-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={20}
                                                        className={`${i < currentReview.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                                Verified Student
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Buttons */}
                    {reviews.length > 1 && (
                        <div className="flex justify-center gap-6 mt-12">
                            <button
                                onClick={prevSlide}
                                className="w-14 h-14 rounded-full bg-white border border-slate-200 text-slate-900 flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm active:scale-95 group"
                            >
                                <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="w-14 h-14 rounded-full bg-[#0F172A] text-white flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95 group"
                            >
                                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
