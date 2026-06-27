import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Save, Download, Shield, Cloud } from 'lucide-react';
import { backupUserData } from '../firebase';
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const { t, i18n } = useTranslation();
  const { profile, updateProfile, expenses, people, user } = useAppContext();
  
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
    const langMap = { 'English': 'en', 'Hindi': 'hi', 'Spanish': 'es' };
    i18n.changeLanguage(langMap[language] || 'en');
    alert(t('Profile preferences saved!'));
  };

  const handleLanguageChange = (e) => {
    const val = e.target.value;
    setLanguage(val);
    const langMap = { 'English': 'en', 'Hindi': 'hi', 'Spanish': 'es' };
    i18n.changeLanguage(langMap[val] || 'en');
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
          <div className="glass-panel p-8 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-5 rounded-full blur-3xl"></div>
            
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-800">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-3xl font-bold shadow-neon">
                {profile.name ? profile.name.substring(0, 1).toUpperCase() : (user?.email ? user.email.substring(0, 1).toUpperCase() : 'U')}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{profile.name || user?.email || t('Local User')}</h2>
                <div className="flex flex-col gap-1 text-sm mt-2">
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-success" />
                    <span className="text-success">{t('Secured Locally')}</span>
                  </div>
                  {profile.lastBackupDate && (
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <Cloud size={14} />
                      <span>{t('Last cloud backup:')} {new Date(profile.lastBackupDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group mb-6 animate-fade-up">
                <label className="form-label">{t('Full Name')}</label>
                <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Doe" required />
              </div>

              <div className="form-group mb-8">
                <label className="form-label text-gray-300 mb-3 block">{t('Account Type')}</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`p-4 border rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 ${mode === 'student' ? 'border-primary bg-primary bg-opacity-10 text-white' : 'border-gray-800 text-muted hover:border-gray-600'}`}>
                    <input type="radio" name="mode" value="student" className="hidden" checked={mode === 'student'} onChange={() => setMode('student')} />
                    <span className="font-bold">{t('Personal / Student')}</span>
                    <span className="text-xs opacity-70">{t('Daily tracking & limits')}</span>
                  </label>
                  
                  <label className={`p-4 border rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 ${mode === 'business' ? 'border-accent bg-accent bg-opacity-10 text-white' : 'border-gray-800 text-muted hover:border-gray-600'}`}>
                    <input type="radio" name="mode" value="business" className="hidden" checked={mode === 'business'} onChange={() => setMode('business')} />
                    <span className="font-bold">{t('Business / Pro')}</span>
                    <span className="text-xs opacity-70">{t('Invoices & P&L')}</span>
                  </label>
                </div>
              </div>

              {mode === 'business' && (
                <div className="form-group mb-6 animate-fade-up">
                  <label className="form-label">{t('Business Name')}</label>
                  <input type="text" className="form-input" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. Acme Corp" required />
                </div>
              )}

              <div className="form-group mb-6">
                <label className="form-label">{t('Total Monthly Budget / Operating Budget')} ({currency})</label>
                <input type="number" className="form-input text-xl" value={monthlyBudget} onChange={(e) => setMonthlyBudget(e.target.value)} required />
              </div>

              <div className="flex gap-4 mb-8">
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
                  <select className="form-select" value={language} onChange={handleLanguageChange}>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Spanish">Spanish</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full md:w-auto shadow-neon">
                <Save size={18} /> {t('Save Preferences')}
              </button>
            </form>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="glass-panel p-6 mb-6">
            <h3 className="text-lg font-bold mb-2 text-white flex items-center gap-2">
              <Cloud size={20} className="text-primary" /> {t('Cloud Sync')}
            </h3>
            <p className="text-sm text-muted mb-6">
              {t('Securely back up your data to the cloud. Automated backups run weekly.')}
            </p>
            <button 
              onClick={handleCloudBackup} 
              disabled={isBackingUp}
              className={`btn btn-primary w-full shadow-neon ${isBackingUp ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Cloud size={18} /> {isBackingUp ? t('Syncing...') : t('Force Cloud Backup')}
            </button>
          </div>

          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold mb-2 text-white flex items-center gap-2">
              <Download size={20} className="text-accent" /> {t('Manual Export')}
            </h3>
            <p className="text-sm text-muted mb-6">
              {t('Your data is completely private. You can export a manual offline backup of your encrypted ledger at any time.')}
            </p>
            <button onClick={handleExport} className="btn btn-outline w-full hover:bg-gray-800">
              <Download size={18} /> {t('Download JSON Backup')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
