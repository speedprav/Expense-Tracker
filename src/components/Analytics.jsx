import { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, AreaChart, Area, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { FileText, Download, ChevronDown } from 'lucide-react';
import { generatePDFReport } from '../utils/pdfGenerator';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#ec4899'];

export default function Analytics() {
  const { expenses, profile } = useAppContext();
  const currency = profile.currency || '₹';
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExport = (timeframe) => {
    generatePDFReport(expenses, profile, timeframe);
    setShowExportMenu(false);
  };

  // 1. Category Data for Donut Chart
  const categoryData = useMemo(() => {
    const expenseOnly = expenses.filter(e => e.type === 'expense');
    const grouped = expenseOnly.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
      return acc;
    }, {});
    return Object.keys(grouped).map(key => ({ name: key, value: grouped[key] })).sort((a,b) => b.value - a.value);
  }, [expenses]);

  // 2. Monthly Trend Data for Area Chart
  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    
    let result = [];
    for (let i = 5; i >= 0; i--) {
      let mIndex = currentMonth - i;
      let y = currentYear;
      if (mIndex < 0) {
        mIndex += 12;
        y -= 1;
      }
      result.push({ name: `${months[mIndex]}`, expense: 0, income: 0, mIndex, y });
    }

    expenses.forEach(e => {
      const d = new Date(e.date);
      const idx = result.findIndex(r => r.mIndex === d.getMonth() && r.y === d.getFullYear());
      if (idx !== -1) {
        if (e.type === 'expense') result[idx].expense += Number(e.amount);
        else result[idx].income += Number(e.amount);
      }
    });

    return result;
  }, [expenses]);

  // 3. Day of Week Data for Radar Chart
  const dayOfWeekData = useMemo(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let result = days.map(d => ({ subject: d, amount: 0, fullMark: 100 }));
    
    let max = 100;
    expenses.filter(e => e.type === 'expense').forEach(e => {
      const d = new Date(e.date).getDay();
      result[d].amount += Number(e.amount);
      if (result[d].amount > max) max = result[d].amount;
    });
    
    // Normalize fullMark for radar
    result.forEach(r => r.fullMark = max);
    return result;
  }, [expenses]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-3 bg-opacity-90 border-gray-700">
          <p className="font-bold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-medium flex justify-between gap-4">
              <span>{entry.name}:</span>
              <span>{currency}{entry.value.toLocaleString()}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container animate-fade-in mb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">Advanced Analytics</h1>
          <p className="text-muted">Deep dive into your financial patterns.</p>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="btn btn-primary shadow-neon flex items-center gap-2"
          >
            <Download size={18} /> Export PDF Report <ChevronDown size={16} />
          </button>
          
          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden animate-fade-up">
              <button onClick={() => handleExport('weekly')} className="w-full text-left px-4 py-3 hover:bg-gray-800 text-sm flex items-center gap-2 border-b border-gray-800">
                <FileText size={16} className="text-primary" /> Weekly Report
              </button>
              <button onClick={() => handleExport('monthly')} className="w-full text-left px-4 py-3 hover:bg-gray-800 text-sm flex items-center gap-2 border-b border-gray-800">
                <FileText size={16} className="text-accent" /> Monthly Report
              </button>
              <button onClick={() => handleExport('quarterly')} className="w-full text-left px-4 py-3 hover:bg-gray-800 text-sm flex items-center gap-2 border-b border-gray-800">
                <FileText size={16} className="text-success" /> Quarterly Report
              </button>
              <button onClick={() => handleExport('yearly')} className="w-full text-left px-4 py-3 hover:bg-gray-800 text-sm flex items-center gap-2">
                <FileText size={16} className="text-warning" /> Yearly Report
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Left: Area Chart */}
        <div className="glass-panel p-6 col-span-1 lg:col-span-2">
          <h3 className="text-lg font-bold mb-6 text-gray-200">Income vs Expense Trend (6 Months)</h3>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#52525b" tick={{fill: '#a1a1aa'}} />
                <YAxis stroke="#52525b" tick={{fill: '#a1a1aa'}} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" name="Expense" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Left: Donut Chart */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-200">Expenses by Category</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {categoryData.length === 0 && (
            <p className="text-center text-muted mt-4">Not enough data.</p>
          )}
        </div>

        {/* Bottom Right: Radar Chart */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-200">Spending by Day of Week</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={dayOfWeekData}>
                <PolarGrid stroke="#3f3f46" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={false} axisLine={false} />
                <Radar name="Spending Intensity" dataKey="amount" stroke="#8b5cf6" strokeWidth={2} fill="#8b5cf6" fillOpacity={0.4} />
                <RechartsTooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
