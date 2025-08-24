import React, { useState } from 'react';
import "./App.css"
const LandingPage = () => {
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      transition: 'all 0.5s ease',
      backgroundColor: darkMode ? '#000000' : '#ffffff',
      color: darkMode ? '#ffffff' : '#1a1a1a',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    nav: {
      position: 'fixed',
      top: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 50,
      backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(16px)',
      border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
      borderRadius: '9999px',
      padding: '16px 32px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      display: 'flex',
      alignItems: 'center',
      gap: '32px'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    logoIcon: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: darkMode ? '#3b82f6' : '#2563eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    logoText: {
      fontWeight: 'bold',
      fontSize: '18px',
      background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    navLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px'
    },
    navLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      borderRadius: '9999px',
      transition: 'all 0.3s ease',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      textDecoration: 'none',
      color: 'inherit'
    },
    navLinkHover: {
      backgroundColor: darkMode ? '#1f2937' : '#f3f4f6'
    },
    toggleButton: {
      padding: '12px',
      borderRadius: '50%',
      transition: 'all 0.3s ease',
      backgroundColor: darkMode ? '#1f2937' : '#f3f4f6',
      border: 'none',
      cursor: 'pointer',
      color: darkMode ? '#fbbf24' : '#374151'
    },
    main: {
      paddingTop: '128px',
      padding: '128px 24px 0 24px'
    },
    hero: {
      maxWidth: '1152px',
      margin: '0 auto',
      textAlign: 'center'
    },
    heroTitle: {
      fontSize: '96px',
      fontWeight: 'bold',
      marginBottom: '24px',
      background: 'linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      lineHeight: '1'
    },
    heroSubtitle: {
      fontSize: '24px',
      marginBottom: '32px',
      color: darkMode ? '#d1d5db' : '#6b7280'
    },
    cardsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '32px',
      marginBottom: '48px'
    },
    card: {
      padding: '32px',
      borderRadius: '24px',
      border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
      backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.5)' : 'rgba(249, 250, 251, 1)',
      backdropFilter: 'blur(8px)',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    cardHover: {
      transform: 'scale(1.05)',
      borderColor: darkMode ? 'rgba(59, 130, 246, 0.5)' : '#60a5fa'
    },
    cardIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '24px'
    },
    cardIconBg: {
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    cardTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '16px'
    },
    cardText: {
      color: darkMode ? '#9ca3af' : '#6b7280',
      lineHeight: '1.6'
    },
    cta: {
      marginBottom: '64px'
    },
    ctaButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px 32px',
      borderRadius: '9999px',
      background: darkMode 
        ? 'linear-gradient(to right, #2563eb, #7c3aed)' 
        : 'linear-gradient(to right, #3b82f6, #8b5cf6)',
      color: 'white',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      border: 'none',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      textDecoration: 'none'
    },
    ctaButtonHover: {
      transform: 'scale(1.05)'
    },
    footer: {
      margin: '64px auto 0 auto',
      padding: '32px 0',
      textAlign: 'center',
      color: darkMode ? '#9ca3af' : '#6b7280',
      fontSize: '16px',
      borderTop: darkMode ? '1px solid #374151' : '1px solid #e5e7eb'
    },
    backgroundEffects: {
      position: 'fixed',
      inset: 0,
      zIndex: -1,
      overflow: 'hidden'
    },
    bgEffect1: {
      position: 'absolute',
      top: '-160px',
      right: '-160px',
      width: '320px',
      height: '320px',
      borderRadius: '50%',
      backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(96, 165, 250, 0.1)',
      filter: 'blur(48px)'
    },
    bgEffect2: {
      position: 'absolute',
      bottom: '-160px',
      left: '-160px',
      width: '320px',
      height: '320px',
      borderRadius: '50%',
      backgroundColor: darkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(147, 51, 234, 0.1)',
      filter: 'blur(48px)'
    },
    hiddenMobile: {
      display: 'none'
    }
  };

  // Responsive styles
  const mediaQuery = window.matchMedia('(min-width: 768px)');
  if (mediaQuery.matches) {
    styles.hiddenMobile.display = 'flex';
    styles.heroTitle.fontSize = '112px';
  } else {
    styles.heroTitle.fontSize = '48px';
    styles.heroSubtitle.fontSize = '20px';
    styles.cardsGrid.gridTemplateColumns = '1fr';
  }

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>
            <img 
              src="https://img.icons8.com/ios-filled/50/ffffff/wallet--v1.png" 
              alt="Wallet"
              style={{width: '16px', height: '16px'}}
            />
          </div>
          <span style={styles.logoText}>Sei-Sense</span>
        </div>
        <div style={styles.navLinks}>
          <a 
            href="/sei-sense-ai" 
            style={styles.navLink}
            onMouseEnter={(e) => Object.assign(e.target.style, styles.navLinkHover)}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <img 
              src={"https://img.icons8.com/ios-filled/50/4A90E2/artificial-intelligence.png"} 
              alt="AI Brain"
              style={{width: '16px', height: '16px'}}
            />
            <span>Sei-Sense AI</span>
          </a>
        </div>
        <button
          onClick={toggleTheme}
          style={styles.toggleButton}
          onMouseEnter={(e) => e.target.style.backgroundColor = darkMode ? '#374151' : '#e5e7eb'}
          onMouseLeave={(e) => e.target.style.backgroundColor = darkMode ? '#1f2937' : '#f3f4f6'}
        >
          {darkMode ? (
            <img 
              src="https://img.icons8.com/ios-filled/50/FFD700/sun.png" 
              alt="Light Mode"
              style={{width: '20px', height: '20px'}}
            />
          ) : (
            <img 
              src="https://img.icons8.com/ios-filled/50/000000/moon-symbol.png" 
              alt="Dark Mode"
              style={{width: '20px', height: '20px'}}
            />
          )}
        </button>
      </nav>

      {/* Main Content */}
      <div style={styles.main}>
        <div style={styles.hero}>
          <div style={{marginBottom: '32px'}}>
            <h1 style={styles.heroTitle}> Sei-Sense </h1>
            <p style={styles.heroSubtitle}>
              Interact directly with the Sei Blockchain. Unlock insights, analyze smart contracts, and get instant answers with Sei-Sense AI.
            </p>
          </div>

          {/* Feature Card for Sei-Sense AI */}
          <div style={styles.cardsGrid}>
            <div 
              style={styles.card}
              onMouseEnter={(e) => Object.assign(e.target.style, styles.cardHover)}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.borderColor = darkMode ? '#374151' : '#e5e7eb';
              }}
            >
              <div style={styles.cardIcon}>
                <div style={{
                  ...styles.cardIconBg,
                  backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'
                }}>
                  <img 
                    src={darkMode 
                      ? "https://img.icons8.com/ios-filled/50/4A90E2/artificial-intelligence.png"
                      : "https://img.icons8.com/ios-filled/50/2563EB/artificial-intelligence.png"
                    } 
                    alt="AI Brain"
                    style={{width: '32px', height: '32px'}}
                  />
                </div>
              </div>
              <h3 style={styles.cardTitle}>Sei-Sense AI</h3>
              <p style={styles.cardText}>
                Sei-Sense AI is your personal blockchain assistant! 
                <br />
                <br />
                <strong>What can it do?</strong><br />
                • Answer Sei wallet questions<br />
                • Explain contract functions and transactions<br />
                • Give actionable insights and trends in the Sei ecosystem<br />
                <br />
                <strong>Why use Sei-Sense AI?</strong><br />
                • Powered by advanced analytics and real blockchain data<br />
                • Friendly, interactive, and available 24/7<br />
                • Designed for both beginners and power users<br />
                <br />
                <em>Visit the Sei-Sense AI page to chat and get instant answers!</em>
              </p>
              <div style={{marginTop: "24px"}}>
                <a 
                  href="/sei-sense-ai"
                  style={{
                    ...styles.ctaButton, 
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => Object.assign(e.target.style, styles.ctaButtonHover)}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  <img 
                    src="https://img.icons8.com/ios-filled/50/ffffff/artificial-intelligence.png" 
                    alt="AI"
                    style={{width: '20px', height: '20px'}}
                  />
                  <span>Chat with Sei-Sense AI</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <footer style={styles.footer}>
        &copy; {new Date().getFullYear()} Sei-Sense. All rights reserved.
      </footer>

      {/* Background Effects */}
      <div style={styles.backgroundEffects}>
        <div style={styles.bgEffect1}></div>
        <div style={styles.bgEffect2}></div>
      </div>
    </div>
  );
};

export default LandingPage;