import ChatInterface from "@/components/ChatInterface";
import { Map, Sparkles, Zap, Shield } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* ================================================================= */}
      {/* HEADER                                                            */}
      {/* ================================================================= */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Map className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              Mapsly
            </h1>
            <p className="text-[10px] text-gray-500 -mt-0.5 font-medium uppercase tracking-widest">
              AI Workflow Map
            </p>
          </div>
        </div>

        {/* Feature pills */}
        <div className="hidden md:flex items-center gap-2">
          {[
            { icon: Sparkles, label: "AI-Powered" },
            { icon: Zap, label: "Real-time Search" },
            { icon: Shield, label: "Free & Paid Tools" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-gray-400"
            >
              <Icon className="w-3 h-3 text-violet-400" />
              {label}
            </div>
          ))}
        </div>
      </header>

      {/* ================================================================= */}
      {/* MAIN CONTENT — CHAT                                               */}
      {/* ================================================================= */}
      <section className="flex-1 py-6">
        <ChatInterface />
      </section>

    </main>
  );
}
