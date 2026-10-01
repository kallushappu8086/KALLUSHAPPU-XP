import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import {
  BarChart3, Activity, Users, Radio, Volume2, Mic, Lock, RefreshCw,
  Sparkles, Check, AlertCircle, CheckCircle2, Loader2, Trash2,
  ExternalLink, Copy, HelpCircle, Layers, Sliders, Zap, Eye,
  MessageSquare, Settings, CheckSquare, BellRing, Plus, Edit3,
  ListPlus, ChevronRight, Play, Compass
} from 'lucide-react';

export default function AdminServerStats({ guildId }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Active Tab within this section: 'SERVER_STATS' | 'VOICE_SUBTITLES'
  const [activeSubTab, setActiveSubTab] = useState('VOICE_SUBTITLES'); // Default to the user's requested multi-channel subtitle manager!

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
    voiceChannelSubtitles: []
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
    } catch (err) {
      console.error('Failed to fetch server stats details:', err);
      setErrorMsg(err.message || 'Failed to load server statistics data');
    } finally {
      setLoading(false);
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
        voiceChannelSubtitles: subtitlesList
      };
      const res = await api.saveServerStatsSettings(guildId, payload);
      setSuccessMsg(res.message || 'Server Statistics & Voice Subtitle settings saved successfully!');
      setTimeout(() => setSuccessMsg(null), 5000);
      fetchServerStatsData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save settings');
    } finally {
      setSavingSettings(false);
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
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
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
        <form onSubmit={handleSaveSettings} style={{
          backgroundColor: '#0f172a',
          borderRadius: '18px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>

          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>
              Server & Voice Statistics Counter Channels
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
              Locked counter channels showing real-time online members, total members, and voice chat counts.
            </p>
          </div>

          {/* SECTION 1: SERVER STATISTICS SETTINGS */}
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '14px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} style={{ color: '#818cf8' }} />
                <span style={{ fontWeight: '800', fontSize: '1rem', color: '#ffffff' }}>
                  1. Server Statistics Channel & Subtitle
                </span>
              </div>
              <span style={{
                fontSize: '0.72rem',
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                color: '#a5b4fc',
                padding: '2px 8px',
                borderRadius: '6px',
                fontWeight: '700'
              }}>
                ONLINE & TOTAL MEMBERS
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

              {/* Channel Title */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                  Channel Title (Top Line):
                </label>
                <input
                  type="text"
                  value={formSettings.serverStatsChannelName}
                  onChange={(e) => setFormSettings({ ...formSettings, serverStatsChannelName: e.target.value })}
                  placeholder="Server Statistics :"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#0f172a',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    fontWeight: '600',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Voice Subtitle Template */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                  Voice Subtitle (Downside Small Text):
                </label>
                <input
                  type="text"
                  value={formSettings.serverStatsSubtitle}
                  onChange={(e) => setFormSettings({ ...formSettings, serverStatsSubtitle: e.target.value })}
                  placeholder="🌺 {online} Online  🌺 {members} Members"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#0f172a',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    fontWeight: '600',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

            </div>

            {/* Variable Pills */}
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', marginRight: '8px' }}>
                Insert Variables:
              </span>
              <div style={{ display: 'inline-flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                {[
                  { tag: '{online}', desc: 'Online count' },
                  { tag: '{members}', desc: 'Total members' },
                  { tag: '{humans}', desc: 'Human members' },
                  { tag: '{bots}', desc: 'Bot count' }
                ].map(item => (
                  <button
                    key={item.tag}
                    type="button"
                    onClick={() => setFormSettings({
                      ...formSettings,
                      serverStatsSubtitle: formSettings.serverStatsSubtitle + ' ' + item.tag
                    })}
                    style={{
                      padding: '3px 8px',
                      backgroundColor: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      borderRadius: '6px',
                      color: '#a5b4fc',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                    title={`Insert ${item.desc}`}
                  >
                    + {item.tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 2: VOICE STATISTICS SETTINGS */}
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '14px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} style={{ color: '#f472b6' }} />
                <span style={{ fontWeight: '800', fontSize: '1rem', color: '#ffffff' }}>
                  2. Voice Statistics Channel & Subtitle
                </span>
              </div>
              <span style={{
                fontSize: '0.72rem',
                backgroundColor: 'rgba(236, 72, 153, 0.15)',
                color: '#f472b6',
                padding: '2px 8px',
                borderRadius: '6px',
                fontWeight: '700'
              }}>
                VC USERS & ACTIVE VCS
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

              {/* Channel Title */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                  Channel Title (Top Line):
                </label>
                <input
                  type="text"
                  value={formSettings.voiceStatsChannelName}
                  onChange={(e) => setFormSettings({ ...formSettings, voiceStatsChannelName: e.target.value })}
                  placeholder="Voice Statistics :"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#0f172a',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    fontWeight: '600',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Voice Subtitle Template */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                  Voice Subtitle (Downside Small Text):
                </label>
                <input
                  type="text"
                  value={formSettings.voiceStatsSubtitle}
                  onChange={(e) => setFormSettings({ ...formSettings, voiceStatsSubtitle: e.target.value })}
                  placeholder="⋆⁺₊ {vcUsers} VC Users  ⋆⁺₊ {activeVc} Active VC"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#0f172a',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    fontWeight: '600',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

            </div>

            {/* Variable Pills */}
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', marginRight: '8px' }}>
                Insert Variables:
              </span>
              <div style={{ display: 'inline-flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                {[
                  { tag: '{vcUsers}', desc: 'Users in voice channels' },
                  { tag: '{activeVc}', desc: 'Active voice channels' }
                ].map(item => (
                  <button
                    key={item.tag}
                    type="button"
                    onClick={() => setFormSettings({
                      ...formSettings,
                      voiceStatsSubtitle: formSettings.voiceStatsSubtitle + ' ' + item.tag
                    })}
                    style={{
                      padding: '3px 8px',
                      backgroundColor: 'rgba(236, 72, 153, 0.15)',
                      border: '1px solid rgba(236, 72, 153, 0.3)',
                      borderRadius: '6px',
                      color: '#f472b6',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                    title={`Insert ${item.desc}`}
                  >
                    + {item.tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Save Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '6px' }}>
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
              Save & Apply Statistics Settings
            </button>
          </div>

        </form>
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

    </div>
  );
}
