import { useState } from 'react';
import { api, setToken, setUser } from '../utils/api';
import { getDeviceHWID } from '../utils/hwid';
import { Shield, Key, User, ArrowLeft, AlertTriangle, KeyRound } from 'lucide-react';

export default function AdminLogin({ onBack, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both KeyAuth username and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const clientHwid = getDeviceHWID ? getDeviceHWID() : '';
      const response = await api.keyauthAdminLogin(username, password, clientHwid);

      if (response && response.token) {
        setToken(response.token);
        setUser(response.user);
        onLoginSuccess(response.user);
      } else {
        throw new Error('KeyAuth login succeeded but no token was returned.');
      }
    } catch (err) {
      console.error('[KeyAuth Login Error]:', err);
      setError(err.message || 'KeyAuth authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      zIndex: 99999,
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Background glow effects */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '30%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '440px', width: '100%', position: 'relative', zIndex: 2 }}>
        
        {/* Top Back/Close Button */}
        {onBack && (
          <button 
            onClick={onBack} 
            style={{ 
              marginBottom: '20px', 
              padding: '8px 16px', 
              fontSize: '0.85rem',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
          >
            <ArrowLeft size={16} />
            Close Admin Login
          </button>
        )}

        {/* Login Card */}
        <div style={{ 
          padding: '36px 32px', 
          width: '100%',
          backgroundColor: '#1e293b',
          borderRadius: '20px',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(99, 102, 241, 0.2)',
          color: '#f8fafc'
        }}>
          
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#818cf8',
              margin: '0 auto 16px auto',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)'
            }}>
              <KeyRound size={30} />
            </div>
            
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '20px',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#a5b4fc',
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '10px'
            }}>
              <Shield size={12} /> KeyAuth Secured
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '6px', color: '#ffffff' }}>
              Admin Panel Login
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
              Enter your KeyAuth username &amp; password to access Admin Control.
            </p>
          </div>

          {error && (
            <div style={{
              padding: '12px 16px',
              border: '1px solid #f43f5e',
              backgroundColor: 'rgba(244, 63, 94, 0.1)',
              color: '#fb7185',
              borderRadius: '10px',
              marginBottom: '20px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <AlertTriangle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Username field */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: '600' }}>
                KeyAuth Username
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input 
                  type="text" 
                  placeholder="Enter KeyAuth username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 44px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: '600' }}>
                KeyAuth Password
              </label>
              <div style={{ position: 'relative' }}>
                <Key size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input 
                  type="password" 
                  placeholder="Enter KeyAuth password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 44px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>
            </div>

            {/* Submit button */}
            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                marginTop: '10px',
                backgroundColor: '#6366f1',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                opacity: loading ? 0.7 : 1,
                transition: 'background 0.2s, transform 0.1s'
              }}
            >
              {loading ? 'Verifying KeyAuth Credentials...' : 'Authenticate & Enter Admin Panel'}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
