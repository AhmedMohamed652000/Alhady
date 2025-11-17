/**
 * Image Optimization Utilities
 * 
 * Helper functions for image optimization and processing
 */
import imageCache from './imageCache';

/**
 * Generate a data URL placeholder for blur effect
 * @param {number} width - Placeholder width
 * @param {number} height - Placeholder height
 * @param {string} color - Background color (default: '#e0e0e0')
 * @returns {string} Data URL for placeholder
 */
export const generatePlaceholder = (width = 400, height = 300, color = '#e0e0e0') => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  return canvas.toDataURL();
};

/**
 * Check if WebP format is supported
 * @returns {Promise<boolean>} True if WebP is supported
 */
export const checkWebPSupport = () => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

/**
 * Convert image path to WebP format (if supported)
 * @param {string} imagePath - Original image path
 * @returns {Promise<string>} WebP path if supported, original path otherwise
 */
export const getWebPImage = async (imagePath) => {
  const supportsWebP = await checkWebPSupport();
  if (supportsWebP && imagePath) {
    // Replace extension with .webp
    return imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }
  return imagePath;
};

/**
 * Generate responsive srcset for images
 * @param {string} basePath - Base image path
 * @param {Array<number>} widths - Array of widths (e.g., [400, 800, 1200])
 * @returns {string} srcset string
 */
export const generateSrcSet = (basePath, widths = [400, 800, 1200, 1600]) => {
  if (!basePath) return '';
  
  // Extract base path without extension
  const basePathWithoutExt = basePath.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  const extension = basePath.match(/\.(jpg|jpeg|png|webp)$/i)?.[0] || '.jpg';
  
  return widths
    .map((width) => `${basePathWithoutExt}-${width}w${extension} ${width}w`)
    .join(', ');
};

/**
 * Generate sizes attribute for responsive images
 * @param {Object} breakpoints - Breakpoint configuration
 * @returns {string} sizes attribute string
 */
export const generateSizes = (breakpoints = {
  mobile: '100vw',
  tablet: '50vw',
  desktop: '33vw',
}) => {
  return `(max-width: 768px) ${breakpoints.mobile}, (max-width: 1024px) ${breakpoints.tablet}, ${breakpoints.desktop}`;
};

/**
 * Preload an image
 * @param {string} src - Image source
 * @returns {Promise<void>} Promise that resolves when image is loaded
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    if (!src) {
      reject(new Error('No image source provided'));
      return;
    }
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Get image dimensions
 * @param {string} src - Image source
 * @returns {Promise<{width: number, height: number}>} Image dimensions
 */
export const getImageDimensions = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Optimize image URL for CDN or optimization service
 * @param {string} src - Original image source
 * @param {Object} options - Optimization options
 * @param {number} options.width - Desired width
 * @param {number} options.height - Desired height
 * @param {number} options.quality - Image quality (1-100)
 * @param {string} options.format - Output format (webp, jpg, png)
 * @returns {string} Optimized image URL
 */
export const optimizeImageUrl = (src, options = {}) => {
  if (!src) return src;
  
  // If using a CDN or image optimization service, add parameters here
  // Example for Cloudinary, Imgix, or similar services:
  // const params = new URLSearchParams();
  // if (options.width) params.append('w', options.width);
  // if (options.height) params.append('h', options.height);
  // if (options.quality) params.append('q', options.quality);
  // if (options.format) params.append('f', options.format);
  // return `${src}?${params.toString()}`;
  
  // For now, return original src
  // You can integrate with services like:
  // - Cloudinary
  // - Imgix
  // - ImageKit
  // - Next.js Image Optimization API
  return src;
};

/**
 * Create a blur data URL for placeholder
 * @param {number} width - Width in pixels
 * @param {number} height - Height in pixels
 * @returns {string} Blur data URL
 */
export const createBlurDataURL = (width = 10, height = 10) => {
  return `data:image/svg+xml;base64,${btoa(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#e0e0e0"/>
    </svg>`
  )}`;
};

/**
 * Resize and compress an image with caching
 * @param {string} src - Image source URL
 * @param {Object} options - Resize options
 * @param {number} options.maxWidth - Maximum width (default: 1920)
 * @param {number} options.maxHeight - Maximum height (default: 1080)
 * @param {number} options.quality - Compression quality 0-1 (default: 0.8)
 * @param {string} options.format - Output format: 'image/jpeg', 'image/png', 'image/webp' (default: 'image/jpeg')
 * @returns {Promise<string>} Promise that resolves with compressed image data URL
 */
export const resizeAndCompressImage = (src, options = {}) => {
  return new Promise((resolve, reject) => {
    // Check cache first
    if (imageCache.has(src, options)) {
      const cached = imageCache.get(src, options);
      // Resolve asynchronously to avoid blocking
      setTimeout(() => resolve(cached), 0);
      return;
    }
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      format = 'image/jpeg'
    } = options;

    const img = new Image();
    
    // Only set crossOrigin for external URLs (not data URLs or blob URLs)
    const isExternalUrl = src && !src.startsWith('data:') && !src.startsWith('blob:') && !src.startsWith('/');
    if (isExternalUrl) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      try {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;
        const aspectRatio = width / height;

        if (width > maxWidth) {
          width = maxWidth;
          height = width / aspectRatio;
        }

        if (height > maxHeight) {
          height = maxHeight;
          width = height * aspectRatio;
        }

        // Detect image format from source
        const isPng = src.toLowerCase().includes('.png') || 
                     src.startsWith('data:image/png') ||
                     format === 'image/png';
        
        // Use PNG format for PNG images to preserve transparency, otherwise use specified format
        const outputFormat = isPng ? 'image/png' : format;

        // Always compress to reduce file size, even if dimensions are within limits
        // Use original dimensions if image is smaller than max, otherwise use calculated dimensions
        const finalWidth = img.width <= maxWidth ? img.width : width;
        const finalHeight = img.height <= maxHeight ? img.height : height;

        // Create canvas with final dimensions
        const canvas = document.createElement('canvas');
        canvas.width = finalWidth;
        canvas.height = finalHeight;
        const ctx = canvas.getContext('2d');

        // Fill with white background only for JPEG format (to avoid black background)
        if (outputFormat === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, finalWidth, finalHeight);
        }

        // Use high-quality image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image (resized if needed, or original size if within limits)
        ctx.drawImage(img, 0, 0, finalWidth, finalHeight);

        // Convert to compressed data URL
        // For PNG, use slightly lower quality (0.9) to reduce file size while preserving transparency
        // For JPEG, use the specified quality
        const compressionQuality = outputFormat === 'image/png' ? Math.min(quality, 0.9) : quality;
        const compressedDataUrl = canvas.toDataURL(outputFormat, compressionQuality);
        
        // Cache the compressed image
        imageCache.set(src, options, compressedDataUrl);
        
        resolve(compressedDataUrl);
      } catch (error) {
        console.warn('Image compression failed, using original:', error);
        resolve(src); // Fallback to original on error
      }
    };

    img.onerror = (error) => {
      // If CORS error, try without crossOrigin
      if (isExternalUrl && img.crossOrigin) {
        const retryImg = new Image();
        retryImg.onload = () => {
          // If we can load without CORS, we can't compress it, so return original
          resolve(src);
        };
        retryImg.onerror = () => reject(error);
        retryImg.src = src;
      } else {
        reject(error);
      }
    };

    img.src = src;
  });
};

/**
 * Get optimal image dimensions based on container and viewport
 * @param {number} naturalWidth - Original image width
 * @param {number} naturalHeight - Original image height
 * @param {number} containerWidth - Container width
 * @param {number} containerHeight - Container height
 * @param {number} maxWidth - Maximum allowed width
 * @param {number} maxHeight - Maximum allowed height
 * @returns {{width: number, height: number}} Optimal dimensions
 */
export const getOptimalDimensions = (
  naturalWidth,
  naturalHeight,
  containerWidth = null,
  containerHeight = null,
  maxWidth = 1920,
  maxHeight = 1080
) => {
  let width = naturalWidth;
  let height = naturalHeight;
  const aspectRatio = width / height;

  // First, respect container constraints if provided
  if (containerWidth && width > containerWidth) {
    width = containerWidth;
    height = width / aspectRatio;
  }

  if (containerHeight && height > containerHeight) {
    height = containerHeight;
    width = height * aspectRatio;
  }

  // Then, apply maximum constraints
  if (width > maxWidth) {
    width = maxWidth;
    height = width / aspectRatio;
  }

  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }

  return {
    width: Math.round(width),
    height: Math.round(height)
  };
};

