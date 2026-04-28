"use client";

// =============================================================================
// Mapsly — Workflow Table Component (Dark Theme Reverted)
// =============================================================================

import { Workflow } from "@/lib/types";
import { ExternalLink, Sparkles } from "lucide-react";

interface WorkflowTableProps {
  workflow: Workflow;
}

export default function WorkflowTable({ workflow }: WorkflowTableProps) {
  /** Build a Google search URL for a tool name */
  const toolSearchUrl = (toolName: string) => {
    if (!toolName) return "#";
    return `https://www.google.com/search?q=${encodeURIComponent(toolName + " AI tool")}`;
  };

  if (!workflow || !Array.isArray(workflow.steps)) {
    return (
      <div className="p-8 text-center text-outline">
        No workflow data available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project summary banner */}
      {workflow.projectSummary && (
        <div className="glass-card accent-glow border-[#7c3aed]/20 rounded-2xl px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-container" />
            </div>
            <div>
              <p className="text-white font-semibold uppercase text-xs tracking-widest mb-1">Project Summary</p>
              <p className="text-primary text-lg font-bold leading-tight">
                {workflow.projectSummary}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 glass-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-container/50 border-b border-white/5">
              <th className="px-6 py-5 text-left text-[11px] font-black text-outline uppercase tracking-[0.2em] w-20">
                #
              </th>
              <th className="px-6 py-5 text-left text-[11px] font-black text-outline uppercase tracking-[0.2em]">
                Workflow Task
              </th>
              <th className="px-6 py-5 text-left text-[11px] font-black text-outline uppercase tracking-[0.2em]">
                Free Option
              </th>
              <th className="px-6 py-5 text-left text-[11px] font-black text-outline uppercase tracking-[0.2em]">
                Paid Option
              </th>
              <th className="px-6 py-5 text-left text-[11px] font-black text-outline uppercase tracking-[0.2em]">
                Strategic Reason
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {workflow.steps.map((step, idx) => (
              <tr
                key={step?.stepNumber ?? idx}
                className="hover:bg-primary-container/5 transition-colors duration-200 group"
              >
                {/* Step number */}
                <td className="px-6 py-6">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-surface-container border border-white/10 text-primary-container text-base font-black group-hover:scale-110 transition-transform">
                    {step?.stepNumber ?? (idx + 1)}
                  </span>
                </td>

                {/* Task */}
                <td className="px-6 py-6 text-white font-bold text-base">
                  {step?.task ?? "N/A"}
                </td>

                {/* Free tool */}
                <td className="px-6 py-6">
                  {step?.freeTool ? (
                    <a
                      href={toolSearchUrl(step.freeTool)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors font-bold text-[15px]"
                    >
                      {step.freeTool}
                      <ExternalLink className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ) : (
                    <span className="text-outline/50">—</span>
                  )}
                </td>

                {/* Paid tool */}
                <td className="px-6 py-6">
                  {step?.paidTool ? (
                    <a
                      href={toolSearchUrl(step.paidTool)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary-fixed hover:text-white transition-colors font-bold text-[15px]"
                    >
                      {step.paidTool}
                      <ExternalLink className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ) : (
                    <span className="text-outline/50">—</span>
                  )}
                </td>

                {/* Reason */}
                <td className="px-6 py-6 text-outline text-sm max-w-[300px] leading-relaxed italic">
                  &ldquo;{step?.reason ?? "N/A"}&rdquo;
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
