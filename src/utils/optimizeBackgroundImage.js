import { resizeAndCompressImage } from './imageUtils';

/**
 * Optimize background images by compressing them
 * This utility function compresses background images and returns the optimized URL
 * 
 * @param {string} imageSrc - Image source URL
 * @param {Object} options - Compression options
 * @param {number} options.maxWidth - Maximum width (default: 1920)
 * @param {number} options.maxHeight - Maximum height (default: 1080)
 * @param {number} options.quality - Compression quality 0-1 (default: 0.75 for better compression)
 * @returns {Promise<string>} Promise that resolves with optimized image data URL
 */
export const optimizeBackgroundImage = async (imageSrc, options = {}) => {
  if (!imageSrc) return imageSrc;

  // Skip if already a data URL (already processed)
  if (imageSrc.startsWith('data:')) {
    return imageSrc;
  }

  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.75 // Lower quality for background images to reduce file size
  } = options;

  try {
    const optimizedSrc = await resizeAndCompressImage(imageSrc, {
      maxWidth,
      maxHeight,
      quality,
      format: 'image/jpeg' // Use JPEG for background images for better compression
    });
    return optimizedSrc;
  } catch (error) {
    console.warn('Background image optimization failed, using original:', error);
    return imageSrc; // Fallback to original
  }
};

/**
 * Hook to optimize background images in React components
 * @param {string} imageSrc - Image source URL
 * @param {Object} options - Compression options
 * @returns {string} Optimized image URL (updates when image loads)
 */
export const useOptimizedBackgroundImage = (imageSrc, options = {}) => {
  const [optimizedSrc, setOptimizedSrc] = React.useState(imageSrc);

  React.useEffect(() => {
    if (imageSrc) {
      optimizeBackgroundImage(imageSrc, options).then(setOptimizedSrc);
    }
  }, [imageSrc]);

  return optimizedSrc;
};

