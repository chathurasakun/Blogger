import Image, { type ImageProps } from "next/image";

interface OptimizedImageProps extends Omit<ImageProps, "quality" | "loading"> {
  /**
   * Image quality (1-100). Defaults to 85 for good balance between quality and file size.
   */
  quality?: number;
  /**
   * Loading strategy. Defaults to "lazy" for better performance.
   * Set to "eager" or use priority prop for above-the-fold images.
   */
  loading?: "lazy" | "eager";
  /**
   * Whether to prioritize loading this image. When true, sets loading to "eager".
   * Useful for above-the-fold images like logos.
   */
  priority?: boolean;
}

/**
 * Optimized Image component that wraps Next.js Image with sensible defaults.
 * 
 * Default optimizations:
 * - Quality: 85 (good balance between quality and file size)
 * - Loading: lazy (unless priority is true)
 * - Automatic format optimization (WebP/AVIF when supported)
 * - Responsive sizing
 * - Blur placeholder support
 * 
 * @example
 * // Basic usage
 * <OptimizedImage src="/logo.png" alt="Logo" width={100} height={100} />
 * 
 * @example
 * // Priority loading for above-the-fold images
 * <OptimizedImage src="/hero.jpg" alt="Hero" width={1200} height={600} priority />
 * 
 * @example
 * // Custom quality
 * <OptimizedImage src="/photo.jpg" alt="Photo" width={800} height={600} quality={95} />
 */
export default function OptimizedImage({
  quality = 85,
  loading,
  priority = false,
  ...imageProps
}: OptimizedImageProps) {
  // If priority is true, force eager loading
  const loadingStrategy = priority ? "eager" : loading || "lazy";

  return (
    <Image
      quality={quality}
      loading={loadingStrategy}
      priority={priority}
      {...imageProps}
    />
  );
}

