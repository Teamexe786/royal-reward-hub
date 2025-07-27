import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Mail, Lock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
}

const AccessModal = ({ isOpen, onClose, itemName }: AccessModalProps) => {
  const [email, setEmail] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

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
    toast({
      title: "✅ Access Granted",
      description: "Your rewards will be processed in 24 hours. Please check your in-game inbox.",
      className: "border-primary bg-card text-foreground",
    });

    setIsLoading(false);
    setEmail('');
    setPassphrase('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="card-premium border-primary/20 max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center glow-pulse">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <DialogTitle className="text-xl font-bold text-primary">
            Security Verification
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Verify your access credentials to claim <span className="text-primary font-semibold">{itemName}</span>
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Access Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your access email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-input border-border focus:border-primary focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passphrase" className="text-sm font-medium text-foreground">
                Access Passphrase
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="passphrase"
                  type="password"
                  placeholder="Enter your passphrase"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="pl-10 bg-input border-border focus:border-primary focus:ring-primary"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <AlertCircle className="w-4 h-4 text-primary flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Your credentials are encrypted and secure. Only verified accounts can claim premium rewards.
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              type="submit" 
              className="btn-royal w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Verifying Access...
                </div>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Verify & Claim
                </>
              )}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="w-full border-border hover:bg-muted"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AccessModal;