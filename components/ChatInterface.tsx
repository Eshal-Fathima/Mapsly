"use client";

// =============================================================================
// Mapsly — Chat Interface Component
// =============================================================================

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect, useMemo } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  Map,
  ChevronDown,
} from "lucide-react";
import { Workflow } from "@/lib/types";
import WorkflowTable from "./WorkflowTable";
import WorkflowDiagram from "./WorkflowDiagram";

/** Get plain text content from a message (handles both v5 string content and v6 parts) */
/** Get plain text content from a message (handles both v5 string content and v6 parts) */
function getMessageText(message: { content?: string; parts?: Array<{ type: string; text?: string }> }): string {
  if (!message) return "";
  
  if (message.parts && Array.isArray(message.parts)) {
    return message.parts
      .filter((p) => p && p.type === "text")
      .map((p) => p?.text ?? "")
      .join("");
  }
  if (typeof message.content === "string") {
    return message.content;
  }
  return "";
}

/** Extract workflow JSON from ```workflow code blocks */
function parseWorkflow(text: string): Workflow | null {
  if (!text) return null;
  
  const regex = /```workflow\s*([\s\S]*?)```/;
  const match = text.match(regex);
  if (!match || !match[1]) return null;

  try {
    const rawJson = match[1].trim();
    if (!rawJson) return null;
    
    const parsed = JSON.parse(rawJson);
    if (parsed && typeof parsed === "object" && Array.isArray(parsed.steps)) {
      // Basic structure validation
      if (parsed.steps.length > 0) {
        return parsed as Workflow;
      }
    }
  } catch (err) {
    console.error("[ChatInterface] Failed to parse workflow JSON:", err);
  }
  return null;
}

/** Strip workflow code block from display text */
function stripWorkflowBlock(text: string): string {
  if (!text) return "";
  return text.replace(/```workflow\s*[\s\S]*?```/g, "").trim();
}

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (err) => {
      console.error("[ChatInterface] useChat error:", err);
    }
  });

  const isLoading = status === "streaming" || status === "submitted";

  const [activeTab, setActiveTab] = useState<"table" | "diagram">("table");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value ?? "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input || !input.trim() || isLoading) return;

    try {
      const currentInput = input;
      setInput("");
      await sendMessage({ text: currentInput });
    } catch (err) {
      console.error("[ChatInterface] handleSubmit error:", err);
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Find the latest workflow from any assistant message
  const latestWorkflow = useMemo(() => {
    if (!messages || !Array.isArray(messages)) return null;
    
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg && msg.role === "assistant") {
        const text = getMessageText(msg);
        if (text) {
          const wf = parseWorkflow(text);
          if (wf) return wf;
        }
      }
    }
    return null;
  }, [messages]);

  return (
    <div className="flex flex-col gap-8 w-full max-w-full mx-auto pb-12 overflow-y-auto scrollbar-thin">
      {/* ================================================================= */}
      {/* CHAT PANEL                                                        */}
      {/* ================================================================= */}
      <div
        className="flex flex-col w-full max-w-full mx-auto px-6 transition-all duration-500"
      >
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-4 scrollbar-thin">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-fade-in">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                  <Map className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  What are you building?
                </h2>
                <p className="text-gray-400 max-w-md text-sm leading-relaxed">
                  Tell me about your project and I&apos;ll map out the perfect
                  AI-powered workflow — with the best free and paid tools for
                  every step.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {[
                  "A mobile app that identifies plants from photos",
                  "An AI chatbot for customer support",
                  "A tool to summarize research papers",
                  "A music recommendation engine",
                ].map((suggestion) => (
                  <button
                    suppressHydrationWarning
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="text-xs px-3 py-2 rounded-xl bg-white/5 text-gray-300 border border-white/10 
                               hover:bg-violet-500/20 hover:border-violet-500/30 hover:text-violet-300 
                               transition-all duration-200 cursor-pointer"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-xs mt-2 animate-bounce">
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Type below to get started</span>
              </div>
            </div>
          )}

          {messages.map((message) => {
            const isAssistant = message.role === "assistant";
            const fullText = getMessageText(message);
            const workflow = isAssistant ? parseWorkflow(fullText) : null;
            const displayContent = isAssistant
              ? stripWorkflowBlock(fullText)
              : fullText;

            return (
              <div
                key={message.id}
                className={`flex gap-3 animate-slide-up ${
                  isAssistant ? "" : "flex-row-reverse"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                    isAssistant
                      ? "bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-500/20"
                      : "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/20"
                  }`}
                >
                  {isAssistant ? (
                    <Bot className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Message bubble */}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isAssistant
                      ? "bg-white/[0.06] text-gray-200 border border-white/[0.08]"
                      : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                  }`}
                >
                  {displayContent && (
                    <div className="whitespace-pre-wrap">{displayContent}</div>
                  )}
                  {workflow && (
                    <div className="mt-3 text-xs text-violet-400 flex items-center gap-1.5 font-medium">
                      <Sparkles className="w-3.5 h-3.5" />
                      Workflow generated — see it on the right →
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 animate-slide-up">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/20">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="flex justify-center animate-slide-up">
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm max-w-md text-center">
                Something went wrong. Please try again.
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form
          onSubmit={handleSubmit}
          className="flex gap-3 pt-4 border-t border-white/[0.06]"
        >
          <input
            suppressHydrationWarning
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Describe what you want to build..."
            maxLength={2000}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white 
                       placeholder-gray-500 text-sm outline-none 
                       focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 
                       disabled:opacity-50 transition-all duration-200"
          />
          <button
            suppressHydrationWarning
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white 
                       hover:from-violet-500 hover:to-indigo-500 
                       disabled:opacity-40 disabled:cursor-not-allowed 
                       transition-all duration-200 shadow-lg shadow-violet-500/20 
                       hover:shadow-violet-500/30 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* ================================================================= */}
      {/* WORKFLOW PANEL (appears when workflow is generated)                */}
      {/* ================================================================= */}
      {latestWorkflow && (
        <div className="w-full flex flex-col animate-slide-up px-6">
          {/* Tab bar */}
          <div className="flex items-center gap-1 mb-4 bg-white/[0.04] p-1 rounded-xl border border-white/[0.08]">
            <button
              suppressHydrationWarning
              onClick={() => setActiveTab("table")}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "table"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                  : "text-gray-400 hover:text-gray-300 hover:bg-white/[0.05]"
              }`}
            >
              📊 Table View
            </button>
            <button
              suppressHydrationWarning
              onClick={() => setActiveTab("diagram")}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "diagram"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                  : "text-gray-400 hover:text-gray-300 hover:bg-white/[0.05]"
              }`}
            >
              🗺️ Flowchart
            </button>
          </div>

          {/* Content area */}
          <div className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
            {activeTab === "table" ? (
              <div className="p-4 overflow-auto h-full">
                <WorkflowTable workflow={latestWorkflow} />
              </div>
            ) : (
              <WorkflowDiagram workflow={latestWorkflow} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}