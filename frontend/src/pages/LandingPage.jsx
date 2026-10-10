import { useState } from 'react';
import { api } from '../utils/api';
import { Lock } from 'lucide-react';

export default function LandingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { url } = await api.getDiscordAuthUrl();
      window.location.href = url;
    } catch (err) {
      console.error(err);
      setError('Failed to contact the backend server. Make sure it is running.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f4eb',
      color: '#1f2937',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '24px 20px 40px 20px',
      fontFamily: "'Inter', sans-serif",
      boxSizing: 'border-box'
    }}>
      {/* Top Navigation Bar */}
      <header style={{
        maxWidth: '900px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        marginBottom: '48px'
      }}>
        {/* Header Left Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#15803d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem'
          }}>
            🌴
          </div>
          <span style={{
            fontSize: '1.4rem',
            fontWeight: '800',
            color: '#15803d',
            fontFamily: "'Outfit', 'Noto Sans Malayalam', sans-serif"
          }}>
            കള്ള് ഷാപ്പ്
          </span>
        </div>

        {/* Header Right Action (Only Connect Discord - Bot Dashboard and Admin Portal options removed) */}
        <div>
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              backgroundColor: '#5865F2',
              color: '#ffffff',
              border: 'none',
              padding: '10px 22px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(88, 101, 242, 0.25)',
              transition: 'all 0.2s ease'
            }}
          >
            Connect Discord
          </button>
        </div>
      </header>

      {/* Main Center Content */}
      <main style={{
        maxWidth: '750px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        flex: 1,
        justifyContent: 'center'
      }}>

        {/* Palm Tree Circular Icon */}
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          backgroundColor: '#dcfce7',
          border: '3px solid #16a34a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3rem',
          marginBottom: '20px',
          boxShadow: '0 10px 25px rgba(22, 163, 74, 0.15)'
        }}>
          🌴
        </div>

        {/* Malayalam Main Heading */}
        <h1 style={{
          fontSize: 'clamp(2.8rem, 6vw, 4.2rem)',
          fontWeight: '900',
          color: '#15803d',
          marginBottom: '32px',
          fontFamily: "'Outfit', 'Noto Sans Malayalam', sans-serif",
          letterSpacing: '-0.02em',
          lineHeight: '1.1'
        }}>
          കള്ള് ഷാപ്പ്
        </h1>

        {error && (
          <div style={{
            padding: '12px 20px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fca5a5',
            color: '#dc2626',
            borderRadius: '10px',
            marginBottom: '24px',
            fontSize: '0.9rem',
            maxWidth: '500px'
          }}>
            {error}
          </div>
        )}

        {/* Main Connect Discord Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            backgroundColor: '#5865F2',
            color: '#ffffff',
            border: 'none',
            padding: '16px 36px',
            borderRadius: '14px',
            fontSize: '1.1rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 8px 24px rgba(88, 101, 242, 0.35)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            marginBottom: '20px'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <svg width="24" height="18" viewBox="0 0 127.14 96.36" fill="currentColor">
            <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.19-16.14c2.64-27.38-4.51-51.11-18.91-72.15ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.92,53.89,53C53.89,60,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5.07-12.74,11.44-12.74S96.23,45.92,96.12,53C96.12,60,91.08,65.69,84.69,65.69Z" />
          </svg>
          <span>{loading ? 'Connecting to Discord...' : 'Connect with Discord'}</span>
        </button>

        {/* Security Note */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#6b7280',
          fontSize: '0.85rem'
        }}>
          <Lock size={14} />
          <span>Secure OAuth2 Authentication with Discord</span>
        </div>

      </main>

      {/* Footer */}
      <footer style={{
        marginTop: '60px',
        color: '#6b7280',
        fontSize: '0.85rem',
        textAlign: 'center'
      }}>
        © 2026 <strong>കള്ള് ഷാപ്പ്</strong> Discord Bot. All rights reserved.
      </footer>
    </div>
  );
}

