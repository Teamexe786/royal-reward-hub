import { Facebook, Instagram, Youtube, ShoppingCart, Menu } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-black border-b border-primary/20 py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left - Logo */}
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/ac0404fb-3013-45c8-ad12-1276cfa0a853.png" 
            alt="Free Fire Max Logo" 
            className="h-40 w-45"
          />
        </div>

        {/* Right - Social Icons and Menu */}
        <div className="flex items-center gap-4">
          {/* Social Icons */}
          <div className="hidden md:flex items-center gap-3">
            <Facebook className="w-6 h-6 text-white hover:text-primary transition-colors cursor-pointer hover:drop-shadow-[0_0_8px_hsl(195,100%,50%)]" />
            <Instagram className="w-6 h-6 text-white hover:text-secondary transition-colors cursor-pointer hover:drop-shadow-[0_0_8px_hsl(270,100%,50%)]" />
            <Youtube className="w-6 h-6 text-white hover:text-destructive transition-colors cursor-pointer hover:drop-shadow-[0_0_8px_hsl(0,85%,60%)]" />
          </div>
          
          {/* Cart Icon */}
          <ShoppingCart className="w-6 h-6 text-white hover:text-accent transition-colors cursor-pointer hover:drop-shadow-[0_0_8px_hsl(45,100%,50%)]" />
          
          {/* Hamburger Menu */}
          <Menu className="w-6 h-6 text-accent hover:text-white transition-colors cursor-pointer hover:drop-shadow-[0_0_8px_hsl(45,100%,50%)]" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;