import { useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleConfirm = () => {
    // Play the click sound
    const audio = new Audio('/confirm-click.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));

    // Start closing animation
    setIsClosing(true);
    
    // Wait for animation then close
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-500 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative max-w-md mx-auto p-[30px]">
        <img 
          src="/lovable-uploads/cf2cdbb6-8291-47c6-8328-e6d592540cb3.png"
          alt="Free Fire India Splash Screen"
          className="w-full h-auto max-w-lg mx-auto cursor-pointer"
          onClick={handleConfirm}
        />
      </div>
    </div>
  );
};

export default SplashScreen;