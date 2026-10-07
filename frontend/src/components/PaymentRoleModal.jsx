import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { 
  X, 
  ShieldCheck, 
  Sparkles, 
  QrCode, 
  CreditCard, 
  Check, 
  Copy,
  AlertCircle,
  Loader2,
  Clock,
  Upload,
  Image as ImageIcon,
  Trash2,
  CheckCircle2
} from 'lucide-react';

export default function PaymentRoleModal({ plan, user, onClose, onSuccess }) {
  const [step, setStep] = useState(1); // 1: Payment Section, 2: Submitted / Awaiting Verification
  
  // Dynamic Payment & UPI Settings
  const [upiSettings, setUpiSettings] = useState({
    upiId: 'rithwik0000@fam',
    upiQrCode: '/upi-scanner.jpg'
  });
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Payment Details
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' or 'card'
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [screenshotFileName, setScreenshotFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [purchaseResult, setPurchaseResult] = useState(null);

  useEffect(() => {
    fetchUpiSettings();
  }, []);

  const fetchUpiSettings = async () => {
    try {
      const data = await api.getPaymentSettings();
      if (data && (data.upiId || data.upiQrCode)) {
        setUpiSettings({
          upiId: data.upiId || 'rithwik0000@fam',
          upiQrCode: data.upiQrCode || '/upi-scanner.jpg'
        });
      }
    } catch (err) {
      console.error('Failed to load payment UPI settings:', err);
    }
  };

  const handleCopyUpi = () => {
    if (upiSettings.upiId) {
      navigator.clipboard.writeText(upiSettings.upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress / resize image to max 1200px dimension for fast network submission
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
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

        setPaymentScreenshot(compressedDataUrl);
        setScreenshotFileName(file.name);
        setErrorMessage('');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveScreenshot = () => {
    setPaymentScreenshot(null);
    setScreenshotFileName('');
  };

  const handleProcessPayment = async () => {
    if (!utrNumber.trim()) {
      setErrorMessage('Please enter your Transaction ID / UTR Number.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');
    try {
      const res = await api.processRolePurchase({
        planName: plan.name,
        amount: plan.price,
        paymentMethod,
        transactionRef: utrNumber.trim(),
        paymentScreenshot: paymentScreenshot || ''
      });

      setPurchaseResult(res);
      setStep(2);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Payment error:', err);
      setErrorMessage(err.message || 'Payment submission failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '560px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh',
        animation: 'modalFadeIn 0.25s ease-out'
      }}>

        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={22} color="#fef08a" />
            <div>
              <div style={{ fontWeight: '800', fontSize: '1.2rem', fontFamily: "'Outfit', sans-serif" }}>
                {plan.name} Payment Checkout
              </div>
              <div style={{ fontSize: '0.82rem', opacity: 0.9 }}>
                Premium Access • ₹{plan.price} / 30 Days
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Bar / Step Indicators */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          fontSize: '0.82rem',
          fontWeight: '600'
        }}>
          {[
            { id: 1, label: '1. Payment Section' },
            { id: 2, label: '2. Admin Verification' }
          ].map(s => (
            <div 
              key={s.id} 
              style={{
                flex: 1,
                padding: '12px 6px',
                textAlign: 'center',
                color: step === s.id ? '#15803d' : step > s.id ? '#16a34a' : '#9ca3af',
                borderBottom: step === s.id ? '2px solid #15803d' : 'none',
                backgroundColor: step === s.id ? '#ffffff' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              {step > s.id ? <Check size={14} color="#16a34a" /> : null}
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Modal Body Content */}
        <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
          
          {errorMessage && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: '12px',
              color: '#dc2626',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: PAYMENT SECTION */}
          {step === 1 && (
            <div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: '700', color: '#111827' }}>
                Payment Details & Proof Upload
              </h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: '#6b7280' }}>
                Complete your payment, enter your Transaction ID, and upload a screenshot of your payment receipt for instant Admin Verification.
              </p>

              {/* Order Summary Box */}
              <div style={{
                padding: '14px 18px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.88rem' }}>
                  <span style={{ color: '#64748b' }}>Selected Package:</span>
                  <strong style={{ color: '#0f172a' }}>{plan.name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #cbd5e1', paddingTop: '8px', marginTop: '8px', fontSize: '1rem' }}>
                  <span style={{ fontWeight: '700', color: '#0f172a' }}>Total Amount:</span>
                  <strong style={{ color: '#15803d', fontSize: '1.2rem' }}>₹{plan.price}</strong>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: paymentMethod === 'upi' ? '2px solid #15803d' : '1px solid #d1d5db',
                    backgroundColor: paymentMethod === 'upi' ? '#f0fdf4' : '#ffffff',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    color: paymentMethod === 'upi' ? '#15803d' : '#374151',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <QrCode size={16} /> UPI QR / GPay
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: paymentMethod === 'card' ? '2px solid #15803d' : '1px solid #d1d5db',
                    backgroundColor: paymentMethod === 'card' ? '#f0fdf4' : '#ffffff',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    color: paymentMethod === 'card' ? '#15803d' : '#374151',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <CreditCard size={16} /> Card / NetBanking
                </button>
              </div>

              {/* UPI QR Display Container */}
              {paymentMethod === 'upi' && (
                <div style={{
                  padding: '18px 16px',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #e5e7eb',
                  borderRadius: '16px',
                  textAlign: 'center',
                  marginBottom: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}>
                  <div style={{
                    width: '200px',
                    margin: '0 auto 12px auto',
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    padding: '10px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.08)'
                  }}>
                    <img 
                      src={upiSettings.upiQrCode || '/upi-scanner.jpg'} 
                      alt="UPI QR Scanner"
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '200px',
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
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      color: '#15803d',
                      marginTop: '8px',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase'
                    }}>
                      Scan to Pay ₹{plan.price}
                    </div>
                  </div>

                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#f8fafc',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1'
                  }}>
                    <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}>UPI ID:</span>
                    <strong style={{ fontSize: '0.95rem', color: '#0f172a', fontFamily: 'monospace' }}>
                      {upiSettings.upiId || 'rithwik0000@fam'}
                    </strong>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      style={{
                        backgroundColor: copiedUpi ? '#16a34a' : '#e2e8f0',
                        color: copiedUpi ? '#ffffff' : '#334155',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {copiedUpi ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedUpi ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  fontSize: '0.85rem',
                  color: '#475569'
                }}>
                  Card / NetBanking Authorization mode selected. Submit your transaction details and screenshot below for Admin Verification.
                </div>
              )}

              {/* UTR / Transaction Reference Input */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
                  Transaction ID / Ref / UTR Number <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="Enter 12-digit UTR, UPI Ref ID, or Transaction ID..."
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                    fontFamily: 'monospace',
                    fontWeight: '600',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Payment Screenshot File Upload */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
                  Upload Payment Proof Screenshot (Optional but recommended):
                </label>

                {paymentScreenshot ? (
                  <div style={{
                    padding: '12px 16px',
                    backgroundColor: '#f0fdf4',
                    border: '1.5px solid #16a34a',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                      <img
                        src={paymentScreenshot}
                        alt="Payment Screenshot Preview"
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #bbf7d0' }}
                      />
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#15803d', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={14} /> Screenshot Uploaded
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#4b5563', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {screenshotFileName || 'payment_proof.jpg'}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveScreenshot}
                      style={{
                        backgroundColor: '#fef2f2',
                        color: '#dc2626',
                        border: '1px solid #fca5a5',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        flexShrink: 0
                      }}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                ) : (
                  <label style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '18px',
                    backgroundColor: '#fafafa',
                    border: '2px dashed #cbd5e1',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'center'
                  }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#f0fdf4',
                      color: '#16a34a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '8px'
                    }}>
                      <Upload size={20} />
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#374151' }}>
                      Click to upload payment screenshot
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>
                      Supports PNG, JPG, JPEG, WEBP (Max 15MB)
                    </div>
                  </label>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  disabled={isProcessing}
                  onClick={handleProcessPayment}
                  style={{
                    flex: 1,
                    backgroundColor: '#15803d',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: '0.95rem',
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(21, 128, 61, 0.3)'
                  }}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Submitting Payment...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} />
                      <span>Submit Payment for Verification</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SUBMITTED / AWAITING ADMIN VERIFICATION */}
          {step === 2 && purchaseResult && (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                boxShadow: '0 6px 20px rgba(217, 119, 6, 0.2)'
              }}>
                <Clock size={36} />
              </div>

              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: '800', color: '#b45309' }}>
                Payment Submitted!
              </h3>

              <p style={{ margin: '0 0 20px 0', fontSize: '0.92rem', color: '#4b5563', lineHeight: '1.5' }}>
                Your payment reference has been recorded and sent for <strong>Admin Verification</strong>.
              </p>

              {/* Purchase Details Box */}
              <div style={{
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '14px',
                border: '1px solid #e5e7eb',
                textAlign: 'left',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                  <span style={{ color: '#6b7280' }}>Transaction Ref / ID:</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: '700' }}>{purchaseResult.purchase.paymentId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                  <span style={{ color: '#6b7280' }}>Package:</span>
                  <span style={{ fontWeight: '700', color: '#0f172a' }}>{purchaseResult.purchase.planName}</span>
                </div>
                {purchaseResult.purchase.guildName && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                    <span style={{ color: '#6b7280' }}>Server:</span>
                    <span style={{ fontWeight: '600' }}>{purchaseResult.purchase.guildName}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ color: '#6b7280' }}>Status:</span>
                  <span style={{
                    color: '#d97706',
                    fontWeight: '700',
                    backgroundColor: '#fef3c7',
                    padding: '2px 8px',
                    borderRadius: '8px',
                    fontSize: '0.78rem'
                  }}>
                    PENDING ADMIN VERIFICATION
                  </span>
                </div>
              </div>

              {/* Note Alert */}
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '12px',
                color: '#15803d',
                fontSize: '0.85rem',
                textAlign: 'left',
                marginBottom: '24px'
              }}>
                ℹ️ <strong>What happens next?</strong> Once approved and verified by an Admin, the options to set your <strong>Custom Role Name</strong> and <strong>Custom Role Colour</strong> will unlock automatically on your Dashboard!
              </div>

              <button
                onClick={onClose}
                style={{
                  width: '100%',
                  backgroundColor: '#15803d',
                  color: '#ffffff',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
              >
                Return to Dashboard
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
