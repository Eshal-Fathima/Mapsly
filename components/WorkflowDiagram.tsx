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
function StepNode({ data }: NodeProps) {
  return (
    <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl px-6 py-5 min-w-[280px] shadow-lg shadow-black/40">
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-violet-500 !w-3 !h-3 !border-2 !border-[#0f0f1a]"
      />

      {/* Step header */}
      <div className="flex items-center gap-3 mb-3">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-[13px] font-bold">
          {data.stepNumber as number}
        </span>
        <span className="text-white text-[15px] font-bold leading-tight">
          {data.task as string}
        </span>
      </div>

      {/* Tools */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 flex-shrink-0" />
          <span className="text-gray-400 text-[13px]">Free:</span>
          <span className="text-emerald-400 font-semibold text-[14px]">{data.freeTool as string}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0" />
          <span className="text-gray-400 text-[13px]">Paid:</span>
          <span className="text-amber-400 font-semibold text-[14px]">{data.paidTool as string}</span>
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
    const n: Node[] = workflow.steps.map((step, i) => ({
      id: `step-${step.stepNumber}`,
      type: "stepNode",
      position: { x: i * 360, y: 150 },
      data: {
        stepNumber: step.stepNumber,
        task: step.task,
        freeTool: step.freeTool,
        paidTool: step.paidTool,
      },
    }));

    const e: Edge[] = workflow.steps.slice(0, -1).map((step, i) => ({
      id: `edge-${step.stepNumber}-${workflow.steps[i + 1].stepNumber}`,
      source: `step-${step.stepNumber}`,
      target: `step-${workflow.steps[i + 1].stepNumber}`,
      type: "smoothstep",
      animated: true,
      style: { stroke: "#8b5cf6", strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#8b5cf6",
      },
    }));

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
