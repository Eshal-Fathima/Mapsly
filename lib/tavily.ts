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
  try {
    const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

    if (!TAVILY_API_KEY) {
      console.error("[tavily] Missing API key");
      throw new Error("TAVILY_API_KEY is not set.");
    }

    if (!query || query.trim() === "") {
       return [];
    }

    const response = await fetch(TAVILY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query: query.trim(),
        search_depth: "basic",
        max_results: 5,
      }),
    }).catch(err => {
      console.error("[tavily] Fetch failed:", err);
      throw new Error("Failed to connect to search service.");
    });

    if (!response || !response.ok) {
      const errorText = response 
        ? await response.text().catch(() => "Unknown error")
        : "No response from Tavily";
      console.error(`[tavily] API error (${response?.status}):`, errorText);
      throw new Error(`Search service error: ${response?.status || 'network'}`);
    }

    const data = await response.json().catch(() => ({ results: [] }));
    return (data?.results ?? []) as TavilyResult[];
  } catch (error) {
    console.error("[tavily] Search failed:", error);
    // Return empty results instead of crashing the whole stream if search fails
    return [];
  }
}
