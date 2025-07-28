interface NeonHeadingProps {
  children: React.ReactNode;
  variant?: 'blue' | 'purple' | 'gold';
}

const NeonHeading = ({ children, variant = 'blue' }: NeonHeadingProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'blue':
        return 'text-neon-blue border-primary animate-neon-glow';
      case 'purple':
        return 'text-neon-purple border-secondary animate-purple-glow';
      case 'gold':
        return 'text-neon-gold border-accent animate-gold-glow';
      default:
        return 'text-neon-blue border-primary animate-neon-glow';
    }
  };

  return (
    <div className="text-center py-8">
      <div className={`inline-block border-2 rounded-lg px-8 py-4 ${getVariantClasses()}`}>
        <h2 className="text-2xl md:text-3xl font-bold font-orbitron tracking-wider uppercase">
          {children}
        </h2>
      </div>
    </div>
  );
};

export default NeonHeading;