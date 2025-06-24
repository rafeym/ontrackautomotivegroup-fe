import imageUrlBuilder from "@sanity/image-url";
import { cachedSanityClient } from "./sanityClient";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const builder = imageUrlBuilder(cachedSanityClient);

interface OptimizedImageSource {
  url: string;
  metadata?: Record<string, unknown>;
}

export function urlFor(source?: SanityImageSource | OptimizedImageSource) {
  if (!source) return null;

  // Handle the new optimized image format
  if (typeof source === "object" && "url" in source) {
    return {
      url: () => source.url,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      width: (_w: number) => ({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        height: (_h: number) => ({
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          quality: (_q: number) => ({
            url: () => source.url,
          }),
        }),
      }),
    };
  }

  // Handle the original Sanity image format
  return builder.image(source);
}
