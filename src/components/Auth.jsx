import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';

export default function Auth({ onCancel }) {
  const { login, signup, loginWithGoogle } = useAppContext();
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
      // Removing instant language change since the app itself will check profile.language after login
    }
    
    if (!result.success) {
      setError(result.error);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    const result = await loginWithGoogle();
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
            {isLogin ? 'Welcome back! Please login.' : 'Create your account and setup your profile.'}
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

          <button type="submit" disabled={loading} className="btn btn-primary w-full mb-4 shadow-neon disabled:opacity-50">
            {loading ? '...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>

          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="flex-shrink-0 mx-4 text-muted text-sm">or</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          <button 
            type="button" 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="btn w-full bg-white text-black hover:bg-gray-200 flex items-center justify-center gap-2 mb-4 transition-colors disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
              </g>
            </svg>
            Sign in with Google
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-4">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            className="text-primary hover:underline cursor-pointer bg-transparent border-none font-bold ml-1"
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
