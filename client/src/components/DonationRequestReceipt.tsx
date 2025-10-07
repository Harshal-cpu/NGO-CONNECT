import React from 'react';

interface ReceiptProps {
  pledge: {
    requestId: string;
    title: string;
    category: string;
    ngo: string;
    quantity: number;
    message?: string;
    status: string;
    pledgedAt: string;
  };
  donorName: string;
  donorEmail: string;
}

const DonationRequestReceipt: React.FC<ReceiptProps> = ({ pledge, donorName, donorEmail }) => {
  const downloadReceipt = () => {
    const receiptContent = `
DONATION PLEDGE RECEIPT
========================

Receipt ID: ${pledge.requestId}
Date: ${new Date().toLocaleDateString()}

DONOR INFORMATION:
Name: ${donorName}
Email: ${donorEmail}

DONATION DETAILS:
NGO: ${pledge.ngo}
Request: ${pledge.title}
Category: ${pledge.category}
Quantity Pledged: ${pledge.quantity}
Status: ${pledge.status}
Pledge Date: ${new Date(pledge.pledgedAt).toLocaleDateString()}
${pledge.message ? `Message: ${pledge.message}` : ''}

Thank you for your generous pledge!
This receipt serves as confirmation of your donation commitment.

Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donation-receipt-${pledge.requestId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={downloadReceipt}
      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
    >
      📄 Download Receipt
    </button>
  );
};

export default DonationRequestReceipt;
