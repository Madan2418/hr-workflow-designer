# FlowForge HR — Architecture Document
### Tredence Full Stack Intern Case Study Submission
**Madankumar Senthilkumar** | ms0585@srmist.edu.in

---

## The Differentiator

Most submissions will build a standard React Flow canvas with a sidebar and a form panel.

**FlowForge HR goes one step further: the workflow canvas is AI-aware.**

When a user finishes designing a workflow, they can hit "Analyze" and an LLM (via the Anthropic API) will:
- Detect logical issues (e.g., approval node with no predecessor task)
- Suggest missing steps for common HR workflows (onboarding, offboarding, etc.)
- Auto-generate a plain-English summary of the workflow

This is a direct signal to Tredence — a company building AI Agentic platforms — that the candidate thinks in AI-first terms, not just UI terms. Every other student will submit a canvas. This submission shows product thinking.

**Everything else in the spec is met fully.** The AI layer is additive, not a shortcut.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Vite + React 18 + TypeScript** | Fast, modern, matches JD exactly |
| Canvas | **React Flow v11** | Required by spec |
| Styling | **Tailwind CSS** | Required by JD, utility-first, fast to ship |
| State | **Zustand** | Lightweight, no boilerplate, scales better than Context for graph state |
| Mock API | **MSW (Mock Service Worker)** | Intercepts at network level — realistic, no JSON Server process needed |
| AI Layer | **Anthropic Claude API (claude-sonnet-4-20250514)** | Direct fetch, no SDK needed |
| Icons | **Lucide React** | Clean, consistent |

---

## Folder Structure

```
flowforge-hr/
├── src/
│   ├── api/
│   │   ├── automations.ts        # GET /automations mock
│   │   ├── simulate.ts           # POST /simulate mock
│   │   ├── analyze.ts            # POST /analyze → Anthropic API
│   │   └── index.ts              # Barrel export
│   │
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── WorkflowCanvas.tsx     # React Flow provider + canvas
│   │   │   ├── Sidebar.tsx            # Draggable node palette
│   │   │   └── CanvasToolbar.tsx      # Zoom, fit, clear, export buttons
│   │   │
│   │   ├── nodes/
│   │   │   ├── BaseNode.tsx           # Shared node shell (handles, styling, selection)
│   │   │   ├── StartNode.tsx
│   │   │   ├── TaskNode.tsx
│   │   │   ├── ApprovalNode.tsx
│   │   │   ├── AutomatedStepNode.tsx
│   │   │   ├── EndNode.tsx
│   │   │   └── nodeRegistry.ts        # Map of type → component (extensible)
│   │   │
│   │   ├── forms/
│   │   │   ├── NodeFormPanel.tsx      # Container — renders the right form by node type
│   │   │   ├── StartForm.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   ├── ApprovalForm.tsx
│   │   │   ├── AutomatedStepForm.tsx
│   │   │   ├── EndForm.tsx
│   │   │   └── KeyValueInput.tsx      # Reusable dynamic key-value field
│   │   │
│   │   ├── sandbox/
│   │   │   ├── SandboxPanel.tsx       # Simulation trigger + log display
│   │   │   ├── ExecutionLog.tsx       # Step-by-step timeline UI
│   │   │   └── ValidationBanner.tsx   # Shows errors before simulation
│   │   │
│   │   └── ai/
│   │       ├── AIAnalysisPanel.tsx    # Trigger + display AI analysis
│   │       └── AIInsightCard.tsx      # Individual insight card component
│   │
│   ├── hooks/
│   │   ├── useWorkflowStore.ts        # Zustand store — nodes, edges, selected
│   │   ├── useNodeForm.ts             # Form state synced to store node data
│   │   ├── useDragDrop.ts             # onDrop + onDragOver for canvas
│   │   ├── useSimulate.ts             # Calls /simulate, manages loading/result state
│   │   ├── useValidation.ts           # Graph validation logic (cycles, orphans, etc.)
│   │   └── useAIAnalysis.ts           # Calls Anthropic API, streams response
│   │
│   ├── types/
│   │   ├── nodes.ts                   # NodeType enum + per-node data interfaces
│   │   ├── workflow.ts                # WorkflowGraph, SimulationResult, etc.
│   │   └── api.ts                     # AutomationAction, SimulatePayload, etc.
│   │
│   ├── mocks/
│   │   ├── browser.ts                 # MSW browser setup
│   │   ├── handlers/
│   │   │   ├── automations.handler.ts
│   │   │   └── simulate.handler.ts
│   │   └── data/
│   │       └── automations.data.ts    # Mock automation actions
│   │
│   ├── utils/
│   │   ├── graphSerializer.ts         # Nodes + edges → clean WorkflowGraph JSON
│   │   ├── cycleDetector.ts           # DFS-based cycle detection
│   │   └── workflowValidator.ts       # Validation rules → ValidationResult[]
│   │
│   ├── App.tsx                        # Root layout: Canvas | FormPanel | Sandbox
│   └── main.tsx
│
├── public/
│   └── mockServiceWorker.js           # MSW service worker
├── .env.example                       # VITE_ANTHROPIC_API_KEY=
├── README.md
└── vite.config.ts
```

---

## State Architecture (Zustand)

Single store — `useWorkflowStore`:

```ts
interface WorkflowStore {
  // React Flow state
  nodes: Node<WorkflowNodeData>[]
  edges: Edge[]
  selectedNodeId: string | null

  // Actions
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  setSelectedNode: (id: string | null) => void
  updateNodeData: (id: string, data: Partial<WorkflowNodeData>) => void
  addNode: (type: NodeType, position: XYPosition) => void
  deleteNode: (id: string) => void

  // Derived (computed inline, not stored)
  // getSelectedNode() → nodes.find(n => n.id === selectedNodeId)
}
```

**Why Zustand over Context:** React Flow triggers frequent re-renders on node drag. Zustand's selector-based subscriptions prevent the form panel from re-rendering during canvas drag.

---

## Type System (Key Design)

```ts
// nodes.ts

export enum NodeType {
  Start = 'start',
  Task = 'task',
  Approval = 'approval',
  AutomatedStep = 'automatedStep',
  End = 'end',
}

interface BaseNodeData {
  label: string
}

interface StartNodeData extends BaseNodeData {
  metadata: Record<string, string>  // key-value pairs
}

interface TaskNodeData extends BaseNodeData {
  description: string
  assignee: string
  dueDate: string
  customFields: Record<string, string>
}

interface ApprovalNodeData extends BaseNodeData {
  approverRole: 'Manager' | 'HRBP' | 'Director'
  autoApproveThreshold: number
}

interface AutomatedStepNodeData extends BaseNodeData {
  actionId: string
  actionParams: Record<string, string>  // dynamic based on action definition
}

interface EndNodeData extends BaseNodeData {
  endMessage: string
  showSummary: boolean
}

// Discriminated union — NodeFormPanel switches on this
export type WorkflowNodeData =
  | ({ type: NodeType.Start } & StartNodeData)
  | ({ type: NodeType.Task } & TaskNodeData)
  | ({ type: NodeType.Approval } & ApprovalNodeData)
  | ({ type: NodeType.AutomatedStep } & AutomatedStepNodeData)
  | ({ type: NodeType.End } & EndNodeData)
```

This discriminated union means `NodeFormPanel` gets full type safety with a `switch` — no `any`, no casting.

---

## Mock API Layer (MSW)

MSW intercepts real `fetch()` calls in the browser. No separate server process.

**`GET /automations`** → returns static mock data:
```json
[
  { "id": "send_email", "label": "Send Email", "params": ["to", "subject"] },
  { "id": "generate_doc", "label": "Generate Document", "params": ["template", "recipient"] },
  { "id": "notify_slack", "label": "Notify Slack", "params": ["channel", "message"] },
  { "id": "create_jira", "label": "Create Jira Ticket", "params": ["project", "title"] }
]
```

**`POST /simulate`** → accepts `WorkflowGraph`, returns:
```json
{
  "steps": [
    { "nodeId": "n1", "type": "start", "label": "Onboarding Start", "status": "completed", "duration": 0 },
    { "nodeId": "n2", "type": "task", "label": "Collect Documents", "status": "completed", "duration": 2 },
    { "nodeId": "n3", "type": "approval", "label": "Manager Approval", "status": "pending", "duration": null }
  ],
  "summary": "Workflow reached 'pending' state at Approval step."
}
```

The handler builds the step order by doing a topological traversal of the edges client-side, then annotates each node with a mock status.

---

## AI Analysis Layer (The Differentiator)

**`POST /analyze`** is NOT mocked — it calls the real Anthropic API.

```ts
// api/analyze.ts
export async function analyzeWorkflow(graph: WorkflowGraph): Promise<string> {
  const prompt = buildAnalysisPrompt(graph)

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await res.json()
  return data.content[0].text
}

function buildAnalysisPrompt(graph: WorkflowGraph): string {
  return `You are an HR workflow expert. Analyze this workflow graph and respond in JSON:
{
  "issues": ["..."],
  "suggestions": ["..."],
  "summary": "one sentence plain English description"
}

Workflow: ${JSON.stringify(graph, null, 2)}`
}
```

The `useAIAnalysis` hook manages loading state and renders results in `AIAnalysisPanel`.

**Important:** API key is in `.env.local` (not committed). `.env.example` shows the key name. README explains this clearly.

---

## Validation Logic

`workflowValidator.ts` runs before simulation and before AI analysis:

```ts
export interface ValidationError {
  nodeId?: string
  message: string
  severity: 'error' | 'warning'
}

export function validateWorkflow(nodes, edges): ValidationError[] {
  const errors: ValidationError[] = []

  // Rule 1: Exactly one Start node
  const startNodes = nodes.filter(n => n.data.type === NodeType.Start)
  if (startNodes.length === 0) errors.push({ message: 'Workflow must have a Start node', severity: 'error' })
  if (startNodes.length > 1) errors.push({ message: 'Only one Start node allowed', severity: 'error' })

  // Rule 2: At least one End node
  if (!nodes.some(n => n.data.type === NodeType.End))
    errors.push({ message: 'Workflow must have an End node', severity: 'error' })

  // Rule 3: No disconnected nodes
  const connectedIds = new Set(edges.flatMap(e => [e.source, e.target]))
  nodes.forEach(n => {
    if (!connectedIds.has(n.id) && nodes.length > 1)
      errors.push({ nodeId: n.id, message: `Node "${n.data.label}" is disconnected`, severity: 'warning' })
  })

  // Rule 4: No cycles (DFS)
  if (hasCycle(nodes, edges))
    errors.push({ message: 'Workflow contains a cycle — execution would loop forever', severity: 'error' })

  return errors
}
```

---

## Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Header: FlowForge HR  |  [Validate] [Simulate] [AI Analyze]   │
├──────────┬──────────────────────────────┬───────────────────────┤
│          │                              │                       │
│ Sidebar  │     React Flow Canvas        │   Right Panel         │
│          │                              │   (tabs):             │
│ [Start]  │   ┌──────┐   ┌──────┐        │   • Node Config Form  │
│ [Task]   │   │Start │──▶│ Task │        │   • Simulation Log    │
│ [Approv] │   └──────┘   └──────┘        │   • AI Insights       │
│ [Auto]   │                              │                       │
│ [End]    │                              │                       │
│          │                              │                       │
└──────────┴──────────────────────────────┴───────────────────────┘
```

The right panel uses tabs so all three views (form, simulation, AI) coexist without cluttering the canvas. This is a UX decision worth calling out in the README.

---

## Bonus Features (Will Implement)

- **Export/Import JSON** — `graphSerializer.ts` already serializes the graph; Import is a file input that parses and hydrates the store
- **Minimap** — one line in React Flow (`<MiniMap />`)
- **Validation errors on nodes** — `BaseNode` reads validation state from the store and renders a red border if its `nodeId` appears in the error list

---

## What Will NOT Be Built (Honest Scoping)

- Undo/Redo — requires `useHistory` middleware in Zustand; deprioritized for time
- Auto-layout (Dagre) — nice to have, skipped
- Node version history — out of scope

These are listed in the README under "What I'd add with more time."

---

## README Structure

```
# FlowForge HR

## What it does
## AI Feature (The Differentiator)
## How to run
  - npm install
  - cp .env.example .env.local  (add your Anthropic API key)
  - npm run dev
## Architecture decisions
## Design choices
## What's done vs what I'd add
```

---

## Why This Stands Out

| Standard Submission | FlowForge HR |
|---|---|
| React Flow canvas ✓ | React Flow canvas ✓ |
| Node forms ✓ | Node forms ✓ |
| Mock API ✓ | Mock API (MSW, no process) ✓ |
| Sandbox panel ✓ | Sandbox panel ✓ |
| — | **AI workflow analysis via LLM** |
| — | **Discriminated union type system** |
| — | **Graph validation with cycle detection** |
| — | **Validation errors rendered on nodes** |

Tredence builds AI agentic platforms. A candidate who independently adds an LLM analysis layer to a frontend prototype signals exactly the kind of AI-first thinking they're hiring for.
