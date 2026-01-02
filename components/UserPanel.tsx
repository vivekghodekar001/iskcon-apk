
import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Sparkles, 
  BookOpen, 
  Clock, 
  Award, 
  Calendar, 
  ChevronRight, 
  Zap,
  Target,
  Quote as QuoteIcon,
  Flame,
  BarChart3,
  CircleDot,
  TrendingUp,
  History
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell 
} from 'recharts';
import { storageService } from '../services/storageService';
import { getDailyGitaQuote } from '../services/geminiService';
import { Devotee, GitaQuote, Session } from '../types';

const UserPanel: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<Devotee | null>(null);
  const [dailyQuote, setDailyQuote] = useState<GitaQuote | null>(null);
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionRounds, setSessionRounds] = useState(0);

  // Mock data for weekly progress
  const weeklySadhana = [
    { day: 'Mon', rounds: 16 },
    { day: 'Tue', rounds: 18 },
    { day: 'Wed', rounds: 16 },
    { day: 'Thu', rounds: 20 },
    { day: 'Fri', rounds: 16 },
    { day: 'Sat', rounds: 22 },
    { day: 'Sun', rounds: 16 },
  ];

  useEffect(() => {
    const devotees = storageService.getDevotees();
    const mockUser = devotees[0] || {
      id: 'current-user',
      name: 'Temple Admin',
      spiritualName: 'Ananda Das',
      email: 'admin@iskcon.org',
      phone: '+91 90000 00000',
      status: 'First Initiated',
      joinedAt: new Date().toISOString(),
      dailyMalas: 16,
      hobbies: 'Kirtan, Studying Srimad Bhagavatam'
    };
    
    setCurrentUser(mockUser as Devotee);
    setSessionRounds(mockUser.dailyMalas || 16);
    
    const fetchInitialData = async () => {
      const quote = await getDailyGitaQuote();
      setDailyQuote(quote);
      
      const sessions = storageService.getSessions();
      setUpcomingSessions(sessions.slice(0, 3));
      setLoading(false);
    };

    fetchInitialData();
  }, []);

  const handleLogRound = () => {
    setSessionRounds(prev => prev + 1);
    // In a real app, we would update the backend/localstorage here
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400">
        <Sparkles className="animate-pulse text-orange-400" size={48} />
        <p className="font-bold tracking-tight uppercase text-xs tracking-[0.2em]">Ascending to the spiritual realm...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      
      {/* Profile Section */}
      <div className="relative overflow-hidden bg-white rounded-[3rem] shadow-2xl border border-slate-100">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] opacity-60"></div>
        <div className="relative p-10 lg:p-16 flex flex-col md:flex-row items-center gap-12">
          <div className="relative group">
            <div className="w-48 h-48 rounded-[3.5rem] bg-slate-100 overflow-hidden border-8 border-white shadow-2xl ring-1 ring-slate-100 group-hover:scale-105 transition-transform duration-500">
              {currentUser?.photo ? (
                <img src={currentUser.photo} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                  <Award size={80} />
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-3.5 rounded-2xl border-4 border-white shadow-xl animate-bounce">
              <Zap size={24} fill="white" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="px-5 py-2 bg-orange-100 text-[#FF8C00] rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-orange-200">
                {currentUser?.status}
              </span>
              <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100">
                <Flame size={14} className="fill-emerald-600" />
                <span>12 Day Streak</span>
              </div>
            </div>
            <h2 className="text-5xl font-black text-slate-900 leading-tight">
              {currentUser?.spiritualName || currentUser?.name}
            </h2>
            <p className="text-slate-400 font-bold flex items-center justify-center md:justify-start gap-2 text-sm uppercase tracking-widest">
              <Calendar size={18} /> Serving since {new Date(currentUser?.joinedAt || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* DEDICATED MALA CHANTING SECTION */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500 text-white rounded-2xl shadow-lg shadow-orange-200">
              <CircleDot size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Chanting Sanctuary</h2>
              <p className="text-sm text-slate-500 font-medium">Sacred daily round tracking & spiritual progress</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <History size={16} />
            View Full History
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Chanting Tracker */}
          <div className="lg:col-span-8 bg-white rounded-[3rem] p-8 lg:p-12 border border-slate-100 shadow-xl relative overflow-hidden group">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-50 rounded-full blur-[80px] opacity-40 group-hover:scale-110 transition-transform duration-1000"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative flex flex-col items-center">
                <div className="relative">
                  <svg className="w-64 h-64 -rotate-90 transform">
                    <circle
                      className="text-slate-100"
                      strokeWidth="16"
                      stroke="currentColor"
                      fill="transparent"
                      r="110"
                      cx="128"
                      cy="128"
                    />
                    <circle
                      className="text-[#FF8C00] drop-shadow-[0_0_8px_rgba(255,140,0,0.3)]"
                      strokeWidth="16"
                      strokeDasharray={2 * Math.PI * 110}
                      strokeDashoffset={2 * Math.PI * 110 * (1 - Math.min(sessionRounds / 16, 1))}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="110"
                      cx="128"
                      cy="128"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-7xl font-black text-slate-900 tracking-tighter">{sessionRounds}</span>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Total Rounds</p>
                  </div>
                </div>
                
                <div className="mt-8 flex items-center gap-3">
                  <div className="px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                    Goal: 16 Rounds
                  </div>
                  {sessionRounds >= 16 && (
                    <div className="px-5 py-2.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <Award size={14} /> Completed
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-orange-600">
                    <TrendingUp size={18} />
                    <span className="text-xs font-black uppercase tracking-widest">Performance Insights</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    You're chanting <span className="text-orange-600 font-black">15% more</span> consistently than last week. Keep the fire of devotion burning!
                  </p>
                </div>

                <div className="h-[120px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklySadhana}>
                      <Tooltip 
                        cursor={{fill: '#fff7ed'}}
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                      />
                      <Bar dataKey="rounds" radius={[6, 6, 0, 0]}>
                        {weeklySadhana.map((entry, index) => (
                          <Cell key={index} fill={entry.rounds >= 16 ? '#FF8C00' : '#cbd5e1'} />
                        ))}
                      </Bar>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <button 
                  onClick={handleLogRound}
                  className="w-full group relative py-6 bg-gradient-to-r from-[#FF8C00] to-orange-500 text-white font-black text-lg rounded-[2rem] shadow-2xl shadow-orange-200 overflow-hidden hover:-translate-y-1 transition-all active:scale-95"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    <CircleDot size={24} className="group-hover:rotate-180 transition-transform duration-700" />
                    CHANTED ONE ROUND
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Sadhana Cards Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Streak Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
              <Flame className="absolute bottom-[-20px] right-[-20px] w-48 h-48 text-orange-500 opacity-20 group-hover:rotate-12 transition-transform duration-1000" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2 text-orange-400">
                  <Zap size={20} fill="currentColor" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Spiritual Momentum</span>
                </div>
                <h3 className="text-4xl font-black italic">12 Days</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  You have reached your 16-round goal for 12 consecutive days. Consistent chanting purifies the mirror of the mind.
                </p>
                <div className="pt-2 flex gap-1">
                  {[1,2,3,4,5,6,7].map(i => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= 5 ? 'bg-orange-500' : 'bg-slate-700'}`}></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Daily Tip */}
            <div className="bg-orange-50 rounded-[2.5rem] p-8 border border-orange-100 space-y-4">
              <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={16} /> Japa Tip of the Day
              </h4>
              <p className="text-slate-700 font-medium italic text-sm leading-relaxed">
                "Pronounce each syllable of the Maha-Mantra clearly and hear it attentively. This simple focus is the secret to deep meditation."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Daily Inspiration */}
        <div className="lg:col-span-2">
          {dailyQuote && (
            <div className="bg-white rounded-[3rem] p-10 lg:p-12 border border-slate-100 shadow-xl relative overflow-hidden group h-full flex flex-col justify-center">
              <QuoteIcon className="absolute top-10 right-10 text-slate-50 scale-[8] -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-3 text-indigo-500">
                  <BookOpen size={20} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Nectar of Instruction</span>
                </div>
                <p className="text-3xl md:text-4xl font-serif leading-tight italic text-slate-800">
                  "{dailyQuote.translation}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-1 bg-orange-400 rounded-full"></div>
                  <p className="font-black text-slate-900 tracking-wider">Chapter {dailyQuote.chapter}, Verse {dailyQuote.text}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Schedule & Seva Sidebars */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-lg">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
              <Calendar className="text-blue-500" /> Upcoming Seva
            </h3>
            <div className="space-y-4">
              {upcomingSessions.length > 0 ? (
                upcomingSessions.map((session) => (
                  <div key={session.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group cursor-pointer hover:bg-white hover:shadow-md transition-all">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex flex-col items-center justify-center font-black">
                      <span className="text-[10px] uppercase">{new Date(session.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                      <span className="text-lg leading-none">{new Date(session.date).getDate()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 truncate text-sm">{session.title}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase truncate">{session.location}</p>
                    </div>
                    <ChevronRight className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" size={16} />
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-slate-400 text-sm italic">No scheduled sessions.</p>
              )}
            </div>
            <button className="w-full mt-6 py-4 text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 rounded-2xl transition-all border border-blue-100 hover:bg-blue-100">
              Temple Calendar
            </button>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-lg">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
              <Heart className="text-pink-500" /> My Service Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentUser?.hobbies?.split(',').map((hobby, i) => (
                <span key={i} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100 hover:bg-white hover:border-pink-200 transition-colors">
                  {hobby.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserPanel;
