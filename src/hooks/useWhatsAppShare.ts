import { useState, useCallback } from 'react';
import { useImageExport } from './useImageExport';
import { 
  getOptimalShareStrategy, 
  getBrowserCapabilities,
  type ShareStrategy 
} from '../utils/browserCapabilities';

interface WhatsAppShareState {
  isSharing: boolean;
  error: string | null;
  strategy: ShareStrategy;
  capabilities: ReturnType<typeof getBrowserCapabilities>;
}

interface UseWhatsAppShareReturn extends WhatsAppShareState {
  shareToWhatsApp: (element: HTMLElement, message?: string) => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for sharing content to WhatsApp with intelligent fallbacks
 * Follows progressive enhancement principles
 */
export const useWhatsAppShare = (): UseWhatsAppShareReturn => {
  const { exportElement } = useImageExport();
  
  const [state, setState] = useState<WhatsAppShareState>(() => ({
    isSharing: false,
    error: null,
    strategy: getOptimalShareStrategy(),
    capabilities: getBrowserCapabilities(),
  }));

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const setLoading = useCallback((isSharing: boolean) => {
    setState(prev => ({ ...prev, isSharing }));
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({ ...prev, error, isSharing: false }));
  }, []);

  /**
   * Creates a blob from canvas for Web Share API
   */
  const createImageBlob = async (element: HTMLElement): Promise<File> => {
    return new Promise((resolve, reject) => {
      import('html2canvas').then(({ default: html2canvas }) => {
        html2canvas(element, {
          backgroundColor: '#1a1a1a',
          scale: Math.min(window.devicePixelRatio || 2, 2), // Optimized for sharing
          useCORS: true,
          allowTaint: false,
          logging: false,
          removeContainer: true,
          imageTimeout: 10000,
        }).then(canvas => {
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Failed to create image blob'));
              return;
            }
            
            const file = new File(
              [blob], 
              `poker-resultado-${new Date().toISOString().split('T')[0]}.png`, 
              { type: 'image/png' }
            );
            resolve(file);
          }, 'image/png', 0.9);
        }).catch(reject);
      }).catch(reject);
    });
  };

  /**
   * Strategy 1: Web Share API (Mobile + HTTPS)
   */
  const shareViaWebShare = async (element: HTMLElement, message: string): Promise<void> => {
    try {
      const imageFile = await createImageBlob(element);
      
      const shareData = {
        title: 'Resultado do Poker',
        text: message,
        files: [imageFile],
      };

      // Double-check support before sharing
      if (!navigator.canShare || !navigator.canShare(shareData)) {
        throw new Error('Web Share not supported for this content');
      }

      await navigator.share(shareData);
    } catch (error) {
      if (error instanceof Error) {
        // User cancelled sharing
        if (error.name === 'AbortError') {
          return; // Don't treat as error
        }
        throw new Error(`Erro no compartilhamento: ${error.message}`);
      }
      throw error;
    }
  };

  /**
   * Strategy 2: WhatsApp Web (Desktop)
   */
  const shareViaWhatsAppWeb = async (element: HTMLElement, message: string): Promise<void> => {
    try {
      // Download image first
      await exportElement(element);
      
      // Small delay for download to start
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Open WhatsApp Web with message
      const encodedMessage = encodeURIComponent(
        `${message}\n\n*Imagem enviada em anexo*`
      );
      const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
      
      const popup = window.open(whatsappUrl, '_blank');
      if (!popup) {
        throw new Error('Popup bloqueado. Permita popups para compartilhar.');
      }
    } catch (error) {
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Erro ao abrir WhatsApp Web'
      );
    }
  };

  /**
   * Strategy 3: Download only (Fallback)
   */
  const shareViaDownload = async (element: HTMLElement): Promise<void> => {
    try {
      await exportElement(element);
    } catch (error) {
      throw new Error('Erro ao baixar imagem');
    }
  };

  /**
   * Main sharing function with intelligent strategy selection
   */
  const shareToWhatsApp = useCallback(async (
    element: HTMLElement, 
    customMessage?: string
  ): Promise<void> => {
    if (!element) {
      setError('Elemento não encontrado para compartilhamento');
      return;
    }

    setLoading(true);
    clearError();

    const message = customMessage || '🎲 Confira o resultado da nossa partida de poker!';
    
    try {
      switch (state.strategy) {
        case 'web-share':
          await shareViaWebShare(element, message);
          break;
          
        case 'whatsapp-web':
          await shareViaWhatsAppWeb(element, message);
          break;
          
        case 'download-only':
          await shareViaDownload(element);
          break;
          
        default:
          throw new Error('Estratégia de compartilhamento não suportada');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [state.strategy, exportElement]);

  return {
    ...state,
    shareToWhatsApp,
    clearError,
  };
};