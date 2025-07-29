import React from 'react';
import { Share2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ExportButtonProps {
  onClick: () => void;
  isLoading: boolean;
  error: string | null;
  onClearError?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Reusable export button with loading states and error handling
 */
const ExportButton: React.FC<ExportButtonProps> = ({
  onClick,
  isLoading,
  error,
  onClearError,
  className = '',
  size = 'md'
}) => {
  const { t } = useTranslation();

  const sizeClasses = {
    sm: 'py-1 px-2 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg'
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22
  };

  const getButtonState = () => {
    if (error) return 'error';
    if (isLoading) return 'loading';
    return 'idle';
  };

  const getButtonContent = () => {
    const state = getButtonState();
    const iconSize = iconSizes[size];

    switch (state) {
      case 'loading':
        return (
          <>
            <Loader2 size={iconSize} className="animate-spin" />
            <span className="hidden sm:inline">{t('gameSummary.exporting')}</span>
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle size={iconSize} />
            <span className="hidden sm:inline">{t('gameSummary.exportError')}</span>
          </>
        );
      default:
        return (
          <>
            <Share2 size={iconSize} />
            <span className="hidden sm:inline">{t('gameSummary.shareButton')}</span>
          </>
        );
    }
  };

  const getButtonClasses = () => {
    const state = getButtonState();
    const baseClasses = `font-semibold rounded-lg flex items-center gap-2 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed ${sizeClasses[size]}`;

    switch (state) {
      case 'loading':
        return `${baseClasses} bg-[#4F4F4F] text-[#F5F5DC] cursor-wait`;
      case 'error':
        return `${baseClasses} bg-[#D46A6A] hover:bg-[#B22222] text-[#F5F5DC] focus:ring-[#D46A6A]`;
      default:
        return `${baseClasses} bg-[#B22222] hover:bg-[#D46A6A] text-[#F5F5DC] focus:ring-[#B22222] active:scale-95`;
    }
  };

  const handleClick = () => {
    if (error && onClearError) {
      onClearError();
    } else if (!isLoading) {
      onClick();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`${getButtonClasses()} ${className}`}
        title={error || t('gameSummary.shareTitle')}
        aria-label={
          error 
            ? t('gameSummary.exportError')
            : isLoading 
              ? t('gameSummary.exporting')
              : t('gameSummary.shareTitle')
        }
      >
        {getButtonContent()}
      </button>

      {/* Error tooltip */}
      {error && (
        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-[#D46A6A] text-[#F5F5DC] text-xs rounded px-2 py-1 whitespace-nowrap z-10 shadow-lg">
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#D46A6A] rotate-45"></div>
          {error}
        </div>
      )}
    </div>
  );
};

export default ExportButton;