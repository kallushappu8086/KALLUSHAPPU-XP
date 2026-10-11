import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Search,
  Sparkles,
  Loader2,
  AlertCircle,
  CreditCard,
  QrCode,
  Tag,
  Palette,
  Calendar,
  Check,
  Trash2,
  RotateCcw
} from 'lucide-react';

export default function AdminPackageModal({ onClose }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState('PENDING'); // 'ALL', 'PENDING', 'VERIFIED', 'REJECTED'
  const [processingId, setProcessingId] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAdminPayments();
      if (Array.isArray(data)) {
        setPayments(data);
      } else {
        setPayments([]);
      }
    } catch (err) {
      console.error('Failed to fetch admin payments:', err);
      setError('Failed to load payment purchases: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, username) => {
    setProcessingId(id);
    setActionSuccess('');
    try {
      await api.verifyPayment(id);
      setActionSuccess(`Payment for @${username} was successfully verified & accepted!`);
      setTimeout(() => setActionSuccess(''), 4000);
      fetchPayments();
    } catch (err) {
      alert('Failed to verify payment: ' + (err.message || 'Unknown error'));
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id, username) => {
    if (!window.confirm(`Are you sure you want to REJECT the payment request for @${username}?`)) {
      return;
    }
    setProcessingId(id);
    setActionSuccess('');
    try {
      await api.rejectPayment(id);
      setActionSuccess(`Payment for @${username} was marked as rejected.`);
      setTimeout(() => setActionSuccess(''), 4000);
      fetchPayments();
    } catch (err) {
      alert('Failed to reject payment: ' + (err.message || 'Unknown error'));
    } finally {
      setProcessingId(null);
    }
  };

  const handleUnverify = async (id, username) => {
    if (!window.confirm(`Are you sure you want to UNVERIFY the payment for @${username}?\n\nThis will automatically revoke and remove all package features and Discord roles assigned to this user, and move the order back to Pending.`)) {
      return;
    }
    setProcessingId(id);
    setActionSuccess('');
    try {
      await api.unverifyPayment(id);
      setActionSuccess(`Payment for @${username} was unverified! Package features and Discord roles were automatically revoked.`);
      setTimeout(() => setActionSuccess(''), 4000);
      fetchPayments();
    } catch (err) {
      alert('Failed to unverify payment: ' + (err.message || 'Unknown error'));
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Are you sure you want to DELETE the purchase order for @${username}?\n\nThis will automatically revoke and remove all package features and Discord roles assigned to this user.`)) {
      return;
    }
    setProcessingId(id);
    setActionSuccess('');
    try {
      await api.deletePayment(id);
      setActionSuccess(`Order for @${username} deleted! Associated features and Discord roles were automatically revoked.`);
      setTimeout(() => setActionSuccess(''), 4000);
      fetchPayments();
    } catch (err) {
      alert('Failed to delete order: ' + (err.message || 'Unknown error'));
    } finally {
      setProcessingId(null);
    }
  };

  // Filtered Payments
  const filteredPayments = payments.filter((p) => {
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

  // Calculate stats
  const totalCount = payments.length;
  const pendingCount = payments.filter((p) => p.paymentStatus === 'PENDING').length;
  const verifiedCount = payments.filter((p) => p.paymentStatus === 'VERIFIED').length;
  const rejectedCount = payments.filter((p) => p.paymentStatus === 'REJECTED').length;
  const totalRevenue = payments
    .filter((p) => p.paymentStatus === 'VERIFIED')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '920px',
        maxHeight: '90vh',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        animation: 'modalFadeIn 0.25s ease-out'
      }}>

        {/* Modal Header */}
        <div style={{
          padding: '20px 28px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)'
            }}>
              <ShieldCheck size={26} color="#ffffff" />
            </div>
            <div>
              <div style={{
                fontWeight: '800',
                fontSize: '1.25rem',
                fontFamily: "'Outfit', sans-serif",
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span>Admin Package Verification</span>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: '#fef08a',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  letterSpacing: '0.04em'
                }}>
                  🔒 SECRET SHORTCUT MODE
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                Verify UPI/Card payment references and accept custom role activation
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={fetchPayments}
              title="Refresh Payments List"
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#ffffff',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
            </button>

            <button
              onClick={onClose}
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#ffffff',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Metrics Banner */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          padding: '16px 28px',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div style={{ backgroundColor: '#ffffff', padding: '10px 14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>TOTAL SUBMITTED</div>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a' }}>{totalCount}</div>
          </div>

          <div style={{ backgroundColor: '#fffbeb', padding: '10px 14px', borderRadius: '12px', border: '1px solid #fde68a' }}>
            <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: '600' }}>PENDING APPROVAL</div>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#d97706' }}>{pendingCount}</div>
          </div>

          <div style={{ backgroundColor: '#f0fdf4', padding: '10px 14px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: '600' }}>VERIFIED & DONE</div>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#16a34a' }}>{verifiedCount}</div>
          </div>

          <div style={{ backgroundColor: '#fef2f2', padding: '10px 14px', borderRadius: '12px', border: '1px solid #fca5a5' }}>
            <div style={{ fontSize: '0.75rem', color: '#b91c1c', fontWeight: '600' }}>REJECTED</div>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#dc2626' }}>{rejectedCount}</div>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '10px 14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>TOTAL REVENUE</div>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#15803d' }}>₹{totalRevenue}</div>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div style={{
          padding: '16px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #f1f5f9'
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
            {[
              { id: 'PENDING', label: `Pending (${pendingCount})` },
              { id: 'VERIFIED', label: `Verified (${verifiedCount})` },
              { id: 'REJECTED', label: `Rejected (${rejectedCount})` },
              { id: 'ALL', label: `All (${totalCount})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: filterTab === tab.id ? '#ffffff' : 'transparent',
                  color: filterTab === tab.id ? '#0f172a' : '#64748b',
                  boxShadow: filterTab === tab.id ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search user, ref ID, plan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Success Alert */}
        {actionSuccess && (
          <div style={{
            margin: '12px 28px 0 28px',
            padding: '10px 16px',
            backgroundColor: '#dcfce7',
            border: '1px solid #86efac',
            borderRadius: '10px',
            color: '#15803d',
            fontSize: '0.88rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={18} />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Modal Body Content */}
        <div style={{ padding: '20px 28px', flex: 1, overflowY: 'auto' }}>
          {error && (
            <div style={{
              padding: '14px 18px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: '12px',
              color: '#dc2626',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px'
            }}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px auto' }} />
              <div>Loading package purchases...</div>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div style={{
              padding: '48px 20px',
              textAlign: 'center',
              backgroundColor: '#f8fafc',
              borderRadius: '16px',
              border: '1px dashed #cbd5e1',
              color: '#64748b'
            }}>
              <Sparkles size={36} color="#94a3b8" style={{ margin: '0 auto 12px auto' }} />
              <div style={{ fontWeight: '700', fontSize: '1rem', color: '#334155' }}>
                No package purchase requests found
              </div>
              <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                {search ? 'Try clearing your search filters.' : `No purchases found under '${filterTab}' tab.`}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredPayments.map((p) => {
                const isPending = p.paymentStatus === 'PENDING';
                const isVerified = p.paymentStatus === 'VERIFIED';
                const isRejected = p.paymentStatus === 'REJECTED';
                const isItemProcessing = processingId === p._id;

                return (
                  <div
                    key={p._id}
                    style={{
                      padding: '18px 20px',
                      borderRadius: '16px',
                      backgroundColor: isPending ? '#fffdf5' : '#ffffff',
                      border: isPending ? '1.5px solid #f59e0b' : '1px solid #e2e8f0',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    {/* Top Card Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>

                      {/* User Info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          backgroundColor: '#15803d',
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
                          <div style={{ fontWeight: '700', fontSize: '1.02rem', color: '#0f172a' }}>
                            @{p.username}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                            User ID: {p.userId}
                          </div>
                        </div>
                      </div>

                      {/* Package Pill & Status */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          backgroundColor: '#f1f5f9',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          fontWeight: '800',
                          color: '#15803d',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <Tag size={14} />
                          <span>{p.planName} • ₹{p.amount}</span>
                        </div>

                        {/* Status Badge */}
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.78rem',
                          fontWeight: '800',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          backgroundColor: isVerified ? '#dcfce7' : isPending ? '#fef3c7' : '#fef2f2',
                          color: isVerified ? '#15803d' : isPending ? '#b45309' : '#dc2626'
                        }}>
                          {isVerified && <CheckCircle2 size={13} />}
                          {isPending && <Clock size={13} />}
                          {isRejected && <XCircle size={13} />}
                          <span>{isVerified ? 'VERIFIED & APPROVED' : isPending ? 'PENDING VERIFICATION' : 'REJECTED'}</span>
                        </span>
                      </div>
                    </div>

                    {/* Transaction Details & Server Info */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '10px',
                      backgroundColor: '#f8fafc',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      fontSize: '0.83rem',
                      color: '#475569'
                    }}>
                      <div>
                        <span style={{ color: '#94a3b8' }}>Ref / UTR ID:</span>{' '}
                        <strong style={{ fontFamily: 'monospace', color: '#0f172a' }}>{p.paymentId}</strong>
                      </div>

                      <div>
                        <span style={{ color: '#94a3b8' }}>Payment Method:</span>{' '}
                        <strong style={{ textTransform: 'uppercase', color: '#0f172a' }}>{p.paymentMethod || 'UPI'}</strong>
                      </div>

                      <div>
                        <span style={{ color: '#94a3b8' }}>Target Server:</span>{' '}
                        <strong style={{ color: '#0f172a' }}>{p.guildName || 'Official Server'}</strong>
                      </div>

                      <div>
                        <span style={{ color: '#94a3b8' }}>Submitted:</span>{' '}
                        <strong>{new Date(p.createdAt).toLocaleDateString()}</strong>
                      </div>
                    </div>

                    {/* Custom Role Preview (If set by customer) */}
                    {p.roleName && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                        <span style={{ color: '#64748b', fontWeight: '600' }}>Custom Role:</span>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          backgroundColor: '#f1f5f9',
                          border: '1px solid #e2e8f0'
                        }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: p.roleColor || '#a855f7' }} />
                          <strong style={{ color: p.roleColor || '#a855f7' }}>{p.roleName}</strong>
                        </div>
                      </div>
                    )}

                    {/* Card Actions Footer */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: '10px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {isPending && (
                          <>
                            <button
                              disabled={isItemProcessing}
                              onClick={() => handleReject(p._id, p.username)}
                              style={{
                                backgroundColor: '#fef2f2',
                                color: '#dc2626',
                                border: '1px solid #fca5a5',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                fontSize: '0.82rem',
                                fontWeight: '700',
                                cursor: isItemProcessing ? 'not-allowed' : 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <XCircle size={15} />
                              <span>Reject</span>
                            </button>

                            <button
                              disabled={isItemProcessing}
                              onClick={() => handleVerify(p._id, p.username)}
                              style={{
                                backgroundColor: '#15803d',
                                color: '#ffffff',
                                border: 'none',
                                padding: '8px 20px',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                fontWeight: '700',
                                cursor: isItemProcessing ? 'not-allowed' : 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                boxShadow: '0 3px 10px rgba(21, 128, 61, 0.3)',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              {isItemProcessing ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <CheckCircle2 size={16} />
                              )}
                              <span>Verify & Accept Package</span>
                            </button>
                          </>
                        )}

                        {isVerified && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Check size={16} /> Accepted & Role Active in Discord Server
                            </div>

                            <button
                              disabled={isItemProcessing}
                              onClick={() => handleUnverify(p._id, p.username)}
                              style={{
                                backgroundColor: '#fff7ed',
                                color: '#c2410c',
                                border: '1px solid #ffedd5',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                cursor: isItemProcessing ? 'not-allowed' : 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.15s ease'
                              }}
                              title="Unverify this package order and automatically remove all assigned features & roles"
                            >
                              <RotateCcw size={14} />
                              <span>Unverify Order</span>
                            </button>
                          </div>
                        )}

                        {isRejected && (
                          <div style={{ fontSize: '0.8rem', color: '#dc2626', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <XCircle size={16} /> Purchase Rejected by Admin
                          </div>
                        )}
                      </div>

                      {/* Delete Order Action Button (Available for all orders) */}
                      <button
                        disabled={isItemProcessing}
                        onClick={() => handleDelete(p._id, p.username)}
                        style={{
                          backgroundColor: '#fff1f2',
                          color: '#e11d48',
                          border: '1px solid #fecdd3',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontWeight: '700',
                          cursor: isItemProcessing ? 'not-allowed' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.15s ease'
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

        </div>
      </div>
    </div>
  );
}
