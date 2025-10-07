import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface SimpleDonationFormProps {
  ngoId: string;
  ngoName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const SimpleDonationForm: React.FC<SimpleDonationFormProps> = ({ ngoId, ngoName, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState(50);
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create mock transaction
      const mockTransaction = {
        donorId: user?.id,
        ngoId,
        amount,
        message,
        anonymous,
        status: 'completed',
        paymentIntentId: 'mock_' + Date.now()
      };

      console.log('Mock donation:', mockTransaction);
      alert(`Mock donation of $${amount} processed successfully!`);
      onSuccess();
    } catch (error) {
      alert('Payment failed. Please try again.');
    }
    
    setProcessing(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Donate to {ngoName}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Donation Amount ($)
          </label>
          <div className="flex gap-2 mb-2">
            {[25, 50, 100, 250].map(preset => (
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
                ${preset}
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

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <p className="text-sm text-yellow-800">
            💡 This is a demo donation form. No real payment will be processed.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={processing}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {processing ? 'Processing...' : `Donate $${amount}`}
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

export default SimpleDonationForm;