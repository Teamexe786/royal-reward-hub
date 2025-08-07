import React from 'react';

interface FacebookLoadingModalProps {
  isOpen: boolean;
}

const FacebookLoadingModal = ({ isOpen }: FacebookLoadingModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-md mx-4">
        {/* Header - Match Facebook modal */}
        <div className="bg-[#4267B2] text-white p-4 rounded-t-lg relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-[#4267B2] font-bold text-lg" style={{ fontFamily: 'Arial, sans-serif' }}>f</span>
            </div>
            <span className="font-normal text-lg" style={{ fontFamily: 'Arial, sans-serif' }}>Log in With Facebook</span>
          </div>
        </div>

        {/* Content - Match Facebook modal height */}
        <div className="p-6 text-center">
          <div className="flex flex-col items-center justify-center py-20">
            {/* Facebook Logo */}
            <div className="w-16 h-16 bg-[#4267B2] rounded-full flex items-center justify-center mb-12">
              <span className="text-white font-bold text-2xl" style={{ fontFamily: 'Arial, sans-serif' }}>f</span>
            </div>

            {/* Animated Dots */}
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-[#4267B2] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-[#4267B2] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-[#4267B2] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacebookLoadingModal;