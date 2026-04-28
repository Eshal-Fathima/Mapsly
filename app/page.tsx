import ChatInterface from "@/components/ChatInterface";
import { Map, Sparkles, Zap, Shield } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* ================================================================= */}
      {/* HEADER                                                            */}
      {/* ================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0d0d1a]/80 backdrop-blur-md border-b border-white/10 transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center shadow-lg shadow-primary-container/20">
            <Map className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-none">
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
              className="glass-card flex items-center gap-2 px-4 py-2 rounded-full text-xs text-outline hover:text-white transition-colors cursor-default"
            >
              <Icon className="w-3.5 h-3.5 text-primary-container" />
              {label}
            </div>
          ))}
        </div>
      </header>

      {/* ================================================================= */}
      {/* MAIN CONTENT — CHAT                                               */}
      {/* ================================================================= */}
      <section className="flex-1 pt-24 pb-8">
        <ChatInterface />
      </section>

      {/* ================================================================= */}
      {/* FOOTER                                                            */}
      {/* ================================================================= */}
      <footer className="py-8 px-6 bg-[#0d0d1a] border-t border-white/5 text-center">
        <p className="text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Mapsly — Built with Next.js and Tailwind CSS 4
        </p>
      </footer>

    </main>
  );
}
