import React from 'react';

interface FacebookLoadingModalProps {
  isOpen: boolean;
}

const FacebookLoadingModal = ({ isOpen }: FacebookLoadingModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-md mx-4">
        <div className="flex flex-col items-center justify-center py-16">
          {/* Facebook Logo */}
          <div className="w-16 h-16 bg-[#1877F2] rounded-full flex items-center justify-center mb-12">
            <span className="text-white font-bold text-2xl" style={{ fontFamily: 'Arial, sans-serif' }}>f</span>
          </div>

          {/* Animated Dots */}
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-[#1877F2] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-[#1877F2] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-[#1877F2] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacebookLoadingModal;