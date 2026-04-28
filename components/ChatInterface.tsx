"use client";

// =============================================================================
// Mapsly — Chat Interface Component (Dark Theme Reverted)
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
  Zap,
} from "lucide-react";
import { Workflow } from "@/lib/types";
import WorkflowTable from "./WorkflowTable";
import WorkflowDiagram from "./WorkflowDiagram";

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
      await sendMessage({
        text: currentInput,
      });
    } catch (err) {
      console.error("[ChatInterface] handleSubmit error:", err);
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    try {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } catch (err) {
      console.error("[ChatInterface] Auto-scroll error:", err);
    }
  }, [messages]);

  // Focus input on mount & Global rejection catch
  useEffect(() => {
    inputRef.current?.focus();

    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error("[Global] Unhandled promise rejection:", event.reason);
      event.preventDefault();
    };

    window.addEventListener("unhandledrejection", handleRejection);
    return () => window.removeEventListener("unhandledrejection", handleRejection);
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
    <div className="flex flex-col w-full h-full max-w-full mx-auto overflow-hidden">
      {/* ================================================================= */}
      {/* CHAT PANEL                                                        */}
      {/* ================================================================= */}
      <div
        className="flex-1 flex flex-col w-full max-w-full mx-auto px-6 overflow-hidden min-h-0"
      >
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-4 scrollbar-thin">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center flex-1 text-center space-y-10 animate-fade-in py-8 px-4 overflow-hidden">
              <div className="relative flex-shrink-0 mb-4">
                <div className="w-24 h-24 rounded-3xl bg-surface-container flex items-center justify-center shadow-2xl border border-white/10 accent-glow transform hover:scale-110 transition-transform duration-500">
                  <Map className="w-12 h-12 text-primary-container" />
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shadow-lg animate-pulse">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="max-w-4xl flex-shrink-0">
                <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-[1.1]">
                  What are you <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d2bbff] to-[#7c3aed]">building?</span>
                </h2>
                <p className="text-outline max-w-2xl mx-auto text-lg md:text-xl leading-relaxed font-medium">
                  Tell me about your project and I&apos;ll map out the perfect
                  AI-powered workflow with the best tools available.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 justify-center max-w-4xl flex-shrink-0">
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
                    className="glass-card px-6 py-3 rounded-full text-sm md:text-base text-on-surface font-semibold
                               hover:border-[#7c3aed]/50 hover:bg-primary-container/10 transition-all duration-300 
                               cursor-pointer flex items-center gap-3 group"
                  >
                    <span className="text-primary-container group-hover:scale-125 transition-transform">✦</span>
                    {suggestion}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-4 text-outline text-xs mt-6 opacity-60 flex-shrink-0 font-bold uppercase tracking-widest">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#7c3aed]/50"></div>
                <span>Describe your idea below to map it</span>
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#7c3aed]/50"></div>
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
                  className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                    isAssistant
                      ? "bg-surface-container border border-white/10"
                      : "bg-surface-container-highest border border-white/10"
                  }`}
                >
                  {isAssistant ? (
                    <Bot className="w-5 h-5 text-primary-container" />
                  ) : (
                    <User className="w-5 h-5 text-outline" />
                  )}
                </div>

                {/* Message bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm md:text-base leading-relaxed ${
                    isAssistant
                      ? "glass-card text-on-surface"
                      : "bg-primary-container text-white accent-glow"
                  }`}
                >
                  {displayContent && (
                    <div className="whitespace-pre-wrap">{displayContent}</div>
                  )}
                  {workflow && (
                    <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">Workflow Generated Map</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 animate-slide-up">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-surface-container border border-white/10 flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-primary-container" />
              </div>
              <div className="glass-card rounded-2xl px-5 py-4">
                <div className="flex items-center gap-3 text-outline text-sm md:text-base">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
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
          className="flex-shrink-0 flex gap-4 p-1.5 glass-card accent-glow border-white/20 rounded-xl mb-4"
        >
          <input
            suppressHydrationWarning
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Type your project idea here..."
            maxLength={2000}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-transparent text-on-background placeholder:text-outline text-sm md:text-base outline-none disabled:opacity-50"
          />
          <button
            suppressHydrationWarning
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex items-center justify-center p-3 md:px-6 rounded-xl bg-primary-container text-white 
                       hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed 
                       transition-all duration-200 shadow-lg shadow-primary-container/20"
          >
            <Send className="w-5 h-5 md:mr-2" />
            <span className="hidden md:inline font-bold">Generate</span>
          </button>
        </form>
      </div>

      {/* ================================================================= */}
      {/* WORKFLOW PANEL (appears when workflow is generated)                */}
      {/* ================================================================= */}
      {latestWorkflow && (
        <div className="w-full flex flex-col animate-slide-up px-6">
          {/* Tab bar */}
          <div className="flex items-center gap-1 mb-4 glass-card p-1 rounded-xl">
            <button
              suppressHydrationWarning
              onClick={() => setActiveTab("table")}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                activeTab === "table"
                  ? "bg-primary-container text-white shadow-lg shadow-primary-container/30"
                  : "text-outline hover:text-white hover:bg-white/5"
              }`}
            >
              📊 Table View
            </button>
            <button
              suppressHydrationWarning
              onClick={() => setActiveTab("diagram")}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                activeTab === "diagram"
                  ? "bg-primary-container text-white shadow-lg shadow-primary-container/30"
                  : "text-outline hover:text-white hover:bg-white/5"
              }`}
            >
              🗺️ Flowchart
            </button>
          </div>

          {/* Content area */}
          <div className="flex-1 glass-card border-white/10 rounded-3xl overflow-hidden min-h-[650px] shadow-2xl">
            {activeTab === "table" ? (
              <div className="p-6 overflow-auto h-full">
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