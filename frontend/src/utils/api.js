const API_URL = window.location.port === '5173' || window.location.port === '5174'
  ? 'http://localhost:2010/api'
  : '/api';

export const setToken = (token) => {
  if (token) {
    localStorage.setItem('smooth_token', token);
  } else {
    localStorage.removeItem('smooth_token');
  }
};

export const getToken = () => {
  return localStorage.getItem('smooth_token');
};

export const setUser = (user) => {
  if (user) {
    localStorage.setItem('smooth_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('smooth_user');
  }
};

export const getUser = () => {
  try {
    const userStr = localStorage.getItem('smooth_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const api = {
  getDiscordAuthUrl: () => request('/auth/discord-url'),
  exchangeCode: (code) => request('/auth/exchange', {
    method: 'POST',
    body: JSON.stringify({ code })
  }),
  getUserGuilds: () => request('/guilds'),
  processRolePurchase: (data) => request('/payments/process-purchase', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  customizeRole: (id, data) => request(`/payments/customize-role/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  getMyPurchasedRoles: () => request('/payments/my-roles'),
  updatePurchasedRole: (id, data) => request(`/payments/update-role/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  keyauthAdminLogin: (username, password, hwid) => request('/auth/keyauth-login', {
    method: 'POST',
    body: JSON.stringify({ username, password, hwid })
  }),
  getGuilds: async () => {
    try {
      return await request('/admin/guilds');
    } catch {
      return await request('/guilds');
    }
  },
  getAuthorizedUsers: () => request('/admin/users'),
  getBotSettings: () => request('/admin/bot-settings'),
  saveBotSettings: (data) => request('/admin/bot-settings', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  leaveGuild: (guildId) => request(`/admin/guilds/${guildId}/leave`, { method: 'POST' }),
  getAdminPayments: async () => {
    try {
      return await request('/admin/payments');
    } catch (err) {
      return await request('/payments/admin/all');
    }
  },
  verifyPayment: async (id) => {
    try {
      return await request(`/admin/payments/${id}/verify`, { method: 'POST' });
    } catch (err) {
      return await request(`/payments/admin/${id}/verify`, { method: 'POST' });
    }
  },
  rejectPayment: async (id) => {
    try {
      return await request(`/admin/payments/${id}/reject`, { method: 'POST' });
    } catch (err) {
      return await request(`/payments/admin/${id}/reject`, { method: 'POST' });
    }
  },
  unverifyPayment: async (id) => {
    try {
      return await request(`/payments/admin/${id}/unverify`, { method: 'POST' });
    } catch (err) {
      return await request(`/admin/payments/${id}/unverify`, { method: 'POST' });
    }
  },
  deletePayment: async (id) => {
    try {
      return await request(`/payments/admin/${id}`, { method: 'DELETE' });
    } catch (err) {
      return await request(`/admin/payments/${id}`, { method: 'DELETE' });
    }
  },
  getPackages: () => request('/payments/packages'),
  createPackage: (data) => request('/payments/admin/packages', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updatePackage: (id, data) => request(`/payments/admin/packages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteConfigPackage: (id) => request(`/payments/admin/packages/${id}`, {
    method: 'DELETE'
  }),
  getPaymentSettings: () => request('/payments/settings'),
  updatePaymentSettings: (data) => request('/admin/payment-settings', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  // Guild Settings API Endpoints
  getSettings: (guildId) => request(`/settings/${guildId}`),
  saveSettings: (guildId, data) => request(`/settings/${guildId}`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Server Control & Admin Management Endpoints
  getAdminGuildDetails: async (guildId) => {
    try {
      return await request(`/admin/guilds/${guildId}`);
    } catch {
      return await request(`/guilds/${guildId}`);
    }
  },
  updateAdminGuildDetails: async (guildId, formData) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/admin/guilds/${guildId}`, {
      method: 'POST',
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      body: formData
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
  createChannel: (guildId, name, type, parentId) => request(`/admin/guilds/${guildId}/channels`, {
    method: 'POST',
    body: JSON.stringify({ name, type, parentId })
  }),
  renameChannel: (guildId, channelId, name) => request(`/admin/guilds/${guildId}/channels/${channelId}`, {
    method: 'PUT',
    body: JSON.stringify({ name })
  }),
  deleteChannel: (guildId, channelId) => request(`/admin/guilds/${guildId}/channels/${channelId}`, {
    method: 'DELETE'
  }),
  getAdminMembers: async (guildId, query = '') => {
    try {
      return await request(`/admin/guilds/${guildId}/members?query=${encodeURIComponent(query)}`);
    } catch {
      return await request(`/guilds/${guildId}/members?query=${encodeURIComponent(query)}`);
    }
  },
  getAdminGuildRoles: async (guildId) => {
    try {
      return await request(`/guilds/${guildId}/roles`);
    } catch {
      return await request(`/admin/guilds/${guildId}/roles`);
    }
  },
  timeoutMember: (guildId, userId, duration, reason) => request(`/admin/guilds/${guildId}/members/${userId}/timeout`, {
    method: 'POST',
    body: JSON.stringify({ duration, reason })
  }),
  kickMember: (guildId, userId, reason) => request(`/admin/guilds/${guildId}/members/${userId}/kick`, {
    method: 'POST',
    body: JSON.stringify({ reason })
  }),
  banMember: (guildId, userId, reason) => request(`/admin/guilds/${guildId}/members/${userId}/ban`, {
    method: 'POST',
    body: JSON.stringify({ reason })
  }),
  changeNickname: (guildId, userId, nickname, reason) => request(`/admin/guilds/${guildId}/members/${userId}/nickname`, {
    method: 'POST',
    body: JSON.stringify({ nickname, reason })
  }),
  updateMemberRoles: (guildId, userId, roleIds, reason) => request(`/admin/guilds/${guildId}/members/${userId}/roles`, {
    method: 'POST',
    body: JSON.stringify({ roleIds, reason })
  }),
  startBulkNickname: (guildId, data) => request(`/admin/guilds/${guildId}/bulk-nickname`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getBulkNicknameStatus: (guildId) => request(`/admin/guilds/${guildId}/bulk-nickname/status`),
  cancelBulkNickname: (guildId) => request(`/admin/guilds/${guildId}/bulk-nickname/cancel`, { method: 'POST' }),

  // Member XP & Leveling API Endpoints
  getLevelLeaderboard: (guildId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/guilds/${guildId}/levels/leaderboard?${query}`);
  },
  getMemberLevelDetails: (guildId, userId) => request(`/guilds/${guildId}/levels/user/${userId}`),
  updateUserXp: (guildId, userId, data) => request(`/guilds/${guildId}/levels/user/${userId}/xp`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  resetUserXp: (guildId, userId) => request(`/guilds/${guildId}/levels/reset-user/${userId}`, {
    method: 'POST'
  }),
  resetAllXp: (guildId) => request(`/guilds/${guildId}/levels/reset-all`, {
    method: 'POST'
  }),
  getLevelStats: (guildId) => request(`/guilds/${guildId}/levels/stats`),
  autoGenerateLevelRoles: (guildId) => request(`/guilds/${guildId}/levels/auto-generate-roles`, { method: 'POST' }),
  auditSyncLevelRoles: (guildId) => request(`/guilds/${guildId}/levels/audit-sync`, { method: 'POST' }),
  sendLeaderboardEmbed: (guildId, channelId, page = 1) => request(`/guilds/${guildId}/levels/send-leaderboard`, {
    method: 'POST',
    body: JSON.stringify({ channelId, page })
  }),

  // Custom VC & Voice Manager Endpoints
  getCustomVcDetails: (guildId) => request(`/admin/guilds/${guildId}/custom-vc`),
  saveCustomVcSettings: (guildId, data) => request(`/admin/guilds/${guildId}/custom-vc/settings`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  autoSetupCustomVc: (guildId) => request(`/admin/guilds/${guildId}/custom-vc/auto-setup`, {
    method: 'POST'
  }),
  sendVoiceManagerPanel: (guildId, channelId) => request(`/admin/guilds/${guildId}/custom-vc/send-panel`, {
    method: 'POST',
    body: JSON.stringify({ channelId })
  }),
  createCustomVcChannel: (guildId, data) => request(`/admin/guilds/${guildId}/custom-vc/create-channel`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  performCustomVcAction: (guildId, channelId, action, params = {}) => request(`/admin/guilds/${guildId}/custom-vc/channels/${channelId}/action`, {
    method: 'POST',
    body: JSON.stringify({ action, ...params })
  }),

  // Server Control Moderation Endpoints
  getServerControlDetails: (guildId) => request(`/admin/guilds/${guildId}/server-control`),
  saveServerControlSettings: (guildId, data) => request(`/admin/guilds/${guildId}/server-control/settings`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  setupServerControlBlacklist: (guildId, data) => request(`/admin/guilds/${guildId}/server-control/blacklist-setup`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  authorizeServerControlUser: (guildId, data) => request(`/admin/guilds/${guildId}/server-control/authorize-user`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  revokeServerControlUser: (guildId, userId) => request(`/admin/guilds/${guildId}/server-control/authorize-user/${userId}`, {
    method: 'DELETE'
  }),
  authorizeServerControlRole: (guildId, data) => request(`/admin/guilds/${guildId}/server-control/authorize-role`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  revokeServerControlRole: (guildId, roleId) => request(`/admin/guilds/${guildId}/server-control/authorize-role/${roleId}`, {
    method: 'DELETE'
  }),
  whitelistRoleManagerUser: (guildId, data) => request(`/admin/guilds/${guildId}/server-control/role-manager/whitelist-user`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  revokeRoleManagerUser: (guildId, userId) => request(`/admin/guilds/${guildId}/server-control/role-manager/whitelist-user/${userId}`, {
    method: 'DELETE'
  }),
  whitelistRoleManagerRole: (guildId, data) => request(`/admin/guilds/${guildId}/server-control/role-manager/whitelist-role`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  revokeRoleManagerRole: (guildId, roleId) => request(`/admin/guilds/${guildId}/server-control/role-manager/whitelist-role/${roleId}`, {
    method: 'DELETE'
  }),
  sendServerControlTestLog: (guildId, channelId) => request(`/admin/guilds/${guildId}/server-control/test-log`, {
    method: 'POST',
    body: JSON.stringify({ channelId })
  }),
  executeServerControlAction: (guildId, data) => request(`/admin/guilds/${guildId}/server-control/execute`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getServerControlLogs: (guildId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/guilds/${guildId}/server-control/logs?${query}`);
  },
  sendTestLevelUpAnnouncement: (guildId, channelId, level = 5) => request(`/guilds/${guildId}/levels/test-announcement`, {
    method: 'POST',
    body: JSON.stringify({ channelId, level })
  }),

  // Server & Voice Statistics Endpoints
  getServerStatsDetails: (guildId) => request(`/admin/guilds/${guildId}/server-stats`),
  saveServerStatsSettings: (guildId, data) => request(`/admin/guilds/${guildId}/server-stats/settings`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  autoSetupServerStats: (guildId, data = {}) => request(`/admin/guilds/${guildId}/server-stats/auto-setup`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  syncServerStatsNow: (guildId) => request(`/admin/guilds/${guildId}/server-stats/sync-now`, {
    method: 'POST'
  }),
  deleteServerStatsChannels: (guildId) => request(`/admin/guilds/${guildId}/server-stats/delete-channels`, {
    method: 'POST'
  }),
  saveVoiceSubtitles: (guildId, subtitles, applyNow = true) => request(`/admin/guilds/${guildId}/server-stats/subtitles`, {
    method: 'POST',
    body: JSON.stringify({ subtitles, applyNow })
  }),
  applyVoiceSubtitles: (guildId) => request(`/admin/guilds/${guildId}/server-stats/subtitles/apply`, {
    method: 'POST'
  }),
  setupPresetVoiceSubtitles: (guildId, presetType = 'JOIN_TO_CREATE') => request(`/admin/guilds/${guildId}/server-stats/subtitles/preset`, {
    method: 'POST',
    body: JSON.stringify({ presetType })
  }),
  applyStatVoiceChannels: (guildId, statVoiceChannels, categoryId = '') => request(`/admin/guilds/${guildId}/server-stats/stat-channels/apply`, {
    method: 'POST',
    body: JSON.stringify({ statVoiceChannels, categoryId })
  }),
  setupPresetStatChannels: (guildId, presetType = 'CORE_3') => request(`/admin/guilds/${guildId}/server-stats/stat-channels/preset`, {
    method: 'POST',
    body: JSON.stringify({ presetType })
  })
};


