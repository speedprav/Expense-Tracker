import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, ArrowUpRight, ArrowDownRight, Briefcase, User as UserIcon, Edit2, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { t } = useTranslation();
  const { profile, expenses, addExpense, deleteExpense, updateExpense } = useAppContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const isBusiness = profile.mode === 'business';
  const currency = profile.currency || '₹';

  const [newExpense, setNewExpense] = useState({ 
    amount: '', 
    category: isBusiness ? 'Inventory' : 'Food', 
    description: '', 
    type: 'expense',
    invoiceNumber: '' 
  });

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyExpenses = useMemo(() => {
    return expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  }, [expenses, currentMonth, currentYear]);

  const spentSoFar = monthlyExpenses.reduce((acc, curr) => curr.type === 'expense' ? acc + Number(curr.amount) : acc, 0);
  const incomeSoFar = monthlyExpenses.reduce((acc, curr) => curr.type === 'income' ? acc + Number(curr.amount) : acc, 0);
  const profit = incomeSoFar - spentSoFar;

  const budget = profile.monthlyBudget || 10000;
  const today = new Date();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const remainingDays = daysInMonth - today.getDate() + 1;
  const remainingBudget = budget - spentSoFar;
  const dailyLimit = remainingDays > 0 ? (remainingBudget / remainingDays).toFixed(2) : remainingBudget.toFixed(2);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newExpense.amount) return;
    
    if (editingId) {
      updateExpense(editingId, {
        ...newExpense,
        amount: Number(newExpense.amount)
      });
      setEditingId(null);
    } else {
      addExpense({
        ...newExpense,
        amount: Number(newExpense.amount),
        date: new Date().toISOString()
      });
    }
    
    setShowAddModal(false);
    setNewExpense({ 
      amount: '', 
      category: isBusiness ? 'Inventory' : 'Food', 
      description: '', 
      type: 'expense',
      invoiceNumber: '' 
    });
  };

  const businessCategories = ["Inventory", "Salary", "Taxes", "Marketing", "Office Supplies", "Client Payment"];
  const personalCategories = ["Food", "Transport", "Entertainment", "Utilities", "Shopping", "Health"];

  return (
    <div className="container animate-fade-in">
      <div className="flex justify-between items-end mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {isBusiness ? <Briefcase size={16} className="text-primary" /> : <UserIcon size={16} className="text-accent" />}
            <span className="text-xs uppercase tracking-widest text-primary font-medium">{isBusiness ? t('Business Account') : t('Personal Account')}</span>
          </div>
          <h1 className="text-4xl font-light tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#fcfcfc]">
            {profile.name ? `${t('Welcome back')}, ${profile.name.split(' ')[0]}` : (isBusiness ? profile.businessName || t('Your Business') : t('Welcome back'))}
          </h1>
          <p className="text-muted text-sm mt-2 font-light tracking-wide">
            {today.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => {
          setEditingId(null);
          setNewExpense({ amount: '', category: isBusiness ? 'Inventory' : 'Food', description: '', type: 'expense', invoiceNumber: '' });
          setShowAddModal(true);
        }}>
          <Plus size={18} /> {t('New Transaction')}
        </button>
      </div>

      {isBusiness ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Main big balance card */}
          <div className="glass-panel p-8 relative overflow-hidden md:col-span-2 flex flex-col justify-between min-h-[240px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-5 rounded-full blur-3xl"></div>
            <div>
              <h2 className="text-muted text-sm font-medium mb-2 uppercase tracking-widest">{t('Net Profit (This Month)')}</h2>
              <div className={`text-6xl font-light mb-4 flex items-center tracking-tight ${profit >= 0 ? 'text-success' : 'text-danger'}`}>
                <span className="mr-2 text-4xl font-light opacity-50">{currency}</span>
                {profit.toLocaleString('en-IN')}
              </div>
            </div>
            
            <div className="flex gap-12 mt-auto pt-8 border-t border-gray-800 border-opacity-50">
              <div>
                <p className="text-xs text-muted mb-1 uppercase tracking-wider">{t('Total Revenue')}</p>
                <p className="font-medium text-2xl text-success flex items-center">
                  {currency}{incomeSoFar.toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1 uppercase tracking-wider">{t('Total Expenses')}</p>
                <p className="font-medium text-2xl text-danger flex items-center">
                  {currency}{spentSoFar.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          {/* Small side cards */}
          <div className="flex flex-col gap-6">
            <div className="glass-panel p-6 flex-1 flex flex-col justify-center text-center group hover:bg-gray-900 transition-colors">
               <div className="w-12 h-12 rounded-full border border-gray-700 mx-auto flex items-center justify-center mb-4">
                 <Briefcase size={20} className="text-primary" />
               </div>
               <h3 className="font-medium text-xs uppercase tracking-widest text-muted mb-2">{t('Operating Budget')}</h3>
               <p className="text-3xl font-light mb-1">{currency}{budget.toLocaleString('en-IN')}</p>
            </div>
            <div className="glass-panel p-6 flex-1 flex flex-col justify-center text-center group hover:bg-gray-900 transition-colors">
               <h3 className="font-medium text-xs uppercase tracking-widest text-muted mb-2">{t('Budget Remaining')}</h3>
               <p className="text-3xl font-light text-accent">{currency}{remainingBudget.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Main big balance card */}
          <div className="glass-panel p-8 relative overflow-hidden md:col-span-2 flex flex-col justify-between min-h-[240px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-5 rounded-full blur-3xl"></div>
            <div>
              <h2 className="text-muted text-sm font-medium mb-2 uppercase tracking-widest">{t('Available Balance')}</h2>
              <div className="text-6xl font-light mb-4 flex items-center tracking-tight">
                <span className="mr-2 text-4xl text-gray-500 font-light">{currency}</span>
                {remainingBudget.toLocaleString('en-IN')}
              </div>
            </div>
            
            <div className="flex gap-12 mt-auto pt-8 border-t border-gray-800 border-opacity-50">
              <div>
                <p className="text-xs text-muted mb-1 uppercase tracking-wider">{t('Safe to spend today')}</p>
                <p className="font-medium text-2xl text-accent flex items-center">
                  {currency}{Math.max(0, dailyLimit)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1 uppercase tracking-wider">{t('Days left')}</p>
                <p className="font-medium text-2xl text-gray-300">
                  {remainingDays} <span className="text-sm text-gray-600 ml-1">/ {daysInMonth}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Small side cards */}
          <div className="flex flex-col gap-6">
            <div className="glass-panel p-6 flex-1 flex flex-col justify-center group hover:bg-gray-900 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium uppercase tracking-widest text-muted">{t('Total Spent')}</span>
                <div className="p-2 rounded-full border border-gray-800 text-danger"><ArrowDownRight size={16} /></div>
              </div>
              <p className="text-3xl font-light">{currency}{spentSoFar.toLocaleString('en-IN')}</p>
            </div>
            <div className="glass-panel p-6 flex-1 flex flex-col justify-center group hover:bg-gray-900 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium uppercase tracking-widest text-muted">{t('Total Earned')}</span>
                <div className="p-2 rounded-full border border-gray-800 text-success"><ArrowUpRight size={16} /></div>
              </div>
              <p className="text-3xl font-light">{currency}{incomeSoFar.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions list */}
      <div className="mb-20">
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-xl font-light tracking-wide">{t('Recent Transactions')}</h3>
        </div>
        <div className="glass-panel overflow-hidden">
          {expenses.slice(0, 10).map((exp, i) => (
            <div key={exp.id} className="p-6 border-b border-gray-800 border-opacity-50 last:border-0 flex justify-between items-center hover:bg-black hover:bg-opacity-20 transition-colors">
              <div>
                <p className="font-medium text-lg mb-1.5">{exp.description}</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${exp.type === 'income' ? 'bg-success' : 'bg-primary'}`}></div>
                    <span className="text-xs text-muted uppercase tracking-wider">{t(exp.category)}</span>
                  </div>
                  <span className="text-xs text-gray-600 px-3 border-l border-gray-800">{new Date(exp.date).toLocaleDateString()}</span>
                  {isBusiness && exp.invoiceNumber && <span className="text-xs text-muted uppercase tracking-wider px-3 border-l border-gray-800">INV: {exp.invoiceNumber}</span>}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className={`text-2xl font-light tracking-wide ${exp.type === 'expense' ? 'text-danger' : 'text-success'}`}>
                  {exp.type === 'expense' ? '-' : '+'}{currency}{exp.amount}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100">
                  <button 
                    onClick={() => {
                      setEditingId(exp.id);
                      setNewExpense({
                        amount: exp.amount,
                        category: exp.category,
                        description: exp.description,
                        type: exp.type,
                        invoiceNumber: exp.invoiceNumber || ''
                      });
                      setShowAddModal(true);
                    }}
                    className="p-2 text-gray-500 hover:text-primary rounded-full hover:bg-gray-800 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm(t('Are you sure you want to delete this transaction?'))) {
                        deleteExpense(exp.id);
                      }
                    }}
                    className="p-2 text-gray-500 hover:text-danger rounded-full hover:bg-gray-800 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {expenses.length === 0 && (
            <div className="p-16 text-center text-muted">
              {t('No transactions this month. Click the Add button to start!')}
            </div>
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel p-10 w-full max-w-md animate-fade-up border border-gray-700">
            <h2 className="text-2xl font-light tracking-wide mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#fcfcfc]">
              {editingId ? t('Update Transaction') : (
                <>{t('New')} {isBusiness ? t('Business') : t('Personal')} {t('Transaction')}</>
              )}
            </h2>
            <form onSubmit={handleAddSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button 
                  type="button" 
                  className={`p-3 rounded-lg border text-center font-bold transition-all ${newExpense.type === 'expense' ? 'bg-red-500 bg-opacity-20 border-red-500 text-red-500' : 'border-gray-700 text-muted'}`}
                  onClick={() => setNewExpense({...newExpense, type: 'expense'})}
                >{t('Expense')}</button>
                <button 
                  type="button" 
                  className={`p-3 rounded-lg border text-center font-bold transition-all ${newExpense.type === 'income' ? 'bg-green-500 bg-opacity-20 border-green-500 text-green-500' : 'border-gray-700 text-muted'}`}
                  onClick={() => setNewExpense({...newExpense, type: 'income'})}
                >{t('Income')}</button>
              </div>

              <div className="form-group">
                <label className="form-label">{t('Amount')} ({currency})</label>
                <input type="number" required className="form-input text-xl font-bold" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} placeholder="0.00" />
              </div>
              <div className="form-group">
                <label className="form-label">{t('Description')}</label>
                <input type="text" required className="form-input" value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} placeholder="e.g. Server Costs" />
              </div>
              <div className="form-group">
                <label className="form-label">{t('Category')}</label>
                <select className="form-select" value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})}>
                  {(isBusiness ? businessCategories : personalCategories).map(cat => (
                    <option key={cat} value={cat}>{t(cat)}</option>
                  ))}
                  <option value="Other">{t('Other')}</option>
                </select>
              </div>
              
              {isBusiness && (
                <div className="form-group">
                  <label className="form-label">{t('Invoice / Receipt Number (Optional)')}</label>
                  <input type="text" className="form-input" value={newExpense.invoiceNumber} onChange={e => setNewExpense({...newExpense, invoiceNumber: e.target.value})} placeholder="e.g. INV-2023-001" />
                </div>
              )}
              
              <div className="flex gap-4 mt-8">
                <button type="button" className="btn btn-outline flex-1" onClick={() => { setShowAddModal(false); setEditingId(null); }}>{t('Cancel')}</button>
                <button type="submit" className="btn btn-primary flex-1 shadow-neon">{editingId ? t('Update') : t('Save Transaction')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
