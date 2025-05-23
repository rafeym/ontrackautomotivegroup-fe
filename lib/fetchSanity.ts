// lib/fetchSanity.ts
import { sanityClient } from "./sanityClient";

type SanityParams = Record<
  string,
  string | number | boolean | null | undefined
>;

// Fetch function for querying Sanity with a query string
export async function fetchSanityQuery(
  query: string,
  params: SanityParams = {}
) {
  return await sanityClient.fetch(query, params);
}
