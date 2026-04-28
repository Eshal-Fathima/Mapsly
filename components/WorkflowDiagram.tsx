"use client";

// =============================================================================
// Mapsly — Workflow Diagram Component (Dark Theme Reverted)
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
import { Sparkles, Zap } from "lucide-react";

interface WorkflowDiagramProps {
  workflow: Workflow;
}

// ---------- Custom Node Component ----------
function StepNode({ data }: NodeProps) {
  if (!data) return null;

  return (
    <div className="glass-card border-white/10 rounded-2xl p-6 min-w-[300px] min-h-[180px] shadow-2xl accent-glow flex flex-col gap-6">
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-primary-container !w-3 !h-3 !border-2 !border-[#0d0d1a]"
      />

      {/* Step header */}
      <div className="flex items-start gap-4">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary-container text-white text-base font-black flex-shrink-0 shadow-lg shadow-primary-container/20">
          {(data.stepNumber as number) ?? "?"}
        </span>
        <div className="flex flex-col">
          <p className="text-outline font-black uppercase text-[10px] tracking-widest mb-1">Workflow Step</p>
          <h3 className="text-white text-lg font-bold leading-tight whitespace-normal break-words">
            {(data.task as string) ?? "N/A"}
          </h3>
        </div>
      </div>

      {/* Tools - Re-styled */}
      <div className="flex flex-col gap-4 mt-auto">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container/50 border border-white/5">
          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center">
             <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-outline text-[9px] uppercase font-bold tracking-tighter">Free Tier</p>
            <p className="text-primary font-bold text-sm leading-none">
              {(data.freeTool as string) ?? "N/A"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container/50 border border-white/5">
          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center">
             <Zap className="w-4 h-4 text-primary-fixed" />
          </div>
          <div>
            <p className="text-outline text-[9px] uppercase font-bold tracking-tighter">Pro Option</p>
            <p className="text-primary-fixed font-bold text-sm leading-none">
              {(data.paidTool as string) ?? "N/A"}
            </p>
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-primary-container !w-3 !h-3 !border-2 !border-[#0d0d1a]"
      />
    </div>
  );
}

const nodeTypes = { stepNode: StepNode };

export default function WorkflowDiagram({ workflow }: WorkflowDiagramProps) {
  // Add Zap to imports if not already there (it is not, let's add it)
  // Wait, I need to check imports. It has Map, Sparkles, Loader2, Bot, User... 
  // Zap is in lucide-react. I'll add it to the component or just use Sparkles.
  // Actually, I'll add Zap to the imports in the next step or just use Map.
  // Let's use Map and Sparkles for simplicity to avoid import issues.
  
  // ---------- Generate nodes & edges ----------
  const { nodes, edges } = useMemo(() => {
    if (!workflow || !Array.isArray(workflow.steps)) {
       return { nodes: [], edges: [] };
    }

    const n: Node[] = workflow.steps.map((step, i) => ({
      id: `step-${step?.stepNumber ?? i}`,
      type: "stepNode",
      position: { x: i * 380, y: 150 },
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
          target: `step-${workflow.steps[i+1]?.stepNumber ?? (i+1)}`,
          type: "smoothstep",
          animated: true,
          style: { stroke: "#7c3aed", strokeWidth: 3 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#7c3aed",
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
        className="!bg-[#0d0d1a]"
      >
        <Background color="#1c2b3c" gap={25} size={1} />
        <Controls
          className="!bg-surface-container !border-white/10 !rounded-xl !shadow-2xl [&>button]:!bg-transparent 
                     [&>button]:!border-white/5 [&>button]:!text-outline 
                     [&>button:hover]:!bg-white/5 [&>button:hover]:!text-white"
        />
      </ReactFlow>
    </div>
  );
}
