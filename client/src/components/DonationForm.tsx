import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// Stripe is disabled for demo mode to prevent loading errors
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// For demo purposes, we'll disable Stripe and use mock payment processing
// const stripePromise = loadStripe('pk_test_51HvSvwL4cs8DgK2m0123456789abcdefghijklmnopqrstuvwxyz1234567890');
const stripePromise = null; // Disable Stripe for demo mode

interface DonationFormProps {
  ngoId: string;
  ngoName: string;
  onSuccess: (donationId: string) => void;
  onCancel: () => void;
}

type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'qr';

const CheckoutForm: React.FC<DonationFormProps> = ({ ngoId, ngoName, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState(500);
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  const banks = [
    'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 
    'Punjab National Bank', 'Bank of Baroda', 'Canara Bank', 'Union Bank'
  ];

  const generateQRCode = (amount: number, upiId: string = 'ngo@paytm') => {
    return `upi://pay?pa=${upiId}&pn=${ngoName}&am=${amount}&cu=INR&tn=Donation to ${ngoName}`;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProcessing(true);
    setError('');

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate donation ID
      const donationId = `DON${Date.now()}`;
      
      // Create donation record
      const donation = {
        id: donationId,
        ngoId,
        ngoName,
        amount,
        currency: 'INR',
        message,
        anonymous,
        donorName: anonymous ? 'Anonymous' : user?.name,
        donorEmail: user?.email,
        donorPhone: user?.phone,
        paymentMethod,
        upiId: paymentMethod === 'upi' ? upiId : undefined,
        bank: paymentMethod === 'netbanking' ? selectedBank : undefined,
        date: new Date().toISOString(),
        status: 'completed',
        transactionId: `TXN${Date.now()}`
      };
      
      // Store donation
      const existingDonations = JSON.parse(localStorage.getItem('donations') || '[]');
      existingDonations.push(donation);
      localStorage.setItem('donations', JSON.stringify(existingDonations));
      
      onSuccess(donationId);
    } catch (err: any) {
      setError('Payment failed. Please try again.');
    }
    
    setProcessing(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Donate to {ngoName}</h3>
      
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
                    ? 'bg-green-600 text-white' 
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
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>

        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-3 border rounded-md text-sm ${
                paymentMethod === 'card' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              💳 Card
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`p-3 border rounded-md text-sm ${
                paymentMethod === 'upi' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              📱 UPI
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('netbanking')}
              className={`p-3 border rounded-md text-sm ${
                paymentMethod === 'netbanking' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              🏦 Net Banking
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('qr')}
              className={`p-3 border rounded-md text-sm ${
                paymentMethod === 'qr' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              📷 QR Code
            </button>
          </div>
        </div>

        {/* Payment Method Specific Fields */}
        {paymentMethod === 'card' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Details
            </label>
            <div className="border border-gray-300 rounded-md p-3 bg-gray-50">
              <div className="text-center text-gray-500 py-4">
                <div className="text-2xl mb-2">💳</div>
                <p className="text-sm">Demo Mode: Card payment simulation</p>
                <p className="text-xs text-gray-400 mt-1">
                  In production, this would show Stripe card input
                </p>
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'upi' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              UPI ID
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="yourname@paytm"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
        )}

        {paymentMethod === 'netbanking' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Bank
            </label>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            >
              <option value="">Choose your bank</option>
              {banks.map(bank => (
                <option key={bank} value={bank}>{bank}</option>
              ))}
            </select>
          </div>
        )}

        {paymentMethod === 'qr' && (
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">Scan QR code with any UPI app</p>
            <div className="bg-gray-100 p-4 rounded-md">
              <div className="w-32 h-32 mx-auto bg-white border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl mb-2">📱</div>
                  <div className="text-xs text-gray-500">QR Code</div>
                  <div className="text-xs text-gray-500">₹{amount}</div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              UPI ID: ngo@paytm
            </p>
          </div>
        )}

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message (Optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            rows={3}
            placeholder="Leave a message for the NGO..."
          />
        </div>

        {/* Anonymous Option */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="anonymous"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="anonymous" className="text-sm text-gray-700">
            Donate anonymously
          </label>
        </div>

        {/* Demo Mode Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-sm text-blue-800">
            Demo Mode: This is a demonstration. No real payment will be processed.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={processing}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {processing ? 'Processing...' : `Pay ₹${amount}`}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const DonationForm: React.FC<DonationFormProps> = (props) => {
  // Remove Elements wrapper since we're not using Stripe
  return <CheckoutForm {...props} />;
};

export default DonationForm;
