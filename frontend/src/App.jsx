import { useState, useEffect, useRef } from 'react';
import LandingPage from './pages/LandingPage';
import GuildSelector from './pages/GuildSelector';
import AdminSelector from './pages/AdminSelector';
import AdminLogin from './pages/AdminLogin';
import { setToken, setUser, getUser, api } from './utils/api';

export default function App() {
  const [user, setCurrentUser] = useState(getUser());
  const [view, setView] = useState(getUser() ? (getUser()?.isAdmin ? 'admin' : 'authorized') : 'landing');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const isExchanging = useRef(false);

  // Global keyboard shortcut listener for Ctrl + Shift + K + L
  useEffect(() => {
    const keysPressed = new Set();

    const handleKeyDown = (e) => {
      const key = e.key ? e.key.toLowerCase() : '';
      keysPressed.add(key);

      const isCtrl = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;
      const hasK = keysPressed.has('k');
      const hasL = keysPressed.has('l');

      if (isCtrl && isShift && hasK && hasL) {
        e.preventDefault();
        if (!e.repeat) {
          const currentUser = getUser();
          if (currentUser && currentUser.isAdmin) {
            setView(prev => prev === 'admin' ? (user ? 'authorized' : 'landing') : 'admin');
          } else {
            setShowAdminLogin(prev => !prev);
          }
        }
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key ? e.key.toLowerCase() : '';
      keysPressed.delete(key);
    };

    const handleBlur = () => {
      keysPressed.clear();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [user]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      if (isExchanging.current) return;
      isExchanging.current = true;

      const exchangeOAuthCode = async () => {
        setAuthLoading(true);
        setAuthError(null);
        try {
          const { token, user: discordUser } = await api.exchangeCode(code);

          setToken(token);
          setUser(discordUser);

          setCurrentUser(discordUser);
          setView('authorized');

          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (err) {
          console.error(err);
          setAuthError('Authentication with Discord failed. Please try again.');
          setView('landing');
        } finally {
          setAuthLoading(false);
          isExchanging.current = false;
        }
      };
      exchangeOAuthCode();
    }
  }, []);

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setCurrentUser(null);
    setView('landing');
  };

  const handleAdminLoginSuccess = (adminUser) => {
    setCurrentUser(adminUser);
    setShowAdminLogin(false);
    setView('admin');
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '20px' }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid rgba(37, 99, 235, 0.1)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <h3 style={{ fontFamily: 'Outfit', fontWeight: '700' }}>Authorizing Account...</h3>
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden', backgroundColor: '#f5f4eb' }}>

      {authError && (
        <div className="glass-panel" style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(244, 63, 94, 0.9)',
          borderColor: 'var(--danger)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          zIndex: 1000
        }}>
          {authError}
          <button
            onClick={() => setAuthError(null)}
            style={{ marginLeft: '12px', background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ×
          </button>
        </div>
      )}

      {/* KeyAuth Admin Login Modal */}
      {showAdminLogin && (
        <AdminLogin
          onBack={() => setShowAdminLogin(false)}
          onLoginSuccess={handleAdminLoginSuccess}
        />
      )}

      {/* Main Views */}
      {view === 'admin' && user && user.isAdmin ? (
        <AdminSelector
          user={user}
          onLogout={handleLogout}
        />
      ) : view === 'authorized' && user ? (
        <GuildSelector
          user={user}
          onLogout={handleLogout}
        />
      ) : (
        <LandingPage />
      )}
    </div>
  );
}
