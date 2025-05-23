import { createClient } from "@sanity/client";

// Client for real-time operations (bookings, inventory updates)
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-05-01",
  useCdn: false, // Disable CDN for real-time updates
  token: process.env.SANITY_API_WRITE_TOKEN,
});

// Client for cached operations (images, general queries)
export const cachedSanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-05-01",
  useCdn: true, // Enable CDN for better performance
  perspective: "published", // Use published perspective for better caching
});
