import { useState, useEffect } from 'react';
import RewardCard from '@/components/RewardCard';
import AccessModal from '@/components/AccessModal';
import Navbar from '@/components/Navbar';
import VideoPlaceholder from '@/components/VideoPlaceholder';
import NeonHeading from '@/components/NeonHeading';
import SplashScreen from '@/components/SplashScreen';
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
  const [showSplash, setShowSplash] = useState(true);

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

    const channel = supabase
      .channel('items-realtime-index-' + Math.random())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, fetchItems)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleClaim = (item: RewardItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar />

      {/* Video Placeholder */}
      <VideoPlaceholder />

      {/* First Heading and Grid */}
      <NeonHeading variant="blue">LIMITED REWARDS – VALID FOR 30 DAYS</NeonHeading>
      
      <div className="container mx-auto px-6 pb-12">
        <div className="grid grid-cols-2 gap-4 justify-items-center max-w-md mx-auto">
          {rewardItems.slice(0, 6).map((item) => (
            <RewardCard key={item.id} item={item} onClaim={() => handleClaim(item)} />
          ))}
        </div>
      </div>

      {/* Second Heading and Grid */}
      <NeonHeading variant="gold">COLLECT EXCLUSIVE REWARDS BY - GARENA</NeonHeading>
      
      <div className="container mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 gap-4 justify-items-center max-w-md mx-auto">
          {rewardItems.slice(6).map((item) => (
            <RewardCard key={item.id} item={item} onClaim={() => handleClaim(item)} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-primary/20 py-8 text-center">
        <div className="container mx-auto px-6">
          <p className="text-accent font-orbitron text-sm mb-4">
            Free Fire Max © Garena, Inc. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-accent transition-colors">Rules of Conduct</a>
          </div>
        </div>
      </footer>

      <AccessModal isOpen={isModalOpen} onClose={handleCloseModal} item={selectedItem} />
    </div>
  );
};

export default Index;