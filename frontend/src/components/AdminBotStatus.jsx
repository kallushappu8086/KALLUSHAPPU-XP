import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import {
  Settings, Server, Users, ShieldCheck, RefreshCw,
  ExternalLink, CheckCircle2, AlertTriangle, Loader2,
  Layers, Radio, Sparkles
} from 'lucide-react';

export default function AdminBotStatus({ user, onNavigateServers, onNavigateUsers }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Bot Status Form State
  const [status, setStatus] = useState('online'); // 'online' | 'idle' | 'dnd' | 'invisible'
  const [activityType, setActivityType] = useState(5); // 0: Playing, 1: Streaming, 2: Listening, 3: Watching, 4: Custom, 5: Competing
  const [activityText, setActivityText] = useState('Nothing');

  // Bot Client & Stats State
  const [botUser, setBotUser] = useState({
    username: 'Kallu Shappu',
    tag: 'Kallu Shappu#4276',
    avatar: null
  });
  const [stats, setStats] = useState({
    guildsCount: 3,
    usersCount: 32,
    channelsCount: 109,
    memberReach: 35,
    authorizedCount: 2
  });

  useEffect(() => {
    fetchBotSettings();
  }, []);

  const fetchBotSettings = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await api.getBotSettings();
      if (data) {
        if (data.settings) {
          setStatus(data.settings.status || 'online');
          setActivityType(data.settings.activityType !== undefined ? data.settings.activityType : 5);
          setActivityText(data.settings.activityText !== undefined ? data.settings.activityText : 'Nothing');
        }
        if (data.botUser) {
          setBotUser({
            username: data.botUser.username || 'Kallu Shappu',
            tag: data.botUser.tag || 'Kallu Shappu#4276',
            avatar: data.botUser.avatar || null
          });
        }
        if (data.stats) {
          setStats({
            guildsCount: data.stats.guildsCount ?? 3,
            usersCount: data.stats.usersCount ?? 32,
            channelsCount: data.stats.channelsCount ?? 109,
            memberReach: data.stats.memberReach ?? 35,
            authorizedCount: data.stats.authorizedCount ?? 2
          });
        }
      }
    } catch (err) {
      console.error('Failed to load bot settings:', err);
      setErrorMsg('Failed to load bot settings: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleApplyStatus = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await api.saveBotSettings({
        status,
        activityType: Number(activityType),
        activityText: activityText.trim()
      });

      setSuccessMsg('Bot status & presence updated successfully in real-time!');
      if (response && response.stats) {
        setStats(prev => ({ ...prev, ...response.stats }));
      }
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Failed to update bot status:', err);
      setErrorMsg('Failed to apply status: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const getActivityTypeLabel = (type) => {
    switch (Number(type)) {
      case 0: return 'PLAYING A GAME';
      case 1: return 'STREAMING';
      case 2: return 'LISTENING TO';
      case 3: return 'WATCHING';
      case 4: return 'CUSTOM STATUS';
      case 5: return 'COMPETING IN';
      default: return 'ACTIVITY';
    }
  };

  const getStatusColor = (s) => {
    switch (s) {
      case 'online': return '#22c55e';
      case 'idle': return '#f59e0b';
      case 'dnd': return '#ef4444';
      case 'invisible': return '#94a3b8';
      default: return '#22c55e';
    }
  };

  return (
    <div className="admin-bot-status-container">
      <style dangerouslySetInnerHTML={{
        __html: `
        .admin-bot-status-grid {
          display: grid;
          grid-template-columns: 270px 1fr 340px;
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 1200px) {
          .admin-bot-status-grid {
            grid-template-columns: 260px 1fr;
          }
          .admin-bot-status-grid > div:last-child {
            grid-column: span 2;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
        }
        @media (max-width: 800px) {
          .admin-bot-status-grid {
            grid-template-columns: 1fr;
          }
          .admin-bot-status-grid > div:last-child {
            grid-column: span 1;
            grid-template-columns: 1fr;
          }
        }
        .status-option-card:hover {
          transform: translateY(-2px);
          border-color: rgba(14, 165, 233, 0.4) !important;
        }
        .apply-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }
      `}} />

      <div className="admin-bot-status-grid">

        {/* LEFT COLUMN: Admin Overview Sidebar */}
        <div style={{
          backgroundColor: '#0c1322',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
        }}>
          {/* Admin Panel Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(14, 165, 233, 0.12)',
              border: '1px solid rgba(14, 165, 233, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
              flexShrink: 0
            }}>
              <Layers size={24} />
            </div>
            <div>
              <h3 style={{
                margin: 0,
                fontSize: '1.15rem',
                fontWeight: '800',
                color: '#ffffff',
                letterSpacing: '-0.01em'
              }}>
                Admin Panel
              </h3>
              <span style={{
                fontSize: '0.78rem',
                color: '#94a3b8',
                fontWeight: '500'
              }}>
                System Settings Overview
              </span>
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.06)' }} />

          {/* Global Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: '800',
              color: '#64748b',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}>
              Global Stats
            </span>

            {/* Active Guilds */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '12px',
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8'
              }}>
                <Server size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Active Guilds
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', lineHeight: '1.2' }}>
                  {stats.guildsCount}
                </div>
              </div>
            </div>

            {/* Member Reach */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '12px',
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#34d399'
              }}>
                <Users size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Member Reach
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', lineHeight: '1.2' }}>
                  {stats.memberReach}
                </div>
              </div>
            </div>

            {/* Authorized Users */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '12px',
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'rgba(129, 140, 248, 0.12)',
                border: '1px solid rgba(129, 140, 248, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#818cf8'
              }}>
                <ShieldCheck size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Authorized
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', lineHeight: '1.2' }}>
                  {stats.authorizedCount}
                </div>
              </div>
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.06)' }} />

          {/* Quick Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: '800',
              color: '#64748b',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}>
              Quick Actions
            </span>

            <button
              onClick={fetchBotSettings}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '11px 14px',
                borderRadius: '10px',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#cbd5e1',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <RefreshCw size={15} className={loading ? 'spin' : ''} style={{ color: '#38bdf8' }} />
              <span>Refresh Data</span>
            </button>

            <a
              href="https://discord.gg"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 14px',
                borderRadius: '10px',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#cbd5e1',
                fontSize: '0.85rem',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Radio size={15} style={{ color: '#818cf8' }} />
                <span>Support Discord</span>
              </div>
              <ExternalLink size={13} style={{ color: '#64748b' }} />
            </a>
          </div>
        </div>

        {/* MIDDLE COLUMN: Bot Status Manager */}
        <div style={{
          backgroundColor: '#0c1322',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Settings size={22} style={{ color: '#38bdf8' }} />
            <h2 style={{
              margin: 0,
              fontSize: '1.35rem',
              fontWeight: '800',
              color: '#ffffff',
              letterSpacing: '-0.01em'
            }}>
              Bot Status Manager
            </h2>
          </div>

          {/* Feedback Messages */}
          {successMsg && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '10px',
              color: '#34d399',
              fontSize: '0.86rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={17} />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '10px',
              color: '#f87171',
              fontSize: '0.86rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertTriangle size={17} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: DISCORD STATUS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{
              fontSize: '0.74rem',
              fontWeight: '800',
              color: '#94a3b8',
              letterSpacing: '0.06em',
              textTransform: 'uppercase'
            }}>
              Discord Status
            </label>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              {/* Online */}
              <div
                className="status-option-card"
                onClick={() => setStatus('online')}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  backgroundColor: status === 'online' ? 'rgba(14, 165, 233, 0.12)' : 'rgba(15, 23, 42, 0.7)',
                  border: status === 'online' ? '1.5px solid #0ea5e9' : '1px solid rgba(255, 255, 255, 0.07)',
                  boxShadow: status === 'online' ? '0 0 16px rgba(14, 165, 233, 0.25)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#22c55e',
                  boxShadow: '0 0 8px rgba(34, 197, 94, 0.8)',
                  marginTop: '4px',
                  flexShrink: 0
                }} />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#ffffff' }}>Online</div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>Active and responsive</div>
                </div>
              </div>

              {/* Idle */}
              <div
                className="status-option-card"
                onClick={() => setStatus('idle')}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  backgroundColor: status === 'idle' ? 'rgba(14, 165, 233, 0.12)' : 'rgba(15, 23, 42, 0.7)',
                  border: status === 'idle' ? '1.5px solid #0ea5e9' : '1px solid rgba(255, 255, 255, 0.07)',
                  boxShadow: status === 'idle' ? '0 0 16px rgba(14, 165, 233, 0.25)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#f59e0b',
                  boxShadow: '0 0 8px rgba(245, 158, 11, 0.8)',
                  marginTop: '4px',
                  flexShrink: 0
                }} />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#ffffff' }}>Idle</div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>Away / Inactive</div>
                </div>
              </div>

              {/* Do Not Disturb */}
              <div
                className="status-option-card"
                onClick={() => setStatus('dnd')}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  backgroundColor: status === 'dnd' ? 'rgba(14, 165, 233, 0.12)' : 'rgba(15, 23, 42, 0.7)',
                  border: status === 'dnd' ? '1.5px solid #0ea5e9' : '1px solid rgba(255, 255, 255, 0.07)',
                  boxShadow: status === 'dnd' ? '0 0 16px rgba(14, 165, 233, 0.25)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#ef4444',
                  boxShadow: '0 0 8px rgba(239, 68, 68, 0.8)',
                  marginTop: '4px',
                  flexShrink: 0
                }} />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#ffffff' }}>Do Not Disturb</div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>Quiet Mode</div>
                </div>
              </div>

              {/* Invisible */}
              <div
                className="status-option-card"
                onClick={() => setStatus('invisible')}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  backgroundColor: status === 'invisible' ? 'rgba(14, 165, 233, 0.12)' : 'rgba(15, 23, 42, 0.7)',
                  border: status === 'invisible' ? '1.5px solid #0ea5e9' : '1px solid rgba(255, 255, 255, 0.07)',
                  boxShadow: status === 'invisible' ? '0 0 16px rgba(14, 165, 233, 0.25)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#94a3b8',
                  boxShadow: '0 0 6px rgba(148, 163, 184, 0.5)',
                  marginTop: '4px',
                  flexShrink: 0
                }} />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#ffffff' }}>Invisible</div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>Appear offline</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: ACTIVITY TYPE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{
              fontSize: '0.74rem',
              fontWeight: '800',
              color: '#94a3b8',
              letterSpacing: '0.06em',
              textTransform: 'uppercase'
            }}>
              Activity Type
            </label>
            <select
              value={activityType}
              onChange={(e) => setActivityType(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#090f1d',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                color: '#f8fafc',
                fontSize: '0.9rem',
                fontWeight: '600',
                outline: 'none',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              <option value={5}>Competing in</option>
              <option value={0}>Playing</option>
              <option value={1}>Streaming</option>
              <option value={2}>Listening to</option>
              <option value={3}>Watching</option>
              <option value={4}>Custom Status</option>
            </select>
          </div>

          {/* Section 3: ACTIVITY NAME */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{
              fontSize: '0.74rem',
              fontWeight: '800',
              color: '#94a3b8',
              letterSpacing: '0.06em',
              textTransform: 'uppercase'
            }}>
              Activity Name
            </label>
            <input
              type="text"
              placeholder="e.g. Minecraft, Spotify, etc."
              value={activityText}
              onChange={(e) => setActivityText(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#090f1d',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                color: '#f8fafc',
                fontSize: '0.9rem',
                fontWeight: '500',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Apply Status Button */}
          <div>
            <button
              className="apply-btn"
              onClick={handleApplyStatus}
              disabled={saving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 50%, #10b981 100%)',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.92rem',
                fontWeight: '700',
                cursor: saving ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 16px rgba(6, 182, 212, 0.35)',
                transition: 'all 0.15s ease'
              }}
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="spin" />
                  <span>Applying...</span>
                </>
              ) : (
                <>
                  <Settings size={16} />
                  <span>Apply Status</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Discord Live Preview & Bot Client Statistics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Card 1: DISCORD LIVE PREVIEW */}
          <div style={{
            backgroundColor: '#0c1322',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '20px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              fontSize: '0.72rem',
              fontWeight: '800',
              color: '#64748b',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '14px'
            }}>
              Discord Live Preview
            </div>

            {/* Discord Card Simulation */}
            <div style={{
              backgroundColor: '#111214',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              {/* Discord Banner */}
              <div style={{
                height: '62px',
                background: 'linear-gradient(135deg, #5865F2 0%, #4752c4 100%)'
              }} />

              {/* Avatar & Info */}
              <div style={{ padding: '0 16px 16px 16px', position: 'relative' }}>
                <div style={{
                  position: 'relative',
                  marginTop: '-28px',
                  width: '56px',
                  height: '56px',
                  display: 'inline-block'
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    border: '4px solid #111214',
                    backgroundColor: '#1e1f22',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    boxSizing: 'border-box'
                  }}>
                    {botUser.avatar ? (
                      <img
                        src={botUser.avatar}
                        alt={botUser.username}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '🤖';
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: '26px' }}>🤖</span>
                    )}
                  </div>

                  {/* Status Indicator Badge */}
                  <div style={{
                    position: 'absolute',
                    bottom: '0px',
                    right: '0px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: getStatusColor(status),
                    border: '3px solid #111214',
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {status === 'dnd' && (
                      <div style={{ width: '6px', height: '2px', backgroundColor: '#ffffff', borderRadius: '1px' }} />
                    )}
                    {status === 'invisible' && (
                      <div style={{ width: '4px', height: '4px', backgroundColor: '#111214', borderRadius: '50%' }} />
                    )}
                  </div>
                </div>

                {/* User Names & Bot Badge */}
                <div style={{ marginTop: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontWeight: '800',
                      fontSize: '1.05rem',
                      color: '#f2f3f5'
                    }}>
                      {botUser.username}
                    </span>
                    <span style={{
                      backgroundColor: '#5865F2',
                      color: '#ffffff',
                      fontSize: '0.62rem',
                      fontWeight: '800',
                      padding: '2px 5px',
                      borderRadius: '4px',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase'
                    }}>
                      BOT
                    </span>
                  </div>
                  <div style={{
                    fontSize: '0.78rem',
                    color: '#949ba4',
                    marginTop: '1px'
                  }}>
                    {botUser.tag}
                  </div>
                </div>

                <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)', margin: '14px 0' }} />

                {/* Activity Section */}
                <div>
                  <div style={{
                    fontSize: '0.68rem',
                    fontWeight: '800',
                    color: '#b5bac1',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}>
                    {getActivityTypeLabel(activityType)}
                  </div>
                  <div style={{
                    fontSize: '0.86rem',
                    fontWeight: '600',
                    color: '#dbdee1',
                    marginTop: '3px',
                    wordBreak: 'break-word'
                  }}>
                    {activityText.trim() ? activityText : 'Nothing'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: BOT CLIENT STATISTICS */}
          <div style={{
            backgroundColor: '#0c1322',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '20px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              fontSize: '0.72rem',
              fontWeight: '800',
              color: '#64748b',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '16px'
            }}>
              Bot Client Statistics
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px'
            }}>
              {/* Servers */}
              <div style={{
                textAlign: 'center',
                padding: '12px 6px',
                borderRadius: '10px',
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div style={{
                  fontSize: '1.45rem',
                  fontWeight: '800',
                  color: '#38bdf8',
                  lineHeight: '1.2'
                }}>
                  {stats.guildsCount}
                </div>
                <div style={{
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  color: '#64748b',
                  marginTop: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Servers
                </div>
              </div>

              {/* Channels */}
              <div style={{
                textAlign: 'center',
                padding: '12px 6px',
                borderRadius: '10px',
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div style={{
                  fontSize: '1.45rem',
                  fontWeight: '800',
                  color: '#38bdf8',
                  lineHeight: '1.2'
                }}>
                  {stats.channelsCount}
                </div>
                <div style={{
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  color: '#64748b',
                  marginTop: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Channels
                </div>
              </div>

              {/* Users */}
              <div style={{
                textAlign: 'center',
                padding: '12px 6px',
                borderRadius: '10px',
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div style={{
                  fontSize: '1.45rem',
                  fontWeight: '800',
                  color: '#38bdf8',
                  lineHeight: '1.2'
                }}>
                  {stats.usersCount}
                </div>
                <div style={{
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  color: '#64748b',
                  marginTop: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  Users (Cached)
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
