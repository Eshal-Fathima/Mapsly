// =============================================================================
// Mapsly — Chat API Route (Claude Streaming with Tool Calling)
// =============================================================================

import { streamText, tool, UIMessage, convertToModelMessages, stepCountIs } from "ai";
import { z } from "zod";
import { anthropic, CLAUDE_MODEL, SYSTEM_PROMPT } from "@/lib/claude";
import { searchTools } from "@/lib/tavily";

export const maxDuration = 60;
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

    if (!body || typeof body !== "object" || !("messages" in body)) {
      return new Response(
        JSON.stringify({ error: "Missing messages field" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { messages } = body as { messages: UIMessage[] };

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages must be a non-empty array" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate last message content length
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && Array.isArray(lastMessage.parts)) {
      const lastContent = lastMessage.parts
        .filter((p) => p.type === "text")
        .map((p) => ("text" in p ? (p as { type: string; text: string }).text : ""))
        .join("");
      if (lastContent.trim().length > 2000) {
        return new Response(
          JSON.stringify({ error: "Message too long (max 2000 characters)" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // ---------- Stream with Claude ----------
    const result = streamText({
      model: anthropic(CLAUDE_MODEL),
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      tools: {
        search_tools: tool({
          description:
            "Search the web for the latest AI tools relevant to the user's project. Call this BEFORE recommending any tools.",
          inputSchema: z.object({
            query: z
              .string()
              .describe(
                "Search query to find relevant AI tools, e.g. 'best AI tools for mobile app development 2025 free and paid'"
              ),
          }),
          execute: async ({ query }) => {
            const results = await searchTools(query);
            return results;
          },
        }),
      },
      stopWhen: stepCountIs(3),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[chat/route] Error:", error);
    return new Response(
      JSON.stringify({ error: "An internal error occurred. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
