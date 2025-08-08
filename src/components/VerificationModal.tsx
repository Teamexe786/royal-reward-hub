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

  // Validation functions
  const isValidPlayerId = playerId.length >= 8 && /^\d+$/.test(playerId);
  const isValidPhoneNumber = phoneNumber.length >= 10 && /^\d+$/.test(phoneNumber);
  const isValidLevel = accountLevel !== '';
  const isFormValid = isValidPlayerId && isValidPhoneNumber && isValidLevel;

  // Removed backdrop click to prevent closing during verification flow

  const generateNumericUID = () => {
    // Generate a random 8-digit numeric UID
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  const handleVerification = () => {
    if (isFormValid) {
      onVerificationComplete({
        playerId: playerId, // Use the user-entered UID directly
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
    >
      <div className="relative w-[90%] max-w-md bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-2xl p-6">
        {/* Header */}
        <div className="flex justify-center items-center mb-6">
          <h2 className="text-white text-lg font-normal" style={{ fontFamily: 'Arial, sans-serif' }}>
            Account Verification
          </h2>
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
              placeholder="Player UID"
              value={playerId}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                setPlayerId(value);
              }}
              className={`w-full px-4 py-3 bg-gray-700/80 border rounded text-white placeholder-gray-400 focus:outline-none ${
                playerId && !isValidPlayerId 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-600 focus:border-gray-500'
              }`}
              style={{ fontFamily: 'Arial, sans-serif' }}
            />
            {playerId && !isValidPlayerId && (
              <p className="text-xs text-red-400 mt-1">Must be at least 8 digits</p>
            )}
          </div>

          <div>
            <input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                setPhoneNumber(value);
              }}
              className={`w-full px-4 py-3 bg-gray-700/80 border rounded text-white placeholder-gray-400 focus:outline-none ${
                phoneNumber && !isValidPhoneNumber 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-600 focus:border-gray-500'
              }`}
              style={{ fontFamily: 'Arial, sans-serif' }}
            />
            {phoneNumber && !isValidPhoneNumber && (
              <p className="text-xs text-red-400 mt-1">Must be at least 10 digits</p>
            )}
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
          disabled={!isFormValid}
          className={`w-full mt-8 font-normal py-3 rounded transition-colors ${
            isFormValid 
              ? 'bg-yellow-600 hover:bg-yellow-700 text-black' 
              : 'bg-gray-600 cursor-not-allowed text-gray-400'
          }`}
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          Verification
        </button>
      </div>
    </div>
  );
};

export default VerificationModal;