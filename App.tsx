
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  LayoutDashboard, 
  Bell, 
  BookOpen, 
  LogOut, 
  Menu,
  X,
  Sparkles,
  UserCircle,
  Coins,
  UtensilsCrossed
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import DevoteeManagement from './components/DevoteeManagement';
import SessionManagement from './components/SessionManagement';
import GitaInsights from './components/GitaInsights';
import UserPanel from './components/UserPanel';
import DonationManagement from './components/DonationManagement';
import KitchenManagement from './components/KitchenManagement';
import { storageService } from './services/storageService';
import { getDailyGitaQuote } from './services/geminiService';
import { Notification, GitaQuote } from './types';

const App: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeQuoteNotification, setActiveQuoteNotification] = useState<GitaQuote | null>(null);

  useEffect(() => {
    const loaded = storageService.getNotifications();
    setNotifications(loaded);
    setUnreadCount(loaded.filter(n => !n.isRead).length);

    const timer = setTimeout(async () => {
      const quote = await getDailyGitaQuote();
      if (quote) {
        setActiveQuoteNotification(quote);
        addNotification(
          `Divine Instruction: Ch. ${quote.chapter} Verse ${quote.text}`,
          quote.translation,
          'quote'
        );
        setTimeout(() => setActiveQuoteNotification(null), 8000);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const addNotification = (title: string, message: string, type: 'quote' | 'system' = 'system') => {
    const newNotif: Notification = {
      id: Date.now().toString(),
      title,
      message,
      timestamp: new Date(),
      isRead: false,
      type
    };
    setNotifications(prev => {
      const updated = [newNotif, ...prev];
      storageService.saveNotifications(updated);
      setUnreadCount(updated.filter(n => !n.isRead).length);
      return updated;
    });
  };

  const clearNotifications = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);
    setUnreadCount(0);
    storageService.saveNotifications(updated);
  };

  return (
    <Router>
      <div className="min-h-screen flex bg-slate-50 overflow-hidden relative">
        {activeQuoteNotification && (
          <div className="fixed top-20 right-4 z-[100] max-w-sm bg-white rounded-2xl shadow-2xl border-l-4 border-[#FF8C00] p-5 animate-in slide-in-from-right-full duration-500">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-orange-100 text-[#FF8C00] rounded-xl shrink-0">
                <Sparkles size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">Bhagavad Gita Wisdom</h4>
                  <button onClick={() => setActiveQuoteNotification(null)} className="text-slate-400">
                    <X size={14} />
                  </button>
                </div>
                <p className="text-slate-600 text-xs italic mt-1 line-clamp-3">"{activeQuoteNotification.translation}"</p>
                <p className="text-[#FF8C00] text-[10px] font-black uppercase mt-2">Chapter {activeQuoteNotification.chapter}.{activeQuoteNotification.text}</p>
              </div>
            </div>
          </div>
        )}

        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-[#FF8C00] text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#FF8C00]">
                  <BookOpen size={24} />
                </div>
                <h1 className="text-xl font-bold tracking-tight">ISKCON Portal</h1>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
                <X size={24} />
              </button>
            </div>

            <nav className="flex-1 px-4 space-y-1 mt-4">
              <SidebarLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
              <SidebarLink to="/user-panel" icon={<UserCircle size={20} />} label="My Panel" />
              <SidebarLink to="/devotees" icon={<Users size={20} />} label="Devotees" />
              <SidebarLink to="/sessions" icon={<Calendar size={20} />} label="Sessions" />
              <SidebarLink to="/donations" icon={<Coins size={20} />} label="Laxmi Seva" />
              <SidebarLink to="/kitchen" icon={<UtensilsCrossed size={20} />} label="Kitchen" />
              <SidebarLink to="/gita" icon={<BookOpen size={20} />} label="Gita Quotes" />
            </nav>

            <div className="p-4 border-t border-orange-400">
              <Link to="/user-panel" className="flex items-center gap-3 px-2 py-3 hover:bg-white/10 rounded-lg transition-colors">
                <div className="w-8 h-8 rounded-full bg-orange-300 flex items-center justify-center font-bold text-[#FF8C00]">AD</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Temple Admin</p>
                  <p className="text-xs text-orange-200 truncate">admin@iskcon.org</p>
                </div>
              </Link>
              <button className="flex items-center gap-3 px-2 py-3 w-full text-left text-orange-100 hover:text-white hover:bg-orange-600 rounded-lg transition-colors mt-2">
                <LogOut size={20} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex items-center gap-4 ml-auto">
              <div className="relative group">
                <button 
                  onClick={clearNotifications}
                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg relative"
                >
                  <Bell size={22} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 p-2 hidden group-hover:block z-50">
                  <div className="p-3 border-b border-slate-50 flex justify-between items-center">
                    <span className="font-bold text-sm">Notifications</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto py-2">
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <div key={n.id} className="p-3 hover:bg-slate-50 rounded-lg mb-1">
                          <p className="text-xs font-bold text-slate-900">{n.title}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{n.message}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-8 text-xs text-slate-400 italic">No notifications yet</p>
                    )}
                  </div>
                </div>
              </div>
              <Link 
                to="/user-panel" 
                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden"
              >
                <UserCircle className="text-slate-400" size={24} />
              </Link>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 lg:p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/user-panel" element={<UserPanel />} />
              <Route path="/devotees" element={<DevoteeManagement />} />
              <Route path="/devotees/new" element={<DevoteeManagement isNew />} />
              <Route path="/sessions" element={<SessionManagement addNotification={addNotification} />} />
              <Route path="/donations" element={<DonationManagement />} />
              <Route path="/kitchen" element={<KitchenManagement />} />
              <Route path="/gita" element={<GitaInsights />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

const SidebarLink: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all
        ${isActive ? 'bg-white/20 text-white shadow-sm' : 'text-orange-50 hover:bg-white/10 hover:text-white'}
      `}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default App;
