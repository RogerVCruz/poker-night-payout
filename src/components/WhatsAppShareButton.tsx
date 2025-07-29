import React from 'react';
import { MessageCircle, Loader2, Download, AlertCircle, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useWhatsAppShare } from '../hooks/useWhatsAppShare';

interface WhatsAppShareButtonProps {
  elementRef: React.RefObject<HTMLElement>;
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * WhatsApp share button with intelligent strategy detection
 * Automatically chooses the best sharing method based on device capabilities
 */
const WhatsAppShareButton: React.FC<WhatsAppShareButtonProps> = ({
  elementRef,
  message,
  className = '',
  size = 'md',
  onSuccess,
  onError
}) => {
  const { t } = useTranslation();
  const { 
    shareToWhatsApp, 
    isSharing, 
    error, 
    strategy, 
    capabilities,
    clearError 
  } = useWhatsAppShare();

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

  const getButtonContent = () => {
    const iconSize = iconSizes[size];

    if (isSharing) {
      return (
        <>
          <Loader2 size={iconSize} className="animate-spin" />
          <span className="hidden sm:inline">
            {strategy === 'web-share' ? t('share.sharing') : 
             strategy === 'whatsapp-web' ? t('share.opening') : 
             t('share.downloading')}
          </span>
        </>
      );
    }

    if (error) {
      return (
        <>
          <AlertCircle size={iconSize} />
          <span className="hidden sm:inline">{t('share.tryAgain')}</span>
        </>
      );
    }

    // Show appropriate icon based on device type
    const getIcon = () => {
      // Mobile: Always show WhatsApp icon
      if (capabilities.isMobile) {
        return <MessageCircle size={iconSize} />;
      }
      
      // Desktop: Show icon based on strategy
      switch (strategy) {
        case 'web-share':
          return <Share2 size={iconSize} />;
        case 'whatsapp-web':
          return <MessageCircle size={iconSize} />;
        case 'download-only':
          return <Download size={iconSize} />;
        default:
          return <Download size={iconSize} />;
      }
    };

    return (
      <>
        {getIcon()}
        <span>
          {capabilities.isMobile ? t('share.shareWhatsApp') :
           strategy === 'whatsapp-web' ? t('share.openWhatsApp') :
           t('share.download')}
        </span>
      </>
    );
  };

  const getButtonClasses = () => {
    const baseClasses = `font-semibold rounded-lg flex items-center gap-2 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed ${sizeClasses[size]}`;

    if (error) {
      return `${baseClasses} bg-[#D46A6A] hover:bg-[#B22222] text-[#F5F5DC] focus:ring-[#D46A6A]`;
    }

    if (isSharing) {
      return `${baseClasses} bg-[#4F4F4F] text-[#F5F5DC] cursor-wait`;
    }

    // Use app theme colors instead of WhatsApp green for better UX consistency
    return `${baseClasses} bg-[#B22222] hover:bg-[#D46A6A] text-[#F5F5DC] focus:ring-[#B22222] active:scale-95`;
  };

  const getTooltipText = () => {
    if (error) return error;
    if (isSharing) return t('share.processing');

    // Mobile: Always show WhatsApp sharing tooltip
    if (capabilities.isMobile) {
      return t('share.webShareTooltip');
    }

    // Desktop: Show tooltip based on strategy
    switch (strategy) {
      case 'web-share':
        return t('share.webShareTooltip');
      case 'whatsapp-web':
        return t('share.whatsappWebTooltip');
      case 'download-only':
        return t('share.downloadTooltip');
      default:
        return t('share.shareTooltip');
    }
  };

  const handleClick = async () => {
    if (!elementRef.current) {
      const errorMsg = 'Elemento não encontrado para compartilhamento';
      onError?.(errorMsg);
      return;
    }

    if (error) {
      clearError();
      return;
    }

    if (isSharing) return;

    try {
      await shareToWhatsApp(elementRef.current, message);
      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro no compartilhamento';
      onError?.(errorMessage);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={isSharing}
        className={`${getButtonClasses()} ${className}`}
        title={getTooltipText()}
        aria-label={getTooltipText()}
      >
        {getButtonContent()}
      </button>


      {/* Error tooltip */}
      {error && (
        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-[#D46A6A] text-[#F5F5DC] text-xs rounded px-2 py-1 whitespace-nowrap z-10 shadow-lg max-w-xs">
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#D46A6A] rotate-45"></div>
          {error}
        </div>
      )}
    </div>
  );
};

export default WhatsAppShareButton;