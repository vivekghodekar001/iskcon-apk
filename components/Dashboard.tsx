
import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Users, Calendar, Target, Award, ArrowUpRight, TrendingUp, 
  Zap, Plus, BookOpen, Clock, Heart, Sparkles, ChevronRight,
  Coins, UtensilsCrossed
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { Devotee, Session, Donation, InventoryItem } from '../types';

const Dashboard: React.FC = () => {
  const [devotees, setDevotees] = useState<Devotee[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    setDevotees(storageService.getDevotees());
    setSessions(storageService.getSessions());
    setDonations(storageService.getDonations());
    setInventory(storageService.getInventory());
  }, []);

  const totalDonations = donations.reduce((a, b) => a + b.amount, 0);
  const lowStockItems = inventory.filter(i => i.quantity <= i.minThreshold).length;

  const stats = [
    { label: 'Total Devotees', value: devotees.length, icon: <Users size={24} />, color: 'bg-blue-50 text-blue-600', trend: '+5.2%' },
    { label: 'Laxmi Seva', value: `₹${totalDonations.toLocaleString()}`, icon: <Coins size={24} />, color: 'bg-emerald-50 text-emerald-600', trend: '+12%' },
    { label: 'Avg Attendance', value: '82%', icon: <Target size={24} />, color: 'bg-orange-50 text-orange-600', trend: '+3.1%' },
    { label: 'Kitchen Alerts', value: lowStockItems, icon: <UtensilsCrossed size={24} />, color: 'bg-red-50 text-red-600', trend: lowStockItems > 0 ? 'Urgent' : 'Clear' },
  ];

  const attendanceData = [
    { name: 'Mon', count: 45 },
    { name: 'Tue', count: 52 },
    { name: 'Wed', count: 48 },
    { name: 'Thu', count: 61 },
    { name: 'Fri', count: 55 },
    { name: 'Sat', count: 85 },
    { name: 'Sun', count: 120 },
  ];

  const sadhanaData = [
    { name: '16+ Rounds', value: devotees.filter(d => d.dailyMalas >= 16).length || 5, color: '#FF8C00' },
    { name: '8-15 Rounds', value: devotees.filter(d => d.dailyMalas >= 8 && d.dailyMalas < 16).length || 8, color: '#fbbf24' },
    { name: '1-7 Rounds', value: devotees.filter(d => d.dailyMalas > 0 && d.dailyMalas < 8).length || 12, color: '#cbd5e1' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Header & Greeting */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Temple Management Console</h1>
          <p className="text-slate-500 mt-2 flex items-center gap-2">
            <Sparkles size={16} className="text-orange-400" />
            Welcoming you back to service. Hare Krishna, Admin.
          </p>
        </div>
        
        {/* Quick Actions Bar */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <Link to="/devotees/new" className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all active:scale-95">
            <Plus size={18} />
            <span>Add Devotee</span>
          </Link>
          <Link to="/donations" className="flex items-center gap-2 bg-orange-100 text-[#FF8C00] px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-orange-200 transition-all active:scale-95">
            <Coins size={18} />
            <span>Donation</span>
          </Link>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div className={`p-4 rounded-2xl ${stat.color} transition-transform group-hover:scale-110 shadow-sm`}>
                  {stat.icon}
                </div>
                <span className={`flex items-center gap-1 text-xs font-black px-2 py-1 rounded-lg ${
                  stat.trend === 'Urgent' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {stat.trend}
                </span>
              </div>
              <div className="mt-6">
                <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest">{stat.label}</h3>
                <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Attendance Area Chart */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Attendance Engagement</h2>
              <p className="text-sm text-slate-400 font-medium">Weekly congregation flow analysis</p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF8C00" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#FF8C00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} 
                  dy={15} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }}
                  cursor={{ stroke: '#FF8C00', strokeWidth: 2 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#FF8C00" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sadhana Pie Chart */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Sadhana Health</h2>
          <p className="text-sm text-slate-400 font-medium mb-8">Daily round distribution</p>
          
          <div className="flex-1 min-h-[250px] relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sadhanaData}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  animationBegin={200}
                >
                  {sadhanaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <p className="text-2xl font-black text-slate-900">{devotees.length}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profiles</p>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            {sadhanaData.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs font-bold text-slate-600">{item.name}</span>
                </div>
                <span className="text-xs font-black text-slate-900">{item.value} Devotees</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
