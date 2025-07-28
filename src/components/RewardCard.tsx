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
      className="card-premium group relative overflow-hidden h-[240px] w-full max-w-sm mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Rarity Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
          <Crown className="w-3 h-3 text-primary" />
          <span className={`text-xs font-semibold ${getRarityColor(item.rarity)}`}>
            {item.rarity}
          </span>
        </div>
      </div>

      {/* Item Image */}
      <div className="relative h-32 mb-3 overflow-hidden rounded-lg">
        <img 
          src={item.image_url} 
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Floating Animation for Stars */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <Star 
              key={i}
              className={`absolute text-primary w-4 h-4 animate-float opacity-60`}
              style={{
                top: `${20 + i * 25}%`,
                left: `${80 - i * 15}%`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Item Info */}
      <div className="space-y-2 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
            {item.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Claim Button */}
        <Button 
          onClick={onClaim}
          variant="claim"
          className="w-full text-xs py-2 h-8"
          size="sm"
        >
          CLAIM
        </Button>
      </div>

      {/* Hover Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-xl transition-opacity duration-300 pointer-events-none ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`} />
    </div>
  );
};

export default RewardCard;