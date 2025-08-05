import { useState, useEffect, useRef } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Preload the audio
    console.log('Preloading audio...');
    audioRef.current = new Audio('/confirm-click.mp3');
    audioRef.current.preload = 'auto';
    
    audioRef.current.addEventListener('canplaythrough', () => {
      console.log('Audio loaded successfully');
    });
    
    audioRef.current.addEventListener('error', (e) => {
      console.error('Audio loading error:', e);
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleConfirm = async () => {
    console.log('Confirm button clicked!');
    
    try {
      // Try to play the preloaded audio
      if (audioRef.current) {
        console.log('Attempting to play audio...');
        audioRef.current.currentTime = 0; // Reset to start
        await audioRef.current.play();
        console.log('Audio played successfully!');
      } else {
        console.error('Audio ref is null');
      }
    } catch (error) {
      console.error('Audio play failed:', error);
      
      // Fallback: try creating a new audio instance
      try {
        console.log('Trying fallback audio...');
        const fallbackAudio = new Audio('/confirm-click.mp3');
        await fallbackAudio.play();
        console.log('Fallback audio played!');
      } catch (fallbackError) {
        console.error('Fallback audio also failed:', fallbackError);
      }
    }

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