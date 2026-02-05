import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, BookOpen, LineChart, User, 
  LogOut, Menu, X, Award, Flame, Clock, 
  Calendar, ChevronDown, MonitorPlay
} from 'lucide-react';

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const navigate = useNavigate();
  
  const user = { name: "Scholar", role: "student" };

  const stats = [
    { label: "Tests Completed", value: "24", sub: "+12% from last month", icon: BookOpen, color: "text-teal-600", bg: "bg-teal-50", category: "This month" },
    { label: "Overall Score", value: "82.5%", sub: "+5.2% improvement", icon: Award, color: "text-orange-600", bg: "bg-orange-50", category: "Average" },
    { label: "Day Streak", value: "7", sub: "Keep it up! 🔥", icon: Flame, color: "text-red-600", bg: "bg-red-50", category: "Current" },
    { label: "Study Hours", value: "156", sub: "26h this week", icon: Clock, color: "text-blue-600", bg: "bg-blue-50", category: "Total" },
  ];

  const exams = [
    { id: 1, title: "Diagnostic Methods Assessment", subject: "Noi Naadal", date: "Feb 10, 2026", time: "10:00 AM", duration: "60 mins", questions: 50, color: "bg-[#0D9488]" },
    { id: 2, title: "Treatment Principles Exam", subject: "Maruthuvam", date: "Feb 12, 2026", time: "2:00 PM", duration: "90 mins", questions: 75, color: "bg-[#C2410C]" },
    { id: 3, title: "Pharmacology Quiz", subject: "Gunapadam", date: "Feb 15, 2026", time: "11:00 AM", duration: "45 mins", questions: 40, color: "bg-[#2563EB]" },
    { id: 4, title: "Specialized Medicine Test", subject: "Sirappu Maruthuvam", date: "Feb 18, 2026", time: "9:00 AM", duration: "120 mins", questions: 100, color: "bg-[#9333EA]" },
  ];

  const activityData = Array.from({ length: 84 }, () => Math.floor(Math.random() * 4));
  const filteredExams = selectedSubject === 'All Subjects' ? exams : exams.filter(e => e.subject === selectedSubject);

  return (
    <div className="flex min-h-screen bg-[#FDFCFB] font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#0F172A] text-white transition-all duration-300 flex flex-col fixed h-full z-50`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && <motion.h1 initial={{opacity:0}} animate={{opacity:1}} className="text-xl font-serif font-bold tracking-tight text-teal-400">Siddha-Veda</motion.h1>}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-slate-800 rounded-md">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 mt-4 px-4 space-y-2">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active={true} isOpen={isSidebarOpen} />
          <NavItem icon={<BookOpen size={20}/>} label="My Tests" isOpen={isSidebarOpen} />
          <NavItem icon={<LineChart size={20}/>} label="Progress" isOpen={isSidebarOpen} />
          <NavItem icon={<User size={20}/>} label="Profile" isOpen={isSidebarOpen} />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={() => navigate('/login')} className="flex items-center gap-4 px-4 py-3 w-full text-slate-400 hover:text-white transition-colors hover:bg-red-500/10 rounded-xl">
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} p-8 md:p-12`}>
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-2">Welcome back, {user.name}</h2>
            <p className="text-gray-500 text-lg">Continue your journey through ancient wisdom</p>
          </div>
          <div className="flex gap-2 mb-2">
             {/* Small visual heatmap dots from image */}
             {[...Array(8)].map((_,i) => (
               <div key={i} className={`w-6 h-6 rounded-md ${i < 4 ? 'bg-teal-200' : 'bg-teal-50'}`} />
             ))}
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <motion.div 
              whileHover={{ y: -5 }}
              key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}><stat.icon size={24} /></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.category}</span>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* UPCOMING EXAMS SECTION */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h3 className="text-2xl font-serif font-bold text-slate-800">Upcoming Exams</h3>
            <div className="relative group">
              <select 
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer"
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
                  key={exam.id}
                  className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className={`${exam.color} text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider`}>
                      {exam.subject}
                    </span>
                    <Calendar className="text-gray-300" size={20} />
                  </div>
                  
                  <h4 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-teal-600 transition-colors">{exam.title}</h4>
                  
                  <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-500 mb-8">
                    <div className="flex items-center gap-2"><Calendar size={16} className="text-teal-500"/> {exam.date}</div>
                    <div className="flex items-center gap-2"><Clock size={16} className="text-teal-500"/> {exam.time}</div>
                    <div className="text-gray-400 font-medium">{exam.duration} • {exam.questions} questions</div>
                  </div>

                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-[#0D9488] hover:bg-[#0A756C] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-teal-900/10 flex items-center justify-center gap-2"
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
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Consistency Streak</h3>
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3].map(lvl => (
                  <div key={lvl} className={`w-3 h-3 rounded-[2px] ${lvl === 0 ? 'bg-gray-100' : lvl === 1 ? 'bg-teal-100' : lvl === 2 ? 'bg-teal-300' : 'bg-teal-600'}`} />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
          <div className="grid grid-flow-col grid-rows-7 gap-[12px] w-max overflow-x-auto">
            {activityData.map((level, i) => (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.005 }}
                key={i} className={`w-[14px] h-[14px] sm:w-[18px] sm:h-[18px] rounded-[2px] cursor-pointer hover:ring-2 hover:ring-teal-400 ${level === 0 ? 'bg-gray-100' : level === 1 ? 'bg-teal-100' : level === 2 ? 'bg-teal-300' : 'bg-teal-600'}`}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, isOpen }) => (
  <button className={`flex items-center gap-4 px-4 py-3 rounded-xl w-full transition-all ${active ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    {icon} {isOpen && <span className="font-medium whitespace-nowrap">{label}</span>}
  </button>
);

export default Dashboard;