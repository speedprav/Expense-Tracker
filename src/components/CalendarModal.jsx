import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { X, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export default function CalendarModal({ onClose }) {
  const { expenses, profile } = useAppContext();
  const currency = profile.currency || '₹';
  const isBusiness = profile.mode === 'business';
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day-empty"></div>);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
    const isSelected = selectedDate.getDate() === i && selectedDate.getMonth() === currentDate.getMonth() && selectedDate.getFullYear() === currentDate.getFullYear();
    const isToday = new Date().getDate() === i && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();
    
    // Check if there are transactions on this day
    const dayExpenses = expenses.filter(e => {
      const eDate = new Date(e.date);
      return eDate.getDate() === i && eDate.getMonth() === currentDate.getMonth() && eDate.getFullYear() === currentDate.getFullYear();
    });
    
    const hasExpense = dayExpenses.some(e => e.type === 'expense');
    const hasIncome = dayExpenses.some(e => e.type === 'income');

    days.push(
      <div 
        key={i} 
        onClick={() => setSelectedDate(date)}
        className={`calendar-day ${isSelected ? 'active' : ''}`}
      >
        <span className={`text-sm ${isToday && !isSelected ? 'text-accent font-bold' : ''}`}>{i}</span>
        <div className="transaction-dots">
          {hasExpense && <div className="dot dot-expense"></div>}
          {hasIncome && <div className="dot dot-income"></div>}
        </div>
      </div>
    );
  }

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const dailyTransactions = expenses.filter(e => {
    const eDate = new Date(e.date);
    return eDate.getDate() === selectedDate.getDate() && eDate.getMonth() === selectedDate.getMonth() && eDate.getFullYear() === selectedDate.getFullYear();
  });

  const totalSpent = dailyTransactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalEarned = dailyTransactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="glass-panel calendar-modal-content shadow-neon">
        
        {/* Left Side: Calendar */}
        <div className="calendar-left">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary opacity-5 rounded-full blur-3xl"></div>
          
          <div className="flex justify-between items-center mb-6 relative">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CalendarIcon size={20} className="text-primary" />
              Calendar View
            </h2>
            <button onClick={onClose} className="text-muted hover:text-white md:hidden"><X size={24} /></button>
          </div>

          <div className="flex justify-between items-center mb-4 px-2 relative">
            <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-800 rounded-full text-muted"><ChevronLeft size={20} /></button>
            <span className="font-semibold">{currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}</span>
            <button onClick={handleNextMonth} className="p-1 hover:bg-gray-800 rounded-full text-muted"><ChevronRight size={20} /></button>
          </div>

          <div className="calendar-grid text-muted text-xs font-semibold mb-2 relative">
            <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
          </div>
          <div className="calendar-grid relative">
            {days}
          </div>
        </div>

        {/* Right Side: Daily Breakdown */}
        <div className="calendar-right">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-primary">
              {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric' })}
            </h3>
            <button onClick={onClose} className="hidden md:block text-muted hover:text-white transition-colors"><X size={24} /></button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-900 bg-opacity-50 p-4 rounded-xl border border-gray-800">
              <p className="text-xs text-muted mb-1">Total Spent</p>
              <p className="text-xl font-bold text-danger">{currency}{totalSpent.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-gray-900 bg-opacity-50 p-4 rounded-xl border border-gray-800">
              <p className="text-xs text-muted mb-1">{isBusiness ? 'Total Income' : 'Total Earned'}</p>
              <p className="text-xl font-bold text-success">{currency}{totalEarned.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <h4 className="text-sm font-semibold mb-3 text-muted uppercase tracking-wider">Transactions</h4>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: '300px' }}>
            {dailyTransactions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted opacity-50 py-8 border border-dashed border-gray-800 rounded-xl">
                <p>No transactions on this day</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {dailyTransactions.map(exp => (
                  <div key={exp.id} className="p-3 bg-gray-900 bg-opacity-80 rounded-lg flex justify-between items-center group hover:bg-gray-800 transition-colors border border-gray-800">
                    <div>
                      <p className="font-medium text-sm text-gray-200">{exp.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${exp.type === 'income' ? 'bg-green-900 text-green-300' : 'bg-blue-900 text-blue-300'}`}>
                          {exp.category}
                        </span>
                        {isBusiness && exp.invoiceNumber && <span className="text-[10px] text-gray-400">Inv: {exp.invoiceNumber}</span>}
                      </div>
                    </div>
                    <div className={`font-bold text-sm ${exp.type === 'expense' ? 'text-danger' : 'text-success'}`}>
                      {exp.type === 'expense' ? '-' : '+'}{currency}{exp.amount}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
