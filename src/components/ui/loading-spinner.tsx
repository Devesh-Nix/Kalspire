import { Sparkles } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function LoadingSpinner({ size = 'md', text, className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-20 w-20',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-6 w-6',
    lg: 'h-10 w-10',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className="relative">
        {/* Outer spinning ring */}
        <div className={`${sizeClasses[size]} rounded-full border-4 border-primary/20 border-t-primary animate-spin shadow-glow`}></div>
        
        {/* Inner pulsing icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className={`${iconSizes[size]} text-primary animate-pulse`} />
        </div>
      </div>
      
      {text && (
        <p className="text-muted-foreground font-medium animate-pulse">{text}</p>
      )}
    </div>
  );
}
