import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import {
  BarChart3, Activity, Users, Radio, Volume2, Mic, Lock, RefreshCw,
  Sparkles, Check, AlertCircle, CheckCircle2, Loader2, Trash2,
  ExternalLink, Copy, HelpCircle, Layers, Sliders, Zap, Eye,
  MessageSquare, Settings, CheckSquare, BellRing, Sparkle
} from 'lucide-react';

export default function AdminServerStats({ guildId }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

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
    updateIntervalMinutes: 5
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
          updateIntervalMinutes: res.settings.updateIntervalMinutes || 5
        });
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
      const res = await api.saveServerStatsSettings(guildId, formSettings);
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
      const res = await api.syncServerStatsNow(guildId);
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

  // Preset Applicator
  const applyPreset = (preset) => {
    if (preset === 'BLOSSOM') {
      setFormSettings(prev => ({
        ...prev,
        serverStatsHeader: 'Server Statistics :',
        serverStatsChannelName: 'Server Statistics :',
        serverStatsSubtitle: '🌺 {online} Online  🌺 {members} Members',
        voiceStatsHeader: 'Voice Statistics :',
        voiceStatsChannelName: 'Voice Statistics :',
        voiceStatsSubtitle: '⋆⁺₊ {vcUsers} VC Users  ⋆⁺₊ {activeVc} Active VC'
      }));
    } else if (preset === 'CLEAN') {
      setFormSettings(prev => ({
        ...prev,
        serverStatsHeader: '📊 SERVER STATS :',
        serverStatsChannelName: '📊 Server Statistics',
        serverStatsSubtitle: '👥 {members} Members  🟢 {online} Online',
        voiceStatsHeader: '🎙️ VOICE STATS :',
        voiceStatsChannelName: '🎙️ Voice Lounge',
        voiceStatsSubtitle: '🔊 {vcUsers} In VC  📻 {activeVc} Active'
      }));
    } else if (preset === 'SPARKLES') {
      setFormSettings(prev => ({
        ...prev,
        serverStatsHeader: '✨ Server Stats :',
        serverStatsChannelName: '✨ Member Counter',
        serverStatsSubtitle: '✦ {online} Online ✦ {members} Total',
        voiceStatsHeader: '🎧 Voice Stats :',
        voiceStatsChannelName: '🎧 Voice Activity',
        voiceStatsSubtitle: '✧ {vcUsers} VC Users ✧ {activeVc} Calls'
      }));
    } else if (preset === 'GAMING') {
      setFormSettings(prev => ({
        ...prev,
        serverStatsHeader: '🎮 Server Hub :',
        serverStatsChannelName: '🎮 Community Hub',
        serverStatsSubtitle: '⚡ {online} Online  👾 {members} Players',
        voiceStatsHeader: '🎙️ Voice Comms :',
        voiceStatsChannelName: '🎙️ Gaming Comms',
        voiceStatsSubtitle: '🔥 {vcUsers} On Mic  🔊 {activeVc} Lounges'
      }));
    }
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

      {/* Quick Action Top Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        padding: '16px 20px',
        backgroundColor: '#0f172a',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: formSettings.enabled ? '#10b981' : '#64748b',
            boxShadow: formSettings.enabled ? '0 0 10px #10b981' : 'none'
          }} />
          <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#f8fafc' }}>
            {formSettings.enabled ? 'Statistics Channels Active' : 'Statistics Channels Paused'}
          </span>
          <span style={{
            fontSize: '0.72rem',
            padding: '2px 8px',
            borderRadius: '6px',
            backgroundColor: isChannelsSetup ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
            color: isChannelsSetup ? '#34d399' : '#fbbf24',
            fontWeight: '700'
          }}>
            {isChannelsSetup ? 'DISCORD CHANNELS LINKED' : 'CHANNELS NOT LINKED YET'}
          </span>
          <span style={{
            fontSize: '0.72rem',
            padding: '2px 8px',
            borderRadius: '6px',
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            color: '#a5b4fc',
            fontWeight: '700'
          }}>
            {formSettings.displayMode === 'VOICE_SUBTITLE' ? 'VOICE SUBTITLE MODE' : formSettings.displayMode}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleAutoSetup}
            disabled={runningAutoSetup}
            style={{
              padding: '10px 18px',
              backgroundColor: '#6366f1',
              border: 'none',
              borderRadius: '10px',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: runningAutoSetup ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
            }}
          >
            {runningAutoSetup ? <Loader2 size={16} className="spin" /> : <Zap size={16} />}
            {isChannelsSetup ? 'Re-Setup / Align Channels' : '1-Click Auto Setup in Discord'}
          </button>

          <button
            onClick={handleSyncNow}
            disabled={syncingNow}
            style={{
              padding: '10px 16px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '10px',
              color: '#cbd5e1',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: syncingNow ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px'
            }}
          >
            <RefreshCw size={15} className={syncingNow ? 'spin' : ''} />
            Sync Now
          </button>

          <button
            onClick={handleSaveSettings}
            disabled={savingSettings}
            style={{
              padding: '10px 18px',
              backgroundColor: '#10b981',
              border: 'none',
              borderRadius: '10px',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: savingSettings ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px'
            }}
          >
            {savingSettings ? <Loader2 size={16} className="spin" /> : <Check size={16} />}
            Save Settings
          </button>

          {isChannelsSetup && (
            <button
              onClick={handleDeleteChannels}
              disabled={deletingChannels}
              style={{
                padding: '10px 14px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                color: '#f87171',
                fontSize: '0.85rem',
                fontWeight: '700',
                cursor: deletingChannels ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Delete stats channels from Discord"
            >
              {deletingChannels ? <Loader2 size={15} className="spin" /> : <Trash2 size={15} />}
              Reset
            </button>
          )}
        </div>
      </div>

      {/* 2-Column Split: Discord Subtitle Preview vs Live Metrics & Auto-Sync */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(330px, 440px) 1fr', gap: '24px' }}>

        {/* LEFT COLUMN: INTERACTIVE DISCORD PREVIEW WITH VOICE SUBTITLE */}
        <div style={{
          backgroundColor: '#0f172a',
          borderRadius: '18px',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={18} style={{ color: '#818cf8' }} />
              <span style={{ fontWeight: '800', fontSize: '0.95rem', color: '#f8fafc' }}>
                Live Discord Channel & Subtitle Preview
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
              SCREENSHOT REPLICA
            </span>
          </div>

          <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
            Simulates your Discord sidebar showing channel title with the small downside voice subtitle!
          </p>

          {/* DISCORD SIDEBAR MOCKUP CONTAINER */}
          <div style={{
            backgroundColor: '#1e1f22',
            borderRadius: '14px',
            padding: '22px 18px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: 'inset 0 2px 12px rgba(0, 0, 0, 0.5)'
          }}>

            {/* CHANNEL 1: SERVER STATISTICS */}
            <div style={{ marginBottom: '22px' }}>
              {/* Channel Header Line (Normal font with Gray Lock Icon) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#dbdee1',
                fontSize: '0.92rem',
                fontWeight: '600',
                letterSpacing: '0.01em'
              }}>
                <div style={{
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#949ba4'
                }}>
                  <Lock size={16} strokeWidth={2.4} />
                </div>
                <span>{formSettings.serverStatsChannelName || 'Server Statistics :'}</span>
              </div>

              {/* Subtitle Line (Small font on the downside of the voice channel) */}
              <div style={{
                marginLeft: '26px',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                color: '#949ba4',
                fontSize: '0.78rem',
                fontWeight: '600',
                letterSpacing: '0.01em'
              }}>
                <span style={{ color: '#c4c9ce' }}>
                  {formatPreview(formSettings.serverStatsSubtitle) || '🌺 978 Online  🌺 27466 Members'}
                </span>
              </div>
            </div>

            {/* CHANNEL 2: VOICE STATISTICS */}
            <div>
              {/* Channel Header Line (Normal font with Gray Lock Icon) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#dbdee1',
                fontSize: '0.92rem',
                fontWeight: '600',
                letterSpacing: '0.01em'
              }}>
                <div style={{
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#949ba4'
                }}>
                  <Lock size={16} strokeWidth={2.4} />
                </div>
                <span>{formSettings.voiceStatsChannelName || 'Voice Statistics :'}</span>
              </div>

              {/* Subtitle Line (Small font on the downside of the voice channel) */}
              <div style={{
                marginLeft: '26px',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                color: '#949ba4',
                fontSize: '0.78rem',
                fontWeight: '600',
                letterSpacing: '0.01em'
              }}>
                <span style={{ color: '#c4c9ce' }}>
                  {formatPreview(formSettings.voiceStatsSubtitle) || '⋆⁺₊ 29 VC Users  ⋆⁺₊ 9 Active VC'}
                </span>
              </div>
            </div>

          </div>

          {/* Quick Style Presets Selector */}
          <div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '700', marginBottom: '8px' }}>
              One-Click Style Presets:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => applyPreset('BLOSSOM')}
                style={{
                  padding: '8px 10px',
                  backgroundColor: 'rgba(236, 72, 153, 0.12)',
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                  borderRadius: '8px',
                  color: '#f472b6',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                🌺 Blossom (Screenshot)
              </button>

              <button
                type="button"
                onClick={() => applyPreset('CLEAN')}
                style={{
                  padding: '8px 10px',
                  backgroundColor: 'rgba(59, 130, 246, 0.12)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  color: '#60a5fa',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                📊 Clean Modern
              </button>

              <button
                type="button"
                onClick={() => applyPreset('SPARKLES')}
                style={{
                  padding: '8px 10px',
                  backgroundColor: 'rgba(168, 85, 247, 0.12)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '8px',
                  color: '#c084fc',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                ✨ Sparkles & Stars
              </button>

              <button
                type="button"
                onClick={() => applyPreset('GAMING')}
                style={{
                  padding: '8px 10px',
                  backgroundColor: 'rgba(234, 179, 8, 0.12)',
                  border: '1px solid rgba(234, 179, 8, 0.3)',
                  borderRadius: '8px',
                  color: '#facc15',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                🎮 Gaming Squad
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: LIVE STATS & REAL-TIME AUTO-UPDATE CONFIG */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* 4 Live Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>

            {/* Total Members */}
            <div style={{
              backgroundColor: '#0f172a',
              borderRadius: '14px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '700' }}>TOTAL MEMBERS</span>
                <Users size={16} color="#818cf8" />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ffffff', marginTop: '6px' }}>
                {(liveStats.members || 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                {liveStats.humans || 0} Humans • {liveStats.bots || 0} Bots
              </div>
            </div>

            {/* Online Members */}
            <div style={{
              backgroundColor: '#0f172a',
              borderRadius: '14px',
              padding: '16px',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#34d399' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '700' }}>ONLINE MEMBERS</span>
                <Activity size={16} color="#34d399" />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#34d399', marginTop: '6px' }}>
                {(liveStats.online || 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                Active in Discord
              </div>
            </div>

            {/* VC Connected Users */}
            <div style={{
              backgroundColor: '#0f172a',
              borderRadius: '14px',
              padding: '16px',
              border: '1px solid rgba(99, 102, 241, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#a5b4fc' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '700' }}>VC USERS</span>
                <Mic size={16} color="#a5b4fc" />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#a5b4fc', marginTop: '6px' }}>
                {(liveStats.vcUsers || 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                In voice channels now
              </div>
            </div>

            {/* Active Voice Channels */}
            <div style={{
              backgroundColor: '#0f172a',
              borderRadius: '14px',
              padding: '16px',
              border: '1px solid rgba(236, 72, 153, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#f472b6' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '700' }}>ACTIVE VCS</span>
                <Volume2 size={16} color="#f472b6" />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#f472b6', marginTop: '6px' }}>
                {(liveStats.activeVc || 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                Voice channels in use
              </div>
            </div>

          </div>

          {/* REAL-TIME AUTOMATIC UPDATE TRIGGERS CARD */}
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BellRing size={18} style={{ color: '#34d399' }} />
              <span style={{ fontWeight: '800', fontSize: '0.95rem', color: '#ffffff' }}>
                Automatic Real-Time Discord Updates
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
              The bot automatically watches voice channels & member activity to update channel subtitles instantly!
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>

              {/* VC Users Auto-update */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '10px',
                cursor: 'pointer',
                border: formSettings.autoUpdateVoice ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent'
              }}>
                <input
                  type="checkbox"
                  checked={formSettings.autoUpdateVoice}
                  onChange={(e) => setFormSettings({ ...formSettings, autoUpdateVoice: e.target.checked })}
                  style={{ width: '16px', height: '16px', accentColor: '#6366f1' }}
                />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#ffffff' }}>
                    Auto-Sync Voice VC Activity
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    Updates when members join/leave VC
                  </div>
                </div>
              </label>

              {/* Members Auto-update */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '10px',
                cursor: 'pointer',
                border: formSettings.autoUpdateMembers ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent'
              }}>
                <input
                  type="checkbox"
                  checked={formSettings.autoUpdateMembers}
                  onChange={(e) => setFormSettings({ ...formSettings, autoUpdateMembers: e.target.checked })}
                  style={{ width: '16px', height: '16px', accentColor: '#10b981' }}
                />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#ffffff' }}>
                    Auto-Sync Server Joins/Leaves
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    Updates when members join or leave
                  </div>
                </div>
              </label>

              {/* Presence Auto-update */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '10px',
                cursor: 'pointer',
                border: formSettings.autoUpdatePresence ? '1px solid rgba(234, 179, 8, 0.4)' : '1px solid transparent'
              }}>
                <input
                  type="checkbox"
                  checked={formSettings.autoUpdatePresence}
                  onChange={(e) => setFormSettings({ ...formSettings, autoUpdatePresence: e.target.checked })}
                  style={{ width: '16px', height: '16px', accentColor: '#eab308' }}
                />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#ffffff' }}>
                    Auto-Sync Online Presence
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    Updates when users come online
                  </div>
                </div>
              </label>

            </div>

          </div>

          {/* Master Enable Toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            backgroundColor: '#0f172a',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#ffffff' }}>
                Enable Statistics & Voice Subtitles
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                When active, your bot updates voice subtitles and channels automatically in real-time.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setFormSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
              style={{
                width: '52px',
                height: '28px',
                borderRadius: '14px',
                backgroundColor: formSettings.enabled ? '#10b981' : '#334155',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background-color 0.2s'
              }}
            >
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                position: 'absolute',
                top: '3px',
                left: formSettings.enabled ? '27px' : '3px',
                transition: 'left 0.2s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }} />
            </button>
          </div>

        </div>

      </div>

      {/* DETAILED CHANNEL & VOICE SUBTITLE CONFIGURATION FORM */}
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
            Voice Channel & Voice Subtitle Configuration
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
            Choose how stats appear (voice subtitle vs channel name), select channels, and customize templates.
          </p>
        </div>

        {/* DISPLAY MODE SELECTOR */}
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '8px' }}>
            Statistics Display Style:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>

            <div
              onClick={() => setFormSettings({ ...formSettings, displayMode: 'VOICE_SUBTITLE' })}
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                backgroundColor: formSettings.displayMode === 'VOICE_SUBTITLE' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                border: formSettings.displayMode === 'VOICE_SUBTITLE' ? '2px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', fontWeight: '800', fontSize: '0.88rem' }}>
                <Mic size={16} color="#818cf8" />
                <span>Voice Subtitle (Screenshot Style)</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>
                Shows stats in small text on the downside of voice channels. Highly recommended!
              </div>
            </div>

            <div
              onClick={() => setFormSettings({ ...formSettings, displayMode: 'CHANNEL_NAME' })}
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                backgroundColor: formSettings.displayMode === 'CHANNEL_NAME' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                border: formSettings.displayMode === 'CHANNEL_NAME' ? '2px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', fontWeight: '800', fontSize: '0.88rem' }}>
                <Volume2 size={16} color="#a5b4fc" />
                <span>Channel Name Only</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>
                Updates the top channel title directly with counter numbers.
              </div>
            </div>

            <div
              onClick={() => setFormSettings({ ...formSettings, displayMode: 'BOTH' })}
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                backgroundColor: formSettings.displayMode === 'BOTH' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                border: formSettings.displayMode === 'BOTH' ? '2px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', fontWeight: '800', fontSize: '0.88rem' }}>
                <Sparkles size={16} color="#c084fc" />
                <span>Both (Name + Subtitle)</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>
                Synchronizes both channel title and small voice subtitle.
              </div>
            </div>

          </div>
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
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                Voice channel name displayed at top with lock 🔒
              </span>
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
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                Displays in small text under the channel!
              </span>
            </div>

          </div>

          {/* Select Specific Discord Channel from Server */}
          {availableVoiceChannels.length > 0 && (
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                Link to Voice Channel in Server:
              </label>
              <select
                value={formSettings.serverStatsChannelId}
                onChange={(e) => setFormSettings({ ...formSettings, serverStatsChannelId: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="">(Auto-managed dedicated locked channel)</option>
                {availableVoiceChannels.map(vc => (
                  <option key={vc.id} value={vc.id}>
                    🔊 {vc.name} (ID: {vc.id})
                  </option>
                ))}
              </select>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                Select an existing voice channel to display this subtitle on, or leave auto-managed to create a dedicated channel.
              </span>
            </div>
          )}

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
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                Voice channel name displayed at top with lock 🔒
              </span>
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
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                Displays in small text under the channel!
              </span>
            </div>

          </div>

          {/* Select Specific Discord Channel from Server */}
          {availableVoiceChannels.length > 0 && (
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                Link to Voice Channel in Server:
              </label>
              <select
                value={formSettings.voiceStatsChannelId}
                onChange={(e) => setFormSettings({ ...formSettings, voiceStatsChannelId: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="">(Auto-managed dedicated locked channel)</option>
                {availableVoiceChannels.map(vc => (
                  <option key={vc.id} value={vc.id}>
                    🔊 {vc.name} (ID: {vc.id})
                  </option>
                ))}
              </select>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                Select an existing voice channel to display this subtitle on, or leave auto-managed.
              </span>
            </div>
          )}

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

        {/* SECTION 3: SYNC INTERVAL */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          padding: '16px 20px',
          backgroundColor: '#1e293b',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>

          {/* Auto-Sync Interval */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
              Background Sync Timer:
            </label>
            <select
              value={formSettings.updateIntervalMinutes}
              onChange={(e) => setFormSettings({ ...formSettings, updateIntervalMinutes: Number(e.target.value) })}
              style={{
                width: '100%',
                padding: '10px 14px',
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: '700',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value={2}>Every 2 Minutes (Fast Subtitle Sync)</option>
              <option value={5}>Every 5 Minutes (Recommended)</option>
              <option value={10}>Every 10 Minutes</option>
              <option value={15}>Every 15 Minutes</option>
            </select>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
              Periodic background verification even if events are not firing
            </span>
          </div>

          {/* Category Layout Mode */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
              Category Layout:
            </label>
            <select
              value={formSettings.categoryMode}
              onChange={(e) => setFormSettings({ ...formSettings, categoryMode: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: '700',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="SPLIT_CATEGORIES">Split Categories (Screenshot Style)</option>
              <option value="SINGLE_CATEGORY">Single Stats Category</option>
            </select>
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
            Save & Apply Statistics Subtitles
          </button>
        </div>

      </form>

    </div>
  );
}
