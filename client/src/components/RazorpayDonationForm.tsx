import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface RazorpayDonationFormProps {
  ngoId: string;
  ngoName: string;
  onSuccess: (donationId: string) => void;
  onCancel: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayDonationForm: React.FC<RazorpayDonationFormProps> = ({ 
  ngoId, 
  ngoName, 
  onSuccess, 
  onCancel 
}) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState(500);
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProcessing(true);
    setError('');

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      // Create Razorpay order
      const orderResponse = await api.post('/api/payments/razorpay/create-order', {
        ngoId,
        amount,
        message,
        anonymous
      });

      const { orderId, amount: orderAmount, currency, donationId, key } = orderResponse.data;

      // Configure Razorpay options
      const options = {
        key: key,
        amount: orderAmount,
        currency: currency,
        name: 'CONNECT NGO',
        description: `Donation to ${ngoName}`,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const verifyResponse = await api.post('/api/payments/razorpay/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              donationId: donationId
            });

            if (verifyResponse.data.success) {
              onSuccess(donationId.toString());
            } else {
              setError('Payment verification failed');
            }
          } catch (verifyError) {
            console.error('Payment verification error:', verifyError);
            setError('Payment verification failed');
          }
        },
        prefill: {
          name: anonymous ? 'Anonymous' : user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        notes: {
          ngoId: ngoId,
          message: message,
          anonymous: anonymous.toString()
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            setError('Payment cancelled');
          }
        }
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Donate to {ngoName}</h3>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Donation Amount (₹)
          </label>
          <div className="flex gap-2 mb-2">
            {[500, 1000, 2000, 5000].map(preset => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset)}
                className={`px-3 py-1 rounded text-sm ${
                  amount === preset
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                ₹{preset}
              </button>
            ))}
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message (Optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Leave a message for the NGO..."
          />
        </div>

        {/* Anonymous Donation */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="anonymous"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
            Make this donation anonymous
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        {/* Payment Info */}
        <div className="bg-blue-50 p-3 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Secure Payment via Razorpay</strong>
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Your payment is processed securely through Razorpay. We support UPI, Cards, Net Banking, and Wallets.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            disabled={processing}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={processing || amount < 1}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Processing...' : `Donate ₹${amount}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RazorpayDonationForm;
