import { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const VideoPlaceholder = () => {
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    const iframe = document.querySelector('iframe') as HTMLIFrameElement;
    if (iframe) {
      let src = iframe.src;

      // Clean up previous mute state
      src = src.replace('&muted=1', '').replace('&autoplay=1', '');

      if (isMuted) {
        iframe.src = src + '&autoplay=1'; // Unmuted autoplay
      } else {
        iframe.src = src + '&autoplay=1&muted=1'; // Muted autoplay
      }

      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="video-container relative">
        {/* Autoplay Video iframe */}
        <div style={{ position: "relative", width: "100%", height: "0px", paddingBottom: "56.250%" }}>
          <iframe
            allow="fullscreen;autoplay"
            allowFullScreen
            height="100%"
            src="https://streamable.com/e/9d8j5m?autoplay=1&muted=1&nocontrols=1"
            width="100%"
            style={{
              border: "none",
              width: "100%",
              height: "100%",
              position: "absolute",
              left: "0px",
              top: "0px",
              overflow: "hidden"
            }}
            className="rounded-lg"
          />
        </div>

        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className="absolute top-4 right-4 z-20 bg-black/70 hover:bg-black/90 text-accent p-2 rounded-full transition-all duration-300 hover:scale-110 border border-accent/30 hover:border-accent/60"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        {/* Corner Decorations */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-accent z-10"></div>
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-accent z-10"></div>
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-accent z-10"></div>
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-accent z-10"></div>
      </div>
    </div>
  );
};

export default VideoPlaceholder;
      
