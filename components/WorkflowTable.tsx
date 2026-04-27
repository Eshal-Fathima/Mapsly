"use client";

// =============================================================================
// Mapsly — Workflow Table Component
// =============================================================================

import { Workflow } from "@/lib/types";
import { ExternalLink } from "lucide-react";

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
      <div className="p-8 text-center text-gray-500">
        No workflow data available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Project summary badge */}
      {workflow.projectSummary && (
        <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl px-5 py-4">
          <p className="text-violet-300 text-[15px] font-semibold">
            📋 {workflow.projectSummary}
          </p>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
        <table className="w-full text-sm">
          <thead>
            {/* ... same headers ... */}
            <tr className="bg-white/[0.04]">
              <th className="px-6 py-4 text-left text-[13px] font-bold text-gray-400 uppercase tracking-wider w-16">
                Step
              </th>
              <th className="px-6 py-4 text-left text-[13px] font-bold text-gray-400 uppercase tracking-wider">
                Task
              </th>
              <th className="px-6 py-4 text-left text-[13px] font-bold text-gray-400 uppercase tracking-wider">
                Free Tool
              </th>
              <th className="px-6 py-4 text-left text-[13px] font-bold text-gray-400 uppercase tracking-wider">
                Paid Tool
              </th>
              <th className="px-6 py-4 text-left text-[13px] font-bold text-gray-400 uppercase tracking-wider">
                Why
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {workflow.steps.map((step, idx) => (
              <tr
                key={step?.stepNumber ?? idx}
                className="hover:bg-white/[0.03] transition-colors duration-150"
              >
                {/* Step number */}
                <td className="px-6 py-5">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-sm font-bold shadow-sm">
                    {step?.stepNumber ?? (idx + 1)}
                  </span>
                </td>

                {/* Task */}
                <td className="px-6 py-5 text-gray-200 font-semibold text-[15px]">
                  {step?.task ?? "N/A"}
                </td>

                {/* Free tool */}
                <td className="px-6 py-5">
                  {step?.freeTool ? (
                    <a
                      href={toolSearchUrl(step.freeTool)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-medium text-[15px]"
                    >
                      {step.freeTool}
                      <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                    </a>
                  ) : (
                    <span className="text-gray-600">N/A</span>
                  )}
                </td>

                {/* Paid tool */}
                <td className="px-6 py-5">
                  {step?.paidTool ? (
                    <a
                      href={toolSearchUrl(step.paidTool)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors font-medium text-[15px]"
                    >
                      {step.paidTool}
                      <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                    </a>
                  ) : (
                    <span className="text-gray-600">N/A</span>
                  )}
                </td>

                {/* Reason */}
                <td className="px-6 py-5 text-gray-400 text-sm max-w-[300px] leading-relaxed">
                  {step?.reason ?? "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
