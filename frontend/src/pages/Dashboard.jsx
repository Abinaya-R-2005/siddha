import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, User, Award, Flame, Clock,
  Calendar, ChevronDown, FileText, ArrowRight
} from 'lucide-react';
import DashboardLayout from '../components/Layout/DashboardLayout';

const Dashboard = () => {
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [user, setUser] = useState({ fullName: "Scholar", role: "student" });
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // State for re-attempt modal
  const [showReattemptModal, setShowReattemptModal] = useState(false);
  const [selectedTestToRequest, setSelectedTestToRequest] = useState(null);
  const [requestLoading, setRequestLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Fetch user profile
        const userRes = await fetch('http://localhost:5000/api/user/profile', config);
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        }

        // Fetch tests
        const testsRes = await fetch('http://localhost:5000/api/user/tests', config);
        if (testsRes.ok) {
          const testsData = await testsRes.json();
          setExams(testsData);
        }

        // Fetch subjects
        const subRes = await fetch('http://localhost:5000/api/subjects');
        if (subRes.ok) {
          const subData = await subRes.json();
          setSubjects(subData);
        }

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleTestClick = (exam) => {
    if (exam.hasAttempted && exam.requestStatus !== 'approved') {
      setSelectedTestToRequest(exam);
      setShowReattemptModal(true);
    } else {
      navigate(`/test/${exam._id}`);
    }
  };

  const handleSendReattemptRequest = async () => {
    if (!selectedTestToRequest) return;
    setRequestLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/user/tests/${selectedTestToRequest._id}/request-reattempt`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Request sent successfully to admin!");
        // Refresh data
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to send request");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending request");
    } finally {
      setRequestLoading(false);
      setShowReattemptModal(false);
    }
  };

  const stats = [
    { label: "Tests Completed", value: user.testsCompleted || "0", sub: "Keep going!", icon: BookOpen, color: "text-blue-900", bg: "bg-blue-50", category: "Overall" },
    { label: "Average Score", value: `${user.averageScore || 0}%`, sub: "View Details", icon: Award, color: "text-orange-600", bg: "bg-orange-50", category: "Performance", link: "/progresspage" },
    { label: "Day Streak", value: "7", sub: "Keep it up! 🔥", icon: Flame, color: "text-red-600", bg: "bg-red-50", category: "Current" },
    { label: "Role", value: (user.role || 'Student').toUpperCase(), sub: user.course || "BSMS", icon: User, color: "text-blue-600", bg: "bg-blue-50", category: "Account" },
  ];

  const activityData = Array.from({ length: 84 }, () => Math.floor(Math.random() * 4));
  // Filter by subject - show ALL tests now as requested
  const filteredExams = exams.filter(e => {
    const matchesSubject = selectedSubject === 'All Subjects' || e.subject === selectedSubject;
    return matchesSubject;
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 lg:p-12">
        <header className="mb-8 lg:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-2">Welcome back, {user.fullName}</h2>
            <p className="text-gray-500 text-base md:text-lg">Continue your journey through ancient wisdom</p>
          </div>
        </header>

        {/* Re-attempt Request Modal */}
        <AnimatePresence>
          {showReattemptModal && (
            <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100"
              >
                <div className="bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
                  <FileText size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">Already Attempted</h3>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  You have already completed this assessment. To re-attempt, you must obtain permission from the administrator. Would you like to send a re-attempt request now?
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowReattemptModal(false)}
                    className="flex-1 py-4 px-6 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={requestLoading}
                    onClick={handleSendReattemptRequest}
                    className="flex-1 py-4 px-6 rounded-xl font-bold text-white bg-blue-900 hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
                  >
                    {requestLoading ? 'Sending...' : 'Request Permission'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <motion.div
              whileHover={{ y: -5 }}
              key={idx}
              onClick={() => stat.link && navigate(stat.link)}
              className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all ${stat.link ? 'cursor-pointer hover:border-blue-200' : ''}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  {React.createElement(stat.icon, { size: 24 })}
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.category}</span>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              {stat.link && <p className="text-xs text-blue-900 mt-2 font-bold flex items-center gap-1">View Analytics →</p>}
            </motion.div>
          ))}
        </div>

        {/* FACULTY TOOLS SECTION */}
        {user.role?.toLowerCase() === 'faculty' && (
          <section className="mb-12">
            <h3 className="text-2xl font-serif font-bold text-slate-800 mb-6">Faculty Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:border-[#0F172A]/20 cursor-pointer group"
                onClick={() => navigate('/create-test')}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-xl bg-[#0F172A]/5 text-[#0F172A]">
                    <FileText size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assessment</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#0F172A] transition-colors">Assign New Test</h3>
                <p className="text-sm text-gray-500 mb-6">Create questions, set topics, and define marking schemes for students.</p>
                <div className="flex items-center text-[#1e3a8a] font-bold text-sm gap-2">
                  Create Test <ArrowRight size={16} />
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* UPCOMING EXAMS SECTION */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 lg:mb-8 gap-4">
            <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-800">Available Assessments</h3>
            <div className="relative group w-full md:w-auto">
              <select
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full md:w-auto appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-900/20 cursor-pointer"
              >
                <option>All Subjects</option>
                {subjects.map((s) => (
                  <option key={s._id || s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode='popLayout'>
              {filteredExams.map((exam) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -8 }}
                  key={exam._id}
                  className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-[#0F172A] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {exam.subject}
                    </span>
                    {exam.hasAttempted || exam.requestStatus ? (
                      <div className="flex flex-col items-end">
                        {exam.hasAttempted && <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider mb-1">Attempted</span>}
                        {exam.requestStatus === 'pending' && <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider animate-pulse">Re-attempt Pending</span>}
                        {exam.requestStatus === 'rejected' && <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">Re-attempt Rejected</span>}
                        {exam.requestStatus === 'approved' && <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">Re-attempt Approved</span>}
                      </div>
                    ) : (
                      <Calendar className="text-gray-300" size={20} />
                    )}
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-900 transition-colors">{exam.title}</h4>
                  <div className="flex flex-wrap gap-y-2 gap-x-4 lg:gap-x-6 text-sm text-gray-500 mb-8">
                    <div className="flex items-center gap-2"><Calendar size={16} className="text-blue-700" /> {new Date(exam.createdAt).toLocaleDateString()}</div>
                    <div className="flex items-center gap-2"><Clock size={16} className="text-blue-700" /> {exam.duration || 20} mins</div>
                    <div className="text-gray-400 font-medium">{exam.questionsCount || 0} Qs • {exam.difficulty}</div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTestClick(exam)}
                      disabled={exam.requestStatus === 'pending' || exam.requestStatus === 'rejected'}
                      className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all ${exam.hasAttempted
                        ? (exam.requestStatus === 'rejected' ? 'bg-red-50 text-red-400 cursor-not-allowed border border-red-100' : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-900/20')
                        : 'bg-[#0F172A] hover:bg-[#1e293b] text-white'
                        } disabled:opacity-50`}
                    >
                      {exam.hasAttempted
                        ? (exam.requestStatus === 'pending' ? 'Request Pending' : exam.requestStatus === 'rejected' ? 'Request Rejected' : 'Re-attempt Test')
                        : 'Start Test'}
                    </motion.button>

                    {exam.hasAttempted && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/test/preview/${exam._id}`)}
                        className="w-full font-bold py-3 rounded-xl border-2 border-[#0F172A] text-[#0F172A] hover:bg-[#0F172A] hover:text-white transition-all"
                      >
                        Preview Test
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* HEATMAP SECTION */}

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;