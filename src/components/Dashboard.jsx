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

  const COLORS = ['#a78bfa', '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#ec4899'];

  const getCategoryIcon = (category) => {
    const c = category.toLowerCase();
    if (c.includes('transport')) return { icon: <Truck size={16} />, color: 'bg-purple-600', text: 'text-white' };
    if (c.includes('fuel')) return { icon: <Fuel size={16} />, color: 'bg-green-600', text: 'text-white' };
    if (c.includes('food') || c.includes('lunch')) return { icon: <Utensils size={16} />, color: 'bg-blue-600', text: 'text-white' };
    if (c.includes('shop') || c.includes('grocer')) return { icon: <ShoppingCart size={16} />, color: 'bg-orange-600', text: 'text-white' };
    if (c.includes('deposit') || c.includes('income')) return { icon: <IndianRupee size={16} />, color: 'bg-green-500', text: 'text-white' };
    return { icon: <Wallet size={16} />, color: 'bg-gray-600', text: 'text-white' };
  };

  return (
    <div className="animate-fade-in text-white w-full">
      {/* Top Welcome Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 relative">
        <div className="mb-6 md:mb-0">
          <p className="text-gray-400 text-sm mb-1">{t('Good evening,')}</p>
          <h1 className="text-3xl font-semibold mb-2 flex items-center gap-2">
            {profile.name ? `${t('Welcome back')}, ${profile.name.split(' ')[0]}` : (isBusiness ? profile.businessName || t('Your Business') : t('Welcome back'))} 
            <span className="text-2xl">👋</span>
          </h1>
          <p className="text-gray-400 text-sm">
            {today.toLocaleDateString('default', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button 
          className="hidden md:flex btn btn-primary px-6 py-2.5 rounded-lg shadow-[0_4px_14px_rgba(251,192,45,0.2)]"
          onClick={() => {
            setEditingId(null);
            setNewExpense({ amount: '', category: isBusiness ? 'Inventory' : 'Food', description: '', type: 'expense', invoiceNumber: '' });
            setShowAddModal(true);
          }}
        >
          <Plus size={18} /> {t('New Transaction')}
        </button>
      </div>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        
        {/* Remaining Budget */}
        <div className="md:col-span-6 bg-[#181a24] rounded-2xl p-6 border border-[#2a2c3a] relative overflow-hidden group hover:border-[#fbc02d]/30 transition-colors">
          <div className="flex justify-between items-start mb-2 relative z-10">
            <div className="flex items-center gap-2 text-gray-300">
              <div className="text-yellow-500"><Wallet size={18} /></div>
              <span className="font-medium text-sm">{t('Remaining Budget')}</span>
            </div>
          </div>
          
          <div className="relative z-10 mb-2">
            <h2 className="text-3xl font-bold mb-1">{currency}{remainingBudget.toLocaleString('en-IN')}</h2>
            <div className="w-full bg-gray-800 h-1.5 rounded-full mt-4 mb-2 overflow-hidden">
               <div className="bg-yellow-500 h-full rounded-full" style={{width: `${Math.min(100, (remainingBudget/budget)*100)}%`}}></div>
            </div>
          </div>

          <div className="h-16 relative z-10 w-full mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData1}>
                <Line type="monotone" dataKey="v" stroke="#fbc02d" strokeWidth={2} dot={false} style={{ filter: 'drop-shadow(0px 4px 6px rgba(251, 192, 45, 0.4))' }} />
              </LineChart>
            </ResponsiveContainer>
            {/* Glow gradient below line */}
            <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-yellow-500/10 to-transparent pointer-events-none"></div>
          </div>

          <div className="flex justify-between items-end relative z-10">
            <div>
              <p className="text-xs text-gray-400 mb-1">{t('Safe to spend today')}</p>
              <p className="font-semibold">{currency}{Math.max(0, dailyLimit).toLocaleString('en-IN')}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-1">{remainingDays} {t('days left')}</p>
              <p className="text-xs text-gray-500">Out of {currency}{budget.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        {/* Spent */}
        <div className="md:col-span-3 bg-[#181a24] rounded-2xl p-6 border border-[#2a2c3a] flex flex-col justify-between relative overflow-hidden group hover:border-red-500/30 transition-colors">
          <div>
            <div className="flex items-center gap-2 text-gray-300 mb-2">
              <div className="text-red-500"><ArrowDownRight size={18} /></div>
              <span className="font-medium text-sm">{t('Spent')}</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">{currency}{spentSoFar.toLocaleString('en-IN')}</h2>
          </div>
          
          <div className="h-16 w-full mt-auto mb-4 relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData2}>
                <Line type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={2} dot={false} style={{ filter: 'drop-shadow(0px 4px 6px rgba(239, 68, 68, 0.4))' }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-red-500/10 to-transparent pointer-events-none"></div>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">{t('This month')}</span>
            <span className="bg-red-500/20 text-red-500 px-2 py-0.5 rounded font-medium">+12.5%</span>
          </div>
        </div>

        {/* Earned */}
        <div className="md:col-span-3 bg-[#181a24] rounded-2xl p-6 border border-[#2a2c3a] flex flex-col justify-between relative overflow-hidden group hover:border-green-500/30 transition-colors">
          <div>
            <div className="flex items-center gap-2 text-gray-300 mb-2">
              <div className="text-green-500"><ArrowUpRight size={18} /></div>
              <span className="font-medium text-sm">{t('Earned')}</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">{currency}{incomeSoFar.toLocaleString('en-IN')}</h2>
          </div>
          
          <div className="h-16 w-full mt-auto mb-4 relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData3}>
                <Line type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={2} dot={false} style={{ filter: 'drop-shadow(0px 4px 6px rgba(34, 197, 94, 0.4))' }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-green-500/10 to-transparent pointer-events-none"></div>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">{t('This month')}</span>
            <span className="bg-green-500/20 text-green-500 px-2 py-0.5 rounded font-medium">+0%</span>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Recent Transactions */}
        <div className="md:col-span-7 bg-[#181a24] rounded-2xl p-6 border border-[#2a2c3a] flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold">{t('Recent Transactions')}</h3>
            <select className="bg-transparent border border-[#2a2c3a] rounded-lg px-3 py-1.5 text-xs text-gray-400 outline-none hover:bg-white/5 cursor-pointer">
              <option>All Categories</option>
            </select>
          </div>

          <div className="space-y-1 overflow-y-auto pr-2 flex-1 custom-scrollbar">
            {expenses.map((exp) => {
              const { icon, color, text } = getCategoryIcon(exp.category);
              return (
                <div key={exp.id} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-xl transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color} ${text}`}>
                      {icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-medium text-sm">{exp.description}</p>
                        <span className="text-[10px] text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded border border-yellow-500/20">{exp.category}</span>
                      </div>
                      <p className="text-xs text-gray-500">{new Date(exp.date).toLocaleDateString('en-GB')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className={`font-semibold ${exp.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
                      {exp.type === 'expense' ? '-' : '+'}{currency}{exp.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100">
                      <button onClick={() => {
                        setEditingId(exp.id);
                        setNewExpense(exp);
                        setShowAddModal(true);
                      }} className="p-1.5 text-gray-500 hover:text-white bg-white/5 rounded-md hover:bg-white/10 transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => {
                        if (window.confirm('Delete?')) deleteExpense(exp.id);
                      }} className="p-1.5 text-gray-500 hover:text-red-500 bg-white/5 rounded-md hover:bg-red-500/10 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {expenses.length === 0 && (
              <div className="p-10 text-center text-gray-500 h-full flex flex-col items-center justify-center">
                <FileText size={32} className="mb-2 opacity-20" />
                <p>No transactions yet.</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-800">
            <Link to="/ledger" className="w-full flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white transition-colors py-2">
              View All Transactions <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        
        {/* Right Side: Overview & Quick Actions */}
        <div className="md:col-span-5 flex flex-col gap-6">
          
          {/* Monthly Overview Donut */}
          <div className="bg-[#181a24] rounded-2xl p-6 border border-[#2a2c3a] h-[280px]">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-sm">{t('Monthly Overview')}</h3>
              <select className="bg-transparent border border-[#2a2c3a] rounded-lg px-2 py-1 text-xs text-gray-400 outline-none hover:bg-white/5 cursor-pointer">
                <option>June 2026</option>
              </select>
            </div>
            
            <div className="flex items-center h-full pb-4">
              {categoryTotals.length > 0 ? (
                <>
                  <div className="w-1/2 h-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={categoryTotals}
                          innerRadius="60%"
                          outerRadius="90%"
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {categoryTotals.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </RePieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xl font-bold">{currency}{spentSoFar.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-gray-400">Total Spent</span>
                    </div>
                  </div>
                  
                  <div className="w-1/2 pl-4 flex flex-col justify-center gap-2">
                    {categoryTotals.slice(0, 4).map((cat, i) => (
                      <div key={cat.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                          <span className="text-gray-300">{cat.name}</span>
                        </div>
                        <span className="text-gray-500">{currency}{cat.value.toLocaleString('en-IN')}</span>
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
          <div className="bg-[#181a24] rounded-2xl p-6 border border-[#2a2c3a] flex-1">
            <h3 className="font-semibold text-sm mb-4">{t('Quick Actions')}</h3>
            <div className="grid grid-cols-4 gap-2">
              <button onClick={() => {
                setEditingId(null);
                setNewExpense({ amount: '', category: isBusiness ? 'Inventory' : 'Food', description: '', type: 'expense', invoiceNumber: '' });
                setShowAddModal(true);
              }} className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-2xl bg-[#a78bfa]/10 text-[#a78bfa] flex items-center justify-center group-hover:bg-[#a78bfa]/20 transition-colors">
                  <Plus size={20} />
                </div>
                <span className="text-[10px] text-gray-400 text-center">Add<br/>Expense</span>
              </button>
              
              <button onClick={() => {
                setEditingId(null);
                setNewExpense({ amount: '', category: 'Salary', description: '', type: 'income', invoiceNumber: '' });
                setShowAddModal(true);
              }} className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-2xl bg-[#22c55e]/10 text-[#22c55e] flex items-center justify-center group-hover:bg-[#22c55e]/20 transition-colors">
                  <IndianRupee size={20} />
                </div>
                <span className="text-[10px] text-gray-400 text-center">Add<br/>Income</span>
              </button>

              <button className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-2xl bg-[#3b82f6]/10 text-[#3b82f6] flex items-center justify-center group-hover:bg-[#3b82f6]/20 transition-colors">
                  <Calendar size={20} />
                </div>
                <span className="text-[10px] text-gray-400 text-center">View<br/>Calendar</span>
              </button>

              <button className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-2xl bg-[#f59e0b]/10 text-[#f59e0b] flex items-center justify-center group-hover:bg-[#f59e0b]/20 transition-colors">
                  <FileText size={20} />
                </div>
                <span className="text-[10px] text-gray-400 text-center">Download<br/>Report</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <button 
        className="md:hidden fixed bottom-20 right-6 w-14 h-14 bg-primary text-black rounded-full flex items-center justify-center shadow-[0_4px_14px_rgba(251,192,45,0.4)] z-40 hover:bg-yellow-400 transition-colors"
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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="bg-[#181a24] p-8 w-full max-w-md rounded-2xl border border-gray-800 animate-fade-up">
            <h2 className="text-2xl font-bold mb-6 text-white">
              {editingId ? t('Update Transaction') : (
                <>{t('New')} {isBusiness ? t('Business') : t('Personal')} {t('Transaction')}</>
              )}
            </h2>
            <form onSubmit={handleAddSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button 
                  type="button" 
                  className={`p-3 rounded-xl border text-center font-bold transition-all ${newExpense.type === 'expense' ? 'bg-red-500/20 border-red-500/50 text-red-500' : 'border-[#2a2c3a] text-gray-500 hover:bg-white/5'}`}
                  onClick={() => setNewExpense({...newExpense, type: 'expense'})}
                >{t('Expense')}</button>
                <button 
                  type="button" 
                  className={`p-3 rounded-xl border text-center font-bold transition-all ${newExpense.type === 'income' ? 'bg-green-500/20 border-green-500/50 text-green-500' : 'border-[#2a2c3a] text-gray-500 hover:bg-white/5'}`}
                  onClick={() => setNewExpense({...newExpense, type: 'income'})}
                >{t('Income')}</button>
              </div>

              <div className="flex flex-col gap-1 mb-4">
                <label className="text-xs text-gray-400 font-medium">{t('Amount')} ({currency})</label>
                <input type="number" required className="bg-[#111319] border border-[#2a2c3a] rounded-lg px-4 py-3 text-white text-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} placeholder="0.00" />
              </div>
              <div className="flex flex-col gap-1 mb-4">
                <label className="text-xs text-gray-400 font-medium">{t('Description')}</label>
                <input type="text" required className="bg-[#111319] border border-[#2a2c3a] rounded-lg px-4 py-3 text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} placeholder="e.g. Uber Ride" />
              </div>
              <div className="flex flex-col gap-1 mb-4">
                <label className="text-xs text-gray-400 font-medium">{t('Category')}</label>
                <select className="bg-[#111319] border border-[#2a2c3a] rounded-lg px-4 py-3 text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})}>
                  {(isBusiness ? businessCategories : personalCategories).map(cat => (
                    <option key={cat} value={cat}>{t(cat)}</option>
                  ))}
                  <option value="Other">{t('Other')}</option>
                </select>
              </div>
              
              <div className="flex gap-4 mt-8">
                <button type="button" className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-[#2a2c3a] hover:bg-[#3a3c4a] transition-colors" onClick={() => { setShowAddModal(false); setEditingId(null); }}>{t('Cancel')}</button>
                <button type="submit" className="flex-1 py-3 px-4 rounded-xl font-semibold text-black bg-primary hover:bg-yellow-400 transition-colors shadow-[0_4px_14px_rgba(251,192,45,0.2)]">{editingId ? t('Update') : t('Save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
