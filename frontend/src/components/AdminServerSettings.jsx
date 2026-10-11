import { useState, useEffect, useRef } from 'react';
import { api } from '../utils/api';
import { Edit3, Trash2, Plus, Folder, Hash, Volume2, Image, Server, Check, X, Loader, Users, Search, AlertTriangle, Save } from 'lucide-react';
import { io } from 'socket.io-client';

const Youtube = ({ size = 24, className = '', style = {} }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill="currentColor" 
    className={className}
    style={style}
  >
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.387.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.969.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.389-.507a3.007 3.007 0 0 0 2.11-2.11C24 15.969 24 12 24 12s0-3.969-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);


export default function AdminServerSettings({ guildId, onHasUnsavedChangesChange }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [savedSettings, setSavedSettings] = useState(null);

  // Sub Tab State
  const [activeSubTab, setActiveSubTab] = useState('settings'); // 'settings' | 'members'

  // Guild Form State
  const [serverName, setServerName] = useState('');
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState('');
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');

  // Channel Creation State
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelType, setNewChannelType] = useState('0'); // '0' = text, '2' = voice, '4' = category
  const [newChannelParent, setNewChannelParent] = useState('');
  const [creatingChannel, setCreatingChannel] = useState(false);

  // Channel Editing State
  const [editingChannelId, setEditingChannelId] = useState(null);
  const [editingChannelName, setEditingChannelName] = useState('');
  const [updatingChannelId, setUpdatingChannelId] = useState(null);
  const [deletingChannelId, setDeletingChannelId] = useState(null);

  // Member Management State
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [moderatingMemberId, setModeratingMemberId] = useState(null);

  // Timeout Modal state
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [timeoutTargetMember, setTimeoutTargetMember] = useState(null);
  const [timeoutDuration, setTimeoutDuration] = useState('10'); // 10 minutes default
  const [timeoutReason, setTimeoutReason] = useState('');

  // Ban/Kick Modal state
  const [showBanModal, setShowBanModal] = useState(false);
  const [banTargetMember, setBanTargetMember] = useState(null);
  const [banReason, setBanReason] = useState('');
  const [showKickModal, setShowKickModal] = useState(false);
  const [kickTargetMember, setKickTargetMember] = useState(null);
  const [kickReason, setKickReason] = useState('');

  // Nickname Modal state
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [nicknameTargetMember, setNicknameTargetMember] = useState(null);
  const [newNickname, setNewNickname] = useState('');
  const [nicknameReason, setNicknameReason] = useState('');

  // Roles Modal state
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [rolesTargetMember, setRolesTargetMember] = useState(null);
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [rolesReason, setRolesReason] = useState('');
  const [serverRoles, setServerRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  // Bulk Nickname States
  const [nicknameTemplate, setNicknameTemplate] = useState('{DISPLAY_NAME}');
  const [nicknameCasing, setNicknameCasing] = useState('original'); // 'original' | 'upper' | 'lower'
  const [nicknameSource, setNicknameSource] = useState('displayName'); // 'displayName' | 'username'
  const [nicknameProgress, setNicknameProgress] = useState(null);
  const [applyingBulk, setApplyingBulk] = useState(false);
  const logContainerRef = useRef(null);

  // YouTube tab states and handlers
  const [settings, setSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [resolvingChannel, setResolvingChannel] = useState(false);
  const [resolveSuccessMsg, setResolveSuccessMsg] = useState('');

  const fetchSettings = async () => {
    try {
      setLoadingSettings(true);
      setErrorMsg(null);
      const sData = await api.getSettings(guildId);
      setSettings(sData);
      setSavedSettings(JSON.parse(JSON.stringify(sData)));
    } catch (err) {
      console.error('Failed to fetch settings in Admin Portal:', err);
      setErrorMsg('Failed to fetch guild configuration settings.');
    } finally {
      setLoadingSettings(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'youtube') {
      fetchSettings();
      fetchRoles();
    }
  }, [activeSubTab, guildId]);

  const handleInputChange = (path, value) => {
    const parts = path.split('.');
    setSettings(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      let current = updated;
      for (let i = 0; i < parts.length - 1; i++) {
        if (current[parts[i]] === undefined || current[parts[i]] === null) {
          current[parts[i]] = {};
        }
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      return updated;
    });
  };

  const handleToggle = (path) => {
    const parts = path.split('.');
    setSettings(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      let current = updated;
      for (let i = 0; i < parts.length - 1; i++) {
        if (current[parts[i]] === undefined || current[parts[i]] === null) {
          current[parts[i]] = {};
        }
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = !current[parts[parts.length - 1]];
      return updated;
    });
  };

  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      const updated = await api.saveSettings(guildId, settings);
      setSettings(updated);
      setSavedSettings(JSON.parse(JSON.stringify(updated)));
      setSuccessMsg('YouTube settings saved successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to save YouTube settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const isSettingsEqual = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) {
      return a == b;
    }
    if (typeof a !== 'object' || typeof b !== 'object') {
      if (typeof a === 'number' || typeof b === 'number') {
        return Number(a) === Number(b);
      }
      if (typeof a === 'boolean' || typeof b === 'boolean') {
        return Boolean(a) === Boolean(b);
      }
      return a === b;
    }

    if (Array.isArray(a) !== Array.isArray(b)) return false;
    if (Array.isArray(a)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!isSettingsEqual(a[i], b[i])) return false;
      }
      return true;
    }

    const keysA = Object.keys(a).filter(k => k !== '_id' && k !== '__v' && a[k] !== undefined && a[k] !== null);
    const keysB = Object.keys(b).filter(k => k !== '_id' && k !== '__v' && b[k] !== undefined && b[k] !== null);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!isSettingsEqual(a[key], b[key])) return false;
    }
    return true;
  };

  const hasGuildChanges = !!(data && (serverName !== data.name || iconFile !== null || bannerFile !== null));
  const hasYoutubeChanges = !!(settings && savedSettings && !isSettingsEqual(settings.youtube, savedSettings.youtube));
  const hasUnsavedChanges = hasGuildChanges || hasYoutubeChanges;

  useEffect(() => {
    if (onHasUnsavedChangesChange) {
      onHasUnsavedChangesChange(hasUnsavedChanges);
    }
  }, [hasUnsavedChanges, onHasUnsavedChangesChange]);

  const handleSubTabClick = (newSubTab) => {
    if (activeSubTab === 'settings' && hasGuildChanges) {
      alert("You have unsaved server settings changes. Please save or reset before leaving this feature.");
      return;
    }
    if (activeSubTab === 'youtube' && hasYoutubeChanges) {
      alert("You have unsaved YouTube announcements changes. Please save or reset before leaving this feature.");
      return;
    }
    setActiveSubTab(newSubTab);
  };

  const handleResetGuildDetails = () => {
    if (data) {
      setServerName(data.name);
      setIconPreview(data.icon);
      setBannerPreview(data.banner);
      setIconFile(null);
      setBannerFile(null);
      setSuccessMsg('Changes reset to previously saved server details.');
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  const handleResetSettings = () => {
    if (savedSettings) {
      setSettings(JSON.parse(JSON.stringify(savedSettings)));
      setSuccessMsg('Changes reset to previously saved YouTube announcements.');
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  const handleResolveYoutubeChannel = async () => {
    const channelUrlInput = settings?.youtube?.channelUrl;
    if (!channelUrlInput) {
      setErrorMsg('Please enter a YouTube channel URL or handle.');
      return;
    }
    
    setResolvingChannel(true);
    setResolveSuccessMsg('');
    setErrorMsg(null);
    try {
      const res = await api.resolveYoutubeChannel(guildId, channelUrlInput);
      handleInputChange('youtube.channelId', res.channelId);
      handleInputChange('youtube.channelName', res.channelName);
      handleInputChange('youtube.channelUrl', res.channelUrl);
      setResolveSuccessMsg(`Successfully connected to channel: ${res.channelName}`);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to resolve YouTube channel.');
    } finally {
      setResolvingChannel(false);
    }
  };

  const formatPreviewMessage = (template, channelName) => {
    let resolved = template || '{url}';
    if (!/{url}/i.test(resolved)) {
      resolved = resolved.trim() ? `${resolved.trim()}\n{url}` : '{url}';
    }
    resolved = resolved
      .replace(/{channel}/gi, channelName || 'Kallu Shappu')
      .replace(/{title}/gi, 'My Awesome New Video!')
      .replace(/{url}/gi, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    
    const parts = resolved.split(new RegExp('(\\\*\\\*.*?\\\*\\\*)', 'g'));
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} style={{ color: '#ffffff' }}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const handleSourceChange = (newSource) => {
    setNicknameSource(newSource);
    
    let newTemplate = nicknameTemplate;
    if (newSource === 'username') {
      if (/\{display_name\}/gi.test(newTemplate)) {
        newTemplate = newTemplate.replace(/\{display_name\}/gi, '{USERNAME}');
      } else if (!/\{username\}/gi.test(newTemplate)) {
        newTemplate = '{USERNAME}';
      }
    } else if (newSource === 'displayName') {
      if (/\{username\}/gi.test(newTemplate)) {
        newTemplate = newTemplate.replace(/\{username\}/gi, '{DISPLAY_NAME}');
      } else if (!/\{display_name\}/gi.test(newTemplate)) {
        newTemplate = '{DISPLAY_NAME}';
      }
    }
    setNicknameTemplate(newTemplate);
  };

  // Auto-scroll logs to bottom
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [nicknameProgress?.logs]);

  // Fetch current bulk nickname status on mount/guild change
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await api.getBulkNicknameStatus(guildId);
        if (status && status.status !== 'idle') {
          setNicknameProgress(status);
          if (status.status === 'processing') {
            setApplyingBulk(true);
          }
          if (status.template !== undefined) {
            setNicknameTemplate(status.template || '');
          }
          if (status.casing !== undefined) {
            setNicknameCasing(status.casing || 'original');
          }
          if (status.sourceNameType !== undefined) {
            setNicknameSource(status.sourceNameType || 'displayName');
          }
        } else {
          setNicknameProgress(null);
          setApplyingBulk(false);
        }
      } catch (err) {
        console.error('Failed to fetch bulk nickname status:', err);
      }
    };
    fetchStatus();
  }, [guildId]);

  // Connect to Socket.IO and listen for bulk progress updates
  useEffect(() => {
    const socketUrl = (window.location.port === '5173' || window.location.port === '5174')
      ? 'http://localhost:2049'
      : window.location.origin;

    const newSocket = io(socketUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    newSocket.emit('join_guild', guildId);

    newSocket.on('bulk_nickname_progress', (progress) => {
      console.log('[Socket] Received bulk nickname progress:', progress);
      setNicknameProgress(progress);
      if (progress.status === 'processing') {
        setApplyingBulk(true);
      } else {
        setApplyingBulk(false);
      }
      if (progress.sourceNameType !== undefined) {
        setNicknameSource(progress.sourceNameType || 'displayName');
      }
    });

    return () => {
      newSocket.emit('leave_guild', guildId);
      newSocket.disconnect();
    };
  }, [guildId]);

  // Polling fallback when websocket fails or when active job is running
  useEffect(() => {
    let intervalId = null;

    const shouldPoll = activeSubTab === 'bulk-nicknames' && (applyingBulk || nicknameProgress?.status === 'processing');

    if (shouldPoll) {
      const pollStatus = async () => {
        try {
          const status = await api.getBulkNicknameStatus(guildId);
          if (status) {
            setNicknameProgress(status);
            if (status.status !== 'processing') {
              setApplyingBulk(false);
            }
            if (status.sourceNameType !== undefined) {
              setNicknameSource(status.sourceNameType || 'displayName');
            }
          }
        } catch (err) {
          console.error('Failed to poll bulk nickname status:', err);
        }
      };

      // Poll immediately and then every 2 seconds
      pollStatus();
      intervalId = setInterval(pollStatus, 2000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [activeSubTab, guildId, applyingBulk, nicknameProgress?.status]);

  const handleApplyBulkNicknames = async () => {
    if (!window.confirm('Are you sure you want to change nicknames of all manageable members in this server? This updates nicknames sequentially to respect rate limits.')) {
      return;
    }
    setApplyingBulk(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await api.startBulkNickname(guildId, {
        template: nicknameTemplate,
        casing: nicknameCasing,
        sourceNameType: nicknameSource,
        reset: false
      });
      setNicknameProgress(res.job);
      setSuccessMsg(res.message || 'Bulk nickname process started!');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to start bulk nickname update.');
      setApplyingBulk(false);
    }
  };

  const handleResetBulkNicknames = async () => {
    if (!window.confirm('Are you sure you want to reset the nicknames of all manageable members in this server back to their default usernames?')) {
      return;
    }
    setApplyingBulk(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await api.startBulkNickname(guildId, {
        template: '',
        casing: 'original',
        reset: true
      });
      setNicknameProgress(res.job);
      setSuccessMsg(res.message || 'Bulk nickname reset process started!');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to start bulk nickname reset.');
      setApplyingBulk(false);
    }
  };

  const handleCancelBulkNicknames = async () => {
    if (!window.confirm('Are you sure you want to cancel the running nickname update?')) {
      return;
    }
    try {
      const res = await api.cancelBulkNickname(guildId);
      setSuccessMsg(res.message || 'Process cancelled.');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to cancel the process.');
    }
  };

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await api.getAdminGuildDetails(guildId);
      setData(res);
      setServerName(res.name);
      setIconPreview(res.icon);
      setBannerPreview(res.banner);
      setIconFile(null);
      setBannerFile(null);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to fetch server details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async (search = '') => {
    try {
      setLoadingMembers(true);
      setErrorMsg(null);
      const res = await api.getAdminMembers(guildId, search);
      setMembers(res);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to fetch server members.');
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [guildId]);

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      const res = await api.getAdminGuildRoles(guildId);
      setServerRoles(res);
    } catch (err) {
      console.error('Failed to fetch server roles:', err);
    } finally {
      setLoadingRoles(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'members') {
      fetchMembers(searchQuery);
      fetchRoles();
    }
  }, [activeSubTab, guildId]);

  const handleSaveGuildDetails = async (e) => {
    e.preventDefault();
    if (!serverName.trim()) {
      setErrorMsg('Server name cannot be empty.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const formData = new FormData();
      formData.append('name', serverName);
      if (iconFile) formData.append('icon', iconFile);
      if (bannerFile) formData.append('banner', bannerFile);

      const res = await api.updateAdminGuildDetails(guildId, formData);
      setSuccessMsg(res.message || 'Settings saved successfully!');
      
      // Update data state
      setData(prev => ({
        ...prev,
        name: res.name,
        icon: res.icon,
        banner: res.banner
      }));
      
      // Reset files
      setIconFile(null);
      setBannerFile(null);
      
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to update server settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    setCreatingChannel(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await api.createChannel(guildId, newChannelName, newChannelType, newChannelParent || null);
      
      // Refresh details to get complete sorted list
      const freshData = await api.getAdminGuildDetails(guildId);
      setData(freshData);
      
      setNewChannelName('');
      setNewChannelParent('');
      setSuccessMsg(res.message || 'Channel created successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to create channel.');
    } finally {
      setCreatingChannel(false);
    }
  };

  const handleRenameChannel = async (channelId) => {
    if (!editingChannelName.trim()) return;

    setUpdatingChannelId(channelId);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await api.renameChannel(guildId, channelId, editingChannelName);
      
      // Update state channel name
      setData(prev => ({
        ...prev,
        channels: prev.channels.map(c => c.id === channelId ? { ...c, name: res.channel.name } : c)
      }));

      setEditingChannelId(null);
      setSuccessMsg(res.message || 'Channel renamed successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to rename channel.');
    } finally {
      setUpdatingChannelId(null);
    }
  };

  const handleDeleteChannel = async (channelId, name) => {
    if (!window.confirm(`Are you sure you want to delete the channel #${name}? This is permanent and cannot be undone.`)) {
      return;
    }

    setDeletingChannelId(channelId);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await api.deleteChannel(guildId, channelId);
      
      setData(prev => ({
        ...prev,
        channels: prev.channels.filter(c => c.id !== channelId)
      }));

      setSuccessMsg(res.message || 'Channel deleted successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to delete channel.');
    } finally {
      setDeletingChannelId(null);
    }
  };

  // Moderation Handlers
  const handleTimeout = async (e) => {
    e.preventDefault();
    if (!timeoutTargetMember) return;

    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await api.timeoutMember(guildId, timeoutTargetMember.id, timeoutDuration, timeoutReason);
      setSuccessMsg(res.message);
      setShowTimeoutModal(false);
      setTimeoutReason('');
      
      // Update local member state
      const durationNum = parseInt(timeoutDuration);
      setMembers(prev => prev.map(m => m.id === timeoutTargetMember.id ? { 
        ...m, 
        isTimeouted: !!durationNum,
        timeoutUntil: durationNum ? new Date(Date.now() + durationNum * 60 * 1000).toISOString() : null
      } : m));

      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to timeout member.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveTimeout = async (member) => {
    setModeratingMemberId(member.id);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await api.timeoutMember(guildId, member.id, null, 'Timeout removed from Admin Portal');
      setSuccessMsg(res.message);
      setMembers(prev => prev.map(m => m.id === member.id ? { 
        ...m, 
        isTimeouted: false,
        timeoutUntil: null
      } : m));
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to remove timeout.');
    } finally {
      setModeratingMemberId(null);
    }
  };

  const handleKick = async (e) => {
    e.preventDefault();
    if (!kickTargetMember) return;

    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await api.kickMember(guildId, kickTargetMember.id, kickReason);
      setSuccessMsg(res.message);
      setShowKickModal(false);
      setKickReason('');
      
      setMembers(prev => prev.filter(m => m.id !== kickTargetMember.id));
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to kick member.');
    } finally {
      setSaving(false);
    }
  };

  const handleBan = async (e) => {
    e.preventDefault();
    if (!banTargetMember) return;

    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await api.banMember(guildId, banTargetMember.id, banReason);
      setSuccessMsg(res.message);
      setShowBanModal(false);
      setBanReason('');
      
      setMembers(prev => prev.filter(m => m.id !== banTargetMember.id));
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to ban member.');
    } finally {
      setSaving(false);
    }
  };

  const handleNicknameSubmit = async (e) => {
    e.preventDefault();
    if (!nicknameTargetMember) return;

    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await api.changeNickname(guildId, nicknameTargetMember.id, newNickname, nicknameReason);
      setSuccessMsg(res.message);
      setShowNicknameModal(false);
      setNicknameReason('');
      
      const updatedNick = newNickname.trim() === '' ? null : newNickname.trim();
      setMembers(prev => prev.map(m => m.id === nicknameTargetMember.id ? { 
        ...m, 
        nickname: updatedNick,
        displayName: updatedNick || m.username
      } : m));

      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to change member nickname.');
    } finally {
      setSaving(false);
    }
  };

  const handleRolesSubmit = async (e) => {
    e.preventDefault();
    if (!rolesTargetMember) return;

    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await api.updateMemberRoles(guildId, rolesTargetMember.id, selectedRoleIds, rolesReason);
      setSuccessMsg(res.message);
      setShowRolesModal(false);
      setRolesReason('');
      
      setMembers(prev => prev.map(m => m.id === rolesTargetMember.id ? { 
        ...m, 
        roles: res.roles
      } : m));

      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to update member roles.');
    } finally {
      setSaving(false);
    }
  };

  // Helper to resolve channel icon
  const getChannelIcon = (type) => {
    if (type === 4) return <Folder size={16} style={{ color: 'var(--secondary)' }} />;
    if (type === 2) return <Volume2 size={16} style={{ color: 'var(--text-secondary)' }} />;
    return <Hash size={16} style={{ color: 'var(--text-secondary)' }} />;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <Loader size={40} className="spin" style={{ color: 'var(--primary)', marginBottom: '16px' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading live server settings...</p>
        <style dangerouslySetInnerHTML={{__html: `
          .spin { animation: spin 1s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}} />
      </div>
    );
  }

  const categories = data?.channels.filter(c => c.type === 4) || [];
  const hasHierarchyWarning = members.some(m => !m.isBotSelf && !m.isOwner && (!m.kickable || !m.bannable || !m.moderatable || m.manageable === false));

  return (
    <div>
      <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Server size={24} style={{ color: 'var(--primary)' }} />
        Server Control Panel
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Configure live settings, channels, and manage members. Changes here update Discord instantly.
      </p>

      {/* Sub Tab Navigation */}
      <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px', paddingBottom: '2px' }}>
        <button
          type="button"
          onClick={() => handleSubTabClick('settings')}
          style={{
            background: 'none',
            border: 'none',
            color: activeSubTab === 'settings' ? '#ffffff' : 'var(--text-secondary)',
            fontSize: '0.95rem',
            fontWeight: activeSubTab === 'settings' ? '700' : '400',
            cursor: 'pointer',
            padding: '10px 16px',
            borderBottom: activeSubTab === 'settings' ? '2px solid var(--primary)' : '2px solid transparent',
            transition: 'all 0.2s ease',
            fontFamily: 'Outfit'
          }}
        >
          Server Settings & Channels
        </button>
        <button
          type="button"
          onClick={() => handleSubTabClick('members')}
          style={{
            background: 'none',
            border: 'none',
            color: activeSubTab === 'members' ? '#ffffff' : 'var(--text-secondary)',
            fontSize: '0.95rem',
            fontWeight: activeSubTab === 'members' ? '700' : '400',
            cursor: 'pointer',
            padding: '10px 16px',
            borderBottom: activeSubTab === 'members' ? '2px solid var(--primary)' : '2px solid transparent',
            transition: 'all 0.2s ease',
            fontFamily: 'Outfit'
          }}
        >
          Member Management
        </button>
        <button
          type="button"
          onClick={() => handleSubTabClick('bulk-nicknames')}
          style={{
            background: 'none',
            border: 'none',
            color: activeSubTab === 'bulk-nicknames' ? '#ffffff' : 'var(--text-secondary)',
            fontSize: '0.95rem',
            fontWeight: activeSubTab === 'bulk-nicknames' ? '700' : '400',
            cursor: 'pointer',
            padding: '10px 16px',
            borderBottom: activeSubTab === 'bulk-nicknames' ? '2px solid var(--primary)' : '2px solid transparent',
            transition: 'all 0.2s ease',
            fontFamily: 'Outfit'
          }}
        >
          Bulk Nicknames
        </button>
        <button
          type="button"
          onClick={() => handleSubTabClick('youtube')}
          style={{
            background: 'none',
            border: 'none',
            color: activeSubTab === 'youtube' ? '#ffffff' : 'var(--text-secondary)',
            fontSize: '0.95rem',
            fontWeight: activeSubTab === 'youtube' ? '700' : '400',
            cursor: 'pointer',
            padding: '10px 16px',
            borderBottom: activeSubTab === 'youtube' ? '2px solid var(--primary)' : '2px solid transparent',
            transition: 'all 0.2s ease',
            fontFamily: 'Outfit'
          }}
        >
          YouTube Announcements
        </button>
      </div>

      {successMsg && (
        <div className="glass-panel" style={{
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderColor: 'var(--success)',
          color: 'var(--success)',
          padding: '14px 20px',
          borderRadius: '10px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Check size={18} />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="glass-panel" style={{
          backgroundColor: 'rgba(244, 63, 94, 0.1)',
          borderColor: 'var(--danger)',
          color: 'var(--danger)',
          padding: '14px 20px',
          borderRadius: '10px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <X size={18} />
          {errorMsg}
        </div>
      )}

      {/* TAB 1: SERVER SETTINGS & CHANNELS */}
      {activeSubTab === 'settings' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          
          {/* Left Column: Server Settings */}
          <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '18px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Guild Visual Identity
            </h3>
            
            <form onSubmit={handleSaveGuildDetails} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Server Name
                </label>
                <input 
                  type="text" 
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  className="glass-input" 
                  placeholder="e.g. My Awesome Server"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Server Invite Link
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    value={data?.inviteUrl || 'No invite link available (permissions missing)'}
                    readOnly
                    className="glass-input"
                    style={{ backgroundColor: 'rgba(0,0,0,0.15)', color: 'var(--text-secondary)', cursor: 'default' }}
                  />
                  {data?.inviteUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(data.inviteUrl);
                        setSuccessMsg('Invite link copied to clipboard!');
                        setTimeout(() => setSuccessMsg(null), 3000);
                      }}
                      className="btn-secondary"
                      style={{ padding: '0 16px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                    >
                      Copy
                    </button>
                  )}
                </div>
              </div>

              {/* Server Icon */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Server Icon / Profile picture
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ position: 'relative' }}>
                    {iconPreview ? (
                      <img 
                        src={iconPreview} 
                        alt="Icon Preview" 
                        style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }}
                      />
                    ) : (
                      <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.03)', border: '2px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Image size={24} style={{ opacity: 0.3 }} />
                      </div>
                    )}
                  </div>
                  <label className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem', cursor: 'pointer' }}>
                    Choose Icon File
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setIconFile(file);
                          setIconPreview(URL.createObjectURL(file));
                        }
                      }} 
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              {/* Server Banner */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Server Banner
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {bannerPreview ? (
                    <img 
                      src={bannerPreview} 
                      alt="Banner Preview" 
                      style={{ width: '100%', height: '110px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '110px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.03)', border: '2px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No Banner Set</span>
                    </div>
                  )}
                  <label className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem', cursor: 'pointer', alignSelf: 'flex-start' }}>
                    Choose Banner File
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setBannerFile(file);
                          setBannerPreview(URL.createObjectURL(file));
                        }
                      }} 
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                  * Banners require Server Boost Tier 1/2 privilege on Discord.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px', alignSelf: 'flex-start' }}>
                <button 
                  type="button"
                  onClick={handleResetGuildDetails}
                  disabled={saving || !hasGuildChanges}
                  className="btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  Reset
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={saving} 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {saving ? <Loader size={16} className="spin" /> : null}
                  Save Guild Settings
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Channels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Create Channel */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                Create New Channel
              </h3>
              
              <form onSubmit={handleCreateChannel} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Channel Name
                    </label>
                    <input 
                      type="text" 
                      value={newChannelName}
                      onChange={(e) => setNewChannelName(e.target.value)}
                      className="glass-input" 
                      placeholder="e.g. general-chat"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Type
                    </label>
                    <select 
                      value={newChannelType} 
                      onChange={(e) => setNewChannelType(e.target.value)}
                      className="glass-input"
                    >
                      <option value="0">💬 Text Channel</option>
                      <option value="2">🔊 Voice Channel</option>
                      <option value="4">📁 Category</option>
                    </select>
                  </div>
                </div>

                {newChannelType !== '4' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Category (Parent)
                    </label>
                    <select 
                      value={newChannelParent} 
                      onChange={(e) => setNewChannelParent(e.target.value)}
                      className="glass-input"
                    >
                      <option value="">-- No Category --</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn-success" 
                  disabled={creatingChannel || !newChannelName.trim()} 
                  style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}
                >
                  <Plus size={16} />
                  Create Channel
                </button>
              </form>
            </div>

            {/* List of Channels */}
            <div className="glass-panel" style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                Server Channels ({data?.channels.length || 0})
              </h3>
              
              <div style={{ flexGrow: 1, overflowY: 'auto', maxHeight: '400px', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
                {!data?.channels || data?.channels.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center', margin: 'auto' }}>No channels found.</p>
                ) : (
                  data?.channels.map(channel => (
                    <div 
                      key={channel.id} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        padding: '8px 12px', 
                        borderRadius: '8px', 
                        backgroundColor: channel.type === 4 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.01)', 
                        border: '1px solid rgba(255,255,255,0.03)',
                        transition: 'all 0.2s ease',
                        fontWeight: channel.type === 4 ? '700' : '400',
                        marginLeft: channel.type !== 4 && channel.parentId ? '20px' : '0px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexGrow: 1, minWidth: 0 }}>
                        {getChannelIcon(channel.type)}
                        
                        {editingChannelId === channel.id ? (
                          <input 
                            type="text" 
                            value={editingChannelName}
                            onChange={(e) => setEditingChannelName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleRenameChannel(channel.id);
                              if (e.key === 'Escape') setEditingChannelId(null);
                            }}
                            className="glass-input"
                            style={{ height: '28px', fontSize: '0.88rem', padding: '0 8px', width: '80%' }}
                            autoFocus
                          />
                        ) : (
                          <span style={{ 
                            fontSize: '0.9rem', 
                            color: channel.type === 4 ? '#ffffff' : 'var(--text-secondary)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {channel.name}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px' }}>
                        {editingChannelId === channel.id ? (
                          <>
                            <button 
                              type="button"
                              onClick={() => handleRenameChannel(channel.id)} 
                              disabled={updatingChannelId === channel.id}
                              style={{ background: 'none', border: 'none', color: 'var(--success)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                              title="Save"
                            >
                              {updatingChannelId === channel.id ? <Loader size={14} className="spin" /> : <Check size={16} />}
                            </button>
                            <button 
                              type="button"
                              onClick={() => setEditingChannelId(null)} 
                              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                              title="Cancel"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              type="button"
                              onClick={() => {
                                setEditingChannelId(channel.id);
                                setEditingChannelName(channel.name);
                              }} 
                              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }}
                              onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                              title="Rename"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleDeleteChannel(channel.id, channel.name)} 
                              disabled={deletingChannelId === channel.id}
                              style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', opacity: 0.7, transition: 'opacity 0.2s' }}
                              onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                              onMouseLeave={(e) => e.currentTarget.style.opacity = 0.7}
                              title="Delete"
                            >
                              {deletingChannelId === channel.id ? <Loader size={14} className="spin" /> : <Trash2 size={14} />}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: MEMBER MANAGEMENT */}
      {activeSubTab === 'members' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} style={{ color: 'var(--primary)' }} />
              Manage Server Members
            </h3>
            
            {/* Search Input */}
            <form onSubmit={(e) => { e.preventDefault(); fetchMembers(searchQuery); }} style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '320px' }}>
              <div style={{ position: 'relative', flexGrow: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Filter by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="glass-input"
                  style={{ paddingLeft: '36px', height: '38px', fontSize: '0.88rem' }}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ padding: '0 16px', fontSize: '0.88rem', height: '38px' }}>
                Search
              </button>
            </form>
          </div>

          {hasHierarchyWarning && (
            <div className="glass-panel" style={{
              backgroundColor: 'rgba(234, 179, 8, 0.1)',
              borderColor: 'var(--warning)',
              color: 'var(--warning)',
              padding: '14px 20px',
              borderRadius: '10px',
              marginBottom: '20px',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <AlertTriangle size={18} style={{ flexShrink: 0 }} />
              <div style={{ textAlign: 'left' }}>
                <strong>Role Hierarchy Warning:</strong> The bot's role is positioned below some members in this server. To allow moderation actions on these members, go to your Discord Server Settings &gt; Roles and drag the bot's role higher.
              </div>
            </div>
          )}

          {loadingMembers ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Loader size={30} className="spin" style={{ color: 'var(--primary)', marginBottom: '12px' }} />
              <p style={{ color: 'var(--text-secondary)' }}>Syncing member directory...</p>
            </div>
          ) : members.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ color: 'var(--text-secondary)' }}>No members found. Refine your query or check bot permission.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '12px 16px' }}>Member</th>
                    <th style={{ padding: '12px 16px' }}>Roles</th>
                    <th style={{ padding: '12px 16px' }}>Safety Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map(member => (
                    <tr key={member.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.02)', transition: 'background-color 0.2s' }} className="member-row">
                      {/* Avatar + Username */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img 
                            src={member.avatar} 
                            alt={member.username} 
                            style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1px solid var(--border-color)', objectFit: 'cover' }}
                            onError={(e) => { e.target.src = 'https://cdn.discordapp.com/embed/avatars/0.png'; }}
                          />
                          <div>
                            <div style={{ fontWeight: '600', color: '#ffffff', fontSize: '0.92rem' }}>
                              {member.displayName}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                              @{member.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Roles */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '250px' }}>
                          {member.roles.length === 0 ? (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No roles</span>
                          ) : (
                            member.roles.slice(0, 3).map(role => (
                              <span 
                                key={role.id}
                                style={{
                                  fontSize: '0.68rem',
                                  fontWeight: '700',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  backgroundColor: role.color === '#000000' ? 'rgba(255, 255, 255, 0.06)' : `${role.color}15`,
                                  color: role.color === '#000000' ? '#e2e8f0' : role.color,
                                  border: `1px solid ${role.color === '#000000' ? 'rgba(255, 255, 255, 0.12)' : `${role.color}35`}`
                                }}
                              >
                                {role.name}
                              </span>
                            ))
                          )}
                          {member.roles.length > 3 && (
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>+{member.roles.length - 3} more</span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 16px' }}>
                        {member.isTimeouted ? (
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            backgroundColor: 'rgba(239, 68, 68, 0.12)',
                            color: 'var(--danger)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            Timed Out
                          </span>
                        ) : (
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            backgroundColor: 'rgba(16, 185, 129, 0.12)',
                            color: 'var(--success)',
                            border: '1px solid rgba(16, 185, 129, 0.25)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            Active
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setNicknameTargetMember(member);
                              setNewNickname(member.nickname || '');
                              setNicknameReason('');
                              setShowNicknameModal(true);
                            }}
                            disabled={member.isOwner || (member.manageable === false && !member.isBotSelf)}
                            className="btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          >
                            Nickname
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setRolesTargetMember(member);
                              setSelectedRoleIds(member.roles.map(r => r.id));
                              setRolesReason('');
                              setShowRolesModal(true);
                            }}
                            disabled={member.isOwner || (member.manageable === false && !member.isBotSelf)}
                            className="btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          >
                            Roles
                          </button>

                          {member.isTimeouted ? (
                            <button
                              type="button"
                              onClick={() => handleRemoveTimeout(member)}
                              disabled={moderatingMemberId === member.id || member.isBotSelf || member.isOwner}
                              className="btn-secondary"
                              style={{ padding: '6px 12px', fontSize: '0.8rem', borderColor: 'rgba(16, 185, 129, 0.3)', color: 'var(--success)' }}
                            >
                              {moderatingMemberId === member.id ? <Loader size={12} className="spin" /> : 'Remove Timeout'}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => { setTimeoutTargetMember(member); setShowTimeoutModal(true); }}
                              disabled={member.isBotSelf || member.isOwner}
                              className="btn-secondary"
                              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                            >
                              Timeout
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => { setKickTargetMember(member); setShowKickModal(true); }}
                            disabled={member.isBotSelf || member.isOwner}
                            className="btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--warning)', borderColor: 'rgba(234, 179, 8, 0.25)' }}
                          >
                            Kick
                          </button>

                          <button
                            type="button"
                            onClick={() => { setBanTargetMember(member); setShowBanModal(true); }}
                            disabled={member.isBotSelf || member.isOwner}
                            className="btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.25)' }}
                          >
                            Ban
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BULK NICKNAMES */}
      {activeSubTab === 'bulk-nicknames' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          
          {/* Left Column: Form Controls */}
          <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '18px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Nickname Configuration
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Nickname Template
                </label>
                <input 
                  type="text" 
                  value={nicknameTemplate}
                  onChange={(e) => setNicknameTemplate(e.target.value)}
                  className="glass-input" 
                  placeholder="e.g. {DISPLAY_NAME}"
                  disabled={applyingBulk}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                  Use <code>{'{USERNAME}'}</code> as a placeholder. It will be replaced with each user's chosen source name.
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Source Name
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input 
                      type="radio" 
                      name="sourceNameType" 
                      value="displayName" 
                      checked={nicknameSource === 'displayName'}
                      onChange={() => handleSourceChange('displayName')}
                      disabled={applyingBulk}
                    />
                    Display Name (Nickname)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input 
                      type="radio" 
                      name="sourceNameType" 
                      value="username" 
                      checked={nicknameSource === 'username'}
                      onChange={() => handleSourceChange('username')}
                      disabled={applyingBulk}
                    />
                    Username
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Capitalization Options
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input 
                      type="radio" 
                      name="casing" 
                      value="original" 
                      checked={nicknameCasing === 'original'}
                      onChange={() => setNicknameCasing('original')}
                      disabled={applyingBulk}
                    />
                    Keep Original (e.g. {nicknameSource === 'username' ? 'kallushappu' : 'Kallu Shappu'})
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input 
                      type="radio" 
                      name="casing" 
                      value="upper" 
                      checked={nicknameCasing === 'upper'}
                      onChange={() => setNicknameCasing('upper')}
                      disabled={applyingBulk}
                    />
                    UPPERCASE (e.g. KALLU SHAPPU)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input 
                      type="radio" 
                      name="casing" 
                      value="lower" 
                      checked={nicknameCasing === 'lower'}
                      onChange={() => setNicknameCasing('lower')}
                      disabled={applyingBulk}
                    />
                    lowercase (e.g. kallu shappu)
                  </label>
                </div>
              </div>

              {/* Interactive Live Preview */}
              <div className="glass-panel" style={{ padding: '14px', backgroundColor: 'rgba(255,255,255,0.02)', borderStyle: 'dashed' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Preview</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Original: <strong style={{ color: '#fff' }}>{nicknameSource === 'username' ? 'johndoe' : 'JohnDoe'}</strong>
                  </div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                    Result: {(() => {
                      const baseName = nicknameSource === 'username' ? 'johndoe' : 'JohnDoe';
                      const finalName = nicknameCasing === 'upper' 
                        ? baseName.toUpperCase() 
                        : nicknameCasing === 'lower' 
                          ? baseName.toLowerCase() 
                          : baseName;
                      const preview = nicknameTemplate
                        .replace(/\{username\}/gi, finalName)
                        .replace(/\{display_name\}/gi, finalName);
                      return preview.length > 32 ? preview.substring(0, 32) + '...' : preview;
                    })()}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={handleApplyBulkNicknames}
                  className="btn-primary" 
                  disabled={applyingBulk || !nicknameTemplate.trim()} 
                  style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {applyingBulk ? <Loader size={16} className="spin" /> : null}
                  Apply to All Members
                </button>
                <button 
                  type="button" 
                  onClick={handleResetBulkNicknames}
                  className="btn-secondary" 
                  disabled={applyingBulk} 
                  style={{ flexGrow: 1, color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.25)' }}
                >
                  Reset Nicknames
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Progress & Status */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '18px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Execution Progress
            </h3>

            {!nicknameProgress ? (
              <div style={{ margin: 'auto', textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                <Users size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                <p>No active bulk process.</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Configure options and click "Apply" to start.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
                
                {/* Status Indicator */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Status:</span>
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    backgroundColor: nicknameProgress.status === 'processing' 
                      ? 'rgba(37, 99, 235, 0.15)' 
                      : nicknameProgress.status === 'completed' 
                        ? 'rgba(16, 185, 129, 0.15)' 
                        : 'rgba(239, 68, 68, 0.15)',
                    color: nicknameProgress.status === 'processing' 
                      ? 'var(--primary)' 
                      : nicknameProgress.status === 'completed' 
                        ? 'var(--success)' 
                        : 'var(--danger)',
                    border: `1px solid ${nicknameProgress.status === 'processing' ? 'rgba(37, 99, 235, 0.3)' : nicknameProgress.status === 'completed' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                  }}>
                    {nicknameProgress.status.toUpperCase()}
                  </span>
                </div>

                {/* Progress Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="glass-panel" style={{ padding: '12px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>UPDATED</span>
                    <h4 style={{ fontSize: '1.25rem', marginTop: '4px', fontWeight: 'bold' }}>{nicknameProgress.current} / {nicknameProgress.total}</h4>
                  </div>
                  <div className="glass-panel" style={{ padding: '12px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>SUCCESS</span>
                    <h4 style={{ fontSize: '1.25rem', marginTop: '4px', fontWeight: 'bold', color: 'var(--success)' }}>{nicknameProgress.success}</h4>
                  </div>
                  <div className="glass-panel" style={{ padding: '12px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.01)', gridColumn: 'span 2' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>FAILED / SKIPPED</span>
                    <h4 style={{ fontSize: '1.25rem', marginTop: '4px', fontWeight: 'bold', color: 'var(--danger)' }}>{nicknameProgress.fail}</h4>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    <span>Progress</span>
                    <span>{nicknameProgress.total > 0 ? Math.round((nicknameProgress.current / nicknameProgress.total) * 100) : 0}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${nicknameProgress.total > 0 ? (nicknameProgress.current / nicknameProgress.total) * 100 : 0}%`,
                      height: '100%',
                      backgroundColor: 'var(--primary)',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>

                {/* Activity Log */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Activity Log</span>
                  <div 
                    ref={logContainerRef}
                    style={{
                      width: '100%',
                      height: '150px',
                      backgroundColor: 'rgba(0, 0, 0, 0.25)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '10px',
                      overflowY: 'auto',
                      fontFamily: 'monospace',
                      fontSize: '0.78rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}
                  >
                    {!nicknameProgress.logs || nicknameProgress.logs.length === 0 ? (
                      <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', margin: 'auto' }}>Waiting for updates...</span>
                    ) : (
                      nicknameProgress.logs.map((log, idx) => (
                        <div key={idx} style={{ 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          gap: '6px',
                          color: log.status === 'success' 
                            ? 'var(--success)' 
                            : log.status === 'fail' 
                              ? 'var(--danger)' 
                              : '#ffffff'
                        }}>
                          {log.status === 'success' && <span style={{ color: 'var(--success)' }}>[✓]</span>}
                          {log.status === 'fail' && <span style={{ color: 'var(--danger)' }}>[✗]</span>}
                          {log.status === 'info' && <span style={{ color: 'var(--secondary)' }}>[i]</span>}
                          
                          <div style={{ textAlign: 'left' }}>
                            {log.status === 'success' && (
                              <span>Changed <strong>@{log.username}</strong> to <code>{log.nickname}</code></span>
                            )}
                            {log.status === 'fail' && (
                              <span>Failed <strong>@{log.username}</strong>: {log.error}</span>
                            )}
                            {log.status === 'info' && (
                              <span>{log.message}</span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Cancel Button */}
                {nicknameProgress.status === 'processing' && (
                  <button 
                    type="button" 
                    onClick={handleCancelBulkNicknames}
                    className="btn-secondary"
                    style={{ width: '100%', marginTop: '10px', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                  >
                    Cancel Execution
                  </button>
                )}

              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: YOUTUBE ANNOUNCEMENTS */}
      {activeSubTab === 'youtube' && (
        <div>
          {loadingSettings ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Loader size={30} className="spin" style={{ color: 'var(--primary)', marginBottom: '12px' }} />
              <p style={{ color: 'var(--text-secondary)' }}>Loading YouTube configuration...</p>
            </div>
          ) : settings && (
            <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                
                {/* Toggle header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>YouTube Upload Notifications</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Toggle the automated YouTube uploader checker system.</p>
                  </div>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={settings.youtube?.enabled || false} 
                      onChange={() => handleToggle('youtube.enabled')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                {settings.youtube?.enabled && (
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Account URL Row */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        YouTube Channel URL or Handle <span style={{ color: 'var(--danger)' }}>*</span>
                      </label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input 
                          type="text" 
                          value={settings.youtube?.channelUrl || ''} 
                          onChange={(e) => handleInputChange('youtube.channelUrl', e.target.value)}
                          className="glass-input"
                          placeholder="e.g. @kallushappu or https://youtube.com/channel/UC..."
                        />
                        <button
                          type="button"
                          onClick={handleResolveYoutubeChannel}
                          disabled={resolvingChannel || !settings.youtube?.channelUrl}
                          className="btn-primary"
                          style={{ whiteSpace: 'nowrap', minWidth: '130px', justifyContent: 'center' }}
                        >
                          {resolvingChannel ? 'Connecting...' : 'Connect Channel'}
                        </button>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                        Enter YouTube custom handle (with @) or channel URL, then click Connect.
                      </span>
                    </div>

                    {/* Resolved Channel details */}
                    {settings.youtube?.channelId && (
                      <div className="glass-panel" style={{ 
                        padding: '12px 16px', 
                        backgroundColor: 'rgba(37, 99, 235, 0.05)', 
                        borderColor: 'rgba(37, 99, 235, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '10px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
                          <span style={{ fontSize: '0.88rem', fontWeight: '500' }}>
                            Connected Channel: <strong style={{ color: 'white' }}>{settings.youtube?.channelName || 'YouTube Channel'}</strong>
                          </span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                          ID: {settings.youtube?.channelId}
                        </span>
                      </div>
                    )}

                    {resolveSuccessMsg && (
                      <div style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: '500' }}>
                        {resolveSuccessMsg}
                      </div>
                    )}

                    {/* Selectors row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                      
                      {/* Announcement Discord Channel */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                          Announcement Discord Channel <span style={{ color: 'var(--danger)' }}>*</span>
                        </label>
                        <select 
                          value={settings.youtube?.targetChannelId || ''}
                          onChange={(e) => handleInputChange('youtube.targetChannelId', e.target.value)}
                          className="glass-input"
                        >
                          <option value="">-- Select Discord Channel --</option>
                          {(data?.channels || []).filter(c => c.type === 0).map(ch => (
                            <option key={ch.id} value={ch.id}>#{ch.name}</option>
                          ))}
                        </select>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                          The channel where upload announcements will be published.
                        </span>
                      </div>

                      {/* Ping Mention Role */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                          Mention Role (Ping)
                        </label>
                        <select 
                          value={settings.youtube?.pingRoleId || ''}
                          onChange={(e) => handleInputChange('youtube.pingRoleId', e.target.value)}
                          className="glass-input"
                        >
                          <option value="">-- None --</option>
                          <option value="everyone">@everyone</option>
                          <option value="here">@here</option>
                          {serverRoles.map(role => (
                            <option key={role.id} value={role.id} style={{ color: role.color }}>@{role.name}</option>
                          ))}
                        </select>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                          Optional role to mention/ping when announcing new videos.
                        </span>
                      </div>

                    </div>

                    {/* Announcement Template */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        Video Upload Message Template
                      </label>
                      <textarea 
                        value={settings.youtube?.messageTemplate || ''}
                        onChange={(e) => handleInputChange('youtube.messageTemplate', e.target.value)}
                        className="glass-input"
                        style={{ minHeight: '90px', fontFamily: 'monospace', fontSize: '0.9rem' }}
                        placeholder="{url}"
                      />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                        Available Placeholders: <code>{`{channel}`}</code> (YouTube Channel Name), <code>{`{title}`}</code> (Video Title), <code>{`{url}`}</code> (Video Link).
                      </span>
                    </div>

                    {/* Live Discord Message Preview */}
                    <div style={{ marginTop: '10px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                        Live Discord Announcement Preview
                      </label>
                      
                      <div style={{
                        backgroundColor: '#313338',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                        color: '#dbdee1',
                        fontSize: '0.9375rem',
                        lineHeight: '1.375rem',
                        border: '1px solid rgba(255,255,255,0.05)',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                        width: '100%',
                        maxWidth: '520px'
                      }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                          <img 
                            src={data?.icon || 'https://cdn.discordapp.com/embed/avatars/0.png'} 
                            alt="" 
                            style={{ width: '36px', height: '36px', borderRadius: '50%' }}
                          />
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontWeight: '600', color: '#f2f3f5', fontSize: '0.95rem' }}>
                                KALLU SHAPPU MODE
                              </span>
                              <span style={{
                                backgroundColor: '#5865F2',
                                color: '#ffffff',
                                fontSize: '0.625rem',
                                fontWeight: '700',
                                padding: '1px 4px',
                                borderRadius: '3px',
                                lineHeight: '0.8rem',
                                height: '14px',
                                display: 'inline-flex',
                                alignItems: 'center'
                              }}>
                                BOT
                              </span>
                              <span style={{ fontSize: '0.72rem', color: '#949ba4' }}>
                                Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div style={{ marginTop: '4px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                              {/* Ping preview */}
                              {settings.youtube?.pingRoleId && settings.youtube?.pingRoleId !== 'none' && (
                                <span style={{ 
                                  backgroundColor: 'rgba(88, 101, 242, 0.3)', 
                                  color: '#c9cdfb', 
                                  padding: '0 4px', 
                                  borderRadius: '3px', 
                                  fontWeight: '500',
                                  marginRight: '6px',
                                  userSelect: 'none'
                                }}>
                                  {settings.youtube?.pingRoleId === 'everyone' ? '@everyone' : 
                                   settings.youtube?.pingRoleId === 'here' ? '@here' : 
                                   `@${serverRoles.find(r => r.id === settings.youtube?.pingRoleId)?.name || 'Role'}`}
                                </span>
                              )}
                              
                              {formatPreviewMessage(settings.youtube?.messageTemplate, settings.youtube?.channelName)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* Submit button footer */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                  <button 
                    type="button"
                    onClick={handleResetSettings}
                    disabled={saving || !hasYoutubeChanges}
                    className="btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
                  >
                    Reset
                  </button>
                  <button 
                    type="submit" 
                    disabled={saving} 
                    className="btn-primary"
                    style={{ gap: '10px', display: 'flex', alignItems: 'center', padding: '10px 20px' }}
                  >
                    <Save size={18} />
                    {saving ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Timeout Modal Overlay */}
      {showTimeoutModal && timeoutTargetMember && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease'
        }}>
          <div className="glass-panel animate-slide-up" style={{
            width: '100%',
            maxWidth: '400px',
            padding: '24px',
            backgroundColor: 'rgba(20, 18, 30, 0.95)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '6px' }}>
              Timeout Member
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
              Select timeout period and enter a reason for **@{timeoutTargetMember.username}**.
            </p>

            <form onSubmit={handleTimeout} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Timeout Duration
                </label>
                <select 
                  value={timeoutDuration}
                  onChange={(e) => setTimeoutDuration(e.target.value)}
                  className="glass-input"
                >
                  <option value="1">1 Minute</option>
                  <option value="5">5 Minutes</option>
                  <option value="10">10 Minutes</option>
                  <option value="60">1 Hour</option>
                  <option value="1440">1 Day</option>
                  <option value="10080">1 Week</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Reason (Optional)
                </label>
                <input 
                  type="text"
                  value={timeoutReason}
                  onChange={(e) => setTimeoutReason(e.target.value)}
                  className="glass-input"
                  placeholder="Spamming chat channels"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowTimeoutModal(false)} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving} style={{ padding: '8px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {saving && <Loader size={14} className="spin" />}
                  Timeout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Kick Modal Overlay */}
      {showKickModal && kickTargetMember && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease'
        }}>
          <div className="glass-panel animate-slide-up" style={{
            width: '100%',
            maxWidth: '400px',
            padding: '24px',
            backgroundColor: 'rgba(20, 18, 30, 0.95)',
            border: '1px solid rgba(234, 179, 8, 0.3)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '6px', color: 'var(--warning)' }}>
              Kick Member
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
              Are you sure you want to kick **@{kickTargetMember.username}**? They will be removed but can rejoin.
            </p>

            <form onSubmit={handleKick} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Reason (Optional)
                </label>
                <input 
                  type="text"
                  value={kickReason}
                  onChange={(e) => setKickReason(e.target.value)}
                  className="glass-input"
                  placeholder="Violating guidelines"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowKickModal(false)} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving} style={{ padding: '8px 14px', fontSize: '0.85rem', backgroundColor: 'var(--warning)', borderColor: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {saving && <Loader size={14} className="spin" />}
                  Kick User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ban Modal Overlay */}
      {showBanModal && banTargetMember && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease'
        }}>
          <div className="glass-panel animate-slide-up" style={{
            width: '100%',
            maxWidth: '400px',
            padding: '24px',
            backgroundColor: 'rgba(20, 18, 30, 0.95)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '6px', color: 'var(--danger)' }}>
              Ban Member
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
              Are you sure you want to ban **@{banTargetMember.username}**? This blocks them from rejoining.
            </p>

            <form onSubmit={handleBan} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Reason (Optional)
                </label>
                <input 
                  type="text"
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  className="glass-input"
                  placeholder="Raiding or self-bots"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowBanModal(false)} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving} style={{ padding: '8px 14px', fontSize: '0.85rem', backgroundColor: 'var(--danger)', borderColor: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {saving && <Loader size={14} className="spin" />}
                  Ban User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Nickname Modal Overlay */}
      {showNicknameModal && nicknameTargetMember && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease'
        }}>
          <div className="glass-panel animate-slide-up" style={{
            width: '100%',
            maxWidth: '400px',
            padding: '24px',
            backgroundColor: 'rgba(20, 18, 30, 0.95)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '6px' }}>
              Change Member Nickname
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
              Update nickname for **@{nicknameTargetMember.username}**. Leave blank to reset to username.
            </p>

            <form onSubmit={handleNicknameSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Nickname
                </label>
                <input 
                  type="text"
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  className="glass-input"
                  placeholder="Enter new nickname"
                  maxLength={32}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Reason (Optional)
                </label>
                <input 
                  type="text"
                  value={nicknameReason}
                  onChange={(e) => setNicknameReason(e.target.value)}
                  className="glass-input"
                  placeholder="Inappropriate username/nick"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowNicknameModal(false)} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving} style={{ padding: '8px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {saving && <Loader size={14} className="spin" />}
                  Change Nickname
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Roles Modal Overlay */}
      {showRolesModal && rolesTargetMember && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease'
        }}>
          <div className="glass-panel animate-slide-up" style={{
            width: '100%',
            maxWidth: '420px',
            padding: '24px',
            backgroundColor: 'rgba(20, 18, 30, 0.95)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '85vh'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '6px' }}>
              Manage Member Roles
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
              Assign or remove roles for **@{rolesTargetMember.username}**.
            </p>

            <form onSubmit={handleRolesSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', flexGrow: 1, minHeight: 0 }}>
              
              {/* Roles list container */}
              <div style={{ 
                flexGrow: 1, 
                overflowY: 'auto', 
                maxHeight: '280px', 
                border: '1px solid var(--border-color)', 
                borderRadius: '8px', 
                padding: '12px',
                backgroundColor: 'rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {loadingRoles ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '20px 0' }}>
                    <Loader size={16} className="spin" />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Loading roles...</span>
                  </div>
                ) : serverRoles.length === 0 ? (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', textAlign: 'center', margin: 'auto' }}>
                    No assignable roles found in this server.
                  </span>
                ) : (
                  serverRoles.map(role => {
                    const isChecked = selectedRoleIds.includes(role.id);
                    const isManageable = role.manageable;

                    return (
                      <label 
                        key={role.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          backgroundColor: isChecked ? 'rgba(255,255,255,0.03)' : 'transparent',
                          cursor: isManageable ? 'pointer' : 'not-allowed',
                          opacity: isManageable ? 1 : 0.5,
                          transition: 'background-color 0.2s',
                          border: `1px solid ${isChecked ? 'rgba(255,255,255,0.08)' : 'transparent'}`
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            disabled={!isManageable}
                            onChange={(e) => {
                              if (!isManageable) return;
                              if (e.target.checked) {
                                setSelectedRoleIds(prev => [...prev, role.id]);
                              } else {
                                setSelectedRoleIds(prev => prev.filter(id => id !== role.id));
                              }
                            }}
                            style={{ cursor: isManageable ? 'pointer' : 'not-allowed' }}
                          />
                          <span style={{
                            fontSize: '0.88rem',
                            fontWeight: '600',
                            color: role.color === '#000000' ? '#ffffff' : role.color
                          }}>
                            {role.name}
                          </span>
                        </div>
                        
                        {!isManageable && (
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            Too high / Managed
                          </span>
                        )}
                      </label>
                    );
                  })
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Reason (Optional)
                </label>
                <input 
                  type="text"
                  value={rolesReason}
                  onChange={(e) => setRolesReason(e.target.value)}
                  className="glass-input"
                  placeholder="Verifying membership or level up"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowRolesModal(false)} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving || loadingRoles} style={{ padding: '8px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {saving && <Loader size={14} className="spin" />}
                  Save Roles
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .member-row:hover { background-color: rgba(255, 255, 255, 0.015) !important; }
      `}} />
    </div>
  );
}
