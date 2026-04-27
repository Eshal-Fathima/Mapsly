"use client";

// =============================================================================
// Mapsly — Workflow Diagram Component (ReactFlow)
// =============================================================================

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  ConnectionLineType,
  MarkerType,
  NodeProps,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Workflow } from "@/lib/types";

interface WorkflowDiagramProps {
  workflow: Workflow;
}

// ---------- Custom Node Component ----------
// ---------- Custom Node Component ----------
function StepNode({ data }: NodeProps) {
  if (!data) return null;

  return (
    <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 min-w-[280px] min-h-[160px] shadow-lg shadow-black/40 flex flex-col gap-5">
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-violet-500 !w-3 !h-3 !border-2 !border-[#0f0f1a]"
      />

      {/* Step header */}
      <div className="flex items-start gap-4">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-[14px] font-bold flex-shrink-0">
          {(data.stepNumber as number) ?? "?"}
        </span>
        <h3 className="text-white text-[16px] font-bold leading-snug whitespace-normal break-words">
          {(data.task as string) ?? "N/A"}
        </h3>
      </div>

      {/* Tools - Stacked vertically */}
      <div className="flex flex-col gap-4 mt-auto">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 flex-shrink-0" />
            <span className="text-gray-400 text-[12px] uppercase tracking-wider font-semibold">Free Tool</span>
          </div>
          <p className="text-emerald-400 font-bold text-[14px] pl-5 whitespace-normal break-words leading-tight">
            {(data.freeTool as string) ?? "N/A"}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0" />
            <span className="text-gray-400 text-[12px] uppercase tracking-wider font-semibold">Paid Tool</span>
          </div>
          <p className="text-amber-400 font-bold text-[14px] pl-5 whitespace-normal break-words leading-tight">
            {(data.paidTool as string) ?? "N/A"}
          </p>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-violet-500 !w-3 !h-3 !border-2 !border-[#0f0f1a]"
      />
    </div>
  );
}

const nodeTypes = { stepNode: StepNode };

export default function WorkflowDiagram({ workflow }: WorkflowDiagramProps) {
  // ---------- Generate nodes & edges ----------
  const { nodes, edges } = useMemo(() => {
    if (!workflow || !Array.isArray(workflow.steps)) {
       return { nodes: [], edges: [] };
    }

    const n: Node[] = workflow.steps.map((step, i) => ({
      id: `step-${step?.stepNumber ?? i}`,
      type: "stepNode",
      position: { x: i * 360, y: 150 },
      data: {
        stepNumber: step?.stepNumber,
        task: step?.task,
        freeTool: step?.freeTool,
        paidTool: step?.paidTool,
      },
    }));

    const e: Edge[] = (workflow.steps.length > 1) 
      ? workflow.steps.slice(0, -1).map((step, i) => ({
          id: `edge-${step?.stepNumber ?? i}-${workflow.steps[i+1]?.stepNumber ?? (i+1)}`,
          source: `step-${step?.stepNumber ?? i}`,
          target: `step-${workflow.steps[i + 1]?.stepNumber ?? (i+1)}`,
          type: "smoothstep",
          animated: true,
          style: { stroke: "#8b5cf6", strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#8b5cf6",
          },
        }))
      : [];

    return { nodes: n, edges: e };
  }, [workflow]);

  const onInit = useCallback(() => {
    // ReactFlow ready
  }, []);

  return (
    <div style={{ height: 600, minHeight: 600 }} className="w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onInit={onInit}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        panOnScroll
        zoomOnScroll
        className="!bg-[#0f0f1a]"
      >
        <Background color="#1e1e3a" gap={20} size={1} />
        <Controls
          className="!bg-white/5 !border-white/10 !rounded-xl !shadow-lg [&>button]:!bg-white/5 
                     [&>button]:!border-white/10 [&>button]:!text-gray-400 
                     [&>button:hover]:!bg-white/10"
        />
      </ReactFlow>
    </div>
  );
}
