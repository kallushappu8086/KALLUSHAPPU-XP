import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import AdminServerSettings from '../components/AdminServerSettings';
import AdminCustomVc from '../components/AdminCustomVc';
import AdminServerControl from '../components/AdminServerControl';
import {
  LogOut, Search, RefreshCw, ShieldCheck, CheckCircle2, XCircle, Clock,
  Trash2, RotateCcw, Tag, KeyRound, Loader2, Sparkles, AlertTriangle,
  Package, Plus, Edit3, Check, Layers, Crown, Sparkles as GemIcon,
  Eye, Image as ImageIcon, QrCode, Upload, Server, Volume2, Mic, Radio,
  ShieldAlert, Terminal
} from 'lucide-react';

export default function AdminSelector({ user, onLogout }) {
  const [mainTab, setMainTab] = useState('PAYMENTS'); // 'PAYMENTS' | 'PACKAGES' | 'UPI_SETTINGS'
  const [adminPayments, setAdminPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState('ALL'); // 'ALL', 'PENDING', 'VERIFIED', 'REJECTED'
  const [processingId, setProcessingId] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');
  const [previewScreenshot, setPreviewScreenshot] = useState(null);

  // UPI & QR Scanner Settings State
  const [upiSettingsForm, setUpiSettingsForm] = useState({
    upiId: 'rithwik0000@fam',
    upiQrCode: '/upi-scanner.jpg'
  });
  const [upiQrPreview, setUpiQrPreview] = useState('/upi-scanner.jpg');
  const [upiSaving, setUpiSaving] = useState(false);

  // Package Management State
  const [packages, setPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [packageFormData, setPackageFormData] = useState({
    name: '',
    price: 29,
    durationDays: 30,
    subtitle: '',
    isPopular: false,
    popularTag: 'Most Popular',
    iconType: 'purple',
    featuresText: ''
  });
  const [packageSaving, setPackageSaving] = useState(false);

  // Server XP Management State
  const [guilds, setGuilds] = useState([]);
  const [guildsLoading, setGuildsLoading] = useState(false);
  const [selectedGuildId, setSelectedGuildId] = useState('');

  useEffect(() => {
    fetchAdminPayments();
    fetchPackages();
    fetchPaymentSettings();
    fetchGuildsList();
  }, []);

  const fetchGuildsList = async () => {
    setGuildsLoading(true);
    try {
      const data = await api.getGuilds();
      if (Array.isArray(data)) {
        setGuilds(data);
        if (data.length > 0 && !selectedGuildId) {
          const defaultGuild = data.find(g => g.botInGuild) || data[0];
          setSelectedGuildId(defaultGuild.id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch guilds list for Admin Selector:', err);
    } finally {
      setGuildsLoading(false);
    }
  };

  const fetchPaymentSettings = async () => {
    try {
      const data = await api.getPaymentSettings();
      if (data) {
        setUpiSettingsForm({
          upiId: data.upiId || 'rithwik0000@fam',
          upiQrCode: data.upiQrCode || '/upi-scanner.jpg'
        });
        setUpiQrPreview(data.upiQrCode || '/upi-scanner.jpg');
      }
    } catch (err) {
      console.error('Failed to fetch payment settings:', err);
    }
  };

  const handleQrFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);

        setUpiSettingsForm(prev => ({ ...prev, upiQrCode: compressedDataUrl }));
        setUpiQrPreview(compressedDataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveUpiSettings = async (e) => {
    e.preventDefault();
    if (!upiSettingsForm.upiId.trim()) {
      alert('Please enter a valid UPI ID.');
      return;
    }

    setUpiSaving(true);
    setActionSuccess('');
    try {
      await api.updatePaymentSettings({
        upiId: upiSettingsForm.upiId.trim(),
        upiQrCode: upiSettingsForm.upiQrCode
      });
      setActionSuccess('Payment UPI ID and QR Scanner settings updated successfully!');
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      alert('Failed to save payment settings: ' + (err.message || 'Unknown error'));
    } finally {
      setUpiSaving(false);
    }
  };

  const fetchAdminPayments = async () => {
    setPaymentsLoading(true);
    setError(null);
    try {
      const data = await api.getAdminPayments();
      if (Array.isArray(data)) {
        setAdminPayments(data);
      } else {
        setAdminPayments([]);
      }
    } catch (err) {
      console.error('Failed to fetch admin payments:', err);
      setError('Failed to load payment purchases: ' + (err.message || 'Unknown error'));
    } finally {
      setPaymentsLoading(false);
    }
  };

  const fetchPackages = async () => {
    setPackagesLoading(true);
    try {
      const data = await api.getPackages();
      if (Array.isArray(data)) {
        setPackages(data);
      }
    } catch (err) {
      console.error('Failed to fetch packages:', err);
    } finally {
      setPackagesLoading(false);
    }
  };

  const handleVerifyPayment = async (id, username) => {
    setProcessingId(id);
    setActionSuccess('');
    try {
      await api.verifyPayment(id);
      setActionSuccess(`Payment for @${username} was verified and accepted!`);
      setTimeout(() => setActionSuccess(''), 4000);
      fetchAdminPayments();
    } catch (err) {
      alert('Failed to verify payment: ' + (err.message || 'Unknown error'));
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectPayment = async (id, username) => {
    if (!window.confirm(`Are you sure you want to REJECT the payment request for @${username}?`)) return;
    setProcessingId(id);
    setActionSuccess('');
    try {
      await api.rejectPayment(id);
      setActionSuccess(`Payment for @${username} was marked as rejected.`);
      setTimeout(() => setActionSuccess(''), 4000);
      fetchAdminPayments();
    } catch (err) {
      alert('Failed to reject payment: ' + (err.message || 'Unknown error'));
    } finally {
      setProcessingId(null);
    }
  };

  const handleUnverifyPayment = async (id, username) => {
    if (!window.confirm(`Are you sure you want to UNVERIFY the payment for @${username}?\n\nThis will automatically revoke and remove all package features and Discord roles assigned to this user, and move the order back to Pending.`)) return;
    setProcessingId(id);
    setActionSuccess('');
    try {
      await api.unverifyPayment(id);
      setActionSuccess(`Payment for @${username} was unverified! All package features and Discord roles were automatically removed.`);
      setTimeout(() => setActionSuccess(''), 4000);
      fetchAdminPayments();
    } catch (err) {
      alert('Failed to unverify payment: ' + (err.message || 'Unknown error'));
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeletePayment = async (id, username) => {
    if (!window.confirm(`Are you sure you want to DELETE the purchase order for @${username}?\n\nThis will automatically revoke and remove all package features and Discord roles assigned to this user.`)) return;
    setProcessingId(id);
    setActionSuccess('');
    try {
      await api.deletePayment(id);
      setActionSuccess(`Order for @${username} deleted! Associated features and Discord roles were automatically revoked.`);
      setTimeout(() => setActionSuccess(''), 4000);
      fetchAdminPayments();
    } catch (err) {
      alert('Failed to delete order: ' + (err.message || 'Unknown error'));
    } finally {
      setProcessingId(null);
    }
  };

  // --- PACKAGE MANAGEMENT HANDLERS ---
  const handleOpenAddPackage = () => {
    setEditingPackageId(null);
    setPackageFormData({
      name: '',
      price: 29,
      durationDays: 30,
      subtitle: '',
      isPopular: false,
      popularTag: 'Most Popular',
      iconType: 'purple',
      featuresText: '🎨 Custom Role (Auto-created)\n🔊 Soundboard Access\n📝 Nickname Change\n⏳ 30 Days Access'
    });
    setShowPackageModal(true);
  };

  const handleOpenEditPackage = (pkg) => {
    setEditingPackageId(pkg._id);
    setPackageFormData({
      name: pkg.name || '',
      price: pkg.price !== undefined ? pkg.price : 29,
      durationDays: pkg.durationDays || 30,
      subtitle: pkg.subtitle || '',
      isPopular: Boolean(pkg.isPopular),
      popularTag: pkg.popularTag || 'Most Popular',
      iconType: pkg.iconType || 'purple',
      featuresText: Array.isArray(pkg.features) ? pkg.features.join('\n') : ''
    });
    setShowPackageModal(true);
  };

  const handleDeletePackage = async (pkg) => {
    if (!window.confirm(`Are you sure you want to delete the package "${pkg.name}"?\n\nThis package will be immediately removed from the User Shop.`)) return;
    try {
      await api.deleteConfigPackage(pkg._id);
      setActionSuccess(`Package "${pkg.name}" deleted successfully!`);
      setTimeout(() => setActionSuccess(''), 4000);
      fetchPackages();
    } catch (err) {
      alert('Failed to delete package: ' + (err.message || 'Unknown error'));
    }
  };

  const handleSavePackage = async (e) => {
    e.preventDefault();
    if (!packageFormData.name.trim()) {
      alert('Please enter a package name.');
      return;
    }

    setPackageSaving(true);
    try {
      const featuresArray = packageFormData.featuresText
        .split('\n')
        .map(f => f.trim())
        .filter(f => f.length > 0);

      const payload = {
        name: packageFormData.name.trim(),
        price: Number(packageFormData.price) || 0,
        durationDays: Number(packageFormData.durationDays) || 30,
        subtitle: packageFormData.subtitle.trim(),
        isPopular: Boolean(packageFormData.isPopular),
        popularTag: packageFormData.popularTag.trim() || 'Most Popular',
        iconType: packageFormData.iconType || 'purple',
        features: featuresArray
      };

      if (editingPackageId) {
        await api.updatePackage(editingPackageId, payload);
        setActionSuccess(`Package "${payload.name}" updated successfully!`);
      } else {
        await api.createPackage(payload);
        setActionSuccess(`New package "${payload.name}" created! It is now live in the Shop.`);
      }

      setShowPackageModal(false);
      setTimeout(() => setActionSuccess(''), 4000);
      fetchPackages();
    } catch (err) {
      alert('Failed to save package: ' + (err.message || 'Unknown error'));
    } finally {
      setPackageSaving(false);
    }
  };

  // Filtered Payments
  const filteredPayments = adminPayments.filter((p) => {
    const matchesSearch =
      (p.username && p.username.toLowerCase().includes(search.toLowerCase())) ||
      (p.paymentId && p.paymentId.toLowerCase().includes(search.toLowerCase())) ||
      (p.planName && p.planName.toLowerCase().includes(search.toLowerCase())) ||
      (p.userId && p.userId.includes(search));

    if (!matchesSearch) return false;

    if (filterTab === 'PENDING') return p.paymentStatus === 'PENDING';
    if (filterTab === 'VERIFIED') return p.paymentStatus === 'VERIFIED';
    if (filterTab === 'REJECTED') return p.paymentStatus === 'REJECTED';
    return true; // 'ALL'
  });

  // Calculate statistics
  const totalCount = adminPayments.length;
  const pendingCount = adminPayments.filter((p) => p.paymentStatus === 'PENDING').length;
  const verifiedCount = adminPayments.filter((p) => p.paymentStatus === 'VERIFIED').length;
  const rejectedCount = adminPayments.filter((p) => p.paymentStatus === 'REJECTED').length;
  const totalRevenue = adminPayments
    .filter((p) => p.paymentStatus === 'VERIFIED')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      padding: '24px 20px 60px 20px',
      fontFamily: "'Inter', sans-serif",
      boxSizing: 'border-box'
    }}>

      {/* Top Header Bar */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header className="glass-panel" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          marginBottom: '28px',
          backgroundColor: '#1e293b',
          borderRadius: '16px',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
        }}>
          {/* Header Left: User Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#818cf8'
            }}>
              <KeyRound size={24} />
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>@{user?.username || 'KeyAuth Admin'}</span>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: '800',
                  backgroundColor: 'rgba(99, 102, 241, 0.2)',
                  color: '#a5b4fc',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(165, 180, 252, 0.3)',
                  letterSpacing: '0.05em'
                }}>
                  KEYAUTH SECURED
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                Global Admin Control Panel
              </div>
            </div>
          </div>

          {/* Header Right: Actions */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={() => {
                fetchAdminPayments();
                fetchPackages();
              }}
              style={{
                padding: '8px 16px',
                fontSize: '0.85rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#cbd5e1',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RefreshCw size={15} /> Refresh List
            </button>

            <button
              onClick={onLogout}
              style={{
                padding: '8px 16px',
                fontSize: '0.85rem',
                backgroundColor: '#dc2626',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        </header>

        {/* Dashboard 2-Column Split Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px' }}>

          {/* Left Column: Sidebar Stats & Tab Navigation */}
          <aside style={{
            backgroundColor: '#1e293b',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            height: 'fit-content'
          }}>
            <div style={{ textAlign: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#818cf8',
                margin: '0 auto 10px auto'
              }}>
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>Admin Control</h3>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Management Dashboard</span>
            </div>

            {/* Top Navigation Tabs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => setMainTab('PAYMENTS')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: mainTab === 'PAYMENTS' ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid transparent',
                  cursor: 'pointer',
                  backgroundColor: mainTab === 'PAYMENTS' ? '#6366f1' : 'rgba(15, 23, 42, 0.6)',
                  color: mainTab === 'PAYMENTS' ? '#ffffff' : '#94a3b8',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <ShieldCheck size={18} />
                <span style={{ flex: 1 }}>Payment Orders</span>
                {pendingCount > 0 && (
                  <span style={{
                    backgroundColor: mainTab === 'PAYMENTS' ? 'rgba(255,255,255,0.25)' : '#fbbf24',
                    color: mainTab === 'PAYMENTS' ? '#ffffff' : '#0f172a',
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontWeight: '800'
                  }}>
                    {pendingCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setMainTab('PACKAGES');
                  fetchPackages();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: mainTab === 'PACKAGES' ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid transparent',
                  cursor: 'pointer',
                  backgroundColor: mainTab === 'PACKAGES' ? '#6366f1' : 'rgba(15, 23, 42, 0.6)',
                  color: mainTab === 'PACKAGES' ? '#ffffff' : '#94a3b8',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <Package size={18} />
                <span style={{ flex: 1 }}>Manage Packages</span>
                <span style={{
                  backgroundColor: mainTab === 'PACKAGES' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                  color: mainTab === 'PACKAGES' ? '#ffffff' : '#94a3b8',
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontWeight: '800'
                }}>
                  {packages.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setMainTab('UPI_SETTINGS');
                  fetchPaymentSettings();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: mainTab === 'UPI_SETTINGS' ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid transparent',
                  cursor: 'pointer',
                  backgroundColor: mainTab === 'UPI_SETTINGS' ? '#6366f1' : 'rgba(15, 23, 42, 0.6)',
                  color: mainTab === 'UPI_SETTINGS' ? '#ffffff' : '#94a3b8',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <QrCode size={18} />
                <span style={{ flex: 1 }}>UPI & QR Scanner</span>
              </button>

              <button
                onClick={() => {
                  setMainTab('SERVERS');
                  fetchGuildsList();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: mainTab === 'SERVERS' ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid transparent',
                  cursor: 'pointer',
                  backgroundColor: mainTab === 'SERVERS' ? '#6366f1' : 'rgba(15, 23, 42, 0.6)',
                  color: mainTab === 'SERVERS' ? '#ffffff' : '#94a3b8',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <Server size={18} />
                <span style={{ flex: 1 }}>SERVER</span>
                <span style={{
                  backgroundColor: mainTab === 'SERVERS' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                  color: mainTab === 'SERVERS' ? '#ffffff' : '#94a3b8',
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontWeight: '800'
                }}>
                  {guilds.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setMainTab('CUSTOM_VC');
                  fetchGuildsList();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: mainTab === 'CUSTOM_VC' ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid transparent',
                  cursor: 'pointer',
                  backgroundColor: mainTab === 'CUSTOM_VC' ? '#6366f1' : 'rgba(15, 23, 42, 0.6)',
                  color: mainTab === 'CUSTOM_VC' ? '#ffffff' : '#94a3b8',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <Volume2 size={18} />
                <span style={{ flex: 1 }}>Custom VC</span>
                <span style={{
                  backgroundColor: mainTab === 'CUSTOM_VC' ? 'rgba(255,255,255,0.25)' : 'rgba(16, 185, 129, 0.15)',
                  color: mainTab === 'CUSTOM_VC' ? '#ffffff' : '#34d399',
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontWeight: '800'
                }}>
                  NEW
                </span>
              </button>

              <button
                onClick={() => {
                  setMainTab('SERVER_CONTROL');
                  fetchGuildsList();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: mainTab === 'SERVER_CONTROL' ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid transparent',
                  cursor: 'pointer',
                  backgroundColor: mainTab === 'SERVER_CONTROL' ? '#ef4444' : 'rgba(15, 23, 42, 0.6)',
                  color: mainTab === 'SERVER_CONTROL' ? '#ffffff' : '#94a3b8',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <ShieldAlert size={18} />
                <span style={{ flex: 1 }}>Server Control</span>
                <span style={{
                  backgroundColor: mainTab === 'SERVER_CONTROL' ? 'rgba(255,255,255,0.25)' : 'rgba(239, 68, 68, 0.15)',
                  color: mainTab === 'SERVER_CONTROL' ? '#ffffff' : '#f87171',
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontWeight: '800'
                }}>
                  NEW
                </span>
              </button>

              <button
                onClick={() => {
                  setMainTab('BOT_COMMANDS');
                  fetchGuildsList();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: mainTab === 'BOT_COMMANDS' ? '1px solid rgba(236, 72, 153, 0.5)' : '1px solid transparent',
                  cursor: 'pointer',
                  backgroundColor: mainTab === 'BOT_COMMANDS' ? '#ec4899' : 'rgba(15, 23, 42, 0.6)',
                  color: mainTab === 'BOT_COMMANDS' ? '#ffffff' : '#94a3b8',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <Terminal size={18} />
                <span style={{ flex: 1 }}>Bot Commands</span>
                <span style={{
                  backgroundColor: mainTab === 'BOT_COMMANDS' ? 'rgba(255,255,255,0.25)' : 'rgba(236, 72, 153, 0.15)',
                  color: mainTab === 'BOT_COMMANDS' ? '#ffffff' : '#f472b6',
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontWeight: '800'
                }}>
                  NEW
                </span>
              </button>
            </div>

            {/* Payment Order Statistics */}
            {mainTab === 'PAYMENTS' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                <div style={{ backgroundColor: '#0f172a', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>TOTAL ORDERS</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ffffff', marginTop: '2px' }}>{totalCount}</div>
                </div>

                <div style={{ backgroundColor: '#0f172a', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: '600' }}>PENDING VERIFICATION</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fbbf24', marginTop: '2px' }}>{pendingCount}</div>
                </div>

                <div style={{ backgroundColor: '#0f172a', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: '600' }}>VERIFIED & APPROVED</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#34d399', marginTop: '2px' }}>{verifiedCount}</div>
                </div>

                <div style={{ backgroundColor: '#0f172a', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#f87171', fontWeight: '600' }}>REJECTED ORDERS</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f87171', marginTop: '2px' }}>{rejectedCount}</div>
                </div>

                <div style={{ backgroundColor: '#0f172a', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: '600' }}>TOTAL REVENUE</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#818cf8', marginTop: '2px' }}>₹{totalRevenue}</div>
                </div>
              </div>
            )}

            {mainTab === 'PACKAGES' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                <div style={{ backgroundColor: '#0f172a', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: '600' }}>ACTIVE PACKAGES</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#818cf8', marginTop: '2px' }}>{packages.length}</div>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: '1.4' }}>
                  All edits and new packages created here will be dynamically updated in the User Shop page immediately.
                </div>
              </div>
            )}

            {mainTab === 'SERVERS' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                <div style={{ backgroundColor: '#0f172a', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: '600' }}>TOTAL DISCORD SERVERS</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#818cf8', marginTop: '2px' }}>{guilds.length}</div>
                </div>
                {selectedGuildId && (
                  <div style={{ backgroundColor: '#0f172a', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
                    <div style={{ fontSize: '0.75rem', color: '#fef08a', fontWeight: '600' }}>ACTIVE SELECTED SERVER</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#ffffff', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {guilds.find(g => g.id === selectedGuildId)?.name || selectedGuildId}
                    </div>
                  </div>
                )}
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: '1.4' }}>
                  Full XP breakdown, member active level details, leaderboard, level role reward configuration & XP editor.
                </div>
              </div>
            )}

          </aside>

          {/* Right Column: Main Content */}
          <main style={{ minWidth: 0 }}>
            <div style={{
              backgroundColor: '#1e293b',
              borderRadius: '20px',
              padding: '24px 28px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
            }}>

              {/* Alert Feedback */}
              {actionSuccess && (
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '10px',
                  color: '#34d399',
                  fontSize: '0.88rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '20px'
                }}>
                  <CheckCircle2 size={18} />
                  <span>{actionSuccess}</span>
                </div>
              )}

              {error && (
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid rgba(244, 63, 94, 0.4)',
                  borderRadius: '10px',
                  color: '#fb7185',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '20px'
                }}>
                  <AlertTriangle size={18} />
                  <span>{error}</span>
                </div>
              )}

              {/* TAB 1: PAYMENT ORDERS */}
              {mainTab === 'PAYMENTS' && (
                <>
                  {/* Title and Controls Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    marginBottom: '20px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <ShieldCheck size={26} style={{ color: '#818cf8' }} />
                      Custom Role Payment Verifications
                    </h2>

                    {/* Search Bar */}
                    <div style={{ position: 'relative', width: '280px' }}>
                      <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                      <input
                        type="text"
                        placeholder="Search user, UTR ID, plan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px 10px 38px',
                          backgroundColor: '#0f172a',
                          border: '1px solid #334155',
                          borderRadius: '10px',
                          color: '#ffffff',
                          fontSize: '0.88rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {/* Filter Tabs */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    {[
                      { id: 'ALL', label: `All Orders (${totalCount})` },
                      { id: 'PENDING', label: `Pending (${pendingCount})` },
                      { id: 'VERIFIED', label: `Verified (${verifiedCount})` },
                      { id: 'REJECTED', label: `Rejected (${rejectedCount})` }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setFilterTab(tab.id)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '10px',
                          fontSize: '0.85rem',
                          fontWeight: '700',
                          border: 'none',
                          cursor: 'pointer',
                          backgroundColor: filterTab === tab.id ? '#6366f1' : '#0f172a',
                          color: filterTab === tab.id ? '#ffffff' : '#94a3b8',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Payments List */}
                  {paymentsLoading ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                      <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px auto' }} />
                      <div>Loading payment requests...</div>
                    </div>
                  ) : filteredPayments.length === 0 ? (
                    <div style={{
                      padding: '48px 20px',
                      textAlign: 'center',
                      backgroundColor: '#0f172a',
                      borderRadius: '16px',
                      border: '1px dashed #334155',
                      color: '#94a3b8'
                    }}>
                      <Sparkles size={36} color="#64748b" style={{ margin: '0 auto 12px auto' }} />
                      <div style={{ fontWeight: '700', fontSize: '1rem', color: '#f8fafc' }}>
                        No payment orders found
                      </div>
                      <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                        {search ? 'Try clearing your search query.' : `No purchase orders under '${filterTab}' tab.`}
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {filteredPayments.map((p) => {
                        const isPending = p.paymentStatus === 'PENDING';
                        const isVerified = p.paymentStatus === 'VERIFIED';
                        const isRejected = p.paymentStatus === 'REJECTED';
                        const isItemProcessing = processingId === p._id;

                        return (
                          <div
                            key={p._id}
                            style={{
                              padding: '20px',
                              borderRadius: '16px',
                              backgroundColor: isPending ? 'rgba(245, 158, 11, 0.03)' : '#0f172a',
                              border: isPending ? '1.5px solid rgba(245, 158, 11, 0.4)' : isVerified ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid #334155',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '14px',
                              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)'
                            }}
                          >
                            {/* Top Row: User & Status Badge */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '50%',
                                  backgroundColor: '#6366f1',
                                  color: '#ffffff',
                                  fontWeight: '800',
                                  fontSize: '1rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  {p.username ? p.username.substring(0, 2).toUpperCase() : 'DS'}
                                </div>
                                <div>
                                  <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#ffffff' }}>
                                    @{p.username}
                                  </div>
                                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                                    User ID: {p.userId}
                                  </div>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                  backgroundColor: 'rgba(99, 102, 241, 0.15)',
                                  border: '1px solid rgba(99, 102, 241, 0.3)',
                                  padding: '6px 12px',
                                  borderRadius: '8px',
                                  fontSize: '0.85rem',
                                  fontWeight: '800',
                                  color: '#a5b4fc',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}>
                                  <Tag size={14} />
                                  <span>{p.planName} • ₹{p.amount}</span>
                                </div>

                                {/* Status Badge */}
                                <span style={{
                                  padding: '6px 14px',
                                  borderRadius: '20px',
                                  fontSize: '0.78rem',
                                  fontWeight: '800',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  backgroundColor: isVerified ? 'rgba(16, 185, 129, 0.2)' : isPending ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                  color: isVerified ? '#34d399' : isPending ? '#fbbf24' : '#f87171',
                                  border: `1px solid ${isVerified ? 'rgba(16, 185, 129, 0.4)' : isPending ? 'rgba(245, 158, 11, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`
                                }}>
                                  {isVerified && <CheckCircle2 size={14} />}
                                  {isPending && <Clock size={14} />}
                                  {isRejected && <XCircle size={14} />}
                                  <span>{isVerified ? 'VERIFIED BY ADMIN' : isPending ? 'PENDING VERIFICATION' : 'REJECTED'}</span>
                                </span>
                              </div>
                            </div>

                            {/* Transaction Details */}
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                              gap: '10px',
                              backgroundColor: '#1e293b',
                              padding: '12px 14px',
                              borderRadius: '10px',
                              fontSize: '0.83rem',
                              color: '#cbd5e1'
                            }}>
                              <div>
                                <span style={{ color: '#64748b' }}>Ref / UTR ID:</span>{' '}
                                <strong style={{ fontFamily: 'monospace', color: '#fef08a' }}>{p.paymentId}</strong>
                              </div>

                              <div>
                                <span style={{ color: '#64748b' }}>Payment Method:</span>{' '}
                                <strong style={{ textTransform: 'uppercase', color: '#ffffff' }}>{p.paymentMethod || 'UPI'}</strong>
                              </div>

                              <div>
                                <span style={{ color: '#64748b' }}>Target Server:</span>{' '}
                                <strong style={{ color: '#ffffff' }}>{p.guildName || 'Official Server'}</strong>
                              </div>

                              <div>
                                <span style={{ color: '#64748b' }}>Submitted:</span>{' '}
                                <strong>{new Date(p.createdAt).toLocaleDateString()}</strong>
                              </div>
                            </div>

                            {/* Uploaded Payment Screenshot Proof Row */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '12px',
                              backgroundColor: '#1e293b',
                              padding: '10px 14px',
                              borderRadius: '10px',
                              border: '1px solid rgba(255, 255, 255, 0.05)'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ImageIcon size={16} style={{ color: '#818cf8' }} />
                                <span style={{ fontSize: '0.83rem', color: '#94a3b8', fontWeight: '600' }}>Payment Screenshot:</span>
                              </div>

                              {p.paymentScreenshot ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <img
                                    src={p.paymentScreenshot}
                                    alt="Proof Thumbnail"
                                    onClick={() => setPreviewScreenshot(p.paymentScreenshot)}
                                    style={{
                                      width: '36px',
                                      height: '36px',
                                      objectFit: 'cover',
                                      borderRadius: '6px',
                                      border: '1px solid #6366f1',
                                      cursor: 'pointer'
                                    }}
                                  />
                                  <button
                                    onClick={() => setPreviewScreenshot(p.paymentScreenshot)}
                                    style={{
                                      backgroundColor: 'rgba(99, 102, 241, 0.2)',
                                      color: '#a5b4fc',
                                      border: '1px solid rgba(99, 102, 241, 0.4)',
                                      borderRadius: '8px',
                                      padding: '6px 12px',
                                      fontSize: '0.78rem',
                                      fontWeight: '700',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '6px'
                                    }}
                                  >
                                    <Eye size={14} /> View Screenshot Proof
                                  </button>
                                </div>
                              ) : (
                                <span style={{ fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic' }}>
                                  No screenshot attached
                                </span>
                              )}
                            </div>

                            {/* Configured Custom Role Preview */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                              <span style={{ color: '#94a3b8', fontWeight: '600' }}>Configured Role:</span>
                              {p.roleName ? (
                                <div style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '4px 10px',
                                  borderRadius: '8px',
                                  backgroundColor: '#1e293b',
                                  border: '1px solid #334155'
                                }}>
                                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: p.roleColor || '#a855f7' }} />
                                  <strong style={{ color: p.roleColor || '#a855f7' }}>{p.roleName}</strong>
                                </div>
                              ) : (
                                <span style={{ color: '#64748b', fontStyle: 'italic' }}>(Awaiting user customization after verification)</span>
                              )}
                            </div>

                            {/* Action Buttons Footer */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '10px',
                              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                              paddingTop: '12px',
                              flexWrap: 'wrap'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {isPending && (
                                  <>
                                    <button
                                      disabled={isItemProcessing}
                                      onClick={() => handleVerifyPayment(p._id, p.username)}
                                      style={{
                                        backgroundColor: '#10b981',
                                        color: '#ffffff',
                                        border: 'none',
                                        padding: '8px 18px',
                                        borderRadius: '8px',
                                        fontSize: '0.85rem',
                                        fontWeight: '700',
                                        cursor: isItemProcessing ? 'not-allowed' : 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        boxShadow: '0 3px 10px rgba(16, 185, 129, 0.3)'
                                      }}
                                    >
                                      {isItemProcessing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                                      <span>Verify Payment</span>
                                    </button>

                                    <button
                                      disabled={isItemProcessing}
                                      onClick={() => handleRejectPayment(p._id, p.username)}
                                      style={{
                                        backgroundColor: 'rgba(239, 68, 68, 0.15)',
                                        color: '#f87171',
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        padding: '8px 14px',
                                        borderRadius: '8px',
                                        fontSize: '0.82rem',
                                        fontWeight: '700',
                                        cursor: isItemProcessing ? 'not-allowed' : 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                      }}
                                    >
                                      <XCircle size={15} />
                                      <span>Reject</span>
                                    </button>
                                  </>
                                )}

                                {isVerified && (
                                  <button
                                    disabled={isItemProcessing}
                                    onClick={() => handleUnverifyPayment(p._id, p.username)}
                                    style={{
                                      backgroundColor: 'rgba(245, 158, 11, 0.15)',
                                      color: '#fbbf24',
                                      border: '1px solid rgba(245, 158, 11, 0.3)',
                                      padding: '8px 14px',
                                      borderRadius: '8px',
                                      fontSize: '0.82rem',
                                      fontWeight: '700',
                                      cursor: isItemProcessing ? 'not-allowed' : 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '6px'
                                    }}
                                    title="Unverify payment and automatically remove all package features & roles from user account"
                                  >
                                    {isItemProcessing ? <Loader2 size={15} className="animate-spin" /> : <RotateCcw size={15} />}
                                    <span>Unverify Order</span>
                                  </button>
                                )}
                              </div>

                              {/* Delete Order Action Button */}
                              <button
                                disabled={isItemProcessing}
                                onClick={() => handleDeletePayment(p._id, p.username)}
                                style={{
                                  backgroundColor: 'rgba(244, 63, 94, 0.15)',
                                  color: '#fb7185',
                                  border: '1px solid rgba(244, 63, 94, 0.3)',
                                  padding: '8px 14px',
                                  borderRadius: '8px',
                                  fontSize: '0.82rem',
                                  fontWeight: '700',
                                  cursor: isItemProcessing ? 'not-allowed' : 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                                title="Delete order & remove assigned roles/features from user"
                              >
                                <Trash2 size={15} />
                                <span>Delete Order</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {/* TAB 2: MANAGE PACKAGES */}
              {mainTab === 'PACKAGES' && (
                <>
                  {/* Title and Controls Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    marginBottom: '20px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Package size={26} style={{ color: '#818cf8' }} />
                        Dynamic Shop Packages Manager
                      </h2>
                      <p style={{ fontSize: '0.83rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                        Create, edit, or delete premium package offerings for the user shop.
                      </p>
                    </div>

                    <button
                      onClick={handleOpenAddPackage}
                      style={{
                        backgroundColor: '#6366f1',
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        fontSize: '0.88rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
                      }}
                    >
                      <Plus size={18} />
                      <span>Add New Package</span>
                    </button>
                  </div>

                  {packagesLoading ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                      <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px auto' }} />
                      <div>Loading packages...</div>
                    </div>
                  ) : packages.length === 0 ? (
                    <div style={{
                      padding: '48px 20px',
                      textAlign: 'center',
                      backgroundColor: '#0f172a',
                      borderRadius: '16px',
                      border: '1px dashed #334155',
                      color: '#94a3b8'
                    }}>
                      <Package size={36} color="#64748b" style={{ margin: '0 auto 12px auto' }} />
                      <div style={{ fontWeight: '700', fontSize: '1rem', color: '#f8fafc' }}>
                        No packages configured yet
                      </div>
                      <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                        Click "+ Add New Package" to create your first shop package.
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                      {packages.map((pkg) => {
                        const iconColor = pkg.iconType === 'red' ? '#ef4444' :
                                         pkg.iconType === 'green' ? '#10b981' :
                                         pkg.iconType === 'blue' ? '#3b82f6' :
                                         pkg.iconType === 'gold' ? '#eab308' : '#a855f7';

                        return (
                          <div
                            key={pkg._id}
                            style={{
                              backgroundColor: '#0f172a',
                              borderRadius: '16px',
                              padding: '20px',
                              border: pkg.isPopular ? '2px solid rgba(239, 68, 68, 0.6)' : '1px solid #334155',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              gap: '16px',
                              position: 'relative',
                              boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
                            }}
                          >
                            {pkg.isPopular && (
                              <div style={{
                                position: 'absolute',
                                top: '-12px',
                                right: '16px',
                                backgroundColor: '#ef4444',
                                color: '#ffffff',
                                fontSize: '0.7rem',
                                fontWeight: '800',
                                padding: '3px 10px',
                                borderRadius: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.5)'
                              }}>
                                {pkg.popularTag || 'Most Popular'}
                              </div>
                            )}

                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <div style={{
                                  width: '42px',
                                  height: '42px',
                                  borderRadius: '12px',
                                  backgroundColor: `${iconColor}20`,
                                  border: `1px solid ${iconColor}50`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: iconColor
                                }}>
                                  <GemIcon size={22} />
                                </div>
                                <div>
                                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>
                                    {pkg.name}
                                  </h3>
                                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                                    {pkg.subtitle || 'Custom Role Premium Package'}
                                  </span>
                                </div>
                              </div>

                              <div style={{ margin: '14px 0', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#ffffff' }}>
                                  ₹{pkg.price}
                                </span>
                                <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>
                                  / {pkg.durationDays || 30} Days
                                </span>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '16px 0' }}>
                                {Array.isArray(pkg.features) && pkg.features.map((feat, idx) => (
                                  <div key={idx} style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Check size={14} color={iconColor} style={{ flexShrink: 0 }} />
                                    <span>{feat}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div style={{
                              display: 'flex',
                              gap: '10px',
                              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                              paddingTop: '14px'
                            }}>
                              <button
                                onClick={() => handleOpenEditPackage(pkg)}
                                style={{
                                  flex: 1,
                                  backgroundColor: 'rgba(99, 102, 241, 0.15)',
                                  color: '#a5b4fc',
                                  border: '1px solid rgba(99, 102, 241, 0.3)',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  fontSize: '0.82rem',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '6px'
                                }}
                              >
                                <Edit3 size={15} />
                                <span>Edit</span>
                              </button>

                              <button
                                onClick={() => handleDeletePackage(pkg)}
                                style={{
                                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                                  color: '#f87171',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  fontSize: '0.82rem',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '6px'
                                }}
                              >
                                <Trash2 size={15} />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {/* TAB 3: PAYMENT UPI & QR SCANNER SETTINGS */}
              {mainTab === 'UPI_SETTINGS' && (
                <>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    marginBottom: '24px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <QrCode size={26} style={{ color: '#818cf8' }} />
                        Payment UPI & QR Scanner Settings
                      </h2>
                      <p style={{ fontSize: '0.83rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                        Configure your payment UPI ID and upload or update the QR Code Scanner image for role checkout.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                    {/* Form Controls Column */}
                    <form onSubmit={handleSaveUpiSettings} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '16px', border: '1px solid #334155' }}>
                        <label style={{ display: 'block', fontSize: '0.88rem', color: '#f8fafc', fontWeight: '700', marginBottom: '8px' }}>
                          Payment UPI ID <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. rithwik0000@fam"
                          value={upiSettingsForm.upiId}
                          onChange={(e) => setUpiSettingsForm({ ...upiSettingsForm, upiId: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            backgroundColor: '#1e293b',
                            border: '1.5px solid rgba(99, 102, 241, 0.4)',
                            borderRadius: '10px',
                            color: '#ffffff',
                            fontSize: '0.95rem',
                            fontFamily: 'monospace',
                            fontWeight: '600',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
                          This UPI ID will be displayed to all users on the payment checkout modal.
                        </div>
                      </div>

                      {/* Scanner Image Uploader */}
                      <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '16px', border: '1px solid #334155' }}>
                        <label style={{ display: 'block', fontSize: '0.88rem', color: '#f8fafc', fontWeight: '700', marginBottom: '8px' }}>
                          Payment QR Scanner Image
                        </label>
                        
                        <label style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '24px',
                          backgroundColor: '#1e293b',
                          border: '2px dashed rgba(99, 102, 241, 0.4)',
                          borderRadius: '14px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.2s ease'
                        }}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleQrFileChange}
                            style={{ display: 'none' }}
                          />
                          <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(99, 102, 241, 0.15)',
                            color: '#818cf8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '10px'
                          }}>
                            <Upload size={22} />
                          </div>
                          <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>
                            Click to upload custom QR scanner image
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                            Supports PNG, JPG, JPEG, WEBP
                          </div>
                        </label>

                        {upiSettingsForm.upiQrCode && upiSettingsForm.upiQrCode !== '/upi-scanner.jpg' && (
                          <button
                            type="button"
                            onClick={() => {
                              setUpiSettingsForm(prev => ({ ...prev, upiQrCode: '/upi-scanner.jpg' }));
                              setUpiQrPreview('/upi-scanner.jpg');
                            }}
                            style={{
                              marginTop: '12px',
                              backgroundColor: 'rgba(239, 68, 68, 0.15)',
                              color: '#f87171',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              padding: '8px 14px',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <Trash2 size={14} /> Reset to Default QR Image
                          </button>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={upiSaving}
                        style={{
                          backgroundColor: '#6366f1',
                          color: '#ffffff',
                          border: 'none',
                          padding: '14px 24px',
                          borderRadius: '12px',
                          fontWeight: '800',
                          fontSize: '1rem',
                          cursor: upiSaving ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
                        }}
                      >
                        {upiSaving ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
                        <span>Save Payment Settings</span>
                      </button>
                    </form>

                    {/* Live Checkout Modal Preview Column */}
                    <div style={{
                      backgroundColor: '#0f172a',
                      padding: '24px',
                      borderRadius: '20px',
                      border: '1px solid #334155',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        fontSize: '0.85rem',
                        fontWeight: '800',
                        color: '#818cf8',
                        letterSpacing: '0.05em',
                        marginBottom: '16px',
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <Eye size={16} /> Buyer Checkout Modal Preview
                      </div>

                      <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '20px',
                        width: '100%',
                        maxWidth: '360px',
                        padding: '20px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        color: '#0f172a',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          fontSize: '0.9rem',
                          fontWeight: '800',
                          color: '#15803d',
                          marginBottom: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}>
                          <Sparkles size={16} /> Payment Section
                        </div>

                        <div style={{
                          backgroundColor: '#ffffff',
                          border: '1.5px solid #e5e7eb',
                          borderRadius: '16px',
                          padding: '16px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                        }}>
                          <div style={{
                            width: '180px',
                            margin: '0 auto 12px auto',
                            backgroundColor: '#ffffff',
                            borderRadius: '14px',
                            padding: '10px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                          }}>
                            <img
                              src={upiQrPreview || '/upi-scanner.jpg'}
                              alt="Live QR Scanner Preview"
                              style={{
                                width: '100%',
                                height: 'auto',
                                maxHeight: '180px',
                                objectFit: 'contain',
                                borderRadius: '10px',
                                display: 'block'
                              }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/upi-scanner.jpg';
                              }}
                            />
                            <div style={{
                              fontSize: '0.7rem',
                              fontWeight: '800',
                              color: '#15803d',
                              marginTop: '8px',
                              letterSpacing: '0.05em',
                              textTransform: 'uppercase'
                            }}>
                              SCAN TO PAY ₹99
                            </div>
                          </div>

                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: '#f8fafc',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.8rem'
                          }}>
                            <span style={{ color: '#475569', fontWeight: '600' }}>UPI ID:</span>
                            <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>
                              {upiSettingsForm.upiId || 'rithwik0000@fam'}
                            </strong>
                          </div>
                        </div>

                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '12px', fontStyle: 'italic' }}>
                          ✓ Live display update enabled for website buyers
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 4: SERVER XP CONTROL */}
              {mainTab === 'SERVERS' && (
                <>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    marginBottom: '24px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Server size={26} style={{ color: '#818cf8' }} />
                        Server XP & Member Control Panel
                      </h2>
                      <p style={{ fontSize: '0.83rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                        Inspect active server member XP details, level stats, level role rewards & edit member levels.
                      </p>
                    </div>

                    {/* Server Selector Dropdown */}
                    {guilds.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '700' }}>Select Server:</span>
                        <select
                          value={selectedGuildId}
                          onChange={(e) => setSelectedGuildId(e.target.value)}
                          style={{
                            padding: '10px 16px',
                            backgroundColor: '#0f172a',
                            border: '1.5px solid rgba(99, 102, 241, 0.4)',
                            borderRadius: '10px',
                            color: '#ffffff',
                            fontSize: '0.9rem',
                            fontWeight: '700',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          {guilds.map((g) => (
                            <option key={g.id} value={g.id}>
                              {g.name} {g.memberCount ? `(${g.memberCount} members)` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {guildsLoading ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                      <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px auto' }} />
                      <div>Loading Discord servers...</div>
                    </div>
                  ) : guilds.length === 0 ? (
                    <div style={{
                      padding: '48px 20px',
                      textAlign: 'center',
                      backgroundColor: '#0f172a',
                      borderRadius: '16px',
                      border: '1px dashed #334155',
                      color: '#94a3b8'
                    }}>
                      <Server size={36} color="#64748b" style={{ margin: '0 auto 12px auto' }} />
                      <div style={{ fontWeight: '700', fontSize: '1rem', color: '#f8fafc' }}>
                        No Discord Servers Found
                      </div>
                      <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                        Ensure the Discord Bot is connected and added to your server.
                      </div>
                    </div>
                  ) : selectedGuildId ? (
                    <AdminServerSettings guildId={selectedGuildId} initialTab="levels" />
                  ) : null}
                </>
              )}

              {/* TAB 5: CUSTOM VC & VOICE MANAGER */}
              {mainTab === 'CUSTOM_VC' && (
                <>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    marginBottom: '24px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Volume2 size={26} style={{ color: '#818cf8' }} />
                        Custom VC & Voice Manager Control Panel
                      </h2>
                      <p style={{ fontSize: '0.83rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                        Configure Join-to-Create hubs, manage active custom voice channels & send interactive Voice Manager control panels to Discord channels.
                      </p>
                    </div>

                    {/* Server Selector Dropdown */}
                    {guilds.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '700' }}>Select Server:</span>
                        <select
                          value={selectedGuildId}
                          onChange={(e) => setSelectedGuildId(e.target.value)}
                          style={{
                            padding: '10px 16px',
                            backgroundColor: '#0f172a',
                            color: '#f8fafc',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '10px',
                            fontSize: '0.88rem',
                            fontWeight: '700',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          {guilds.map((g) => (
                            <option key={g.id} value={g.id}>
                              {g.name} {g.memberCount ? `(${g.memberCount} members)` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {guildsLoading ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                      <Loader2 size={32} className="spin" style={{ color: '#6366f1', marginBottom: '12px' }} />
                      <div>Loading Servers...</div>
                    </div>
                  ) : guilds.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '48px 20px',
                      backgroundColor: '#0f172a',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      color: '#94a3b8'
                    }}>
                      <Volume2 size={36} color="#64748b" style={{ margin: '0 auto 12px auto' }} />
                      <div style={{ fontWeight: '700', fontSize: '1rem', color: '#f8fafc' }}>
                        No Discord Servers Found
                      </div>
                      <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                        Ensure the Discord Bot is connected and added to your server.
                      </div>
                    </div>
                  ) : selectedGuildId ? (
                    <AdminCustomVc guildId={selectedGuildId} />
                  ) : null}
                </>
              )}

              {/* TAB 6: SERVER CONTROL (?ban & ?kick, log channels & authorized staff) */}
              {mainTab === 'SERVER_CONTROL' && (
                <>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    marginBottom: '24px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <ShieldAlert size={26} style={{ color: '#ef4444' }} />
                        Server Control & Moderation Panel
                      </h2>
                      <p style={{ fontSize: '0.83rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                        Manage staff permissions for ?ban and ?kick commands, configure Discord log channels, and inspect moderation audit logs.
                      </p>
                    </div>

                    {/* Server Selector Dropdown */}
                    {guilds.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '700' }}>Select Server:</span>
                        <select
                          value={selectedGuildId}
                          onChange={(e) => setSelectedGuildId(e.target.value)}
                          style={{
                            padding: '10px 16px',
                            backgroundColor: '#0f172a',
                            color: '#f8fafc',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '10px',
                            fontSize: '0.88rem',
                            fontWeight: '700',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          {guilds.map((g) => (
                            <option key={g.id} value={g.id}>
                              {g.name} {g.memberCount ? `(${g.memberCount} members)` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {guildsLoading ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                      <Loader2 size={32} className="spin" style={{ color: '#ef4444', marginBottom: '12px' }} />
                      <div>Loading Servers...</div>
                    </div>
                  ) : guilds.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '48px 20px',
                      backgroundColor: '#0f172a',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      color: '#94a3b8'
                    }}>
                      <ShieldAlert size={36} color="#64748b" style={{ margin: '0 auto 12px auto' }} />
                      <div style={{ fontWeight: '700', fontSize: '1rem', color: '#f8fafc' }}>
                        No Discord Servers Found
                      </div>
                      <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                        Ensure the Discord Bot is connected and added to your server.
                      </div>
                    </div>
                  ) : selectedGuildId ? (
                    <AdminServerControl guildId={selectedGuildId} />
                  ) : null}
                </>
              )}

              {/* TAB 7: BOT COMMANDS & CHANNELS */}
              {mainTab === 'BOT_COMMANDS' && (
                <>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    marginBottom: '24px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Terminal size={26} style={{ color: '#ec4899' }} />
                        Bot Commands & Allowed Channels Control Panel
                      </h2>
                      <p style={{ fontSize: '0.83rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                        Customize prefix triggers for Love Test & XP commands and restrict command execution to specific Discord channels.
                      </p>
                    </div>

                    {/* Server Selector Dropdown */}
                    {guilds.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '700' }}>Select Server:</span>
                        <select
                          value={selectedGuildId}
                          onChange={(e) => setSelectedGuildId(e.target.value)}
                          style={{
                            padding: '10px 16px',
                            backgroundColor: '#0f172a',
                            color: '#f8fafc',
                            border: '1px solid rgba(236, 72, 153, 0.4)',
                            borderRadius: '10px',
                            fontSize: '0.88rem',
                            fontWeight: '700',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          {guilds.map((g) => (
                            <option key={g.id} value={g.id}>
                              {g.name} {g.memberCount ? `(${g.memberCount} members)` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {guildsLoading ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                      <Loader2 size={32} className="spin" style={{ color: '#ec4899', marginBottom: '12px' }} />
                      <div>Loading Servers...</div>
                    </div>
                  ) : guilds.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '48px 20px',
                      backgroundColor: '#0f172a',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      color: '#94a3b8'
                    }}>
                      <Terminal size={36} color="#64748b" style={{ margin: '0 auto 12px auto' }} />
                      <div style={{ fontWeight: '700', fontSize: '1rem', color: '#f8fafc' }}>
                        No Discord Servers Found
                      </div>
                      <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                        Ensure the Discord Bot is connected and added to your server.
                      </div>
                    </div>
                  ) : selectedGuildId ? (
                    <AdminServerSettings guildId={selectedGuildId} initialTab="commands" />
                  ) : null}
                </>
              )}

            </div>
          </main>
        </div>
      </div>

      {/* PACKAGE EDIT / CREATE MODAL */}
      {showPackageModal && (
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
          zIndex: 999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#1e293b',
            width: '100%',
            maxWidth: '540px',
            borderRadius: '20px',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
            padding: '24px 28px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={22} color="#818cf8" />
                {editingPackageId ? 'Edit Package Details' : 'Create New Premium Package'}
              </h3>
              <button
                onClick={() => setShowPackageModal(false)}
                style={{ backgroundColor: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePackage} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', fontWeight: '700', marginBottom: '6px' }}>
                  Package Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mythic Package, Godlike Package"
                  value={packageFormData.name}
                  onChange={(e) => setPackageFormData({ ...packageFormData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', fontWeight: '700', marginBottom: '6px' }}>
                    Price (₹ INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="29"
                    value={packageFormData.price}
                    onChange={(e) => setPackageFormData({ ...packageFormData, price: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', fontWeight: '700', marginBottom: '6px' }}>
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="30"
                    value={packageFormData.durationDays}
                    onChange={(e) => setPackageFormData({ ...packageFormData, durationDays: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', fontWeight: '700', marginBottom: '6px' }}>
                  Subtitle / Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Starter tier for custom role"
                  value={packageFormData.subtitle}
                  onChange={(e) => setPackageFormData({ ...packageFormData, subtitle: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', fontWeight: '700', marginBottom: '6px' }}>
                    Gem Icon Color
                  </label>
                  <select
                    value={packageFormData.iconType}
                    onChange={(e) => setPackageFormData({ ...packageFormData, iconType: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="purple">Purple Gem</option>
                    <option value="red">Red Gem</option>
                    <option value="green">Green Gem</option>
                    <option value="blue">Blue Gem</option>
                    <option value="gold">Gold Gem</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', fontWeight: '700', marginBottom: '6px' }}>
                    Popular Badge Text
                  </label>
                  <input
                    type="text"
                    placeholder="Most Popular"
                    value={packageFormData.popularTag}
                    onChange={(e) => setPackageFormData({ ...packageFormData, popularTag: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="isPopular"
                  checked={packageFormData.isPopular}
                  onChange={(e) => setPackageFormData({ ...packageFormData, isPopular: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#ef4444', cursor: 'pointer' }}
                />
                <label htmlFor="isPopular" style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: '600', cursor: 'pointer' }}>
                  Highlight with 'Popular' Tag Badge
                </label>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', fontWeight: '700', marginBottom: '6px' }}>
                  Package Features List (1 feature per line)
                </label>
                <textarea
                  rows={5}
                  placeholder={'🎨 Custom Role (Auto-created)\n🔊 Soundboard Access\n📝 Nickname Change\n📊 40% Extra XP\n⏳ 30 Days Access'}
                  value={packageFormData.featuresText}
                  onChange={(e) => setPackageFormData({ ...packageFormData, featuresText: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'monospace'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowPackageModal(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#cbd5e1',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={packageSaving}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '10px',
                    backgroundColor: '#6366f1',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    cursor: packageSaving ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
                  }}
                >
                  {packageSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  <span>{editingPackageId ? 'Update Package' : 'Create Package'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PAYMENT SCREENSHOT PROOF LIGHTBOX MODAL */}
      {previewScreenshot && (
        <div
          onClick={() => setPreviewScreenshot(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#1e293b',
              borderRadius: '20px',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              padding: '20px',
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
              position: 'relative'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              marginBottom: '14px',
              paddingBottom: '10px',
              borderBottom: '1px solid rgba(255,255,255,0.08)'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ImageIcon size={20} color="#818cf8" />
                Payment Proof Screenshot
              </h3>
              <button
                onClick={() => setPreviewScreenshot(null)}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}
              >
                ✕
              </button>
            </div>

            <img
              src={previewScreenshot}
              alt="Payment Proof Full"
              style={{
                maxWidth: '100%',
                maxHeight: '75vh',
                objectFit: 'contain',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
}
