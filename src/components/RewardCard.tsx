import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Crown, Star } from 'lucide-react';

interface RewardItem {
  id: number;
  name: string;
  description: string;
  rarity: 'Legendary' | 'Epic' | 'Rare';
  image_url: string;
}

interface RewardCardProps {
  item: RewardItem;
  onClaim: () => void;
}

const RewardCard = ({ item, onClaim }: RewardCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'text-primary';
      case 'Epic': return 'text-purple-400';
      case 'Rare': return 'text-blue-400';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div 
      className="card-neon group relative overflow-hidden h-[210px] w-[150px] mx-auto flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      {/* Item Image */}
      <div className="relative h-28 mb-2 overflow-hidden rounded-lg border border-primary/30">
        <img 
          src={item.image_url} 
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        
        {/* Diagonal shine effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
          <div 
            className="absolute w-full h-full opacity-60 animate-shine"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0) 50%)',
              transform: 'translateX(-100%)',
              animation: 'shine 3s ease-in-out infinite'
            }}
          />
        </div>
      </div>

      {/* Item Info */}
      <div className="flex-1 flex flex-col justify-between p-2">
        <div className="flex-1 flex items-center justify-center">
          <h3 className="text-xs font-bold font-orbitron text-white group-hover:text-primary transition-colors uppercase tracking-wide leading-tight text-center">
            {item.name}
          </h3>
        </div>

        {/* Collect Button */}
        <Button 
          onClick={onClaim}
          variant="collect"
          className="w-full text-xs py-1 h-8 mt-2"
          size="sm"
        >
          COLLECT
        </Button>
      </div>

      {/* Hover Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-lg transition-opacity duration-300 pointer-events-none ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`} />
    </div>
  );
};

export default RewardCard;