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
      className="card-neon group relative overflow-hidden h-[280px] w-full max-w-sm mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Rarity Badge */}
      <div className="absolute top-3 right-3 z-10">
        <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full border border-accent/30">
          <Crown className="w-3 h-3 text-accent" />
          <span className={`text-xs font-bold font-orbitron ${getRarityColor(item.rarity)}`}>
            {item.rarity}
          </span>
        </div>
      </div>

      {/* Item Image */}
      <div className="relative h-40 mb-4 overflow-hidden rounded-lg border border-primary/30">
        <img 
          src={item.image_url} 
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        
        {/* Glowing particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className={`absolute w-2 h-2 bg-primary rounded-full animate-float opacity-60 shadow-[0_0_8px_hsl(195,100%,50%)]`}
              style={{
                top: `${15 + i * 25}%`,
                left: `${75 - i * 10}%`,
                animationDelay: `${i * 0.7}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Item Info */}
      <div className="space-y-3 flex-1 flex flex-col px-2">
        <div className="flex-1">
          <h3 className="text-sm font-bold font-orbitron text-white group-hover:text-primary transition-colors uppercase tracking-wide">
            {item.name}
          </h3>
        </div>

        {/* Collect Button */}
        <Button 
          onClick={onClaim}
          variant="collect"
          className="w-full text-xs py-2 h-9"
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