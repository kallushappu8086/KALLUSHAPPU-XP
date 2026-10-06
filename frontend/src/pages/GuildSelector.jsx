import { useState, useEffect } from 'react';
import { LogOut, ShieldCheck, CheckCircle2, Bot, ExternalLink, Sparkles, Award, Palette, Clock, Check, Edit3, Lock, AlertCircle } from 'lucide-react';
import { api } from '../utils/api';
import PaymentRoleModal from '../components/PaymentRoleModal';
import AdminPackageModal from '../components/AdminPackageModal';

const PRESET_COLORS = [
  '#ff0055', '#a855f7', '#3b82f6', '#06b6d4', 
  '#10b981', '#84cc16', '#eab308', '#f97316', 
  '#ef4444', '#ec4899', '#6366f1', '#14b8a6'
];


export default function GuildSelector({ user, onLogout }) {
  const discordClientId = import.meta.env.VITE_DISCORD_CLIENT_ID || '1548727060653023413';
  const botInviteUrl = `https://discord.com/oauth2/authorize?client_id=${discordClientId}&permissions=8&scope=bot%20applications.commands`;

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [myRoles, setMyRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('#a855f7');
  const [updating, setUpdating] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const [packages, setPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(true);

  useEffect(() => {
    fetchMyRoles();
    fetchPackages();
  }, []);

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

  // Admin Package Modal can be accessed via Admin Panel


  const fetchMyRoles = async () => {
    setLoadingRoles(true);
    try {
      const data = await api.getMyPurchasedRoles();
      if (Array.isArray(data)) {
        setMyRoles(data);
      }
    } catch (err) {
      console.error('Failed to fetch user roles:', err);
    } finally {
      setLoadingRoles(false);
    }
  };

  const handleSelectPackage = (name, price) => {
    const activeRole = myRoles.find(r => 
      (r.paymentStatus === 'PENDING' || r.paymentStatus === 'VERIFIED') && 
      r.status !== 'EXPIRED' && 
      new Date(r.expiresAt) > new Date()
    );

    if (activeRole) {
      const expiryStr = activeRole.expiresAt ? new Date(activeRole.expiresAt).toLocaleDateString() : '30 days';
      alert(`You already have an active premium package (${activeRole.planName}). At a time you can only take 1 premium package. You can purchase another package after your current subscription expires on ${expiryStr} or is deleted by an admin.`);
      return;
    }

    setSelectedPlan({ name, price });
  };

  const handleEditRole = (role) => {
    const isCustomized = Boolean(role.isCustomized || (role.roleName && role.roleName.trim()));
    if (isCustomized) {
      const expiryStr = role.expiresAt ? new Date(role.expiresAt).toLocaleDateString() : '1 month';
      alert(`Role customization is limited to 1 time per premium package.\n\nYour role "${role.roleName}" has already been configured for this 1-month subscription. You will be able to customize a new role when purchasing a new premium package after expiration on ${expiryStr}.`);
      return;
    }
    setEditingRole(role);
    setEditName(role.roleName || `${role.planName.replace(' Package', '')} VIP`);
    setEditColor(role.roleColor || '#a855f7');
  };

  const handleSaveRoleEdit = async () => {
    if (!editingRole) return;
    if (!editName.trim()) {
      alert('Role name cannot be empty.');
      return;
    }

    const isCustomized = Boolean(editingRole.isCustomized || (editingRole.roleName && editingRole.roleName.trim()));
    if (isCustomized) {
      alert('This role has already been customized. Customization is permitted only 1 time per package.');
      setEditingRole(null);
      return;
    }

    const confirmed = window.confirm(
      `⚠️ IMPORTANT: 1-Time Role Customization\n\nRole Name: ${editName.trim()}\nRole Colour: ${editColor}\n\nYou can only customize your role ONCE per 1-month premium package. Once saved, it will be locked and cannot be edited again until you purchase a new package after 1 month.\n\nDo you want to proceed and issue this role?`
    );
    if (!confirmed) return;

    setUpdating(true);
    try {
      await api.customizeRole(editingRole._id, {
        roleName: editName.trim(),
        roleColor: editColor
      });
      setEditingRole(null);
      fetchMyRoles();
    } catch (err) {
      alert('Failed to save role settings: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };


  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f4eb',
      color: '#1f2937',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '24px 20px 60px 20px',
      fontFamily: "'Inter', sans-serif",
      boxSizing: 'border-box'
    }}>
      
      {/* Top Header Bar */}
      <header style={{
        maxWidth: '1100px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        marginBottom: '32px'
      }}>
        {/* User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {user.avatar ? (
            <img 
              src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} 
              alt={user.username}
              style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid #16a34a' }}
            />
          ) : (
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: '#15803d',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '1rem'
            }}>
              {user.username ? user.username.substring(0, 2).toUpperCase() : 'DS'}
            </div>
          )}
          <div>
            <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>@{user.username}</span>
              <span style={{
                backgroundColor: '#dcfce7',
                color: '#15803d',
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <ShieldCheck size={12} /> Connected
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>ID: {user.id}</div>
          </div>
        </div>

        {/* Brand Logo & Logout */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{
            fontSize: '1.3rem',
            fontWeight: '800',
            color: '#15803d',
            fontFamily: "'Outfit', 'Noto Sans Malayalam', sans-serif"
          }}>
            കള്ള് ഷാപ്പ്
          </span>

          <button 
            onClick={onLogout} 
            style={{
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#dc2626',
              backgroundColor: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background-color 0.2s ease'
            }}
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1100px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Success Banner */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '18px 24px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
          border: '1px solid rgba(0,0,0,0.06)',
          marginBottom: '36px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#15803d' }}>
                Discord Account Authorized!
              </div>
              <div style={{ fontSize: '0.88rem', color: '#4b5563' }}>
                Select a premium package below to create & get your automatic custom role for <strong>@{user.username}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIVE CUSTOM ROLES SECTION (If user has purchases) */}
        {myRoles.length > 0 && (
          <div style={{
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '36px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,0,0,0.08)'
          }}>
            <h3 style={{
              margin: '0 0 16px 0',
              fontSize: '1.25rem',
              fontWeight: '800',
              color: '#15803d',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Sparkles size={20} color="#15803d" />
              Your Custom Role Purchases
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
              {myRoles.map((role) => {
                const isPendingVerification = role.paymentStatus === 'PENDING';
                const isRejected = role.paymentStatus === 'REJECTED';
                const isVerified = role.paymentStatus === 'VERIFIED';
                const hasRoleConfigured = isVerified && Boolean(role.isCustomized || (role.roleName && role.roleName.trim()));

                return (
                  <div
                    key={role._id}
                    style={{
                      padding: '18px',
                      borderRadius: '14px',
                      border: isPendingVerification ? '1px dashed #d97706' : '1px solid #e5e7eb',
                      backgroundColor: isPendingVerification ? '#fffbeb' : '#fafafa',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '14px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {hasRoleConfigured ? (
                          <>
                            <div style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              backgroundColor: role.roleColor,
                              boxShadow: `0 0 8px ${role.roleColor}88`
                            }} />
                            <strong style={{ fontSize: '1.05rem', color: role.roleColor }}>
                              {role.roleName}
                            </strong>
                          </>
                        ) : (
                          <strong style={{ fontSize: '1.05rem', color: '#111827' }}>
                            {role.planName}
                          </strong>
                        )}
                      </div>

                      {isVerified && (
                        !hasRoleConfigured ? (
                          <button
                            onClick={() => handleEditRole(role)}
                            style={{
                              backgroundColor: '#15803d',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '7px 14px',
                              fontSize: '0.82rem',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 2px 8px rgba(21, 128, 61, 0.25)'
                            }}
                          >
                            <Palette size={14} /> Set Custom Role & Colour
                          </button>
                        ) : (
                          <div
                            style={{
                              backgroundColor: '#f3f4f6',
                              color: '#6b7280',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              padding: '6px 12px',
                              fontSize: '0.78rem',
                              fontWeight: '700',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              cursor: 'not-allowed',
                              userSelect: 'none'
                            }}
                            title="Role customization is limited to 1 time per package. Role can be customized again after purchasing a new package upon expiry."
                          >
                            <Lock size={13} color="#9ca3af" /> Role Configured (Locked)
                          </div>
                        )
                      )}
                    </div>

                    <div style={{ fontSize: '0.85rem', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div>Server: <strong>{role.guildName}</strong></div>
                      <div style={{ fontSize: '0.78rem', color: '#6b7280', fontFamily: 'monospace' }}>Ref: {role.paymentId}</div>
                    </div>

                    {/* Status Banner */}
                    {isPendingVerification && (
                      <div style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        backgroundColor: '#fef3c7',
                        color: '#b45309',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <Clock size={15} /> Payment Pending Admin Verification
                      </div>
                    )}

                    {isRejected && (
                      <div style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        backgroundColor: '#fef2f2',
                        color: '#dc2626',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        ❌ Payment Rejected by Admin
                      </div>
                    )}

                    {isVerified && !hasRoleConfigured && (
                      <div style={{
                        padding: '9px 12px',
                        borderRadius: '8px',
                        backgroundColor: '#dcfce7',
                        color: '#15803d',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <Sparkles size={15} /> Payment Verified! Click "Set Custom Role & Colour" (1-time customization).
                      </div>
                    )}

                    {isVerified && hasRoleConfigured && (
                      <div style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: '#64748b',
                        fontSize: '0.78rem',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <Lock size={13} color="#94a3b8" /> 1-time customization completed. Editable on next package renewal after 1 month.
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', borderTop: '1px solid #e5e7eb', paddingTop: '10px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontWeight: '700',
                        fontSize: '0.75rem',
                        backgroundColor: isVerified ? (role.status === 'ASSIGNED' ? '#dcfce7' : '#fef3c7') : '#f3f4f6',
                        color: isVerified ? (role.status === 'ASSIGNED' ? '#15803d' : '#d97706') : '#6b7280'
                      }}>
                        {isVerified 
                          ? (role.status === 'ASSIGNED' ? 'ROLE ASSIGNED IN SERVER' : 'WAITING FOR USER TO JOIN SERVER')
                          : (isPendingVerification ? 'AWAITING VERIFICATION' : 'REJECTED')
                        }
                      </span>

                      <span style={{ color: '#6b7280' }}>
                        Expires: {new Date(role.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dynamic Premium Feature Packages Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          gap: '24px',
          width: '100%',
          alignItems: 'stretch'
        }}>
          {packagesLoading ? (
            <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', color: '#6b7280', fontSize: '1rem', fontWeight: '600' }}>
              Loading available premium packages...
            </div>
          ) : packages.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#6b7280', fontSize: '1rem' }}>
              No premium packages currently available.
            </div>
          ) : (
            packages.map((pkg) => {
              const iconColor = pkg.iconType === 'red' ? '#ef4444' : pkg.iconType === 'green' ? '#10b981' : pkg.iconType === 'gold' ? '#eab308' : pkg.iconType === 'blue' ? '#3b82f6' : '#a855f7';
              const iconBg = pkg.iconType === 'red' ? '#fee2e2' : pkg.iconType === 'green' ? '#dcfce7' : pkg.iconType === 'gold' ? '#fef3c7' : pkg.iconType === 'blue' ? '#dbeafe' : '#f3e8ff';

              return (
                <div key={pkg._id || pkg.name} style={{
                  backgroundColor: pkg.isPopular ? '#fbfbf6' : '#ffffff',
                  borderRadius: '20px',
                  padding: pkg.isPopular ? '40px 28px 36px 28px' : '36px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  boxShadow: pkg.isPopular ? '0 10px 30px rgba(74, 124, 62, 0.15)' : '0 6px 24px rgba(0, 0, 0, 0.04)',
                  border: pkg.isPopular ? '2px solid #5a8a47' : '1px solid rgba(0, 0, 0, 0.08)',
                  position: 'relative',
                  transform: pkg.isPopular ? 'scale(1.02)' : 'none',
                  zIndex: pkg.isPopular ? 2 : 1
                }}>
                  {pkg.isPopular && (
                    <div style={{
                      position: 'absolute',
                      top: '-16px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#4a7c3e',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      padding: '6px 20px',
                      borderRadius: '20px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(74, 124, 62, 0.3)'
                    }}>
                      <Award size={14} />
                      <span>{pkg.popularTag || 'Most Popular'}</span>
                    </div>
                  )}

                  {/* Gem Icon */}
                  <div style={{
                    width: '76px',
                    height: '76px',
                    borderRadius: '50%',
                    backgroundColor: iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    boxShadow: `0 8px 20px ${iconColor}30`
                  }}>
                    <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 12L12 22L22 12L12 2Z" fill={iconColor} stroke="#ffffff" strokeWidth="1.5" />
                      <path d="M12 2L6 12L12 22L18 12L12 2Z" fill="#ffffff" opacity="0.4" />
                    </svg>
                  </div>

                  <h3 style={{
                    fontSize: '1.6rem',
                    fontWeight: '800',
                    color: '#1c4f26',
                    marginBottom: '6px',
                    fontFamily: "'Outfit', sans-serif"
                  }}>
                    {pkg.name}
                  </h3>

                  <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '20px', minHeight: '40px' }}>
                    {pkg.subtitle || 'Essential features to get started'}
                  </p>

                  <div style={{ marginBottom: '24px' }}>
                    <span style={{ fontSize: '2.4rem', fontWeight: '900', color: '#15803d' }}>₹{pkg.price}</span>
                    <span style={{ fontSize: '1rem', color: '#6b7280', fontWeight: '500' }}>/{pkg.durationDays || 30} Days</span>
                  </div>

                  {/* Features Checklist */}
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 32px 0',
                    textAlign: 'left',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    flex: 1
                  }}>
                    {(pkg.features || []).map((feat, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', color: '#374151' }}>
                        <CheckCircle2 size={18} color="#4a7c3e" style={{ flexShrink: 0 }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSelectPackage(pkg.name, pkg.price)}
                    style={{
                      width: '100%',
                      backgroundColor: pkg.isPopular ? '#4a7c3e' : '#15803d',
                      color: '#ffffff',
                      border: 'none',
                      padding: '14px 20px',
                      borderRadius: '12px',
                      fontWeight: '700',
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: pkg.isPopular ? '0 4px 16px rgba(74, 124, 62, 0.35)' : '0 4px 14px rgba(21, 128, 61, 0.2)'
                    }}
                  >
                    Get {pkg.name}
                  </button>
                </div>
              );
            })
          )}
        </div>

      </main>

      {/* Payment & Role Modal */}
      {selectedPlan && (
        <PaymentRoleModal
          plan={selectedPlan}
          user={user}
          onClose={() => setSelectedPlan(null)}
          onSuccess={() => {
            fetchMyRoles();
          }}
        />
      )}

      {/* Setup / Edit Role Modal */}
      {editingRole && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '28px',
            width: '100%',
            maxWidth: '460px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            border: '1px solid rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.3rem', fontWeight: '800', color: '#111827' }}>
              Set Custom Role & Colour
            </h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: '#6b7280' }}>
              Configure your role for <strong>{editingRole.guildName}</strong>
            </p>

            {/* 1-Time Rule Notice */}
            <div style={{
              padding: '12px 14px',
              borderRadius: '10px',
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              color: '#92400e',
              fontSize: '0.82rem',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              lineHeight: '1.4'
            }}>
              <AlertCircle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>1-Time Customization Rule:</strong> You can only customize this role <strong>1 time</strong> for this 1-month premium package. Once saved, it will be locked and cannot be edited again until you purchase a new package after 1 month.
              </div>
            </div>

            {/* Live Discord Badge Preview */}
            <div style={{
              padding: '16px',
              backgroundColor: '#2f3136',
              borderRadius: '14px',
              color: '#ffffff',
              marginBottom: '20px',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
            }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#96989d', marginBottom: '8px' }}>
                Live Discord Preview
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {user.avatar ? (
                  <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                ) : (
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#5865F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    {user.username ? user.username.substring(0, 2).toUpperCase() : 'DS'}
                  </div>
                )}
                <div style={{ fontWeight: '600', fontSize: '0.95rem', color: editColor }}>
                  {user.username}
                </div>
                <span style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: editColor,
                  border: `1px solid ${editColor}`,
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}>
                  {editName || 'Role Name'}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
                Role Name:
              </label>
              <input
                type="text"
                maxLength={32}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="e.g. 🔥 VIP Legend"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
                Role Colour:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <input
                  type="color"
                  value={editColor}
                  onChange={(e) => setEditColor(e.target.value)}
                  style={{ width: '42px', height: '42px', borderRadius: '8px', border: 'none', cursor: 'pointer', padding: 0 }}
                />
                <input
                  type="text"
                  value={editColor}
                  onChange={(e) => setEditColor(e.target.value)}
                  placeholder="#a855f7"
                  style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontFamily: 'monospace', fontWeight: '700' }}
                />
              </div>

              {/* Preset Colors Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
                {PRESET_COLORS.map(c => (
                  <div
                    key={c}
                    onClick={() => setEditColor(c)}
                    style={{
                      height: '30px',
                      borderRadius: '8px',
                      backgroundColor: c,
                      cursor: 'pointer',
                      border: editColor.toLowerCase() === c.toLowerCase() ? '3px solid #111827' : '1px solid rgba(0,0,0,0.1)',
                      boxShadow: editColor.toLowerCase() === c.toLowerCase() ? '0 0 0 2px #ffffff' : 'none',
                      transition: 'transform 0.15s ease'
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setEditingRole(null)}
                style={{
                  padding: '12px 20px',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  backgroundColor: '#ffffff',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Cancel
              </button>
              <button
                disabled={updating}
                onClick={handleSaveRoleEdit}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#15803d',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  cursor: updating ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(21, 128, 61, 0.3)'
                }}
              >
                {updating ? 'Saving...' : 'Save & Issue Role (1-Time)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Secret Admin Verification Modal */}
      {showAdminModal && (
        <AdminPackageModal
          onClose={() => {
            setShowAdminModal(false);
            fetchMyRoles();
          }}
        />
      )}

      {/* Footer */}
      <footer style={{
        marginTop: '60px',
        color: '#6b7280',
        fontSize: '0.85rem',
        textAlign: 'center'
      }}>
        © 2026 <strong>കള്ള് ഷാപ്പ്</strong> Discord Bot. All rights reserved.
      </footer>
    </div>
  );
}

