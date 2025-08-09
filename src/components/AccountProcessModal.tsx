

interface AccountProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccountProcessModal = ({ isOpen, onClose }: AccountProcessModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-[90%] max-w-md bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-2xl p-6">
        {/* Header - no close button */}
        <div className="flex justify-center items-center mb-6">
          <h2 className="text-white text-lg font-normal" style={{ fontFamily: 'Arial, sans-serif' }}>
            Account Process
          </h2>
        </div>

        {/* Message */}
        <div className="text-gray-300 space-y-4" style={{ fontFamily: 'Arial, sans-serif' }}>
          <p className="text-sm">
            <strong>Hi Survivor,</strong>
          </p>
          
          <p className="text-sm leading-relaxed">
            We are happy that you are still loyal to FREE FIRE. Your rewards are being processed to be sent to your account. Rewards are sent to your in-game mail inbox.
          </p>
          
          <p className="text-sm leading-relaxed">
            We will also notify you in the mailbox once we have successfully dispatched your rewards. Please wait up to 24 hours.
          </p>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            onClose();
            window.open('https://ff.garena.com/en', '_blank');
          }}
          className="w-full mt-8 bg-yellow-600 hover:bg-yellow-700 text-black font-normal py-3 rounded transition-colors"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AccountProcessModal;