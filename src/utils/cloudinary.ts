/**
 * Cloudinary URL Helper
 * --------------------
 * Formats Cloudinary URLs with automatic format (f_auto) and quality (q_auto) transformations.
 * This provides full Cloudinary optimizations (AVIF/WebP delivery & auto compression)
 * with zero JavaScript SDK bundle overhead.
 */

interface CloudinaryOptions {
  width?: number;
  quality?: 'auto' | 'auto:good' | 'auto:eco' | 'auto:best' | number;
  format?: 'auto' | 'webp' | 'avif' | 'png' | 'jpg';
  crop?: 'scale' | 'fit' | 'fill' | 'limit';
}

export function buildCloudinaryUrl(url: string, options: CloudinaryOptions = {}): string {
  if (!url.includes('res.cloudinary.com')) return url;

  const { width, quality = 'auto', format = 'auto', crop = 'scale' } = options;

  const transformations: string[] = [];

  if (format) transformations.push(`f_${format}`);
  if (quality) transformations.push(`q_${quality}`);
  if (width) {
    transformations.push(`w_${width}`);
    transformations.push(`c_${crop}`);
  }

  const transformString = transformations.join(',');

  // Insert transformations after /upload/
  return url.replace('/upload/', `/upload/${transformString}/`);
}
