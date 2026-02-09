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

  const stats = [
    { label: "Tests Completed", value: user.testsCompleted || "0", sub: "Keep going!", icon: BookOpen, color: "text-blue-900", bg: "bg-blue-50", category: "Overall" },
    { label: "Average Score", value: `${user.averageScore || 0}%`, sub: "View Details", icon: Award, color: "text-orange-600", bg: "bg-orange-50", category: "Performance", link: "/progresspage" },
    { label: "Day Streak", value: "7", sub: "Keep it up! 🔥", icon: Flame, color: "text-red-600", bg: "bg-red-50", category: "Current" },
    { label: "Role", value: (user.role || 'Student').toUpperCase(), sub: user.course || "BSMS", icon: User, color: "text-blue-600", bg: "bg-blue-50", category: "Account" },
  ];

  const activityData = Array.from({ length: 84 }, () => Math.floor(Math.random() * 4));
  const filteredExams = selectedSubject === 'All Subjects' ? exams : exams.filter(e => e.subject === selectedSubject);

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
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}><stat.icon size={24} /></div>
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
                    <Calendar className="text-gray-300" size={20} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-900 transition-colors">{exam.title}</h4>
                  <div className="flex flex-wrap gap-y-2 gap-x-4 lg:gap-x-6 text-sm text-gray-500 mb-8">
                    <div className="flex items-center gap-2"><Calendar size={16} className="text-blue-700" /> {new Date(exam.createdAt).toLocaleDateString()}</div>
                    <div className="flex items-center gap-2"><Clock size={16} className="text-blue-700" /> 20 mins</div>
                    <div className="text-gray-400 font-medium">{exam.questionsCount || 0} Qs • {exam.difficulty}</div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/test/${exam._id}`)}
                    className="w-full bg-[#0F172A] hover:bg-[#1e293b] text-white font-bold py-4 rounded-xl shadow-lg"
                  >
                    Start Test
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* HEATMAP SECTION */}
        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Consistency Streak</h3>
          <div className="grid grid-flow-col grid-rows-7 gap-[12px] w-max overflow-x-auto">
            {activityData.map((level, i) => (
              <div key={i} className={`w-[18px] h-[18px] rounded-[2px] ${level === 0 ? 'bg-gray-100' : level === 1 ? 'bg-blue-100' : level === 2 ? 'bg-blue-300' : 'bg-[#0F172A]'}`} />
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;