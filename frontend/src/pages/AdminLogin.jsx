import { useState } from 'react';
import { api, setToken, setUser } from '../utils/api';
import { getDeviceHWID } from '../utils/hwid';
import { Shield, Key, User, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function AdminLogin({ onBack, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const clientHwid = getDeviceHWID();
      const { token, user: adminUser } = await api.adminLogin(username, password, clientHwid);
      setToken(token);
      setUser(adminUser);
      onLoginSuccess(adminUser);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background glow effects */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '30%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
        filter: 'blur(60px)',
        zIndex: -1
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '30%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)',
        filter: 'blur(60px)',
        zIndex: -1
      }} />

      <div className="container" style={{ maxWidth: '440px', width: '100%', zIndex: 2 }}>
        
        {/* Back Button */}
        <button 
          onClick={onBack} 
          className="btn-secondary" 
          style={{ 
            alignSelf: 'flex-start', 
            marginBottom: '24px', 
            padding: '8px 16px', 
            fontSize: '0.85rem',
            border: 'none',
            background: 'rgba(255,255,255,0.02)'
          }}
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        {/* Login Card */}
        <div className="glass-panel pulse-glow" style={{ 
          padding: '40px 32px', 
          width: '100%',
          borderColor: 'rgba(99, 102, 241, 0.3)',
          boxShadow: '0 8px 32px 0 rgba(99, 102, 241, 0.15)'
        }}>
          
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              margin: '0 auto 16px auto',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.2)'
            }}>
              <Shield size={32} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.02em' }}>Admin Portal</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Enter credentials to configure connected servers.</p>
          </div>

          {error && (
            <div className="glass-panel" style={{
              padding: '12px 16px',
              borderColor: 'var(--danger)',
              backgroundColor: 'rgba(244, 63, 94, 0.05)',
              color: 'var(--danger)',
              borderRadius: '8px',
              marginBottom: '24px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Username field */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '500' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="glass-input"
                  style={{ paddingLeft: '44px' }}
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '500' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Key size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input"
                  style={{ paddingLeft: '44px' }}
                  required
                />
              </div>
            </div>

            {/* Submit button */}
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center', marginTop: '10px', padding: '14px' }}
            >
              {loading ? 'Authenticating...' : 'Sign In as Admin'}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
