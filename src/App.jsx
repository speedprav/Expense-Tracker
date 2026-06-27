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
    <div className="flex flex-col h-full bg-[#13141a] text-white p-6 border-r border-gray-800 w-64">
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-orange-500 p-2 rounded-lg text-white">
          <Camera size={20} />
        </div>
        <span className="text-xl font-bold tracking-wide">Expensr</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onCloseMobileSidebar}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              location.pathname === item.path 
                ? 'bg-gradient-to-r from-yellow-500/20 to-transparent text-primary border-l-2 border-primary' 
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
              ? 'bg-gradient-to-r from-yellow-500/20 to-transparent text-primary border-l-2 border-primary' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Settings size={20} />
          <span className="font-medium text-sm">{t('Profile')}</span>
        </Link>
      </nav>

      <div className="mt-auto pt-6 space-y-4">
        {/* Go Premium Card */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/20 border border-purple-500/20 p-4 rounded-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/20 blur-2xl rounded-full"></div>
          <Crown size={24} className="text-yellow-400 mx-auto mb-2" />
          <h4 className="font-bold text-white text-sm mb-1">{t('Go Premium')}</h4>
          <p className="text-xs text-gray-400 mb-4">{t('Unlock advanced insights, custom categories and more.')}</p>
          <button className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold py-2 rounded-lg transition-colors">
            {t('Upgrade Now')}
          </button>
        </div>

        {/* Need Help */}
        <div className="flex items-center justify-between px-2 py-2 cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
              <span className="text-xs">?</span>
            </div>
            <div>
              <p className="text-xs text-white font-medium">{t('Need Help?')}</p>
              <p className="text-[10px] text-gray-500">{t('Contact Support')}</p>
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
    <div className="fixed bottom-0 left-0 right-0 bg-[#13141a] border-t border-gray-800 pb-safe pt-2 px-6 flex justify-between items-center z-50 md:hidden">
      {navItems.map(item => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center gap-1 p-2 ${
            location.pathname === item.path ? 'text-primary' : 'text-gray-500'
          }`}
        >
          {item.icon}
          <span className="text-[10px] font-medium">{item.label}</span>
        </Link>
      ))}
      <button 
        onClick={onOpenCalendar}
        className="flex flex-col items-center gap-1 p-2 text-gray-500"
      >
        <Calendar size={20} />
        <span className="text-[10px] font-medium">{t('Calendar')}</span>
      </button>
      <Link
        to="/profile"
        className={`flex flex-col items-center gap-1 p-2 ${
          location.pathname === '/profile' ? 'text-primary' : 'text-gray-500'
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
    <header className="flex items-center justify-between p-6 max-w-7xl mx-auto w-full">
      {/* Mobile Left: Menu & Brand */}
      <div className="md:hidden flex items-center gap-3">
        <button onClick={() => setShowMobileSidebar(true)} className="text-gray-400">
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-lg">Expensr</span>
          <span className="bg-yellow-500/20 text-primary text-[10px] px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1">
            <Crown size={10} /> Premium
          </span>
        </div>
      </div>

      {/* Desktop Left: Search */}
      <div className="hidden md:flex items-center bg-[#181a24] border border-gray-800 rounded-lg px-4 py-2 w-96">
        <Search size={16} className="text-gray-500 mr-2" />
        <input 
          type="text" 
          placeholder={t("Search anything...")} 
          className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-gray-500"
        />
        <div className="bg-white/5 border border-gray-700 text-gray-400 text-[10px] px-1.5 py-0.5 rounded font-mono">
          ⌘K
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-white transition-colors">
          <Bell size={20} />
        </button>
        <button className="hidden md:block text-gray-400 hover:text-white transition-colors">
          <Moon size={20} />
        </button>
        <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden border border-gray-600">
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-full h-full object-cover" />
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
    <div className="flex h-screen overflow-hidden bg-[#111319] text-white">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar onOpenCalendar={() => setShowCalendar(true)} />
      </div>

      {/* Mobile Sidebar Drawer */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileSidebar(false)}></div>
          <div className="relative w-64 bg-[#13141a] h-full shadow-2xl animate-fade-in" style={{ animationDuration: '0.2s' }}>
            <Sidebar onOpenCalendar={() => setShowCalendar(true)} onCloseMobileSidebar={() => setShowMobileSidebar(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <TopHeader setShowMobileSidebar={setShowMobileSidebar} />
        
        <main className="flex-1 overflow-y-auto pb-20 md:pb-8">
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
