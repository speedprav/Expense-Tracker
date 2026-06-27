import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Auth({ onCancel }) {
  const { t, i18n } = useTranslation();
  const { login, signup } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Signup specific state
  const [name, setName] = useState('');
  const [mode, setMode] = useState('student');
  const [currency, setCurrency] = useState('₹');
  const [language, setLanguage] = useState('English');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setError('');
    
    let result;
    if (isLogin) {
      result = await login(email, password);
    } else {
      result = await signup(email, password, {
        name,
        mode,
        currency,
        language
      });
      if (result.success) {
        // Change language instantly on signup
        i18n.changeLanguage(language);
      }
    }
    
    if (!result.success) {
      setError(result.error);
      setLoading(false);
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
            {isLogin ? t('Welcome back! Please login.') : t('Create your account and setup your profile.')}
          </p>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-100 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group mb-4">
                <label className="form-label">{t('Full Name')}</label>
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
                <label className="form-label">{t('Account Mode')}</label>
                <div className="flex gap-4">
                  <label className={`flex-1 p-3 border rounded-lg cursor-pointer transition-all text-center ${mode === 'student' ? 'border-primary bg-primary bg-opacity-20 text-white' : 'border-gray-700 text-muted hover:border-gray-500'}`}>
                    <input type="radio" name="mode" value="student" className="hidden" checked={mode === 'student'} onChange={() => setMode('student')} />
                    {t('Personal')}
                  </label>
                  <label className={`flex-1 p-3 border rounded-lg cursor-pointer transition-all text-center ${mode === 'business' ? 'border-accent bg-accent bg-opacity-20 text-white' : 'border-gray-700 text-muted hover:border-gray-500'}`}>
                    <input type="radio" name="mode" value="business" className="hidden" checked={mode === 'business'} onChange={() => setMode('business')} />
                    {t('Business')}
                  </label>
                </div>
              </div>

              <div className="flex gap-4 mb-4">
                <div className="form-group flex-1 mb-0">
                  <label className="form-label">{t('Currency')}</label>
                  <select className="form-select" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    <option value="₹">₹ (INR)</option>
                    <option value="$">$ (USD)</option>
                    <option value="€">€ (EUR)</option>
                    <option value="£">£ (GBP)</option>
                  </select>
                </div>
                <div className="form-group flex-1 mb-0">
                  <label className="form-label">{t('Language')}</label>
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
            <label className="form-label">{t('Email Address')}</label>
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
            <label className="form-label">{t('Password')}</label>
            <input 
              type="password" 
              className="form-input" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full mb-4 shadow-neon disabled:opacity-50">
            {loading ? '...' : (isLogin ? t('Sign In') : t('Create Account'))}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-4">
          {isLogin ? t("Don't have an account? ") : t("Already have an account? ")}
          <button 
            type="button" 
            className="text-primary hover:underline cursor-pointer bg-transparent border-none font-bold"
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
          >
            {isLogin ? t('Sign up') : t('Log in')}
          </button>
        </p>
      </div>
    </div>
  );
}
