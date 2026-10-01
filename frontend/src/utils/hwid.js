/**
 * Generates and retrieves a unique, persistent hardware/device identifier for the current client browser.
 */
export const getDeviceHWID = () => {
  try {
    let hwid = localStorage.getItem('smooth_device_hwid') || localStorage.getItem('timoxiter_device_hwid');
    if (!hwid) {
      const screenInfo = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
      const navInfo = `${navigator.userAgent}-${navigator.language}-${navigator.hardwareConcurrency || 4}`;
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const rawString = `${screenInfo}|${navInfo}|${tz}|${Date.now()}-${Math.random()}`;

      let hash = 0;
      for (let i = 0; i < rawString.length; i++) {
        const char = rawString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
      }
      
      const randomPart = Math.random().toString(36).substring(2, 10);
      hwid = `WEB-${Math.abs(hash).toString(16).toUpperCase()}-${randomPart.toUpperCase()}`;
      localStorage.setItem('smooth_device_hwid', hwid);
    }
    return hwid;
  } catch (e) {
    console.error('Failed to access localStorage for HWID generation:', e);
    return `WEB-FALLBACK-${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
  }
};
