import { useState, useEffect } from 'react';
import { Apple, QrCode } from 'lucide-react';

export default function Landing({ onLaunch }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("Installation is not supported or the app is already installed.");
      return;
    }
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#0a0a0a',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Outfit', sans-serif"
    }}>
      
      {/* Top Navbar for "Launch Web App" */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        padding: '2rem',
        zIndex: 50
      }}>
        <button 
          onClick={onLaunch}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#a1a1aa',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'color 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = 'white'}
          onMouseOut={(e) => e.currentTarget.style.color = '#a1a1aa'}
        >
          Log In / Launch Web App
        </button>
      </div>

      {/* Sharp Diagonal Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#141414',
        clipPath: 'polygon(55% 0, 100% 0, 100% 100%, 35% 100%)',
        zIndex: 0
      }}></div>

      {/* Main Content Container */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '0 2rem'
      }}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          width: '100%',
          gap: '2rem'
        }}>
          
          {/* Left Column: Text & CTA */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '3rem 0'
          }}>
            
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '4rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20" />
                <path d="M12 8c2.5 0 4.5-2 4.5-4.5S14.5 2 12 2" />
                <path d="M12 22c-2.5 0-4.5-2-4.5-4.5S9.5 13 12 13" />
              </svg>
              <span style={{ fontSize: '0.875rem', letterSpacing: '0.2em', color: '#d1d5db', textTransform: 'uppercase' }}>
                Expensr
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: 'min(4rem, 10vw)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              marginBottom: '1.5rem',
              margin: '0 0 1.5rem 0'
            }}>
              <span style={{ display: 'block', color: 'white', marginBottom: '0.5rem' }}>Download the</span>
              <span style={{ display: 'block', color: '#d9b775' }}>Expensr Copilot™</span>
            </h1>
            
            {/* Subtext */}
            <p style={{
              fontSize: '1rem',
              color: '#a1a1aa',
              maxWidth: '400px',
              marginBottom: '3rem',
              lineHeight: 1.6
            }}>
              Get our AI-powered mobile app to access intelligent tracking features, stay in the know about ledgers, and more. Available for iOS.
            </p>

            {/* Buttons & QR */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'flex-start' }}>
              
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {/* Install PWA Button */}
                <button 
                  onClick={handleInstallClick} 
                  style={{
                    backgroundColor: 'white',
                    color: 'black',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <Apple size={28} color="black" fill="black" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '2px', color: '#374151' }}>
                      {isInstallable ? 'FAST & SECURE' : 'ADD TO HOMESCREEN'}
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em' }}>
                      Install App
                    </div>
                  </div>
                </button>

                {/* Download APK Button */}
                <a 
                  href="/Expensr.apk" 
                  download="Expensr.apk"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    border: '1px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                >
                  {/* Android SVG Icon */}
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993s-.4482.9997-.9993.9997zm-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5515 0 .9997.4482.9997.9993s-.4482.9997-.9997.9997zm11.4045-6.02l1.9973-3.4592c.1118-.1946.0462-.444-.1481-.5558-.1946-.1118-.444-.0462-.5558.1481l-2.0415 3.536c-1.4055-.6363-2.9831-1.002-4.6644-1.002s-3.2589.3657-4.6644 1.002l-2.0415-3.536c-.1118-.1943-.3612-.2599-.5558-.1481-.1943.1118-.2599.3612-.1481.5558l1.9973 3.4592C4.1624 10.3705 2.1466 12.8718 2 15.8601h20c-.1466-2.9883-2.1624-5.4896-5.0725-6.5387z" />
                  </svg>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '2px', color: '#a1a1aa' }}>
                      DIRECT DOWNLOAD
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em' }}>
                      Download APK
                    </div>
                  </div>
                </a>
              </div>

              {/* QR Code */}
              <div style={{
                backgroundColor: 'white',
                padding: '0.75rem',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '4px solid #0a0a0a',
                boxShadow: '0 10px 15px rgba(0,0,0,0.2)'
              }}>
                <QrCode size={90} color="black" strokeWidth={1.2} />
              </div>

            </div>

            <div style={{ marginTop: '5rem', fontSize: '11px', color: '#71717a' }}>
              © Copyright 2026 Expensr Inc. — All rights reserved.
            </div>
          </div>

          {/* Right Column: Phone Mockup */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <img 
              src="/mockup.png" 
              alt="Expensr App Screen" 
              style={{
                width: '100%',
                maxWidth: '400px',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: '40px',
                filter: 'drop-shadow(0 25px 25px rgba(0,0,0,0.5))',
                transform: 'translateX(5%)'
              }}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
