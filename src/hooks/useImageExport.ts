import { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';

interface UseImageExportReturn {
  exportElement: (element: HTMLElement, fileName?: string) => Promise<void>;
  isExporting: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Custom hook for exporting HTML elements as images
 * Provides loading states, error handling, and optimized configuration
 */
export const useImageExport = (): UseImageExportReturn => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const generateFileName = (customName?: string): string => {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0];
    const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-');
    return customName || `poker-resultado-${dateStr}-${timeStr}.png`;
  };

  const getOptimizedConfig = (element: HTMLElement) => ({
    backgroundColor: '#1a1a1a',
    scale: Math.min(window.devicePixelRatio || 2, 3), // Max scale of 3 for performance
    useCORS: true,
    allowTaint: false,
    logging: false,
    removeContainer: true,
    imageTimeout: 15000,
    width: element.scrollWidth,
    height: element.scrollHeight,
    onclone: (clonedDoc: Document) => {
      // Ensure fonts are loaded in cloned document
      const clonedElement = clonedDoc.querySelector('[data-export-target]') as HTMLElement;
      if (clonedElement) {
        clonedElement.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      }
    },
  });

  const downloadImage = (canvas: HTMLCanvasElement, fileName: string): void => {
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create image blob');
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.setAttribute('aria-label', `Download ${fileName}`);
      
      // Temporarily add to DOM for download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      URL.revokeObjectURL(url);
    }, 'image/png', 0.95); // High quality PNG
  };

  const exportElement = useCallback(async (element: HTMLElement, customFileName?: string): Promise<void> => {
    if (!element) {
      setError('Elemento não encontrado para exportação');
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      // Add data attribute for cloning reference
      element.setAttribute('data-export-target', 'true');
      
      const config = getOptimizedConfig(element);
      const canvas = await html2canvas(element, config);
      
      if (!canvas) {
        throw new Error('Failed to create canvas');
      }

      const fileName = generateFileName(customFileName);
      downloadImage(canvas, fileName);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido na exportação';
      console.error('Export error:', err);
      setError(`Erro ao exportar imagem: ${errorMessage}`);
    } finally {
      setIsExporting(false);
      element.removeAttribute('data-export-target');
    }
  }, []);

  return {
    exportElement,
    isExporting,
    error,
    clearError,
  };
};