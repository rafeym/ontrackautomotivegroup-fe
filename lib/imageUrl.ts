import imageUrlBuilder from "@sanity/image-url";
import { cachedSanityClient } from "./sanityClient";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const builder = imageUrlBuilder(cachedSanityClient);

export function urlFor(
  source?: SanityImageSource | { url: string; metadata?: any }
) {
  if (!source) return null;

  // Handle the new optimized image format
  if (typeof source === "object" && "url" in source) {
    return {
      url: () => source.url,
      width: (_w: number) => ({
        height: (_h: number) => ({
          quality: (_q: number) => ({ url: () => source.url }),
        }),
      }),
    };
  }

  // Handle the original Sanity image format
  return builder.image(source);
}
