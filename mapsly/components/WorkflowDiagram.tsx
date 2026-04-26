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
    <div className="bg-[#1a1a2e] border border-white/10 rounded-xl px-5 py-4 min-w-[260px] max-w-[300px] shadow-lg shadow-black/30">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-violet-500 !w-3 !h-3 !border-2 !border-[#0f0f1a]"
      />

      {/* Step header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xs font-bold">
          {data.stepNumber as number}
        </span>
        <span className="text-white text-sm font-semibold leading-tight">
          {data.task as string}
        </span>
      </div>

      {/* Tools */}
      <div className="flex flex-col gap-1 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
          <span className="text-gray-400">Free:</span>
          <span className="text-emerald-400 font-medium">{data.freeTool as string}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
          <span className="text-gray-400">Paid:</span>
          <span className="text-amber-400 font-medium">{data.paidTool as string}</span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
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
      position: { x: 0, y: i * 160 },
      data: {
        stepNumber: step.stepNumber,
        task: step.task,
        freeTool: step.freeTool,
        paidTool: step.paidTool,
      },
    }));

    // Center nodes horizontally
    n.forEach((node) => {
      node.position.x = 150;
    });

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
    <div style={{ height: "100%", minHeight: 500 }} className="w-full">
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
