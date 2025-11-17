/**
 * Image Cache Utility
 * Caches compressed images to avoid re-compressing the same image
 */

class ImageCache {
  constructor(maxSize = 50) {
    this.cache = new Map();
    this.maxSize = maxSize; // Maximum number of cached images
  }

  /**
   * Generate cache key from image source and options
   */
  getKey(src, options = {}) {
    const { maxWidth, maxHeight, quality, format } = options;
    return `${src}_${maxWidth}_${maxHeight}_${quality}_${format}`;
  }

  /**
   * Get cached compressed image
   */
  get(src, options = {}) {
    const key = this.getKey(src, options);
    return this.cache.get(key);
  }

  /**
   * Store compressed image in cache
   */
  set(src, options = {}, compressedData) {
    const key = this.getKey(src, options);
    
    // If cache is full, remove oldest entry
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, compressedData);
  }

  /**
   * Check if image is cached
   */
  has(src, options = {}) {
    const key = this.getKey(src, options);
    return this.cache.has(key);
  }

  /**
   * Clear cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  size() {
    return this.cache.size;
  }
}

// Create singleton instance
const imageCache = new ImageCache();

export default imageCache;

