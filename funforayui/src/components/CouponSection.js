import React, { useState } from 'react';

function CouponSection() {
  const [showInput, setShowInput] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [applied, setApplied] = useState(false);
  const [message, setMessage] = useState('');

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setMessage('Please enter a valid coupon code.');
      return;
    }

    // Dummy validation – replace with real API call if needed
    if (couponCode.toLowerCase() === 'discount10') {
      setApplied(true);
      setMessage('Coupon applied successfully!');
    } else {
      setApplied(false);
      setMessage('Invalid coupon code.');
    }
  };

  return (
    <div className="cop_avai" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
      <p>Have a Coupon Code</p>

      {!showInput && (
        <p className="code" onClick={() => setShowInput(true)} style={{ color: '#007bff', cursor: 'pointer' }}>
          Enter code
        </p>
      )}

      {showInput && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Enter your code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button
            onClick={handleApplyCoupon}
            style={{ padding: '6px 12px', borderRadius: '4px', backgroundColor: '#28a745', color: 'white', border: 'none' }}
          >
            Apply
          </button>
        </div>
      )}

      {message && (
        <p style={{ color: applied ? 'green' : 'red', marginTop: '4px' }}>{message}</p>
      )}
    </div>
  );
}

export default CouponSection;
