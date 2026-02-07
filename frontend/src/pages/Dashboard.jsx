import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, LineChart, User,
  LogOut, Menu, X, Award, Flame, Clock,
  Calendar, ChevronDown, FileText, ArrowRight
} from 'lucide-react';

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [user, setUser] = useState({ fullName: "Scholar", role: "student" });
  const [exams, setExams] = useState([]);
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

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const stats = [
    { label: "Tests Completed", value: user.testsCompleted || "0", sub: "Keep going!", icon: BookOpen, color: "text-teal-600", bg: "bg-teal-50", category: "Overall" },
    { label: "Average Score", value: `${user.averageScore || 0}%`, sub: "View Details", icon: Award, color: "text-orange-600", bg: "bg-orange-50", category: "Performance", link: "/progresspage" },
    { label: "Day Streak", value: "7", sub: "Keep it up! 🔥", icon: Flame, color: "text-red-600", bg: "bg-red-50", category: "Current" },
    { label: "Role", value: (user.role || 'Student').toUpperCase(), sub: user.course || "BSMS", icon: User, color: "text-blue-600", bg: "bg-blue-50", category: "Account" },
  ];

  const activityData = Array.from({ length: 84 }, () => Math.floor(Math.random() * 4));
  const filteredExams = selectedSubject === 'All Subjects' ? exams : exams.filter(e => e.subject === selectedSubject);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#FDFCFB] font-sans text-slate-900">
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#0F172A] text-white transition-all duration-300 flex flex-col fixed h-full z-50`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-serif font-bold tracking-tight text-teal-400">Siddha-Veda</motion.h1>}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-slate-800 rounded-md">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 mt-4 px-4 space-y-2">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={window.location.pathname === '/dashboard'}
            isOpen={isSidebarOpen}
            onClick={() => navigate('/dashboard')}
          />
          <NavItem
            icon={<LineChart size={20} />}
            label="Progress"
            isOpen={isSidebarOpen}
            onClick={() => navigate('/progresspage')}
          />
          <NavItem
            icon={<User size={20} />}
            label="Profile"
            isOpen={isSidebarOpen}
            onClick={() => navigate('/profilepage')}
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="flex items-center gap-4 px-4 py-3 w-full text-slate-400 hover:text-white transition-colors hover:bg-red-500/10 rounded-xl">
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} p-8 md:p-12`}>
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-2">Welcome back, {user.fullName}</h2>
            <p className="text-gray-500 text-lg">Continue your journey through ancient wisdom</p>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <motion.div
              whileHover={{ y: -5 }}
              key={idx}
              onClick={() => stat.link && navigate(stat.link)}
              className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all ${stat.link ? 'cursor-pointer hover:border-teal-200' : ''}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}><stat.icon size={24} /></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.category}</span>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              {stat.link && <p className="text-xs text-teal-600 mt-2 font-bold flex items-center gap-1">View Analytics →</p>}
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
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:border-[rgb(13,148,136)]/20 cursor-pointer group"
                onClick={() => navigate('/create-test')}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-xl bg-[rgb(13,148,136)]/5 text-[rgb(13,148,136)]">
                    <FileText size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assessment</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[rgb(13,148,136)] transition-colors">Assign New Test</h3>
                <p className="text-sm text-gray-500 mb-6">Create questions, set topics, and define marking schemes for students.</p>
                <div className="flex items-center text-[rgb(13,148,136)] font-bold text-sm gap-2">
                  Create Test <ArrowRight size={16} />
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* UPCOMING EXAMS SECTION */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h3 className="text-2xl font-serif font-bold text-slate-800">Available Assessments</h3>
            <div className="relative group">
              <select
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
              >
                <option>All Subjects</option>
                <option>Noi Naadal</option>
                <option>Maruthuvam</option>
                <option>Gunapadam</option>
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
                    <span className={`bg-teal-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider`}>
                      {exam.subject}
                    </span>
                    <Calendar className="text-gray-300" size={20} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-teal-600 transition-colors">{exam.title}</h4>
                  <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-500 mb-8">
                    <div className="flex items-center gap-2"><Calendar size={16} className="text-teal-500" /> {new Date(exam.createdAt).toLocaleDateString()}</div>
                    <div className="flex items-center gap-2"><Clock size={16} className="text-teal-500" /> 20 mins</div>
                    <div className="text-gray-400 font-medium">{exam.questionsCount || 0} questions • {exam.difficulty}</div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/test/${exam._id}`)}
                    className="w-full bg-[#0D9488] hover:bg-[#0A756C] text-white font-bold py-4 rounded-xl shadow-lg"
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
              <div key={i} className={`w-[18px] h-[18px] rounded-[2px] ${level === 0 ? 'bg-gray-100' : level === 1 ? 'bg-teal-100' : level === 2 ? 'bg-teal-300' : 'bg-teal-600'}`} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, isOpen, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-4 px-4 py-3 rounded-xl w-full transition-all ${active ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
  >
    {icon} {isOpen && <span className="font-medium whitespace-nowrap">{label}</span>}
  </button>
);

export default Dashboard;