# FlowForge HR — HR Workflow Designer

> **Tredence Full Stack Engineering Intern — Case Study Submission**  
> **Madankumar Senthilkumar** | ms0585@srmist.edu.in

---

## What It Does

FlowForge HR is a visual drag-and-drop HR workflow designer. HR admins can:

- **Design** workflows (onboarding, leave approval, document verification) by dragging nodes onto a canvas
- **Configure** each node with a dedicated, type-safe edit form
- **Validate** the graph structure in real-time (cycles, disconnected nodes, missing start/end)
- **Simulate** the workflow via a mock API and see a step-by-step execution log
- **Analyze** the workflow with AI (Anthropic, OpenAI-compatible, or Gemini) for issues and improvement suggestions
- **Export / Import** workflows as JSON

---

## AI Feature — The Differentiator

When a workflow is designed, clicking **"Analyze with AI"** sends the serialized graph to the configured AI provider. The model returns:

- **Issues** — logical problems (e.g., approval with no predecessor task)
- **Suggestions** — improvements based on the workflow type
- **Summary** — a plain-English description of the entire workflow

This is **additive** — all spec requirements are met fully before the AI layer.

> **Note:** AI analysis requires a supported API key. The mock API (simulate, automations) works without any key.

---

## How to Run

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Enable AI analysis
cp .env.example .env.local
# Then add one AI configuration to .env.local:
# Generic:
# VITE_AI_API_KEY=
# VITE_AI_PROVIDER=openai|anthropic|gemini|openai-compatible
# VITE_AI_MODEL=
# VITE_AI_BASE_URL=
#
# Or provider-specific:
# VITE_ANTHROPIC_API_KEY=sk-ant-...
# VITE_OPENAI_API_KEY=sk-...
# VITE_GEMINI_API_KEY=AIza...

# 3. Start the development server
npm run dev
```

Navigate to **http://localhost:5173/**

---

## How to Manually Test (Step by Step)

### Basic Workflow

1. **Add a Start node** — drag "Start" from the left sidebar onto the canvas
2. **Add a Task node** — drag "Task" onto the canvas
3. **Add an Approval node** — drag "Approval" onto the canvas
4. **Add an End node** — drag "End" onto the canvas
5. **Connect them** — hover over a node's right edge handle (blue dot), then drag to the next node's left handle
6. **Delete** — select any node/edge and press `Delete`

### Configuring Nodes

7. **Click any node** — the right panel switches to the **Config** tab automatically
8. **Start node** — edit title and add optional metadata key-value pairs
9. **Task node** — fill in title, description, assignee name, due date, and custom fields
10. **Approval node** — select approver role (Manager / HRBP / Director), set auto-approve threshold
11. **Automated Step node** — choose an action from the dropdown (fetched from mock API), fill dynamic params
12. **End node** — set end message and toggle the summary flag

### Running Simulation

13. Switch to the **Simulate** tab in the right panel
14. Any validation errors (missing Start/End, cycles, disconnected nodes) are shown as a red banner
15. Click **Run Simulation** — the mock API returns a step-by-step execution log
16. Each step shows status (completed / pending / skipped), duration, and details

### AI Analysis

17. Switch to the **AI** tab in the right panel
18. Click **Analyze with AI**
19. If an AI key is set, the configured provider returns structured JSON with issues, suggestions, and a summary
20. If no key is set, a clear warning is shown

### Export / Import

21. Click the **↓ Download** icon in the canvas toolbar to export the workflow as `workflow.json`
22. Click the **↑ Upload** icon to import a JSON file and restore the workflow
23. Click **Fit View** (maximize icon) to center the restored graph

### Canvas Controls

24. **Zoom In/Out** — toolbar buttons or scroll wheel
25. **Minimap** — bottom-right corner of the canvas; colored by node type
26. **Delete selected node** — trash icon in toolbar removes the selected node
27. **Clear canvas** — eraser icon in toolbar resets the canvas

---

## Architecture Decisions

### Why Zustand (not Redux or Context)?

React Flow triggers hundreds of re-renders during node dragging. Zustand's selector-based subscriptions prevent the form panel from re-rendering while the user drags a node. Context would cause the entire tree to re-render on every position update.

### Why MSW (not JSON Server)?

MSW intercepts `fetch()` calls at the browser level via a Service Worker. No separate server process is needed. The mock is realistic (real HTTP semantics) and disappears cleanly in production without any code change.

### Why Discriminated Union (not a flat `data: any`)?

```ts
type WorkflowNodeData = StartNodeData | TaskNodeData | ApprovalNodeData | ...
```

`NodeFormPanel` switches on `data.type` and TypeScript narrows to the exact interface. No `as any`, no optional fields everywhere. Adding a new node type means adding one interface, one form, and one case — the compiler enforces completeness.

### Why Direct Provider Fetch (not LangChain/Vercel AI)?

This is a frontend-only prototype. Adding a backend SDK just to call one API endpoint would be over-engineering. Direct `fetch()` calls keep the bundle minimal and the flow transparent while still allowing multiple providers.

---

## Folder Structure

```
src/
├── api/              → Fetch wrappers (automations, simulate, analyze)
├── components/
│   ├── canvas/       → ReactFlow canvas, toolbar, sidebar
│   ├── nodes/        → Custom node components + registry
│   ├── forms/        → Per-node config forms + reusable KeyValueInput
│   ├── sandbox/      → Simulation panel, execution log, validation banner
│   └── ai/           → AI analysis panel + insight cards
├── hooks/            → Zustand store, simulation, validation, AI hooks
├── mocks/            → MSW handlers + mock data
├── types/            → Node types, workflow types, API types
└── utils/            → Graph serializer, cycle detector, validator
```

---

## Deliverables Checklist

| Deliverable | Status |
|---|---|
| React application (Vite + React 18 + TypeScript) | ✅ |
| React Flow canvas — 5 custom node types | ✅ |
| Node config forms (all 5 types, dynamic fields) | ✅ |
| Mock API (`GET /automations`, `POST /simulate`) via MSW | ✅ |
| Workflow Test/Sandbox panel with execution log | ✅ |
| Graph validation (start/end/cycles/disconnected) | ✅ |
| Export / Import workflow as JSON | ✅ (bonus) |
| Minimap + zoom controls | ✅ (bonus) |
| Validation errors shown on nodes | ✅ (bonus) |
| AI workflow analysis via LLM | ✅ (bonus) |
| README with architecture, design choices, assumptions | ✅ |

---

## What I'd Add With More Time

- **Undo/Redo** — Zustand `temporal` middleware (from `zundo`) wraps the store snapshot history
- **Auto-layout (Dagre)** — `@dagrejs/dagre` + React Flow's `elk` layout for one-click graph arrangement  
- **Node version history** — store a changelog array per node in the Zustand store
- **Streaming AI responses** — use Anthropic's streaming API + Server-Sent Events for real-time token output
- **E2E tests** — Playwright test for the core drag → configure → simulate flow

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Vite + React 18 + TypeScript | Fast, modern, matches JD exactly |
| Canvas | @xyflow/react (React Flow v12) | Required by spec |
| Styling | Tailwind CSS v3 | Required by JD |
| State | Zustand | Selector-based, prevents drag re-renders |
| Mock API | MSW v2 | No extra server process |
| AI | Anthropic / OpenAI-compatible / Gemini | Direct fetch, no SDK |
| Icons | Lucide React | Clean, tree-shakable |

---

## One Tricky Frontend Bug I Solved

While building this project I hit a two-part TypeScript error that cascaded into 12+ failures across the codebase.

**The problem:**  
`@xyflow/react` v12 requires all node `data` objects to satisfy `Record<string, unknown>`. My node data was typed as a discriminated union of specific interfaces (`StartNodeData`, `TaskNodeData`, etc.) — none of which had an index signature, so TypeScript rejected every place `Node<WorkflowNodeData>` was used.

At the same time, TypeScript 5.8 introduced `erasableSyntaxOnly` in the default Vite tsconfig, which bans `enum` at the type level. I had used `enum NodeType` throughout. Two root causes, one cascade of 12 errors.

**The fix:**

1. Replaced `enum NodeType` with a `const` object + type alias — identical runtime behavior, zero compile issues:
```ts
export const NodeType = { Start: 'start', Task: 'task', ... } as const
export type NodeType = (typeof NodeType)[keyof typeof NodeType]
```

2. Made every node data interface explicitly extend `Record<string, unknown>`. This satisfies the @xyflow/react constraint while keeping all specific typed fields intact and the discriminated union fully functional:
```ts
export interface TaskNodeData extends Record<string, unknown> {
  type: 'task'
  label: string
  assignee: string
  // ... all fields still strongly typed
}
```

Fixing both root causes cleared all 12 cascade errors in one pass. The key insight was recognizing these were two independent root causes — not 12 separate bugs — and tracing back to the source rather than patching each error site individually.


---

## Other Projects by Me

- [Where Did My Money Go? (Expense Manager)](https://github.com/Madan2418/Where-did-my-money-go-)
