import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { 
  LogOut, Search, Settings, Users, Server, Calendar, UserCheck, 
  RefreshCw, ExternalLink, Link, Check, ShieldAlert, Copy
} from 'lucide-react';

export default function AdminSelector({ user, onSelectGuild, onLogout }) {
  const [guilds, setGuilds] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedGuildId, setCopiedGuildId] = useState(null);
  const [copiedOwnerId, setCopiedOwnerId] = useState(null);

  // States for authorized users list
  const [activeTab, setActiveTab] = useState('servers'); // 'servers' or 'users'
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);

  // States for bot settings status
  const [botSettings, setBotSettings] = useState(null);
  const [botUser, setBotUser] = useState(null);
  const [botStats, setBotStats] = useState(null);
  const [botLoading, setBotLoading] = useState(false);
  const [botError, setBotError] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [formStatus, setFormStatus] = useState('online');
  const [formActivityType, setFormActivityType] = useState(4);
  const [formActivityText, setFormActivityText] = useState('I control the server');

  const handleCopyInvite = (guildId, inviteUrl) => {
    if (!inviteUrl) return;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedGuildId(guildId);
    setTimeout(() => {
      setCopiedGuildId(null);
    }, 2000);
  };

  const handleCopyOwnerId = (ownerId, e) => {
    e.stopPropagation();
    if (!ownerId || ownerId === 'N/A') return;
    navigator.clipboard.writeText(ownerId);
    setCopiedOwnerId(ownerId);
    setTimeout(() => {
      setCopiedOwnerId(null);
    }, 2000);
  };

  const handleLeaveGuild = async (guildId, guildName) => {
    if (!window.confirm(`Are you absolutely sure you want the bot to leave "${guildName}"? This action cannot be undone and the bot must be re-invited by an administrator.`)) {
      return;
    }
    
    try {
      await api.leaveGuild(guildId);
      setGuilds(prev => prev.filter(g => g.id !== guildId));
      alert(`Successfully left ${guildName}.`);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to leave guild.');
    }
  };

  const fetchAdminGuilds = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getGuilds();
      setGuilds(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load server data. Ensure the bot is running and backend is online.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthorizedUsers = async () => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const data = await api.getAuthorizedUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setUsersError('Failed to load authorized users. Ensure backend is online.');
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchBotSettings = async () => {
    setBotLoading(true);
    setBotError(null);
    try {
      const data = await api.getBotSettings();
      setBotSettings(data.settings);
      setBotUser(data.botUser);
      setBotStats(data.stats);
      
      // Initialize form fields
      setFormStatus(data.settings.status || 'online');
      setFormActivityType(data.settings.activityType ?? 4);
      setFormActivityText(data.settings.activityText || '');
    } catch (err) {
      console.error(err);
      setBotError('Failed to load bot status configuration.');
    } finally {
      setBotLoading(false);
    }
  };

  const handleSaveBotSettings = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveSuccess(false);
    try {
      const res = await api.saveBotSettings({
        status: formStatus,
        activityType: formActivityType,
        activityText: formActivityText
      });
      setBotSettings(res.settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to update bot settings.');
    } finally {
      setSaveLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminGuilds();
    fetchAuthorizedUsers();
    fetchBotSettings();
  }, []);

  const filteredGuilds = guilds.filter(guild =>
    guild.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    (u.customNickname && u.customNickname.toLowerCase().includes(search.toLowerCase())) ||
    u.discordId.includes(search)
  );

  // Compute aggregate statistics
  const totalServers = guilds.length;
  const totalMembers = guilds.reduce((acc, g) => acc + (g.memberCount || 0), 0);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown Date';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px' }}>
      
      {/* Centered Header Bar */}
      <div className="container">
        <header className="glass-panel" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          marginBottom: '30px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Top subtle glow line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, var(--primary) 0%, var(--accent) 50%, var(--secondary) 100%)'
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div className="user-card-avatar" style={{ padding: '2px' }}>
              {user.avatar ? (
                <img 
                  src={`https://cdn.discordapp.com/avatars/${user.discordId || user.id}/${user.avatar}.png`} 
                  alt={user.username} 
                  style={{ width: '42px', height: '42px', borderRadius: '50%', display: 'block' }}
                />
              ) : (
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  color: 'white',
                  boxShadow: '0 4px 10px rgba(99, 102, 241, 0.25)'
                }}>
                  {user.username ? user.username[0].toUpperCase() : 'A'}
                </div>
              )}
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'white' }}>{user.username}</span>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
                  color: '#a5b4fc',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(165, 180, 252, 0.25)',
                  textShadow: '0 0 8px rgba(165, 180, 252, 0.3)',
                  letterSpacing: '0.05em'
                }}>
                  SYSTEM OWNER
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Global Administration Panel</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <a 
              href="https://discord.gg/ZVfJvw93Ak" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary" 
              style={{ 
                padding: '8px 16px', 
                fontSize: '0.85rem', 
                backgroundColor: '#5865F2', 
                backgroundImage: 'none',
                boxShadow: '0 4px 10px rgba(88, 101, 242, 0.15)',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 14px rgba(88, 101, 242, 0.3)';
                e.currentTarget.style.backgroundColor = '#4752c4';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(88, 101, 242, 0.15)';
                e.currentTarget.style.backgroundColor = '#5865F2';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 127.14 96.36" fill="currentColor">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C-3.66,42.5-9.84,76.19,10,95.91a105.73,105.73,0,0,0,32,16.29,80.59,80.59,0,0,0,6.83-11.16A68.61,68.61,0,0,1,38.31,95a55.15,55.15,0,0,0,3.75-2.93,74.9,74.9,0,0,0,67.65,0c1.25.93,2.5,1.92,3.75,2.93a68.46,68.46,0,0,1-10.57,6A81,81,0,0,0,109.73,112.2a105.73,105.73,0,0,0,32-16.29C138,76.19,131.79,42.5,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/>
              </svg>
              Discord Server
            </a>

            <button onClick={onLogout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', height: '36px' }}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>
      </div>

      {/* Centered Dashboard Layout */}
      <div className="container dashboard-container">
        {/* Dashboard 2-Column Split Layout */}
        <div className="selector-layout">
          
          {/* Left Column: Sidebar panel */}
          <aside className="glass-panel sidebar-panel" style={{ borderRadius: '16px' }}>
            
            {/* Sidebar Heading / Portal Title */}
            <div style={{ textAlign: 'center', padding: '10px 0 20px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div className="pulse-glow" style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                margin: '0 auto 12px auto',
                border: '1px solid rgba(99, 102, 241, 0.25)',
              }}>
                <Server size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', fontFamily: 'Outfit' }}>Admin Panel</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.02em' }}>System Settings Overview</span>
            </div>

            {/* Sidebar Search */}
            {activeTab !== 'system' && (
              <div>
                <div className="sidebar-heading">Search Listing</div>
                <div style={{ position: 'relative', width: '100%', marginTop: '8px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    placeholder={activeTab === 'servers' ? "Filter servers..." : "Filter users..."}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="glass-input"
                    style={{ paddingLeft: '38px', fontSize: '0.88rem', height: '40px', background: 'rgba(15, 23, 42, 0.45)' }}
                  />
                </div>
              </div>
            )}

            {/* Sidebar Statistics */}
            <div>
              <div className="sidebar-heading">Global Stats</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                
                <div className="stat-card">
                  <div className="stat-icon-wrapper server">
                    <Server size={16} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Active Guilds</span>
                    <span className="stat-value">{loading ? '...' : totalServers}</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrapper members">
                    <Users size={16} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Member Reach</span>
                    <span className="stat-value">{loading ? '...' : totalMembers.toLocaleString()}</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrapper users">
                    <UserCheck size={16} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Authorized</span>
                    <span className="stat-value">{usersLoading ? '...' : users.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <div className="sidebar-heading">Quick Actions</div>
              <div className="sidebar-links" style={{ marginTop: '8px' }}>
                <button 
                  onClick={() => { fetchAdminGuilds(); fetchAuthorizedUsers(); }} 
                  className="sidebar-link-btn"
                  style={{ width: '100%', textAlign: 'left' }}
                >
                  <RefreshCw size={15} style={{ color: 'var(--primary)' }} />
                  <span>Refresh Data</span>
                </button>
                
                <a 
                  href="https://discord.gg/ZVfJvw93Ak" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="sidebar-link-btn"
                >
                  <Server size={15} style={{ color: '#5865F2' }} />
                  <span>Support Discord</span>
                  <ExternalLink size={12} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                </a>
              </div>
            </div>

          </aside>

          {/* Right Column: Main view */}
          <main style={{ minWidth: 0, flex: 1 }}>
            
            {/* Tab switch buttons */}
            <div className="segmented-control">
              <button
                type="button"
                onClick={() => { setActiveTab('servers'); setSearch(''); }}
                className={`segmented-btn ${activeTab === 'servers' ? 'active' : ''}`}
              >
                <Server size={18} />
                Managed Servers
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('users'); setSearch(''); }}
                className={`segmented-btn ${activeTab === 'users' ? 'active' : ''}`}
              >
                <Users size={18} />
                Authorized Users ({users.length})
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('system'); setSearch(''); }}
                className={`segmented-btn ${activeTab === 'system' ? 'active' : ''}`}
              >
                <Settings size={18} />
                System Settings
              </button>
            </div>

            {activeTab === 'servers' && (
              <>
                {/* Servers List */}
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '80px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      border: '4px solid rgba(99, 102, 241, 0.2)',
                      borderTopColor: 'var(--primary)',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      margin: '0 auto 16px auto'
                    }} />
                    <p style={{ color: 'var(--text-secondary)' }}>Fetching global server listings...</p>
                  </div>
                ) : error ? (
                  <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', borderColor: 'var(--danger)' }}>
                    <p style={{ color: 'var(--danger)', marginBottom: '16px' }}>{error}</p>
                    <button onClick={fetchAdminGuilds} className="btn-primary">Retry</button>
                  </div>
                ) : filteredGuilds.length === 0 ? (
                  <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>No connected servers found matching your query.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
                    {filteredGuilds.map(guild => (
                      <div key={guild.id} className="server-card-horizontal">
                        
                        {/* Left section: Guild Icon & Name Details */}
                        <div className="server-info-group" style={{ flex: '1 1 35%' }}>
                          {guild.icon ? (
                            <img 
                              src={guild.icon} 
                              alt={guild.name} 
                              style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }} 
                            />
                          ) : (
                            <div style={{
                              width: '52px',
                              height: '52px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.15) 100%)',
                              border: '1px solid rgba(99, 102, 241, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.2rem',
                              fontWeight: 'bold',
                              color: '#a5b4fc',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                            }}>
                              {guild.name.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase()}
                            </div>
                          )}
                          
                          <div style={{ minWidth: 0, textAlign: 'left' }}>
                            <h3 className="server-name-label" style={{ marginBottom: '4px', fontSize: '1.1rem', fontWeight: '700' }}>
                              {guild.name}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                              <Users size={12} style={{ color: 'var(--secondary)' }} />
                              <span style={{ fontWeight: '500' }}>{guild.memberCount || 0} Members</span>
                            </div>
                          </div>
                        </div>

                        {/* Middle section: Metadata Details */}
                        <div className="admin-server-metadata" style={{
                          display: 'flex',
                          flex: '1 1 40%',
                          gap: '24px',
                          fontSize: '0.8rem',
                          color: 'var(--text-secondary)'
                        }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.02em' }}>
                              <Calendar size={12} />
                              JOINED DATE
                            </span>
                            <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                              {formatDate(guild.joinedAt)}
                            </span>
                          </div>

                          <div 
                            onClick={(e) => handleCopyOwnerId(guild.ownerId, e)}
                            style={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              gap: '4px', 
                              textAlign: 'left',
                              cursor: guild.ownerId ? 'pointer' : 'default',
                              position: 'relative'
                            }}
                            title={guild.ownerId ? "Click to copy Owner ID" : ""}
                          >
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.02em' }}>
                              <UserCheck size={12} />
                              OWNER ID
                            </span>
                            <span style={{ 
                              fontWeight: '500', 
                              color: copiedOwnerId === guild.ownerId ? 'var(--success)' : 'var(--text-primary)', 
                              fontFamily: 'monospace',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'color 0.2s ease'
                            }}>
                              {guild.ownerId || 'N/A'}
                              {guild.ownerId && (
                                copiedOwnerId === guild.ownerId ? (
                                  <Check size={12} style={{ color: 'var(--success)' }} />
                                ) : (
                                  <Copy size={12} className="copy-icon-hover" style={{ opacity: 0.4 }} />
                                )
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Right section: Action buttons */}
                        <div className="server-actions-group" style={{ display: 'flex', gap: '10px', flexShrink: 0, marginLeft: 'auto' }}>
                          {guild.inviteUrl ? (
                            <button 
                              type="button"
                              onClick={() => handleCopyInvite(guild.id, guild.inviteUrl)} 
                              className={`btn-server-action btn-action-copy ${copiedGuildId === guild.id ? 'copied' : ''}`}
                            >
                              {copiedGuildId === guild.id ? (
                                <>
                                  <Check size={15} />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Link size={15} />
                                  Copy Invite
                                </>
                              )}
                            </button>
                          ) : (
                            <button 
                              type="button"
                              disabled
                              className="btn-server-action btn-action-copy" 
                              style={{ 
                                opacity: 0.35,
                                cursor: 'not-allowed'
                              }}
                              title="Invite link unavailable. Bot lacks 'Create Instant Invite' permission."
                            >
                              <Link size={15} />
                              No Invite
                            </button>
                          )}

                          <button 
                            type="button"
                            onClick={() => handleLeaveGuild(guild.id, guild.name)} 
                            className="btn-server-action btn-action-leave"
                          >
                            <LogOut size={15} />
                            Leave
                          </button>

                          <button 
                            type="button"
                            onClick={() => onSelectGuild(guild.id, guild.name, guild.icon, guild.memberCount, guild.ownerId)} 
                            className="btn-server-action btn-action-configure"
                          >
                            <Settings size={15} />
                            Configure
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'users' && (
              <>
                {/* Users Tab View */}
                {usersLoading ? (
                  <div style={{ textAlign: 'center', padding: '60px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      border: '4px solid rgba(99, 102, 241, 0.2)',
                      borderTopColor: 'var(--primary)',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      margin: '0 auto 16px auto'
                    }} />
                    <p style={{ color: 'var(--text-secondary)' }}>Fetching authorized users...</p>
                  </div>
                ) : usersError ? (
                  <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', borderColor: 'var(--danger)' }}>
                    <p style={{ color: 'var(--danger)', marginBottom: '16px' }}>{usersError}</p>
                    <button onClick={fetchAuthorizedUsers} className="btn-primary">Retry</button>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>No authorized users found matching your query.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '20px', width: '100%' }}>
                    {filteredUsers.map(u => (
                      <div key={u.discordId} className={`user-card ${u.isAdmin ? 'admin-card' : ''}`}>
                        {/* Card Top / Identity */}
                        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                          <div className={`user-card-avatar ${u.isAdmin ? 'admin-avatar' : ''}`}>
                            {u.avatar ? (
                              <img 
                                src={`https://cdn.discordapp.com/avatars/${u.discordId}/${u.avatar}.png`} 
                                alt={u.username} 
                              />
                            ) : (
                              <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                color: 'white'
                              }}>
                                {u.username.substring(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>

                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              <span style={{ fontWeight: '700', fontSize: '1rem', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {u.customNickname || u.username}
                              </span>
                              {u.customNickname && (
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                  ({u.username})
                                </span>
                              )}
                            </div>
                            
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '2px' }}>
                              ID: {u.discordId}
                            </div>
                            
                            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                              {u.isAdmin ? (
                                <span style={{
                                  fontSize: '0.65rem',
                                  fontWeight: '800',
                                  background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)',
                                  color: 'var(--warning)',
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid rgba(251, 191, 36, 0.25)',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  textShadow: '0 0 6px rgba(251, 191, 36, 0.2)',
                                  letterSpacing: '0.02em'
                                }}>
                                  <ShieldAlert size={11} />
                                  SYSTEM ADMIN
                                </span>
                              ) : (
                                <span style={{
                                  fontSize: '0.65rem',
                                  fontWeight: '800',
                                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)',
                                  color: '#a5b4fc',
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid rgba(99, 102, 241, 0.25)',
                                  letterSpacing: '0.02em'
                                }}>
                                  AUTHORIZED USER
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Card Body / Custom Details */}
                        <div className="user-card-bio">
                          {u.customBio ? (
                            <p style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineClamp: 2 }}>
                              {u.customBio}
                            </p>
                          ) : (
                            <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                              No biography or status details configured.
                            </p>
                          )}
                        </div>

                        {/* Card Footer / Date */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.04)', paddingTop: '12px' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={11} />
                            Authorized: {formatDate(u.authorizedAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'system' && (
              <>
                {botLoading ? (
                  <div style={{ textAlign: 'center', padding: '80px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      border: '4px solid rgba(99, 102, 241, 0.2)',
                      borderTopColor: 'var(--primary)',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      margin: '0 auto 16px auto'
                    }} />
                    <p style={{ color: 'var(--text-secondary)' }}>Loading system configuration...</p>
                  </div>
                ) : botError ? (
                  <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', borderColor: 'var(--danger)' }}>
                    <p style={{ color: 'var(--danger)', marginBottom: '16px' }}>{botError}</p>
                    <button onClick={fetchBotSettings} className="btn-primary">Retry</button>
                  </div>
                ) : (
                  <div className="system-settings-layout" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', width: '100%', alignItems: 'start' }}>
                    
                    {/* Bot Status Form */}
                    <form onSubmit={handleSaveBotSettings} className="glass-panel" style={{ padding: '30px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '24px', borderRadius: '16px', position: 'relative' }}>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#fff', fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Settings size={20} style={{ color: 'var(--primary)' }} />
                        Bot Status Manager
                      </h3>
                      
                      {/* Discord Status Selector */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Discord Status</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                          
                          {[
                            { value: 'online', label: 'Online', color: '#10b981', desc: 'Active and responsive' },
                            { value: 'idle', label: 'Idle', color: '#f59e0b', desc: 'Away / Inactive' },
                            { value: 'dnd', label: 'Do Not Disturb', color: '#ef4444', desc: 'Quiet Mode' },
                            { value: 'invisible', label: 'Invisible', color: '#64748b', desc: 'Appear offline' }
                          ].map(statusOpt => (
                            <button
                              key={statusOpt.value}
                              type="button"
                              onClick={() => setFormStatus(statusOpt.value)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                background: formStatus === statusOpt.value ? 'rgba(99, 102, 241, 0.08)' : 'rgba(30, 41, 59, 0.25)',
                                border: '1px solid',
                                borderColor: formStatus === statusOpt.value ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                textAlign: 'left'
                              }}
                            >
                              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: statusOpt.color, display: 'inline-block', boxShadow: `0 0 10px ${statusOpt.color}` }} />
                              <div>
                                <div style={{ fontSize: '0.88rem', fontWeight: '700', color: formStatus === statusOpt.value ? '#fff' : 'var(--text-secondary)' }}>{statusOpt.label}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{statusOpt.desc}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Activity Type Selector */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Activity Type</label>
                        <select
                          value={formActivityType}
                          onChange={(e) => setFormActivityType(parseInt(e.target.value))}
                          className="glass-input"
                          style={{ fontSize: '0.9rem', height: '44px', background: 'rgba(15, 23, 42, 0.45)', cursor: 'pointer' }}
                        >
                          <option value={4}>Custom Status</option>
                          <option value={0}>Playing</option>
                          <option value={2}>Listening to</option>
                          <option value={3}>Watching</option>
                          <option value={5}>Competing in</option>
                        </select>
                      </div>

                      {/* Activity Message Input */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {formActivityType === 4 ? 'Status Message' : 'Activity Name'}
                        </label>
                        <input
                          type="text"
                          placeholder={formActivityType === 4 ? "e.g. Analyzing workspace..." : "e.g. Minecraft, Spotify, etc."}
                          value={formActivityText}
                          onChange={(e) => setFormActivityText(e.target.value)}
                          maxLength={128}
                          className="glass-input"
                          style={{ fontSize: '0.9rem', height: '44px', background: 'rgba(15, 23, 42, 0.45)' }}
                        />
                      </div>

                      {/* Submit / Save Button */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                        <button
                          type="submit"
                          disabled={saveLoading}
                          className="btn-primary"
                          style={{
                            padding: '12px 24px',
                            borderRadius: '10px',
                            fontWeight: '700',
                            fontSize: '0.92rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: saveSuccess ? '#10b981' : 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.25s ease'
                          }}
                        >
                          {saveLoading ? (
                            <>
                              <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                              Saving Changes...
                            </>
                          ) : saveSuccess ? (
                            <>
                              <Check size={16} />
                              Saved Successfully!
                            </>
                          ) : (
                            <>
                              <Settings size={16} />
                              Apply Status
                            </>
                          )}
                        </button>
                      </div>
                    </form>

                    {/* Right column: Bot User Profile Preview & Live Stats */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      
                      {/* Live Preview Card */}
                      <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', textAlign: 'left', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <h4 style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>Discord Live Preview</h4>
                        
                        <div style={{
                          backgroundColor: '#18191c',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          fontFamily: 'sans-serif',
                          color: '#fff',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                        }}>
                          {/* Banner (Discord Color) */}
                          <div style={{ height: '60px', backgroundColor: '#5865F2' }} />
                          
                          <div style={{ padding: '16px', position: 'relative', marginTop: '-36px' }}>
                            {/* Avatar with Status Dot */}
                            <div style={{ position: 'relative', display: 'inline-block', width: '80px', height: '80px' }}>
                              <img
                                src={botUser?.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                                alt="Bot Avatar"
                                style={{
                                  width: '80px',
                                  height: '80px',
                                  borderRadius: '50%',
                                  border: '6px solid #18191c',
                                  backgroundColor: '#2f3136'
                                }}
                              />
                              <div style={{
                                position: 'absolute',
                                bottom: '2px',
                                right: '2px',
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                backgroundColor: formStatus === 'online' ? '#3ba55d' : formStatus === 'idle' ? '#faa81a' : formStatus === 'dnd' ? '#ed4245' : '#747f8d',
                                border: '3px solid #18191c',
                                boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                              }} />
                            </div>

                            {/* User details */}
                            <div style={{ marginTop: '10px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{botUser?.username || 'KALLU SHAPPU'}</span>
                                <span style={{
                                  backgroundColor: '#5865f2',
                                  color: '#fff',
                                  fontSize: '0.62rem',
                                  fontWeight: '700',
                                  padding: '2px 4px',
                                  borderRadius: '3px',
                                  textTransform: 'uppercase'
                                }}>Bot</span>
                              </div>
                              <div style={{ fontSize: '0.78rem', color: '#b9bbbe', marginTop: '2px' }}>{botUser?.tag || 'KALLU SHAPPU#0000'}</div>
                            </div>

                            <hr style={{ borderColor: 'rgba(255,255,255,0.06)', margin: '14px 0' }} />

                            {/* Custom Status / Activity Text */}
                            <div>
                              <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#b9bbbe', textTransform: 'uppercase', marginBottom: '8px' }}>
                                {formActivityType === 4 ? 'Custom Status' : (
                                  formActivityType === 0 ? 'Playing' : (
                                    formActivityType === 2 ? 'Listening to' : (
                                      formActivityType === 3 ? 'Watching' : 'Competing in'
                                    )
                                  )
                                )}
                              </div>
                              <div style={{ fontSize: '0.85rem', color: '#dcddde', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {formActivityType === 4 ? (
                                  <>
                                    <span style={{ fontSize: '1.1rem' }}>💬</span>
                                    <span>{formActivityText || 'I control the server'}</span>
                                  </>
                                ) : (
                                  <span style={{ fontWeight: '600' }}>{formActivityText || 'Nothing'}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Live Cache Stats Card */}
                      <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', textAlign: 'left', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <h4 style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>Bot Client Statistics</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                          <div style={{ background: 'rgba(15, 23, 42, 0.25)', border: '1px solid rgba(255,255,255,0.02)', padding: '14px', borderRadius: '10px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>{botStats?.guildsCount ?? guilds.length}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.02em', marginTop: '2px' }}>Servers</div>
                          </div>
                          <div style={{ background: 'rgba(15, 23, 42, 0.25)', border: '1px solid rgba(255,255,255,0.02)', padding: '14px', borderRadius: '10px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--secondary)' }}>{botStats?.channelsCount ?? 'N/A'}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.02em', marginTop: '2px' }}>Channels</div>
                          </div>
                          <div style={{ background: 'rgba(15, 23, 42, 0.25)', border: '1px solid rgba(255,255,255,0.02)', padding: '14px', borderRadius: '10px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--success)' }}>{botStats?.usersCount ?? totalMembers.toLocaleString()}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.02em', marginTop: '2px' }}>Users (Cached)</div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>

      </div>

      {/* Scoped CSS styling */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Segmented control tabs */
        .segmented-control {
          display: flex;
          gap: 6px;
          padding: 6px;
          background: rgba(15, 23, 42, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 14px;
          margin-bottom: 24px;
        }
        .segmented-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-secondary);
          background: transparent;
          border: 1px solid transparent;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .segmented-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.03);
        }
        .segmented-btn.active {
          color: #fff;
          background: linear-gradient(135deg, #2563eb 0%, #10b981 100%);
          box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3), 0 0 10px rgba(52, 211, 153, 0.2);
          border-color: rgba(255, 255, 255, 0.1);
        }

        /* Stats cards design */
        .stat-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          background: rgba(15, 25, 46, 0.45);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .stat-card:hover {
          background: rgba(15, 25, 46, 0.7);
          border-color: rgba(52, 211, 153, 0.35);
          transform: translateY(-1px);
        }
        .stat-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
        }
        .stat-icon-wrapper.server {
          background: rgba(37, 99, 235, 0.12);
          color: #3b82f6;
          border: 1px solid rgba(37, 99, 235, 0.25);
        }
        .stat-icon-wrapper.members {
          background: rgba(52, 211, 153, 0.12);
          color: #34d399;
          border: 1px solid rgba(52, 211, 153, 0.25);
        }
        .stat-icon-wrapper.users {
          background: rgba(16, 185, 129, 0.12);
          color: var(--success);
          border: 1px solid rgba(16, 185, 129, 0.25);
        }
        .stat-info {
          display: flex;
          flex-direction: column;
        }
        .stat-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }
        .stat-value {
          font-size: 1.05rem;
          font-weight: 700;
          color: #fff;
          margin-top: 1px;
        }

        /* Server list card horizontal custom styles */
        .server-card-horizontal {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          gap: 20px;
          width: 100%;
          box-sizing: border-box;
          background: rgba(15, 25, 46, 0.45);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .server-card-horizontal:hover {
          transform: translateY(-2px);
          border-color: rgba(52, 211, 153, 0.35);
          box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.2);
          background: rgba(15, 25, 46, 0.7);
        }

        /* Copy icon hover details */
        .copy-icon-hover {
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        div[title*="copy"]:hover .copy-icon-hover {
          opacity: 0.8 !important;
          transform: scale(1.1);
        }

        /* Server Action Buttons */
        .btn-server-action {
          padding: 10px 18px;
          font-size: 0.88rem;
          gap: 6px;
          white-space: nowrap;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-action-copy {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color);
          color: #fff;
        }
        .btn-action-copy:hover {
          background: rgba(37, 99, 235, 0.12);
          border-color: rgba(52, 211, 153, 0.3);
          color: #34d399;
          transform: translateY(-1px);
        }
        .btn-action-copy.copied {
          background: rgba(16, 185, 129, 0.15);
          border-color: var(--success);
          color: var(--success);
        }
        .btn-action-leave {
          background: rgba(244, 63, 94, 0.05);
          border: 1px solid rgba(244, 63, 94, 0.25);
          color: var(--danger);
        }
        .btn-action-leave:hover {
          background: rgba(244, 63, 94, 0.15);
          border-color: var(--danger);
          box-shadow: 0 4px 12px rgba(244, 63, 94, 0.2);
          transform: translateY(-1px);
        }
        .btn-action-configure {
          background: linear-gradient(135deg, #2563eb 0%, #10b981 100%);
          border: none;
          color: white;
          box-shadow: 0 4px 15px rgba(37, 99, 235, 0.25);
        }
        .btn-action-configure:hover {
          filter: brightness(1.1);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4), 0 0 10px rgba(52, 211, 153, 0.3);
          transform: translateY(-1px);
        }
        .btn-action-configure svg {
          transition: transform 0.3s ease;
        }
        .btn-action-configure:hover svg {
          transform: rotate(45deg);
        }

        /* User Card design */
        .user-card {
          position: relative;
          background: var(--bg-card);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 16px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          text-align: left;
        }
        .user-card:hover {
          transform: translateY(-3px);
          border-color: rgba(52, 211, 153, 0.35);
          box-shadow: 0 14px 35px -8px rgba(37, 99, 235, 0.2);
        }
        .user-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #2563eb 0%, #10b981 100%);
          opacity: 0.85;
        }
        .user-card.admin-card::before {
          background: linear-gradient(90deg, var(--warning) 0%, #f59e0b 100%);
        }
        .user-card-bio {
          background: rgba(15, 23, 42, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 0.82rem;
          color: var(--text-secondary);
          min-height: 64px;
          display: flex;
          align-items: center;
          line-height: 1.4;
          position: relative;
        }
        .user-card-avatar {
          position: relative;
          border-radius: 50%;
          padding: 2px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%);
        }
        .user-card-avatar.admin-avatar {
          background: linear-gradient(135deg, var(--warning) 0%, rgba(251, 191, 36, 0.2) 100%);
        }
        .user-card-avatar img {
          display: block;
          width: 48px;
          height: 48px;
          border-radius: 50%;
        }

        @media (max-width: 768px) {
          .admin-server-metadata {
            display: none !important;
          }
          .server-card-horizontal {
            flex-wrap: wrap !important;
            padding: 16px !important;
          }
          .server-info-group {
            flex: 1 1 100% !important;
            margin-bottom: 4px;
          }
          .server-actions-group {
            width: 100% !important;
            margin-left: 0 !important;
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 10px !important;
          }
          .server-actions-group button {
            flex: 1 1 calc(50% - 10px) !important;
            min-width: 120px !important;
            justify-content: center !important;
          }
        }
      `}} />
    </div>
  );
}
