import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowRight, ArrowLeft } from 'lucide-react';

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
                                <div className="bg-white rounded-[2.5rem] p-8 md:p-14 border border-slate-100 shadow-[0_30px_60px_-12px_rgba(15,23,42,0.08)] relative overflow-hidden min-h-[350px] flex flex-col items-center text-center">

                                    {/* Premium Decorative Elements */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-[10rem] -z-0 opacity-40" />
                                    <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-50/50 rounded-tr-[10rem] -z-0 blur-2xl" />

                                    {/* Content Section */}
                                    <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
                                        <div className="mb-8">
                                            <div className="flex justify-center gap-1 mb-6">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={22}
                                                        className={`${i < currentReview.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                                                    />
                                                ))}
                                            </div>

                                            <p className="text-slate-700 text-xl md:text-2xl font-medium italic leading-relaxed mb-10">
                                                "{currentReview.text}"
                                            </p>

                                            <div className="flex flex-col items-center">
                                                <h3 className="text-2xl font-bold text-[#0F172A] mb-1">
                                                    {currentReview.name}
                                                </h3>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                                                        {currentReview.role || "Student"}
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                    <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-[10px] uppercase tracking-wider">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                        Verified student
                                                    </div>
                                                </div>
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
