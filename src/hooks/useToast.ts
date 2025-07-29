import { useState, useCallback } from 'react';

interface ToastState {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  id: number;
}

interface UseToastReturn {
  toast: ToastState | null;
  showToast: (message: string, type: 'success' | 'error') => void;
  hideToast: () => void;
}

/**
 * Custom hook for managing toast notifications
 */
export const useToast = (): UseToastReturn => {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToast({ message, type, isVisible: true, id });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => prev ? { ...prev, isVisible: false } : null);
    
    // Clean up after animation
    setTimeout(() => {
      setToast(null);
    }, 300);
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
};