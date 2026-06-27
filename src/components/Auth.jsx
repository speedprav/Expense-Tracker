import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';

export default function Auth({ onCancel }) {
  const { login, signup } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Signup specific state
  const [name, setName] = useState('');
  const [mode, setMode] = useState('student');
  const [currency, setCurrency] = useState('₹');
  const [language, setLanguage] = useState('English');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    if (isLogin) {
      login(email, password);
    } else {
      signup(email, password, {
        name,
        mode,
        currency,
        language
      });
    }
  };

  return (
    <div className="flex items-center justify-center py-10" style={{ minHeight: '100vh', padding: '1rem' }}>
      <div className="glass-panel p-8 w-full max-w-md animate-fade-up relative">
        {onCancel && (
          <button onClick={onCancel} className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
        )}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-primary">Expensr</h1>
          <p className="text-muted">
            {isLogin ? 'Welcome back! Please login.' : 'Create your account and setup your profile.'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group mb-4">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>

              <div className="form-group mb-4">
                <label className="form-label">Account Mode</label>
                <div className="flex gap-4">
                  <label className={`flex-1 p-3 border rounded-lg cursor-pointer transition-all text-center ${mode === 'student' ? 'border-primary bg-primary bg-opacity-20 text-white' : 'border-gray-700 text-muted hover:border-gray-500'}`}>
                    <input type="radio" name="mode" value="student" className="hidden" checked={mode === 'student'} onChange={() => setMode('student')} />
                    Personal
                  </label>
                  <label className={`flex-1 p-3 border rounded-lg cursor-pointer transition-all text-center ${mode === 'business' ? 'border-accent bg-accent bg-opacity-20 text-white' : 'border-gray-700 text-muted hover:border-gray-500'}`}>
                    <input type="radio" name="mode" value="business" className="hidden" checked={mode === 'business'} onChange={() => setMode('business')} />
                    Business
                  </label>
                </div>
              </div>

              <div className="flex gap-4 mb-4">
                <div className="form-group flex-1 mb-0">
                  <label className="form-label">Currency</label>
                  <select className="form-select" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    <option value="₹">₹ (INR)</option>
                    <option value="$">$ (USD)</option>
                    <option value="€">€ (EUR)</option>
                    <option value="£">£ (GBP)</option>
                  </select>
                </div>
                <div className="form-group flex-1 mb-0">
                  <label className="form-label">Language</label>
                  <select className="form-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Spanish">Spanish</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="form-group mb-4">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="form-group mb-6">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mb-4 shadow-neon">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-4">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            className="text-primary hover:underline cursor-pointer bg-transparent border-none font-bold"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
