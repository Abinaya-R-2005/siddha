import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, ChevronRight, CheckCircle2,
    Clock, AlertCircle, Loader2, Award, Trophy
} from 'lucide-react';
import axios from 'axios';

const TestPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [timeLeft, setTimeLeft] = useState(1200); // 20 mins default

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/user/tests/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTest(res.data);
                // Initialize answers
                const initialAnswers = {};
                res.data.questions.forEach((_, idx) => initialAnswers[idx] = null);
                setSelectedAnswers(initialAnswers);
            } catch (err) {
                console.error("Error fetching test:", err);
                alert("Failed to load test questions.");
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchTest();
    }, [id, navigate]);

    useEffect(() => {
        if (!test || result) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [test, result]);

    const handleOptionSelect = (optionIndex) => {
        if (result) return;
        setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: optionIndex });
    };

    const handleSubmit = async () => {
        if (submitting) return;
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const answersArray = Object.values(selectedAnswers);
            const res = await axios.post(`http://localhost:5000/api/user/tests/${id}/submit`, {
                answers: answersArray
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResult(res.data);
        } catch (err) {
            console.error("Submission error:", err);
            alert("Error submitting test.");
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (loading) return (
        <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
            <Loader2 className="animate-spin text-teal-600" size={48} />
        </div>
    );

    if (result) {
        return (
            <div className="min-h-screen bg-[#FDFCFB] p-6 md:p-12 flex flex-col items-center justify-center font-sans">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-12 text-center"
                >
                    <div className="inline-flex p-6 rounded-3xl bg-teal-50 text-teal-600 mb-8">
                        <Trophy size={64} />
                    </div>
                    <h2 className="text-4xl font-serif font-bold text-slate-900 mb-2">Test Completed!</h2>
                    <p className="text-slate-500 mb-10 text-lg">You've successfully completed the {test.subject} assessment.</p>

                    <div className="grid grid-cols-2 gap-8 mb-12">
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Score</p>
                            <h3 className="text-5xl font-black text-teal-600">{result.score}%</h3>
                        </div>
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Correct</p>
                            <h3 className="text-5xl font-black text-slate-900">{result.correct} <span className="text-xl text-slate-400">/ {result.total}</span></h3>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full bg-[#0D9488] hover:bg-[#0A756C] text-white font-bold py-5 rounded-2xl shadow-xl transition-all text-xl"
                    >
                        Back to Dashboard
                    </button>
                </motion.div>
            </div>
        );
    }

    const question = test.questions[currentQuestion];

    return (
        <div className="min-h-screen bg-[#FDFCFB] font-sans text-slate-900 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-slate-100 px-8 py-6 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                        <ChevronLeft size={24} className="text-slate-400" />
                    </button>
                    <div>
                        <h1 className="text-xl font-serif font-bold text-slate-800">{test.title}</h1>
                        <p className="text-xs font-medium text-teal-600 uppercase tracking-widest">{test.subject}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 px-6 py-3 bg-red-50 rounded-2xl border border-red-100">
                    <Clock size={20} className="text-red-500" />
                    <span className="font-mono text-xl font-bold text-red-600">{formatTime(timeLeft)}</span>
                </div>
            </header>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-100">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + 1) / test.questions.length) * 100}%` }}
                    className="h-full bg-teal-500"
                />
            </div>

            <main className="flex-1 w-full mx-auto p-0 md:p-0 pb-32 flex h-full">

                {/* PDF/Image Viewer Split */}
                {test.filename && !test.filename.endsWith('.json') && (
                    <div className="w-1/2 h-full border-r border-slate-200 bg-slate-100 overflow-hidden relative">
                        {test.filename.endsWith('.pdf') ? (
                            <iframe
                                src={`http://localhost:5000/uploads/${test.filename}`}
                                className="w-full h-[calc(100vh-160px)]"
                                title="Question Paper"
                            />
                        ) : (
                            <div className="w-full h-[calc(100vh-160px)] overflow-auto p-4 flex justify-center">
                                <img
                                    src={`http://localhost:5000/uploads/${test.filename}`}
                                    className="max-w-full h-auto shadow-lg rounded"
                                    alt="Question Paper"
                                />
                            </div>
                        )}
                    </div>
                )}

                <div className={`${test.filename && !test.filename.endsWith('.json') ? 'w-1/2' : 'max-w-5xl mx-auto'} p-6 md:p-12 overflow-y-auto h-[calc(100vh-160px)]`}>
                    <div className="flex items-center gap-4 mb-8">
                        <span className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-sm font-bold">
                            Question {currentQuestion + 1} of {test.questionsCount}
                        </span>
                        <div className="flex-1 h-px bg-slate-100" />
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestion}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            {/* If manual question, hide generic text or show "Refer to file" */}
                            <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 leading-tight">
                                {question.question.startsWith('Question') ? `Select answer for Question ${currentQuestion + 1}` : question.question}
                            </h2>

                            <div className="grid grid-cols-1 gap-4">
                                {question.options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionSelect(idx)}
                                        className={`group flex items-center justify-between p-4 md:p-6 rounded-[1.5rem] border-2 transition-all text-left ${selectedAnswers[currentQuestion] === idx
                                            ? 'border-teal-500 bg-teal-50/30'
                                            : 'border-slate-100 bg-white hover:border-teal-200 hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold transition-all ${selectedAnswers[currentQuestion] === idx
                                                ? 'bg-teal-500 text-white'
                                                : 'bg-slate-100 text-slate-400 group-hover:bg-teal-100 group-hover:text-teal-600'
                                                }`}>
                                                {String.fromCharCode(65 + idx)}
                                            </div>
                                            <span className="text-lg font-medium text-slate-700">{option}</span>
                                        </div>
                                        {selectedAnswers[currentQuestion] === idx && (
                                            <CheckCircle2 size={24} className="text-teal-500" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Footer Navigation */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 p-6 md:p-8 z-20">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <button
                        disabled={currentQuestion === 0}
                        onClick={() => setCurrentQuestion(prev => prev - 1)}
                        className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all disabled:opacity-0"
                    >
                        <ChevronLeft size={20} /> Previous
                    </button>

                    <div className="flex items-center gap-6">
                        {currentQuestion === test.questionsCount - 1 ? (
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="bg-[#C2410C] hover:bg-[#9a3412] text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-orange-900/20 transition-all flex items-center gap-3"
                            >
                                {submitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                                Submit Assessment
                            </button>
                        ) : (
                            <button
                                onClick={() => setCurrentQuestion(prev => prev + 1)}
                                className="bg-[#0F172A] hover:bg-black text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 transition-all flex items-center gap-3"
                            >
                                Next Question <ChevronRight size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default TestPage;
