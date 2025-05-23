import imageUrlBuilder from "@sanity/image-url";
import { cachedSanityClient } from "./sanityClient";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const builder = imageUrlBuilder(cachedSanityClient);

export function urlFor(source?: SanityImageSource) {
  if (!source) return null;
  return builder.image(source);
}
