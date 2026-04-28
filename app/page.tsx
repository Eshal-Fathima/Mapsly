import ChatInterface from "@/components/ChatInterface";
import { Map, Sparkles, Zap, Shield } from "lucide-react";

export default function Home() {
  return (
    <main className="h-screen flex flex-col overflow-hidden bg-[#0d0d1a]">
      {/* ================================================================= */}
      {/* HEADER                                                            */}
      {/* ================================================================= */}
      <header className="flex-shrink-0 flex items-center justify-between px-6 py-3 bg-[#0d0d1a]/80 backdrop-blur-md border-b border-white/10 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center shadow-lg shadow-primary-container/20">
            <Map className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-none">
              Mapsly
            </h1>
            <p className="text-[10px] text-outline mt-1 font-bold uppercase tracking-[0.2em]">
              AI Workflow Map
            </p>
          </div>
        </div>

        {/* Feature pills */}
        <div className="hidden md:flex items-center gap-3">
          {[
            { icon: Sparkles, label: "AI-Powered" },
            { icon: Zap, label: "Real-time Search" },
            { icon: Shield, label: "Free & Paid Tools" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="glass-card flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] text-outline hover:text-white transition-colors cursor-default"
            >
              <Icon className="w-3 h-3 text-primary-container" />
              {label}
            </div>
          ))}
        </div>
      </header>

      {/* ================================================================= */}
      {/* MAIN CONTENT — CHAT                                               */}
      {/* ================================================================= */}
      <section className="flex-1 overflow-hidden">
        <ChatInterface />
      </section>

      {/* ================================================================= */}
      {/* FOOTER (Minimal)                                                  */}
      {/* ================================================================= */}
      <footer className="flex-shrink-0 py-2 px-6 border-t border-white/5 text-center">
        <p className="text-slate-600 text-[10px]">
          &copy; {new Date().getFullYear()} Mapsly — Built with Next.js & Tailwind 4
        </p>
      </footer>
    </main>
  );
}
