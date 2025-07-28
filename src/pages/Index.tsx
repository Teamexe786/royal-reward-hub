import { useState, useEffect } from 'react';
import RewardCard from '@/components/RewardCard';
import AccessModal from '@/components/AccessModal';
import { Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface RewardItem {
  id: number;
  name: string;
  description: string;
  rarity: 'Legendary' | 'Epic' | 'Rare';
  image_url: string;
}

const Index = () => {
  const [selectedItem, setSelectedItem] = useState<RewardItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rewardItems, setRewardItems] = useState<RewardItem[]>([]);

  // Fetch items from Supabase
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
      
      setRewardItems(data?.map(item => ({
        ...item,
        rarity: item.rarity as 'Legendary' | 'Epic' | 'Rare'
      })) || []);
    };

    fetchItems();

    // Real-time subscription
    const channel = supabase
      .channel('items-realtime-index-' + Math.random())
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'items'
        },
        (payload) => {
          console.log('Real-time update received on main page:', payload);
          fetchItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleClaim = (item: RewardItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div 
      className="min-h-screen bg-background relative"
      style={{
        backgroundImage: "url('/src/assets/background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/60 z-0" />
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-background/80 via-background/60 to-card/80 z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center glow-pulse">
                <Crown className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-6">
              Item Rewards
            </h1>
          </div>
        </div>
      </div>

      {/* Rewards Grid - 2 items per row (bigger cards), 10th item centered */}
      <div className="container mx-auto px-4 pb-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rewardItems.slice(0, rewardItems.length % 2 === 0 ? rewardItems.length : rewardItems.length - 1).map((item) => (
            <RewardCard
              key={item.id}
              item={item}
              onClaim={() => handleClaim(item)}
            />
          ))}
        </div>
        {/* Last item centered if odd number */}
        {rewardItems.length % 2 !== 0 && rewardItems[rewardItems.length - 1] && (
          <div className="md:col-span-2 flex justify-center mt-6">
            <div className="w-full md:w-1/2">
              <RewardCard
                key={rewardItems[rewardItems.length - 1].id}
                item={rewardItems[rewardItems.length - 1]}
                onClaim={() => handleClaim(rewardItems[rewardItems.length - 1])}
              />
            </div>
          </div>
        )}
      </div>

      {/* Access Modal */}
      <AccessModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        item={selectedItem}
      />
    </div>
  );
};

export default Index;
