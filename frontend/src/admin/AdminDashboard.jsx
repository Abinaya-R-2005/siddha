import React, { useState, useEffect } from 'react';
import {
    TrendingUp, Calendar, FileText, ChevronDown, Trash2, Edit, Download, Upload, X, Check, Search, Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import AdminLayout from '../components/Layout/AdminLayout';

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
    const [subjects, setSubjects] = useState([]);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [editingBank, setEditingBank] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState('All Subjects');
    const [selectedCategory, setSelectedCategory] = useState('MRB'); // For filtering Question Vault
    const [newSubject, setNewSubject] = useState('');
    const [newSubjectCategory, setNewSubjectCategory] = useState('MRB');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [editingSubject, setEditingSubject] = useState(null); // { _id, name }
    const [reattemptRequests, setReattemptRequests] = useState([]);
    const [pendingRegistrations, setPendingRegistrations] = useState([]);
    const [requestType, setRequestType] = useState('registration'); // 'registration' or 'reattempt'
    const navigate = useNavigate();

    // ... fetchAllData ...

    // ... useEffect ...

    // ... handleLogout ...

    // ... handleUploadSuccess ...

    // ... handleDelete ...

    const handleAddSubject = async () => {
        if (!newSubject.trim()) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/admin/subjects', {
                name: newSubject,
                category: newSubjectCategory
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewSubject('');
            fetchAllData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add subject');
        }
    };

    const handleDeleteSubject = async (id) => {
        if (!window.confirm("Delete this subject? Associated questions might lose their category.")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/admin/subjects/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAllData();
        } catch (err) {
            alert('Failed to delete subject');
        }
    };

    const requestUpdateSubject = async (id, newName) => {
        if (!newName.trim()) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/admin/subjects/${id}`, { name: newName }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditingSubject(null);
            fetchAllData();
        } catch (err) {
            alert('Failed to update subject: ' + (err.response?.data?.message || err.message));
        }
    };


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

            const subResponse = await axios.get('http://localhost:5000/api/subjects');
            setSubjects(subResponse.data);

            const reRes = await axios.get('http://localhost:5000/api/admin/reattempt-requests', config);
            setReattemptRequests(reRes.data);

            const pendingRegRes = await axios.get('http://localhost:5000/api/admin/pending-registrations', config);
            setPendingRegistrations(pendingRegRes.data);

        } catch (err) {
            console.log("Using mock data as backend failed or unauthorized", err);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
    }, [navigate]);

    const handleDeleteStudent = async (id) => {
        if (!window.confirm("Are you sure you want to delete this student and all their records?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAllData();
        } catch (err) {
            alert('Failed to delete student: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleReattemptAction = async (requestId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/admin/reattempt-requests/${requestId}`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAllData();
        } catch (err) {
            alert('Action failed: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleApprovalAction = async (id, action) => {
        try {
            const token = localStorage.getItem('token');
            const endpoint = action === 'approve'
                ? `http://localhost:5000/api/admin/approve-registration/${id}`
                : `http://localhost:5000/api/admin/reject-registration/${id}`;

            await axios.put(endpoint, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAllData();
        } catch (err) {
            alert('Action failed: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleToggleStatus = async (bank) => {
        const id = bank._id || bank.id;
        if (!id) {
            alert('Error: Question bank ID not found');
            return;
        }
        const newStatus = bank.status === 'published' ? 'disabled' : 'published';
        try {
            const token = localStorage.getItem('token');
            console.log(`Toggling status for ${id} to ${newStatus}`);
            await axios.patch(`http://localhost:5000/api/admin/question-banks/${id}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAllData();
        } catch (err) {
            console.error("Status update error", err);
            alert('Failed to update test status: ' + (err.response?.data?.message || err.message));
        }
    };

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
        <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            <div className="p-4 md:p-8 lg:p-12">

                {/* Header for all pages */}
                <header className="flex flex-col md:flex-row justify-between items-start mb-8 lg:mb-10 gap-6">
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
                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-[#0F172A] mb-1 md:mb-2">Student Management</h2>
                                <p className="text-slate-500 text-sm md:text-base">Track individual student progress</p>
                            </>
                        )}
                        {activeTab === 'Requests' && (
                            <>
                                <h2 className="text-4xl font-serif font-bold text-[#0F172A] mb-2">Re-attempt Requests</h2>
                                <p className="text-slate-500">Manage student requests for test re-takes</p>
                            </>
                        )}
                        {activeTab === 'Subjects' && (
                            <>
                                <h2 className="text-4xl font-serif font-bold text-[#0F172A] mb-2">Subject Management</h2>
                                <p className="text-slate-500">Organize and categorize your curriculum</p>
                            </>
                        )}
                        {activeTab === 'Approvals' && (
                            <>
                                <h2 className="text-4xl font-serif font-bold text-[#0F172A] mb-2">Registration Approvals</h2>
                                <p className="text-slate-500">Approve or reject new user registrations</p>
                            </>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        {activeTab === 'Question Vault' && (
                            <button
                                onClick={() => setIsUploadModalOpen(true)}
                                className="w-full sm:w-auto bg-[#C2410C] hover:bg-[#9a3412] text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-orange-900/10"
                            >
                                <Upload size={16} /> Upload New
                            </button>
                        )}
                        <div className="relative w-full sm:w-48 bg-white border border-slate-200 rounded-xl overflow-hidden">
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="w-full px-4 py-2.5 text-sm font-semibold text-gray-700 bg-transparent appearance-none focus:outline-none cursor-pointer"
                            >
                                <option>All Subjects</option>
                                {subjects.length > 0 ? subjects.map(s => (
                                    <option key={s._id || s.name} value={s.name}>{s.name}</option>
                                )) : (
                                    ['Noi Naadal', 'Maruthuvam', 'Gunapadam', 'Sirappu Maruthuvam', 'Varma Kalai'].map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))
                                )}
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
                        </div>
                        {/* Tab buttons removed as they are now in the sidebar */}
                    </div>
                </header>

                {/* CONTENT: OVERVIEW */}
                {activeTab === 'Overview' && (
                    <div className="space-y-12">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                            <OverviewCard icon={<Users size={24} className="text-blue-500" />} value={stats.totalStudents} label="Total Students" />
                            <OverviewCard icon={<FileText size={24} className="text-teal-500" />} value={stats.totalTests} label="Total Tests" />
                            <OverviewCard icon={<TrendingUp size={24} className="text-orange-500" />} value={`${stats.globalAverage}%`} label="Global Average" />
                            <OverviewCard icon={<Calendar size={24} className="text-green-500" />} value={stats.activeToday} label="Active Today" />
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
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
                        <div className="mb-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                            <div className="flex bg-slate-100 p-1 rounded-xl">
                                {['MRB', 'AIAPGET'].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${selectedCategory === cat ? 'bg-white text-[#C2410C] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        {cat} Questions
                                    </button>
                                ))}
                            </div>
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder={`Search ${selectedCategory} question banks...`}
                                    className="pl-10 pr-4 py-2 w-full rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {questionBanks
                                .filter(b => b.category === selectedCategory)
                                .filter(b => selectedSubject === 'All Subjects' || b.subject === selectedSubject)
                                .length > 0 ?
                                questionBanks
                                    .filter(b => b.category === selectedCategory)
                                    .filter(b => selectedSubject === 'All Subjects' || b.subject === selectedSubject)
                                    .map((bank) => (
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
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-tighter">Test Status</span>
                                                    <button
                                                        onClick={() => handleToggleStatus(bank)}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${bank.status === 'published' ? 'bg-green-500' : 'bg-slate-300'}`}
                                                    >
                                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${bank.status === 'published' ? 'translate-x-6' : 'translate-x-1'}`} />
                                                    </button>
                                                    <span className={`text-[10px] font-bold mt-1 uppercase ${bank.status === 'published' ? 'text-green-600' : 'text-slate-400'}`}>
                                                        {bank.status === 'published' ? 'Active' : 'Disabled'}
                                                    </span>
                                                </div>
                                                <div className="w-px h-10 bg-slate-100 mx-1"></div>
                                                <button onClick={() => handleDownload(bank)} className="p-2 text-slate-400 hover:text-teal-600 transition-colors" title="Download"><Download size={18} /></button>
                                                <button onClick={() => setEditingBank(bank)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Edit"><Edit size={18} /></button>
                                                <button onClick={() => handleDelete(bank._id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors" title="Delete"><Trash2 size={18} /></button>
                                            </div>
                                        </div>
                                    )) : (
                                    <div className="text-center py-10 text-slate-400">
                                        No question banks found for {selectedSubject}.
                                    </div>
                                )}
                        </div>
                    </div>
                )
                }

                {/* CONTENT: STUDENTS */}
                {
                    activeTab === 'Students' && (
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

                            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden overflow-x-auto">
                                <table className="w-full text-left min-w-[800px] md:min-w-full">
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
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => setSelectedStudent(user)} className="text-blue-600 font-bold hover:underline text-xs">View</button>
                                                        <button onClick={() => handleDeleteStudent(user._id)} className="text-red-600 font-bold hover:underline text-xs">Delete</button>
                                                    </div>
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
                    )
                }
                {/* CONTENT: REQUESTS */}
                {
                    activeTab === 'Requests' && (
                        <div className="space-y-6">
                            <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                                <button
                                    onClick={() => setRequestType('registration')}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${requestType === 'registration' ? 'bg-white text-[#C2410C] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Registration ({pendingRegistrations.length})
                                </button>
                                <button
                                    onClick={() => setRequestType('reattempt')}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${requestType === 'reattempt' ? 'bg-white text-[#C2410C] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Re-attempts ({reattemptRequests.filter(r => r.status === 'pending').length})
                                </button>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                                {requestType === 'registration' ? (
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                                            <tr>
                                                <th className="px-6 py-4">User Details</th>
                                                <th className="px-6 py-4">Role</th>
                                                <th className="px-6 py-4 text-center">Course</th>
                                                <th className="px-6 py-4">Registration Date</th>
                                                <th className="px-6 py-4 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-sm">
                                            {pendingRegistrations.map((user, i) => (
                                                <tr key={i} className="hover:bg-slate-50">
                                                    <td className="px-6 py-4">
                                                        <p className="font-bold text-slate-900">{user.fullName}</p>
                                                        <p className="text-xs text-slate-400">{user.email}</p>
                                                    </td>
                                                    <td className="px-6 py-4 uppercase font-bold text-xs text-slate-500">
                                                        {user.role}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`px-2 py-1 rounded-full text-[10px] font-black tracking-wider ${user.category === 'AIAPGET' ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'}`}>
                                                            {user.category || 'MRB'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                        <button onClick={() => handleApprovalAction(user._id, 'approve')} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition-colors flex items-center gap-1">
                                                            <Check size={14} /> Approve
                                                        </button>
                                                        <button onClick={() => handleApprovalAction(user._id, 'reject')} className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-1">
                                                            <X size={14} /> Reject
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {pendingRegistrations.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-10 text-slate-400 font-medium italic">No pending registrations found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                ) : (
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                                            <tr>
                                                <th className="px-6 py-4">Student</th>
                                                <th className="px-6 py-4">Assessment</th>
                                                <th className="px-6 py-4">Date</th>
                                                <th className="px-6 py-4 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-sm">
                                            {reattemptRequests.filter(r => r.status === 'pending').map((req, i) => (
                                                <tr key={i} className="hover:bg-slate-50">
                                                    <td className="px-6 py-4">
                                                        <p className="font-bold text-slate-900">{req.userId?.fullName}</p>
                                                        <p className="text-xs text-slate-400">{req.userId?.email}</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="font-medium text-slate-700">{req.testId?.title}</p>
                                                        <p className="text-[10px] text-teal-600 font-bold">{req.testId?.subject}</p>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500">{new Date(req.createdAt).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                        <button onClick={() => handleReattemptAction(req._id, 'approved')} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition-colors flex items-center gap-1">
                                                            <Check size={14} /> Approve
                                                        </button>
                                                        <button onClick={() => handleReattemptAction(req._id, 'rejected')} className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-1">
                                                            <X size={14} /> Reject
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {reattemptRequests.filter(r => r.status === 'pending').length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-10 text-slate-400 font-medium italic">No pending re-attempt requests</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )
                }
                {/* CONTENT: SUBJECTS */}
                {
                    activeTab === 'Subjects' && (
                        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                            <div className="mb-8 flex flex-wrap gap-4 items-end">
                                <div className="flex-1 min-w-[300px]">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subject Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter subject name (e.g., Varma Kalai)"
                                        value={newSubject}
                                        onChange={(e) => setNewSubject(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C2410C]/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                                    <select
                                        value={newSubjectCategory}
                                        onChange={(e) => setNewSubjectCategory(e.target.value)}
                                        className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C2410C]/20 bg-white"
                                    >
                                        <option value="MRB">MRB</option>
                                        <option value="AIAPGET">AIAPGET</option>
                                    </select>
                                </div>
                                <button
                                    onClick={handleAddSubject}
                                    disabled={!newSubject.trim()}
                                    className="bg-[#C2410C] hover:bg-[#9a3412] text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 h-[50px]"
                                >
                                    <Upload size={20} className="inline mr-2" /> Add Subject
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {subjects.map((sub) => (
                                    <div key={sub._id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center group hover:bg-white hover:shadow-md transition-all">
                                        {editingSubject?._id === sub._id ? (
                                            <div className="flex flex-1 gap-2">
                                                <input
                                                    type="text"
                                                    className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded text-sm"
                                                    value={editingSubject.name}
                                                    onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                                                />
                                                <button onClick={() => requestUpdateSubject(sub._id, editingSubject.name)} className="text-green-600 hover:bg-green-100 p-1 rounded"><Check size={16} /></button>
                                                <button onClick={() => setEditingSubject(null)} className="text-red-500 hover:bg-red-100 p-1 rounded"><X size={16} /></button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-800">{sub.name}</span>
                                                    <span className="text-[10px] font-bold text-teal-600 uppercase tracking-tight">{sub.category}</span>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => setEditingSubject(sub)}
                                                        className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteSubject(sub._id)}
                                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {subjects.length === 0 && (
                                <div className="text-center py-12 text-slate-400">No subjects found. Add one to get started.</div>
                            )}
                        </div>
                    )
                }



                {/* Modals */}
                {
                    isUploadModalOpen && (
                        <UploadModal
                            onClose={() => setIsUploadModalOpen(false)}
                            onSuccess={handleUploadSuccess}
                            onAuthError={handleLogout}
                            subjects={subjects}
                        />
                    )
                }
                {
                    editingBank && (
                        <EditModal
                            bank={editingBank}
                            onClose={() => setEditingBank(null)}
                            onSuccess={handleUploadSuccess}
                            subjects={subjects}
                        />
                    )
                }
                {
                    selectedStudent && (
                        <StudentDetailsModal
                            student={selectedStudent}
                            onClose={() => setSelectedStudent(null)}
                        />
                    )
                }
            </div >
        </AdminLayout >
    );
};

// Sub-components
const OverviewCard = ({ icon, value, label }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
        <div className="mb-4 bg-slate-50 p-3 rounded-xl">{icon}</div>
        <h3 className="text-3xl font-serif font-bold text-slate-800 mb-1">{value}</h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
);

const UploadModal = ({ onClose, onSuccess, onAuthError, subjects = [] }) => {
    const [formData, setFormData] = useState({
        title: '',
        subject: 'Noi Naadal',
        difficulty: 'Easy',
        category: 'MRB',
        negativeMarking: false,
        duration: 60,
        status: 'published'
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
        data.append('duration', formData.duration);
        data.append('status', formData.status);

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


    const triggerSubmit = async (e, forceStatus) => {
        e.preventDefault();
        const updatedStatus = forceStatus || formData.status;

        if (questions.length === 0) return alert('Please add at least one question');

        setLoading(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('subject', formData.subject);
        data.append('difficulty', formData.difficulty);
        data.append('negativeMarking', formData.negativeMarking);
        data.append('duration', formData.duration);
        data.append('status', updatedStatus);
        data.append('category', formData.category);


        const filesToSend = [];
        const questionsToSave = questions.map((q) => {
            const qCopy = { ...q };
            if (qCopy.file) {
                filesToSend.push(qCopy.file);
                qCopy.hasNewFile = true;
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
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Category</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C2410C]/20 text-sm bg-white"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value, subject: subjects.find(s => s.category === e.target.value)?.name || '' })}
                                >
                                    <option value="MRB">MRB</option>
                                    <option value="AIAPGET">AIAPGET</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Subject</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C2410C]/20 text-sm bg-white"
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                >
                                    {subjects.filter(s => s.category === formData.category).length > 0 ? (
                                        subjects.filter(s => s.category === formData.category).map((sub, i) => (
                                            <option key={i} value={sub.name}>{sub.name}</option>
                                        ))
                                    ) : (
                                        <option value="">No subjects found</option>
                                    )}
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
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Duration (Min)</label>
                                <input
                                    required
                                    type="number"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C2410C]/20 text-sm"
                                    value={formData.duration}
                                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
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
                        type="button"
                        onClick={(e) => triggerSubmit(e, 'draft')}
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl border-2 border-slate-200 font-bold text-slate-700 hover:bg-slate-100 transition-all disabled:opacity-70"
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={(e) => triggerSubmit(e, 'published')}
                        type="button"
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl bg-[#0F172A] hover:bg-black text-white font-bold shadow-lg shadow-slate-900/10 transition-all disabled:opacity-70"
                    >
                        {loading ? 'Creating...' : 'Post Question Bank'}
                    </button>
                </div>
            </div >
        </div >
    );
};

const EditModal = ({ bank, onClose, onSuccess, subjects = [] }) => {
    const [formData, setFormData] = useState({
        title: bank.title,
        subject: bank.subject,
        category: bank.category || 'MRB',
        difficulty: bank.difficulty || 'Easy',
        duration: bank.duration || 60,
        status: bank.status || 'published'
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
        data.append('duration', formData.duration);
        data.append('status', formData.status);
        data.append('category', formData.category);

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
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Category</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C2410C]/20 text-sm bg-white"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value, subject: subjects.find(s => s.category === e.target.value)?.name || formData.subject })}
                                >
                                    <option value="MRB">MRB</option>
                                    <option value="AIAPGET">AIAPGET</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Subject</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C2410C]/20 text-sm bg-white"
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                >
                                    {subjects.filter(s => s.category === formData.category).length > 0 ? (
                                        subjects.filter(s => s.category === formData.category).map(s => (
                                            <option key={s._id || s.name} value={s.name}>{s.name}</option>
                                        ))
                                    ) : (
                                        <option value="">No subjects found</option>
                                    )}
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
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Duration (Min)</label>
                                <input
                                    required
                                    type="number"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C2410C]/20 text-sm"
                                    value={formData.duration}
                                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
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
            </div >
        </div >
    );
};

const StudentDetailsModal = ({ student, onClose }) => {
    if (!student) return null;
    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 relative animate-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                    <X size={20} className="text-slate-500" />
                </button>

                <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                        🎓
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-slate-800">{student.fullName}</h2>
                    <p className="text-slate-500 font-medium">{student.role || 'Student'}</p>
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                        <span className="text-sm font-bold text-slate-500">Email</span>
                        <span className="text-sm font-medium text-slate-900">{student.email}</span>
                    </div>
                    {student.regNo && (
                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                            <span className="text-sm font-bold text-slate-500">Reg No</span>
                            <span className="text-sm font-medium text-slate-900">{student.regNo}</span>
                        </div>
                    )}
                    {student.mobile && (
                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                            <span className="text-sm font-bold text-slate-500">Mobile</span>
                            <span className="text-sm font-medium text-slate-900">{student.mobile}</span>
                        </div>
                    )}
                    {student.address && (
                        <div className="flex flex-col gap-1 bg-slate-50 p-3 rounded-lg">
                            <span className="text-sm font-bold text-slate-500">Address</span>
                            <span className="text-sm font-medium text-slate-900">{student.address}</span>
                        </div>
                    )}
                    {student.course && (
                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                            <span className="text-sm font-bold text-slate-500">Course</span>
                            <span className="text-sm font-medium text-slate-900">{student.course}</span>
                        </div>
                    )}
                    {student.year && (
                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                            <span className="text-sm font-bold text-slate-500">Year</span>
                            <span className="text-sm font-medium text-slate-900">{student.year}</span>
                        </div>
                    )}
                    {student.expertise && (
                        <div className="flex flex-col gap-1 bg-slate-50 p-3 rounded-lg">
                            <span className="text-sm font-bold text-slate-500">Bio / Expertise</span>
                            <span className="text-sm font-medium text-slate-900">{student.expertise}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                        <span className="text-sm font-bold text-slate-500">Tests Taken</span>
                        <span className="text-sm font-medium text-slate-900">{student.testsCompleted || 0}</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                        <span className="text-sm font-bold text-slate-500">Average Score</span>
                        <span className="text-sm font-medium text-slate-900">{student.averageScore || 0}%</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                        <span className="text-sm font-bold text-slate-500">Joined On</span>
                        <span className="text-sm font-medium text-slate-900">
                            {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                        <span className="text-sm font-bold text-slate-500">Last Active</span>
                        <span className="text-sm font-medium text-slate-900">
                            {student.lastActive ? new Date(student.lastActive).toLocaleString() : 'Never'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
