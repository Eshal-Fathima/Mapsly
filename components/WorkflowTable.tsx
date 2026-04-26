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
  const toolSearchUrl = (toolName: string) =>
    `https://www.google.com/search?q=${encodeURIComponent(toolName + " AI tool")}`;

  return (
    <div className="space-y-4">
      {/* Project summary badge */}
      <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-3">
        <p className="text-violet-300 text-sm font-medium">
          📋 {workflow.projectSummary}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/[0.04]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider w-12">
                Step
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Task
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Free Tool
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Paid Tool
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Why
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {workflow.steps.map((step) => (
              <tr
                key={step.stepNumber}
                className="hover:bg-white/[0.03] transition-colors duration-150"
              >
                {/* Step number */}
                <td className="px-4 py-3">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xs font-bold shadow-sm">
                    {step.stepNumber}
                  </span>
                </td>

                {/* Task */}
                <td className="px-4 py-3 text-gray-200 font-medium">
                  {step.task}
                </td>

                {/* Free tool */}
                <td className="px-4 py-3">
                  <a
                    href={toolSearchUrl(step.freeTool)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    {step.freeTool}
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                </td>

                {/* Paid tool */}
                <td className="px-4 py-3">
                  <a
                    href={toolSearchUrl(step.paidTool)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    {step.paidTool}
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                </td>

                {/* Reason */}
                <td className="px-4 py-3 text-gray-400 text-xs max-w-[200px]">
                  {step.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
