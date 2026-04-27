// =============================================================================
// Mapsly — TypeScript Types
// =============================================================================

/** A single step in the AI workflow map */
export interface WorkflowStep {
  stepNumber: number;
  task: string;
  freeTool: string;
  paidTool: string;
  reason: string;
}

/** The full workflow output from Groq */
export interface Workflow {
  projectSummary: string;
  steps: WorkflowStep[];
}

/** Tavily search result item */
export interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

/** Tavily API response */
export interface TavilyResponse {
  results: TavilyResult[];
}

/** Search tool arguments */
export interface SearchToolArgs {
  query: string;
}
