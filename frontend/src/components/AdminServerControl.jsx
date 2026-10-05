import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import {
  ShieldAlert, Shield, ShieldCheck, UserCheck, Users, Hash,
  Radio, Check, X, Plus, Trash2, RefreshCw, Send, AlertTriangle,
  CheckCircle2, Clock, Search, ExternalLink, Copy, Sliders,
  UserX, Hammer, AlertCircle, Loader2, Sparkles, Terminal, BookOpen,
  Volume2, EyeOff, MicOff, Headphones, Ban, UserMinus, ToggleLeft, ToggleRight
} from 'lucide-react';

export default function AdminServerControl({ guildId, onNavigateToServer }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Settings State
  const [formSettings, setFormSettings] = useState({
    enabled: true,
    logChannelId: '',
    allowServerAdmins: false,
    blacklistConfig: {
      roleId: '',
      allowedVoiceChannelId: '',
      allowedTextChannelId: ''
    },
    commandConfig: {
      banEnabled: true,
      kickEnabled: true,
      blacklistEnabled: true,
      timeoutEnabled: true,
      muteEnabled: true,
      deafenEnabled: true
    }
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Test Log & Blacklist Auto-Setup State
  const [sendingTestLog, setSendingTestLog] = useState(false);
  const [runningBlacklistSetup, setRunningBlacklistSetup] = useState(false);

  // Staff Authorization State
  const [activeStaffTab, setActiveStaffTab] = useState('USERS'); // 'USERS' | 'ROLES'
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [authorizingLoading, setAuthorizingLoading] = useState(false);

  // User Auth Form with Granular Checkboxes
  const [selectedUserMember, setSelectedUserMember] = useState(null);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userPerms, setUserPerms] = useState({
    canBan: true,
    canKick: true,
    canBlacklist: true,
    canTimeout: true,
    canMute: true,
    canDeafen: true
  });

  // Role Auth Form with Granular Checkboxes
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [rolePerms, setRolePerms] = useState({
    canBan: true,
    canKick: true,
    canBlacklist: true,
    canTimeout: true,
    canMute: true,
    canDeafen: true
  });

  // Guild Members List (for searching members)
  const [guildMembers, setGuildMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // Direct Moderation Form State
  const [showModModal, setShowModModal] = useState(false);
  const [modAction, setModAction] = useState('BAN'); // 'BAN'|'KICK'|'BLACKLIST'|'UNBLACKLIST'|'TIMEOUT'|'UNTIMEOUT'|'MUTE'|'UNMUTE'|'DEAFEN'|'UNDEAFEN'
  const [modTargetMember, setModTargetMember] = useState(null);
  const [modTargetSearch, setModTargetSearch] = useState('');
  const [modReason, setModReason] = useState('');
  const [modDurationMinutes, setModDurationMinutes] = useState('10');
  const [executingMod, setExecutingMod] = useState(false);

  // Audit Logs Filter
  const [logFilterAction, setLogFilterAction] = useState('ALL');
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [copiedCmd, setCopiedCmd] = useState('');

  useEffect(() => {
    if (guildId) {
      fetchServerControlData();
      fetchGuildMembers();
    }
  }, [guildId]);

  const fetchServerControlData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.getServerControlDetails(guildId);
      setData(res);
      if (res.settings) {
        setFormSettings({
          enabled: res.settings.enabled !== false,
          logChannelId: res.settings.logChannelId || '',
          allowServerAdmins: !!res.settings.allowServerAdmins,
          blacklistConfig: {
            roleId: res.settings.blacklistConfig?.roleId || '',
            allowedVoiceChannelId: res.settings.blacklistConfig?.allowedVoiceChannelId || '',
            allowedTextChannelId: res.settings.blacklistConfig?.allowedTextChannelId || ''
          },
          commandConfig: {
            banEnabled: res.settings.commandConfig?.banEnabled !== false,
            kickEnabled: res.settings.commandConfig?.kickEnabled !== false,
            blacklistEnabled: res.settings.commandConfig?.blacklistEnabled !== false,
            timeoutEnabled: res.settings.commandConfig?.timeoutEnabled !== false,
            muteEnabled: res.settings.commandConfig?.muteEnabled !== false,
            deafenEnabled: res.settings.commandConfig?.deafenEnabled !== false
          }
        });
      }
    } catch (err) {
      console.error('Failed to fetch Server Control data:', err);
      setErrorMsg(err.message || 'Failed to load Server Control details.');
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
      console.warn('Failed to load guild members for Server Control:', err.message);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    setSavingSettings(true);
    setErrorMsg(null);
    try {
      const res = await api.saveServerControlSettings(guildId, formSettings);
      setSuccessMsg('Server Control configuration saved successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSendTestLog = async () => {
    if (!formSettings.logChannelId) {
      setErrorMsg('Please select a log channel first before sending a test log.');
      return;
    }
    setSendingTestLog(true);
    setErrorMsg(null);
    try {
      const res = await api.sendServerControlTestLog(guildId, formSettings.logChannelId);
      setSuccessMsg(res.message || 'Test moderation log sent successfully to Discord!');
      setTimeout(() => setSuccessMsg(null), 4500);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send test moderation log.');
    } finally {
      setSendingTestLog(false);
    }
  };

  const handleBlacklistSetup = async () => {
    if (!window.confirm('This will automatically configure channel permission overwrites so that blacklisted members can ONLY view the selected 1 voice channel and 1 text channel. All other voice channels will disappear for them. Continue?')) {
      return;
    }

    setRunningBlacklistSetup(true);
    setErrorMsg(null);
    try {
      const res = await api.setupServerControlBlacklist(guildId, formSettings.blacklistConfig);
      setSuccessMsg(res.message || 'Blacklist channel isolation configured successfully!');
      if (res.result?.roleId) {
        setFormSettings(prev => ({
          ...prev,
          blacklistConfig: { ...prev.blacklistConfig, roleId: res.result.roleId }
        }));
      }
      await fetchServerControlData();
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to setup blacklist overwrites.');
    } finally {
      setRunningBlacklistSetup(false);
    }
  };

  const handleAuthorizeUser = async (e) => {
    e.preventDefault();
    if (!selectedUserMember) {
      setErrorMsg('Please select a member to grant moderation access.');
      return;
    }

    setAuthorizingLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.authorizeServerControlUser(guildId, {
        userId: selectedUserMember.id,
        ...userPerms
      });

      setData(prev => prev ? ({
        ...prev,
        settings: {
          ...prev.settings,
          authorizedUsers: res.authorizedUsers
        }
      }) : prev);

      setSuccessMsg(`Moderation access updated for ${selectedUserMember.displayName || selectedUserMember.username}!`);
      setShowAddUserModal(false);
      setSelectedUserMember(null);
      setUserSearchTerm('');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to authorize user.');
    } finally {
      setAuthorizingLoading(false);
    }
  };

  const handleRevokeUser = async (userId, displayName) => {
    if (!window.confirm(`Revoke moderation access for ${displayName || userId}?`)) return;

    setErrorMsg(null);
    try {
      const res = await api.revokeServerControlUser(guildId, userId);
      setData(prev => prev ? ({
        ...prev,
        settings: {
          ...prev.settings,
          authorizedUsers: res.authorizedUsers
        }
      }) : prev);
      setSuccessMsg(`Revoked moderation access for user.`);
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to revoke user authorization.');
    }
  };

  const handleAuthorizeRole = async (e) => {
    e.preventDefault();
    if (!selectedRoleId) {
      setErrorMsg('Please select a server role to authorize.');
      return;
    }

    setAuthorizingLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.authorizeServerControlRole(guildId, {
        roleId: selectedRoleId,
        ...rolePerms
      });

      setData(prev => prev ? ({
        ...prev,
        settings: {
          ...prev.settings,
          authorizedRoles: res.authorizedRoles
        }
      }) : prev);

      setSuccessMsg('Moderation access granted to role!');
      setShowAddRoleModal(false);
      setSelectedRoleId('');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to authorize role.');
    } finally {
      setAuthorizingLoading(false);
    }
  };

  const handleRevokeRole = async (roleId, roleName) => {
    if (!window.confirm(`Revoke moderation access for role "${roleName || roleId}"?`)) return;

    setErrorMsg(null);
    try {
      const res = await api.revokeServerControlRole(guildId, roleId);
      setData(prev => prev ? ({
        ...prev,
        settings: {
          ...prev.settings,
          authorizedRoles: res.authorizedRoles
        }
      }) : prev);
      setSuccessMsg('Revoked moderation access for role.');
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to revoke role authorization.');
    }
  };

  const handleExecuteModeration = async (e) => {
    e.preventDefault();
    if (!modTargetMember) {
      setErrorMsg('Please select a target member to moderate.');
      return;
    }

    if (!window.confirm(`Are you sure you want to execute ${modAction} on ${modTargetMember.displayName || modTargetMember.username}?`)) {
      return;
    }

    setExecutingMod(true);
    setErrorMsg(null);
    try {
      const res = await api.executeServerControlAction(guildId, {
        action: modAction,
        targetId: modTargetMember.id,
        reason: modReason.trim() || `Action performed via Server Control Web Dashboard`,
        durationMinutes: parseInt(modDurationMinutes, 10) || 10
      });

      setSuccessMsg(res.message || `Action ${modAction} executed successfully!`);
      setShowModModal(false);
      setModTargetMember(null);
      setModReason('');
      setModTargetSearch('');
      await fetchServerControlData();
      setTimeout(() => setSuccessMsg(null), 4500);
    } catch (err) {
      setErrorMsg(err.message || `Failed to execute ${modAction}.`);
    } finally {
      setExecutingMod(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(''), 2500);
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
        <Loader2 size={36} className="spin" style={{ color: '#ef4444', marginBottom: '16px' }} />
        <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>Loading Server Control Configuration...</span>
      </div>
    );
  }

  const textChannelsList = data?.textChannels || [];
  const voiceChannelsList = data?.voiceChannels || [];
  const serverRolesList = data?.roles || [];
  const authorizedUsers = data?.settings?.authorizedUsers || [];
  const authorizedRoles = data?.settings?.authorizedRoles || [];
  const logsList = data?.logs || [];
  const botPermissions = data?.botPermissions || { canBan: false, canKick: false, canModerate: false };

  // Filtered members for modals
  const filteredUserMembers = guildMembers.filter(m =>
    (m.displayName || '').toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    (m.username || '').toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    m.id.includes(userSearchTerm)
  );

  const filteredModMembers = guildMembers.filter(m =>
    (m.displayName || '').toLowerCase().includes(modTargetSearch.toLowerCase()) ||
    (m.username || '').toLowerCase().includes(modTargetSearch.toLowerCase()) ||
    m.id.includes(modTargetSearch)
  );

  // Filtered Logs
  const filteredLogs = logsList.filter(l => {
    if (logFilterAction !== 'ALL' && l.action !== logFilterAction) return false;
    if (logSearchQuery.trim()) {
      const q = logSearchQuery.toLowerCase();
      const matchTarget = (l.targetTag || '').toLowerCase().includes(q) || (l.targetId || '').includes(q);
      const matchMod = (l.moderatorTag || '').toLowerCase().includes(q);
      const matchReason = (l.reason || '').toLowerCase().includes(q);
      return matchTarget || matchMod || matchReason;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Notifications */}
      {errorMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 18px',
          borderRadius: '12px',
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
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
          border: '1px solid rgba(16, 185, 129, 0.35)',
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
            background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(239, 68, 68, 0.35)'
          }}>
            <ShieldAlert size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.45rem', fontWeight: '800', margin: 0, color: '#f8fafc' }}>
                Server Control & Moderation
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
              Control who can execute <code style={{ color: '#ef4444' }}>?ban</code>, <code style={{ color: '#f59e0b' }}>?kick</code>, <code style={{ color: '#94a3b8' }}>?blacklist</code>, <code style={{ color: '#eab308' }}>?timeout</code>, <code style={{ color: '#38bdf8' }}>?mute</code>, and <code style={{ color: '#fb923c' }}>?deafen</code> commands with automated Discord channel logging.
            </p>
          </div>
        </div>

        {/* Action Header Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowModModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: '#ffffff',
              border: 'none',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)',
              transition: 'all 0.15s ease'
            }}
          >
            <Hammer size={16} />
            Direct Mod Action
          </button>

          <button
            onClick={handleSaveSettings}
            disabled={savingSettings}
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
              cursor: savingSettings ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)'
            }}
          >
            {savingSettings ? <Loader2 size={16} className="spin" /> : <Check size={16} />}
            Save Settings
          </button>

          <button
            onClick={fetchServerControlData}
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
            title="Refresh Server Control data"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Top Quick Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        <div style={{ backgroundColor: '#0f172a', borderRadius: '14px', padding: '18px 20px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Moderation System</span>
            <Radio size={18} style={{ color: formSettings.enabled ? '#34d399' : '#94a3b8' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: formSettings.enabled ? '#34d399' : '#f87171', marginTop: '8px' }}>
            {formSettings.enabled ? 'Active' : 'Disabled'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
            Prefix moderation commands active
          </div>
        </div>

        <div style={{ backgroundColor: '#0f172a', borderRadius: '14px', padding: '18px 20px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Log Channel</span>
            <Hash size={18} style={{ color: '#818cf8' }} />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f8fafc', marginTop: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {textChannelsList.find(c => c.id === formSettings.logChannelId)?.name ? `#${textChannelsList.find(c => c.id === formSettings.logChannelId).name}` : 'Not Selected'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
            {formSettings.logChannelId ? 'Routing logs automatically' : 'Select a channel below'}
          </div>
        </div>

        <div style={{ backgroundColor: '#0f172a', borderRadius: '14px', padding: '18px 20px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Authorized Staff</span>
            <UserCheck size={18} style={{ color: '#38bdf8' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#38bdf8', marginTop: '8px' }}>
            {authorizedUsers.length} <span style={{ fontSize: '0.9rem', color: '#64748b' }}>users / {authorizedRoles.length} roles</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
            Granular per-action access
          </div>
        </div>

        <div style={{ backgroundColor: '#0f172a', borderRadius: '14px', padding: '18px 20px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Logs</span>
            <Clock size={18} style={{ color: '#a855f7' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#a855f7', marginTop: '8px' }}>
            {logsList.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
            Recorded moderation actions
          </div>
        </div>
      </div>

      {/* 2-Column Section: Blacklist System Isolation & Command Toggles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '24px'
      }}>
        {/* Box 1: Blacklist System (1 VC & 1 Text Channel Isolation) */}
        <div style={{
          backgroundColor: '#0f172a',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontWeight: '700', fontSize: '0.85rem' }}>
              <EyeOff size={16} />
              BLACKLIST SYSTEM ISOLATION
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f8fafc', margin: '4px 0 0 0' }}>
              ?blacklist Channel Lockdown
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
              When <code style={{ color: '#f87171' }}>?blacklist @member</code> is executed, all normal voice & text channels disappear for that member, and they are restricted to <strong>only 1 voice channel</strong> and <strong>1 text channel</strong>.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Blacklist Role Selection */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Blacklist Isolation Role:
              </label>
              <select
                value={formSettings.blacklistConfig.roleId}
                onChange={(e) => setFormSettings(prev => ({
                  ...prev,
                  blacklistConfig: { ...prev.blacklistConfig, roleId: e.target.value }
                }))}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  backgroundColor: '#020617',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              >
                <option value="">-- Auto-Detect / Create 🚫 Blacklisted Role --</option>
                {serverRolesList.map(r => (
                  <option key={r.id} value={r.id}>{r.name} ({r.id})</option>
                ))}
              </select>
            </div>

            {/* Allowed Voice Channel */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Allowed Voice Channel (The 1 VC Blacklisted Members Can See):
              </label>
              <select
                value={formSettings.blacklistConfig.allowedVoiceChannelId}
                onChange={(e) => setFormSettings(prev => ({
                  ...prev,
                  blacklistConfig: { ...prev.blacklistConfig, allowedVoiceChannelId: e.target.value }
                }))}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  backgroundColor: '#020617',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              >
                <option value="">-- Choose 1 Allowed Voice Channel --</option>
                {voiceChannelsList.map(c => (
                  <option key={c.id} value={c.id}>🔊 {c.name}</option>
                ))}
              </select>
            </div>

            {/* Allowed Text Channel */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Allowed Text Channel (The 1 Text Channel Blacklisted Members Can See):
              </label>
              <select
                value={formSettings.blacklistConfig.allowedTextChannelId}
                onChange={(e) => setFormSettings(prev => ({
                  ...prev,
                  blacklistConfig: { ...prev.blacklistConfig, allowedTextChannelId: e.target.value }
                }))}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  backgroundColor: '#020617',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              >
                <option value="">-- Choose 1 Allowed Text Channel --</option>
                {textChannelsList.map(c => (
                  <option key={c.id} value={c.id}># {c.name}</option>
                ))}
              </select>
            </div>

            {/* Action button to sync overwrites */}
            <button
              type="button"
              onClick={handleBlacklistSetup}
              disabled={runningBlacklistSetup}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '11px 16px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: runningBlacklistSetup ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
                marginTop: '4px'
              }}
            >
              {runningBlacklistSetup ? <Loader2 size={16} className="spin" /> : <EyeOff size={16} />}
              Auto-Configure Channel Permissions
            </button>
          </div>
        </div>

        {/* Box 2: Customize Commands & Log Channel Selector */}
        <div style={{
          backgroundColor: '#0f172a',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366f1', fontWeight: '700', fontSize: '0.85rem' }}>
              <Sliders size={16} />
              COMMAND CUSTOMIZATION & ROUTING
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f8fafc', margin: '4px 0 0 0' }}>
              Command Toggles & Log Route
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
              Customize and toggle individual moderation commands. All actions output reasons to the chosen log channel.
            </p>
          </div>

          {/* Log Channel Picker */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
              Discord Moderation Log Channel:
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                value={formSettings.logChannelId}
                onChange={(e) => setFormSettings(prev => ({ ...prev, logChannelId: e.target.value }))}
                style={{
                  flex: 1,
                  padding: '11px 14px',
                  backgroundColor: '#020617',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              >
                <option value="">-- No Log Channel (Disabled) --</option>
                {textChannelsList.map(c => (
                  <option key={c.id} value={c.id}>#{c.name} ({c.id})</option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleSendTestLog}
                disabled={sendingTestLog || !formSettings.logChannelId}
                style={{
                  padding: '11px 16px',
                  borderRadius: '8px',
                  background: formSettings.logChannelId ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(255, 255, 255, 0.05)',
                  color: formSettings.logChannelId ? '#ffffff' : '#64748b',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '0.82rem',
                  cursor: formSettings.logChannelId && !sendingTestLog ? 'pointer' : 'not-allowed',
                  whiteSpace: 'nowrap'
                }}
              >
                {sendingTestLog ? <Loader2 size={15} className="spin" /> : <Send size={15} />}
                Test
              </button>
            </div>
          </div>

          {/* Individual Command Toggles Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {[
              { key: 'banEnabled', label: '?ban (Ban)', color: '#ef4444' },
              { key: 'kickEnabled', label: '?kick (Kick)', color: '#f59e0b' },
              { key: 'blacklistEnabled', label: '?blacklist (Lock)', color: '#f87171' },
              { key: 'timeoutEnabled', label: '?timeout (Timeout)', color: '#eab308' },
              { key: 'muteEnabled', label: '?mute (Voice Mute)', color: '#38bdf8' },
              { key: 'deafenEnabled', label: '?deafen (Voice Deafen)', color: '#fb923c' }
            ].map(cmd => (
              <div
                key={cmd.key}
                onClick={() => setFormSettings(prev => ({
                  ...prev,
                  commandConfig: {
                    ...prev.commandConfig,
                    [cmd.key]: !prev.commandConfig[cmd.key]
                  }
                }))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.025)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: cmd.color }}>
                  {cmd.label}
                </span>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  backgroundColor: formSettings.commandConfig[cmd.key] ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: formSettings.commandConfig[cmd.key] ? '#34d399' : '#f87171'
                }}>
                  {formSettings.commandConfig[cmd.key] ? 'ON' : 'OFF'}
                </span>
              </div>
            ))}
          </div>

          {/* Admin Bypass Toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 14px',
            backgroundColor: 'rgba(255, 255, 255, 0.025)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f8fafc' }}>
                Allow Server Admins Without Explicit Grant
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                If OFF, <strong>ONLY</strong> members granted in the list below can run commands.
              </div>
            </div>
            <input
              type="checkbox"
              checked={formSettings.allowServerAdmins}
              onChange={(e) => setFormSettings(prev => ({ ...prev, allowServerAdmins: e.target.checked }))}
              style={{ width: '18px', height: '18px', accentColor: '#6366f1', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      {/* Staff Access Authorization Section (Granular Per-Command Controls) */}
      <div style={{
        backgroundColor: '#0f172a',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: '700', fontSize: '0.85rem' }}>
              <ShieldCheck size={16} />
              GRANULAR ACCESS CONTROL
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#f8fafc', margin: '4px 0 0 0' }}>
              Authorized Staff & Roles
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
              Each section has individual permissions. You can customize exactly who can ban, kick, blacklist, timeout, mute, or deafen.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setShowAddUserModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(56, 189, 248, 0.25)'
              }}
            >
              <Plus size={16} />
              Authorize Member
            </button>

            <button
              onClick={() => setShowAddRoleModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.25)'
              }}
            >
              <Plus size={16} />
              Authorize Role
            </button>
          </div>
        </div>

        {/* Tab Switcher: Users vs Roles */}
        <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
          <button
            onClick={() => setActiveStaffTab('USERS')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: activeStaffTab === 'USERS' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              color: activeStaffTab === 'USERS' ? '#38bdf8' : '#94a3b8',
              border: activeStaffTab === 'USERS' ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <UserCheck size={16} />
            Authorized Users ({authorizedUsers.length})
          </button>

          <button
            onClick={() => setActiveStaffTab('ROLES')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: activeStaffTab === 'ROLES' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              color: activeStaffTab === 'ROLES' ? '#818cf8' : '#94a3b8',
              border: activeStaffTab === 'ROLES' ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <Users size={16} />
            Authorized Roles ({authorizedRoles.length})
          </button>
        </div>

        {/* Tab 1: Authorized Users Cards */}
        {activeStaffTab === 'USERS' && (
          <div>
            {authorizedUsers.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#64748b',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '12px',
                border: '1px dashed rgba(255, 255, 255, 0.08)'
              }}>
                <UserX size={36} style={{ color: '#475569', marginBottom: '10px' }} />
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#94a3b8' }}>
                  No Individual Users Authorized Yet
                </div>
                <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>
                  Click <strong>"Authorize Member"</strong> above to grant moderation privileges to specific staff members.
                </div>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '14px'
              }}>
                {authorizedUsers.map(user => (
                  <div
                    key={user.userId}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      padding: '16px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt=""
                            style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            backgroundColor: '#38bdf8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontWeight: '800'
                          }}>
                            {(user.username || 'U')[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: '700', color: '#f8fafc', fontSize: '0.92rem' }}>
                            {user.username || `User (${user.userId})`}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            ID: {user.userId}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRevokeUser(user.userId, user.username)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#64748b',
                          cursor: 'pointer',
                          padding: '8px',
                          borderRadius: '8px',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                        title="Revoke Moderation Access"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Permission Badges Grid */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', backgroundColor: user.canBan !== false ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.05)', color: user.canBan !== false ? '#f87171' : '#64748b' }}>
                        🔨 Ban: {user.canBan !== false ? 'YES' : 'NO'}
                      </span>
                      <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', backgroundColor: user.canKick !== false ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.05)', color: user.canKick !== false ? '#fbbf24' : '#64748b' }}>
                        👢 Kick: {user.canKick !== false ? 'YES' : 'NO'}
                      </span>
                      <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', backgroundColor: user.canBlacklist !== false ? 'rgba(244, 63, 94, 0.15)' : 'rgba(255,255,255,0.05)', color: user.canBlacklist !== false ? '#fb7185' : '#64748b' }}>
                        🚫 Blacklist: {user.canBlacklist !== false ? 'YES' : 'NO'}
                      </span>
                      <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', backgroundColor: user.canTimeout !== false ? 'rgba(234, 179, 8, 0.15)' : 'rgba(255,255,255,0.05)', color: user.canTimeout !== false ? '#facc15' : '#64748b' }}>
                        ⏳ Timeout: {user.canTimeout !== false ? 'YES' : 'NO'}
                      </span>
                      <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', backgroundColor: user.canMute !== false ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.05)', color: user.canMute !== false ? '#38bdf8' : '#64748b' }}>
                        🔇 Mute: {user.canMute !== false ? 'YES' : 'NO'}
                      </span>
                      <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', backgroundColor: user.canDeafen !== false ? 'rgba(251, 146, 60, 0.15)' : 'rgba(255,255,255,0.05)', color: user.canDeafen !== false ? '#fb923c' : '#64748b' }}>
                        🙈 Deafen: {user.canDeafen !== false ? 'YES' : 'NO'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Authorized Roles Cards */}
        {activeStaffTab === 'ROLES' && (
          <div>
            {authorizedRoles.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#64748b',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '12px',
                border: '1px dashed rgba(255, 255, 255, 0.08)'
              }}>
                <Users size={36} style={{ color: '#475569', marginBottom: '10px' }} />
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#94a3b8' }}>
                  No Roles Authorized Yet
                </div>
                <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>
                  Click <strong>"Authorize Role"</strong> to give moderation powers to any role in your server.
                </div>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '14px'
              }}>
                {authorizedRoles.map(role => (
                  <div
                    key={role.roleId}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      padding: '16px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          backgroundColor: role.roleColor || '#99aab5',
                          boxShadow: `0 0 10px ${role.roleColor || '#99aab5'}`
                        }} />
                        <div>
                          <div style={{ fontWeight: '700', color: '#f8fafc', fontSize: '0.92rem' }}>
                            {role.roleName || `Role (${role.roleId})`}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            ID: {role.roleId}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRevokeRole(role.roleId, role.roleName)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#64748b',
                          cursor: 'pointer',
                          padding: '8px',
                          borderRadius: '8px',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                        title="Revoke Role Access"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Permissions Badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', backgroundColor: role.canBan !== false ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.05)', color: role.canBan !== false ? '#f87171' : '#64748b' }}>
                        🔨 Ban: {role.canBan !== false ? 'YES' : 'NO'}
                      </span>
                      <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', backgroundColor: role.canKick !== false ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.05)', color: role.canKick !== false ? '#fbbf24' : '#64748b' }}>
                        👢 Kick: {role.canKick !== false ? 'YES' : 'NO'}
                      </span>
                      <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', backgroundColor: role.canBlacklist !== false ? 'rgba(244, 63, 94, 0.15)' : 'rgba(255,255,255,0.05)', color: role.canBlacklist !== false ? '#fb7185' : '#64748b' }}>
                        🚫 Blacklist: {role.canBlacklist !== false ? 'YES' : 'NO'}
                      </span>
                      <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', backgroundColor: role.canTimeout !== false ? 'rgba(234, 179, 8, 0.15)' : 'rgba(255,255,255,0.05)', color: role.canTimeout !== false ? '#facc15' : '#64748b' }}>
                        ⏳ Timeout: {role.canTimeout !== false ? 'YES' : 'NO'}
                      </span>
                      <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', backgroundColor: role.canMute !== false ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.05)', color: role.canMute !== false ? '#38bdf8' : '#64748b' }}>
                        🔇 Mute: {role.canMute !== false ? 'YES' : 'NO'}
                      </span>
                      <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', backgroundColor: role.canDeafen !== false ? 'rgba(251, 146, 60, 0.15)' : 'rgba(255,255,255,0.05)', color: role.canDeafen !== false ? '#fb923c' : '#64748b' }}>
                        🙈 Deafen: {role.canDeafen !== false ? 'YES' : 'NO'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Moderation Audit Logs / History Table */}
      <div style={{
        backgroundColor: '#0f172a',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a855f7', fontWeight: '700', fontSize: '0.85rem' }}>
              <Clock size={16} />
              REAL-TIME AUDIT TRAIL
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f8fafc', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Moderation Action Logs
              {filteredLogs.length > 0 && (
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: '#a855f7',
                  backgroundColor: 'rgba(168, 85, 247, 0.15)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  padding: '2px 9px',
                  borderRadius: '12px'
                }}>
                  {filteredLogs.length}
                </span>
              )}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
              Complete audit trail of all ban, kick, blacklist, timeout, mute, and deafen actions with full reasons.
            </p>
          </div>

          {/* Filter Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#020617',
              borderRadius: '8px',
              padding: '6px 12px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Search size={14} style={{ color: '#64748b', marginRight: '8px' }} />
              <input
                type="text"
                placeholder="Search target, moderator, reason..."
                value={logSearchQuery}
                onChange={(e) => setLogSearchQuery(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#f8fafc',
                  fontSize: '0.82rem',
                  outline: 'none',
                  width: '200px'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '4px', backgroundColor: '#020617', padding: '4px', borderRadius: '8px', flexWrap: 'wrap' }}>
              {['ALL', 'BAN', 'KICK', 'BLACKLIST', 'TIMEOUT', 'MUTE', 'DEAFEN'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setLogFilterAction(filter)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    backgroundColor: logFilterAction === filter ? '#ef4444' : 'transparent',
                    color: logFilterAction === filter ? '#ffffff' : '#94a3b8'
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Logs Table / Cards inside Scroll Box */}
        {filteredLogs.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#64748b',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '12px',
            border: '1px dashed rgba(255, 255, 255, 0.08)'
          }}>
            <Clock size={36} style={{ color: '#475569', marginBottom: '10px' }} />
            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#94a3b8' }}>
              No Moderation Logs Found
            </div>
            <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>
              When commands are executed in Discord, entries with reasons will appear here in real time.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              className="custom-scrollbar"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                maxHeight: '440px',
                overflowY: 'auto',
                paddingRight: '6px',
                paddingBottom: '2px',
                overscrollBehavior: 'contain'
              }}
            >
              {filteredLogs.map(log => {
                let badgeColor = '#ef4444';
                if (log.action === 'KICK') badgeColor = '#f59e0b';
                if (log.action === 'BLACKLIST') badgeColor = '#f43f5e';
                if (log.action === 'UNBLACKLIST' || log.action === 'UNTIMEOUT' || log.action === 'UNMUTE' || log.action === 'UNDEAFEN') badgeColor = '#10b981';
                if (log.action === 'TIMEOUT') badgeColor = '#eab308';
                if (log.action === 'MUTE') badgeColor = '#38bdf8';
                if (log.action === 'DEAFEN') badgeColor = '#fb923c';

                return (
                  <div
                    key={log._id || `${log.targetId}-${log.createdAt}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '14px',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.025)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderLeft: `4px solid ${badgeColor}`,
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.025)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      {log.targetAvatar ? (
                        <img
                          src={log.targetAvatar}
                          alt=""
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: badgeColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          fontWeight: '800',
                          fontSize: '0.85rem'
                        }}>
                          {log.action.slice(0, 2)}
                        </div>
                      )}

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: '800',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            backgroundColor: `${badgeColor}25`,
                            color: badgeColor
                          }}>
                            {log.action}
                          </span>
                          <span style={{ fontWeight: '700', color: '#f8fafc', fontSize: '0.9rem' }}>
                            {log.targetTag || `User (${log.targetId})`}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            ({log.targetId})
                          </span>
                          {log.duration && (
                            <span style={{ fontSize: '0.72rem', color: '#eab308', fontWeight: '700' }}>
                              • {log.duration}
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '0.84rem', color: '#cbd5e1', marginTop: '4px' }}>
                          <strong>Reason:</strong> {log.reason || 'No reason provided'}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', fontSize: '0.78rem', color: '#94a3b8' }}>
                      <div>
                        <strong>Mod:</strong> {log.moderatorTag || 'Staff'}
                      </div>
                      <div style={{ marginTop: '2px', color: '#64748b' }}>
                        {log.source === 'DASHBOARD' ? '🌐 Dashboard' : (log.channelName ? `#${log.channelName}` : 'Discord')} • {new Date(log.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredLogs.length > 4 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 4px 0 4px',
                fontSize: '0.74rem',
                color: '#64748b'
              }}>
                <span>Showing {filteredLogs.length} {filteredLogs.length === 1 ? 'log' : 'logs'}</span>
                <span>Scroll down inside box to view older logs ⬇</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Interactive Command Guide Reference */}
      <div style={{
        backgroundColor: '#0f172a',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontWeight: '700', fontSize: '0.85rem' }}>
          <Terminal size={16} />
          COMMAND REFERENCE & SYNTAX GUIDE
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
          {[
            { cmd: '?blacklist @member [reason]', label: '🚫 ?blacklist Command', desc: 'Isolates member: all normal VCs disappear, leaving only 1 voice & 1 text channel.', color: '#f87171' },
            { cmd: '?unblacklist @member', label: '✅ ?unblacklist Command', desc: 'Restores member normal channel visibility and lifts blacklist role.', color: '#34d399' },
            { cmd: '?timeout @member [minutes] [reason]', label: '⏳ ?timeout Command', desc: 'Times out member. If minutes are not entered, bot interactively asks: "How many minutes?"', color: '#facc15' },
            { cmd: '?untimeout @member', label: '✅ ?untimeout Command', desc: 'Instantly removes active timeout from the member.', color: '#34d399' },
            { cmd: '?mute @member [reason]', label: '🔇 ?mute Command', desc: 'Server voice mutes the member in voice channels.', color: '#38bdf8' },
            { cmd: '?unmute @member', label: '🔊 ?unmute Command', desc: 'Unmutes the member in voice channels.', color: '#38bdf8' },
            { cmd: '?deafen @member [reason]', label: '🙈 ?deafen Command', desc: 'Server voice deafens the member in voice channels.', color: '#fb923c' },
            { cmd: '?undeafen @member', label: '👂 ?undeafen Command', desc: 'Voice undeafens the member in voice channels.', color: '#fb923c' },
            { cmd: '?ban @member [reason]', label: '🔨 ?ban Command', desc: 'Permanently bans member and logs reason to channel.', color: '#ef4444' },
            { cmd: '?kick @member [reason]', label: '👢 ?kick Command', desc: 'Kicks member and logs reason to channel.', color: '#f59e0b' }
          ].map(item => (
            <div
              key={item.cmd}
              style={{
                backgroundColor: '#020617',
                padding: '14px 16px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: '800', color: item.color }}>
                  {item.label}
                </span>
                <button
                  onClick={() => copyToClipboard(item.cmd, item.cmd)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: copiedCmd === item.cmd ? '#34d399' : '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copiedCmd === item.cmd ? <Check size={14} /> : <Copy size={14} />}
                  {copiedCmd === item.cmd ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div style={{
                backgroundColor: '#1e1f22',
                padding: '7px 10px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                color: '#f8fafc',
                margin: '8px 0'
              }}>
                {item.cmd}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: Authorize Member Modal (Granular 6 Checkboxes) */}
      {showAddUserModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '520px',
            padding: '26px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#f8fafc' }}>
                Authorize Member Permissions
              </h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.3rem' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAuthorizeUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Search and Select Server Member:
                </label>
                <input
                  type="text"
                  placeholder="Type username or member ID..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#020617',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />

                <div style={{
                  maxHeight: '140px',
                  overflowY: 'auto',
                  marginTop: '8px',
                  backgroundColor: '#020617',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  {filteredUserMembers.length === 0 ? (
                    <div style={{ padding: '12px', fontSize: '0.8rem', color: '#64748b', textAlign: 'center' }}>
                      {loadingMembers ? 'Loading members...' : 'No members found'}
                    </div>
                  ) : (
                    filteredUserMembers.slice(0, 15).map(member => (
                      <div
                        key={member.id}
                        onClick={() => setSelectedUserMember(member)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          backgroundColor: selectedUserMember?.id === member.id ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
                        }}
                      >
                        <div style={{ fontWeight: '600', color: '#f8fafc', fontSize: '0.85rem' }}>
                          {member.displayName || member.username}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>({member.id})</span>
                        {selectedUserMember?.id === member.id && (
                          <Check size={14} style={{ color: '#38bdf8', marginLeft: 'auto' }} />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Granular Checkboxes Grid */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
                  Assign Granted Moderation Actions:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px' }}>
                  {[
                    { key: 'canBan', label: '🔨 Can Ban (?ban)' },
                    { key: 'canKick', label: '👢 Can Kick (?kick)' },
                    { key: 'canBlacklist', label: '🚫 Can Blacklist (?blacklist)' },
                    { key: 'canTimeout', label: '⏳ Can Timeout (?timeout)' },
                    { key: 'canMute', label: '🔇 Can Mute (?mute)' },
                    { key: 'canDeafen', label: '🙈 Can Deafen (?deafen)' }
                  ].map(p => (
                    <label key={p.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={userPerms[p.key]}
                        onChange={(e) => setUserPerms(prev => ({ ...prev, [p.key]: e.target.checked }))}
                        style={{ accentColor: '#38bdf8', width: '16px', height: '16px' }}
                      />
                      {p.label}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  style={{ padding: '9px 16px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', cursor: 'pointer', fontWeight: '600' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={authorizingLoading || !selectedUserMember}
                  style={{ padding: '9px 20px', borderRadius: '8px', background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', color: '#ffffff', border: 'none', fontWeight: '700', cursor: authorizingLoading || !selectedUserMember ? 'not-allowed' : 'pointer' }}
                >
                  {authorizingLoading ? 'Authorizing...' : 'Grant Access'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Authorize Role Modal (Granular 6 Checkboxes) */}
      {showAddRoleModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '500px',
            padding: '26px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#f8fafc' }}>
                Authorize Role Permissions
              </h3>
              <button
                onClick={() => setShowAddRoleModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.3rem' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAuthorizeRole} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Select Discord Server Role:
                </label>
                <select
                  value={selectedRoleId}
                  onChange={(e) => setSelectedRoleId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: '#020617',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                >
                  <option value="">-- Choose a Role --</option>
                  {serverRolesList.map(role => (
                    <option key={role.id} value={role.id}>{role.name} ({role.id})</option>
                  ))}
                </select>
              </div>

              {/* Granular Checkboxes Grid */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
                  Assign Granted Actions to Role:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px' }}>
                  {[
                    { key: 'canBan', label: '🔨 Can Ban (?ban)' },
                    { key: 'canKick', label: '👢 Can Kick (?kick)' },
                    { key: 'canBlacklist', label: '🚫 Can Blacklist (?blacklist)' },
                    { key: 'canTimeout', label: '⏳ Can Timeout (?timeout)' },
                    { key: 'canMute', label: '🔇 Can Mute (?mute)' },
                    { key: 'canDeafen', label: '🙈 Can Deafen (?deafen)' }
                  ].map(p => (
                    <label key={p.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={rolePerms[p.key]}
                        onChange={(e) => setRolePerms(prev => ({ ...prev, [p.key]: e.target.checked }))}
                        style={{ accentColor: '#6366f1', width: '16px', height: '16px' }}
                      />
                      {p.label}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddRoleModal(false)}
                  style={{ padding: '9px 16px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', cursor: 'pointer', fontWeight: '600' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={authorizingLoading || !selectedRoleId}
                  style={{ padding: '9px 20px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#ffffff', border: 'none', fontWeight: '700', cursor: authorizingLoading || !selectedRoleId ? 'not-allowed' : 'pointer' }}
                >
                  {authorizingLoading ? 'Authorizing...' : 'Authorize Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Direct Moderation Action Modal (Full Actions Supported) */}
      {showModModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '520px',
            padding: '26px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#f8fafc' }}>
                Direct Moderation Action
              </h3>
              <button
                onClick={() => setShowModModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.3rem' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleExecuteModeration} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Action Buttons */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
                  Select Moderation Action:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'BAN', label: '🔨 Ban' },
                    { id: 'KICK', label: '👢 Kick' },
                    { id: 'BLACKLIST', label: '🚫 Blacklist' },
                    { id: 'UNBLACKLIST', label: '✅ Unblacklist' },
                    { id: 'TIMEOUT', label: '⏳ Timeout' },
                    { id: 'UNTIMEOUT', label: '✅ Untimeout' },
                    { id: 'MUTE', label: '🔇 Mute' },
                    { id: 'UNMUTE', label: '🔊 Unmute' },
                    { id: 'DEAFEN', label: '🙈 Deafen' },
                    { id: 'UNDEAFEN', label: '👂 Undeafen' }
                  ].map(act => (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => setModAction(act.id)}
                      style={{
                        padding: '9px 10px',
                        borderRadius: '8px',
                        border: modAction === act.id ? '2px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                        backgroundColor: modAction === act.id ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                        color: modAction === act.id ? '#f87171' : '#94a3b8',
                        fontWeight: '700',
                        fontSize: '0.82rem',
                        cursor: 'pointer'
                      }}
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Member Search */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Target Member:
                </label>
                <input
                  type="text"
                  placeholder="Search member name or ID..."
                  value={modTargetSearch}
                  onChange={(e) => setModTargetSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#020617',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />

                <div style={{
                  maxHeight: '120px',
                  overflowY: 'auto',
                  marginTop: '8px',
                  backgroundColor: '#020617',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  {filteredModMembers.length === 0 ? (
                    <div style={{ padding: '10px', fontSize: '0.8rem', color: '#64748b', textAlign: 'center' }}>
                      No matching members
                    </div>
                  ) : (
                    filteredModMembers.slice(0, 10).map(member => (
                      <div
                        key={member.id}
                        onClick={() => setModTargetMember(member)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          backgroundColor: modTargetMember?.id === member.id ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
                        }}
                      >
                        <div style={{ fontWeight: '600', color: '#f8fafc', fontSize: '0.85rem' }}>
                          {member.displayName || member.username}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>({member.id})</span>
                        {modTargetMember?.id === member.id && (
                          <Check size={14} style={{ color: '#ef4444', marginLeft: 'auto' }} />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* If Timeout action: Duration in Minutes input */}
              {modAction === 'TIMEOUT' && (
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                    Timeout Duration (in minutes):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="40320"
                    value={modDurationMinutes}
                    onChange={(e) => setModDurationMinutes(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      backgroundColor: '#020617',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}

              {/* Reason Input */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Moderation Reason:
                </label>
                <textarea
                  rows="2"
                  placeholder="Enter reason to be logged to Discord..."
                  value={modReason}
                  onChange={(e) => setModReason(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#020617',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'none'
                  }}
                />
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowModModal(false)}
                  style={{ padding: '9px 16px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', cursor: 'pointer', fontWeight: '600' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={executingMod || !modTargetMember}
                  style={{ padding: '9px 20px', borderRadius: '8px', background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', color: '#ffffff', border: 'none', fontWeight: '700', cursor: executingMod || !modTargetMember ? 'not-allowed' : 'pointer' }}
                >
                  {executingMod ? 'Executing...' : `Confirm ${modAction}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
