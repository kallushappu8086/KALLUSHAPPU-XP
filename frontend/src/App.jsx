import { useState, useEffect, useRef } from 'react';
import LandingPage from './pages/LandingPage';
import GuildSelector from './pages/GuildSelector';
import Dashboard from './pages/Dashboard';
import AdminLogin from './pages/AdminLogin';
import AdminSelector from './pages/AdminSelector';
import { setToken, setUser, getUser, api } from './utils/api';

export default function App() {
  const [user, setCurrentUser] = useState(getUser());
  const [view, setView] = useState(user ? (user.isAdmin ? 'admin-selector' : 'selector') : 'landing');
  const [activeGuild, setActiveGuild] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const isExchanging = useRef(false);

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
          setView('selector');

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

  const handleSelectGuild = (guildId, guildName, guildIcon, memberCount, ownerId) => {
    setActiveGuild({ id: guildId, name: guildName, icon: guildIcon, memberCount, ownerId });
    setView('dashboard');
  };

  const handleBackToSelector = () => {
    setActiveGuild(null);
    setView(user?.isAdmin ? 'admin-selector' : 'selector');
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setCurrentUser(null);
    setActiveGuild(null);
    setView('landing');
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
        <h3 style={{ fontFamily: 'Outfit', fontWeight: '700' }}>Authenticating with Discord...</h3>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      {/* Background Liquid Blobs */}
      <div className="liquid-blob-1" />
      <div className="liquid-blob-2" />
      
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

      {view === 'landing' && (
        <LandingPage onAdminLogin={() => setView('admin-login')} />
      )}
      
      {view === 'admin-login' && (
        <AdminLogin 
          onBack={() => setView('landing')}
          onLoginSuccess={(adminUser) => {
            setCurrentUser(adminUser);
            setView('admin-selector');
          }}
        />
      )}

      {view === 'admin-selector' && user && (
        <AdminSelector 
          user={user}
          onSelectGuild={handleSelectGuild}
          onLogout={handleLogout}
        />
      )}

      {view === 'selector' && (
        <GuildSelector 
          user={user} 
          onSelectGuild={handleSelectGuild} 
          onLogout={handleLogout} 
        />
      )}
      
      {view === 'dashboard' && activeGuild && (
        <Dashboard 
          guildId={activeGuild.id} 
          guildName={activeGuild.name} 
          guildIcon={activeGuild.icon} 
          memberCount={activeGuild.memberCount}
          guildOwnerId={activeGuild.ownerId}
          onBack={handleBackToSelector} 
          user={user}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
