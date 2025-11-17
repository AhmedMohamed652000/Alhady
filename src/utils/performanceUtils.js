/**
 * Performance Utilities
 * Helper functions for optimizing website performance
 */

/**
 * Debounce function to limit how often a function can be called
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function to limit function execution rate
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Request idle callback with fallback
 */
export const requestIdleCallbackPolyfill = (callback, options = {}) => {
  if ('requestIdleCallback' in window) {
    return requestIdleCallback(callback, options);
  } else {
    // Fallback: use setTimeout with a small delay
    const timeout = options.timeout || 2000;
    return setTimeout(callback, Math.min(timeout, 100));
  }
};

/**
 * Cancel idle callback with fallback
 */
export const cancelIdleCallbackPolyfill = (id) => {
  if ('cancelIdleCallback' in window) {
    cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
};

/**
 * Preload critical images
 */
export const preloadCriticalImages = (imageUrls) => {
  imageUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};

/**
 * Lazy load images with Intersection Observer
 */
export const createLazyImageObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01,
    ...options
  };

  if ('IntersectionObserver' in window) {
    return new IntersectionObserver(callback, defaultOptions);
  }
  
  // Fallback: load all images immediately
  return {
    observe: (element) => {
      if (element) {
        setTimeout(() => {
          const entry = { isIntersecting: true, target: element };
          callback([entry]);
        }, 0);
      }
    },
    disconnect: () => {},
    unobserve: () => {}
  };
};

/**
 * Check if device is on slow connection
 */
export const isSlowConnection = () => {
  if ('connection' in navigator) {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      // Check effective type (4g, 3g, 2g, slow-2g)
      const effectiveType = connection.effectiveType;
      return effectiveType === '2g' || effectiveType === 'slow-2g';
    }
  }
  return false;
};

/**
 * Get optimal quality based on connection speed
 */
export const getOptimalQuality = (defaultQuality = 0.75) => {
  if (isSlowConnection()) {
    return Math.max(0.5, defaultQuality - 0.2); // Lower quality for slow connections
  }
  return defaultQuality;
};

