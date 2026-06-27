import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Save, Download, Shield, Cloud, LogOut } from 'lucide-react';
import { backupUserData } from '../firebase';
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const { t, i18n } = useTranslation();
  const { profile, updateProfile, expenses, people, user, logout } = useAppContext();
  
  const [name, setName] = useState(profile.name || '');
  const [mode, setMode] = useState(profile.mode || 'student');
  const [businessName, setBusinessName] = useState(profile.businessName || '');
  const [monthlyBudget, setMonthlyBudget] = useState(profile.monthlyBudget || 10000);
  const [currency, setCurrency] = useState(profile.currency || '₹');
  const [language, setLanguage] = useState(profile.language || 'English');
  const [isBackingUp, setIsBackingUp] = useState(false);
  
  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      name,
      mode,
      businessName: mode === 'business' ? businessName : '',
      monthlyBudget: Number(monthlyBudget),
      currency,
      language
    });
    i18n.changeLanguage(language);
    alert(t('Profile preferences saved!'));
  };

  const handleLanguageChange = (e) => {
    const val = e.target.value;
    setLanguage(val);
    i18n.changeLanguage(val);
  };

  const handleExport = () => {
    const data = { profile, expenses, people, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expensr_backup_${new Date().toLocaleDateString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCloudBackup = async () => {
    setIsBackingUp(true);
    const data = { profile, expenses, people };
    const success = await backupUserData(user?.uid || user?.email || 'local_user', data);
    
    if (success) {
      updateProfile({ lastBackupDate: new Date().toISOString() });
      alert('Cloud Backup Successful!');
    } else {
      alert('Cloud Backup Failed. Please check if your Firebase config is set in src/firebase.js');
    }
    setIsBackingUp(false);
  };

  return (
    <div className="container animate-fade-in mb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">{t('Profile & Settings')}</h1>
        <p className="text-muted">{t('Manage your account preferences and data.')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="glass-card rounded-3xl p-8 mb-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
            
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-3xl font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)] text-black">
                {profile.name ? profile.name.substring(0, 1).toUpperCase() : (user?.email ? user.email.substring(0, 1).toUpperCase() : 'U')}
              </div>
              <div>
                <h2 className="text-3xl font-light text-white mb-1 tracking-wide">{profile.name || user?.email || t('Local User')}</h2>
                <div className="flex flex-col gap-1 text-sm mt-2">
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-green-400" />
                    <span className="text-green-400 font-medium tracking-wide">{t('Secured Locally')}</span>
                  </div>
                  {profile.lastBackupDate && (
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Cloud size={14} />
                      <span>{t('Last cloud backup:')} {new Date(profile.lastBackupDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleSave}>
              <div className="mb-6 animate-fade-up">
                <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">{t('Full Name')}</label>
                <input type="text" className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-500/50 focus:bg-black/60 transition-all shadow-inner" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Doe" required />
              </div>

              <div className="mb-8">
                <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3 block">{t('Account Type')}</label>
                <div className="grid grid-cols-2 gap-4 bg-black/20 p-1 rounded-2xl border border-white/5">
                  <label className={`py-4 rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-1 ${mode === 'student' ? 'bg-white/10 text-white shadow-md border border-white/5' : 'text-gray-500 hover:text-white'}`}>
                    <input type="radio" name="mode" value="student" className="hidden" checked={mode === 'student'} onChange={() => setMode('student')} />
                    <span className="font-medium">{t('Personal')}</span>
                    <span className="text-[10px] uppercase tracking-wider">{t('Daily tracking')}</span>
                  </label>
                  
                  <label className={`py-4 rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-1 ${mode === 'business' ? 'bg-white/10 text-white shadow-md border border-white/5' : 'text-gray-500 hover:text-white'}`}>
                    <input type="radio" name="mode" value="business" className="hidden" checked={mode === 'business'} onChange={() => setMode('business')} />
                    <span className="font-medium">{t('Business')}</span>
                    <span className="text-[10px] uppercase tracking-wider">{t('Invoices & P&L')}</span>
                  </label>
                </div>
              </div>

              {mode === 'business' && (
                <div className="mb-6 animate-fade-up">
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">{t('Business Name')}</label>
                  <input type="text" className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-500/50 focus:bg-black/60 transition-all shadow-inner" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. Acme Corp" required />
                </div>
              )}

              <div className="mb-6">
                <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">{t('Total Monthly Budget')} ({currency})</label>
                <input type="number" className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-4 text-white text-xl outline-none focus:border-yellow-500/50 focus:bg-black/60 transition-all shadow-inner" value={monthlyBudget} onChange={(e) => setMonthlyBudget(e.target.value)} required />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">{t('Currency')}</label>
                  <select className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-500/50 focus:bg-black/60 transition-all shadow-inner" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    <option value="₹" className="bg-gray-900">₹ (INR)</option>
                    <option value="$" className="bg-gray-900">$ (USD)</option>
                    <option value="€" className="bg-gray-900">€ (EUR)</option>
                    <option value="£" className="bg-gray-900">£ (GBP)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">{t('Language')}</label>
                  <select className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-500/50 focus:bg-black/60 transition-all shadow-inner" value={language} onChange={handleLanguageChange}>
                    <option value="English" className="bg-gray-900">English</option>
                    <option value="Hindi" className="bg-gray-900">Hindi</option>
                    <option value="Spanish" className="bg-gray-900">Spanish</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full md:w-auto py-4 px-8 rounded-xl font-medium text-black bg-gradient-to-r from-yellow-500 to-yellow-300 hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2">
                <Save size={18} /> {t('Save Preferences')}
              </button>
            </form>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="glass-card rounded-3xl p-6 mb-6">
            <h3 className="text-lg font-light mb-2 text-white flex items-center gap-2">
              <Cloud size={20} className="text-yellow-500" /> {t('Cloud Sync')}
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              {t('Securely back up your data to the cloud. Automated backups run weekly.')}
            </p>
            <button 
              onClick={handleCloudBackup} 
              disabled={isBackingUp}
              className={`w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all border ${isBackingUp ? 'opacity-50 cursor-not-allowed bg-white/5 border-white/5 text-gray-400' : 'bg-white/10 hover:bg-white/20 text-white border-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'}`}
            >
              <Cloud size={18} /> {isBackingUp ? t('Syncing...') : t('Force Cloud Backup')}
            </button>
          </div>

          <div className="glass-card rounded-3xl p-6">
            <h3 className="text-lg font-light mb-2 text-white flex items-center gap-2">
              <Download size={20} className="text-gray-300" /> {t('Manual Export')}
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              {t('Your data is completely private. You can export a manual offline backup of your encrypted ledger at any time.')}
            </p>
            <button onClick={handleExport} className="w-full py-4 rounded-xl font-medium text-gray-400 bg-white/5 hover:bg-white/10 hover:text-white transition-all border border-white/5 flex items-center justify-center gap-2">
              <Download size={18} /> {t('Download JSON Backup')}
            </button>
          </div>

          <div className="glass-card rounded-3xl p-6 border-red-500/20">
            <h3 className="text-lg font-light mb-2 text-red-400 flex items-center gap-2">
              <LogOut size={20} /> {t('Sign Out')}
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              {t('Sign out of your account securely.')}
            </p>
            <button onClick={() => { if(window.confirm('Are you sure you want to log out?')) logout(); }} className="w-full py-4 rounded-xl font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all border border-red-500/20 flex items-center justify-center gap-2">
              <LogOut size={18} /> {t('Log Out')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
