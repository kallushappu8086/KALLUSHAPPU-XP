import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import {
  BarChart3, Activity, Users, Radio, Volume2, Mic, Lock, RefreshCw,
  Sparkles, Check, AlertCircle, CheckCircle2, Loader2, Trash2,
  ExternalLink, Copy, HelpCircle, Layers, Sliders, Zap, Eye,
  MessageSquare, Settings, CheckSquare, BellRing, Plus, Edit3,
  ListPlus, ChevronRight, Play, Compass, Award, Trophy, Target, Send,
  ChevronLeft
} from 'lucide-react';

export default function AdminServerStats({ guildId }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Active Tab within this section: 'SERVER_STATS' | 'VOICE_SUBTITLES' | 'XP_LEADERBOARD'
  const [activeSubTab, setActiveSubTab] = useState('SERVER_STATS'); // Default to Server & Voice Stats Counters!

  // XP Leaderboard State (Screenshot Replica)
  const [leaderboardData, setLeaderboardData] = useState({ members: [], total: 0, page: 1, totalPages: 1 });
  const [loadingLb, setLoadingLb] = useState(false);
  const [lbTargetChannel, setLbTargetChannel] = useState('');
  const [sendingLb, setSendingLb] = useState(false);
  const [lbPage, setLbPage] = useState(1);

  // Settings State
  const [formSettings, setFormSettings] = useState({
    enabled: true,
    displayMode: 'VOICE_SUBTITLE', // 'VOICE_SUBTITLE' | 'CHANNEL_NAME' | 'BOTH'
    categoryMode: 'SPLIT_CATEGORIES', // 'SPLIT_CATEGORIES' | 'SINGLE_CATEGORY'
    style: 'COMBINED',
    autoUpdateVoice: true,
    autoUpdateMembers: true,
    autoUpdatePresence: true,
    serverStatsHeader: 'Server Statistics :',
    serverStatsChannelName: 'Server Statistics :',
    serverStatsSubtitle: '🌺 {online} Online  🌺 {members} Members',
    serverStatsCategoryId: '',
    serverStatsChannelId: '',
    voiceStatsHeader: 'Voice Statistics :',
    voiceStatsChannelName: 'Voice Statistics :',
    voiceStatsSubtitle: '⋆⁺₊ {vcUsers} VC Users  ⋆⁺₊ {activeVc} Active VC',
    voiceStatsCategoryId: '',
    voiceStatsChannelId: '',
    updateIntervalMinutes: 5,
    voiceChannelSubtitles: [],
    statVoiceChannels: []
  });

  // Dedicated Server Stat Voice Channels State
  const [statVoiceChannels, setStatVoiceChannels] = useState([]);
  const [savingStatChannels, setSavingStatChannels] = useState(false);
  const [applyingStatChannels, setApplyingStatChannels] = useState(false);
  const [runningStatPreset, setRunningStatPreset] = useState(false);
  const [showAddStatModal, setShowAddStatModal] = useState(false);
  const [newStatForm, setNewStatForm] = useState({
    type: 'online',
    channelId: '',
    channelName: '🟢 Online: {online}',
    subtitle: '🌺 {online} Members Online',
    enabled: true
  });

  // Multi-Channel Subtitles State
  const [subtitlesList, setSubtitlesList] = useState([]);
  const [savingSubtitles, setSavingSubtitles] = useState(false);
  const [applyingSubtitles, setApplyingSubtitles] = useState(false);
  const [runningPreset, setRunningPreset] = useState(false);

  // New Subtitle Modal / Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubtitleForm, setNewSubtitleForm] = useState({
    channelId: '',
    channelName: '',
    subtitle: '',
    enabled: true
  });

  const [savingSettings, setSavingSettings] = useState(false);
  const [runningAutoSetup, setRunningAutoSetup] = useState(false);
  const [syncingNow, setSyncingNow] = useState(false);
  const [deletingChannels, setDeletingChannels] = useState(false);

  useEffect(() => {
    if (guildId) {
      fetchServerStatsData();
    }
  }, [guildId]);

  // Real-time automatic polling every 10 seconds for live counters in dashboard
  useEffect(() => {
    if (!guildId) return;
    const pollInterval = setInterval(async () => {
      try {
        const res = await api.getServerStatsDetails(guildId);
        if (res && res.liveStats) {
          setData(prev => prev ? { ...prev, liveStats: res.liveStats } : res);
        }
      } catch (pollErr) {
        // silent background poll
      }
    }, 10000);
    return () => clearInterval(pollInterval);
  }, [guildId]);

  const fetchServerStatsData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.getServerStatsDetails(guildId);
      setData(res);
      if (res.settings) {
        setFormSettings({
          enabled: res.settings.enabled !== false,
          displayMode: res.settings.displayMode || 'VOICE_SUBTITLE',
          categoryMode: res.settings.categoryMode || 'SPLIT_CATEGORIES',
          style: res.settings.style || 'COMBINED',
          autoUpdateVoice: res.settings.autoUpdateVoice !== false,
          autoUpdateMembers: res.settings.autoUpdateMembers !== false,
          autoUpdatePresence: res.settings.autoUpdatePresence !== false,
          serverStatsHeader: res.settings.serverStatsHeader || 'Server Statistics :',
          serverStatsChannelName: res.settings.serverStatsChannelName || 'Server Statistics :',
          serverStatsSubtitle: res.settings.serverStatsSubtitle || '🌺 {online} Online  🌺 {members} Members',
          serverStatsCategoryId: res.settings.serverStatsCategoryId || '',
          serverStatsChannelId: res.settings.serverStatsChannelId || '',
          voiceStatsHeader: res.settings.voiceStatsHeader || 'Voice Statistics :',
          voiceStatsChannelName: res.settings.voiceStatsChannelName || 'Voice Statistics :',
          voiceStatsSubtitle: res.settings.voiceStatsSubtitle || '⋆⁺₊ {vcUsers} VC Users  ⋆⁺₊ {activeVc} Active VC',
          voiceStatsCategoryId: res.settings.voiceStatsCategoryId || '',
          voiceStatsChannelId: res.settings.voiceStatsChannelId || '',
          updateIntervalMinutes: res.settings.updateIntervalMinutes || 5,
          voiceChannelSubtitles: res.settings.voiceChannelSubtitles || []
        });

        // Initialize stat voice channels list
        if (Array.isArray(res.settings.statVoiceChannels) && res.settings.statVoiceChannels.length > 0) {
          setStatVoiceChannels(res.settings.statVoiceChannels);
        } else {
          setStatVoiceChannels([
            { id: '1', type: 'online', channelId: '', channelName: '🟢 Online: {online}', subtitle: '🌺 {online} Members Online', enabled: true },
            { id: '2', type: 'members', channelId: '', channelName: '👥 Members: {members}', subtitle: '👥 {members} Total Members', enabled: true },
            { id: '3', type: 'vcUsers', channelId: '', channelName: '🎙️ In Voice: {vcUsers}', subtitle: '⋆⁺₊ {vcUsers} In Voice Channels', enabled: true }
          ]);
        }

        // Initialize subtitles list
        if (Array.isArray(res.settings.voiceChannelSubtitles) && res.settings.voiceChannelSubtitles.length > 0) {
          setSubtitlesList(res.settings.voiceChannelSubtitles);
        } else {
          // Default preset matching user screenshot if empty
          setSubtitlesList([
            { id: '1', channelId: '', channelName: '☘️ • Solo VC', subtitle: '➡️ Join To Create Solo VC', enabled: true },
            { id: '2', channelId: '', channelName: '☘️ • Duo VC', subtitle: '➡️ Join To Create Duo VC', enabled: true },
            { id: '3', channelId: '', channelName: '☘️ • Trio VC', subtitle: '➡️ Join To Create Trio VC', enabled: true },
            { id: '4', channelId: '', channelName: '☘️ • Squad VC', subtitle: '➡️ Join To Create Squad VC', enabled: true },
            { id: '5', channelId: '', channelName: '☘️ • Custom VC', subtitle: '⏩ Create Your Own VC', enabled: true }
          ]);
        }
      }

      if (res && res.textChannels && res.textChannels.length > 0 && !lbTargetChannel) {
        setLbTargetChannel(res.textChannels[0].id);
      }

      // Fetch initial leaderboard page
      fetchLeaderboard(1);
    } catch (err) {
      console.error('Failed to fetch server stats details:', err);
      setErrorMsg(err.message || 'Failed to load server statistics data');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async (page = 1) => {
    setLoadingLb(true);
    try {
      const res = await api.getLevelLeaderboard(guildId, { page, limit: 10 });
      setLeaderboardData(res || { members: [], total: 0, page: 1, totalPages: 1 });
      setLbPage(page);
    } catch (err) {
      console.error('Failed to load leaderboard data:', err);
    } finally {
      setLoadingLb(false);
    }
  };

  const handleSendLeaderboard = async () => {
    if (!lbTargetChannel) {
      setErrorMsg('Please select a Discord text channel to send the leaderboard.');
      return;
    }
    setSendingLb(true);
    setErrorMsg(null);
    try {
      const res = await api.sendLeaderboardEmbed(guildId, lbTargetChannel, lbPage);
      setSuccessMsg(res.message || 'Interactive XP Leaderboard embed sent to Discord channel successfully!');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send leaderboard embed to Discord.');
    } finally {
      setSendingLb(false);
    }
  };

  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    setSavingSettings(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const payload = {
        ...formSettings,
        voiceChannelSubtitles: subtitlesList,
        statVoiceChannels: statVoiceChannels
      };
      const res = await api.saveServerStatsSettings(guildId, payload);
      setSuccessMsg(res.message || 'Server Statistics & Voice Counter settings saved successfully!');
      setTimeout(() => setSuccessMsg(null), 5000);
      fetchServerStatsData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  // --- SERVER STAT VOICE CHANNELS HANDLERS ---
  const handleAddStatChannel = () => {
    if (!newStatForm.channelName.trim()) {
      alert('Please enter a channel title for this server stat counter.');
      return;
    }

    const matchedChannel = data?.voiceChannels?.find(vc => vc.id === newStatForm.channelId);
    const channelName = newStatForm.channelName.trim() || matchedChannel?.name || 'Stat Channel';

    const newItem = {
      id: Date.now().toString(),
      type: newStatForm.type || 'custom',
      channelId: newStatForm.channelId,
      channelName: channelName,
      subtitle: newStatForm.subtitle.trim(),
      enabled: true
    };

    setStatVoiceChannels(prev => [...prev, newItem]);
    setNewStatForm({ type: 'online', channelId: '', channelName: '🟢 Online: {online}', subtitle: '🌺 {online} Members Online', enabled: true });
    setShowAddStatModal(false);
  };

  const handleRemoveStatChannel = (index) => {
    setStatVoiceChannels(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateStatChannel = (index, field, value) => {
    setStatVoiceChannels(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleApplyStatChannels = async () => {
    setApplyingStatChannels(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await api.applyStatVoiceChannels(guildId, statVoiceChannels, formSettings.serverStatsCategoryId);
      setSuccessMsg(res.message || 'Server stat voice channels created & synchronized with Discord successfully!');
      setTimeout(() => setSuccessMsg(null), 5000);
      fetchServerStatsData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to apply stat voice channels in Discord');
    } finally {
      setApplyingStatChannels(false);
    }
  };

  const handleApplyPresetStatChannels = async (presetType) => {
    if (!window.confirm(`Auto-setup ${presetType} preset? This will automatically create or align the stat voice channels in Discord and configure live counters.`)) {
      return;
    }

    setRunningStatPreset(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await api.setupPresetStatChannels(guildId, presetType);
      setSuccessMsg(res.message || 'Preset stat voice channels created & aligned successfully!');
      setTimeout(() => setSuccessMsg(null), 5000);
      fetchServerStatsData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to setup preset stat channels');
    } finally {
      setRunningStatPreset(false);
    }
  };

  const handleAutoSetup = async () => {
    if (!window.confirm('1-Click Auto Setup will automatically create the locked Server Statistics & Voice Statistics channels with live voice subtitles at the top of your Discord server. Continue?')) {
      return;
    }

    setRunningAutoSetup(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await api.autoSetupServerStats(guildId, formSettings);
      setSuccessMsg(res.message || 'Categories and locked counter channels created successfully with live voice subtitles!');
      setTimeout(() => setSuccessMsg(null), 5000);
      fetchServerStatsData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to auto-setup channels in Discord');
    } finally {
      setRunningAutoSetup(false);
    }
  };

  const handleSyncNow = async () => {
    setSyncingNow(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await api.syncServerStatsNow(guildId);
      setSuccessMsg('Live channel names and voice subtitles updated and synchronized with Discord!');
      setTimeout(() => setSuccessMsg(null), 4000);
      fetchServerStatsData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to sync statistics');
    } finally {
      setSyncingNow(false);
    }
  };

  const handleDeleteChannels = async () => {
    if (!window.confirm('Are you sure you want to delete the stats counter channels from your Discord server? This will remove the categories and counter channels created by the bot.')) {
      return;
    }

    setDeletingChannels(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await api.deleteServerStatsChannels(guildId);
      setSuccessMsg(res.message || 'Stats channels deleted and reset successfully.');
      setTimeout(() => setSuccessMsg(null), 4000);
      fetchServerStatsData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete stats channels');
    } finally {
      setDeletingChannels(false);
    }
  };

  // --- MULTI-VOICE SUBTITLES HANDLERS ---
  const handleAddSubtitleItem = () => {
    if (!newSubtitleForm.subtitle.trim()) {
      alert('Please enter a subtitle for this voice channel.');
      return;
    }

    const matchedChannel = data?.voiceChannels?.find(vc => vc.id === newSubtitleForm.channelId);
    const channelName = newSubtitleForm.channelName.trim() || matchedChannel?.name || 'Voice Channel';

    const newItem = {
      id: Date.now().toString(),
      channelId: newSubtitleForm.channelId,
      channelName: channelName,
      subtitle: newSubtitleForm.subtitle.trim(),
      enabled: true
    };

    setSubtitlesList(prev => [...prev, newItem]);
    setNewSubtitleForm({ channelId: '', channelName: '', subtitle: '', enabled: true });
    setShowAddModal(false);
  };

  const handleRemoveSubtitleItem = (index) => {
    setSubtitlesList(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateSubtitleItem = (index, field, value) => {
    setSubtitlesList(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSaveAndApplySubtitles = async () => {
    setSavingSubtitles(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await api.saveVoiceSubtitles(guildId, subtitlesList, true);
      setSuccessMsg('Voice channel subtitles saved and applied to Discord successfully!');
      setTimeout(() => setSuccessMsg(null), 5000);
      fetchServerStatsData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to apply voice subtitles');
    } finally {
      setSavingSubtitles(false);
    }
  };

  const handleApplyPresetChannels = async (presetType) => {
    if (!window.confirm(`Auto-setup ${presetType} preset? This will automatically create or align the voice channels in Discord and set their subtitles.`)) {
      return;
    }

    setRunningPreset(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await api.setupPresetVoiceSubtitles(guildId, presetType);
      setSuccessMsg(res.message || 'Preset channels and subtitles created successfully!');
      setTimeout(() => setSuccessMsg(null), 5000);
      fetchServerStatsData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to setup preset channels');
    } finally {
      setRunningPreset(false);
    }
  };

  // Helper to format templates for live preview
  const liveStats = data?.liveStats || {
    members: 27466,
    online: 978,
    vcUsers: 29,
    activeVc: 9,
    bots: 4,
    humans: 27462
  };

  const formatPreview = (template) => {
    if (!template) return '';
    return template
      .replace(/\{online\}/gi, (liveStats.online || 0).toLocaleString())
      .replace(/\{members\}/gi, (liveStats.members || 0).toLocaleString())
      .replace(/\{total\}/gi, (liveStats.members || 0).toLocaleString())
      .replace(/\{vcUsers\}/gi, (liveStats.vcUsers || 0).toLocaleString())
      .replace(/\{voiceUsers\}/gi, (liveStats.vcUsers || 0).toLocaleString())
      .replace(/\{activeVc\}/gi, (liveStats.activeVc || 0).toLocaleString())
      .replace(/\{activeVoice\}/gi, (liveStats.activeVc || 0).toLocaleString())
      .replace(/\{bots\}/gi, (liveStats.bots || 0).toLocaleString())
      .replace(/\{humans\}/gi, (liveStats.humans || 0).toLocaleString());
  };

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#94a3b8' }}>
        <Loader2 size={36} className="spin" style={{ color: '#6366f1', marginBottom: '14px' }} />
        <div style={{ fontWeight: '700', fontSize: '1rem', color: '#f8fafc' }}>
          Loading Server & Voice Statistics...
        </div>
        <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>
          Fetching real-time Discord counts and channel configuration
        </div>
      </div>
    );
  }

  const channelsStatus = data?.channelsStatus || {};
  const isChannelsSetup = channelsStatus.serverChannelExists || channelsStatus.voiceChannelExists;
  const availableVoiceChannels = data?.voiceChannels || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Top Banner Alert Feedback */}
      {errorMsg && (
        <div style={{
          padding: '14px 18px',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '12px',
          color: '#f87171',
          fontSize: '0.88rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <AlertCircle size={20} />
          <span style={{ flex: 1 }}>{errorMsg}</span>
          <button
            onClick={() => setErrorMsg(null)}
            style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ✕
          </button>
        </div>
      )}

      {successMsg && (
        <div style={{
          padding: '14px 18px',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '12px',
          color: '#34d399',
          fontSize: '0.88rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CheckCircle2 size={20} />
          <span style={{ flex: 1 }}>{successMsg}</span>
          <button
            onClick={() => setSuccessMsg(null)}
            style={{ background: 'none', border: 'none', color: '#34d399', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* TOP NAVIGATION BAR: Switch between Multi-Voice Subtitles & Server Stats */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        padding: '12px 16px',
        backgroundColor: '#0f172a',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setActiveSubTab('SERVER_STATS')}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: activeSubTab === 'SERVER_STATS' ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid transparent',
              backgroundColor: activeSubTab === 'SERVER_STATS' ? '#6366f1' : 'rgba(255, 255, 255, 0.05)',
              color: activeSubTab === 'SERVER_STATS' ? '#ffffff' : '#cbd5e1',
              fontWeight: '800',
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <BarChart3 size={17} />
            Server & Voice Stats Counters
            <span style={{
              backgroundColor: activeSubTab === 'SERVER_STATS' ? 'rgba(255,255,255,0.25)' : 'rgba(99, 102, 241, 0.2)',
              color: activeSubTab === 'SERVER_STATS' ? '#ffffff' : '#a5b4fc',
              fontSize: '0.7rem',
              padding: '2px 6px',
              borderRadius: '6px',
              fontWeight: '800'
            }}>
              {statVoiceChannels.length} STAT CHANNELS
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('VOICE_SUBTITLES')}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: activeSubTab === 'VOICE_SUBTITLES' ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid transparent',
              backgroundColor: activeSubTab === 'VOICE_SUBTITLES' ? '#10b981' : 'rgba(255, 255, 255, 0.05)',
              color: activeSubTab === 'VOICE_SUBTITLES' ? '#ffffff' : '#cbd5e1',
              fontWeight: '800',
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Mic size={17} />
            Voice Channel Subtitles
            <span style={{
              backgroundColor: activeSubTab === 'VOICE_SUBTITLES' ? 'rgba(255,255,255,0.25)' : 'rgba(16, 185, 129, 0.2)',
              color: activeSubTab === 'VOICE_SUBTITLES' ? '#ffffff' : '#34d399',
              fontSize: '0.7rem',
              padding: '2px 6px',
              borderRadius: '6px',
              fontWeight: '800'
            }}>
              {subtitlesList.length} CHANNELS
            </span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab('XP_LEADERBOARD');
              fetchLeaderboard(lbPage);
            }}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: activeSubTab === 'XP_LEADERBOARD' ? '1px solid rgba(234, 179, 8, 0.5)' : '1px solid transparent',
              backgroundColor: activeSubTab === 'XP_LEADERBOARD' ? '#eab308' : 'rgba(255, 255, 255, 0.05)',
              color: activeSubTab === 'XP_LEADERBOARD' ? '#000000' : '#cbd5e1',
              fontWeight: '800',
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Trophy size={17} />
            XP Leaderboard
            <span style={{
              backgroundColor: activeSubTab === 'XP_LEADERBOARD' ? 'rgba(0,0,0,0.2)' : 'rgba(234, 179, 8, 0.2)',
              color: activeSubTab === 'XP_LEADERBOARD' ? '#000000' : '#facc15',
              fontSize: '0.7rem',
              padding: '2px 6px',
              borderRadius: '6px',
              fontWeight: '800'
            }}>
              SCREENSHOT DESIGN
            </span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '0.75rem',
            color: '#34d399',
            fontWeight: '700'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981',
              display: 'inline-block'
            }} />
            Auto-Update: Live
          </div>

          <button
            onClick={handleSyncNow}
            disabled={syncingNow}
            style={{
              padding: '9px 15px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '10px',
              color: '#cbd5e1',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: syncingNow ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RefreshCw size={14} className={syncingNow ? 'spin' : ''} />
            Sync Now
          </button>

          {activeSubTab === 'SERVER_STATS' ? (
            <button
              onClick={handleApplyStatChannels}
              disabled={applyingStatChannels}
              style={{
                padding: '9px 18px',
                backgroundColor: '#6366f1',
                border: 'none',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: applyingStatChannels ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
              }}
            >
              {applyingStatChannels ? <Loader2 size={14} className="spin" /> : <Check size={14} />}
              Apply All Counters To Discord
            </button>
          ) : (
            <button
              onClick={handleSaveAndApplySubtitles}
              disabled={savingSubtitles}
              style={{
                padding: '9px 18px',
                backgroundColor: '#10b981',
                border: 'none',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: savingSubtitles ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}
            >
              {savingSubtitles ? <Loader2 size={14} className="spin" /> : <Check size={14} />}
              Apply All To Discord
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION A: MULTI-VOICE CHANNEL SUBTITLES MANAGER (USER REQUEST SCREENSHOT)*/}
      {/* ========================================================================= */}
      {activeSubTab === 'VOICE_SUBTITLES' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* 2-Column Layout: Visual Live Discord Preview vs Channel Subtitle Manager */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(330px, 430px) 1fr', gap: '24px' }}>

            {/* LEFT COLUMN: LIVE DISCORD PREVIEW OF MULTI-VOICE SUBTITLES */}
            <div style={{
              backgroundColor: '#0f172a',
              borderRadius: '18px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Eye size={18} style={{ color: '#34d399' }} />
                  <span style={{ fontWeight: '800', fontSize: '0.95rem', color: '#f8fafc' }}>
                    Discord Voice Subtitles Preview
                  </span>
                </div>
                <span style={{
                  fontSize: '0.7rem',
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  color: '#34d399',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontWeight: '700'
                }}>
                  VOICE STATUS
                </span>
              </div>

              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
                This matches the exact Discord client appearance with voice channel name and small downside subtitle text:
              </p>

              {/* DISCORD SIDEBAR MOCKUP CONTAINER */}
              <div style={{
                backgroundColor: '#1e1f22',
                borderRadius: '14px',
                padding: '20px 16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: 'inset 0 2px 14px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                maxHeight: '440px',
                overflowY: 'auto'
              }}>

                {subtitlesList.filter(item => item.enabled !== false).map((item, index) => {
                  const channelTitle = item.channelName || (availableVoiceChannels.find(vc => vc.id === item.channelId)?.name) || `Voice Channel ${index + 1}`;
                  return (
                    <div key={item.id || index} style={{ display: 'flex', flexDirection: 'column' }}>
                      {/* Top Voice Channel Name with Speaker Icon */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#dbdee1',
                        fontSize: '0.92rem',
                        fontWeight: '600'
                      }}>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#949ba4'
                        }}>
                          <Volume2 size={16} strokeWidth={2.4} />
                        </div>
                        <span>{channelTitle}</span>
                      </div>

                      {/* Small Subtitle on downside of voice channel */}
                      <div style={{
                        marginLeft: '26px',
                        marginTop: '3px',
                        display: 'flex',
                        alignItems: 'center',
                        color: '#949ba4',
                        fontSize: '0.78rem',
                        fontWeight: '600',
                        letterSpacing: '0.01em'
                      }}>
                        <span style={{ color: '#c4c9ce' }}>
                          {formatPreview(item.subtitle)}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {subtitlesList.filter(item => item.enabled !== false).length === 0 && (
                  <div style={{ textAlign: 'center', padding: '30px 10px', color: '#64748b', fontSize: '0.85rem' }}>
                    No voice channel subtitles enabled. Click "+ Add Voice Channel Subtitle" or a preset to add channels!
                  </div>
                )}

              </div>

              {/* 1-Click Quick Preset Setup */}
              <div style={{ marginTop: '4px' }}>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '700', marginBottom: '8px' }}>
                  1-Click Auto Presets:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetChannels('JOIN_TO_CREATE')}
                    disabled={runningPreset}
                    style={{
                      padding: '10px 12px',
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      borderRadius: '10px',
                      color: '#34d399',
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      cursor: runningPreset ? 'not-allowed' : 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    ☘️ Join To Create (Screenshot)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyPresetChannels('GAMING')}
                    disabled={runningPreset}
                    style={{
                      padding: '10px 12px',
                      backgroundColor: 'rgba(234, 179, 8, 0.15)',
                      border: '1px solid rgba(234, 179, 8, 0.4)',
                      borderRadius: '10px',
                      color: '#facc15',
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      cursor: runningPreset ? 'not-allowed' : 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    🎮 Gaming Squad Comms
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyPresetChannels('AESTHETIC')}
                    disabled={runningPreset}
                    style={{
                      padding: '10px 12px',
                      backgroundColor: 'rgba(236, 72, 153, 0.15)',
                      border: '1px solid rgba(236, 72, 153, 0.4)',
                      borderRadius: '10px',
                      color: '#f472b6',
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      cursor: runningPreset ? 'not-allowed' : 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    🌸 Aesthetic Lounges
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSubtitlesList([
                        { id: '1', channelId: '', channelName: '☘️ • Solo VC', subtitle: '➡️ Join To Create Solo VC', enabled: true },
                        { id: '2', channelId: '', channelName: '☘️ • Duo VC', subtitle: '➡️ Join To Create Duo VC', enabled: true },
                        { id: '3', channelId: '', channelName: '☘️ • Trio VC', subtitle: '➡️ Join To Create Trio VC', enabled: true },
                        { id: '4', channelId: '', channelName: '☘️ • Squad VC', subtitle: '➡️ Join To Create Squad VC', enabled: true },
                        { id: '5', channelId: '', channelName: '☘️ • Custom VC', subtitle: '⏩ Create Your Own VC', enabled: true }
                      ]);
                    }}
                    style={{
                      padding: '10px 12px',
                      backgroundColor: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.4)',
                      borderRadius: '10px',
                      color: '#a5b4fc',
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    🔄 Fill Form with 5 VCs
                  </button>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: MULTI-CHANNEL SUBTITLES LIST & CUSTOMIZER */}
            <div style={{
              backgroundColor: '#0f172a',
              borderRadius: '18px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mic size={22} style={{ color: '#10b981' }} />
                    Manage Voice Channels & Subtitles
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                    Add as many voice channels as you want and fully customize their subtitles with emojis and text.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  style={{
                    padding: '9px 16px',
                    backgroundColor: '#6366f1',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '0.84rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
                  }}
                >
                  <Plus size={16} />
                  Add Voice Channel
                </button>
              </div>

              {/* LIST OF VOICE CHANNELS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {subtitlesList.map((item, index) => (
                  <div key={item.id || index} style={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                        <Volume2 size={18} color="#10b981" />
                        <span style={{ fontWeight: '800', fontSize: '0.92rem', color: '#ffffff' }}>
                          Channel #{index + 1}
                        </span>
                        <span style={{
                          fontSize: '0.72rem',
                          backgroundColor: item.channelId ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                          color: item.channelId ? '#34d399' : '#fbbf24',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontWeight: '700'
                        }}>
                          {item.channelId ? 'LINKED TO VC' : 'AUTO-MANAGED NAME'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Enable toggle */}
                        <button
                          type="button"
                          onClick={() => handleUpdateSubtitleItem(index, 'enabled', item.enabled === false)}
                          style={{
                            padding: '4px 10px',
                            backgroundColor: item.enabled !== false ? 'rgba(16, 185, 129, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                            color: item.enabled !== false ? '#34d399' : '#94a3b8',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          {item.enabled !== false ? 'ACTIVE' : 'PAUSED'}
                        </button>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveSubtitleItem(index)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#f87171',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="Delete voice channel item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>

                      {/* Channel Name or Selector */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '4px' }}>
                          Voice Channel Name / Link:
                        </label>
                        {availableVoiceChannels.length > 0 ? (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <select
                              value={item.channelId || ''}
                              onChange={(e) => {
                                const selectedId = e.target.value;
                                const matched = availableVoiceChannels.find(vc => vc.id === selectedId);
                                handleUpdateSubtitleItem(index, 'channelId', selectedId);
                                if (matched) {
                                  handleUpdateSubtitleItem(index, 'channelName', matched.name);
                                }
                              }}
                              style={{
                                flex: 1,
                                padding: '8px 10px',
                                backgroundColor: '#0f172a',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                borderRadius: '8px',
                                color: '#ffffff',
                                fontSize: '0.82rem',
                                outline: 'none'
                              }}
                            >
                              <option value="">(Custom / Auto-manage)</option>
                              {availableVoiceChannels.map(vc => (
                                <option key={vc.id} value={vc.id}>
                                  🔊 {vc.name}
                                </option>
                              ))}
                            </select>
                            <input
                              type="text"
                              value={item.channelName || ''}
                              onChange={(e) => handleUpdateSubtitleItem(index, 'channelName', e.target.value)}
                              placeholder="Channel title"
                              style={{
                                width: '130px',
                                padding: '8px 10px',
                                backgroundColor: '#0f172a',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                borderRadius: '8px',
                                color: '#ffffff',
                                fontSize: '0.82rem',
                                outline: 'none'
                              }}
                            />
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={item.channelName || ''}
                            onChange={(e) => handleUpdateSubtitleItem(index, 'channelName', e.target.value)}
                            placeholder="e.g. ☘️ • Solo VC"
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              backgroundColor: '#0f172a',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              borderRadius: '8px',
                              color: '#ffffff',
                              fontSize: '0.82rem',
                              outline: 'none',
                              boxSizing: 'border-box'
                            }}
                          />
                        )}
                      </div>

                      {/* Subtitle Input */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '4px' }}>
                          Voice Subtitle (Downside Small Text):
                        </label>
                        <input
                          type="text"
                          value={item.subtitle || ''}
                          onChange={(e) => handleUpdateSubtitleItem(index, 'subtitle', e.target.value)}
                          placeholder="e.g. ➡️ Join To Create Solo VC"
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            backgroundColor: '#0f172a',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '8px',
                            color: '#ffffff',
                            fontSize: '0.82rem',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                    </div>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  style={{
                    padding: '10px 18px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px dashed rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    color: '#cbd5e1',
                    fontSize: '0.84rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={16} />
                  Add Another Voice Channel
                </button>

                <button
                  type="button"
                  onClick={handleSaveAndApplySubtitles}
                  disabled={savingSubtitles}
                  style={{
                    padding: '11px 24px',
                    backgroundColor: '#10b981',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    fontWeight: '800',
                    cursor: savingSubtitles ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
                  }}
                >
                  {savingSubtitles ? <Loader2 size={16} className="spin" /> : <Check size={16} />}
                  Save & Apply Subtitles Now
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION B: SERVER & VOICE STATS COUNTERS (ORIGINAL COUNTER CHANNELS TAB)  */}
      {/* ========================================================================= */}
      {activeSubTab === 'SERVER_STATS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* 1. TOP LIVE REAL-TIME STATS RIBBON / COUNTERS */}
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '18px',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Activity size={22} style={{ color: '#818cf8' }} />
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>
                    Real-Time Discord Server & Voice Counters
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                    Live Discord stats automatically refreshed & synced every 10 seconds. Voice status updates in 3s on member movement.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  fontSize: '0.74rem',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  color: '#34d399',
                  padding: '5px 10px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }} />
                  Live Event Updater Active
                </span>

                <button
                  type="button"
                  onClick={fetchServerStatsData}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#cbd5e1',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RefreshCw size={13} />
                  Refresh
                </button>
              </div>
            </div>

            {/* 6 Real-time Count Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
              <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '14px', border: '1px solid rgba(34, 197, 94, 0.25)' }}>
                <div style={{ fontSize: '0.72rem', color: '#86efac', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span>🟢</span> ONLINE MEMBERS
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#ffffff', marginTop: '4px' }}>
                  {(liveStats.online || 0).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                  {`Tag: {online}`}
                </div>
              </div>

              <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '14px', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
                <div style={{ fontSize: '0.72rem', color: '#a5b4fc', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span>👥</span> TOTAL MEMBERS
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#ffffff', marginTop: '4px' }}>
                  {(liveStats.members || 0).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                  {`Tag: {members}`}
                </div>
              </div>

              <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '14px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                <div style={{ fontSize: '0.72rem', color: '#7dd3fc', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span>🎙️</span> IN VOICE CHANNELS
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#ffffff', marginTop: '4px' }}>
                  {(liveStats.vcUsers || 0).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                  {`Tag: {vcUsers}`}
                </div>
              </div>

              <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '14px', border: '1px solid rgba(236, 72, 153, 0.25)' }}>
                <div style={{ fontSize: '0.72rem', color: '#f472b6', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span>🔊</span> ACTIVE VCS
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#ffffff', marginTop: '4px' }}>
                  {(liveStats.activeVc || 0).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                  {`Tag: {activeVc}`}
                </div>
              </div>

              <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '14px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                <div style={{ fontSize: '0.72rem', color: '#fcd34d', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span>🤖</span> BOT COUNT
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#ffffff', marginTop: '4px' }}>
                  {(liveStats.bots || 0).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                  {`Tag: {bots}`}
                </div>
              </div>

              <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '14px', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
                <div style={{ fontSize: '0.72rem', color: '#cbd5e1', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span>👤</span> HUMAN USERS
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#ffffff', marginTop: '4px' }}>
                  {(liveStats.humans || 0).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                  {`Tag: {humans}`}
                </div>
              </div>
            </div>
          </div>

          {/* 2. MAIN 2-COLUMN LAYOUT: PREVIEW ON LEFT vs STAT VOICE CHANNELS MANAGER ON RIGHT */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(330px, 430px) 1fr', gap: '24px' }}>

            {/* LEFT COLUMN: LIVE DISCORD PREVIEW */}
            <div style={{
              backgroundColor: '#0f172a',
              borderRadius: '18px',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Eye size={18} style={{ color: '#818cf8' }} />
                  <span style={{ fontWeight: '800', fontSize: '0.95rem', color: '#f8fafc' }}>
                    Discord Counter Channels Preview
                  </span>
                </div>
                <span style={{
                  fontSize: '0.7rem',
                  backgroundColor: 'rgba(99, 102, 241, 0.2)',
                  color: '#a5b4fc',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontWeight: '700'
                }}>
                  LOCKED VOICE CHANNELS
                </span>
              </div>

              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
                Displays as locked voice channels with live counter titles and real-time status subtitles:
              </p>

              {/* DISCORD SIDEBAR MOCKUP */}
              <div style={{
                backgroundColor: '#1e1f22',
                borderRadius: '14px',
                padding: '20px 16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: 'inset 0 2px 14px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                maxHeight: '460px',
                overflowY: 'auto'
              }}>
                {/* Category Header */}
                <div style={{
                  fontSize: '0.74rem',
                  fontWeight: '800',
                  color: '#949ba4',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span>▼</span>
                  <span>{formSettings.serverStatsHeader || '📊 SERVER STATISTICS :'}</span>
                </div>

                {/* List of active stat voice channels */}
                {statVoiceChannels.filter(c => c.enabled !== false).map((chan, idx) => {
                  const channelTitle = formatPreview(chan.channelName || `Stat Channel ${idx + 1}`);
                  return (
                    <div key={chan.id || idx} style={{ display: 'flex', flexDirection: 'column' }}>
                      {/* Top Voice Channel Name with Lock Icon */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#dbdee1',
                        fontSize: '0.92rem',
                        fontWeight: '600'
                      }}>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#949ba4'
                        }}>
                          <Lock size={15} strokeWidth={2.4} />
                        </div>
                        <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {channelTitle}
                        </span>
                      </div>

                      {/* Downside Voice Subtitle Status */}
                      {chan.subtitle && (
                        <div style={{
                          marginLeft: '26px',
                          marginTop: '3px',
                          display: 'flex',
                          alignItems: 'center',
                          color: '#949ba4',
                          fontSize: '0.78rem',
                          fontWeight: '600',
                          letterSpacing: '0.01em'
                        }}>
                          <span style={{ color: '#c4c9ce' }}>
                            {formatPreview(chan.subtitle)}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}

                {statVoiceChannels.filter(c => c.enabled !== false).length === 0 && (
                  <div style={{ textAlign: 'center', padding: '30px 10px', color: '#64748b', fontSize: '0.85rem' }}>
                    No server stat voice channels enabled. Click "+ Add Stat Voice Channel" or a preset to add counters!
                  </div>
                )}
              </div>

              {/* 1-Click Auto Preset Setup */}
              <div style={{ marginTop: '4px' }}>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '700', marginBottom: '8px' }}>
                  1-Click Stat Channel Presets:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetStatChannels('CORE_3')}
                    disabled={runningStatPreset}
                    style={{
                      padding: '10px 12px',
                      backgroundColor: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.4)',
                      borderRadius: '10px',
                      color: '#a5b4fc',
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      cursor: runningStatPreset ? 'not-allowed' : 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    ⚡ Core 3 Counters (Online, Members, VC)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyPresetStatChannels('ALL_6')}
                    disabled={runningStatPreset}
                    style={{
                      padding: '10px 12px',
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      borderRadius: '10px',
                      color: '#34d399',
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      cursor: runningStatPreset ? 'not-allowed' : 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    🌟 Full 6 Counters (All Stats)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyPresetStatChannels('AESTHETIC')}
                    disabled={runningStatPreset}
                    style={{
                      padding: '10px 12px',
                      backgroundColor: 'rgba(236, 72, 153, 0.15)',
                      border: '1px solid rgba(236, 72, 153, 0.4)',
                      borderRadius: '10px',
                      color: '#f472b6',
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      cursor: runningStatPreset ? 'not-allowed' : 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    🌸 Aesthetic Subtitle Counters
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStatVoiceChannels([
                        { id: '1', type: 'online', channelId: '', channelName: '🟢 Online: {online}', subtitle: '🌺 {online} Members Online', enabled: true },
                        { id: '2', type: 'members', channelId: '', channelName: '👥 Members: {members}', subtitle: '👥 {members} Total Members', enabled: true },
                        { id: '3', type: 'vcUsers', channelId: '', channelName: '🎙️ In Voice: {vcUsers}', subtitle: '⋆⁺₊ {vcUsers} In Voice Channels', enabled: true },
                        { id: '4', type: 'activeVc', channelId: '', channelName: '🔊 Active VCs: {activeVc}', subtitle: '⋆⁺₊ {activeVc} Active Channels', enabled: true }
                      ]);
                    }}
                    style={{
                      padding: '10px 12px',
                      backgroundColor: 'rgba(234, 179, 8, 0.15)',
                      border: '1px solid rgba(234, 179, 8, 0.4)',
                      borderRadius: '10px',
                      color: '#facc15',
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    🔄 Fill Form with 4 Counters
                  </button>
                </div>
              </div>

              {/* Delete / Reset All Channels Button */}
              <div style={{ marginTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
                <button
                  type="button"
                  onClick={handleDeleteChannels}
                  disabled={deletingChannels}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    color: '#f87171',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: deletingChannels ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Trash2 size={14} />
                  Reset / Delete Channels from Discord
                </button>
              </div>

            </div>

            {/* RIGHT COLUMN: VOICE CHANNELS FOR SERVER STATS MANAGER */}
            <div style={{
              backgroundColor: '#0f172a',
              borderRadius: '18px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BarChart3 size={22} style={{ color: '#6366f1' }} />
                    Voice Channels for Server Stats
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                    Add as many voice channels as you want for server stats (online members, in voice, total members). All update automatically!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddStatModal(true)}
                  style={{
                    padding: '9px 16px',
                    backgroundColor: '#6366f1',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '0.84rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
                  }}
                >
                  <Plus size={16} />
                  Add Stat Voice Channel
                </button>
              </div>

              {/* LIST OF STAT VOICE CHANNELS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {statVoiceChannels.map((item, index) => (
                  <div key={item.id || index} style={{
                    backgroundColor: '#1e293b',
                    borderRadius: '14px',
                    padding: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    {/* Top Row: Channel #, Type Tag, Link Status, Enabled, Delete */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Lock size={18} color="#818cf8" />
                        <span style={{ fontWeight: '800', fontSize: '0.92rem', color: '#ffffff' }}>
                          Channel #{index + 1}
                        </span>

                        <span style={{
                          fontSize: '0.72rem',
                          backgroundColor: 'rgba(99, 102, 241, 0.2)',
                          color: '#a5b4fc',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontWeight: '700'
                        }}>
                          {item.type ? item.type.toUpperCase() : 'COUNTER'}
                        </span>

                        <span style={{
                          fontSize: '0.72rem',
                          backgroundColor: item.channelId ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                          color: item.channelId ? '#34d399' : '#fbbf24',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontWeight: '700'
                        }}>
                          {item.channelId ? 'LINKED TO DISCORD VC' : 'AUTO-MANAGED BY BOT'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatChannel(index, 'enabled', item.enabled === false)}
                          style={{
                            padding: '4px 10px',
                            backgroundColor: item.enabled !== false ? 'rgba(16, 185, 129, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                            color: item.enabled !== false ? '#34d399' : '#94a3b8',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          {item.enabled !== false ? 'ACTIVE' : 'PAUSED'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveStatChannel(index)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#f87171',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="Delete stat voice channel"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Quick Preset Selector for this channel */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '4px' }}>
                          Stat Counter Preset Type:
                        </label>
                        <select
                          value={item.type || 'custom'}
                          onChange={(e) => {
                            const selectedType = e.target.value;
                            handleUpdateStatChannel(index, 'type', selectedType);
                            if (selectedType === 'online') {
                              handleUpdateStatChannel(index, 'channelName', '🟢 Online: {online}');
                              handleUpdateStatChannel(index, 'subtitle', '🌺 {online} Members Online');
                            } else if (selectedType === 'members') {
                              handleUpdateStatChannel(index, 'channelName', '👥 Members: {members}');
                              handleUpdateStatChannel(index, 'subtitle', '👥 {members} Total Members');
                            } else if (selectedType === 'vcUsers') {
                              handleUpdateStatChannel(index, 'channelName', '🎙️ In Voice: {vcUsers}');
                              handleUpdateStatChannel(index, 'subtitle', '⋆⁺₊ {vcUsers} In Voice Channels');
                            } else if (selectedType === 'activeVc') {
                              handleUpdateStatChannel(index, 'channelName', '🔊 Active VCs: {activeVc}');
                              handleUpdateStatChannel(index, 'subtitle', '⋆⁺₊ {activeVc} Active Channels');
                            } else if (selectedType === 'bots') {
                              handleUpdateStatChannel(index, 'channelName', '🤖 Bots: {bots}');
                              handleUpdateStatChannel(index, 'subtitle', '🤖 {bots} System Bots');
                            } else if (selectedType === 'humans') {
                              handleUpdateStatChannel(index, 'channelName', '👤 Humans: {humans}');
                              handleUpdateStatChannel(index, 'subtitle', '👤 {humans} Human Members');
                            }
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            backgroundColor: '#0f172a',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '8px',
                            color: '#ffffff',
                            fontSize: '0.82rem',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        >
                          <option value="online">🟢 Online Members ({liveStats.online})</option>
                          <option value="members">👥 Total Members ({liveStats.members})</option>
                          <option value="vcUsers">🎙️ Members in Voice Channels ({liveStats.vcUsers})</option>
                          <option value="activeVc">🔊 Active Voice Channels ({liveStats.activeVc})</option>
                          <option value="bots">🤖 Bot Count ({liveStats.bots})</option>
                          <option value="humans">👤 Human Members ({liveStats.humans})</option>
                          <option value="custom">⚙️ Custom Counter Template</option>
                        </select>
                      </div>

                      {/* Select existing channel or auto-manage */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '4px' }}>
                          Voice Channel Link (Optional):
                        </label>
                        <select
                          value={item.channelId || ''}
                          onChange={(e) => handleUpdateStatChannel(index, 'channelId', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            backgroundColor: '#0f172a',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '8px',
                            color: '#ffffff',
                            fontSize: '0.82rem',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        >
                          <option value="">(Auto-create locked counter channel)</option>
                          {availableVoiceChannels.map(vc => (
                            <option key={vc.id} value={vc.id}>
                              🔊 {vc.name} (ID: {vc.id})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Inputs: Channel Title & Voice Subtitle */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '4px' }}>
                          Channel Title (Top Line):
                        </label>
                        <input
                          type="text"
                          value={item.channelName || ''}
                          onChange={(e) => handleUpdateStatChannel(index, 'channelName', e.target.value)}
                          placeholder="e.g. 🟢 Online: {online}"
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            backgroundColor: '#0f172a',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '8px',
                            color: '#ffffff',
                            fontSize: '0.82rem',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '4px' }}>
                          Voice Subtitle (Downside Small Text):
                        </label>
                        <input
                          type="text"
                          value={item.subtitle || ''}
                          onChange={(e) => handleUpdateStatChannel(index, 'subtitle', e.target.value)}
                          placeholder="e.g. 🌺 {online} Members Online"
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            backgroundColor: '#0f172a',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '8px',
                            color: '#ffffff',
                            fontSize: '0.82rem',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </div>

                    {/* Variable Pills */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '700' }}>Insert Tag:</span>
                      {[
                        { tag: '{online}', label: 'Online' },
                        { tag: '{members}', label: 'Members' },
                        { tag: '{vcUsers}', label: 'In Voice' },
                        { tag: '{activeVc}', label: 'Active VC' },
                        { tag: '{bots}', label: 'Bots' },
                        { tag: '{humans}', label: 'Humans' }
                      ].map(pill => (
                        <button
                          key={pill.tag}
                          type="button"
                          onClick={() => handleUpdateStatChannel(index, 'channelName', (item.channelName || '') + ' ' + pill.tag)}
                          style={{
                            padding: '2px 6px',
                            backgroundColor: 'rgba(99, 102, 241, 0.12)',
                            border: '1px solid rgba(99, 102, 241, 0.25)',
                            borderRadius: '5px',
                            color: '#a5b4fc',
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                          title={`Insert ${pill.label}`}
                        >
                          + {pill.tag}
                        </button>
                      ))}
                    </div>

                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddStatModal(true)}
                  style={{
                    padding: '10px 18px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px dashed rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    color: '#cbd5e1',
                    fontSize: '0.84rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={16} />
                  Add Another Stat Voice Channel
                </button>

                <button
                  type="button"
                  onClick={handleApplyStatChannels}
                  disabled={applyingStatChannels}
                  style={{
                    padding: '11px 24px',
                    backgroundColor: '#6366f1',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    fontWeight: '800',
                    cursor: applyingStatChannels ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
                  }}
                >
                  {applyingStatChannels ? <Loader2 size={16} className="spin" /> : <Check size={16} />}
                  Apply All Counters To Discord Now
                </button>
              </div>

            </div>

          </div>

          {/* 3. AUTO-UPDATE & CATEGORY SETTINGS CARD */}
          <form onSubmit={handleSaveSettings} style={{
            backgroundColor: '#0f172a',
            borderRadius: '18px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={20} style={{ color: '#818cf8' }} />
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>
                  Auto-Update & Channel Display Preferences
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                  Choose which Discord events automatically update these counters and where to position them.
                </p>
              </div>
            </div>

            {/* Event Checkboxes */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                backgroundColor: '#1e293b',
                padding: '12px 14px',
                borderRadius: '10px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={formSettings.autoUpdateVoice}
                  onChange={(e) => setFormSettings({ ...formSettings, autoUpdateVoice: e.target.checked })}
                  style={{ marginTop: '3px' }}
                />
                <div>
                  <div style={{ fontWeight: '800', fontSize: '0.84rem', color: '#ffffff' }}>
                    🎙️ Voice Events Auto-Update
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                    Updates in real-time when members join, leave, or move between voice channels.
                  </div>
                </div>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                backgroundColor: '#1e293b',
                padding: '12px 14px',
                borderRadius: '10px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={formSettings.autoUpdatePresence}
                  onChange={(e) => setFormSettings({ ...formSettings, autoUpdatePresence: e.target.checked })}
                  style={{ marginTop: '3px' }}
                />
                <div>
                  <div style={{ fontWeight: '800', fontSize: '0.84rem', color: '#ffffff' }}>
                    🟢 Presence Events Auto-Update
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                    Updates in real-time when members come online, go idle, or go offline.
                  </div>
                </div>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                backgroundColor: '#1e293b',
                padding: '12px 14px',
                borderRadius: '10px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={formSettings.autoUpdateMembers}
                  onChange={(e) => setFormSettings({ ...formSettings, autoUpdateMembers: e.target.checked })}
                  style={{ marginTop: '3px' }}
                />
                <div>
                  <div style={{ fontWeight: '800', fontSize: '0.84rem', color: '#ffffff' }}>
                    👥 Member Events Auto-Update
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                    Updates in real-time when new members join or leave your Discord server.
                  </div>
                </div>
              </label>
            </div>

            {/* Display Mode & Category */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                  Counters Display Mode:
                </label>
                <select
                  value={formSettings.displayMode}
                  onChange={(e) => setFormSettings({ ...formSettings, displayMode: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                >
                  <option value="VOICE_SUBTITLE">🎙️ Voice Subtitle (Clean Channel Name + Subtitle Counts)</option>
                  <option value="CHANNEL_NAME">🏷️ Channel Name (Channel Name shows live counts)</option>
                  <option value="BOTH">⚡ Both (Both Channel Name and Subtitle show live counts)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                  Discord Stats Category:
                </label>
                <select
                  value={formSettings.serverStatsCategoryId}
                  onChange={(e) => setFormSettings({ ...formSettings, serverStatsCategoryId: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                >
                  <option value="">(Auto-create 📊 SERVER STATISTICS : category)</option>
                  {(data?.categories || []).map(cat => (
                    <option key={cat.id} value={cat.id}>
                      📁 {cat.name} (ID: {cat.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
              <button
                type="submit"
                disabled={savingSettings}
                style={{
                  padding: '12px 28px',
                  backgroundColor: '#6366f1',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  cursor: savingSettings ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
                }}
              >
                {savingSettings ? <Loader2 size={16} className="spin" /> : <Check size={16} />}
                Save & Synchronize All Settings
              </button>
            </div>
          </form>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION C: XP LEADERBOARD (MATCHING USER SCREENSHOT DESIGN)               */}
      {/* ========================================================================= */}
      {activeSubTab === 'XP_LEADERBOARD' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Top Control Bar: Select Channel & Broadcast Embed */}
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '16px',
            padding: '20px 24px',
            border: '1px solid rgba(234, 179, 8, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trophy size={20} color="#eab308" />
                Discord XP Leaderboard Embed
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                Matches the exact layout from your screenshot with <strong>🎯 Server Activity</strong> & <strong>🏆 Leaderboard</strong>, Discord mention pills, and interactive pagination buttons.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {/* Channel Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: '700' }}>Post to Channel:</span>
                <select
                  value={lbTargetChannel}
                  onChange={(e) => setLbTargetChannel(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    outline: 'none',
                    minWidth: '180px'
                  }}
                >
                  <option value="">(Select text channel)</option>
                  {(data?.textChannels || []).map(tc => (
                    <option key={tc.id} value={tc.id}>
                      #{tc.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleSendLeaderboard}
                disabled={sendingLb}
                style={{
                  padding: '9px 16px',
                  backgroundColor: '#eab308',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#000000',
                  fontWeight: '800',
                  fontSize: '0.84rem',
                  cursor: sendingLb ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(234, 179, 8, 0.3)'
                }}
              >
                {sendingLb ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
                Send Embed to Channel
              </button>

              <button
                type="button"
                onClick={() => fetchLeaderboard(lbPage)}
                disabled={loadingLb}
                style={{
                  padding: '9px 14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  color: '#cbd5e1',
                  fontWeight: '700',
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RefreshCw size={14} className={loadingLb ? 'spin' : ''} />
                Refresh
              </button>
            </div>
          </div>

          {/* 2-COLUMN VIEW: Discord Embed Mockup (Left) & Chat Command / Settings Guide (Right) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 420px) 1fr', gap: '24px' }}>

            {/* LEFT COLUMN: THE DISCORD EMBED REPLICA (EXACT SCREENSHOT DESIGN) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Eye size={16} color="#eab308" />
                Live Discord Embed Preview:
              </div>

              {/* Discord Embed Container */}
              <div style={{
                backgroundColor: '#2b2d31', // Discord sleek dark card
                borderRadius: '8px',
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)'
              }}>

                {/* EMBED TOP HEADER: Title + Guild Icon Thumbnail */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.3px' }}>
                      🎯 Server Activity
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.3px' }}>
                      🏆 Leaderboard
                    </div>
                  </div>

                  {/* Thumbnail */}
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: '#1e1f22',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    flexShrink: 0
                  }}>
                    {data?.guildInfo?.icon ? (
                      <img src={data.guildInfo.icon} alt="Server Icon" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#eab308', fontSize: '1.5rem' }}>
                        🏆
                      </div>
                    )}
                  </div>
                </div>

                {/* Thin divider under header */}
                <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.06)', margin: '4px 0' }} />

                {/* ENTRIES LIST */}
                {loadingLb ? (
                  <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
                    <Loader2 size={24} className="spin" style={{ margin: '0 auto 8px auto' }} />
                    <div style={{ fontSize: '0.82rem' }}>Loading leaderboard entries...</div>
                  </div>
                ) : leaderboardData.members.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                    No members have earned XP yet in this server!<br />
                    Chat in text channels or chill in voice channels to rank up.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {leaderboardData.members.map((member, idx) => (
                      <div key={member.userId || idx} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '6px 0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: '900', color: '#ffffff', fontSize: '0.92rem' }}>
                              #{member.rank}
                            </span>
                            {/* Discord Mention Pill */}
                            <span style={{
                              backgroundColor: '#3c4270',
                              color: '#c9cdfb',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.85rem',
                              fontWeight: '600'
                            }}>
                              @{member.username || 'Member'}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.82rem', color: '#dcddde', marginTop: '3px' }}>
                            Level: {member.level} | XP: {(member.xp || 0).toLocaleString()}/{(member.nextLevelXp || 0).toLocaleString()}
                          </div>
                        </div>

                        {/* Thin horizontal divider line exactly matching screenshot */}
                        <div style={{
                          height: '1px',
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          margin: '4px 0'
                        }} />
                      </div>
                    ))}
                  </div>
                )}

                {/* INTERACTIVE BUTTONS CONTAINER */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                  {/* Row 1: [👤 Your Rank] [🔄 Refresh] */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => alert('In Discord, clicking "👤 Your Rank" instantly highlights your ranking on the server leaderboard!')}
                      style={{
                        padding: '9px 14px',
                        backgroundColor: '#4e5058',
                        border: 'none',
                        borderRadius: '4px',
                        color: '#ffffff',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>👤</span> Your Rank
                    </button>

                    <button
                      type="button"
                      onClick={() => fetchLeaderboard(lbPage)}
                      style={{
                        padding: '9px 14px',
                        backgroundColor: '#4e5058',
                        border: 'none',
                        borderRadius: '4px',
                        color: '#ffffff',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>🔄</span> Refresh
                    </button>
                  </div>

                  {/* Row 2: [⬅️ Previous] [➡️ Next] */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                      type="button"
                      disabled={lbPage <= 1 || loadingLb}
                      onClick={() => fetchLeaderboard(lbPage - 1)}
                      style={{
                        padding: '9px 14px',
                        backgroundColor: lbPage <= 1 ? '#35373c' : '#4e5058',
                        border: 'none',
                        borderRadius: '4px',
                        color: lbPage <= 1 ? '#80848e' : '#ffffff',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        cursor: lbPage <= 1 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>⬅️</span> Previous
                    </button>

                    <button
                      type="button"
                      disabled={lbPage >= (leaderboardData.totalPages || 1) || loadingLb}
                      onClick={() => fetchLeaderboard(lbPage + 1)}
                      style={{
                        padding: '9px 14px',
                        backgroundColor: lbPage >= (leaderboardData.totalPages || 1) ? '#35373c' : '#4e5058',
                        border: 'none',
                        borderRadius: '4px',
                        color: lbPage >= (leaderboardData.totalPages || 1) ? '#80848e' : '#ffffff',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        cursor: lbPage >= (leaderboardData.totalPages || 1) ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>➡️</span> Next
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT COLUMN: LEADERBOARD BOT COMMANDS & SERVER LEVELING SUMMARY */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

              {/* Bot Commands Guide */}
              <div style={{
                backgroundColor: '#0f172a',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={18} color="#eab308" />
                  <span style={{ fontWeight: '800', fontSize: '0.95rem', color: '#ffffff' }}>
                    Discord Chat Prefix Commands
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                  Members can call up this interactive leaderboard directly in authorized text channels using any of the following triggers:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
                  {[
                    { cmd: '?lb', desc: 'Shows page 1 of leaderboard' },
                    { cmd: '?top', desc: 'Top server members' },
                    { cmd: '?leaderboard', desc: 'Full leaderboard embed' },
                    { cmd: '?lb 2', desc: 'Direct jump to page 2' }
                  ].map(c => (
                    <div key={c.cmd} style={{
                      backgroundColor: '#1e293b',
                      borderRadius: '10px',
                      padding: '10px 12px',
                      border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}>
                      <code style={{ color: '#facc15', fontWeight: '800', fontSize: '0.85rem' }}>{c.cmd}</code>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '3px' }}>{c.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-Time Ranking Summary */}
              <div style={{
                backgroundColor: '#0f172a',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={18} color="#3b82f6" />
                  <span style={{ fontWeight: '800', fontSize: '0.95rem', color: '#ffffff' }}>
                    Leaderboard Information & Pagination
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ backgroundColor: '#1e293b', padding: '12px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Total Ranked Members</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', marginTop: '4px' }}>
                      {leaderboardData.total || 0}
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#1e293b', padding: '12px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Current Page</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#eab308', marginTop: '4px' }}>
                      Page {lbPage} of {leaderboardData.totalPages || 1}
                    </div>
                  </div>
                </div>

                <div style={{
                  padding: '12px 14px',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  borderRadius: '10px',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  fontSize: '0.8rem',
                  color: '#a5b4fc',
                  lineHeight: '1.4'
                }}>
                  💡 <strong>Tip:</strong> You can broadcast this interactive embed to any text channel like <code>#leaderboard</code> or <code>#general</code> with the selector above. The buttons will remain active and fully functional for all server members!
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* MODAL: ADD NEW VOICE CHANNEL SUBTITLE */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '18px',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            padding: '24px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={20} color="#10b981" />
                Add Voice Channel Subtitle
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
              Select an existing voice channel or enter a custom name and subtitle text.
            </p>

            {/* Select existing channel */}
            {availableVoiceChannels.length > 0 && (
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                  Pick Existing Voice Channel (Optional):
                </label>
                <select
                  value={newSubtitleForm.channelId}
                  onChange={(e) => {
                    const selId = e.target.value;
                    const matched = availableVoiceChannels.find(vc => vc.id === selId);
                    setNewSubtitleForm({
                      ...newSubtitleForm,
                      channelId: selId,
                      channelName: matched ? matched.name : newSubtitleForm.channelName
                    });
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#0f172a',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                >
                  <option value="">(Select a voice channel from your server)</option>
                  {availableVoiceChannels.map(vc => (
                    <option key={vc.id} value={vc.id}>
                      🔊 {vc.name} (ID: {vc.id})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Custom Channel Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                Voice Channel Title:
              </label>
              <input
                type="text"
                value={newSubtitleForm.channelName}
                onChange={(e) => setNewSubtitleForm({ ...newSubtitleForm, channelName: e.target.value })}
                placeholder="e.g. ☘️ • Solo VC"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Subtitle Text */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                Voice Subtitle (Downside Small Text) *:
              </label>
              <input
                type="text"
                required
                value={newSubtitleForm.subtitle}
                onChange={(e) => setNewSubtitleForm({ ...newSubtitleForm, subtitle: e.target.value })}
                placeholder="e.g. ➡️ Join To Create Solo VC"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{
                  padding: '10px 18px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#cbd5e1',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddSubtitleItem}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#10b981',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Add Channel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW SERVER STAT VOICE CHANNEL */}
      {showAddStatModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '18px',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            padding: '24px',
            width: '100%',
            maxWidth: '520px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={20} color="#6366f1" />
                Add Server Stat Voice Channel
              </h3>
              <button
                onClick={() => setShowAddStatModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
              Create a locked voice counter channel in Discord that automatically counts live members, online users, or voice activity in real time.
            </p>

            {/* Counter Type Preset */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                Counter Type:
              </label>
              <select
                value={newStatForm.type || 'online'}
                onChange={(e) => {
                  const t = e.target.value;
                  let defName = newStatForm.channelName;
                  let defSub = newStatForm.subtitle;
                  if (t === 'online') {
                    defName = '🟢 Online: {online}';
                    defSub = '🌺 {online} Members Online';
                  } else if (t === 'members') {
                    defName = '👥 Members: {members}';
                    defSub = '👥 {members} Total Members';
                  } else if (t === 'vcUsers') {
                    defName = '🎙️ In Voice: {vcUsers}';
                    defSub = '⋆⁺₊ {vcUsers} In Voice Channels';
                  } else if (t === 'activeVc') {
                    defName = '🔊 Active VCs: {activeVc}';
                    defSub = '⋆⁺₊ {activeVc} Active Channels';
                  } else if (t === 'bots') {
                    defName = '🤖 Bots: {bots}';
                    defSub = '🤖 {bots} Server Bots';
                  } else if (t === 'humans') {
                    defName = '👤 Humans: {humans}';
                    defSub = '👤 {humans} Human Users';
                  }
                  setNewStatForm({
                    ...newStatForm,
                    type: t,
                    channelName: defName,
                    subtitle: defSub
                  });
                }}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              >
                <option value="online">🟢 Online Members (Live: {liveStats.online})</option>
                <option value="members">👥 Total Members (Live: {liveStats.members})</option>
                <option value="vcUsers">🎙️ Members in Voice Channels (Live: {liveStats.vcUsers})</option>
                <option value="activeVc">🔊 Active Voice Channels (Live: {liveStats.activeVc})</option>
                <option value="bots">🤖 Bot Count (Live: {liveStats.bots})</option>
                <option value="humans">👤 Human Members (Live: {liveStats.humans})</option>
                <option value="custom">⚙️ Custom Counter Template</option>
              </select>
            </div>

            {/* Select existing channel or auto-create */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                Existing Voice Channel Link (Optional):
              </label>
              <select
                value={newStatForm.channelId || ''}
                onChange={(e) => {
                  const selId = e.target.value;
                  const matched = availableVoiceChannels.find(vc => vc.id === selId);
                  setNewStatForm({
                    ...newStatForm,
                    channelId: selId,
                    channelName: matched ? matched.name : newStatForm.channelName
                  });
                }}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              >
                <option value="">(Auto-create locked counter channel in Discord)</option>
                {availableVoiceChannels.map(vc => (
                  <option key={vc.id} value={vc.id}>
                    🔊 {vc.name} (ID: {vc.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Channel Title */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                Channel Title (Top Line) *:
              </label>
              <input
                type="text"
                required
                value={newStatForm.channelName}
                onChange={(e) => setNewStatForm({ ...newStatForm, channelName: e.target.value })}
                placeholder="e.g. 🟢 Online: {online}"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Subtitle Text */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                Voice Subtitle (Downside Small Text):
              </label>
              <input
                type="text"
                value={newStatForm.subtitle}
                onChange={(e) => setNewStatForm({ ...newStatForm, subtitle: e.target.value })}
                placeholder="e.g. 🌺 {online} Members Online"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Variable Tags */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '700' }}>Insert Tag:</span>
              {[
                { tag: '{online}', label: 'Online' },
                { tag: '{members}', label: 'Members' },
                { tag: '{vcUsers}', label: 'In Voice' },
                { tag: '{activeVc}', label: 'Active VC' },
                { tag: '{bots}', label: 'Bots' },
                { tag: '{humans}', label: 'Humans' }
              ].map(pill => (
                <button
                  key={pill.tag}
                  type="button"
                  onClick={() => setNewStatForm(prev => ({ ...prev, channelName: prev.channelName + ' ' + pill.tag }))}
                  style={{
                    padding: '2px 7px',
                    backgroundColor: 'rgba(99, 102, 241, 0.15)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '6px',
                    color: '#a5b4fc',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  + {pill.tag}
                </button>
              ))}
            </div>

            {/* Live Preview Box */}
            <div style={{
              backgroundColor: '#1e1f22',
              borderRadius: '10px',
              padding: '12px 14px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{ fontSize: '0.72rem', color: '#949ba4', fontWeight: '700', marginBottom: '6px' }}>
                PREVIEW AS DISCORD CHANNEL:
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dbdee1', fontSize: '0.88rem', fontWeight: '600' }}>
                <Lock size={15} color="#949ba4" />
                <span>{formatPreview(newStatForm.channelName) || 'New Stat Voice Channel'}</span>
              </div>
              {newStatForm.subtitle && (
                <div style={{ marginLeft: '23px', marginTop: '3px', color: '#c4c9ce', fontSize: '0.76rem', fontWeight: '600' }}>
                  {formatPreview(newStatForm.subtitle)}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setShowAddStatModal(false)}
                style={{
                  padding: '10px 18px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#cbd5e1',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddStatChannel}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6366f1',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
                }}
              >
                Add Stat Channel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
