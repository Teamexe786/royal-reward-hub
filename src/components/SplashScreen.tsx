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
    audioRef.current = new Audio('/close-button-sound.mp3');
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
      if (audioRef.current) {
        console.log('Playing audio...');
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
        
        // Wait for audio to finish before closing
        audioRef.current.addEventListener('ended', () => {
          setIsClosing(true);
          setTimeout(() => {
            onComplete();
          }, 500);
        });
      } else {
        // If no audio, just close immediately
        setIsClosing(true);
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    } catch (error) {
      console.error('Audio play failed:', error);
      // If audio fails, just close the splash screen
      setIsClosing(true);
      setTimeout(() => {
        onComplete();
      }, 500);
    }
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