import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, ArrowUpRight, ArrowDownRight, Briefcase, Edit2, Trash2, Truck, Fuel, Utensils, ShoppingCart, Wallet, FileText, Eye, IndianRupee, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';

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
  const today = new Date();
  
  const monthlyExpenses = useMemo(() => {
    return expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  }, [expenses, currentMonth, currentYear]);

  const spentSoFar = monthlyExpenses.reduce((acc, curr) => curr.type === 'expense' ? acc + Number(curr.amount) : acc, 0);
  const incomeSoFar = monthlyExpenses.reduce((acc, curr) => curr.type === 'income' ? acc + Number(curr.amount) : acc, 0);

  const budget = profile.monthlyBudget || 10000;
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
  };

  const businessCategories = ["Inventory", "Salary", "Taxes", "Marketing", "Office Supplies", "Client Payment"];
  const personalCategories = ["Food", "Transport", "Fuel", "Entertainment", "Utilities", "Shopping", "Health"];

  // Helper for mock charts data
  const sparklineData1 = [{v: 40}, {v: 45}, {v: 40}, {v: 60}, {v: 55}, {v: 70}, {v: 85}, {v: 75}, {v: 90}];
  const sparklineData2 = [{v: 10}, {v: 15}, {v: 12}, {v: 25}, {v: 20}, {v: 30}, {v: 35}];
  const sparklineData3 = [{v: 10}, {v: 12}, {v: 11}, {v: 15}, {v: 14}, {v: 16}, {v: 25}];

  // Donut chart data processing
  const categoryTotals = useMemo(() => {
    const totals = {};
    monthlyExpenses.forEach(exp => {
      if (exp.type === 'expense') {
        totals[exp.category] = (totals[exp.category] || 0) + Number(exp.amount);
      }
    });
    return Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [monthlyExpenses]);

  const COLORS = ['#d4af37', '#8b5cf6', '#3b82f6', '#10b981', '#f43f5e', '#f59e0b'];

  const getCategoryIcon = (category) => {
    const c = category.toLowerCase();
    if (c.includes('transport')) return { icon: <Truck size={16} />, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
    if (c.includes('fuel')) return { icon: <Fuel size={16} />, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
    if (c.includes('food') || c.includes('lunch')) return { icon: <Utensils size={16} />, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
    if (c.includes('shop') || c.includes('grocer')) return { icon: <ShoppingCart size={16} />, color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
    if (c.includes('deposit') || c.includes('income')) return { icon: <IndianRupee size={16} />, color: 'bg-green-500/20 text-green-400 border-green-500/30' };
    return { icon: <Wallet size={16} />, color: 'bg-white/10 text-white border-white/20' };
  };

  return (
    <div className="animate-fade-in w-full text-white">
      {/* Top Welcome Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 relative">
        <div className="mb-6 md:mb-0">
          <p className="text-gray-400 text-sm mb-1 tracking-widest uppercase">{t('Overview')}</p>
          <h1 className="text-4xl font-light mb-2 flex items-center gap-2">
            {profile.name ? `${t('Welcome back')}, ` : (isBusiness ? t('Your Business') : t('Welcome back'))}
            <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-200">
              {profile.name ? profile.name.split(' ')[0] : ''}
            </span>
          </h1>
          <p className="text-gray-400 text-sm font-light">
            {today.toLocaleDateString('default', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button 
          className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full border border-white/10 backdrop-blur-md transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-105"
          onClick={() => {
            setEditingId(null);
            setNewExpense({ amount: '', category: isBusiness ? 'Inventory' : 'Food', description: '', type: 'expense', invoiceNumber: '' });
            setShowAddModal(true);
          }}
        >
          <div className="bg-white text-black p-1 rounded-full"><Plus size={16} /></div> 
          <span className="font-medium tracking-wide">{t('New Transaction')}</span>
        </button>
      </div>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        
        {/* Premium Black Card (Remaining Budget) */}
        <div className="md:col-span-6 glass-card rounded-3xl p-8 relative overflow-hidden group">
          {/* Card Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rotate-12 scale-150 transform translate-x-[-100%] group-hover:translate-x-[100%] pointer-events-none"></div>
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                <Wallet size={20} className="text-black" />
              </div>
              <div>
                <span className="text-xs text-gray-400 tracking-wider uppercase block">{t('Remaining Budget')}</span>
                <span className="text-sm font-medium text-yellow-500">Premium Account</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl opacity-50">Visa</div>
            </div>
          </div>
          
          <div className="relative z-10 mb-8 mt-4">
            <h2 className="text-5xl font-light tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
              {currency}{remainingBudget.toLocaleString('en-IN')}
            </h2>
            <div className="w-full bg-black/40 h-1 rounded-full mt-6 mb-2 overflow-hidden shadow-inner">
               <div className="bg-gradient-to-r from-yellow-600 to-yellow-300 h-full rounded-full relative" style={{width: `${Math.min(100, (remainingBudget/budget)*100)}%`}}>
                 <div className="absolute top-0 right-0 w-2 h-full bg-white rounded-full shadow-[0_0_10px_white]"></div>
               </div>
            </div>
          </div>

          <div className="flex justify-between items-end relative z-10">
            <div>
              <p className="text-xs text-gray-400 mb-1 tracking-wide uppercase">{t('Safe to spend today')}</p>
              <p className="font-medium text-lg">{currency}{Math.max(0, dailyLimit).toLocaleString('en-IN')}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-1 tracking-wide uppercase">{remainingDays} {t('days left')}</p>
              <p className="text-sm text-gray-300">Out of {currency}{budget.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        {/* Spent */}
        <div className="md:col-span-3 glass-card rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all"></div>
          <div>
            <div className="flex items-center gap-2 text-gray-400 mb-4">
              <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                <ArrowDownRight size={16} />
              </div>
              <span className="font-medium text-sm tracking-wide uppercase">{t('Spent')}</span>
            </div>
            <h2 className="text-3xl font-light mb-4">{currency}{spentSoFar.toLocaleString('en-IN')}</h2>
          </div>
          
          <div className="h-20 w-full mt-auto mb-4 relative -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData2}>
                <Line type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={3} dot={false} style={{ filter: 'drop-shadow(0px 8px 8px rgba(239, 68, 68, 0.4))' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">{t('This month')}</span>
            <span className="bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-1 rounded-md font-medium">+12.5%</span>
          </div>
        </div>

        {/* Earned */}
        <div className="md:col-span-3 glass-card rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-all"></div>
          <div>
            <div className="flex items-center gap-2 text-gray-400 mb-4">
              <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500">
                <ArrowUpRight size={16} />
              </div>
              <span className="font-medium text-sm tracking-wide uppercase">{t('Earned')}</span>
            </div>
            <h2 className="text-3xl font-light mb-4">{currency}{incomeSoFar.toLocaleString('en-IN')}</h2>
          </div>
          
          <div className="h-20 w-full mt-auto mb-4 relative -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData3}>
                <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={3} dot={false} style={{ filter: 'drop-shadow(0px 8px 8px rgba(16, 185, 129, 0.4))' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">{t('This month')}</span>
            <span className="bg-green-500/10 border border-green-500/20 text-green-400 px-2 py-1 rounded-md font-medium">+0%</span>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Recent Transactions */}
        <div className="md:col-span-7 glass-card rounded-3xl p-8 flex flex-col h-[520px]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-medium">{t('Recent Transactions')}</h3>
            <select className="bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-sm text-gray-300 outline-none hover:bg-white/5 cursor-pointer backdrop-blur-md">
              <option>All Categories</option>
            </select>
          </div>

          <div className="space-y-3 overflow-y-auto pr-2 flex-1 custom-scrollbar">
            {expenses.map((exp) => {
              const { icon, color } = getCategoryIcon(exp.category);
              return (
                <div key={exp.id} className="flex justify-between items-center p-4 hover:bg-white/5 rounded-2xl border border-transparent hover:border-white/5 transition-all group shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${color} shadow-inner`}>
                      {icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-base text-gray-100">{exp.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-500">{new Date(exp.date).toLocaleDateString('en-GB')}</p>
                        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">{exp.category}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className={`font-medium text-lg tracking-wide ${exp.type === 'expense' ? 'text-gray-100' : 'text-green-400'}`}>
                      {exp.type === 'expense' ? '-' : '+'}{currency}{exp.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="flex gap-2 transition-all">
                      <button onClick={() => {
                        setEditingId(exp.id);
                        setNewExpense(exp);
                        setShowAddModal(true);
                      }} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/5">
                        <Edit2 size={12} />
                      </button>
                      <button onClick={() => {
                        if (window.confirm('Delete?')) deleteExpense(exp.id);
                      }} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-400 bg-white/5 rounded-full hover:bg-red-500/10 transition-colors border border-white/5">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {expenses.length === 0 && (
              <div className="p-10 text-center text-gray-500 h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/5">
                  <FileText size={24} className="opacity-50" />
                </div>
                <p>No transactions yet.</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/5">
            <Link to="/ledger" className="w-full flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white transition-colors py-2">
              View All Transactions <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        
        {/* Right Side: Overview & Quick Actions */}
        <div className="md:col-span-5 flex flex-col gap-6">
          
          {/* Monthly Overview Donut */}
          <div className="glass-card rounded-3xl p-8 h-[300px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">{t('Monthly Overview')}</h3>
            </div>
            
            <div className="flex items-center h-full pb-8">
              {categoryTotals.length > 0 ? (
                <>
                  <div className="w-1/2 h-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={categoryTotals}
                          innerRadius="70%"
                          outerRadius="100%"
                          paddingAngle={8}
                          dataKey="value"
                          stroke="rgba(0,0,0,0.5)"
                          strokeWidth={2}
                          cornerRadius={10}
                        >
                          {categoryTotals.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ filter: `drop-shadow(0px 0px 8px ${COLORS[index % COLORS.length]}80)` }} />
                          ))}
                        </Pie>
                      </RePieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xl font-light">{currency}{spentSoFar.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Total</span>
                    </div>
                  </div>
                  
                  <div className="w-1/2 pl-6 flex flex-col justify-center gap-4">
                    {categoryTotals.slice(0, 4).map((cat, i) => (
                      <div key={cat.name} className="flex flex-col gap-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{backgroundColor: COLORS[i % COLORS.length], color: COLORS[i % COLORS.length]}}></div>
                            <span className="text-gray-300 font-medium">{cat.name}</span>
                          </div>
                        </div>
                        <span className="text-gray-400 text-sm ml-4">{currency}{cat.value.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="w-full text-center text-gray-500 text-sm">No expenses this month</div>
              )}
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="glass-card rounded-3xl p-8 flex-1">
            <h3 className="text-lg font-medium mb-6">{t('Quick Actions')}</h3>
            <div className="grid grid-cols-4 gap-4">
              <button onClick={() => {
                setEditingId(null);
                setNewExpense({ amount: '', category: isBusiness ? 'Inventory' : 'Food', description: '', type: 'expense', invoiceNumber: '' });
                setShowAddModal(true);
              }} className="flex flex-col items-center gap-3 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 text-gray-300 flex items-center justify-center group-hover:bg-white/10 group-hover:scale-105 group-hover:text-white transition-all shadow-lg">
                  <Plus size={20} />
                </div>
                <span className="text-[10px] text-gray-400 text-center uppercase tracking-wider">Add<br/>Expense</span>
              </button>
              
              <button onClick={() => {
                setEditingId(null);
                setNewExpense({ amount: '', category: 'Salary', description: '', type: 'income', invoiceNumber: '' });
                setShowAddModal(true);
              }} className="flex flex-col items-center gap-3 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 text-gray-300 flex items-center justify-center group-hover:bg-white/10 group-hover:scale-105 group-hover:text-white transition-all shadow-lg">
                  <IndianRupee size={20} />
                </div>
                <span className="text-[10px] text-gray-400 text-center uppercase tracking-wider">Add<br/>Income</span>
              </button>

              <button className="flex flex-col items-center gap-3 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 text-gray-300 flex items-center justify-center group-hover:bg-white/10 group-hover:scale-105 group-hover:text-white transition-all shadow-lg">
                  <Calendar size={20} />
                </div>
                <span className="text-[10px] text-gray-400 text-center uppercase tracking-wider">View<br/>Calendar</span>
              </button>

              <button className="flex flex-col items-center gap-3 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 text-gray-300 flex items-center justify-center group-hover:bg-white/10 group-hover:scale-105 group-hover:text-white transition-all shadow-lg">
                  <FileText size={20} />
                </div>
                <span className="text-[10px] text-gray-400 text-center uppercase tracking-wider">Download<br/>Report</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <button 
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.5)] z-40 hover:scale-110 transition-transform"
        onClick={() => {
          setEditingId(null);
          setNewExpense({ amount: '', category: isBusiness ? 'Inventory' : 'Food', description: '', type: 'expense', invoiceNumber: '' });
          setShowAddModal(true);
        }}
      >
        <Plus size={24} />
      </button>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowAddModal(false)}></div>
          <div className="relative glass-card p-8 w-full max-w-md rounded-3xl animate-fade-up border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
            <h2 className="text-2xl font-light mb-8 text-white tracking-wide">
              {editingId ? t('Update Transaction') : (
                <>{t('New')} {isBusiness ? t('Business') : t('Personal')} {t('Transaction')}</>
              )}
            </h2>
            <form onSubmit={handleAddSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-6 bg-black/20 p-1 rounded-2xl border border-white/5">
                <button 
                  type="button" 
                  className={`py-3 rounded-xl text-center font-medium transition-all text-sm ${newExpense.type === 'expense' ? 'bg-white/10 text-white shadow-md border border-white/5' : 'text-gray-500 hover:text-white'}`}
                  onClick={() => setNewExpense({...newExpense, type: 'expense'})}
                >{t('Expense')}</button>
                <button 
                  type="button" 
                  className={`py-3 rounded-xl text-center font-medium transition-all text-sm ${newExpense.type === 'income' ? 'bg-white/10 text-white shadow-md border border-white/5' : 'text-gray-500 hover:text-white'}`}
                  onClick={() => setNewExpense({...newExpense, type: 'income'})}
                >{t('Income')}</button>
              </div>

              <div className="flex flex-col gap-2 mb-5">
                <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">{t('Amount')} ({currency})</label>
                <input type="number" required className="bg-black/40 border border-white/5 rounded-xl px-4 py-4 text-white text-xl outline-none focus:border-yellow-500/50 focus:bg-black/60 transition-all shadow-inner" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} placeholder="0.00" />
              </div>
              <div className="flex flex-col gap-2 mb-5">
                <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">{t('Description')}</label>
                <input type="text" required className="bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-500/50 focus:bg-black/60 transition-all shadow-inner" value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} placeholder="e.g. Uber Ride" />
              </div>
              <div className="flex flex-col gap-2 mb-8">
                <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">{t('Category')}</label>
                <select className="bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-500/50 focus:bg-black/60 transition-all shadow-inner" value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})}>
                  {(isBusiness ? businessCategories : personalCategories).map(cat => (
                    <option key={cat} value={cat} className="bg-gray-900">{t(cat)}</option>
                  ))}
                  <option value="Other" className="bg-gray-900">{t('Other')}</option>
                </select>
              </div>
              
              <div className="flex gap-4">
                <button type="button" className="flex-1 py-4 px-4 rounded-xl font-medium text-gray-400 bg-white/5 hover:bg-white/10 hover:text-white transition-all border border-white/5" onClick={() => { setShowAddModal(false); setEditingId(null); }}>{t('Cancel')}</button>
                <button type="submit" className="flex-1 py-4 px-4 rounded-xl font-semibold text-black bg-gradient-to-r from-yellow-500 to-yellow-300 hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(212,175,55,0.3)]">{editingId ? t('Update') : t('Save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
