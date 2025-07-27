import { useState } from 'react';
import RewardCard from '@/components/RewardCard';
import AccessModal from '@/components/AccessModal';
import { Crown, Star, Sparkles } from 'lucide-react';

// Import reward images
import crownImg from '@/assets/crown.jpg';
import swordImg from '@/assets/sword.jpg';
import shieldImg from '@/assets/shield.jpg';
import amuletImg from '@/assets/amulet.jpg';
import staffImg from '@/assets/staff.jpg';
import ringImg from '@/assets/ring.jpg';
import helmetImg from '@/assets/helmet.jpg';
import gauntletsImg from '@/assets/gauntlets.jpg';
import bootsImg from '@/assets/boots.jpg';
import orbImg from '@/assets/orb.jpg';

const rewardItems = [
  {
    id: 1,
    name: "Royal Crown of Eternity",
    description: "A legendary crown imbued with the power of ancient kings. Grants +50 Leadership and immunity to mind control.",
    rarity: "Legendary" as const,
    image: crownImg
  },
  {
    id: 2,
    name: "Dragonbane Sword",
    description: "Forged in dragon fire and blessed by the gods. Deals massive damage to all enemy types.",
    rarity: "Legendary" as const,
    image: swordImg
  },
  {
    id: 3,
    name: "Aegis Shield of Valor",
    description: "An unbreakable shield that has protected heroes throughout the ages. Reflects 25% of incoming damage.",
    rarity: "Epic" as const,
    image: shieldImg
  },
  {
    id: 4,
    name: "Amulet of Infinite Wisdom",
    description: "Contains the knowledge of a thousand scholars. Increases experience gain by 100%.",
    rarity: "Epic" as const,
    image: amuletImg
  },
  {
    id: 5,
    name: "Staff of Elemental Mastery",
    description: "Channels the raw power of the elements. Unlocks all elemental magic schools.",
    rarity: "Legendary" as const,
    image: staffImg
  },
  {
    id: 6,
    name: "Ring of Dimensional Storage",
    description: "Provides unlimited inventory space across dimensions. Never lose items again.",
    rarity: "Epic" as const,
    image: ringImg
  },
  {
    id: 7,
    name: "Helmet of True Sight",
    description: "Reveals hidden enemies and secrets. See through illusions and detect invisible foes.",
    rarity: "Rare" as const,
    image: helmetImg
  },
  {
    id: 8,
    name: "Gauntlets of Titan Strength",
    description: "Channels the might of ancient titans. Increases carrying capacity and melee damage.",
    rarity: "Epic" as const,
    image: gauntletsImg
  },
  {
    id: 9,
    name: "Boots of Swift Travel",
    description: "Blessed by the wind spirits. Increases movement speed by 200% and enables wall-walking.",
    rarity: "Rare" as const,
    image: bootsImg
  },
  {
    id: 10,
    name: "Orb of Cosmic Power",
    description: "Contains the essence of a fallen star. Regenerates mana infinitely and amplifies all spells.",
    rarity: "Legendary" as const,
    image: orbImg
  }
];

const Index = () => {
  const [selectedItem, setSelectedItem] = useState<typeof rewardItems[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClaim = (item: typeof rewardItems[0]) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-background via-background to-card">
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
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Discover exclusive legendary items crafted for the most dedicated warriors. 
              Each reward holds incredible power and prestige.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                <span>Limited Edition</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Exclusive Access</span>
              </div>
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-primary" />
                <span>Premium Quality</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {rewardItems.map((item) => (
            <RewardCard
              key={item.id}
              item={item}
              onClaim={() => handleClaim(item)}
            />
          ))}
        </div>
      </div>

      {/* Access Modal */}
      <AccessModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        itemName={selectedItem?.name || ''}
      />
    </div>
  );
};

export default Index;
