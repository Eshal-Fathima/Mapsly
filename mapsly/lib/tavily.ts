// =============================================================================
// Mapsly — Tavily Search Helper
// =============================================================================

import { TavilyResult } from "./types";

const TAVILY_ENDPOINT = "https://api.tavily.com/search";

/**
 * Search the web for AI tools using Tavily.
 * Returns a trimmed array of results (title, url, snippet).
 */
export async function searchTools(query: string): Promise<TavilyResult[]> {
  const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

  if (!TAVILY_API_KEY) {
    throw new Error(
      "TAVILY_API_KEY is not set. Add it to .env.local before starting the app."
    );
  }

  const response = await fetch(TAVILY_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: TAVILY_API_KEY,
      query,
      search_depth: "basic",
      max_results: 5,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`Tavily API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return (data.results ?? []) as TavilyResult[];
}
