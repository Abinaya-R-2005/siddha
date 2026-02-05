import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Target, Award, BookOpen, 
  ChevronLeft, AlertCircle, Lightbulb, 
  Activity, ArrowRight
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Radar, RadarChart, 
  PolarGrid, PolarAngleAxis
} from 'recharts';

const ProgressPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/user/progress', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        
        // Check if history exists to determine if we show the charts or empty state
        if (result.data && result.data.history && result.data.history.length > 0) {
          setData(result.data);
        } else {
          setData(null); 
        }
      } catch (err) {
        console.error("Progress fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 1 }} 
        className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full" 
      />
    </div>
  );

  // --- EMPTY STATE VIEW (Matches your 2nd image) ---
  if (!data) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] p-6 md:p-12">
        {/* Top Aligned Back Button */}
        <div className="max-w-6xl mx-auto mb-20">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1 text-[#0D9488] hover:opacity-70 font-bold transition-all"
          >
            <ChevronLeft size={20} /> Back to Dashboard
          </button>
        </div>

        {/* Central Content */}
        <div className="flex flex-col items-center justify-center text-center">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="bg-teal-50 p-6 rounded-full mb-6"
          >
            <BookOpen size={48} className="text-teal-600" />
          </motion.div>
          
          <h2 className="text-4xl font-serif font-bold text-slate-800 mb-4">
            Your Analytics are Preparing
          </h2>
          
          <p className="text-slate-500 max-w-lg mb-10 text-lg leading-relaxed">
            To generate your learning profile and mastery charts, you 
            must complete at least one assessment from your dashboard.
          </p>
          
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 bg-[#0D9488] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#0A756C] shadow-lg transition-all"
          >
            View Available Tests <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  // --- DATA VIEW (When tests are completed) ---
  return (
    <div className="min-h-screen bg-[#FDFCFB] p-6 md:p-12 font-sans text-slate-900">
      
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-10">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-1 text-[#0D9488] hover:opacity-70 font-bold transition-all mb-4"
        >
          <ChevronLeft size={20} /> Back to Dashboard
        </button>
        
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h1 className="text-3xl font-serif font-bold text-slate-800">Learning Analytics</h1>
            <p className="text-teal-600 text-sm font-bold tracking-widest uppercase">Performance Intel</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Metric Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard icon={<Activity size={20}/>} label="Average Score" value={`${data.stats.avgScore}%`} color="blue" />
          <StatCard icon={<TrendingUp size={20}/>} label="Improvement" value={`${data.stats.improvement > 0 ? '+' : ''}${data.stats.improvement}%`} color="green" sub="vs last test" />
          <StatCard icon={<BookOpen size={20}/>} label="Tests Taken" value={data.stats.totalTests} color="orange" />
          <StatCard icon={<Award size={20}/>} label="Rank Status" value={data.stats.rank} color="teal" />
        </div>

        {/* Growth Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50">
          <h3 className="text-xl font-serif font-bold mb-6 flex items-center gap-2 text-slate-800">
            <TrendingUp className="text-teal-600" size={24} /> Growth Progression
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Line type="monotone" dataKey="score" stroke="#0D9488" strokeWidth={4} dot={{ r: 6, fill: '#0D9488', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50">
          <h3 className="text-xl font-serif font-bold mb-6 text-slate-800">Subject Mastery</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.subjectMastery}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{fill: '#64748B', fontSize: 10}} />
                <Radar name="Proficiency" dataKey="A" stroke="#C2410C" fill="#C2410C" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights Section */}
        <div className="lg:col-span-2 bg-orange-50 p-8 rounded-[2rem] border border-orange-100">
          <h4 className="flex items-center gap-2 font-bold text-orange-800 mb-6 uppercase text-sm tracking-wider">
            <AlertCircle size={20} /> Recommendations
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InsightItem 
              title="Focus Priority" 
              subject={data.subjectMastery.sort((a,b) => a.A - b.A)[0]?.subject || "Pharmacology"} 
              desc="This is currently your lowest scoring area based on recent activity."
            />
            <InsightItem 
              title="Next Milestone" 
              subject="Gold Scholar Rank" 
              desc={`You are only ${85 - data.stats.avgScore}% away from the next tier.`}
            />
          </div>
        </div>

        {/* Study Tip Box */}
        <div className="bg-teal-900 p-8 rounded-[2rem] text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="flex items-center gap-2 font-bold mb-4 text-teal-400">
              <Lightbulb size={20} /> Study Tip
            </h4>
            <p className="text-sm text-teal-100 leading-relaxed mb-4">
              Taking a 15-minute break every hour of studying has been shown to 
              increase Siddha text retention by 30%.
            </p>
            <button className="text-xs font-bold text-teal-300 hover:text-white underline">
              Learn more about active recall
            </button>
          </div>
          <Target className="absolute -right-4 -bottom-4 text-white/5" size={150} />
        </div>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const StatCard = ({ icon, label, value, sub, color }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-emerald-600 bg-emerald-50",
    orange: "text-orange-600 bg-orange-50",
    teal: "text-teal-600 bg-teal-50"
  };
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      {sub && <p className="text-[10px] text-slate-400 font-medium mt-1">{sub}</p>}
    </div>
  );
};

const InsightItem = ({ title, subject, desc }) => (
  <div className="bg-white p-5 rounded-2xl border border-orange-200 shadow-sm hover:border-orange-400 transition-colors">
    <p className="text-[10px] font-bold text-orange-600 uppercase mb-1">{title}</p>
    <p className="font-bold text-slate-800 mb-1">{subject}</p>
    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default ProgressPage;