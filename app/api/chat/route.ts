// Mapsly — Chat API Route (Groq Streaming with Tool Calling)

import { streamText, tool, UIMessage, convertToModelMessages, stepCountIs } from "ai";
import { z } from "zod";
import { groq } from "@ai-sdk/groq";
import { searchTools } from "@/lib/tavily";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are Mapsly, an expert AI workflow consultant. Your job is to map out exactly which AI tools a student or developer should use for their project, in what order — like a GPS for building with AI.

PHASE 1 — GATHER CONTEXT (max 3 questions, ask one at a time):
- What are they building? (get specific)
- What is their skill level? (beginner / intermediate / advanced)
- What is their timeline and budget? (free only, or open to paid tools?)

Be conversational and encouraging. Use emoji sparingly but naturally. Keep each question short (1-2 sentences max).

PHASE 2 — SEARCH:
Once you have enough context (after 2-3 exchanges), call the search_tools function with a targeted query like:
"best AI tools for [task] 2025 free and paid latest"
Always search before recommending. Never suggest a tool without verifying it is active and relevant.

PHASE 3 — OUTPUT:
After receiving search results, return a JSON object in this exact format inside a markdown code block tagged as "workflow":

\`\`\`workflow
{
  "projectSummary": "one sentence describing the student's project",
  "steps": [
    {
      "stepNumber": 1,
      "task": "Plan and structure the project",
      "freeTool": "Notion AI",
      "paidTool": "Notion AI Plus",
      "reason": "Best for structured planning with AI assistance"
    }
  ]
}
\`\`\`

Return 4-7 steps. Always include both a free and paid option per step. Make tasks specific to the user's project — never generic.

After the workflow block, add a brief friendly summary saying what you mapped out and invite any follow-up questions.

IMPORTANT RULES:
- Never output the workflow JSON until you have both gathered context AND searched for tools.
- If a user asks a non-project question, gently redirect them to describe their project.
- Keep responses concise. No essays.`;

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
        .filter((p) => p && p.type === "text")
        .map((p) => ("text" in p ? (p as { type: string; text: string }).text : ""))
        .join("");
      if (lastContent.trim().length > 2000) {
        return new Response(
          JSON.stringify({ error: "Message too long (max 2000 characters)" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // ---------- Stream with Groq ----------
    const model = groq("llama-3.3-70b-versatile");
    const result = streamText({
      model,
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages).catch(err => {
        console.error("[chat/route] Conversion failed:", err);
        return [];
      }),
      toolChoice: "auto",
      tools: {
        search_tools: tool({
          description: "Search for current AI tools online.",
          inputSchema: z.object({
            query: z.string().describe("The search query for tool discovery."),
          }),
          execute: async ({ query }) => {
            try {
              const results = await searchTools(query);
              return results ?? [];
            } catch (err) {
              console.error("[chat/route] Tool execution failed:", err);
              return [];
            }
          },
        }),
      },
      stopWhen: stepCountIs(3),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[chat/route] Primary error:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong, please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
