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
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isBusiness ? <Briefcase size={20} className="text-primary" /> : <UserIcon size={20} className="text-accent" />}
            <span className="badge badge-primary">{isBusiness ? t('Business Account') : t('Personal Account')}</span>
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            {profile.name ? `${t('Welcome back')}, ${profile.name.split(' ')[0]}` : (isBusiness ? profile.businessName || t('Your Business') : t('Welcome back'))}
          </h1>
          <p className="text-muted text-sm mt-1">
            {today.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <button className="btn btn-primary shadow-neon" onClick={() => {
          setEditingId(null);
          setNewExpense({ amount: '', category: isBusiness ? 'Inventory' : 'Food', description: '', type: 'expense', invoiceNumber: '' });
          setShowAddModal(true);
        }}>
          <Plus size={18} /> {t('New Transaction')}
        </button>
      </div>

      {isBusiness ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-panel p-6 col-span-1 md:col-span-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-10 rounded-full blur-3xl"></div>
            <h2 className="text-muted text-sm font-medium mb-1 uppercase tracking-wider">{t('Net Profit (This Month)')}</h2>
            <div className={`text-4xl font-bold mb-4 flex items-center ${profit >= 0 ? 'text-success' : 'text-danger'}`}>
              <span className="mr-1">{currency}</span>
              {profit.toLocaleString('en-IN')}
            </div>
            <div className="flex gap-4">
              <div className="bg-black bg-opacity-40 p-4 rounded-xl border border-gray-800 flex-1">
                <p className="text-xs text-muted mb-1">{t('Total Revenue')}</p>
                <p className="font-semibold text-lg flex items-center text-success">
                  {currency} {incomeSoFar.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="bg-black bg-opacity-40 p-4 rounded-xl border border-gray-800 flex-1">
                <p className="text-xs text-muted mb-1">{t('Total Expenses')}</p>
                <p className="font-semibold text-lg flex items-center text-danger">
                  {currency} {spentSoFar.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
          <div className="glass-panel p-6 flex flex-col justify-center items-center text-center">
             <div className="w-16 h-16 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center mb-4">
               <Briefcase size={28} className="text-primary" />
             </div>
             <h3 className="font-bold text-lg mb-1">{t('Operating Budget')}</h3>
             <p className="text-2xl font-bold mb-2">{currency}{budget.toLocaleString('en-IN')}</p>
             <p className="text-xs text-muted">{t('Budget Remaining')}: {currency}{remainingBudget.toLocaleString('en-IN')}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="glass-panel p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-10 rounded-full blur-3xl"></div>
            <h2 className="text-muted text-sm font-medium mb-1 uppercase tracking-wider">{t('Remaining Budget')}</h2>
            <div className="text-4xl font-bold mb-4 flex items-center">
              <span className="mr-1">{currency}</span>
              {remainingBudget.toLocaleString('en-IN')}
            </div>
            
            <div className="flex justify-between items-center bg-black bg-opacity-40 p-4 rounded-xl border border-gray-800">
              <div>
                <p className="text-xs text-muted mb-1">{t('Safe to spend today')}</p>
                <p className="font-semibold text-xl text-accent flex items-center">
                  {currency} {Math.max(0, dailyLimit)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted mb-1">{remainingDays} {t('days left')}</p>
                <p className="text-sm font-medium text-gray-300">{t('Out of')} {currency}{budget}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-5 flex flex-col justify-center group hover:bg-gray-800 transition-colors">
              <div className="flex items-center text-danger mb-2">
                <div className="p-2 rounded-full bg-red-500 bg-opacity-20 mr-2"><ArrowDownRight size={16} /></div>
                <span className="text-sm font-medium uppercase tracking-wider text-muted group-hover:text-gray-300 transition-colors">{t('Spent')}</span>
              </div>
              <p className="text-2xl font-bold">{currency}{spentSoFar.toLocaleString('en-IN')}</p>
            </div>
            <div className="glass-panel p-5 flex flex-col justify-center group hover:bg-gray-800 transition-colors">
              <div className="flex items-center text-success mb-2">
                <div className="p-2 rounded-full bg-green-500 bg-opacity-20 mr-2"><ArrowUpRight size={16} /></div>
                <span className="text-sm font-medium uppercase tracking-wider text-muted group-hover:text-gray-300 transition-colors">{t('Earned')}</span>
              </div>
              <p className="text-2xl font-bold">{currency}{incomeSoFar.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions list */}
      <div>
        <h3 className="text-xl font-bold mb-4">{t('Recent Transactions')}</h3>
        <div className="glass-panel overflow-hidden p-2">
          {expenses.slice(0, 5).map((exp, i) => (
            <div key={exp.id} className="p-4 border-b border-gray-800 last:border-0 flex justify-between items-center hover:bg-gray-800 hover:bg-opacity-50 transition-colors rounded-lg">
              <div>
                <p className="font-medium text-lg">{exp.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`badge ${exp.type === 'income' ? 'badge-success' : 'badge-primary'}`}>{exp.category}</span>
                  {isBusiness && exp.invoiceNumber && <span className="text-xs text-muted bg-gray-900 px-2 py-1 rounded">Inv: {exp.invoiceNumber}</span>}
                  <span className="text-xs text-muted">{new Date(exp.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`text-xl font-bold ${exp.type === 'expense' ? 'text-danger' : 'text-success'}`}>
                  {exp.type === 'expense' ? '-' : '+'}{currency}{exp.amount}
                </div>
                <div className="flex gap-2">
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
                    className="p-1.5 text-muted hover:text-blue-400 hover:bg-gray-700 rounded transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm(t('Are you sure you want to delete this transaction?'))) {
                        deleteExpense(exp.id);
                      }
                    }}
                    className="p-1.5 text-muted hover:text-red-400 hover:bg-gray-700 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {expenses.length === 0 && (
            <div className="p-10 text-center text-muted border border-dashed border-gray-700 rounded-xl m-2">
              {t('No transactions this month. Click the Add button to start!')}
            </div>
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel-no-hover p-8 w-full max-w-md animate-fade-up">
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
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
