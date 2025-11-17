import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { resizeAndCompressImage } from './imageUtils';
import { requestIdleCallbackPolyfill, getOptimalQuality } from './performanceUtils';
import './OptimizedImage.css';

/**
 * OptimizedImage Component
 * 
 * Features:
 * - Lazy loading with Intersection Observer
 * - Placeholder/blur effect while loading
 * - Error handling with fallback
 * - Responsive image support
 * - WebP format support (when available)
 * - Automatic width/height for layout shift prevention
 * - Automatic image compression and resizing
 * 
 * @param {string} src - Image source URL or imported image
 * @param {string} alt - Alt text for accessibility
 * @param {string} className - Additional CSS classes
 * @param {object} style - Inline styles
 * @param {string} placeholder - Placeholder image (optional)
 * @param {boolean} lazy - Enable lazy loading (default: true)
 * @param {string} loading - Loading strategy: 'lazy', 'eager', 'auto' (default: 'lazy')
 * @param {function} onLoad - Callback when image loads
 * @param {function} onError - Callback when image fails to load
 * @param {string} fallback - Fallback image on error
 * @param {number} width - Image width (for layout shift prevention)
 * @param {number} height - Image height (for layout shift prevention)
 * @param {string} sizes - Responsive image sizes attribute
 * @param {string} srcSet - Responsive image srcset attribute
 * @param {number} maxWidth - Maximum width for compression (default: 1920)
 * @param {number} maxHeight - Maximum height for compression (default: 1080)
 * @param {number} quality - Compression quality 0-1 (default: 0.8)
 * @param {boolean} compress - Enable compression (default: true)
 */
const OptimizedImage = ({
  src,
  alt = '',
  className = '',
  style = {},
  placeholder,
  lazy = true,
  loading = 'lazy',
  onLoad,
  onError,
  fallback,
  width,
  height,
  sizes,
  srcSet,
  maxWidth = 1920,
  maxHeight = 1080,
  quality,
  compress = true,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const [isCompressing, setIsCompressing] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    // If lazy loading is disabled, load immediately
    if (!lazy) {
      setIsInView(true);
      return;
    }

    // Set up Intersection Observer for lazy loading
    if (imgRef.current && 'IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              if (observerRef.current) {
                observerRef.current.disconnect();
              }
            }
          });
        },
        {
          rootMargin: '50px', // Start loading 50px before image enters viewport
          threshold: 0.01,
        }
      );

      observerRef.current.observe(imgRef.current);
    } else {
      // Fallback for browsers without Intersection Observer
      setIsInView(true);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [lazy]);

  // Get optimal quality based on connection speed
  const optimalQuality = useMemo(() => {
    return quality !== undefined ? quality : getOptimalQuality(0.75);
  }, [quality]);

  // Memoize compression options
  const compressionOptions = useMemo(() => {
    const isPng = src?.toLowerCase().includes('.png') || src?.startsWith('data:image/png');
    return {
      maxWidth,
      maxHeight,
      quality: optimalQuality,
      format: isPng ? 'image/png' : 'image/jpeg'
    };
  }, [src, maxWidth, maxHeight, optimalQuality]);

  // Load image with performance optimization
  const loadImage = useCallback(() => {
    if (!src) return;

    // Check if src is a data URL or blob URL (already processed)
    const isDataUrl = src.startsWith('data:');
    const isBlobUrl = src.startsWith('blob:');
    
    // Skip compression for already processed images or if compression is disabled
    if (isDataUrl || isBlobUrl || !compress) {
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
        setHasError(false);
        if (onLoad) onLoad();
      };
      img.onerror = () => {
        setHasError(true);
        if (fallback) {
          setImageSrc(fallback);
          setIsLoaded(true);
        }
        if (onError) onError();
      };
      img.src = src;
      return;
    }

    // Show original image first for instant display
    const tempImg = new Image();
    tempImg.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    tempImg.src = src;

    // Compress in background using requestIdleCallback or setTimeout
    const compressImage = () => {
      setIsCompressing(true);
      resizeAndCompressImage(src, compressionOptions)
        .then((compressedSrc) => {
          setImageSrc(compressedSrc);
          setIsCompressing(false);
          if (onLoad) onLoad();
        })
        .catch((error) => {
          console.warn('Image compression failed, using original:', error);
          setIsCompressing(false);
          // Keep original image that's already displayed
        });
    };

    // Use requestIdleCallback polyfill for better performance
    requestIdleCallbackPolyfill(compressImage, { timeout: 2000 });
  }, [src, compress, compressionOptions, fallback, onLoad, onError]);

  useEffect(() => {
    if (isInView && src) {
      loadImage();
    }
  }, [isInView, src, loadImage]);

  const imageClasses = `optimized-image ${className} ${isLoaded ? 'loaded' : 'loading'} ${hasError ? 'error' : ''} ${isCompressing ? 'compressing' : ''}`.trim();

  return (
    <div
      ref={imgRef}
      className={`optimized-image-wrapper ${className}`}
      style={{
        width: width || '100%',
        height: height || 'auto',
        ...style,
      }}
    >
      {!isLoaded && placeholder && (
        <img
          src={placeholder}
          alt=""
          className="optimized-image-placeholder"
          aria-hidden="true"
        />
      )}
      <img
        src={imageSrc || src}
        alt={alt}
        className={imageClasses}
        loading={loading}
        width={width}
        height={height}
        sizes={sizes}
        srcSet={srcSet}
        onLoad={() => {
          setIsLoaded(true);
          if (onLoad) onLoad();
        }}
        onError={(e) => {
          setHasError(true);
          if (fallback && e.target.src !== fallback) {
            setImageSrc(fallback);
          }
          if (onError) onError(e);
        }}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          ...style,
        }}
        {...props}
      />
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
export default React.memo(OptimizedImage);

