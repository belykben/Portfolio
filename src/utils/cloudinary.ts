/**
 * Cloudinary URL Helper
 * --------------------
 * Formats Cloudinary URLs with automatic format (f_auto), quality (q_auto),
 * width limits (w_<width>), and crop options.
 *
 * This provides massive image compression (AVIF/WebP delivery) and GPU memory reduction,
 * enabling silky-smooth 60fps animations.
 */

export interface CloudinaryOptions {
  width?: number;
  height?: number;
  quality?: 'auto' | 'auto:good' | 'auto:eco' | 'auto:best' | number;
  format?: 'auto' | 'webp' | 'avif' | 'png' | 'jpg';
  crop?: 'scale' | 'fit' | 'fill' | 'limit';
  dpr?: number | string;
}

export function buildCloudinaryUrl(url: string, options: CloudinaryOptions = {}): string {
  if (!url.includes('res.cloudinary.com')) return url;

  const {
    width,
    height,
    quality = 'auto:good',
    format = 'auto',
    crop = 'limit',
    dpr,
  } = options;

  const transformations: string[] = [];

  if (format) transformations.push(`f_${format}`);
  if (quality) transformations.push(`q_${quality}`);
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (width || height) transformations.push(`c_${crop}`);
  if (dpr) transformations.push(`dpr_${dpr}`);

  const transformString = transformations.join(',');

  // Prevent duplicate injection if /upload/ already has transformation flags
  if (url.includes('/upload/f_') || url.includes('/upload/q_') || url.includes('/upload/w_')) {
    return url;
  }

  // Insert transformations after /upload/
  return url.replace('/upload/', `/upload/${transformString}/`);
}

