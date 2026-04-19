# FlowForge HR — Architecture Document

**Tredence Full Stack Engineering Intern — Case Study Submission**  
**Madankumar Senthilkumar** | ms0585@srmist.edu.in

---

## Overview

FlowForge HR is a visual HR Workflow Designer built with React, TypeScript, and React Flow. HR admins can drag-and-drop nodes onto a canvas, configure each step with a type-safe form, validate the graph, simulate execution step-by-step, and optionally analyze the workflow with an LLM for AI-driven insights.

The AI analysis layer is the key differentiator: a candidate applying for an AI Agentic platform role who independently integrates LLM reasoning into a frontend prototype demonstrates AI-first product thinking — not just UI skills.

---

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Vite + React 18 + TypeScript** | Matches JD; fast HMR; strict typing throughout |
| Canvas | **@xyflow/react v12** | Required by spec; handles node/edge state natively |
| Styling | **Tailwind CSS v3** | Required by JD; dark design system via custom tokens |
| State | **Zustand** | Selector-based; prevents form panel re-renders during node drag |
| Mock API | **MSW v2** | Intercepts `fetch()` in the browser — no extra server process |
| AI Layer | **Anthropic Claude 3.5 Sonnet** | Direct `fetch()` call — transparent, no SDK bloat |
| Icons | **Lucide React** | Consistent, tree-shakable |

---

## Folder Structure

```
src/
├── api/
│   ├── automations.ts        # GET /automations fetch wrapper
│   ├── simulate.ts           # POST /simulate fetch wrapper
│   ├── analyze.ts            # POST to Anthropic API + prompt builder
│   └── index.ts              # Barrel export
│
├── components/
│   ├── canvas/
│   │   ├── WorkflowCanvas.tsx     # ReactFlow provider, drag-drop, minimap
│   │   ├── Sidebar.tsx            # Draggable node palette (5 types)
│   │   └── CanvasToolbar.tsx      # Zoom, fit-view, export JSON, import JSON, clear
│   │
│   ├── nodes/
│   │   ├── BaseNode.tsx           # Shared shell: handles, delete button, validation highlight
│   │   ├── StartNode.tsx
│   │   ├── TaskNode.tsx
│   │   ├── ApprovalNode.tsx
│   │   ├── AutomatedStepNode.tsx
│   │   ├── EndNode.tsx
│   │   └── nodeRegistry.ts        # { [NodeType]: Component } — extensible map
│   │
│   ├── forms/
│   │   ├── NodeFormPanel.tsx      # Switches to correct form by discriminated type
│   │   ├── StartForm.tsx
│   │   ├── TaskForm.tsx
│   │   ├── ApprovalForm.tsx
│   │   ├── AutomatedStepForm.tsx  # Fetches /automations, renders dynamic param fields
│   │   ├── EndForm.tsx
│   │   └── KeyValueInput.tsx      # Reusable add/remove key-value pair component
│   │
│   ├── sandbox/
│   │   ├── SandboxPanel.tsx       # Validates → calls /simulate → shows log
│   │   ├── ExecutionLog.tsx       # Step-by-step timeline with status icons
│   │   └── ValidationBanner.tsx   # Error/warning list shown before simulation
│   │
│   └── ai/
│       ├── AIAnalysisPanel.tsx    # Calls Anthropic API, renders issues/suggestions/summary
│       └── AIInsightCard.tsx      # Colored card per insight category
│
├── hooks/
│   ├── useWorkflowStore.ts        # Zustand store (nodes, edges, CRUD, import/export)
│   ├── useDragDrop.ts             # onDrop handler using screenToFlowPosition
│   ├── useSimulate.ts             # Calls /simulate, manages loading/error/result state
│   ├── useValidation.ts           # Derives ValidationError[] reactively from store
│   └── useAIAnalysis.ts           # Calls Anthropic API, manages loading/error/result
│
├── mocks/
│   ├── browser.ts                 # MSW worker setup (started in main.tsx before React mount)
│   ├── handlers/
│   │   ├── automations.handler.ts # GET /automations → returns 6 mock actions
│   │   └── simulate.handler.ts    # POST /simulate → topological sort + status assignment
│   └── data/
│       └── automations.data.ts    # Static automation action definitions
│
├── types/
│   ├── nodes.ts                   # NodeType const + discriminated union data types
│   ├── workflow.ts                # WorkflowGraph, SimulationResult, ValidationError, AIAnalysis
│   └── api.ts                     # AutomationAction, SimulatePayload
│
├── utils/
│   ├── graphSerializer.ts         # nodes[] + edges[] → clean WorkflowGraph JSON
│   ├── cycleDetector.ts           # DFS-based directed cycle detection
│   ├── workflowValidator.ts       # Validation rules → ValidationError[]
│   └── nanoid.ts                  # Lightweight unique ID (no external package)
│
├── App.tsx                        # Root layout: Header | Sidebar | Canvas | RightPanel
└── main.tsx                       # Starts MSW worker, then mounts React
```

---

## State Architecture (Zustand)

A single store manages all workflow state. The form panel subscribes only to `selectedNodeId` and `nodes[id].data` — not to the full node array — which prevents it from re-rendering on every canvas drag.

```ts
interface WorkflowStore {
  nodes: Node<WorkflowNodeData>[]
  edges: Edge[]
  selectedNodeId: string | null

  onNodesChange: OnNodesChange<Node<WorkflowNodeData>>
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  setSelectedNode: (id: string | null) => void
  updateNodeData: (id: string, data: Partial<WorkflowNodeData>) => void
  addNode: (type: NodeType, position: XYPosition) => void
  deleteNode: (id: string) => void
  clearWorkflow: () => void
  importWorkflow: (nodes: Node<WorkflowNodeData>[], edges: Edge[]) => void
}
```

**Why Zustand over Context:** React Context re-renders every consumer on every state change. During a node drag, React Flow fires hundreds of position updates per second. Zustand's selector system confines those re-renders to the canvas — the form panel stays idle.

---

## Type System

TypeScript's `enum` keyword is disallowed by `erasableSyntaxOnly` (TS 5.8+). A `const` object + type alias provides identical runtime behavior with full type narrowing:

```ts
export const NodeType = {
  Start: 'start',
  Task: 'task',
  Approval: 'approval',
  AutomatedStep: 'automatedStep',
  End: 'end',
} as const

export type NodeType = (typeof NodeType)[keyof typeof NodeType]
```

Each node data interface extends `Record<string, unknown>` (required by @xyflow/react v12's generic constraint) while retaining its specific typed fields:

```ts
export interface TaskNodeData extends Record<string, unknown> {
  type: 'task'
  label: string
  description: string
  assignee: string
  dueDate: string
  customFields: Record<string, string>
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedStepNodeData
  | EndNodeData
```

`NodeFormPanel` switches on `data.type` — TypeScript narrows the union to the exact interface in each branch. No `any`, no optional fields, no casting.

---

## Mock API Layer (MSW)

MSW registers a Service Worker (`public/mockServiceWorker.js`) that intercepts `fetch()` calls at the network level. No proxy, no separate process.

**`GET /automations`** returns 6 mock automation actions:

```json
[
  { "id": "send_email",       "label": "Send Email",         "params": ["to", "subject"] },
  { "id": "generate_doc",     "label": "Generate Document",  "params": ["template", "recipient"] },
  { "id": "notify_slack",     "label": "Notify Slack",       "params": ["channel", "message"] },
  { "id": "create_jira",      "label": "Create Jira Ticket", "params": ["project", "title"] },
  { "id": "update_hris",      "label": "Update HRIS Record", "params": ["employeeId", "field", "value"] },
  { "id": "schedule_meeting", "label": "Schedule Meeting",   "params": ["attendees", "agenda", "date"] }
]
```

**`POST /simulate`** accepts a `WorkflowGraph` and returns a `SimulationResult`:

1. Runs a **topological sort** (Kahn's algorithm) on the edges to determine execution order
2. Assigns status per node:
   - `start`, `task`, `automatedStep`, `end` → `completed`
   - `approval` → `pending` if `autoApproveThreshold === 0`, else `completed` (models SLA-based auto-approval)
   - Any node after a `pending` step → `skipped`
3. Returns step array + a plain-English summary

```json
{
  "steps": [
    { "nodeId": "a1", "type": "start",    "label": "Onboarding Start",   "status": "completed", "duration": 0 },
    { "nodeId": "a2", "type": "task",     "label": "Collect Documents",  "status": "completed", "duration": 3 },
    { "nodeId": "a3", "type": "approval", "label": "Manager Approval",   "status": "pending",   "duration": null, "detail": "Waiting for human action" },
    { "nodeId": "a4", "type": "end",      "label": "End",                "status": "skipped",   "duration": null }
  ],
  "summary": "⏳ Paused at \"Manager Approval\" — awaiting human approval."
}
```

---

## AI Analysis Layer

`api/analyze.ts` calls the Anthropic Messages API directly from the browser. MSW is configured with `onUnhandledRequest: 'bypass'`, so this request is never intercepted.

```ts
export async function analyzeWorkflow(graph: WorkflowGraph): Promise<AIAnalysis> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{ role: 'user', content: buildAnalysisPrompt(graph) }],
    }),
  })
  const data = await res.json()
  return JSON.parse(data.content[0].text) as AIAnalysis
}
```

The prompt instructs Claude to return structured JSON with three keys: `issues`, `suggestions`, `summary`. The response JSON is parsed and rendered in distinct `AIInsightCard` components — one per category.

The API key lives in `.env.local` (git-ignored). `.env.example` documents the variable name. If the key is absent, the AI panel shows a clear warning and the rest of the app functions normally.

---

## Validation Rules

`workflowValidator.ts` runs reactively via `useValidation` (a `useMemo` over store state). It also runs before every simulation to block invalid graphs.

| Rule | Severity |
|---|---|
| Exactly one Start node required | error |
| At least one End node required | error |
| No disconnected nodes (when > 1 node on canvas) | warning |
| No directed cycles (DFS-based detection) | error |

Nodes with a matching `nodeId` in the error list get a colored ring rendered by `BaseNode` — red for errors, amber for warnings.

---

## Application Layout

```
┌────────────────────────────────────────────────────────────────────┐
│  FlowForge HR                          Tredence Case Study  AI-Pow │
├──────────┬─────────────────────────────────────┬───────────────────┤
│          │  [Zoom+] [Zoom-] [Fit] [↓] [↑] [🗑] │                   │
│ NODE     ├─────────────────────────────────────┤   Config          │
│ PALETTE  │                                     │ ──────────────── │
│          │                                     │   Simulate  🔴2  │
│ [Start]  │        React Flow Canvas            │ ──────────────── │
│ [Task]   │     (dot-grid background)           │   AI              │
│ [Approv] │                                     │                   │
│ [Auto]   │   ◉─────►◉──────►◉──────►◉          │  (tab content     │
│ [End]    │                                     │   changes here)   │
│          │             [Controls] [MiniMap]     │                   │
└──────────┴─────────────────────────────────────┴───────────────────┘
```

The right panel uses **tabs** (Config / Simulate / AI) so all three views coexist without competing for canvas space. An error-count badge on the Simulate tab gives instant feedback without requiring the user to open that tab.

---

## Bonus Features Implemented

| Feature | Implementation |
|---|---|
| Export workflow as JSON | `graphSerializer.ts` → Blob download via `CanvasToolbar` |
| Import workflow from JSON | File input → `importWorkflow()` action hydrates Zustand store |
| Minimap | `<MiniMap />` with per-type node colors |
| Zoom controls | Toolbar buttons + React Flow scroll wheel |
| Validation errors on nodes | `BaseNode` rings driven by `useValidation()` |
| Auto-approve simulation | Approval node `autoApproveThreshold > 0` → `completed` in mock |

---

## What I Would Add With More Time

- **Undo/Redo** — Zustand `temporal` middleware (zundo) wraps store snapshots
- **Auto-layout** — `@dagrejs/dagre` + React Flow's ELK layout for one-click graph arrangement
- **Streaming AI responses** — Anthropic streaming API via Server-Sent Events
- **E2E tests** — Playwright covering the core drag → configure → simulate flow
- **Node templates** — pre-built workflow templates (Onboarding, Leave Approval) to populate the canvas
