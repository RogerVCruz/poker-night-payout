import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

/**
 * Toast notification component for user feedback
 */
const Toast: React.FC<ToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 4000
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible && !isAnimating) return null;

  const getToastClasses = () => {
    const baseClasses = "fixed top-4 right-4 max-w-md p-4 rounded-lg shadow-lg border-2 transition-all duration-300 transform z-50";
    const animationClasses = isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0";
    
    const typeClasses = type === 'success' 
      ? "bg-[#1A472A] border-[#4F7942] text-[#F5F5DC]"
      : "bg-[#4A1A1A] border-[#B22222] text-[#F5F5DC]";

    return `${baseClasses} ${animationClasses} ${typeClasses}`;
  };

  const getIcon = () => {
    const iconClasses = "flex-shrink-0";
    
    return type === 'success' 
      ? <CheckCircle size={20} className={`${iconClasses} text-[#4F7942]`} />
      : <AlertCircle size={20} className={`${iconClasses} text-[#B22222]`} />;
  };

  return (
    <div className={getToastClasses()}>
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded hover:bg-black/20 transition-colors"
          aria-label="Fechar notificação"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;