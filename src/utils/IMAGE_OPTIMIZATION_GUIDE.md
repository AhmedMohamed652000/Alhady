# Image Optimization Guide

The `OptimizedImage` component now automatically compresses and resizes images before displaying them to improve performance.

## Default Behavior

By default, all images are automatically:
- **Resized** to a maximum of 1920x1080 pixels (maintaining aspect ratio)
- **Compressed** with 80% quality (0.8)
- **Converted** to JPEG format for better compression

## Customization

You can customize compression settings per image:

```jsx
import OptimizedImage from "../../utils/OptimizedImage";

// Example 1: Smaller images for thumbnails
<OptimizedImage 
  src={thumbnailImage} 
  alt="Thumbnail"
  maxWidth={400}
  maxHeight={300}
  quality={0.7}
/>

// Example 2: High quality for hero images
<OptimizedImage 
  src={heroImage} 
  alt="Hero"
  maxWidth={2560}
  maxHeight={1440}
  quality={0.9}
/>

// Example 3: Disable compression for specific images
<OptimizedImage 
  src={smallImage} 
  alt="Small"
  compress={false}
/>

// Example 4: Very compressed for fast loading
<OptimizedImage 
  src={galleryImage} 
  alt="Gallery"
  maxWidth={1200}
  maxHeight={800}
  quality={0.6}
/>
```

## Props

- `maxWidth` (default: 1920) - Maximum width in pixels
- `maxHeight` (default: 1080) - Maximum height in pixels  
- `quality` (default: 0.8) - Compression quality from 0 to 1 (higher = better quality, larger file)
- `compress` (default: true) - Enable/disable compression

## Performance Tips

1. **Thumbnails**: Use `maxWidth={400}` and `quality={0.7}`
2. **Gallery images**: Use `maxWidth={1200}` and `quality={0.75}`
3. **Hero images**: Use `maxWidth={2560}` and `quality={0.85}`
4. **Small icons**: Use `compress={false}` if already optimized

## How It Works

1. Image loads in memory
2. If larger than max dimensions, it's resized (maintaining aspect ratio)
3. Image is compressed using canvas API
4. Compressed version is displayed as a data URL
5. Original image is never displayed, saving bandwidth

## Benefits

- **Faster page loads** - Smaller file sizes
- **Reduced bandwidth** - Especially important for mobile users
- **Better performance** - Less memory usage
- **Automatic** - Works with all existing OptimizedImage components

