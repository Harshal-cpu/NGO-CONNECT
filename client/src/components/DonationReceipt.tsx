import React from 'react';
import { useAuth } from '../context/AuthContext';

interface DonationReceiptProps {
  donationId: string;
  onClose: () => void;
}

const DonationReceipt: React.FC<DonationReceiptProps> = ({ donationId, onClose }) => {
  const { user } = useAuth();
  
  // Get donation details
  const donations = JSON.parse(localStorage.getItem('donations') || '[]');
  const donation = donations.find((d: any) => d.id === donationId);
  
  if (!donation) {
    return null;
  }

  const downloadReceipt = () => {
    const receiptContent = `
DONATION RECEIPT
================

Receipt No: ${donation.id}
Transaction ID: ${donation.transactionId}
Date: ${new Date(donation.date).toLocaleDateString('en-IN')}

DONOR INFORMATION:
Name: ${donation.anonymous ? 'Anonymous' : user?.name}
Email: ${donation.anonymous ? 'Anonymous' : user?.email}
Phone: ${donation.anonymous ? 'Anonymous' : user?.phone}

NGO INFORMATION:
Organization: ${donation.ngoName}

DONATION DETAILS:
Amount: ₹${donation.amount}
Currency: ${donation.currency}
Payment Method: ${donation.paymentMethod.toUpperCase()}
${donation.upiId ? `UPI ID: ${donation.upiId}` : ''}
${donation.bank ? `Bank: ${donation.bank}` : ''}
Status: ${donation.status.toUpperCase()}

Message: ${donation.message || 'No message'}

Thank you for your generous donation!

This receipt is generated electronically and is valid for tax purposes.
Please consult your tax advisor for deduction eligibility.

Generated on: ${new Date().toLocaleString('en-IN')}
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donation-receipt-${donation.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Donation Receipt</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* Receipt Header */}
            <div className="text-center border-b pb-4">
              <h3 className="text-lg font-semibold text-green-600">DONATION RECEIPT</h3>
              <p className="text-sm text-gray-500">Receipt No: {donation.id}</p>
              <p className="text-sm text-gray-500">Transaction ID: {donation.transactionId}</p>
            </div>

            {/* Date */}
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Date:</span>
              <span className="text-sm text-gray-900">
                {new Date(donation.date).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>

            {/* Donor Information */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Donor Information</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="text-gray-900">{donation.anonymous ? 'Anonymous' : user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="text-gray-900">{donation.anonymous ? 'Anonymous' : user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="text-gray-900">{donation.anonymous ? 'Anonymous' : user?.phone}</span>
                </div>
              </div>
            </div>

            {/* NGO Information */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Organization</h4>
              <p className="text-sm text-gray-900">{donation.ngoName}</p>
            </div>

            {/* Donation Details */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Donation Details</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="text-lg font-semibold text-green-600">₹{donation.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="text-gray-900 capitalize">{donation.paymentMethod}</span>
                </div>
                {donation.upiId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">UPI ID:</span>
                    <span className="text-gray-900">{donation.upiId}</span>
                  </div>
                )}
                {donation.bank && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank:</span>
                    <span className="text-gray-900">{donation.bank}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-green-600 font-medium capitalize">{donation.status}</span>
                </div>
              </div>
            </div>

            {/* Message */}
            {donation.message && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Message</h4>
                <p className="text-sm text-gray-700 italic">"{donation.message}"</p>
              </div>
            )}

            {/* Footer */}
            <div className="border-t pt-4 text-center">
              <p className="text-xs text-gray-500">
                Thank you for your generous donation!
              </p>
              <p className="text-xs text-gray-500 mt-1">
                This receipt is valid for tax purposes. Please consult your tax advisor.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={downloadReceipt}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Receipt
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationReceipt;
