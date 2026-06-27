import { createContext, useContext, useState, useEffect } from 'react';
import { auth, backupUserData, googleProvider } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  signOut, 
  onAuthStateChanged,
  sendEmailVerification
} from 'firebase/auth';

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

  // Initialize from LocalStorage & Firebase Auth
  useEffect(() => {
    const storedProfile = localStorage.getItem('expense-profile');
    if (storedProfile) {
      setProfile(prev => ({ ...prev, ...JSON.parse(storedProfile) }));
    }
    
    const storedExpenses = localStorage.getItem('expense-data');
    if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
    
    const storedPeople = localStorage.getItem('expense-people');
    if (storedPeople) setPeople(JSON.parse(storedPeople));
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Only set user if their email is verified
      if (currentUser && currentUser.emailVerified) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
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

  const getFriendlyErrorMessage = (error) => {
    const code = error.code || '';
    if (code === 'auth/configuration-not-found' || code === 'auth/operation-not-allowed') {
      return "Firebase Error: Please go to Firebase Console > Authentication > Sign-in method, and enable 'Email/Password'.";
    }
    if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
      return "User not found or email not found";
    }
    if (code === 'auth/wrong-password') {
      return "Incorrect password. Please try again.";
    }
    if (code === 'auth/email-already-in-use') {
      return "This email is already registered. Please log in.";
    }
    if (code === 'auth/invalid-email') {
      return "Please enter a valid email address.";
    }
    if (code === 'auth/weak-password') {
      return "Password should be at least 6 characters.";
    }
    if (code === 'auth/popup-closed-by-user') {
      return "Google sign-in was cancelled.";
    }
    if (code === 'auth/unauthorized-domain') {
      return "Firebase Error: This domain is not authorized for OAuth. Please go to Firebase Console > Authentication > Settings > Authorized Domains and add your Vercel URL.";
    }
    return error.message || "An unexpected error occurred.";
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Create basic profile defaults if signing in for the first time
      if (!profile || !profile.name) {
        setProfile(prev => ({
          ...prev,
          name: result.user.displayName || 'Google User',
          mode: 'student',
          currency: '₹',
          language: 'English'
        }));
      }
      setUser(result.user);
      return { success: true };
    } catch (error) {
      console.error("Google Auth Error:", error);
      return { success: false, error: getFriendlyErrorMessage(error) };
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        return { success: false, error: "Please verify your email address before logging in. Check your inbox!" };
      }
      setUser(userCredential.user);
      return { success: true };
    } catch (error) {
      console.error("Login Error:", error);
      return { success: false, error: getFriendlyErrorMessage(error) };
    }
  };

  const signup = async (email, password, profileDetails) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Send verification email immediately
      await sendEmailVerification(userCredential.user);
      // Sign them out so they are forced to verify
      await signOut(auth);
      setProfile(prev => ({ ...prev, ...profileDetails }));
      // Return a pseudo-error to show the message on the UI
      return { success: false, error: "Account created! We've sent a verification link to your email. Please verify your email before logging in." };
    } catch (error) {
      console.error("Signup Error:", error);
      return { success: false, error: getFriendlyErrorMessage(error) };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout Error", error);
    }
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
    loginWithGoogle,
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
