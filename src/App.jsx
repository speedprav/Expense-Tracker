import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, PieChart, Users, Settings, Calendar, LogOut } from 'lucide-react';
import { AppProvider, useAppContext } from './context/AppContext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Ledger from './components/Ledger';
import Profile from './components/Profile';
import CalendarModal from './components/CalendarModal';

function Navigation({ onOpenCalendar }) {
  const location = useLocation();
  const { logout } = useAppContext();

  const navItems = [
    { path: '/', icon: <Home size={22} />, label: 'Home' },
    { path: '/analytics', icon: <PieChart size={22} />, label: 'Analytics' },
    { path: '/ledger', icon: <Users size={22} />, label: 'Ledger' },
    { path: '/profile', icon: <Settings size={22} />, label: 'Profile' },
  ];

  return (
    <nav className="navbar">
      {navItems.map(item => (
        <Link
          key={item.path}
          to={item.path}
          className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
        >
          {item.icon}
          <span className="nav-label">{item.label}</span>
        </Link>
      ))}
      <div className="hidden-mobile w-px h-6 bg-gray-700 mx-2 self-center"></div>
      
      {/* Calendar Button */}
      <button 
        onClick={onOpenCalendar}
        className="nav-link bg-transparent border-none cursor-pointer group"
      >
        <Calendar size={22} className="group-hover:text-primary transition-colors" />
        <span className="nav-label">Calendar</span>
      </button>

      {/* Logout Button */}
      <button 
        onClick={logout}
        className="nav-link bg-transparent border-none cursor-pointer group ml-auto text-danger"
      >
        <LogOut size={22} />
        <span className="nav-label">Logout</span>
      </button>
    </nav>
  );
}

function MainLayout() {
  const { user } = useAppContext();
  const [showCalendar, setShowCalendar] = useState(false);

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="flex flex-col relative" style={{ minHeight: '100vh' }}>
      {/* Dynamic Background elements could go here */}
      <div className="flex-1 pb-24 md:pb-0 md:pt-24">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/ledger" element={<Ledger />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
      
      <Navigation onOpenCalendar={() => setShowCalendar(true)} />
      
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
