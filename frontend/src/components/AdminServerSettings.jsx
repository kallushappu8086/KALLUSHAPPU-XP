import { useState, useEffect, useRef } from 'react';
import { api } from '../utils/api';
import { Edit3, Trash2, Plus, Folder, Hash, Volume2, Image, Server, Check, X, Loader, Users, Search, AlertTriangle, Save, Award, Zap, MessageSquare, ShieldAlert, Send, Sparkles, Terminal, Heart, CheckSquare, Square, Eye, Mic, Activity, Clock, BarChart2 } from 'lucide-react';
import { io } from 'socket.io-client';
import AdminCustomVc from './AdminCustomVc';
import AdminServerControl from './AdminServerControl';




const DEFAULT_LEVEL_CONFIGS = [
  { level: 1, xpRequired: 100, roleName: 'Level 1', roleColor: '#3b82f6', roleId: '' },
  { level: 2, xpRequired: 400, roleName: 'Level 2', roleColor: '#10b981', roleId: '' },
  { level: 3, xpRequired: 900, roleName: 'Level 3', roleColor: '#06b6d4', roleId: '' },
  { level: 4, xpRequired: 1600, roleName: 'Level 4', roleColor: '#8b5cf6', roleId: '' },
  { level: 5, xpRequired: 2500, roleName: 'Level 5', roleColor: '#a855f7', roleId: '' },
  { level: 10, xpRequired: 10000, roleName: 'Level 10', roleColor: '#e11d48', roleId: '' },
  { level: 15, xpRequired: 22500, roleName: 'Level 15', roleColor: '#6366f1', roleId: '' },
  { level: 20, xpRequired: 40000, roleName: 'Level 20', roleColor: '#14b8a6', roleId: '' },
  { level: 25, xpRequired: 62500, roleName: 'Level 25', roleColor: '#d97706', roleId: '' },
  { level: 50, xpRequired: 250000, roleName: 'Level 50', roleColor: '#f59e0b', roleId: '' },
  { level: 100, xpRequired: 1000000, roleName: 'Level 100', roleColor: '#38bdf8', roleId: '' }
];

export default function AdminServerSettings({ guildId, onHasUnsavedChangesChange, initialTab = 'settings' }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [savedSettings, setSavedSettings] = useState(null);

  // Sub Tab State
  const [activeSubTab, setActiveSubTab] = useState(initialTab || 'settings');

  useEffect(() => {
    if (initialTab) {
      setActiveSubTab(initialTab);
    }
  }, [initialTab]);

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

  // Member Leveling & XP States
  const [levelStats, setLevelStats] = useState(null);
  const [levelMembers, setLevelMembers] = useState([]);
  const [loadingLevelData, setLoadingLevelData] = useState(false);
  const [levelSearchQuery, setLevelSearchQuery] = useState('');
  const [newLevelRewardLevel, setNewLevelRewardLevel] = useState(1);
  const [newLevelRewardRoleId, setNewLevelRewardRoleId] = useState('');
  const [levelEditMember, setLevelEditMember] = useState(null);
  const [levelEditXpAction, setLevelEditXpAction] = useState('add');
  const [levelEditXpAmount, setLevelEditXpAmount] = useState('100');
  const [testingAnnouncement, setTestingAnnouncement] = useState(false);

  // Member XP & Voice Details Dossier State
  const [selectedMemberDetails, setSelectedMemberDetails] = useState(null);
  const [showMemberDetailsModal, setShowMemberDetailsModal] = useState(false);
  const [loadingMemberDetails, setLoadingMemberDetails] = useState(false);

  const handleOpenMemberDetails = async (member) => {
    try {
      setSelectedMemberDetails(member);
      setShowMemberDetailsModal(true);
      setLoadingMemberDetails(true);
      const fullDetails = await api.getMemberLevelDetails(guildId, member.userId).catch(() => null);
      if (fullDetails) {
        setSelectedMemberDetails(fullDetails);
      }
    } catch (err) {
      console.error('Failed to load full member XP details:', err);
    } finally {
      setLoadingMemberDetails(false);
    }
  };

  // Create Custom Level Modal States
  const [showCreateLevelModal, setShowCreateLevelModal] = useState(false);
  const [newLevelNumber, setNewLevelNumber] = useState('');
  const [newLevelXpRequired, setNewLevelXpRequired] = useState('');
  const [newLevelRoleName, setNewLevelRoleName] = useState('');
  const [newLevelRoleColor, setNewLevelRoleColor] = useState('#3b82f6');
  const [newLevelRoleId, setNewLevelRoleId] = useState('');

  // Server settings state
  const [settings, setSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [loveChannelSearch, setLoveChannelSearch] = useState('');
  const [xpChannelSearch, setXpChannelSearch] = useState('');
  const [chatXpChannelSearch, setChatXpChannelSearch] = useState('');
  const [voiceXpChannelSearch, setVoiceXpChannelSearch] = useState('');

  const fetchLevelData = async () => {
    try {
      setLoadingLevelData(true);
      setErrorMsg(null);
      const [sData, stats, lData] = await Promise.all([
        api.getSettings(guildId).catch(() => null),
        api.getLevelStats(guildId).catch(() => null),
        api.getLevelLeaderboard(guildId, { search: levelSearchQuery }).catch(() => ({ members: [] }))
      ]);

      if (sData) {
        if (!sData.leveling) sData.leveling = {};
        if (sData.leveling.removePreviousRoles === undefined) sData.leveling.removePreviousRoles = true;
        if (sData.leveling.notifyLevelUp === undefined) sData.leveling.notifyLevelUp = true;
        if (sData.leveling.levelUpChannelId === undefined) sData.leveling.levelUpChannelId = '';
        if (!sData.leveling.levelUpMessage) sData.leveling.levelUpMessage = 'Awesome job, {user}! You just leveled up.';
        if (!Array.isArray(sData.leveling.allowedTextChannels)) {
          sData.leveling.allowedTextChannels = sData.leveling.allowedChatChannels || [];
        }
        if (!Array.isArray(sData.leveling.allowedVoiceChannels)) {
          sData.leveling.allowedVoiceChannels = [];
        }
        if (!sData.leveling.levelRoles || sData.leveling.levelRoles.length === 0) {
          sData.leveling.levelRoles = JSON.parse(JSON.stringify(DEFAULT_LEVEL_CONFIGS));
        } else {
          sData.leveling.levelRoles = sData.leveling.levelRoles.map(r => ({
            ...r,
            xpRequired: (r.xpRequired !== undefined && r.xpRequired !== null && r.xpRequired >= 0)
              ? r.xpRequired
              : Math.round(Math.pow(((r.level || 1) - 1) / 0.1, 2)) || 100
          }));
        }
        setSettings(sData);
        setSavedSettings(JSON.parse(JSON.stringify(sData)));
      }
      if (stats) setLevelStats(stats);
      if (lData && lData.members) setLevelMembers(lData.members);
      fetchRoles();
    } catch (err) {
      console.error('Failed to fetch level data in Admin Portal:', err);
      setErrorMsg('Failed to fetch server level data.');
    } finally {
      setLoadingLevelData(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'levels') {
      fetchLevelData();
    } else if (activeSubTab === 'commands') {
      if (!settings) {
        api.getSettings(guildId).then(s => {
          if (s) {
            setSettings(s);
            setSavedSettings(JSON.parse(JSON.stringify(s)));
          }
        }).catch(() => { });
      }
    }
  }, [activeSubTab, guildId, levelSearchQuery]);

  const handleUpdateLevelRole = (index, field, value) => {
    setSettings(prev => {
      const currentRoles = prev?.leveling?.levelRoles && prev.leveling.levelRoles.length > 0
        ? JSON.parse(JSON.stringify(prev.leveling.levelRoles))
        : JSON.parse(JSON.stringify(DEFAULT_LEVEL_CONFIGS));

      if (!currentRoles[index]) return prev;

      if (field === 'level') {
        currentRoles[index].level = parseInt(value) || 1;
      } else if (field === 'xpRequired') {
        currentRoles[index].xpRequired = Math.max(0, parseInt(value) || 0);
      } else if (field === 'roleName') {
        currentRoles[index].roleName = value;
      } else if (field === 'roleColor') {
        currentRoles[index].roleColor = value;
      } else if (field === 'roleId') {
        currentRoles[index].roleId = value;
        if (value) {
          const roleObj = serverRoles.find(r => r.id === value);
          if (roleObj) {
            currentRoles[index].roleName = roleObj.name;
            if (roleObj.color && roleObj.color !== '#000000') {
              currentRoles[index].roleColor = roleObj.color;
            }
          }
        }
      }

      return {
        ...prev,
        leveling: {
          ...(prev?.leveling || {}),
          levelRoles: currentRoles
        }
      };
    });
  };

  const handleAddNewLevelRow = () => {
    setSettings(prev => {
      const currentRoles = prev?.leveling?.levelRoles && prev.leveling.levelRoles.length > 0
        ? JSON.parse(JSON.stringify(prev.leveling.levelRoles))
        : JSON.parse(JSON.stringify(DEFAULT_LEVEL_CONFIGS));

      const maxLevel = currentRoles.length > 0 ? Math.max(...currentRoles.map(r => Number(r.level) || 0)) : 0;
      const nextLevel = maxLevel + 1;
      const defaultXp = Math.round(Math.pow((nextLevel - 1) / 0.1, 2)) || 100;

      const newRow = {
        level: nextLevel,
        xpRequired: defaultXp,
        roleName: `Level ${nextLevel}`,
        roleColor: '#3b82f6',
        roleId: ''
      };

      const updated = [...currentRoles, newRow].sort((a, b) => Number(a.level) - Number(b.level));

      return {
        ...prev,
        leveling: {
          ...(prev?.leveling || {}),
          levelRoles: updated
        }
      };
    });
  };

  const handleCreateCustomLevelSubmit = (e) => {
    if (e) e.preventDefault();
    const lvl = parseInt(newLevelNumber);
    const xp = parseInt(newLevelXpRequired);

    if (isNaN(lvl) || lvl <= 0) {
      alert('Please enter a valid target Level Number (e.g. 1, 2, 3, 10).');
      return;
    }
    if (isNaN(xp) || xp < 0) {
      alert('Please enter a valid Required XP amount (e.g. 100, 500, 1000).');
      return;
    }

    const roleObj = serverRoles.find(r => r.id === newLevelRoleId);
    const roleName = newLevelRoleName.trim() || (roleObj ? roleObj.name : `Level ${lvl}`);
    const roleColor = newLevelRoleColor || (roleObj && roleObj.color && roleObj.color !== '#000000' ? roleObj.color : '#3b82f6');

    setSettings(prev => {
      const currentRoles = prev?.leveling?.levelRoles && prev.leveling.levelRoles.length > 0
        ? JSON.parse(JSON.stringify(prev.leveling.levelRoles))
        : JSON.parse(JSON.stringify(DEFAULT_LEVEL_CONFIGS));

      const filtered = currentRoles.filter(r => Number(r.level) !== lvl);
      const updated = [
        ...filtered,
        {
          level: lvl,
          xpRequired: xp,
          roleName,
          roleColor,
          roleId: newLevelRoleId || ''
        }
      ].sort((a, b) => Number(a.level) - Number(b.level));

      return {
        ...prev,
        leveling: {
          ...(prev?.leveling || {}),
          levelRoles: updated
        }
      };
    });

    setShowCreateLevelModal(false);
    setNewLevelNumber('');
    setNewLevelXpRequired('');
    setNewLevelRoleName('');
    setNewLevelRoleColor('#3b82f6');
    setNewLevelRoleId('');
    setSuccessMsg(`Level ${lvl} created successfully! Click 'Save Level XP Configuration' to save changes.`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleResetDefaultLevels = () => {
    if (!window.confirm('Reset level thresholds and XP requirements back to standard defaults?')) return;
    setSettings(prev => ({
      ...prev,
      leveling: {
        ...(prev?.leveling || {}),
        levelRoles: JSON.parse(JSON.stringify(DEFAULT_LEVEL_CONFIGS))
      }
    }));
  };

  const handleAddLevelRoleReward = () => {
    const levelNum = parseInt(newLevelRewardLevel);
    if (isNaN(levelNum) || levelNum <= 0) {
      alert('Please enter a valid target level number (e.g. 1, 5, 10).');
      return;
    }

    const defaultXp = Math.round(Math.pow((levelNum - 1) / 0.1, 2)) || 100;
    const roleObj = serverRoles.find(r => r.id === newLevelRewardRoleId);
    const roleName = roleObj ? roleObj.name : `Level ${levelNum}`;
    const roleColor = roleObj && roleObj.color && roleObj.color !== '#000000' ? roleObj.color : '#3b82f6';

    setSettings(prev => {
      const currentRoles = prev?.leveling?.levelRoles || [];
      const updatedRoles = [
        ...currentRoles.filter(r => Number(r.level) !== levelNum),
        {
          level: levelNum,
          xpRequired: defaultXp,
          roleId: newLevelRewardRoleId || '',
          roleName,
          roleColor
        }
      ];
      updatedRoles.sort((a, b) => Number(a.level) - Number(b.level));

      return {
        ...prev,
        leveling: {
          ...(prev?.leveling || {}),
          levelRoles: updatedRoles
        }
      };
    });

    setNewLevelRewardRoleId('');
  };

  const handleRemoveLevelRoleReward = (index) => {
    setSettings(prev => {
      const currentRoles = prev?.leveling?.levelRoles || [];
      const updatedRoles = currentRoles.filter((_, idx) => idx !== index);
      return {
        ...prev,
        leveling: {
          ...(prev?.leveling || {}),
          levelRoles: updatedRoles
        }
      };
    });
  };

  const handleSaveLevelingSettings = async () => {
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      const updated = await api.saveSettings(guildId, settings);
      setSettings(updated);
      setSavedSettings(JSON.parse(JSON.stringify(updated)));
      setSuccessMsg('Server Leveling & Level Role Rewards settings saved successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to save leveling settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTestAnnouncement = async () => {
    const targetChanId = settings?.leveling?.levelUpChannelId;
    if (!targetChanId) {
      setErrorMsg('Please select an Announcement Channel first to send a test announcement.');
      setTimeout(() => setErrorMsg(null), 4000);
      return;
    }
    setTestingAnnouncement(true);
    setErrorMsg(null);
    try {
      const res = await api.sendTestLevelUpAnnouncement(guildId, targetChanId, 5);
      setSuccessMsg(res.message || 'Test level-up announcement sent to Discord!');
      setTimeout(() => setSuccessMsg(null), 4500);
    } catch (err) {
      console.error('Failed sending test announcement:', err);
      setErrorMsg(err.message || 'Failed to send test announcement to Discord.');
      setTimeout(() => setErrorMsg(null), 5000);
    } finally {
      setTestingAnnouncement(false);
    }
  };

  const handleAutoGenerateLevelRoles = async () => {
    if (!window.confirm('✨ Auto-generate Discord level roles with custom distinct colors?\n\nThis will automatically create level roles (Level 1, Level 2, Level 3, Level 5, Level 10, Level 15, Level 20, Level 25, Level 50, Level 100) in your Discord server with vibrant distinct colors and link them to your XP settings.')) return;
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await api.autoGenerateLevelRoles(guildId);
      setSuccessMsg(res.message || 'Auto-generated level roles successfully!');
      fetchLevelData();
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to auto-generate level roles.');
    } finally {
      setSaving(false);
    }
  };

  const handleAuditSyncLevels = async () => {
    if (!window.confirm('🔄 Recalculate & Sync All Member XP Levels?\n\nThis will audit all member XP across your server, recalculate their accurate level based on your configured Required XP table, and synchronize Discord roles (removing unearned roles). Continue?')) return;
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await api.auditSyncLevelRoles(guildId);
      setSuccessMsg(res.message || 'Audited and synced all member levels!');
      fetchLevelData();
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to sync member levels: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCommandsSettings = async () => {
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      const updated = await api.saveSettings(guildId, settings);
      setSettings(updated);
      setSavedSettings(JSON.parse(JSON.stringify(updated)));
      setSuccessMsg('Bot command triggers and allowed channels saved successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Failed saving command settings:', err);
      setErrorMsg('Failed to save command settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleResetCommandsSettings = () => {
    if (!window.confirm('Reset Love Test and XP commands to default values?')) return;
    setSettings(prev => ({
      ...prev,
      botCommands: {
        loveTest: { command: 'ship', allowedChannels: [], restrictChannels: false },
        xp: { command: 'xp', allowedChannels: [], restrictChannels: false }
      }
    }));
    setSuccessMsg('Command settings reset to defaults. Click "Save Commands & Channel Restrictions" to apply.');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleUpdateCommandTrigger = (cmdKey, val) => {
    setSettings(prev => {
      const cur = prev || {};
      const bc = cur.botCommands || {
        loveTest: { command: 'ship', allowedChannels: [], restrictChannels: false },
        xp: { command: 'xp', allowedChannels: [], restrictChannels: false }
      };
      return {
        ...cur,
        botCommands: {
          ...bc,
          [cmdKey]: {
            ...(bc[cmdKey] || {}),
            command: val
          }
        }
      };
    });
  };

  const handleToggleCommandRestriction = (cmdKey) => {
    setSettings(prev => {
      const cur = prev || {};
      const bc = cur.botCommands || {
        loveTest: { command: 'ship', allowedChannels: [], restrictChannels: false },
        xp: { command: 'xp', allowedChannels: [], restrictChannels: false }
      };
      const curVal = bc[cmdKey]?.restrictChannels || false;
      return {
        ...cur,
        botCommands: {
          ...bc,
          [cmdKey]: {
            ...(bc[cmdKey] || {}),
            restrictChannels: !curVal
          }
        }
      };
    });
  };

  const handleToggleCommandChannel = (cmdKey, chId) => {
    setSettings(prev => {
      const cur = prev || {};
      const bc = cur.botCommands || {
        loveTest: { command: 'ship', allowedChannels: [], restrictChannels: false },
        xp: { command: 'xp', allowedChannels: [], restrictChannels: false }
      };
      const allowed = Array.isArray(bc[cmdKey]?.allowedChannels) ? [...bc[cmdKey].allowedChannels] : [];
      const idx = allowed.indexOf(chId);
      if (idx > -1) {
        allowed.splice(idx, 1);
      } else {
        allowed.push(chId);
      }
      return {
        ...cur,
        botCommands: {
          ...bc,
          [cmdKey]: {
            ...(bc[cmdKey] || {}),
            allowedChannels: allowed,
            restrictChannels: allowed.length > 0
          }
        }
      };
    });
  };

  const handleSelectAllCommandChannels = (cmdKey, channelIds) => {
    setSettings(prev => {
      const cur = prev || {};
      const bc = cur.botCommands || {
        loveTest: { command: 'ship', allowedChannels: [], restrictChannels: false },
        xp: { command: 'xp', allowedChannels: [], restrictChannels: false }
      };
      return {
        ...cur,
        botCommands: {
          ...bc,
          [cmdKey]: {
            ...(bc[cmdKey] || {}),
            allowedChannels: channelIds,
            restrictChannels: true
          }
        }
      };
    });
  };

  const handleClearCommandChannels = (cmdKey) => {
    setSettings(prev => {
      const cur = prev || {};
      const bc = cur.botCommands || {
        loveTest: { command: 'ship', allowedChannels: [], restrictChannels: false },
        xp: { command: 'xp', allowedChannels: [], restrictChannels: false }
      };
      return {
        ...cur,
        botCommands: {
          ...bc,
          [cmdKey]: {
            ...(bc[cmdKey] || {}),
            allowedChannels: [],
            restrictChannels: false
          }
        }
      };
    });
  };

  const handleToggleChatXpChannel = (channelId) => {
    setSettings(prev => {
      const currentAllowed = Array.isArray(prev?.leveling?.allowedTextChannels)
        ? [...prev.leveling.allowedTextChannels]
        : [];
      const index = currentAllowed.indexOf(channelId);
      if (index >= 0) {
        currentAllowed.splice(index, 1);
      } else {
        currentAllowed.push(channelId);
      }
      return {
        ...prev,
        leveling: {
          ...(prev?.leveling || {}),
          allowedTextChannels: currentAllowed
        }
      };
    });
  };

  const handleSelectAllChatXpChannels = (channelIds) => {
    setSettings(prev => ({
      ...prev,
      leveling: {
        ...(prev?.leveling || {}),
        allowedTextChannels: [...channelIds]
      }
    }));
  };

  const handleClearChatXpChannels = () => {
    setSettings(prev => ({
      ...prev,
      leveling: {
        ...(prev?.leveling || {}),
        allowedTextChannels: []
      }
    }));
  };

  const handleToggleVoiceXpChannel = (channelId) => {
    setSettings(prev => {
      const currentAllowed = Array.isArray(prev?.leveling?.allowedVoiceChannels)
        ? [...prev.leveling.allowedVoiceChannels]
        : [];
      const index = currentAllowed.indexOf(channelId);
      if (index >= 0) {
        currentAllowed.splice(index, 1);
      } else {
        currentAllowed.push(channelId);
      }
      return {
        ...prev,
        leveling: {
          ...(prev?.leveling || {}),
          allowedVoiceChannels: currentAllowed
        }
      };
    });
  };

  const handleSelectAllVoiceXpChannels = (channelIds) => {
    setSettings(prev => ({
      ...prev,
      leveling: {
        ...(prev?.leveling || {}),
        allowedVoiceChannels: [...channelIds]
      }
    }));
  };

  const handleClearVoiceXpChannels = () => {
    setSettings(prev => ({
      ...prev,
      leveling: {
        ...(prev?.leveling || {}),
        allowedVoiceChannels: []
      }
    }));
  };

  const handleUpdateMemberXpSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!levelEditMember || !levelEditMember.userId) {
      alert('Please enter a target User ID.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);
    try {
      const res = await api.updateUserXp(guildId, levelEditMember.userId, {
        action: levelEditXpAction,
        amount: levelEditXpAmount
      });
      setSuccessMsg(res.message || 'User XP updated successfully!');
      const targetId = levelEditMember.userId;
      setLevelEditMember(null);
      fetchLevelData();
      if (selectedMemberDetails && selectedMemberDetails.userId === targetId) {
        api.getMemberLevelDetails(guildId, targetId).then(d => {
          if (d) setSelectedMemberDetails(d);
        }).catch(() => { });
      }
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to update member XP.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetSingleMemberXp = async (userId) => {
    if (!window.confirm('Are you sure you want to reset XP and level data for this user? This will also automatically remove all of their level roles in Discord.')) return;
    try {
      const res = await api.resetUserXp(guildId, userId);
      setSuccessMsg(res.message || 'User XP and level data reset successfully, and all level roles removed.');
      if (selectedMemberDetails && selectedMemberDetails.userId === userId) {
        setShowMemberDetailsModal(false);
      }
      fetchLevelData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to reset user XP.');
    }
  };

  const handleResetServerLeaderboard = async () => {
    if (!window.confirm('⚠️ CRITICAL WARNING: Are you sure you want to reset the entire XP leaderboard for this server? All member XP and levels will be deleted, and all level roles will be removed from members in Discord.')) return;
    try {
      const res = await api.resetAllXp(guildId);
      setSuccessMsg(res.message || 'Server XP leaderboard reset successfully, and all level roles removed.');
      fetchLevelData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to reset server leaderboard.');
    }
  };

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

  const hasGuildChanges = !!(data && (serverName !== data.name || iconFile !== null || bannerFile !== null));
  const hasUnsavedChanges = hasGuildChanges;

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
    const socketUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:2010'
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
        <style dangerouslySetInnerHTML={{
          __html: `
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
          onClick={() => handleSubTabClick('levels')}
          style={{
            background: 'none',
            border: 'none',
            color: activeSubTab === 'levels' ? '#ffffff' : 'var(--text-secondary)',
            fontSize: '0.95rem',
            fontWeight: activeSubTab === 'levels' ? '700' : '400',
            cursor: 'pointer',
            padding: '10px 16px',
            borderBottom: activeSubTab === 'levels' ? '2px solid var(--primary)' : '2px solid transparent',
            transition: 'all 0.2s ease',
            fontFamily: 'Outfit',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Award size={16} color="#eab308" />
          XP & Member Levels
        </button>
        <button
          type="button"
          onClick={() => handleSubTabClick('custom-vc')}
          style={{
            background: 'none',
            border: 'none',
            color: activeSubTab === 'custom-vc' ? '#ffffff' : 'var(--text-secondary)',
            fontSize: '0.95rem',
            fontWeight: activeSubTab === 'custom-vc' ? '700' : '400',
            cursor: 'pointer',
            padding: '10px 16px',
            borderBottom: activeSubTab === 'custom-vc' ? '2px solid var(--primary)' : '2px solid transparent',
            transition: 'all 0.2s ease',
            fontFamily: 'Outfit',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Volume2 size={16} color="#818cf8" />
          Custom VC
        </button>
        <button
          type="button"
          onClick={() => handleSubTabClick('commands')}
          style={{
            background: 'none',
            border: 'none',
            color: activeSubTab === 'commands' ? '#ffffff' : 'var(--text-secondary)',
            fontSize: '0.95rem',
            fontWeight: activeSubTab === 'commands' ? '700' : '400',
            cursor: 'pointer',
            padding: '10px 16px',
            borderBottom: activeSubTab === 'commands' ? '2px solid #ec4899' : '2px solid transparent',
            transition: 'all 0.2s ease',
            fontFamily: 'Outfit',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Terminal size={16} color="#ec4899" />
          Bot Commands & Channels
        </button>
        <button
          type="button"
          onClick={() => handleSubTabClick('server-control')}
          style={{
            background: 'none',
            border: 'none',
            color: activeSubTab === 'server-control' ? '#ffffff' : 'var(--text-secondary)',
            fontSize: '0.95rem',
            fontWeight: activeSubTab === 'server-control' ? '700' : '400',
            cursor: 'pointer',
            padding: '10px 16px',
            borderBottom: activeSubTab === 'server-control' ? '2px solid #ef4444' : '2px solid transparent',
            transition: 'all 0.2s ease',
            fontFamily: 'Outfit',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <ShieldAlert size={16} color="#ef4444" />
          Server Control
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
                    Keep Original (e.g. {nicknameSource === 'username' ? 'smooth' : 'Smooth'})
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
                    UPPERCASE (e.g. SMOOTH)
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
                    lowercase (e.g. smooth)
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

      {/* TAB 3: XP & MEMBER LEVELS */}
      {activeSubTab === 'levels' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Top Info Banner & Stats Row */}
          <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'rgba(234, 179, 8, 0.04)', borderColor: 'rgba(234, 179, 8, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Award size={24} color="#eab308" />
                  Server XP, Levels & Automatic Role Rewards
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: '4px 0 0 0', lineHeight: '1.5' }}>
                  Members gain XP by chatting in channels and staying active in voice channels. When members reach an XP level target, the role selected for that level in the admin panel is automatically granted!
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleAutoGenerateLevelRoles}
                  disabled={saving}
                  className="btn-primary"
                  style={{
                    backgroundColor: '#eab308',
                    borderColor: '#ca8a04',
                    color: '#0f172a',
                    fontWeight: '800',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(234, 179, 8, 0.3)',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  {saving ? <Loader size={16} className="spin" /> : <Zap size={16} />}
                  <span>✨ Auto-Generate Roles</span>
                </button>

                <button
                  type="button"
                  onClick={handleAuditSyncLevels}
                  disabled={saving}
                  className="btn-secondary"
                  style={{
                    padding: '10px 18px',
                    borderRadius: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    fontSize: '0.85rem',
                    color: '#38bdf8',
                    borderColor: 'rgba(56, 189, 248, 0.3)'
                  }}
                  title="Recalculate all member levels and remove any unearned roles"
                >
                  {saving ? <Loader size={16} className="spin" /> : <Activity size={16} />}
                  <span>🔄 Recalculate & Sync All Levels</span>
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginTop: '16px' }}>
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(234, 179, 8, 0.25)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '700' }}>TOTAL SERVER XP</div>
                <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#eab308', marginTop: '2px' }}>
                  {levelStats ? (levelStats.totalXp || 0).toLocaleString() : '0'} XP
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                  Across all server members
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '700' }}>CHAT XP & MESSAGES</div>
                <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#38bdf8', marginTop: '2px' }}>
                  {levelStats ? (levelStats.totalChatXp || 0).toLocaleString() : '0'} XP
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                  {levelStats ? (levelStats.totalMessages || 0).toLocaleString() : 0} text messages
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.25)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '700' }}>VOICE XP LOGGED</div>
                <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#c084fc', marginTop: '2px' }}>
                  {levelStats ? (levelStats.totalVoiceXp || 0).toLocaleString() : '0'} XP
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                  Earned in voice channels
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(52, 211, 153, 0.25)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '700' }}>TOTAL VOICE TIME</div>
                <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#34d399', marginTop: '2px' }}>
                  {levelStats ? (levelStats.totalVoiceMinutes || 0).toLocaleString() : 0} mins
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                  {levelStats ? levelStats.totalVoiceHours || 0 : 0} total hours recorded
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(34, 197, 94, 0.35)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e' }}></span>
                  IN VOICE NOW
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#4ade80', marginTop: '2px' }}>
                  {levelStats ? levelStats.activeVoiceMembersCount || 0 : 0} Active
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                  Live in voice channels
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '700' }}>CONFIGURED ROLES</div>
                <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#f8fafc', marginTop: '2px' }}>
                  {settings?.leveling?.levelRoles ? settings.leveling.levelRoles.length : 0} Roles
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                  {levelStats ? levelStats.trackedMembers || 0 : 0} tracked members
                </div>
              </div>
            </div>
          </div>

          {/* Level XP Target Table & Auto-Role Configuration (Full Width Panel) */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Award size={22} color="#eab308" />
                  Level XP Requirements & Role Rewards Directory
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                  Configure as many server levels as you want! Set exact required XP, role names, colors, and link Discord roles.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateLevelModal(true)}
                  className="btn-primary"
                  style={{
                    backgroundColor: '#3b82f6',
                    borderColor: '#2563eb',
                    color: '#ffffff',
                    fontWeight: '700',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.85rem'
                  }}
                >
                  <Plus size={16} /> Create Custom Level
                </button>

                <button
                  type="button"
                  onClick={handleAddNewLevelRow}
                  className="btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)' }}
                >
                  <Plus size={14} /> Quick Add Row
                </button>

                <button
                  type="button"
                  onClick={handleResetDefaultLevels}
                  className="btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '0.82rem', opacity: 0.8 }}
                  title="Reset to standard defaults"
                >
                  Reset Defaults
                </button>
              </div>
            </div>

            {/* Level Configuration Table */}
            <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)', backgroundColor: 'rgba(15, 23, 42, 0.3)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.03)', color: '#94a3b8', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '12px 14px', width: '100px', textAlign: 'center' }}>Level #</th>
                    <th style={{ padding: '12px 14px', width: '160px' }}>Required XP</th>
                    <th style={{ padding: '12px 14px' }}>Level Role Name</th>
                    <th style={{ padding: '12px 14px', width: '90px' }}>Role Color</th>
                    <th style={{ padding: '12px 14px', width: '240px' }}>Linked Discord Role</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center', width: '60px' }}>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {((settings?.leveling?.levelRoles && settings.leveling.levelRoles.length > 0)
                    ? settings.leveling.levelRoles
                    : DEFAULT_LEVEL_CONFIGS
                  ).map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background 0.2s' }} className="member-row">
                      {/* Level Number */}
                      <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                        <input
                          type="number"
                          min="1"
                          value={item.level}
                          onChange={(e) => handleUpdateLevelRole(idx, 'level', e.target.value)}
                          className="glass-input"
                          style={{ width: '75px', padding: '6px 8px', fontWeight: '800', textAlign: 'center', backgroundColor: 'rgba(234, 179, 8, 0.1)', color: '#eab308', borderColor: 'rgba(234, 179, 8, 0.3)' }}
                        />
                      </td>

                      {/* Required XP */}
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input
                            type="number"
                            min="0"
                            value={item.xpRequired !== undefined ? item.xpRequired : 100}
                            onChange={(e) => handleUpdateLevelRole(idx, 'xpRequired', e.target.value)}
                            className="glass-input"
                            style={{ width: '130px', padding: '6px 10px', fontFamily: 'monospace', color: '#eab308', fontWeight: '700' }}
                          />
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700' }}>XP</span>
                        </div>
                      </td>

                      {/* Role Name */}
                      <td style={{ padding: '10px 14px' }}>
                        <input
                          type="text"
                          value={item.roleName || `Level ${item.level}`}
                          onChange={(e) => handleUpdateLevelRole(idx, 'roleName', e.target.value)}
                          className="glass-input"
                          style={{ width: '100%', padding: '6px 10px', fontWeight: '600' }}
                          placeholder={`Level ${item.level}`}
                        />
                      </td>

                      {/* Color Picker */}
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="color"
                            value={item.roleColor && item.roleColor.startsWith('#') ? item.roleColor : '#3b82f6'}
                            onChange={(e) => handleUpdateLevelRole(idx, 'roleColor', e.target.value)}
                            style={{ width: '34px', height: '34px', padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'none' }}
                          />
                        </div>
                      </td>

                      {/* Discord Role Link */}
                      <td style={{ padding: '10px 14px' }}>
                        <select
                          value={item.roleId || ''}
                          onChange={(e) => handleUpdateLevelRole(idx, 'roleId', e.target.value)}
                          className="glass-input"
                          style={{ width: '100%', padding: '6px 10px', fontSize: '0.82rem' }}
                        >
                          <option value="">-- None (No Role Assigned) --</option>
                          {serverRoles.map(r => (
                            <option key={r.id} value={r.id} style={{ color: r.color }}>
                              @{r.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Remove Action */}
                      <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleRemoveLevelRoleReward(idx)}
                          style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
                          title="Remove Level"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={handleSaveLevelingSettings}
                disabled={saving}
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '12px 24px', fontSize: '0.95rem' }}
              >
                <Save size={18} />
                {saving ? 'Saving Configuration...' : 'Save Level XP Configuration'}
              </button>
            </div>
          </div>

          {/* Level Role Automation & Upgrades Panel */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={22} color="#10b981" />
                  Level-Up Role Rewards & Announcement Automation
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                  Configure automatic role promotion, role replacement on level-up, and chat celebration messages.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Toggle: Remove Older Level Roles */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderRadius: '12px',
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                gap: '20px',
                flexWrap: 'wrap'
              }}>
                <div style={{ flex: '1 1 300px' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.98rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>Automatically Remove Older Level Roles</span>
                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: '800', letterSpacing: '0.5px' }}>
                      RECOMMENDED
                    </span>
                  </div>
                  <p style={{ margin: '6px 0 0 0', fontSize: '0.84rem', color: '#94a3b8', lineHeight: '1.5' }}>
                    When members gain XP and level up, the bot automatically removes their previous/older level roles and grants the new level role (e.g., reaching Level 2 removes Level 1 and gives Level 2). When turned off, level roles stack.
                  </p>
                </div>

                <label style={{ position: 'relative', display: 'inline-block', width: '52px', height: '28px', flexShrink: 0, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settings?.leveling?.removePreviousRoles !== false}
                    onChange={() => handleToggle('leveling.removePreviousRoles')}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: settings?.leveling?.removePreviousRoles !== false ? '#10b981' : '#334155',
                    transition: '.3s', borderRadius: '34px',
                    boxShadow: settings?.leveling?.removePreviousRoles !== false ? '0 0 12px rgba(16, 185, 129, 0.4)' : 'none'
                  }}>
                    <span style={{
                      position: 'absolute', content: '""', height: '20px', width: '20px',
                      left: settings?.leveling?.removePreviousRoles !== false ? '26px' : '4px',
                      bottom: '4px', backgroundColor: '#ffffff', transition: '.3s', borderRadius: '50%'
                    }} />
                  </span>
                </label>
              </div>

              {/* Toggle & Config: Level-Up Announcements */}
              <div style={{
                padding: '18px 20px',
                borderRadius: '12px',
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.98rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MessageSquare size={18} color="#38bdf8" />
                      <span>Send Level-Up Announcement in Chat</span>
                    </div>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                      Congratulate members when they earn enough XP to advance to a higher level.
                    </p>
                  </div>

                  <label style={{ position: 'relative', display: 'inline-block', width: '52px', height: '28px', flexShrink: 0, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings?.leveling?.notifyLevelUp !== false}
                      onChange={() => handleToggle('leveling.notifyLevelUp')}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      backgroundColor: settings?.leveling?.notifyLevelUp !== false ? '#38bdf8' : '#334155',
                      transition: '.3s', borderRadius: '34px',
                      boxShadow: settings?.leveling?.notifyLevelUp !== false ? '0 0 12px rgba(56, 189, 248, 0.4)' : 'none'
                    }}>
                      <span style={{
                        position: 'absolute', content: '""', height: '20px', width: '20px',
                        left: settings?.leveling?.notifyLevelUp !== false ? '26px' : '4px',
                        bottom: '4px', backgroundColor: '#ffffff', transition: '.3s', borderRadius: '50%'
                      }} />
                    </span>
                  </label>
                </div>

                {settings?.leveling?.notifyLevelUp !== false && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '600' }}>
                          Announcement Channel
                        </label>
                        <select
                          value={settings?.leveling?.levelUpChannelId || ''}
                          onChange={(e) => handleInputChange('leveling.levelUpChannelId', e.target.value)}
                          className="glass-input"
                          style={{ width: '100%', padding: '10px 14px', fontSize: '0.88rem' }}
                        >
                          <option value="">Active Channel (where member chatted)</option>
                          {(data?.channels?.filter(c => c.type === 0 || c.type === 5) || []).map(ch => (
                            <option key={ch.id} value={ch.id}>#{ch.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '600' }}>
                          Celebration Message Template <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>({'{user}'}, {'{username}'}, {'{level}'}, {'{xp}'})</span>
                        </label>
                        <input
                          type="text"
                          value={settings?.leveling?.levelUpMessage || 'Awesome job, {user}! You just leveled up.'}
                          onChange={(e) => handleInputChange('leveling.levelUpMessage', e.target.value)}
                          className="glass-input"
                          style={{ width: '100%', padding: '10px 14px', fontSize: '0.88rem' }}
                          placeholder="Awesome job, {user}! You just leveled up."
                        />
                      </div>
                    </div>

                    {/* Discord Mock Achievement Embed Preview */}
                    <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Sparkles size={14} color="#f59e0b" /> Discord Announcement Preview
                        </span>
                        <button
                          type="button"
                          onClick={handleTestAnnouncement}
                          disabled={testingAnnouncement}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '7px 16px',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: '#ffffff',
                            border: 'none',
                            fontSize: '0.82rem',
                            fontWeight: '700',
                            cursor: testingAnnouncement ? 'not-allowed' : 'pointer',
                            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {testingAnnouncement ? <Loader size={14} className="spin" /> : <Send size={14} />}
                          Send Test to Discord
                        </button>
                      </div>

                      {/* Discord Mock Embed Card */}
                      <div
                        style={{
                          backgroundColor: '#2b2d31',
                          borderRadius: '8px',
                          padding: '16px 20px',
                          maxWidth: '520px',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
                          fontFamily: 'gg sans, "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                          <div style={{ flex: 1 }}>
                            {/* Title */}
                            <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px', lineHeight: 1.2 }}>
                              <span style={{ fontSize: '1.2rem' }}>🌟</span> Achievement Unlocked!
                            </div>

                            {/* Message */}
                            <div style={{ fontSize: '0.9rem', color: '#dbdee1', marginTop: '8px', lineHeight: 1.4 }}>
                              {settings?.leveling?.levelUpMessage && settings.leveling.levelUpMessage !== '🎉 Congratulations {user}, you leveled up to **Level {level}**! 🚀'
                                ? settings.leveling.levelUpMessage
                                  .replace(/{user}/gi, '@SMOOTH')
                                  .replace(/{username}/gi, 'SMOOTH')
                                  .replace(/{level}/gi, '5')
                                  .replace(/{xp}/gi, '2,500')
                                : (
                                  <>
                                    Awesome job, <span style={{ backgroundColor: 'rgba(88, 101, 242, 0.3)', color: '#c9cdfb', padding: '1px 5px', borderRadius: '4px', fontWeight: '600' }}>@SMOOTH</span>! You just leveled up.
                                  </>
                                )}
                            </div>

                            {/* Level blockquote */}
                            <div
                              style={{
                                borderLeft: '4px solid #4e5058',
                                paddingLeft: '10px',
                                marginTop: '6px',
                                fontSize: '0.9rem',
                                fontWeight: '700',
                                color: '#dbdee1',
                                borderRadius: '2px'
                              }}
                            >
                              Level 4 ➔ Level 5
                            </div>
                          </div>

                          {/* Member Avatar Thumbnail */}
                          <div
                            style={{
                              width: '56px',
                              height: '56px',
                              borderRadius: '8px',
                              backgroundColor: '#1e1f22',
                              overflow: 'hidden',
                              flexShrink: 0,
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <img
                              src={data?.icon ? `https://cdn.discordapp.com/icons/${guildId}/${data.icon}.png` : 'https://cdn.discordapp.com/embed/avatars/0.png'}
                              alt="Avatar"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => { e.target.src = 'https://cdn.discordapp.com/embed/avatars/0.png'; }}
                            />
                          </div>
                        </div>

                        {/* Divider Line */}
                        <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)', margin: '14px 0 10px 0' }} />

                        {/* Tip Line */}
                        <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontStyle: 'normal' }}>•</span> Tip: Keep chatting to unlock new roles and perks!
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleSaveLevelingSettings}
                disabled={saving}
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px' }}
              >
                <Save size={16} /> Save Automation Settings
              </button>
            </div>
          </div>

          {/* Voice & Chat XP Gain Rates Panel (Full Width Grid) */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={20} color="#38bdf8" />
                Voice & Chat XP Gain Rates & Cooldowns
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '600' }}>
                  XP Per Text Message (Chat Channels)
                </label>
                <input
                  type="number"
                  min="1"
                  value={settings?.leveling?.xpPerMessage || 15}
                  onChange={(e) => handleInputChange('leveling.xpPerMessage', parseInt(e.target.value) || 15)}
                  className="glass-input"
                  style={{ width: '100%', padding: '10px 14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '600' }}>
                  Text Message Cooldown (Seconds)
                </label>
                <input
                  type="number"
                  min="1"
                  value={settings?.leveling?.textCooldownSeconds || 60}
                  onChange={(e) => handleInputChange('leveling.textCooldownSeconds', parseInt(e.target.value) || 60)}
                  className="glass-input"
                  style={{ width: '100%', padding: '10px 14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '600' }}>
                  XP Per Voice Minute (Voice Channels)
                </label>
                <input
                  type="number"
                  min="1"
                  value={settings?.leveling?.xpPerVoiceMinute || 10}
                  onChange={(e) => handleInputChange('leveling.xpPerVoiceMinute', parseInt(e.target.value) || 10)}
                  className="glass-input"
                  style={{ width: '100%', padding: '10px 14px' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleSaveLevelingSettings}
                disabled={saving}
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
              >
                <Save size={16} /> Save XP Rates
              </button>
            </div>
          </div>

          {/* Selected Chat & Voice Channels for XP Panel */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Hash size={22} color="#38bdf8" />
                  <Volume2 size={22} color="#a855f7" />
                  Selected Chat & Voice Channels for XP Gain
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                  Configure which specific chat channels and voice channels award XP to members. When channels are selected, XP will <strong>ONLY</strong> increase in those channels.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveLevelingSettings}
                disabled={saving}
                className="btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  backgroundColor: '#3b82f6',
                  borderColor: '#2563eb',
                  fontWeight: '700',
                  borderRadius: '10px'
                }}
              >
                {saving ? <Loader size={16} className="spin" /> : <Save size={16} />}
                <span>Save Channel XP Settings</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
              {/* CHAT / TEXT CHANNELS */}
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', padding: '18px 20px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Hash size={16} color="#38bdf8" />
                      <span>Selected Chat Channels</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                      For message sending XP increase
                    </div>
                  </div>

                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.74rem',
                      fontWeight: '800',
                      backgroundColor: (settings?.leveling?.allowedTextChannels?.length > 0) ? 'rgba(56, 189, 248, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                      color: (settings?.leveling?.allowedTextChannels?.length > 0) ? '#38bdf8' : '#34d399',
                      border: (settings?.leveling?.allowedTextChannels?.length > 0) ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)'
                    }}
                  >
                    {(settings?.leveling?.allowedTextChannels?.length > 0)
                      ? `RESTRICTED (${settings.leveling.allowedTextChannels.length} CHANNELS)`
                      : 'ALL CHANNELS ACTIVE'}
                  </span>
                </div>

                <p style={{ margin: '0 0 14px 0', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                  {(settings?.leveling?.allowedTextChannels?.length > 0)
                    ? '✨ Member messages only earn XP in the selected chat channels below. Messages sent in other channels will give 0 XP.'
                    : '🌐 No channels selected — sending messages in any text channel currently awards XP. Click channels below to restrict.'}
                </p>

                {/* Filter and Quick Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Filter chat channels..."
                    value={chatXpChannelSearch}
                    onChange={(e) => setChatXpChannelSearch(e.target.value)}
                    className="glass-input"
                    style={{ padding: '6px 12px', fontSize: '0.82rem', flex: '1 1 180px' }}
                  />

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => handleSelectAllChatXpChannels(((data?.channels || []).filter(c => c.type === 0 || c.type === 5)).map(c => c.id))}
                      className="btn-secondary"
                      style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={handleClearChatXpChannels}
                      className="btn-secondary"
                      style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Badges List */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '200px', overflowY: 'auto', padding: '4px' }}>
                  {(() => {
                    const textChans = ((data?.channels || []).filter(c => c.type === 0 || c.type === 5))
                      .filter(c => c.name.toLowerCase().includes(chatXpChannelSearch.toLowerCase()));
                    if (textChans.length === 0) {
                      return (
                        <div style={{ color: '#64748b', fontSize: '0.8rem', padding: '12px 0', width: '100%', textAlign: 'center' }}>
                          No text channels found matching search.
                        </div>
                      );
                    }
                    return textChans.map(ch => {
                      const isAllowed = (settings?.leveling?.allowedTextChannels || []).includes(ch.id);
                      return (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => handleToggleChatXpChannel(ch.id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            borderRadius: '10px',
                            backgroundColor: isAllowed ? 'rgba(56, 189, 248, 0.2)' : 'rgba(15, 23, 42, 0.7)',
                            border: isAllowed ? '1.5px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                            color: isAllowed ? '#ffffff' : '#94a3b8',
                            fontSize: '0.82rem',
                            fontWeight: isAllowed ? '700' : '500',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Hash size={13} color={isAllowed ? '#38bdf8' : '#64748b'} />
                          <span>{ch.name}</span>
                          {isAllowed && <Check size={13} color="#38bdf8" />}
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* VOICE CHANNELS */}
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', padding: '18px 20px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Volume2 size={16} color="#a855f7" />
                      <span>Selected Voice Channels</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                      For voice channel activity XP increase
                    </div>
                  </div>

                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.74rem',
                      fontWeight: '800',
                      backgroundColor: (settings?.leveling?.allowedVoiceChannels?.length > 0) ? 'rgba(168, 85, 247, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                      color: (settings?.leveling?.allowedVoiceChannels?.length > 0) ? '#c084fc' : '#34d399',
                      border: (settings?.leveling?.allowedVoiceChannels?.length > 0) ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)'
                    }}
                  >
                    {(settings?.leveling?.allowedVoiceChannels?.length > 0)
                      ? `RESTRICTED (${settings.leveling.allowedVoiceChannels.length} CHANNELS)`
                      : 'ALL VOICE CHANNELS ACTIVE'}
                  </span>
                </div>

                <p style={{ margin: '0 0 14px 0', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                  {(settings?.leveling?.allowedVoiceChannels?.length > 0)
                    ? '✨ Member voice time only earns XP when joined in the selected voice channels below. Other voice channels will give 0 XP.'
                    : '🌐 No voice channels selected — joining and talking in any voice channel currently awards voice XP. Click channels below to restrict.'}
                </p>

                {/* Filter and Quick Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Filter voice channels..."
                    value={voiceXpChannelSearch}
                    onChange={(e) => setVoiceXpChannelSearch(e.target.value)}
                    className="glass-input"
                    style={{ padding: '6px 12px', fontSize: '0.82rem', flex: '1 1 180px' }}
                  />

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => handleSelectAllVoiceXpChannels(((data?.channels || []).filter(c => c.type === 2 || c.type === 13)).map(c => c.id))}
                      className="btn-secondary"
                      style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={handleClearVoiceXpChannels}
                      className="btn-secondary"
                      style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Badges List */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '200px', overflowY: 'auto', padding: '4px' }}>
                  {(() => {
                    const voiceChans = ((data?.channels || []).filter(c => c.type === 2 || c.type === 13))
                      .filter(c => c.name.toLowerCase().includes(voiceXpChannelSearch.toLowerCase()));
                    if (voiceChans.length === 0) {
                      return (
                        <div style={{ color: '#64748b', fontSize: '0.8rem', padding: '12px 0', width: '100%', textAlign: 'center' }}>
                          No voice channels found matching search.
                        </div>
                      );
                    }
                    return voiceChans.map(vc => {
                      const isAllowed = (settings?.leveling?.allowedVoiceChannels || []).includes(vc.id);
                      return (
                        <button
                          key={vc.id}
                          type="button"
                          onClick={() => handleToggleVoiceXpChannel(vc.id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            borderRadius: '10px',
                            backgroundColor: isAllowed ? 'rgba(168, 85, 247, 0.2)' : 'rgba(15, 23, 42, 0.7)',
                            border: isAllowed ? '1.5px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.08)',
                            color: isAllowed ? '#ffffff' : '#94a3b8',
                            fontSize: '0.82rem',
                            fontWeight: isAllowed ? '700' : '500',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Volume2 size={13} color={isAllowed ? '#c084fc' : '#64748b'} />
                          <span>{vc.name}</span>
                          {isAllowed && <Check size={13} color="#c084fc" />}
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Member Leaderboard & Full XP Controls */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={22} color="#eab308" /> Member XP Leaderboard & Level Directory
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                  Full ranking of active server members, level progress, and XP editor tools.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {/* Search Bar */}
                <input
                  type="text"
                  placeholder="Search member username..."
                  value={levelSearchQuery}
                  onChange={(e) => setLevelSearchQuery(e.target.value)}
                  className="glass-input"
                  style={{ padding: '8px 14px', fontSize: '0.85rem', width: '220px' }}
                />

                <button
                  type="button"
                  onClick={handleResetServerLeaderboard}
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    color: '#f87171',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Trash2 size={14} /> Reset Leaderboard
                </button>
              </div>
            </div>

            {loadingLevelData ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                <Loader size={28} className="spin" style={{ margin: '0 auto 10px auto' }} />
                <div>Loading server member XP records...</div>
              </div>
            ) : levelMembers.length === 0 ? (
              <div style={{ padding: '36px', textAlign: 'center', color: '#94a3b8', border: '1px dashed #334155', borderRadius: '12px' }}>
                No active member XP records found yet. XP will accumulate as members chat and join voice channels!
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '760px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 14px' }}>Rank</th>
                      <th style={{ padding: '12px 14px' }}>Member</th>
                      <th style={{ padding: '12px 14px' }}>Level</th>
                      <th style={{ padding: '12px 14px' }}>XP Breakdown</th>
                      <th style={{ padding: '12px 14px' }}>Next Level Target</th>
                      <th style={{ padding: '12px 14px' }}>Messages</th>
                      <th style={{ padding: '12px 14px' }}>Voice Time</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {levelMembers.map((m) => (
                      <tr key={m.userId} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                        <td style={{ padding: '12px 14px', fontWeight: '800', color: m.rank === 1 ? '#eab308' : m.rank === 2 ? '#cbd5e1' : m.rank === 3 ? '#b45309' : '#94a3b8' }}>
                          #{m.rank}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img
                              src={m.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                              alt=""
                              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontWeight: '700', color: '#ffffff', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                <span>{m.username}</span>
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: {m.userId}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '12px',
                            backgroundColor: 'rgba(234, 179, 8, 0.15)',
                            color: '#eab308',
                            border: '1px solid rgba(234, 179, 8, 0.3)',
                            fontWeight: '800',
                            fontSize: '0.8rem'
                          }}>
                            Level {m.level}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: '800', fontFamily: 'monospace', color: '#ffffff', fontSize: '0.9rem' }}>
                            {(m.xp || 0).toLocaleString()} XP
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', fontSize: '0.72rem' }}>
                            <span style={{ color: '#38bdf8', fontWeight: '600' }}>💬 {(m.chatXp || 0).toLocaleString()}</span>
                            <span style={{ color: '#64748b' }}>•</span>
                            <span style={{ color: '#c084fc', fontWeight: '600' }}>🎙️ {(m.voiceXp || 0).toLocaleString()}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px', width: '160px' }}>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Progress</span>
                            <span>{m.progressPercent || 0}%</span>
                          </div>
                          <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${m.progressPercent || 0}%`, height: '100%', backgroundColor: '#eab308', borderRadius: '3px' }} />
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                          {m.messagesCount || 0} msgs
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: '0.85rem', color: '#cbd5e1', fontWeight: '700' }}>
                          {m.voiceMinutes !== undefined ? m.voiceMinutes : Math.floor((m.voiceTimeSeconds || 0) / 60)} mins
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenMemberDetails(m)}
                              className="btn-secondary"
                              style={{ padding: '4px 8px', fontSize: '0.78rem', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.4)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              title="View Full XP & Voice Activity Dossier"
                            >
                              <Eye size={13} /> Details
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setLevelEditMember(m);
                                setLevelEditXpAction('add');
                                setLevelEditXpAmount('100');
                              }}
                              className="btn-secondary"
                              style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                            >
                              Edit XP
                            </button>
                            <button
                              type="button"
                              onClick={() => handleResetSingleMemberXp(m.userId)}
                              style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}
                              title="Reset XP, Level & Roles"
                            >
                              <Trash2 size={14} />
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
                  <option value="10080">1 Week (7 Days)</option>
                  <option value="20160">2 Weeks (14 Days)</option>
                  <option value="30240">3 Weeks (21 Days)</option>
                  <option value="40320">4 Weeks (28 Days - Max)</option>
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

      {/* Member XP & Level Edit Modal */}
      {levelEditMember && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '24px', borderRadius: '16px', background: '#181824', border: '1px solid var(--border-color)', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} color="#eab308" /> Manage Member XP & Level
              </h3>
              <X size={20} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setLevelEditMember(null)} />
            </div>

            {levelEditMember.username ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.04)', marginBottom: '16px' }}>
                <img src={levelEditMember.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                <div>
                  <div style={{ fontWeight: '700', color: '#fff' }}>{levelEditMember.username}</div>
                  <div style={{ fontSize: '0.78rem', color: '#eab308' }}>Level {levelEditMember.level} • {(levelEditMember.xp || 0).toLocaleString()} XP</div>
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '8px' }}>Target Discord User ID</label>
                <input
                  type="text"
                  placeholder="Enter User ID (e.g. 123456789012345678)"
                  value={levelEditMember.userId || ''}
                  onChange={(e) => setLevelEditMember({ ...levelEditMember, userId: e.target.value })}
                  className="glass-input"
                  style={{ width: '100%' }}
                  required
                />
              </div>
            )}

            <form onSubmit={handleUpdateMemberXpSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '8px' }}>Action</label>
                <select
                  value={levelEditXpAction}
                  onChange={(e) => setLevelEditXpAction(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%' }}
                >
                  <option value="add">Add Total XP (+)</option>
                  <option value="remove">Remove Total XP (-)</option>
                  <option value="set">Set Exact Total XP (=)</option>
                  <option value="setLevel">Set Level Directly (Lv. X)</option>
                  <option value="addVoiceMinutes">Add Voice Time (+ Minutes)</option>
                  <option value="setVoiceMinutes">Set Exact Voice Time (= Minutes)</option>
                  <option value="addVoiceXp">Add Voice XP (+)</option>
                  <option value="addChatXp">Add Chat XP (+)</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '8px' }}>
                  {levelEditXpAction === 'setLevel'
                    ? 'Target Level Number'
                    : (levelEditXpAction === 'addVoiceMinutes' || levelEditXpAction === 'setVoiceMinutes')
                      ? 'Minutes Amount'
                      : 'XP Amount'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={levelEditXpAmount}
                  onChange={(e) => setLevelEditXpAmount(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%' }}
                  placeholder={
                    levelEditXpAction === 'setLevel'
                      ? 'e.g. 5'
                      : (levelEditXpAction === 'addVoiceMinutes' || levelEditXpAction === 'setVoiceMinutes')
                        ? 'e.g. 30 (minutes)'
                        : 'e.g. 100 (XP)'
                  }
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setLevelEditMember(null)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>Update Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Member XP & Voice Channel Breakdown Dossier Modal */}
      {showMemberDetailsModal && selectedMemberDetails && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div className="glass-panel animate-slide-up" style={{
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            borderRadius: '18px',
            background: '#151522',
            border: '1px solid var(--border-color)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.85)'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={selectedMemberDetails.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                    alt=""
                    style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.15)' }}
                  />
                  {selectedMemberDetails.isCurrentlyInVoice && (
                    <span style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      backgroundColor: '#22c55e',
                      border: '2px solid #151522',
                      boxShadow: '0 0 10px #22c55e'
                    }} title="Connected to Voice Channel" />
                  )}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                      {selectedMemberDetails.username}
                    </h3>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(234, 179, 8, 0.2)',
                      color: '#eab308',
                      border: '1px solid rgba(234, 179, 8, 0.4)',
                      fontWeight: '800',
                      fontSize: '0.75rem'
                    }}>
                      Level {selectedMemberDetails.level}
                    </span>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(148, 163, 184, 0.15)',
                      color: '#94a3b8',
                      fontSize: '0.75rem',
                      fontWeight: '700'
                    }}>
                      Rank #{selectedMemberDetails.rank}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '3px' }}>
                    User ID: {selectedMemberDetails.userId}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowMemberDetailsModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Live Voice Status Indicator Banner */}
            <div style={{
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: selectedMemberDetails.isCurrentlyInVoice ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${selectedMemberDetails.isCurrentlyInVoice ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: selectedMemberDetails.isCurrentlyInVoice ? '#22c55e' : '#64748b',
                  display: 'inline-block',
                  boxShadow: selectedMemberDetails.isCurrentlyInVoice ? '0 0 10px #22c55e' : 'none'
                }}></span>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: selectedMemberDetails.isCurrentlyInVoice ? '#4ade80' : '#cbd5e1' }}>
                    {selectedMemberDetails.isCurrentlyInVoice
                      ? `Active In Voice Channel: #${selectedMemberDetails.currentVoiceChannel?.name || 'Voice'}`
                      : 'Not currently connected to a voice channel'}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                    {selectedMemberDetails.isCurrentlyInVoice
                      ? 'Live voice activity is accumulating XP and recording channel minutes automatically.'
                      : 'Voice minutes and XP will start recording automatically when this member joins a voice channel.'}
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Summary Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '22px' }}>
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(234, 179, 8, 0.2)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '700' }}>TOTAL XP</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#eab308', marginTop: '2px' }}>
                  {(selectedMemberDetails.xp || 0).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                  Rank #{selectedMemberDetails.rank}
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '700' }}>CHAT XP</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#38bdf8', marginTop: '2px' }}>
                  {(selectedMemberDetails.chatXp || 0).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                  {selectedMemberDetails.messagesCount || 0} messages
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '700' }}>VOICE XP</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#c084fc', marginTop: '2px' }}>
                  {(selectedMemberDetails.voiceXp || 0).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                  From voice activity
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '700' }}>TOTAL VOICE TIME</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#34d399', marginTop: '2px' }}>
                  {selectedMemberDetails.voiceMinutes !== undefined ? selectedMemberDetails.voiceMinutes : Math.floor((selectedMemberDetails.voiceTimeSeconds || 0) / 60)} mins
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                  {selectedMemberDetails.voiceHours || ((selectedMemberDetails.voiceTimeSeconds || 0) / 3600).toFixed(1)} hours
                </div>
              </div>
            </div>

            {/* Level Target Progress Bar */}
            <div style={{ padding: '14px 16px', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '0.8rem' }}>
                <span style={{ color: '#cbd5e1', fontWeight: '600' }}>
                  Progress to Level {selectedMemberDetails.level + 1}
                </span>
                <span style={{ color: '#eab308', fontWeight: '700', fontFamily: 'monospace' }}>
                  {(selectedMemberDetails.xp || 0).toLocaleString()} / {(selectedMemberDetails.nextLevelXp || 100).toLocaleString()} XP ({selectedMemberDetails.progressPercent || 0}%)
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${selectedMemberDetails.progressPercent || 0}%`, height: '100%', backgroundColor: '#eab308', borderRadius: '4px' }} />
              </div>
            </div>

            {/* Voice Channels Activity Breakdown ("where how much minute in voice channels") */}
            <div style={{ marginBottom: '22px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Volume2 size={18} color="#34d399" /> Voice Channels Activity Breakdown
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0 0 12px 0' }}>
                Exact record of which voice channels this member joined and how many minutes they spent in each channel.
              </p>

              {loadingMemberDetails ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                  <Loader size={20} className="spin" style={{ margin: '0 auto 6px auto' }} />
                  <div style={{ fontSize: '0.82rem' }}>Loading voice channels activity breakdown...</div>
                </div>
              ) : (!selectedMemberDetails.voiceChannels || selectedMemberDetails.voiceChannels.length === 0) ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', border: '1px dashed #334155', borderRadius: '12px', fontSize: '0.82rem' }}>
                  No individual voice channels recorded yet. Voice activity logs as members talk and stay in voice channels!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedMemberDetails.voiceChannels.map((vc, idx) => (
                    <div key={vc.channelId || idx} style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8' }}>#{idx + 1}</span>
                          <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#ffffff' }}>
                            🔊 {vc.channelName}
                          </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#34d399' }}>
                            {vc.minutes} mins
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: '6px' }}>
                            ({vc.percentage}%)
                          </span>
                        </div>
                      </div>
                      <div style={{ width: '100%', height: '5px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${Math.max(2, vc.percentage)}%`,
                          height: '100%',
                          backgroundColor: idx === 0 ? '#34d399' : idx === 1 ? '#38bdf8' : idx === 2 ? '#c084fc' : '#eab308',
                          borderRadius: '3px'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Daily Activity History */}
            {selectedMemberDetails.dailyStats && selectedMemberDetails.dailyStats.length > 0 && (
              <div style={{ marginBottom: '22px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Activity size={18} color="#38bdf8" /> Recent Daily Activity History
                </h4>
                <div style={{ overflowX: 'auto', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                        <th style={{ padding: '8px 12px' }}>Date</th>
                        <th style={{ padding: '8px 12px' }}>Voice Time</th>
                        <th style={{ padding: '8px 12px' }}>Messages</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedMemberDetails.dailyStats.slice(-7).reverse().map((d, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                          <td style={{ padding: '8px 12px', color: '#cbd5e1' }}>{d.date}</td>
                          <td style={{ padding: '8px 12px', color: '#34d399', fontWeight: '600' }}>
                            {Math.floor((d.voiceSeconds || 0) / 60)} mins
                          </td>
                          <td style={{ padding: '8px 12px', color: '#38bdf8' }}>{d.messages || 0} msgs</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Modal Actions Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  setLevelEditMember(selectedMemberDetails);
                  setLevelEditXpAction('addVoiceMinutes');
                  setLevelEditXpAmount('30');
                }}
                className="btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.82rem', color: '#34d399', borderColor: 'rgba(52, 211, 153, 0.4)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={14} /> Add Voice Minutes
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setLevelEditMember(selectedMemberDetails);
                    setLevelEditXpAction('add');
                    setLevelEditXpAmount('100');
                  }}
                  className="btn-primary"
                  style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                >
                  Edit XP & Level
                </button>
                <button
                  type="button"
                  onClick={() => setShowMemberDetailsModal(false)}
                  className="btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Custom Level Modal */}
      {showCreateLevelModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
          <div className="glass-panel animate-slide-up" style={{ width: '100%', maxWidth: '460px', padding: '26px', borderRadius: '16px', background: '#181824', border: '1px solid var(--border-color)', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Plus size={22} color="#38bdf8" /> Create & Add Custom Level
              </h3>
              <X size={20} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowCreateLevelModal(false)} />
            </div>

            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '20px', lineHeight: '1.5' }}>
              Add any custom level threshold to your server! Set the target level number, exact required XP, role name, and role color.
            </p>

            <form onSubmit={handleCreateCustomLevelSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '6px' }}>
                    Level Number <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 6"
                    value={newLevelNumber}
                    onChange={(e) => setNewLevelNumber(e.target.value)}
                    className="glass-input"
                    style={{ width: '100%', padding: '10px 12px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '6px' }}>
                    Required XP <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 3600"
                    value={newLevelXpRequired}
                    onChange={(e) => setNewLevelXpRequired(e.target.value)}
                    className="glass-input"
                    style={{ width: '100%', padding: '10px 12px', fontFamily: 'monospace', color: '#eab308' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '6px' }}>
                  Level Role Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Level 6 Master"
                  value={newLevelRoleName}
                  onChange={(e) => setNewLevelRoleName(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%', padding: '10px 12px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '14px', alignItems: 'center' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '6px' }}>
                    Role Color
                  </label>
                  <input
                    type="color"
                    value={newLevelRoleColor}
                    onChange={(e) => setNewLevelRoleColor(e.target.value)}
                    style={{ width: '100%', height: '40px', padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '6px' }}>
                    Assign Discord Role (Optional)
                  </label>
                  <select
                    value={newLevelRoleId}
                    onChange={(e) => setNewLevelRoleId(e.target.value)}
                    className="glass-input"
                    style={{ width: '100%', padding: '9px 12px', fontSize: '0.82rem' }}
                  >
                    <option value="">-- None (No Role Assigned) --</option>
                    {serverRoles.map(r => (
                      <option key={r.id} value={r.id} style={{ color: r.color }}>
                        @{r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowCreateLevelModal(false)} style={{ padding: '10px 18px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '10px 20px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Plus size={16} /> Create Level
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeSubTab === 'commands' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Top Info Banner */}
          <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'rgba(236, 72, 153, 0.04)', borderColor: 'rgba(236, 72, 153, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Terminal size={24} color="#ec4899" />
                  Bot Commands & Allowed Channels Control Panel
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: '6px 0 0 0', lineHeight: '1.5' }}>
                  Customize the trigger words for the <strong>Love Test (Ship)</strong> and <strong>XP</strong> commands and specify exactly which Discord channels they are allowed to execute in.
                </p>
              </div>

              <div style={{
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '8px 14px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#34d399',
                fontSize: '0.8rem',
                fontWeight: '700'
              }}>
                <Check size={16} />
                <span>All Slash (/) Commands Removed • Clean Chat Only</span>
              </div>
            </div>
          </div>

          {/* 1. LOVE TEST COMMAND CONFIGURATION CARD */}
          <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(236, 72, 153, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Heart size={20} color="#ec4899" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>
                    Love Test / Ship Command Settings
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                    Calculates love compatibility percentage between members and generates a customized graphic card.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleToggleCommandRestriction('loveTest')}
                title="Click to toggle restriction mode"
                style={{
                  padding: '5px 12px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  backgroundColor: (settings?.botCommands?.loveTest?.allowedChannels?.length > 0 || settings?.botCommands?.loveTest?.restrictChannels) ? 'rgba(236, 72, 153, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  color: (settings?.botCommands?.loveTest?.allowedChannels?.length > 0 || settings?.botCommands?.loveTest?.restrictChannels) ? '#f472b6' : '#34d399',
                  border: (settings?.botCommands?.loveTest?.allowedChannels?.length > 0 || settings?.botCommands?.loveTest?.restrictChannels) ? '1px solid rgba(236, 72, 153, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)'
                }}
              >
                {(settings?.botCommands?.loveTest?.allowedChannels?.length > 0 || settings?.botCommands?.loveTest?.restrictChannels)
                  ? `RESTRICTED (${settings?.botCommands?.loveTest?.allowedChannels?.length || 0} Channels)`
                  : 'WORKS IN ALL CHANNELS'}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Command Trigger Input */}
              <div style={{ maxWidth: '450px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', fontWeight: '700', marginBottom: '8px' }}>
                  Love Test Command Trigger Word
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ padding: '10px 14px', backgroundColor: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', borderRadius: '10px', fontWeight: '800', fontSize: '0.9rem', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
                    Exact Trigger
                  </span>
                  <input
                    type="text"
                    value={settings?.botCommands?.loveTest?.command ?? 'ship'}
                    onChange={(e) => handleUpdateCommandTrigger('loveTest', e.target.value)}
                    className="glass-input"
                    placeholder="e.g. ship, ?ship, !love"
                    style={{ flex: 1, padding: '10px 14px', fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}
                  />
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '6px' }}>
                  The bot only responds to this exact command. Members can type <code>{(settings?.botCommands?.loveTest?.command || 'ship').trim()}</code> (matches with a random member), <code>{(settings?.botCommands?.loveTest?.command || 'ship').trim()} @user</code>, or <code>{(settings?.botCommands?.loveTest?.command || 'ship').trim()} @user1 @user2</code> in Discord.
                </div>
              </div>

              {/* Channel Restrictions Switch & Selector */}
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', padding: '18px 20px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#ffffff' }}>
                      Allowed Discord Channels for Love Test
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                      Select which text channels members are allowed to run this command in. If no channels are selected, it is usable server-wide.
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleSelectAllCommandChannels('loveTest', (data?.channels || []).filter(c => c.type === 0 || c.type === 5).map(c => c.id))}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={() => handleClearCommandChannels('loveTest')}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>

                {/* Channel Search Filter */}
                <div style={{ marginBottom: '14px', maxWidth: '300px' }}>
                  <input
                    type="text"
                    placeholder="Filter channels by name..."
                    value={loveChannelSearch}
                    onChange={(e) => setLoveChannelSearch(e.target.value)}
                    className="glass-input"
                    style={{ padding: '8px 12px', fontSize: '0.82rem', width: '100%' }}
                  />
                </div>

                {/* Channel Badges Grid */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '180px', overflowY: 'auto', padding: '4px' }}>
                  {((data?.channels || []).filter(c => c.type === 0 || c.type === 5))
                    .filter(c => c.name.toLowerCase().includes(loveChannelSearch.toLowerCase()))
                    .map(ch => {
                      const isAllowed = (settings?.botCommands?.loveTest?.allowedChannels || []).includes(ch.id);
                      return (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => handleToggleCommandChannel('loveTest', ch.id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 14px',
                            borderRadius: '10px',
                            backgroundColor: isAllowed ? 'rgba(236, 72, 153, 0.18)' : 'rgba(15, 23, 42, 0.7)',
                            border: isAllowed ? '1.5px solid #ec4899' : '1px solid rgba(255, 255, 255, 0.08)',
                            color: isAllowed ? '#ffffff' : '#94a3b8',
                            fontSize: '0.84rem',
                            fontWeight: isAllowed ? '700' : '500',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Hash size={14} color={isAllowed ? '#ec4899' : '#64748b'} />
                          <span>{ch.name}</span>
                          {isAllowed && <Check size={14} color="#ec4899" />}
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>

          {/* 2. XP COMMAND CONFIGURATION CARD */}
          <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(234, 179, 8, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(234, 179, 8, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={20} color="#eab308" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>
                    XP & Level Card Command Settings
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                    Displays member XP cards, current rank, level progress bar, and interactive leaderboard button.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleToggleCommandRestriction('xp')}
                title="Click to toggle restriction mode"
                style={{
                  padding: '5px 12px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  backgroundColor: (settings?.botCommands?.xp?.allowedChannels?.length > 0 || settings?.botCommands?.xp?.restrictChannels) ? 'rgba(234, 179, 8, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  color: (settings?.botCommands?.xp?.allowedChannels?.length > 0 || settings?.botCommands?.xp?.restrictChannels) ? '#fbbf24' : '#34d399',
                  border: (settings?.botCommands?.xp?.allowedChannels?.length > 0 || settings?.botCommands?.xp?.restrictChannels) ? '1px solid rgba(234, 179, 8, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)'
                }}
              >
                {(settings?.botCommands?.xp?.allowedChannels?.length > 0 || settings?.botCommands?.xp?.restrictChannels)
                  ? `RESTRICTED (${settings?.botCommands?.xp?.allowedChannels?.length || 0} Channels)`
                  : 'WORKS IN ALL CHANNELS'}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Command Trigger Input */}
              <div style={{ maxWidth: '450px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', fontWeight: '700', marginBottom: '8px' }}>
                  XP Command Trigger Word
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ padding: '10px 14px', backgroundColor: 'rgba(234, 179, 8, 0.15)', color: '#eab308', borderRadius: '10px', fontWeight: '800', fontSize: '0.9rem', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
                    Exact Trigger
                  </span>
                  <input
                    type="text"
                    value={settings?.botCommands?.xp?.command ?? '?xp'}
                    onChange={(e) => handleUpdateCommandTrigger('xp', e.target.value)}
                    className="glass-input"
                    placeholder="e.g. ?xp, xp, !rank"
                    style={{ flex: 1, padding: '10px 14px', fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}
                  />
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '6px' }}>
                  The bot only responds to this exact command. Members can type <code>{(settings?.botCommands?.xp?.command || 'xp').trim()}</code> or <code>{(settings?.botCommands?.xp?.command || 'xp').trim()} @user</code> in Discord.
                </div>
              </div>

              {/* Channel Restrictions Switch & Selector */}
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', padding: '18px 20px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#ffffff' }}>
                      Allowed Discord Channels for XP Command
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                      Select which text channels members are allowed to run this command in. If no channels are selected, it is usable server-wide.
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleSelectAllCommandChannels('xp', (data?.channels || []).filter(c => c.type === 0 || c.type === 5).map(c => c.id))}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={() => handleClearCommandChannels('xp')}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>

                {/* Channel Search Filter */}
                <div style={{ marginBottom: '14px', maxWidth: '300px' }}>
                  <input
                    type="text"
                    placeholder="Filter channels by name..."
                    value={xpChannelSearch}
                    onChange={(e) => setXpChannelSearch(e.target.value)}
                    className="glass-input"
                    style={{ padding: '8px 12px', fontSize: '0.82rem', width: '100%' }}
                  />
                </div>

                {/* Channel Badges Grid */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '180px', overflowY: 'auto', padding: '4px' }}>
                  {((data?.channels || []).filter(c => c.type === 0 || c.type === 5))
                    .filter(c => c.name.toLowerCase().includes(xpChannelSearch.toLowerCase()))
                    .map(ch => {
                      const isAllowed = (settings?.botCommands?.xp?.allowedChannels || []).includes(ch.id);
                      return (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => handleToggleCommandChannel('xp', ch.id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 14px',
                            borderRadius: '10px',
                            backgroundColor: isAllowed ? 'rgba(234, 179, 8, 0.18)' : 'rgba(15, 23, 42, 0.7)',
                            border: isAllowed ? '1.5px solid #eab308' : '1px solid rgba(255, 255, 255, 0.08)',
                            color: isAllowed ? '#ffffff' : '#94a3b8',
                            fontSize: '0.84rem',
                            fontWeight: isAllowed ? '700' : '500',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Hash size={14} color={isAllowed ? '#eab308' : '#64748b'} />
                          <span>{ch.name}</span>
                          {isAllowed && <Check size={14} color="#eab308" />}
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleResetCommandsSettings}
              disabled={saving}
              className="btn-secondary"
              style={{ padding: '12px 20px', fontSize: '0.9rem' }}
            >
              Reset Defaults
            </button>
            <button
              type="button"
              onClick={handleSaveCommandsSettings}
              disabled={saving}
              className="btn-primary"
              style={{
                backgroundColor: '#ec4899',
                borderColor: '#db2777',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 26px',
                fontSize: '0.95rem',
                boxShadow: '0 4px 14px rgba(236, 72, 153, 0.35)'
              }}
            >
              <Save size={18} />
              {saving ? 'Saving Changes...' : 'Save Commands & Channel Restrictions'}
            </button>
          </div>
        </div>
      )}

      {activeSubTab === 'custom-vc' && (
        <AdminCustomVc guildId={guildId} />
      )}

      {activeSubTab === 'server-control' && (
        <AdminServerControl guildId={guildId} />
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
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
