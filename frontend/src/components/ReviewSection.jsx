import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star, Send, Loader2, X } from 'lucide-react';

const ReviewSection = () => {
    const [text, setText] = useState('');
    const [rating, setRating] = useState(5);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/user/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text, rating })
            });
            const data = await response.json();
            if (response.ok) {
                setMessage({ type: 'success', text: 'Thank you! Your review has been submitted for approval.' });
                setText('');
                setRating(5);
                setTimeout(() => setIsOpen(false), 2000);
            } else {
                setMessage({ type: 'error', text: data.message || 'Something went wrong' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to connect to server' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="relative py-12 px-6">
            <div className="max-w-4xl mx-auto text-center">
                {!isOpen ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                    >
                        <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">Have you studied with us?</h2>
                        <motion.button
                            onClick={() => setIsOpen(true)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-bold inline-flex items-center gap-2 shadow-xl shadow-blue-500/20"
                        >
                            <MessageSquare size={18} />
                            Share Your Experience
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, height: 0 }}
                        animate={{ opacity: 1, scale: 1, height: 'auto' }}
                        className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl border border-white/40 text-left relative"
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                        >
                            <X size={20} className="text-slate-500" />
                        </button>

                        <div className="text-center mb-8">
                            <div className="bg-blue-500/10 p-3 rounded-2xl w-fit mx-auto mb-4">
                                <MessageSquare className="text-blue-600" size={24} />
                            </div>
                            <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-2">Share Your Experience</h2>
                            <p className="text-slate-600">Your feedback helps us grow and inspires other students.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex flex-col items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Rate Your Experience</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setRating(s)}
                                            className="transition-transform active:scale-90"
                                        >
                                            <Star
                                                size={24}
                                                className={`${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} transition-colors`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest px-1">Your Review</label>
                                <textarea
                                    required
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl p-4 transition-all outline-none text-base min-h-[120px]"
                                    placeholder="Tell us how JCL Siddha Academy helped you..."
                                />
                            </div>

                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-3 rounded-xl text-center text-sm font-semibold ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}
                                >
                                    {message.text}
                                </motion.div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={submitting}
                                className="w-full bg-gradient-to-r from-[#0F172A] to-blue-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-2xl shadow-blue-900/30 hover:shadow-blue-900/50 transition-all disabled:opacity-50"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        Submit Review <Send size={18} />
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default ReviewSection;
