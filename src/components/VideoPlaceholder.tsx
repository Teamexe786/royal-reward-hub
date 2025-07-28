const VideoPlaceholder = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="video-container h-[300px] flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-card via-card/50 to-card animate-pulse-scale"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center">
          <div className="text-4xl mb-4">🔴</div>
          <div className="text-accent font-bold font-orbitron tracking-wider text-lg">
            EVENT VIDEO WILL APPEAR HERE
          </div>
        </div>
        
        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-accent"></div>
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-accent"></div>
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-accent"></div>
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-accent"></div>
      </div>
    </div>
  );
};

export default VideoPlaceholder;