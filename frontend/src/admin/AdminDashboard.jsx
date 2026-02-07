import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Users,
    LogOut, Search,
    TrendingUp, Calendar, FileText, ChevronDown, Trash2, Edit, Download, Upload, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('Overview');
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStudents: 0,
        totalTests: 0,
        globalAverage: 0,
        activeToday: 0
    });
    const [chartData, setChartData] = useState({ subjectMastery: [], performanceTrend: [] });
    const [users, setUsers] = useState([]);
    const [questionBanks, setQuestionBanks] = useState([]);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [editingBank, setEditingBank] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState('All Subjects');
    const navigate = useNavigate();

    const fetchAllData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const statsResponse = await axios.get('http://localhost:5000/api/admin/dashboard-stats', config);
            setStats(statsResponse.data.stats);
            setChartData(statsResponse.data.charts);

            const usersResponse = await axios.get('http://localhost:5000/api/admin/users', config);
            setUsers(usersResponse.data);

            const qbResponse = await axios.get('http://localhost:5000/api/admin/question-banks', config);
            setQuestionBanks(qbResponse.data);

        } catch (err) {
            console.log("Using mock data as backend failed or unauthorized", err);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
    }, [navigate]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleUploadSuccess = () => {
        setIsUploadModalOpen(false);
        setEditingBank(null);
        fetchAllData();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this question bank?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/admin/question-banks/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAllData();
        } catch (err) {
            console.error("Delete failed", err);
            const msg = err.response?.data?.message || err.message;
            alert(`Failed to delete: ${msg}`);
        }
    };

    const handleDownload = async (bank) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/admin/question-banks/${bank._id}/download`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', bank.filename || `${bank.title}.json`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Download failed", err);
            const msg = err.response?.data?.message || err.message;
            alert(`Failed to download: ${msg}`);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#FDFCFB] font-sans relative">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0F172A] text-white flex flex-col fixed h-full z-50">
                <div className="p-8">
                    <h1 className="text-xl font-serif font-bold text-white tracking-tight">Admin Portal</h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <NavItem
                        icon={<LayoutDashboard size={20} />}
                        label="Overview"
                        active={activeTab === 'Overview'}
                        onClick={() => setActiveTab('Overview')}
                    />
                    <NavItem
                        icon={<FileText size={20} />}
                        label="Question Vault"
                        active={activeTab === 'Question Vault'}
                        onClick={() => setActiveTab('Question Vault')}
                    />
                    <NavItem
                        icon={<Users size={20} />}
                        label="Students"
                        active={activeTab === 'Students'}
                        onClick={() => setActiveTab('Students')}
                    />
                </nav>

                <div className="p-8">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-slate-400 hover:text-white transition-all"
                    >
                        <LogOut size={20} />
                        <span className="font-medium text-sm">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-12">

                {/* Header for all pages */}
                <header className="flex justify-between items-start mb-10">
                    <div>
                        {activeTab === 'Overview' && (
                            <>
                                <h2 className="text-4xl font-serif font-bold text-[#0F172A] mb-2">Dashboard Overview</h2>
                                <p className="text-slate-500">Monitor global performance and insights</p>
                            </>
                        )}
                        {activeTab === 'Question Vault' && (
                            <>
                                <h2 className="text-4xl font-serif font-bold text-[#0F172A] mb-2">Question Bank Vault</h2>
                                <p className="text-slate-500">Manage your question repositories</p>
                            </>
                        )}
                        {activeTab === 'Students' && (
                            <>
                                <h2 className="text-4xl font-serif font-bold text-[#0F172A] mb-2">Student Management</h2>
                                <p className="text-slate-500">Track individual student progress</p>
                            </>
                        )}
                    </div>

                    <div className="flex gap-4">
                        {activeTab === 'Question Vault' && (
                            <button
                                onClick={() => setIsUploadModalOpen(true)}
                                className="bg-[#C2410C] hover:bg-[#9a3412] text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors shadow-lg shadow-orange-900/10"
                            >
                                <Upload size={16} /> Upload New
                            </button>
                        )}
                        <div className="relative w-48 bg-white border border-slate-200 rounded-lg">
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="w-full px-4 py-2 text-sm font-semibold text-gray-700 bg-transparent appearance-none focus:outline-none cursor-pointer"
                            >
                                <option>All Subjects</option>
                                {[...new Set([...(questionBanks || []).map(b => b.subject), 'Noi Naadal', 'Maruthuvam', 'Gunapadam', 'Maathu Vidhai', 'Varma Kalai'])].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
                        </div>
                    </div>
                </header>

                {/* CONTENT: OVERVIEW */}
                {activeTab === 'Overview' && (
                    <div className="space-y-12">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-4 gap-8">
                            <OverviewCard icon={<Users size={24} className="text-blue-500" />} value={stats.totalStudents} label="Total Students" />
                            <OverviewCard icon={<FileText size={24} className="text-teal-500" />} value={stats.totalTests} label="Total Tests" />
                            <OverviewCard icon={<TrendingUp size={24} className="text-orange-500" />} value={`${stats.globalAverage}%`} label="Global Average" />
                            <OverviewCard icon={<Calendar size={24} className="text-green-500" />} value={stats.activeToday} label="Active Today" />
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-xl font-serif font-bold text-gray-800 mb-6">Subject Mastery</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData.subjectMastery} barSize={40}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="score" fill="#0D9488" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-serif font-bold text-gray-800 mb-6">Monthly Performance Trend</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData.performanceTrend}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="month" />
                                            <YAxis domain={[60, 90]} />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="score" stroke="#C2410C" strokeWidth={3} dot={{ r: 4 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* CONTENT: QUESTION VAULT */}
                {activeTab === 'Question Vault' && (
                    <div>
                        <div className="mb-8">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search question banks..."
                                    className="pl-10 pr-4 py-2 w-full rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {(selectedSubject === 'All Subjects' ? questionBanks : questionBanks.filter(b => b.subject === selectedSubject)).length > 0 ?
                                (selectedSubject === 'All Subjects' ? questionBanks : questionBanks.filter(b => b.subject === selectedSubject)).map((bank) => (
                                    <div key={bank._id || bank.id} className="bg-white p-6 rounded-xl border border-slate-100 flex justify-between items-center hover:shadow-sm transition-shadow">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-lg font-bold text-slate-900">{bank.title}</h4>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${bank.difficulty === 'Hard' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                                                    }`}>
                                                    {bank.difficulty}
                                                </span>
                                            </div>
                                            <p className="text-sm font-semibold text-teal-600 mb-3">{bank.subject}</p>
                                            <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
                                                <span>{bank.questionsCount || bank.questions} questions</span>
                                                <span>Uploaded {new Date(bank.createdAt || bank.uploaded).toLocaleDateString()}</span>
                                                <span>{bank.attempts} students attempted</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => handleDownload(bank)} className="p-2 text-slate-400 hover:text-teal-600 transition-colors"><Download size={18} /></button>
                                            <button onClick={() => setEditingBank(bank)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit size={18} /></button>
                                            <button onClick={() => handleDelete(bank._id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-10 text-slate-400">
                                        No question banks found for {selectedSubject}.
                                    </div>
                                )}
                        </div>
                    </div>
                )}

                {/* CONTENT: STUDENTS */}
                {activeTab === 'Students' && (
                    <div>
                        <div className="mb-8">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search students..."
                                    className="pl-10 pr-4 py-2 w-full rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-sm"
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Student</th>
                                        <th className="px-6 py-4 text-center">Tests</th>
                                        <th className="px-6 py-4 text-center">Avg Score</th>
                                        <th className="px-6 py-4 text-center">Trend</th>
                                        <th className="px-6 py-4">Last Active</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {users.filter(u => (u.role || 'student').toLowerCase() === 'student').map((user, i) => (
                                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-bold text-slate-900">{user.fullName}</p>
                                                    <p className="text-slate-400 text-xs">{user.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center font-medium">{user.testsCompleted || 0}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded font-bold text-xs">{user.averageScore || '-'}%</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center text-green-500"><TrendingUp size={16} /></div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 font-medium">
                                                {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Never'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-orange-600 font-bold hover:underline text-xs">View Details</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.filter(u => (u.role || 'student').toLowerCase() === 'student').length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="text-center py-8 text-slate-400">
                                                No students found. (Total Users fetched: {users.length})
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <UploadModal
                    onClose={() => setIsUploadModalOpen(false)}
                    onSuccess={handleUploadSuccess}
                    onAuthError={handleLogout}
                />
            )}
            {editingBank && (
                <EditModal
                    bank={editingBank}
                    onClose={() => setEditingBank(null)}
                    onSuccess={handleUploadSuccess}
                />
            )}
        </div>
    );
};

// Sub-components
const NavItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-all text-left mb-1 ${active
            ? 'bg-[#C2410C] text-white font-bold shadow-lg shadow-orange-900/20'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}>
        {icon}
        <span className="text-sm">{label}</span>
    </button>
);

const OverviewCard = ({ icon, value, label }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
        <div className="mb-4 bg-slate-50 p-3 rounded-xl">{icon}</div>
        <h3 className="text-3xl font-serif font-bold text-slate-800 mb-1">{value}</h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
);

const UploadModal = ({ onClose, onSuccess, onAuthError }) => {
    const [formData, setFormData] = useState({
        title: '',
        subject: 'Noi Naadal',
        difficulty: 'Easy',
        negativeMarking: false,
        startTime: '',
        endTime: ''
    });
    const [questions, setQuestions] = useState([
        { question: '', options: ['', '', '', ''], answer: 0, file: null, preview: null }
    ]);
    const [loading, setLoading] = useState(false);

    const handleAddQuestion = () => {
        setQuestions([...questions, { question: '', options: ['', '', '', ''], answer: 0, file: null, preview: null }]);
    };

    const handleRemoveQuestion = (index) => {
        const updatedQuestions = questions.filter((_, i) => i !== index);
        setQuestions(updatedQuestions);
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        if (field === 'options') {
            const { optIdx, val } = value;
            updatedQuestions[index].options[optIdx] = val;
        } else {
            updatedQuestions[index][field] = value;
        }
        setQuestions(updatedQuestions);
    };

    const handleFileChange = (index, file) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].file = file;
        updatedQuestions[index].preview = URL.createObjectURL(file);
        setQuestions(updatedQuestions);
    };

    const handleBulkImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newQuestions = files.map((file, idx) => ({
            question: `Question ${questions.length + idx + 1}`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            answer: 0,
            file: file,
            preview: URL.createObjectURL(file)
        }));
        // If there's only one empty question, replace it. Otherwise append.
        if (questions.length === 1 && !questions[0].question && !questions[0].file) {
            setQuestions(newQuestions);
        } else {
            setQuestions([...questions, ...newQuestions]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (questions.length === 0) return alert('Please add at least one question');

        setLoading(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('subject', formData.subject);
        data.append('difficulty', formData.difficulty);
        data.append('negativeMarking', formData.negativeMarking);
        data.append('startTime', formData.startTime);
        data.append('endTime', formData.endTime);

        // Prepare questions for backend
        // We need to keep track of which file belongs to which question
        // Backend expects 'files' array and 'manualQuestions' JSON
        // We'll send files in order of questions that have files
        const filesToSend = [];
        const questionsToSave = questions.map((q) => {
            const qCopy = { ...q };
            if (qCopy.file) {
                filesToSend.push(qCopy.file);
                qCopy.hasNewFile = true;
                // We don't send the file object in the JSON
                delete qCopy.file;
                delete qCopy.preview;
            }
            return qCopy;
        });

        data.append('manualQuestions', JSON.stringify(questionsToSave));
        data.append('questionsCount', questionsToSave.length);
        filesToSend.forEach(file => data.append('files', file));

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/admin/question-banks', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            onSuccess();
        } catch (err) {
            console.error(err);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                onAuthError();
            } else {
                alert('Upload failed: ' + (err.response?.data?.message || err.message));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-xl font-serif font-bold text-slate-800">Create Question Bank</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-500" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <form id="upload-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Title</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C2410C]/20 text-sm"
                                    placeholder="e.g., Annual Exam"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Subject</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C2410C]/20 text-sm bg-white"
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                >
                                    <option>Noi Naadal</option>
                                    <option>Maruthuvam</option>
                                    <option>Gunapadam</option>
                                    <option>Sirappu Maruthuvam</option>
                                    <option>Varma Kalai</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Difficulty</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C2410C]/20 text-sm bg-white"
                                    value={formData.difficulty}
                                    onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                                >
                                    <option>Easy</option>
                                    <option>Medium</option>
                                    <option>Hard</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Start Time (Leave empty for immediate)</label>
                                <input
                                    type="datetime-local"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C2410C]/20 text-sm"
                                    value={formData.startTime}
                                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">End Time</label>
                                <input
                                    type="datetime-local"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C2410C]/20 text-sm"
                                    value={formData.endTime}
                                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100">
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">Negative Marking</h4>
                                <p className="text-xs text-slate-500">Enable to deduct -0.25 marks for each incorrect answer.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.negativeMarking}
                                    onChange={e => setFormData({ ...formData, negativeMarking: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C2410C]"></div>
                            </label>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Questions ({questions.length})</h4>
                                <div className="flex gap-2">
                                    <label className="cursor-pointer bg-[#C2410C]/10 text-[#C2410C] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#C2410C]/20 transition-colors flex items-center gap-2">
                                        <Upload size={14} /> Bulk Image Upload
                                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleBulkImageUpload} />
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleAddQuestion}
                                        className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-900 transition-colors flex items-center gap-2"
                                    >
                                        + Add Question
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {questions.map((q, qIdx) => (
                                    <div key={qIdx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative group animate-in slide-in-from-top-2">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveQuestion(qIdx)}
                                            className="absolute -right-2 -top-2 bg-white border border-slate-200 p-1.5 rounded-full text-slate-400 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>

                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                            {/* Left: Image Upload/Preview */}
                                            <div className="md:col-span-3 flex flex-col gap-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Question Image</label>
                                                {q.preview ? (
                                                    <div className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group/image">
                                                        <img src={q.preview} alt="Preview" className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleFileChange(qIdx, null)}
                                                            className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover/image:opacity-100 flex items-center justify-center transition-opacity text-xs font-bold"
                                                        >
                                                            Change Image
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <label className="aspect-square rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#C2410C]/30 hover:bg-[#C2410C]/5 transition-all">
                                                        <Upload size={20} className="text-slate-300" />
                                                        <span className="text-[10px] font-bold text-slate-400">Upload Image</span>
                                                        <input type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(qIdx, e.target.files[0])} />
                                                    </label>
                                                )}
                                            </div>

                                            {/* Right: Text Content */}
                                            <div className="md:col-span-9 space-y-4">
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Question Text</label>
                                                    <textarea
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C2410C]/20 text-sm h-20 resize-none font-medium"
                                                        placeholder={`Question ${qIdx + 1} content...`}
                                                        value={q.question}
                                                        onChange={e => handleQuestionChange(qIdx, 'question', e.target.value)}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {q.options.map((opt, oIdx) => (
                                                        <div key={oIdx} className="flex items-center gap-2">
                                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${q.answer === oIdx ? 'bg-[#C2410C] text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                                {String.fromCharCode(65 + oIdx)}
                                                            </div>
                                                            <input
                                                                type="text"
                                                                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C2410C]/20 text-sm"
                                                                placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                                                                value={opt}
                                                                onChange={e => handleQuestionChange(qIdx, 'options', { optIdx: oIdx, val: e.target.value })}
                                                            />
                                                            <input
                                                                type="radio"
                                                                name={`answer-${qIdx}`}
                                                                checked={q.answer === oIdx}
                                                                onChange={() => handleQuestionChange(qIdx, 'answer', oIdx)}
                                                                className="w-4 h-4 accent-[#C2410C] cursor-pointer"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-slate-600 hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        form="upload-form"
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl bg-[#C2410C] hover:bg-[#9a3412] text-white font-bold shadow-lg shadow-orange-900/20 transition-all disabled:opacity-70"
                    >
                        {loading ? 'Creating...' : 'Create Question Bank'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const EditModal = ({ bank, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: bank.title,
        subject: bank.subject,
        difficulty: bank.difficulty,
        negativeMarking: bank.negativeMarking || false,
        startTime: bank.startTime ? new Date(bank.startTime).toISOString().slice(0, 16) : '',
        endTime: bank.endTime ? new Date(bank.endTime).toISOString().slice(0, 16) : ''
    });

    const [questions, setQuestions] = useState(
        (bank.questions || []).map((q, idx) => ({
            ...q,
            filename: bank.filenames?.[idx] || (idx === 0 ? bank.filename : null),
            file: null,
            preview: null
        }))
    );
    const [loading, setLoading] = useState(false);

    const handleAddQuestion = () => {
        setQuestions([...questions, { question: '', options: ['', '', '', ''], answer: 0, file: null, preview: null }]);
    };

    const handleRemoveQuestion = (index) => {
        if (window.confirm('Are you sure you want to remove this question?')) {
            const updatedQuestions = questions.filter((_, i) => i !== index);
            setQuestions(updatedQuestions);
        }
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        if (field === 'options') {
            const { optIdx, val } = value;
            updatedQuestions[index].options[optIdx] = val;
        } else {
            updatedQuestions[index][field] = value;
        }
        setQuestions(updatedQuestions);
    };

    const handleFileChange = (index, file) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].file = file;
        updatedQuestions[index].preview = file ? URL.createObjectURL(file) : null;
        // If we change the file, clear the old filename
        if (file) updatedQuestions[index].filename = null;
        setQuestions(updatedQuestions);
    };

    const handleBulkImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newQuestions = files.map((file, idx) => ({
            question: `Question ${questions.length + idx + 1}`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            answer: 0,
            file: file,
            preview: URL.createObjectURL(file)
        }));
        setQuestions([...questions, ...newQuestions]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('subject', formData.subject);
        data.append('difficulty', formData.difficulty);
        data.append('negativeMarking', formData.negativeMarking);
        data.append('startTime', formData.startTime);
        data.append('endTime', formData.endTime);

        // Map through questions to determine what to send
        const filesToSend = [];
        const questionsToSave = questions.map((q) => {
            const qCopy = { ...q };
            if (qCopy.file) {
                filesToSend.push(qCopy.file);
            }
            // Backend needs to know if a question uses an existing file or a new one
            // We'll clean up the object for JSON
            const result = {
                question: qCopy.question,
                options: qCopy.options,
                answer: qCopy.answer,
                _id: qCopy._id // Keep ID for existing ones
            };
            if (qCopy.filename) result.filename = qCopy.filename;
            if (qCopy.file) result.hasNewFile = true;

            return result;
        });

        // Backend currently expects filenames in 'updatedFilenames' and questions in 'updatedQuestions'
        // For NEW files, it expects 'manualQuestions'.
        // Let's simplify and just send the whole thing as 'detailedQuestions'
        // But to keep backend compatible with existing logic, we'll try to map it.

        // Actually, let's update the backend to handle a more modern 'detailedQuestions' structure
        // Or we map here.

        const existingFilenames = questionsToSave.filter(q => q.filename).map(q => q.filename);
        data.append('updatedFilenames', JSON.stringify(existingFilenames));
        data.append('updatedQuestions', JSON.stringify(questionsToSave));

        filesToSend.forEach(file => data.append('files', file));

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/admin/question-banks/${bank._id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            onSuccess();
        } catch (err) {
            console.error("Update failed", err);
            alert(`Update failed: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-xl font-serif font-bold text-slate-800">Edit Question Bank</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-500" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <form id="edit-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Title</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C2410C]/20 text-sm"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Subject</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C2410C]/20 text-sm bg-white"
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                >
                                    <option>Noi Naadal</option>
                                    <option>Maruthuvam</option>
                                    <option>Gunapadam</option>
                                    <option>Sirappu Maruthuvam</option>
                                    <option>Varma Kalai</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Difficulty</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C2410C]/20 text-sm bg-white"
                                    value={formData.difficulty}
                                    onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                                >
                                    <option>Easy</option>
                                    <option>Medium</option>
                                    <option>Hard</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Start Time</label>
                                <input
                                    type="datetime-local"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C2410C]/20 text-sm"
                                    value={formData.startTime}
                                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">End Time</label>
                                <input
                                    type="datetime-local"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C2410C]/20 text-sm"
                                    value={formData.endTime}
                                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100">
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">Negative Marking</h4>
                                <p className="text-xs text-slate-500">Enable to deduct -0.25 marks for each incorrect answer.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.negativeMarking}
                                    onChange={e => setFormData({ ...formData, negativeMarking: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C2410C]"></div>
                            </label>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Questions ({questions.length})</h4>
                                <div className="flex gap-2">
                                    <label className="cursor-pointer bg-[#C2410C]/10 text-[#C2410C] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#C2410C]/20 transition-colors flex items-center gap-2">
                                        <Upload size={14} /> Add Images
                                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleBulkImageUpload} />
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleAddQuestion}
                                        className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-900 transition-colors flex items-center gap-2"
                                    >
                                        + Add Manual Question
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {questions.map((q, qIdx) => (
                                    <div key={qIdx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative group animate-in slide-in-from-top-2">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveQuestion(qIdx)}
                                            className="absolute -right-2 -top-2 bg-white border border-slate-200 p-1.5 rounded-full text-slate-400 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>

                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                            {/* Left: Image/Preview */}
                                            <div className="md:col-span-3 flex flex-col gap-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Question Image</label>
                                                {q.file || q.filename ? (
                                                    <div className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group/image">
                                                        <img
                                                            src={q.preview || `http://localhost:5000/uploads/${q.filename}`}
                                                            alt="Question content"
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleFileChange(qIdx, null)}
                                                            className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover/image:opacity-100 flex items-center justify-center transition-opacity text-xs font-bold"
                                                        >
                                                            {q.filename ? 'Remove Image' : 'Change Image'}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <label className="aspect-square rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#C2410C]/30 hover:bg-[#C2410C]/5 transition-all">
                                                        <Upload size={20} className="text-slate-300" />
                                                        <span className="text-[10px] font-bold text-slate-400">Upload Image</span>
                                                        <input type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(qIdx, e.target.files[0])} />
                                                    </label>
                                                )}
                                            </div>

                                            {/* Right: Text Content */}
                                            <div className="md:col-span-9 space-y-4">
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Question Text</label>
                                                    <textarea
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C2410C]/20 text-sm h-20 resize-none font-medium"
                                                        placeholder="Enter question text..."
                                                        value={q.question}
                                                        onChange={e => handleQuestionChange(qIdx, 'question', e.target.value)}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {q.options.map((opt, oIdx) => (
                                                        <div key={oIdx} className="flex items-center gap-2">
                                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${q.answer === oIdx ? 'bg-[#C2410C] text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                                {String.fromCharCode(65 + oIdx)}
                                                            </div>
                                                            <input
                                                                type="text"
                                                                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C2410C]/20 text-sm"
                                                                placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                                                                value={opt}
                                                                onChange={e => handleQuestionChange(qIdx, 'options', { optIdx: oIdx, val: e.target.value })}
                                                            />
                                                            <input
                                                                type="radio"
                                                                name={`edit-answer-${qIdx}`}
                                                                checked={q.answer === oIdx}
                                                                onChange={() => handleQuestionChange(qIdx, 'answer', oIdx)}
                                                                className="w-4 h-4 accent-[#C2410C] cursor-pointer"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-slate-600 hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        form="edit-form"
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl bg-[#C2410C] hover:bg-[#9a3412] text-white font-bold shadow-lg shadow-orange-900/20 transition-all disabled:opacity-70"
                    >
                        {loading ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
