import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { resizeAndCompressImage } from './imageUtils';
import { requestIdleCallbackPolyfill, getOptimalQuality } from './performanceUtils';

/**
 * OptimizedBackground Component
 * Optimizes background images by compressing them while maintaining dimensions
 * 
 * @param {string} imageSrc - Image source URL
 * @param {string} className - CSS class name
 * @param {object} style - Additional inline styles
 * @param {number} maxWidth - Maximum width (default: 1920)
 * @param {number} maxHeight - Maximum height (default: 1080)
 * @param {number} quality - Compression quality 0-1 (default: 0.75)
 * @param {React.ReactNode} children - Child components
 */
const OptimizedBackground = ({
  imageSrc,
  className = '',
  style = {},
  maxWidth = 1920,
  maxHeight = 1080,
  quality,
  children,
  ...props
}) => {
  const [optimizedSrc, setOptimizedSrc] = useState(imageSrc);
  const [isLoading, setIsLoading] = useState(true);

  // Get optimal quality based on connection speed
  const optimalQuality = useMemo(() => {
    return quality !== undefined ? quality : getOptimalQuality(0.75);
  }, [quality]);

  // Memoize compression options
  const compressionOptions = useMemo(() => {
    const isPng = imageSrc?.toLowerCase().includes('.png') || imageSrc?.startsWith('data:image/png');
    return {
      maxWidth,
      maxHeight,
      quality: optimalQuality,
      format: isPng ? 'image/png' : 'image/jpeg'
    };
  }, [imageSrc, maxWidth, maxHeight, optimalQuality]);

  // Load and optimize background image
  const loadBackgroundImage = useCallback(() => {
    if (!imageSrc) {
      setIsLoading(false);
      return;
    }

    // Skip if already a data URL (already processed)
    if (imageSrc.startsWith('data:')) {
      setOptimizedSrc(imageSrc);
      setIsLoading(false);
      return;
    }

    // Show original first for instant display
    setOptimizedSrc(imageSrc);
    setIsLoading(false);

    // Compress in background
    const compressImage = () => {
      resizeAndCompressImage(imageSrc, compressionOptions)
        .then((compressed) => {
          setOptimizedSrc(compressed);
        })
        .catch((error) => {
          console.warn('Background image optimization failed:', error);
          // Keep original that's already displayed
        });
    };

    // Use requestIdleCallback polyfill for better performance
    requestIdleCallbackPolyfill(compressImage, { timeout: 2000 });
  }, [imageSrc, compressionOptions]);

  useEffect(() => {
    loadBackgroundImage();
  }, [loadBackgroundImage]);

  return (
    <div
      className={className}
      style={{
        backgroundImage: `url(${optimizedSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: isLoading ? 0.7 : 1,
        transition: 'opacity 0.3s ease-in-out',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
export default React.memo(OptimizedBackground);

