import { createContext, useContext, useState, useEffect } from 'react';
import { backupUserData } from '../firebase';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [profile, setProfile] = useState({
    name: '',
    mode: 'student',
    businessName: '',
    monthlyBudget: 10000,
    currency: '₹',
    language: 'English',
    lastBackupDate: null
  });

  const [expenses, setExpenses] = useState([]);
  const [people, setPeople] = useState([]);

  // Initialize from LocalStorage (Mock Auth & Data)
  useEffect(() => {
    const storedUser = localStorage.getItem('expense-auth');
    if (storedUser) setUser(JSON.parse(storedUser));
    
    const storedProfile = localStorage.getItem('expense-profile');
    if (storedProfile) {
      setProfile(prev => ({ ...prev, ...JSON.parse(storedProfile) }));
    }
    
    const storedExpenses = localStorage.getItem('expense-data');
    if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
    
    const storedPeople = localStorage.getItem('expense-people');
    if (storedPeople) setPeople(JSON.parse(storedPeople));
    
    setLoading(false);
  }, []);

  // Save changes to LocalStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('expense-profile', JSON.stringify(profile));
      localStorage.setItem('expense-data', JSON.stringify(expenses));
      localStorage.setItem('expense-people', JSON.stringify(people));
    }
  }, [profile, expenses, people, loading]);

  // Automated Weekly Backup
  useEffect(() => {
    if (!loading && user && profile) {
      const now = new Date();
      const lastBackup = profile.lastBackupDate ? new Date(profile.lastBackupDate) : null;
      
      // If no backup exists, or it's been more than 7 days
      if (!lastBackup || (now - lastBackup) > 7 * 24 * 60 * 60 * 1000) {
        const backupData = { profile, expenses, people };
        backupUserData(user.uid || user.email || 'local_user', backupData).then(success => {
          if (success) {
            setProfile(prev => ({ ...prev, lastBackupDate: now.toISOString() }));
          }
        });
      }
    }
  }, [user, profile, expenses, people, loading]); 

  const login = (email, password) => {
    // Mock login logic
    const mockUser = { uid: Date.now().toString(), email };
    setUser(mockUser);
    localStorage.setItem('expense-auth', JSON.stringify(mockUser));
  };

  const signup = (email, password, profileDetails) => {
    const mockUser = { uid: Date.now().toString(), email };
    setUser(mockUser);
    localStorage.setItem('expense-auth', JSON.stringify(mockUser));
    setProfile(prev => ({ ...prev, ...profileDetails }));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('expense-auth');
  };

  const addExpense = (expense) => {
    setExpenses(prev => [{ ...expense, id: Date.now().toString() }, ...prev]);
  };

  const addPerson = (person) => {
    const newPerson = { ...person, id: Date.now().toString(), balance: 0, transactions: [] };
    setPeople([...people, newPerson]);
  };

  const updatePersonBalance = (id, amount, description = '') => {
    const transaction = {
      id: Date.now().toString(),
      amount: amount,
      description: description,
      date: new Date().toISOString()
    };
    
    setPeople(people.map(p => {
      if (p.id === id) {
        const oldTransactions = p.transactions || [];
        return { 
          ...p, 
          balance: (p.balance || 0) + amount, 
          transactions: [...oldTransactions, transaction] 
        };
      }
      return p;
    }));
  };

  const updateProfile = (newProfile) => {
    setProfile(prev => ({ ...prev, ...newProfile }));
  };

  const val = {
    user,
    loading,
    login,
    signup,
    logout,
    profile,
    updateProfile,
    expenses,
    addExpense,
    people,
    addPerson,
    updatePersonBalance
  };

  return (
    <AppContext.Provider value={val}>
      {!loading && children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  return useContext(AppContext);
};
