import { useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleConfirm = () => {
    // Create a simple click sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);

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
      <div className="relative max-w-2xl mx-auto p-4">
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