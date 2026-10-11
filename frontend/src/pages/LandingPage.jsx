import { useState, useEffect, useRef } from 'react';
import { api } from '../utils/api';
import {
  Shield, Sparkles, UserCheck, MessageSquare, ArrowRight, FileText,
  Send, Ticket, Megaphone, Info, BarChart2, Volume2, ShieldAlert, Gift
} from 'lucide-react';

const Youtube = ({ size = 16, className = '', style = {} }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.387.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.969.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.389-.507a3.007 3.007 0 0 0 2.11-2.11C24 15.969 24 12 24 12s0-3.969-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

function BotTerminal({ onAdminLogin }) {
  const [logs, setLogs] = useState([
    { type: 'system', text: 'KALLU SHAPPU BOT OS v1.0.0 Booting...' },
    { type: 'system', text: 'Initializing Gateway connection...' },
    { type: 'success', text: '[OK] Connected to Discord API Gateway' },
    { type: 'success', text: '[OK] Logged in as KALLU SHAPPU#1507' },
    { type: 'info', text: '[INFO] Syncing commands on 14 servers...' },
    { type: 'info', text: '[INFO] Loaded Shield, Welcome & Ticket modules' }
  ]);
  const [commandInput, setCommandInput] = useState('');
  const consoleEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const logTemplates = [
      { type: 'shield', text: '[SHIELD] Scanned message in #general: OK' },
      { type: 'welcome', text: '[WELCOME] Canvas card generated for member' },
      { type: 'ticket', text: '[TICKETS] Active tickets listener polling...' },
      { type: 'info', text: '[STATUS] Latency: 22ms | CPU: 1.2% | RAM: 184MB' },
      { type: 'shield', text: '[SHIELD] Link filter scanned URL: Safe' },
      { type: 'moderation', text: '[MODERATION] Auto-archived ticket channel' },
      { type: 'gateway', text: '[GATEWAY] Discord heartbeat acknowledged' }
    ];

    const interval = setInterval(() => {
      const randomTemplate = logTemplates[Math.floor(Math.random() * logTemplates.length)];
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLogs(prev => [
        ...prev.slice(-9), // keep last 10 logs
        { type: randomTemplate.type, text: `[${timestamp}] ${randomTemplate.text}` }
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollTop = consoleEndRef.current.scrollHeight;
    }
  }, [logs]);

  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    const cmd = commandInput.trim();
    if (!cmd) return;

    setLogs(prev => [
      ...prev,
      { type: 'input', text: `$ ${cmd}` }
    ]);
    setCommandInput('');

    const cmdLower = cmd.toLowerCase();
    if (cmdLower === 'admin login') {
      setLogs(prev => [
        ...prev,
        { type: 'success', text: 'Opening Admin Portal...' }
      ]);
      setTimeout(() => {
        if (onAdminLogin) onAdminLogin();
      }, 500);
    } else if (cmdLower === 'help') {
      setLogs(prev => [
        ...prev,
        { type: 'system', text: 'Available commands:' },
        { type: 'info', text: '  status      - Display bot system metrics and host info' },
        { type: 'info', text: '  ping        - Test connection latency' },
        { type: 'info', text: '  clear       - Clear terminal console logs' }
      ]);
    } else if (cmdLower === 'status') {
      setLogs(prev => [
        ...prev,
        { type: 'info', text: '--- System Metrics ---' },
        { type: 'success', text: 'Gateway Status: Connected' },
        { type: 'info', text: `Ping: ${Math.floor(Math.random() * 15) + 10}ms` },
        { type: 'info', text: 'CPU Usage: 1.2%' },
        { type: 'info', text: 'RAM Usage: 184.2 MB' },
        { type: 'system', text: 'Uptime: 4 days, 12 hours, 3 minutes' }
      ]);
    } else if (cmdLower === 'ping') {
      setLogs(prev => [
        ...prev,
        { type: 'success', text: `Pong! Latency: ${Math.floor(Math.random() * 15) + 10}ms` }
      ]);
    } else if (cmdLower === 'clear') {
      setLogs([]);
    } else {
      setLogs(prev => [
        ...prev,
        { type: 'moderation', text: `Command not found: ${cmd}. Type "help" for a list of available commands.` }
      ]);
    }
  };

  return (
    <div className="glass-panel" style={{
      fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
      fontSize: '0.85rem',
      backgroundColor: 'rgba(5, 5, 15, 0.85)',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
      textAlign: 'left'
    }}>
      {/* Header bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 14px',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ff5f56', display: 'inline-block' }} />
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ffbd2e', display: 'inline-block' }} />
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#27c93f', display: 'inline-block' }} />
        </div>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '600' }}>kallushappu@bot-status: ~</span>
        <div style={{ width: '30px' }} />
      </div>
      {/* Terminal logs list */}
      <div
        ref={consoleEndRef}
        onClick={handleTerminalClick}
        style={{
          padding: '18px',
          height: '280px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          lineHeight: '1.4',
          cursor: 'text'
        }}
      >
        {logs.map((log, index) => {
          let color = '#dbdee1';
          if (log.type === 'success') color = 'var(--success)';
          if (log.type === 'shield') color = 'var(--secondary)';
          if (log.type === 'welcome') color = 'var(--accent)';
          if (log.type === 'ticket') color = '#eab308'; // gold
          if (log.type === 'system') color = '#93c5fd'; // light blue
          if (log.type === 'moderation') color = 'var(--danger)';
          if (log.type === 'input') color = '#ffffff';
          return (
            <div key={index} style={{ color, wordBreak: 'break-all' }}>
              {log.text}
            </div>
          );
        })}
        {/* Command Input Form */}
        <form onSubmit={handleCommandSubmit} style={{ display: 'flex', alignItems: 'center', color: '#dbdee1', marginTop: '4px' }}>
          <span style={{ color: 'var(--primary)', marginRight: '8px', fontWeight: 'bold' }}>$</span>
          <input
            ref={inputRef}
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            style={{
              flexGrow: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              color: '#dbdee1',
              fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
              fontSize: '0.85rem',
              padding: 0
            }}
            placeholder="Type command (e.g. 'help')..."
            autoFocus
          />
        </form>
      </div>
    </div>
  );
}

export default function LandingPage({ onAdminLogin }) {
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
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px 20px',
      position: 'relative',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <div className="container" style={{
        textAlign: 'center',
        maxWidth: '1850px',
        width: '100%',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>

        <div style={{
          position: 'absolute',
          top: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
          filter: 'blur(50px)',
          zIndex: -1
        }} />

        <div className="hero-layout">
          {/* Left Column: Title & CTA */}
          <div className="hero-left">
            <h1 style={{
              fontSize: 'clamp(3rem, 5.5vw, 4.5rem)',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #ffffff 0%, #3b82f6 40%, #34d399 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: '1.1',
              marginBottom: '14px'
            }}>
              KALLU SHAPPU
            </h1>

            <p style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              maxWidth: '650px',
              marginBottom: '26px',
              lineHeight: '1.6'
            }}>
              Manage Moderation, Welcome Systems, Verification, Tickets, Roles, Broadcast DMs, Announcements, Polls, Giveaways, YouTube alerts, and Temp Voice channels—all from one unified control center.
            </p>

            {error && (
              <div className="glass-panel" style={{
                padding: '10px',
                borderColor: 'var(--danger)',
                backgroundColor: 'rgba(244, 63, 94, 0.05)',
                color: 'var(--danger)',
                width: '100%',
                marginBottom: '16px',
                borderRadius: '8px',
                fontSize: '0.85rem'
              }}>
                {error}
              </div>
            )}

            <div className="hero-buttons-container">
              <button
                onClick={handleLogin}
                disabled={loading}
                className="btn-primary pulse-glow"
                style={{ fontSize: '1rem', height: '48px', padding: '0 28px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', lineHeight: '1' }}
              >
                {loading ? 'Connecting...' : 'Connect Discord Account'}
                <ArrowRight size={18} />
              </button>

              <a
                href="https://discord.gg/ZVfJvw93Ak"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{
                  fontSize: '1rem',
                  height: '48px',
                  padding: '0 28px',
                  borderRadius: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  lineHeight: '1',
                  textDecoration: 'none',
                  borderColor: 'rgba(88, 101, 242, 0.4)',
                  color: 'white',
                  background: 'rgba(88, 101, 242, 0.15)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(88, 101, 242, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(88, 101, 242, 0.6)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(88, 101, 242, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(88, 101, 242, 0.4)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <svg width="18" height="18" viewBox="0 0 127.14 96.36" fill="currentColor">
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C-3.66,42.5-9.84,76.19,10,95.91a105.73,105.73,0,0,0,32,16.29,80.59,80.59,0,0,0,6.83-11.16A68.61,68.61,0,0,1,38.31,95a55.15,55.15,0,0,0,3.75-2.93,74.9,74.9,0,0,0,67.65,0c1.25.93,2.5,1.92,3.75,2.93a68.46,68.46,0,0,1-10.57,6A81,81,0,0,0,109.73,112.2a105.73,105.73,0,0,0,32-16.29C138,76.19,131.79,42.5,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" />
                </svg>
                Join Discord Server
              </a>
            </div>
          </div>

          {/* Right Column: Live Bot Status Console */}
          <div className="hero-right">
            <BotTerminal onAdminLogin={onAdminLogin} />
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginTop: '48px',
          width: '100%',
          textAlign: 'left'
        }}>
          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(244, 63, 94, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--danger)',
              marginBottom: '10px'
            }}>
              <Shield size={16} />
            </div>
            <h3 style={{ marginBottom: '4px', fontSize: '1rem', fontWeight: '700' }}>Moderation</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4' }}>
              Enforce chat safety with auto-moderation rules, warn/mute/kick command shortcuts, and filter bypass systems.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3b82f6',
              marginBottom: '10px'
            }}>
              <Sparkles size={16} />
            </div>
            <h3 style={{ marginBottom: '4px', fontSize: '1rem', fontWeight: '700' }}>Welcome System</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4' }}>
              Configure custom greeting banners, direct message welcome flows, and automatic role assignment on join.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(6, 182, 212, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--secondary)',
              marginBottom: '10px'
            }}>
              <UserCheck size={16} />
            </div>
            <h3 style={{ marginBottom: '4px', fontSize: '1rem', fontWeight: '700' }}>Verification Role</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4' }}>
              Set up secure captcha and button verification to protect your server from bot raids.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              marginBottom: '10px'
            }}>
              <Ticket size={16} />
            </div>
            <h3 style={{ marginBottom: '4px', fontSize: '1rem', fontWeight: '700' }}>Ticket System</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4' }}>
              Manage support requests efficiently with private channel categories and transcript generators.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(236, 72, 153, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent)',
              marginBottom: '10px'
            }}>
              <MessageSquare size={16} />
            </div>
            <h3 style={{ marginBottom: '4px', fontSize: '1rem', fontWeight: '700' }}>Roles & Nicknames</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4' }}>
              Create self-assignable roles, customize join nickname prefixes, and auto-manage permissions.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(14, 165, 233, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--secondary)',
              marginBottom: '10px'
            }}>
              <Send size={16} />
            </div>
            <h3 style={{ marginBottom: '4px', fontSize: '1rem', fontWeight: '700' }}>Broadcast DMs</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4' }}>
              Send customized newsletters, announcements, or warning alerts directly to members' DMs safely.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(251, 191, 36, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--warning)',
              marginBottom: '10px'
            }}>
              <Megaphone size={16} />
            </div>
            <h3 style={{ marginBottom: '4px', fontSize: '1rem', fontWeight: '700' }}>Publish Announcement</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4' }}>
              Schedule and broadcast cross-postable server announcements with embeds and media files.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--danger)',
              marginBottom: '10px'
            }}>
              <ShieldAlert size={16} />
            </div>
            <h3 style={{ marginBottom: '4px', fontSize: '1rem', fontWeight: '700' }}>AntiNuker Protection</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4' }}>
              Defend your server from rogue administrators, webhook abuse, unauthorized bots, and bulk modifications.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--danger)',
              marginBottom: '10px'
            }}>
              <Youtube size={16} />
            </div>
            <h3 style={{ marginBottom: '4px', fontSize: '1rem', fontWeight: '700' }}>YouTube Announcements</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4' }}>
              Automate video alerts on your server with instant notifications when you go live or upload.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(14, 165, 233, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--secondary)',
              marginBottom: '10px'
            }}>
              <Volume2 size={16} />
            </div>
            <h3 style={{ marginBottom: '4px', fontSize: '1rem', fontWeight: '700' }}>Temp Voice Channels</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4' }}>
              Allow members to create temporary, customizable auto-deleting voice hubs on demand.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#a78bfa',
              marginBottom: '10px'
            }}>
              <Gift size={16} />
            </div>
            <h3 style={{ marginBottom: '4px', fontSize: '1rem', fontWeight: '700' }}>Server Giveaways</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4' }}>
              Conduct server giveaways with automatic winner picking, role requirements, live countdowns, and rerolls.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
