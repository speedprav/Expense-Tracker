import { useState, useEffect } from 'react';
import { Download, ArrowRight, PieChart, Shield, Cloud, Layout, CheckCircle } from 'lucide-react';

export default function Landing({ onLaunch }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("Installation is not supported or the app is already installed.");
      return;
    }
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // Optionally, send analytics event with outcome of user choice
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary opacity-20 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent opacity-20 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Navbar */}
      <header className="w-full p-6 flex justify-between items-center z-10 border-b border-gray-800 bg-background bg-opacity-80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white shadow-neon">
            E
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Expensr</span>
        </div>
        <button onClick={onLaunch} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
          Sign In
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-20 pb-32 z-10">
        <div className="inline-block mb-4 px-3 py-1 rounded-full border border-gray-700 bg-gray-800 bg-opacity-50 text-xs font-medium text-primary shadow-sm animate-fade-down">
          v2.0 is now live! ✨
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl animate-fade-up" style={{ animationDelay: '0.1s' }}>
          Master your money with <br className="hidden md:block"/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            intelligent tracking.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          The premium financial dashboard for students and businesses. Track expenses, manage shared debts, and generate beautiful PDF reports automatically.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-up" style={{ animationDelay: '0.3s' }}>
          {isInstallable ? (
            <button 
              onClick={handleInstallClick} 
              className="btn btn-primary shadow-neon py-4 px-8 text-lg flex items-center justify-center gap-2"
            >
              <Download size={20} /> Install App
            </button>
          ) : (
            <button 
              onClick={() => alert("To install, open this page in Chrome/Safari, tap the Share/Menu button, and select 'Add to Home Screen'.")} 
              className="btn bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 py-4 px-8 text-lg flex items-center justify-center gap-2"
            >
              <Download size={20} /> Download App
            </button>
          )}
          
          <button 
            onClick={onLaunch} 
            className="btn btn-outline py-4 px-8 text-lg flex items-center justify-center gap-2 group"
          >
            Launch Web App <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </main>

      {/* Features Grid */}
      <section className="bg-gray-900 border-t border-gray-800 py-24 px-4 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Everything you need to succeed</h2>
            <p className="text-gray-400">Enterprise-grade tools packaged in a beautiful, simple interface.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<PieChart className="text-primary" size={24} />}
              title="Advanced Analytics"
              description="Visualize your spending patterns with beautiful, interactive charts and identify where your money goes."
            />
            <FeatureCard 
              icon={<Users className="text-accent" size={24} />}
              title="Smart Debt Ledger"
              description="Keep track of exactly who owes you money, and who you owe, with automated net-balance calculations."
            />
            <FeatureCard 
              icon={<Cloud className="text-success" size={24} />}
              title="Automated Cloud Sync"
              description="Never lose your data. We automatically back up your entire encrypted ledger to the cloud every week."
            />
            <FeatureCard 
              icon={<Shield className="text-warning" size={24} />}
              title="100% Private"
              description="Your financial data is secured locally by default. You are in complete control of your privacy."
            />
            <FeatureCard 
              icon={<Layout className="text-pink-500" size={24} />}
              title="Beautiful PDF Reports"
              description="Generate stunning Weekly, Monthly, and Yearly financial reports with a single click."
            />
            <FeatureCard 
              icon={<CheckCircle className="text-cyan-400" size={24} />}
              title="Works Offline"
              description="Because it's a Progressive Web App, you can log expenses even when you have no internet connection."
            />
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 border-t border-gray-800 z-10">
        <p>© 2026 Expensr App. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="glass-panel p-8 hover:-translate-y-1 transition-transform duration-300">
      <div className="w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center mb-6 shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function Users(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
}
