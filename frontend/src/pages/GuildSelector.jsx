import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { LogOut, Search, PlusCircle, Settings, Server, HelpCircle, ExternalLink, RefreshCw } from 'lucide-react';

export default function GuildSelector({ user, onSelectGuild, onLogout }) {
  const [guilds, setGuilds] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGuilds = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getGuilds();
      setGuilds(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch servers. Please make sure the bot is running and your token is valid.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuilds();
  }, []);

  const filteredGuilds = guilds.filter(guild =>
    guild.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px' }}>
      
      {/* Centered Header Bar */}
      <div className="container">
        <header className="glass-panel" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {user.avatar ? (
              <img 
                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} 
                alt={user.username}
                style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid #34d399', boxShadow: '0 0 12px rgba(52, 211, 153, 0.3)' }}
              />
            ) : (
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb, #10b981)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                color: '#fff',
                boxShadow: '0 0 12px rgba(37, 99, 235, 0.3)'
              }}>
                {user.username.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#fff' }}>{user.username}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-accent)', fontWeight: '500' }}>• Connected User</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <a 
              href="https://discord.gg/ZVfJvw93Ak" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary" 
              style={{ 
                padding: '9px 18px', 
                fontSize: '0.85rem', 
                background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)', 
                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
                borderRadius: '10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 127.14 96.36" fill="currentColor">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C-3.66,42.5-9.84,76.19,10,95.91a105.73,105.73,0,0,0,32,16.29,80.59,80.59,0,0,0,6.83-11.16A68.61,68.61,0,0,1,38.31,95a55.15,55.15,0,0,0,3.75-2.93,74.9,74.9,0,0,0,67.65,0c1.25.93,2.5,1.92,3.75,2.93a68.46,68.46,0,0,1-10.57,6A81,81,0,0,0,109.73,112.2a105.73,105.73,0,0,0,32-16.29C138,76.19,131.79,42.5,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/>
              </svg>
              Discord Support
            </a>

            <button onClick={onLogout} className="btn-secondary" style={{ padding: '9px 18px', fontSize: '0.85rem' }}>
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
          <aside className="glass-panel sidebar-panel">
            {/* Sidebar Profile details */}
            <div className="sidebar-profile">
              {user.avatar ? (
                <img 
                  src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} 
                  alt={user.username}
                  style={{ width: '70px', height: '70px', borderRadius: '50%', border: '2px solid var(--primary)', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)' }}
                />
              ) : (
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)'
                }}>
                  {user.username.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div style={{ marginTop: '4px' }}>
                <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#fff' }}>{user.username}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Dashboard User</div>
              </div>
            </div>

            {/* Sidebar Search */}
            <div>
              <div className="sidebar-heading" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Search Server</div>
              <div style={{ position: 'relative', width: '100%', marginTop: '6px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Search servers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="glass-input"
                  style={{ paddingLeft: '38px', fontSize: '0.88rem', height: '40px' }}
                />
              </div>
            </div>

            {/* Sidebar Statistics */}
            <div>
              <div className="sidebar-heading" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Server Statistics</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span>Total Loaded:</span>
                  <span style={{ fontWeight: '600', color: '#fff' }}>{guilds.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span>Connected:</span>
                  <span style={{ fontWeight: '600', color: 'var(--success)' }}>{guilds.filter(g => g.botInGuild).length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span>Not Configured:</span>
                  <span style={{ fontWeight: '600', color: 'var(--secondary)' }}>{guilds.filter(g => !g.botInGuild).length}</span>
                </div>
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div>
              <div className="sidebar-heading" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Links</div>
              <div className="sidebar-links" style={{ marginTop: '8px' }}>
                <a 
                  href="https://discord.gg/ZVfJvw93Ak" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="sidebar-link-btn"
                >
                  <Server size={15} style={{ color: '#5865F2' }} />
                  <span>Support Server</span>
                  <ExternalLink size={12} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                </a>
                
                <button 
                  onClick={fetchGuilds} 
                  className="sidebar-link-btn"
                  style={{ width: '100%', textAlign: 'left', background: 'rgba(255, 255, 255, 0.02)', cursor: 'pointer' }}
                >
                  <RefreshCw size={15} style={{ color: 'var(--primary)' }} />
                  <span>Refresh Server List</span>
                </button>

                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); alert('Documentation is included in the project root README.'); }}
                  className="sidebar-link-btn"
                >
                  <HelpCircle size={15} style={{ color: 'var(--warning)' }} />
                  <span>Read Guide / Help</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Right Column: Server list main view */}
          <main style={{ minWidth: 0, flex: 1 }}>
            


            {/* Content Area */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid rgba(37, 99, 235, 0.2)',
                  borderTopColor: 'var(--primary)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 16px auto'
                }} />
                <p style={{ color: 'var(--text-secondary)' }}>Loading servers...</p>
                <style dangerouslySetInnerHTML={{__html: `
                  @keyframes spin {
                    to { transform: rotate(360deg); }
                  }
                `}} />
              </div>
            ) : error ? (
              <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', borderColor: 'var(--danger)' }}>
                <p style={{ color: 'var(--danger)', marginBottom: '16px' }}>{error}</p>
                <button onClick={fetchGuilds} className="btn-primary">Retry</button>
              </div>
            ) : filteredGuilds.length === 0 ? (
              <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)' }}>No servers found. Make sure you are an Administrator in at least one server matching your query.</p>
              </div>
            ) : (
              <div className="server-grid">
                {filteredGuilds.map(guild => (
                  <div key={guild.id} className="glass-panel server-card-horizontal">
                    
                    {/* Left part: Server icon and metadata info */}
                    <div className="server-info-group">
                      {guild.icon ? (
                        <img 
                          src={guild.icon} 
                          alt={guild.name} 
                          style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }} 
                        />
                      ) : (
                        <div style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255,255,255,0.03)',
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                        }}>
                          {guild.name.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase()}
                        </div>
                      )}
                      
                      <div className="server-details-list">
                        <h3 className="server-name-label">{guild.name}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span className="badge-status" style={{
                            backgroundColor: guild.botInGuild ? 'rgba(16, 185, 129, 0.1)' : 'rgba(6, 182, 212, 0.1)',
                            color: guild.botInGuild ? 'var(--success)' : 'var(--secondary)'
                          }}>
                            {guild.botInGuild ? '• Connected' : '• Offline'}
                          </span>
                          {guild.memberCount !== undefined && (
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              ({guild.memberCount.toLocaleString()} members)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right part: Action buttons */}
                    <div style={{ flexShrink: 0 }}>
                      {guild.botInGuild ? (
                        <button 
                          onClick={() => onSelectGuild(guild.id, guild.name, guild.icon, guild.memberCount, guild.ownerId)} 
                          className="btn-primary" 
                          style={{ padding: '10px 18px', fontSize: '0.88rem', whiteSpace: 'nowrap', gap: '6px' }}
                        >
                          <Settings size={15} />
                          Configure
                        </button>
                      ) : (
                        <button 
                          onClick={() => window.open(guild.inviteUrl, '_blank')} 
                          className="btn-secondary" 
                          style={{ padding: '10px 18px', fontSize: '0.88rem', whiteSpace: 'nowrap', gap: '6px', borderColor: 'rgba(14, 165, 233, 0.3)', color: 'var(--secondary)' }}
                        >
                          <PlusCircle size={15} />
                          Setup Bot
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>

      </div>
    </div>
  );
}

