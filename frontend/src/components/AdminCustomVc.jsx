import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import {
  Mic, Volume2, Radio, Lock, Unlock, Eye, EyeOff, Send, Sparkles,
  RefreshCw, Plus, Trash2, Edit3, Users, Settings, MessageSquare,
  Check, X, Loader2, Crown, Zap, AlertCircle, CheckCircle2,
  Sliders, Shield, Globe, Award, Copy
} from 'lucide-react';

export default function AdminCustomVc({ guildId, onNavigateToServer }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Form Settings State
  const [formSettings, setFormSettings] = useState({
    enabled: false,
    categoryId: '',
    hubChannelId: '',
    panelChannelId: '',
    defaultName: "{username}'s Lounge",
    defaultLimit: 0,
    defaultBitrate: 64000
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Send Panel State
  const [selectedPanelChannelId, setSelectedPanelChannelId] = useState('');
  const [sendingPanel, setSendingPanel] = useState(false);

  // Auto Setup State
  const [runningAutoSetup, setRunningAutoSetup] = useState(false);

  // Create Channel Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    ownerId: '',
    userLimit: 0,
    isLocked: false,
    isHidden: false,
    categoryId: ''
  });
  const [creatingChannel, setCreatingChannel] = useState(false);

  // Edit Modals
  const [activeModalAction, setActiveModalAction] = useState(null); // 'rename' | 'limit' | 'owner'
  const [targetChannel, setTargetChannel] = useState(null);
  const [modalInputVal, setModalInputVal] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Members list for owner selection
  const [guildMembers, setGuildMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    if (guildId) {
      fetchCustomVcData();
      fetchGuildMembers();
    }
  }, [guildId]);

  const fetchCustomVcData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.getCustomVcDetails(guildId);
      setData(res);
      if (res.settings) {
        setFormSettings({
          enabled: !!res.settings.enabled,
          categoryId: res.settings.categoryId || '',
          hubChannelId: res.settings.hubChannelId || '',
          panelChannelId: res.settings.panelChannelId || '',
          defaultName: res.settings.defaultName || "{username}'s Lounge",
          defaultLimit: res.settings.defaultLimit || 0,
          defaultBitrate: res.settings.defaultBitrate || 64000
        });
        setSelectedPanelChannelId(res.settings.panelChannelId || (res.textChannels?.[0]?.id || ''));
      }
    } catch (err) {
      console.error('Failed to fetch Custom VC details:', err);
      setErrorMsg(err.message || 'Failed to load Custom VC details');
    } finally {
      setLoading(false);
    }
  };

  const fetchGuildMembers = async () => {
    setLoadingMembers(true);
    try {
      const members = await api.getAdminMembers(guildId, '');
      if (Array.isArray(members)) {
        setGuildMembers(members.slice(0, 100));
      }
    } catch (err) {
      console.warn('Failed to load guild members for custom VC:', err.message);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    setSavingSettings(true);
    setErrorMsg(null);
    try {
      const res = await api.saveCustomVcSettings(guildId, formSettings);
      setSuccessMsg('Settings saved successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleAutoSetup = async () => {
    if (!window.confirm('Auto-Setup will create a "🔊 CUSTOM VOICE" Category and a "➕ Join to Create" Voice Channel in your server. Continue?')) {
      return;
    }
    setRunningAutoSetup(true);
    setErrorMsg(null);
    try {
      const res = await api.autoSetupCustomVc(guildId);
      setSuccessMsg('Auto-Setup successful! Category and Hub Channel created.');
      await fetchCustomVcData();
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err) {
      setErrorMsg(err.message || 'Auto-setup failed.');
    } finally {
      setRunningAutoSetup(false);
    }
  };

  const handleSendPanel = async () => {
    if (!selectedPanelChannelId) {
      setErrorMsg('Please select a text channel to send the Voice Manager panel.');
      return;
    }
    setSendingPanel(true);
    setErrorMsg(null);
    try {
      const res = await api.sendVoiceManagerPanel(guildId, selectedPanelChannelId);
      setSuccessMsg(`🚀 Voice Manager panel sent to Discord channel successfully!`);
      setFormSettings(prev => ({ ...prev, panelChannelId: selectedPanelChannelId }));
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send Voice Manager panel to Discord.');
    } finally {
      setSendingPanel(false);
    }
  };

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    setCreatingChannel(true);
    setErrorMsg(null);
    try {
      await api.createCustomVcChannel(guildId, {
        ...createForm,
        categoryId: createForm.categoryId || formSettings.categoryId
      });
      setSuccessMsg('Custom voice channel created in Discord!');
      setShowCreateModal(false);
      setCreateForm({
        name: '',
        ownerId: '',
        userLimit: 0,
        isLocked: false,
        isHidden: false,
        categoryId: ''
      });
      await fetchCustomVcData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create voice channel.');
    } finally {
      setCreatingChannel(false);
    }
  };

  const handleChannelAction = async (channelId, action, params = {}) => {
    setActionLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.performCustomVcAction(guildId, channelId, action, params);
      setSuccessMsg(res.message || `Action ${action} executed successfully!`);
      // Update local activeVcs state
      setData(prev => {
        if (!prev) return prev;
        let updated = prev.activeVcs;
        if (action === 'delete') {
          updated = updated.filter(c => c.channelId !== channelId);
        } else if (action === 'lock') {
          updated = updated.map(c => c.channelId === channelId ? { ...c, isLocked: true } : c);
        } else if (action === 'unlock') {
          updated = updated.map(c => c.channelId === channelId ? { ...c, isLocked: false } : c);
        } else if (action === 'hide') {
          updated = updated.map(c => c.channelId === channelId ? { ...c, isHidden: true } : c);
        } else if (action === 'unhide') {
          updated = updated.map(c => c.channelId === channelId ? { ...c, isHidden: false } : c);
        } else if (action === 'rename') {
          updated = updated.map(c => c.channelId === channelId ? { ...c, channelName: params.name } : c);
        } else if (action === 'setLimit') {
          updated = updated.map(c => c.channelId === channelId ? { ...c, userLimit: params.limit } : c);
        } else if (action === 'setOwner') {
          const newOwner = guildMembers.find(m => m.id === params.ownerId);
          updated = updated.map(c => c.channelId === channelId ? {
            ...c,
            ownerId: params.ownerId,
            ownerName: newOwner ? newOwner.displayName : `User (${params.ownerId})`
          } : c);
        }
        return { ...prev, activeVcs: updated };
      });
      closeActionModal();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      setErrorMsg(err.message || `Failed to perform ${action}`);
    } finally {
      setActionLoading(false);
    }
  };

  const openActionModal = (action, channel) => {
    setActiveModalAction(action);
    setTargetChannel(channel);
    if (action === 'rename') setModalInputVal(channel.channelName);
    if (action === 'limit') setModalInputVal(String(channel.userLimit || 0));
    if (action === 'owner') setModalInputVal(channel.ownerId || '');
  };

  const closeActionModal = () => {
    setActiveModalAction(null);
    setTargetChannel(null);
    setModalInputVal('');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 20px',
        color: '#94a3b8'
      }}>
        <Loader2 size={36} className="spin" style={{ color: '#6366f1', marginBottom: '16px' }} />
        <h3 style={{ margin: 0, color: '#f8fafc', fontWeight: '700' }}>Loading Custom VC System...</h3>
        <p style={{ margin: '8px 0 0 0', fontSize: '0.88rem' }}>Fetching Discord voice channels and active sessions...</p>
      </div>
    );
  }

  const activeVcsList = data?.activeVcs || [];
  const categoriesList = data?.categories || [];
  const voiceChannelsList = data?.voiceChannels || [];
  const textChannelsList = data?.textChannels || [];
  const totalVoiceMembers = activeVcsList.reduce((acc, curr) => acc + (curr.membersCount || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Toast Alert Messages */}
      {errorMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 18px',
          borderRadius: '12px',
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          fontSize: '0.9rem',
          fontWeight: '600'
        }}>
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1 }}>{errorMsg}</span>
          <button
            onClick={() => setErrorMsg(null)}
            style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '1.2rem', padding: '0 4px' }}
          >
            ×
          </button>
        </div>
      )}

      {successMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 18px',
          borderRadius: '12px',
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34d399',
          fontSize: '0.9rem',
          fontWeight: '600'
        }}>
          <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1 }}>{successMsg}</span>
          <button
            onClick={() => setSuccessMsg(null)}
            style={{ background: 'none', border: 'none', color: '#34d399', cursor: 'pointer', fontSize: '1.2rem', padding: '0 4px' }}
          >
            ×
          </button>
        </div>
      )}

      {/* Hero Header Card */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        padding: '24px 28px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)'
          }}>
            <Volume2 size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.45rem', fontWeight: '800', margin: 0, color: '#f8fafc' }}>
                Custom Voice Channels & Voice Manager
              </h2>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: '800',
                padding: '3px 10px',
                borderRadius: '20px',
                backgroundColor: formSettings.enabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: formSettings.enabled ? '#34d399' : '#f87171',
                border: formSettings.enabled ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: formSettings.enabled ? '#10b981' : '#ef4444'
                }} />
                {formSettings.enabled ? 'SYSTEM ACTIVE' : 'SYSTEM DISABLED'}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '6px 0 0 0' }}>
              Send interactive Voice Manager panels to Discord channels, auto-create temporary rooms when users join, and control active VC permissions.
            </p>
          </div>
        </div>

        {/* Action Header Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={handleAutoSetup}
            disabled={runningAutoSetup}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              border: 'none',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: runningAutoSetup ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.15s ease'
            }}
          >
            {runningAutoSetup ? <Loader2 size={16} className="spin" /> : <Sparkles size={16} />}
            1-Click Auto Setup
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              border: 'none',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
              transition: 'all 0.15s ease'
            }}
          >
            <Plus size={16} />
            Create Custom VC
          </button>

          <button
            onClick={fetchCustomVcData}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94a3b8',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
            title="Refresh active rooms & stats"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Top 4 Quick Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        {/* Stat 1: System Status */}
        <div style={{
          backgroundColor: '#0f172a',
          borderRadius: '14px',
          padding: '18px 20px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Custom VC System</span>
            <Radio size={18} style={{ color: formSettings.enabled ? '#34d399' : '#94a3b8' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: formSettings.enabled ? '#34d399' : '#f87171', marginTop: '8px' }}>
            {formSettings.enabled ? 'Enabled' : 'Disabled'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
            {formSettings.enabled ? 'Ready to spawn on join' : 'Turn on in settings below'}
          </div>
        </div>

        {/* Stat 2: Hub Voice Channel */}
        <div style={{
          backgroundColor: '#0f172a',
          borderRadius: '14px',
          padding: '18px 20px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Join-to-Create Hub</span>
            <Volume2 size={18} style={{ color: '#818cf8' }} />
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#f8fafc', marginTop: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {voiceChannelsList.find(c => c.id === formSettings.hubChannelId)?.name || 'Not Configured'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
            {formSettings.hubChannelId ? `Channel ID: ${formSettings.hubChannelId}` : 'Run 1-Click Setup'}
          </div>
        </div>

        {/* Stat 3: Active Custom Rooms */}
        <div style={{
          backgroundColor: '#0f172a',
          borderRadius: '14px',
          padding: '18px 20px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Custom VCs</span>
            <Mic size={18} style={{ color: '#38bdf8' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#38bdf8', marginTop: '8px' }}>
            {activeVcsList.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
            {activeVcsList.length > 0 ? 'Live rooms monitored' : 'No active temporary rooms'}
          </div>
        </div>

        {/* Stat 4: Connected Members */}
        <div style={{
          backgroundColor: '#0f172a',
          borderRadius: '14px',
          padding: '18px 20px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Voice Users</span>
            <Users size={18} style={{ color: '#a855f7' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#a855f7', marginTop: '8px' }}>
            {totalVoiceMembers}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
            Members currently speaking
          </div>
        </div>
      </div>

      {/* Main 2-Column Section: Discord Voice Manager Panel Dispatcher & Settings */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '24px'
      }}>
        {/* Left Column: Visual Voice Manager Discord Panel Preview & Dispatcher */}
        <div style={{
          backgroundColor: '#0f172a',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', fontWeight: '700', fontSize: '0.85rem' }}>
              <Send size={16} />
              DISCORD DISPATCHER
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f8fafc', margin: '4px 0 0 0' }}>
              Voice Manager Panel
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
              Send this exact interactive panel directly into any Discord text channel. Users in custom voice channels can click buttons to manage their room instantly!
            </p>
          </div>

          {/* Interactive Discord Message Mockup */}
          <div style={{
            backgroundColor: '#1e1f22',
            borderRadius: '12px',
            padding: '24px 26px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            {/* Embed Header Content */}
            <div style={{ marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.2px' }}>
                Voice Manager
              </h3>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.94rem', color: '#dbdee1', fontWeight: '400' }}>
                Control your private voice channel settings below.
              </p>
            </div>

            {/* Row 1: Lock, Unlock, Hide, Unhide */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <div style={discordBtnStyle} className="discord-manager-btn">🔒 Lock</div>
              <div style={discordBtnStyle} className="discord-manager-btn">🔓 Unlock</div>
              <div style={discordBtnStyle} className="discord-manager-btn">🕶️ Hide</div>
              <div style={discordBtnStyle} className="discord-manager-btn">👁️ Unhide</div>
            </div>

            {/* Row 2: Permit, Invite, Ban, Unban */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <div style={discordBtnStyle} className="discord-manager-btn">🤝 Permit</div>
              <div style={discordBtnStyle} className="discord-manager-btn">📩 Invite</div>
              <div style={discordBtnStyle} className="discord-manager-btn">⛔ Ban</div>
              <div style={discordBtnStyle} className="discord-manager-btn">🛡️ Unban</div>
            </div>

            {/* Divider 1 */}
            <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)', margin: '14px 0' }} />

            {/* Row 3: Mute, Unmute, Deafen, Undeaf, Move */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <div style={discordBtnStyle} className="discord-manager-btn">🔇 Mute</div>
              <div style={discordBtnStyle} className="discord-manager-btn">🎶 Unmute</div>
              <div style={discordBtnStyle} className="discord-manager-btn">🙈 Deafen</div>
              <div style={discordBtnStyle} className="discord-manager-btn">👂 Undeaf</div>
              <div style={discordBtnStyle} className="discord-manager-btn">🔄 Move</div>
            </div>

            {/* Divider 2 */}
            <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)', margin: '14px 0' }} />

            {/* Row 4: Limit, Rename, Bitrate, Region */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <div style={discordBtnStyle} className="discord-manager-btn">👤 Limit</div>
              <div style={discordBtnStyle} className="discord-manager-btn">✏️ Rename</div>
              <div style={discordBtnStyle} className="discord-manager-btn">📶 Bitrate</div>
              <div style={discordBtnStyle} className="discord-manager-btn">🌍 Region</div>
            </div>

            {/* Divider 3 */}
            <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)', margin: '14px 0' }} />

            {/* Row 5: Template, Chat, Waiting, Claim, Transfer */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div style={discordBtnStyle} className="discord-manager-btn">📋 Template</div>
              <div style={discordBtnStyle} className="discord-manager-btn">💬 Chat</div>
              <div style={discordBtnStyle} className="discord-manager-btn">⏳ Waiting</div>
              <div style={discordBtnStyle} className="discord-manager-btn">👑 Claim</div>
              <div style={discordBtnStyle} className="discord-manager-btn">⏩ Transfer</div>
            </div>
          </div>

          {/* Send to Channel Controls */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f8fafc' }}>
              Select Text Channel to Deploy Voice Manager:
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <select
                value={selectedPanelChannelId}
                onChange={(e) => setSelectedPanelChannelId(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: '220px',
                  padding: '12px 14px',
                  backgroundColor: '#020617',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  color: '#f8fafc',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              >
                <option value="">-- Choose text channel --</option>
                {textChannelsList.map(ch => (
                  <option key={ch.id} value={ch.id}>
                    #{ch.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleSendPanel}
                disabled={sendingPanel || !selectedPanelChannelId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 22px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  cursor: sendingPanel || !selectedPanelChannelId ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
                  opacity: sendingPanel || !selectedPanelChannelId ? 0.6 : 1,
                  transition: 'all 0.15s ease'
                }}
              >
                {sendingPanel ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
                Send Panel to Discord
              </button>
            </div>
            {formSettings.panelChannelId && (
              <span style={{ fontSize: '0.78rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={14} /> Panel currently active in: #{textChannelsList.find(c => c.id === formSettings.panelChannelId)?.name || formSettings.panelChannelId}
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Custom VC System Settings Form */}
        <div style={{
          backgroundColor: '#0f172a',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: '700', fontSize: '0.85rem' }}>
              <Settings size={16} />
              SYSTEM CONFIGURATION
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f8fafc', margin: '4px 0 0 0' }}>
              Join-to-Create Settings
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
              Configure automatic channel creation parameters, parent category, naming templates, and audio defaults.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Enable/Disable Toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#f8fafc' }}>
                  Enable Custom Voice System
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  When enabled, bot will create temporary rooms when members join the Hub channel.
                </div>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formSettings.enabled}
                  onChange={(e) => setFormSettings({ ...formSettings, enabled: e.target.checked })}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: formSettings.enabled ? '#10b981' : '#334155',
                  transition: '0.2s',
                  borderRadius: '34px'
                }} />
                <span style={{
                  position: 'absolute',
                  content: '""',
                  height: '20px',
                  width: '20px',
                  left: formSettings.enabled ? '25px' : '3px',
                  bottom: '3px',
                  backgroundColor: 'white',
                  transition: '0.2s',
                  borderRadius: '50%'
                }} />
              </label>
            </div>

            {/* Parent Voice Category */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#cbd5e1' }}>
                Custom Voice Category:
              </label>
              <select
                value={formSettings.categoryId}
                onChange={(e) => setFormSettings({ ...formSettings, categoryId: e.target.value })}
                style={inputStyle}
              >
                <option value="">-- No Category (Server Root) --</option>
                {categoriesList.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    📁 {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Join-to-Create Hub Channel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#cbd5e1' }}>
                Join-to-Create Voice Channel (Hub):
              </label>
              <select
                value={formSettings.hubChannelId}
                onChange={(e) => setFormSettings({ ...formSettings, hubChannelId: e.target.value })}
                style={inputStyle}
              >
                <option value="">-- Select Hub Voice Channel --</option>
                {voiceChannelsList.map(vc => (
                  <option key={vc.id} value={vc.id}>
                    🔊 {vc.name}
                  </option>
                ))}
              </select>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Members who connect to this voice channel will be instantly moved to their new custom channel.
              </span>
            </div>

            {/* Default Channel Name Template */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#cbd5e1' }}>
                Default Room Name Template:
              </label>
              <input
                type="text"
                value={formSettings.defaultName}
                onChange={(e) => setFormSettings({ ...formSettings, defaultName: e.target.value })}
                placeholder="{username}'s Lounge"
                style={inputStyle}
              />
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Variables available: <code>{'{username}'}</code> (Display Name), <code>{'{user}'}</code> (Discord Tag)
              </span>
            </div>

            {/* Default User Limit & Bitrate */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#cbd5e1' }}>
                  Default User Limit:
                </label>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={formSettings.defaultLimit}
                  onChange={(e) => setFormSettings({ ...formSettings, defaultLimit: parseInt(e.target.value) || 0 })}
                  placeholder="0 (Unlimited)"
                  style={inputStyle}
                />
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>0 = Unlimited (max 99)</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#cbd5e1' }}>
                  Audio Bitrate:
                </label>
                <select
                  value={formSettings.defaultBitrate}
                  onChange={(e) => setFormSettings({ ...formSettings, defaultBitrate: parseInt(e.target.value) || 64000 })}
                  style={inputStyle}
                >
                  <option value={32000}>32 kbps (Mobile)</option>
                  <option value={64000}>64 kbps (Standard)</option>
                  <option value={96000}>96 kbps (High Quality)</option>
                  <option value={128000}>128 kbps (Nitro / Level 1)</option>
                  <option value={256000}>256 kbps (Level 2)</option>
                  <option value={384000}>384 kbps (Lossless / Level 3)</option>
                </select>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Default 64 kbps</span>
              </div>
            </div>

            {/* Save Settings Button */}
            <button
              type="submit"
              disabled={savingSettings}
              style={{
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: '700',
                fontSize: '0.9rem',
                cursor: savingSettings ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.15s ease'
              }}
            >
              {savingSettings ? <Loader2 size={16} className="spin" /> : <Check size={16} />}
              Save Custom VC Settings
            </button>
          </form>
        </div>
      </div>

      {/* Active Custom Voice Channels Section */}
      <div style={{
        backgroundColor: '#0f172a',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a855f7', fontWeight: '700', fontSize: '0.85rem' }}>
              <Mic size={16} />
              LIVE MONITOR
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f8fafc', margin: '4px 0 0 0' }}>
              Active Custom Voice Channels ({activeVcsList.length})
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
              View currently active custom voice channels and manage their permissions, user limits, and ownership in real-time.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#818cf8',
              fontWeight: '700',
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            <Plus size={14} /> New Room
          </button>
        </div>

        {activeVcsList.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '48px 20px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '12px',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            color: '#64748b'
          }}>
            <Volume2 size={36} style={{ color: '#475569', marginBottom: '12px' }} />
            <h4 style={{ margin: 0, color: '#94a3b8', fontSize: '1rem', fontWeight: '700' }}>No Active Custom Voice Channels</h4>
            <p style={{ margin: '6px 0 0 0', fontSize: '0.83rem' }}>
              When members join the "Join to Create" channel in Discord, their room will appear here with live permissions!
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
            {activeVcsList.map((vc) => (
              <div
                key={vc.channelId}
                style={{
                  backgroundColor: 'rgba(30, 41, 59, 0.6)',
                  borderRadius: '14px',
                  padding: '18px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  transition: 'all 0.15s ease'
                }}
              >
                {/* Header: Name and Status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(99, 102, 241, 0.15)',
                      color: '#818cf8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Volume2 size={20} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.98rem', fontWeight: '800', color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {vc.channelName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        ID: {vc.channelId}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {/* Lock Status */}
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      padding: '3px 8px',
                      borderRadius: '8px',
                      backgroundColor: vc.isLocked ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                      color: vc.isLocked ? '#f87171' : '#34d399',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {vc.isLocked ? <Lock size={12} /> : <Unlock size={12} />}
                      {vc.isLocked ? 'Locked' : 'Open'}
                    </span>

                    {/* Hide Status */}
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      padding: '3px 8px',
                      borderRadius: '8px',
                      backgroundColor: vc.isHidden ? 'rgba(245, 158, 11, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                      color: vc.isHidden ? '#fbbf24' : '#818cf8',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {vc.isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
                      {vc.isHidden ? 'Hidden' : 'Visible'}
                    </span>
                  </div>
                </div>

                {/* Owner & Member Count */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  fontSize: '0.82rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {vc.ownerAvatar ? (
                      <img
                        src={vc.ownerAvatar}
                        alt="Owner"
                        style={{ width: '22px', height: '22px', borderRadius: '50%' }}
                      />
                    ) : (
                      <Crown size={15} style={{ color: '#fbbf24' }} />
                    )}
                    <span style={{ color: '#cbd5e1', fontWeight: '600' }}>{vc.ownerName}</span>
                    <span style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: '700' }}>(Owner)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#94a3b8' }}>
                      Users: <strong style={{ color: '#f8fafc' }}>{vc.membersCount}</strong> / {vc.userLimit === 0 ? '∞' : vc.userLimit}
                    </span>
                  </div>
                </div>

                {/* Connected Members Avatars */}
                {vc.members && vc.members.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', marginRight: '4px' }}>Inside:</span>
                    {vc.members.map(m => (
                      <div
                        key={m.id}
                        title={`${m.displayName} (@${m.username})`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          fontSize: '0.73rem',
                          color: '#e2e8f0'
                        }}
                      >
                        <img src={m.avatar} alt={m.displayName} style={{ width: '16px', height: '16px', borderRadius: '50%' }} />
                        <span>{m.displayName}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Action Buttons Toolbar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  flexWrap: 'wrap',
                  paddingTop: '6px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                  {/* Toggle Lock */}
                  <button
                    onClick={() => handleChannelAction(vc.channelId, vc.isLocked ? 'unlock' : 'lock')}
                    style={smallActionBtnStyle}
                    title={vc.isLocked ? 'Unlock Channel' : 'Lock Channel'}
                  >
                    {vc.isLocked ? <Unlock size={14} style={{ color: '#34d399' }} /> : <Lock size={14} style={{ color: '#f87171' }} />}
                    {vc.isLocked ? 'Unlock' : 'Lock'}
                  </button>

                  {/* Toggle Hide */}
                  <button
                    onClick={() => handleChannelAction(vc.channelId, vc.isHidden ? 'unhide' : 'hide')}
                    style={smallActionBtnStyle}
                    title={vc.isHidden ? 'Unhide Channel' : 'Hide Channel'}
                  >
                    {vc.isHidden ? <Eye size={14} style={{ color: '#818cf8' }} /> : <EyeOff size={14} style={{ color: '#fbbf24' }} />}
                    {vc.isHidden ? 'Unhide' : 'Hide'}
                  </button>

                  {/* Rename */}
                  <button
                    onClick={() => openActionModal('rename', vc)}
                    style={smallActionBtnStyle}
                    title="Rename Channel"
                  >
                    <Edit3 size={14} style={{ color: '#38bdf8' }} />
                    Rename
                  </button>

                  {/* Set Limit */}
                  <button
                    onClick={() => openActionModal('limit', vc)}
                    style={smallActionBtnStyle}
                    title="Set User Limit"
                  >
                    <Users size={14} style={{ color: '#a855f7' }} />
                    Limit
                  </button>

                  {/* Reassign Owner */}
                  <button
                    onClick={() => openActionModal('owner', vc)}
                    style={smallActionBtnStyle}
                    title="Change Channel Owner"
                  >
                    <Crown size={14} style={{ color: '#fbbf24' }} />
                    Owner
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete custom voice channel "${vc.channelName}"?`)) {
                        handleChannelAction(vc.channelId, 'delete');
                      }
                    }}
                    style={{ ...smallActionBtnStyle, color: '#f87171', marginLeft: 'auto' }}
                    title="Delete Channel"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL 1: Create Custom VC from Admin Panel */}
      {showCreateModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={20} style={{ color: '#6366f1' }} />
                Create Custom Voice Channel
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.3rem' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateChannel} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#cbd5e1' }}>Channel Name:</label>
                <input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="e.g. VIP Lounge or Gaming Hub"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#cbd5e1' }}>Assign Channel Owner (Member):</label>
                <select
                  value={createForm.ownerId}
                  onChange={(e) => setCreateForm({ ...createForm, ownerId: e.target.value })}
                  style={inputStyle}
                >
                  <option value="">-- Assign to Me / Default --</option>
                  {guildMembers.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.displayName} (@{m.username})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#cbd5e1' }}>User Limit (0 - 99):</label>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={createForm.userLimit}
                    onChange={(e) => setCreateForm({ ...createForm, userLimit: parseInt(e.target.value) || 0 })}
                    placeholder="0 = Unlimited"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#cbd5e1' }}>Category:</label>
                  <select
                    value={createForm.categoryId}
                    onChange={(e) => setCreateForm({ ...createForm, categoryId: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="">-- Use Default Category --</option>
                    {categoriesList.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px', padding: '10px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={createForm.isLocked}
                    onChange={(e) => setCreateForm({ ...createForm, isLocked: e.target.checked })}
                  />
                  <span>Lock on Creation</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={createForm.isHidden}
                    onChange={(e) => setCreateForm({ ...createForm, isHidden: e.target.checked })}
                  />
                  <span>Hide on Creation</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingChannel}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    border: 'none',
                    color: '#ffffff',
                    cursor: creatingChannel ? 'not-allowed' : 'pointer',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {creatingChannel ? <Loader2 size={16} className="spin" /> : <Plus size={16} />}
                  Create Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Quick Action (Rename, Limit, Owner) */}
      {activeModalAction && targetChannel && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#f8fafc' }}>
                {activeModalAction === 'rename' && '✏️ Rename Voice Channel'}
                {activeModalAction === 'limit' && '👤 Change User Limit'}
                {activeModalAction === 'owner' && '👑 Transfer Ownership'}
              </h3>
              <button
                onClick={closeActionModal}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.3rem' }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: '#94a3b8' }}>
              Channel: <strong style={{ color: '#f8fafc' }}>{targetChannel.channelName}</strong>
            </div>

            {activeModalAction === 'rename' && (
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#cbd5e1' }}>New Channel Name:</label>
                <input
                  type="text"
                  value={modalInputVal}
                  onChange={(e) => setModalInputVal(e.target.value)}
                  style={inputStyle}
                  autoFocus
                />
              </div>
            )}

            {activeModalAction === 'limit' && (
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#cbd5e1' }}>User Limit (0 - 99):</label>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={modalInputVal}
                  onChange={(e) => setModalInputVal(e.target.value)}
                  style={inputStyle}
                  autoFocus
                />
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>0 = Unlimited members</span>
              </div>
            )}

            {activeModalAction === 'owner' && (
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#cbd5e1' }}>Select New Owner:</label>
                <select
                  value={modalInputVal}
                  onChange={(e) => setModalInputVal(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">-- Choose Member --</option>
                  {guildMembers.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.displayName} (@{m.username})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={closeActionModal}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (activeModalAction === 'rename') {
                    handleChannelAction(targetChannel.channelId, 'rename', { name: modalInputVal });
                  } else if (activeModalAction === 'limit') {
                    handleChannelAction(targetChannel.channelId, 'setLimit', { limit: modalInputVal });
                  } else if (activeModalAction === 'owner') {
                    handleChannelAction(targetChannel.channelId, 'setOwner', { ownerId: modalInputVal });
                  }
                }}
                disabled={actionLoading}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  border: 'none',
                  color: '#ffffff',
                  cursor: actionLoading ? 'not-allowed' : 'pointer',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {actionLoading ? <Loader2 size={16} className="spin" /> : <Check size={16} />}
                Apply Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discord Button Hover Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .discord-manager-btn:hover {
          background-color: #35373c !important;
          color: #ffffff !important;
        }
        .discord-manager-btn:active {
          transform: scale(0.97);
        }
      `}} />
    </div>
  );
}

// Styling Constants
const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '10px',
  backgroundColor: '#020617',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  color: '#f8fafc',
  fontSize: '0.88rem',
  outline: 'none',
  marginTop: '4px',
  boxSizing: 'border-box'
};

const discordBtnStyle = {
  backgroundColor: '#2b2d31',
  color: '#dbdee1',
  borderRadius: '8px',
  padding: '9px 18px',
  fontSize: '0.92rem',
  fontWeight: '600',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  border: '1px solid rgba(255, 255, 255, 0.04)',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'background-color 0.15s ease, transform 0.1s ease'
};

const smallActionBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  padding: '5px 10px',
  borderRadius: '6px',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  color: '#cbd5e1',
  fontSize: '0.75rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.1s ease'
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10000,
  padding: '20px'
};

const modalContentStyle = {
  backgroundColor: '#0f172a',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  padding: '24px',
  width: '100%',
  maxWidth: '480px',
  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
};
