import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Users,
    LogOut, Search,
    TrendingUp, Calendar, FileText, ChevronDown, Trash2, Edit, Download, Upload, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();

    const fetchAllData = async () => {
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
            console.log("Using mock data as backend failed or unauthorized");
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleUploadSuccess = () => {
        setIsUploadModalOpen(false);
        fetchAllData(); // Refresh list
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
                        <div className="relative group w-48 bg-white border border-slate-200 rounded-lg">
                            <button className="w-full px-4 py-2 flex items-center justify-between text-sm font-semibold text-gray-700">
                                All Subjects <ChevronDown size={16} />
                            </button>
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
                            {questionBanks.length > 0 ? questionBanks.map((bank) => (
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
                                        <button className="p-2 text-slate-400 hover:text-teal-600 transition-colors"><Download size={18} /></button>
                                        <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit size={18} /></button>
                                        <button className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-10 text-slate-400">
                                    No question banks uploaded yet.
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
                <UploadModal onClose={() => setIsUploadModalOpen(false)} onSuccess={handleUploadSuccess} />
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

const UploadModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        subject: 'Noi Naadal',
        difficulty: 'Easy',
        file: null
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.file) return alert('Please select a file');

        setLoading(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('subject', formData.subject);
        data.append('difficulty', formData.difficulty);
        data.append('file', formData.file);

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
            alert('Upload failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-xl font-serif font-bold text-slate-800">Upload Question Bank</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-500" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Title</label>
                        <input
                            required
                            type="text"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C2410C]/20 text-sm"
                            placeholder="e.g., Advanced Diagnostics"
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

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Upload File</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                            <input
                                required
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={e => setFormData({ ...formData, file: e.target.files[0] })}
                            />
                            <Upload className="mx-auto text-gray-300 mb-2" size={32} />
                            <p className="text-sm font-medium text-gray-500">
                                {formData.file ? formData.file.name : "Click to upload or drag and drop"}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">PDF or JSON files only</p>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-lg border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2.5 rounded-lg bg-[#C2410C] hover:bg-[#9a3412] text-white font-bold shadow-lg shadow-orange-900/20 transition-all disabled:opacity-70"
                        >
                            {loading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;
