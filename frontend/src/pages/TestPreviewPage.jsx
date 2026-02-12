import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const TestPreviewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [previewData, setPreviewData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPreview = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/user/tests/${id}/preview`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPreviewData(res.data);
            } catch (err) {
                console.error("Error fetching preview:", err);
                const msg = err.response?.data?.message || "Failed to load test preview.";
                alert(msg);
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchPreview();
    }, [id, navigate]);

    if (loading) return (
        <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
            <Loader2 className="animate-spin text-[#0F172A]" size={48} />
        </div>
    );

    if (!previewData) return null;

    const { test, attempt } = previewData;

    return (
        <div className="min-h-screen bg-[#FDFCFB] font-sans text-slate-900 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-slate-100 px-8 py-6 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                        <ChevronLeft size={24} className="text-slate-400" />
                    </button>
                    <div>
                        <h1 className="text-xl font-serif font-bold text-slate-800">{test.title} - Preview</h1>
                        <p className="text-xs font-medium text-blue-900 uppercase tracking-widest">{test.subject}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your Score</p>
                        <h3 className="text-2xl font-black text-[#0F172A]">{attempt.score}%</h3>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-4xl mx-auto w-full p-6 md:p-12 space-y-12">
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl">
                    <h3 className="text-blue-900 font-bold mb-2">Review Mode</h3>
                    <p className="text-blue-700 text-sm">You are viewing your previous attempt. Correct answers are highlighted in green, and your incorrect choices are in red.</p>
                </div>

                {/* Global Question Paper (Image/PDF) */}
                {(test.filename && !test.filename.endsWith('.json')) && (
                    <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                        <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-700">Question Paper Reference</h3>
                            {test.filename.endsWith('.pdf') ? (
                                <a
                                    href={`http://localhost:5000/uploads/${test.filename}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 font-bold text-sm hover:underline"
                                >
                                    Open PDF in New Tab
                                </a>
                            ) : null}
                        </div>
                        <div className="p-2 bg-slate-100">
                            {test.filename.endsWith('.pdf') ? (
                                <iframe
                                    src={`http://localhost:5000/uploads/${test.filename}`}
                                    className="w-full h-[500px] border-none rounded-xl"
                                    title="Question Paper"
                                />
                            ) : (
                                <img
                                    src={`http://localhost:5000/uploads/${test.filename}`}
                                    className="max-w-full h-auto mx-auto shadow-sm rounded-xl"
                                    alt="Question Paper"
                                />
                            )}
                        </div>
                    </div>
                )}

                <div className="space-y-8">
                    {test.questions.map((q, qIdx) => {
                        const studentAnswer = attempt.answers ? attempt.answers[qIdx] : null;
                        const correctAnswer = (attempt.correctAnswers && attempt.correctAnswers[qIdx] !== undefined)
                            ? attempt.correctAnswers[qIdx]
                            : q.answer;

                        // Ensure comparison is strictly numeric and handles nulls correctly
                        const isSkipped = studentAnswer === null || studentAnswer === undefined || studentAnswer === '';
                        const isCorrect = !isSkipped && Number(studentAnswer) === Number(correctAnswer);

                        return (
                            <div key={qIdx} className={`p-8 rounded-[2.5rem] border-2 bg-white transition-all ${isCorrect ? 'border-green-100 shadow-sm shadow-green-900/5' : isSkipped ? 'border-amber-100 shadow-sm shadow-amber-900/5' : 'border-red-100 shadow-sm shadow-red-900/5'}`}>
                                <div className="flex gap-4 mb-6">
                                    <span className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${isCorrect ? 'bg-green-600 text-white' : isSkipped ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'}`}>
                                        {qIdx + 1}
                                    </span>
                                    <h4 className="text-xl font-bold text-slate-800 leading-tight pt-1">
                                        {q.question.startsWith('Question') ? `Select answer for Question ${qIdx + 1}` : q.question}
                                    </h4>
                                </div>

                                {q.filename && (
                                    <div className="mb-6 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
                                        {q.filename.endsWith('.pdf') ? (
                                            <div className="p-8 text-center">
                                                <a href={`http://localhost:5000/uploads/${q.filename}`} target="_blank" rel="noreferrer" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all inline-block">View Question PDF</a>
                                            </div>
                                        ) : (
                                            <div className="p-4">
                                                <img src={`http://localhost:5000/uploads/${q.filename}`} alt="Question visual" className="max-w-full h-auto mx-auto shadow-md rounded-lg" />
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {q.options.map((opt, oIdx) => {
                                        let optionClass = "border-slate-100 bg-white text-slate-500";
                                        let icon = null;

                                        const isThisCorrect = Number(oIdx) === Number(correctAnswer);
                                        const isThisStudentChoice = !isSkipped && Number(oIdx) === Number(studentAnswer);

                                        if (isThisCorrect) {
                                            optionClass = "border-green-500 bg-green-50 text-green-900 font-bold shadow-sm shadow-green-900/10";
                                            icon = <CheckCircle2 size={24} className="text-green-600" />;
                                        } else if (isThisStudentChoice && !isCorrect) {
                                            optionClass = "border-red-500 bg-red-50 text-red-800 font-bold shadow-sm shadow-red-900/10";
                                            icon = <AlertCircle size={24} className="text-red-600" />;
                                        }

                                        return (
                                            <div key={oIdx} className={`px-6 py-4 rounded-2xl border flex items-center justify-between transition-all ${optionClass}`}>
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${isThisStudentChoice ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                        {String.fromCharCode(65 + oIdx)}
                                                    </div>
                                                    <span className="text-lg">{opt}</span>
                                                </div>
                                                {icon}
                                            </div>
                                        );
                                    })}
                                </div>

                                {isSkipped ? (
                                    <div className="mt-6 px-6 py-3 bg-amber-50 rounded-2xl text-amber-700 text-sm font-bold flex items-center gap-2 border border-amber-100">
                                        <AlertCircle size={18} /> You skipped this question.
                                    </div>
                                ) : !isCorrect && (
                                    <div className="mt-6 px-6 py-3 bg-red-50 rounded-2xl text-red-700 text-sm font-bold flex items-center gap-2 border border-red-100">
                                        <AlertCircle size={18} /> Incorrect choice.
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="pt-12 flex justify-center">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-[#0F172A] text-white px-12 py-4 rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-xl shadow-slate-900/20"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </main>
        </div>
    );
};

export default TestPreviewPage;
