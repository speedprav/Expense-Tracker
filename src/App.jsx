import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, PieChart, Users, Settings, Calendar, LogOut, Bell, Moon, Search, Camera, Menu, Crown, ArrowUpRight } from 'lucide-react';
import { AppProvider, useAppContext } from './context/AppContext';
import Auth from './components/Auth';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Ledger from './components/Ledger';
import Profile from './components/Profile';
import CalendarModal from './components/CalendarModal';
import { useTranslation } from 'react-i18next';

function Sidebar({ onOpenCalendar, onCloseMobileSidebar }) {
  const { t } = useTranslation();
  const location = useLocation();
  const { logout } = useAppContext();

  const navItems = [
    { path: '/', icon: <Home size={20} />, label: t('Home') },
    { path: '/analytics', icon: <PieChart size={20} />, label: t('Analytics') },
    { path: '/ledger', icon: <Users size={20} />, label: t('Ledger') },
  ];

  return (
    <div className="flex flex-col h-full glass-card border-y-0 border-l-0 text-white p-6 w-64 rounded-none">
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-gradient-to-tr from-yellow-500 to-yellow-300 p-2 rounded-xl text-black shadow-[0_0_15px_rgba(251,192,45,0.4)]">
          <Camera size={20} />
        </div>
        <span className="text-xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Expensr</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onCloseMobileSidebar}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              location.pathname === item.path 
                ? 'bg-white/10 text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/5' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {item.icon}
            <span className="font-medium text-sm">{item.label}</span>
          </Link>
        ))}
        
        <button 
          onClick={() => { onOpenCalendar(); onCloseMobileSidebar && onCloseMobileSidebar(); }}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all text-left"
        >
          <Calendar size={20} />
          <span className="font-medium text-sm">{t('Calendar')}</span>
        </button>

        <Link
          to="/profile"
          onClick={onCloseMobileSidebar}
          className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
            location.pathname === '/profile' 
              ? 'bg-white/10 text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/5' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Settings size={20} />
          <span className="font-medium text-sm">{t('Profile')}</span>
        </Link>
      </nav>

      <div className="mt-auto pt-6 space-y-4">
        {/* Go Premium Card */}
        <div className="glass-card p-4 rounded-2xl text-center relative overflow-hidden bg-gradient-to-br from-purple-900/40 to-indigo-900/20">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/30 blur-2xl rounded-full"></div>
          <Crown size={24} className="text-yellow-400 mx-auto mb-2" />
          <h4 className="font-bold text-white text-sm mb-1">{t('Go Premium')}</h4>
          <p className="text-xs text-gray-400 mb-4">{t('Unlock advanced insights, custom categories and more.')}</p>
          <button className="w-full bg-white text-black hover:bg-gray-200 text-xs font-semibold py-2 rounded-lg transition-colors shadow-[0_4px_15px_rgba(255,255,255,0.2)]">
            {t('Upgrade Now')}
          </button>
        </div>

        {/* Need Help */}
        <div className="flex items-center justify-between px-2 py-2 cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/5 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-white/20 transition-all shadow-inner">
              <span className="text-xs">?</span>
            </div>
            <div>
              <p className="text-xs text-white font-medium">{t('Need Help?')}</p>
              <p className="text-[10px] text-gray-400">{t('Contact Support')}</p>
            </div>
          </div>
          <ArrowUpRight size={14} className="text-gray-500 group-hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  );
}

function MobileBottomNav({ onOpenCalendar }) {
  const { t } = useTranslation();
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: <Home size={20} />, label: t('Home') },
    { path: '/analytics', icon: <PieChart size={20} />, label: t('Analytics') },
    { path: '/ledger', icon: <Users size={20} />, label: t('Ledger') },
  ];

  return (
    <div className="fixed bottom-4 left-4 right-4 glass-card rounded-2xl pb-safe pt-2 px-6 flex justify-between items-center z-50 md:hidden bg-black/40 backdrop-blur-3xl shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
      {navItems.map(item => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center gap-1 p-2 transition-transform hover:scale-110 ${
            location.pathname === item.path ? 'text-primary drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]' : 'text-gray-400 hover:text-white'
          }`}
        >
          {item.icon}
          <span className="text-[10px] font-medium">{item.label}</span>
        </Link>
      ))}
      <button 
        onClick={onOpenCalendar}
        className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white transition-transform hover:scale-110"
      >
        <Calendar size={20} />
        <span className="text-[10px] font-medium">{t('Calendar')}</span>
      </button>
      <Link
        to="/profile"
        className={`flex flex-col items-center gap-1 p-2 transition-transform hover:scale-110 ${
          location.pathname === '/profile' ? 'text-primary drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]' : 'text-gray-400 hover:text-white'
        }`}
      >
        <Settings size={20} />
        <span className="text-[10px] font-medium">{t('Profile')}</span>
      </Link>
    </div>
  );
}

function TopHeader({ setShowMobileSidebar }) {
  const { t } = useTranslation();
  return (
    <header className="flex items-center justify-between p-6 max-w-7xl mx-auto w-full z-10">
      {/* Mobile Left: Menu & Brand */}
      <div className="md:hidden flex items-center gap-3">
        <button onClick={() => setShowMobileSidebar(true)} className="text-white drop-shadow-md">
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-lg drop-shadow-md">Expensr</span>
          <span className="glass-card bg-yellow-500/20 text-primary text-[10px] px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1 border border-yellow-500/30">
            <Crown size={10} /> Premium
          </span>
        </div>
      </div>

      {/* Desktop Left: Search */}
      <div className="hidden md:flex items-center glass-card bg-black/20 rounded-xl px-4 py-2 w-96 border border-white/5 transition-all focus-within:border-primary/50 focus-within:shadow-[0_0_20px_rgba(212,175,55,0.15)]">
        <Search size={16} className="text-gray-400 mr-2" />
        <input 
          type="text" 
          placeholder={t("Search anything...")} 
          className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-gray-500"
        />
        <div className="glass-card bg-white/5 text-gray-400 text-[10px] px-1.5 py-0.5 rounded font-mono border-white/10">
          ⌘K
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <button className="glass-card p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all border-white/5">
          <Bell size={18} />
        </button>
        <button className="hidden md:flex glass-card p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all border-white/5">
          <Moon size={18} />
        </button>
        <div className="w-10 h-10 rounded-full glass-card p-0.5 overflow-hidden border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-full h-full rounded-full object-cover" />
        </div>
      </div>
    </header>
  );
}

function MainLayout() {
  const { user } = useAppContext();
  const [showCalendar, setShowCalendar] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  const [showAuth, setShowAuth] = useState(isStandalone);

  if (!user) {
    if (showAuth) {
      return <Auth onCancel={() => setShowAuth(false)} />;
    }
    return <Landing onLaunch={() => setShowAuth(true)} />;
  }

  return (
    <>
      <div className="ambient-bg">
        <div className="ambient-orb ambient-orb-1"></div>
        <div className="ambient-orb ambient-orb-2"></div>
        <div className="ambient-orb ambient-orb-3"></div>
      </div>

      <div className="flex h-screen overflow-hidden text-white relative z-10">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar onOpenCalendar={() => setShowCalendar(true)} />
        </div>

        {/* Mobile Sidebar Drawer */}
        {showMobileSidebar && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowMobileSidebar(false)}></div>
            <div className="relative w-64 h-full shadow-[20px_0_40px_rgba(0,0,0,0.8)] animate-fade-in" style={{ animationDuration: '0.2s' }}>
              <Sidebar onOpenCalendar={() => setShowCalendar(true)} onCloseMobileSidebar={() => setShowMobileSidebar(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <TopHeader setShowMobileSidebar={setShowMobileSidebar} />
          
          <main className="flex-1 overflow-y-auto pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/ledger" element={<Ledger />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </div>
          </main>
          
          <MobileBottomNav onOpenCalendar={() => setShowCalendar(true)} />
        </div>
        
        {showCalendar && <CalendarModal onClose={() => setShowCalendar(false)} />}
      </div>
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <MainLayout />
      </Router>
    </AppProvider>
  );
}

export default App;
