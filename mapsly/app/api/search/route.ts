// =============================================================================
// Mapsly — Search API Route (Tavily Web Search)
// =============================================================================

import { searchTools } from "@/lib/tavily";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // ---------- Content-Type check ----------
    const contentType = req.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return new Response(
        JSON.stringify({ error: "Content-Type must be application/json" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ---------- Parse & validate body ----------
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!body || typeof body !== "object" || !("query" in body)) {
      return new Response(
        JSON.stringify({ error: "Missing query field" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { query } = body as { query: string };

    if (typeof query !== "string" || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Query must be a non-empty string" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (query.trim().length > 2000) {
      return new Response(
        JSON.stringify({ error: "Query too long (max 2000 characters)" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ---------- Search ----------
    const results = await searchTools(query.trim());

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[search/route] Error:", error);
    return new Response(
      JSON.stringify({ error: "Search failed. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
