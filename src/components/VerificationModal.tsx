import { useState } from 'react';
import { X } from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationComplete: (data: {
    playerId: string;
    phoneNumber: string;
    accountLevel: string;
  }) => void;
}

const VerificationModal = ({ isOpen, onClose, onVerificationComplete }: VerificationModalProps) => {
  const [playerId, setPlayerId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accountLevel, setAccountLevel] = useState('');

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleVerification = () => {
    if (playerId && phoneNumber && accountLevel) {
      onVerificationComplete({
        playerId,
        phoneNumber,
        accountLevel
      });
    }
  };

  const generateLevelOptions = () => {
    const options = [];
    for (let i = 50; i <= 100; i++) {
      options.push(
        <option key={i} value={i.toString()}>
          Level {i}
        </option>
      );
    }
    return options;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-[90%] max-w-md bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-lg font-normal" style={{ fontFamily: 'Arial, sans-serif' }}>
            Account Verification
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Subtitle */}
        <p className="text-gray-300 text-sm mb-6" style={{ fontFamily: 'Arial, sans-serif' }}>
          Complete your account details
        </p>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Player ID"
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-gray-500"
              style={{ fontFamily: 'Arial, sans-serif' }}
            />
          </div>

          <div>
            <input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-gray-500"
              style={{ fontFamily: 'Arial, sans-serif' }}
            />
          </div>

          <div>
            <select
              value={accountLevel}
              onChange={(e) => setAccountLevel(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded text-white focus:outline-none focus:border-gray-500"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              <option value="" disabled>Account Level</option>
              {generateLevelOptions()}
            </select>
          </div>
        </div>

        {/* Verification Button */}
        <button
          onClick={handleVerification}
          disabled={!playerId || !phoneNumber || !accountLevel}
          className="w-full mt-8 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-normal py-3 rounded transition-colors"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          Verification
        </button>
      </div>
    </div>
  );
};

export default VerificationModal;