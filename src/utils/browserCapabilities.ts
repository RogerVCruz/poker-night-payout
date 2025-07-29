/**
 * Browser capabilities detection utilities
 * Following best practices for feature detection
 */

export interface BrowserCapabilities {
  hasWebShare: boolean;
  hasWebShareFiles: boolean;
  isMobile: boolean;
  isHttps: boolean;
  userAgent: string;
}

/**
 * Detects if the browser supports Web Share API
 */
export const hasWebShareSupport = (): boolean => {
  return typeof navigator !== 'undefined' && 'share' in navigator;
};

/**
 * Detects if the browser supports Web Share API with files
 */
export const hasWebShareFilesSupport = (): boolean => {
  if (!hasWebShareSupport()) return false;
  
  try {
    // Create a dummy file to test canShare
    const testFile = new File(['test'], 'test.png', { type: 'image/png' });
    return navigator.canShare && navigator.canShare({ files: [testFile] });
  } catch {
    return false;
  }
};

/**
 * Detects if the current environment is mobile
 */
export const isMobileDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = [
    'android', 'webos', 'iphone', 'ipad', 'ipod', 
    'blackberry', 'windows phone', 'mobile'
  ];
  
  return mobileKeywords.some(keyword => userAgent.includes(keyword));
};

/**
 * Detects if the current page is served over HTTPS
 */
export const isSecureContext = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return window.location.protocol === 'https:' || 
         window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1';
};

/**
 * Gets comprehensive browser capabilities
 */
export const getBrowserCapabilities = (): BrowserCapabilities => {
  return {
    hasWebShare: hasWebShareSupport(),
    hasWebShareFiles: hasWebShareFilesSupport(),
    isMobile: isMobileDevice(),
    isHttps: isSecureContext(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  };
};

/**
 * Determines the best sharing strategy based on capabilities
 */
export type ShareStrategy = 'web-share' | 'whatsapp-web' | 'download-only';

export const getOptimalShareStrategy = (): ShareStrategy => {
  const capabilities = getBrowserCapabilities();
  
  // Priority 1: Web Share API with file support (best UX)
  if (capabilities.hasWebShareFiles && capabilities.isMobile && capabilities.isHttps) {
    return 'web-share';
  }
  
  // Priority 2: WhatsApp Web (good for desktop)
  if (!capabilities.isMobile) {
    return 'whatsapp-web';
  }
  
  // Priority 3: Download only (fallback)
  return 'download-only';
};