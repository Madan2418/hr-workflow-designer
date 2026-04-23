# FlowForge HR - HR Workflow Designer

> **Tredence Full Stack Engineering Intern - Case Study Submission**  
> **Madankumar Senthilkumar** | ms0585@srmist.edu.in

---

## What It Does

FlowForge HR is a visual workflow studio for HR operations. It is designed to make onboarding, approvals, document processing, and similar HR flows easier to design, inspect, and refine before they are ever operationalized.

Instead of giving users a blank admin panel, the product combines:

- **A drag-and-drop workflow canvas** with custom HR node types
- **Prebuilt templates** so users can start with real workflow patterns instead of building from zero
- **Type-safe configuration forms** for every node
- **Real-time validation** to catch broken graph structure early
- **Simulation tooling** to preview execution flow and blocked states
- **AI analysis** to surface workflow issues, improvements, and summaries
- **Import/export support** to move workflows cleanly as JSON

The result is closer to a product pitch than a component demo: a workflow builder that is usable, explainable, and extensible.

---

## Why It Stands Out

This project is not just a React Flow canvas with connected boxes. It is framed as an HR operations product prototype with three strong differentiators:

- **Templates** make the experience immediately useful. A user can open the app and start from a realistic HR workflow instead of facing an empty canvas.
- **Simulation** turns the workflow into something testable. Users can inspect execution order, pending approvals, and skipped steps before rollout.
- **AI analysis** adds an intelligence layer on top of the graph, returning structured issues, suggestions, and a plain-English summary.

When a workflow is designed, clicking **Analyze with AI** sends the serialized graph to the configured AI provider. The response is constrained into a predictable structure so the UI can render:

- **Issues** - logic or workflow gaps
- **Suggestions** - practical improvements to the process
- **Summary** - a concise explanation of what the workflow does

> **Note:** AI analysis is additive. The builder, templates, validation, automation mocks, and simulation all work without any API key.

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

## Architecture

The application is intentionally split into clear layers so the canvas remains interactive while the rest of the product stays modular:

- **Canvas layer** - React Flow powers node rendering, edges, drag/drop, minimap, and viewport behavior
- **State layer** - Zustand owns nodes, edges, selection, undo/redo history, import/export hydration, and CRUD actions
- **Form layer** - each node type has its own strongly typed editing experience
- **Validation layer** - graph rules are derived reactively from workflow state
- **Simulation layer** - MSW-backed endpoints let the app behave like it has a backend without introducing server complexity
- **AI layer** - a provider-flexible analysis client turns the current workflow graph into structured insights

At a product level, this keeps responsibilities clear: the canvas handles interaction, the store owns graph state, the forms own configuration, and the right panel turns the workflow into something reviewable.

---

## How to Manually Test

### Basic Workflow

1. Add a **Start** node from the left sidebar onto the canvas.
2. Add **Task**, **Approval**, and **End** nodes.
3. Connect them using the source and target handles on each node.
4. Select a node or edge and use the toolbar trash action to delete only that selected item.
5. Use the eraser action only when you want to clear the full canvas.

### Templates

6. Click **Templates** in the header or **Choose a Template** on the empty canvas state.
7. Load a prebuilt HR workflow and inspect the preconfigured nodes and automation steps.
8. Modify the loaded workflow to confirm templates are editable and not static mock previews.

### Configuration

9. Click a node to open the configuration panel.
10. Update node-specific fields like metadata, assignee, approver role, automation action, and end summary.
11. Confirm the visual node preview updates as the form changes.

### Simulation

12. Switch to the **Simulate** tab.
13. Review validation feedback if the workflow is incomplete.
14. Run simulation and confirm the execution log shows completed, pending, and skipped steps correctly.

### AI Analysis

15. Switch to the **AI** tab.
16. Configure an API key if needed.
17. Click **Analyze with AI** and verify issues, suggestions, and summary are rendered in structured cards.

### Import / Export

18. Export the workflow and confirm the downloaded file is a clean graph JSON.
19. Import the same file back and verify the workflow restores correctly.

---

## Design Decisions

### Why Zustand instead of Redux or Context?

React Flow emits frequent updates while dragging nodes. Zustand keeps subscriptions granular, so the canvas can update without forcing unrelated UI like forms and right-panel content to re-render on every movement.

### Why MSW instead of standing up a real backend?

The goal here is to demonstrate a realistic product workflow without backend overhead. MSW provides network-shaped APIs for automations and simulation, which keeps the experience believable while preserving a simple local setup.

### Why discriminated unions for node data?

Each node type has different configuration needs. A discriminated union keeps those forms type-safe and scalable, instead of collapsing everything into a weak `data: any` shape.

### Why direct provider fetch for AI?

This is a frontend-first prototype. A direct integration keeps the AI layer transparent and lightweight, while still supporting Anthropic, OpenAI-compatible endpoints, and Gemini.

### Why templates matter in the product story

A blank canvas is flexible, but templates make the experience persuasive. They show how the workflow engine can immediately solve real HR use cases and help the product feel like something that could ship, not just something that can render nodes.

---

## Folder Structure

```text
src/
|-- api/              -> Fetch wrappers (automations, simulate, analyze)
|-- components/
|   |-- canvas/       -> ReactFlow canvas, toolbar, sidebar, templates
|   |-- nodes/        -> Custom node components + registry
|   |-- forms/        -> Per-node config forms + reusable inputs
|   |-- sandbox/      -> Simulation panel, execution log, validation banner
|   `-- ai/           -> AI analysis panel + insight cards
|-- data/             -> Workflow templates
|-- hooks/            -> Zustand store, simulation, validation, AI hooks
|-- mocks/            -> MSW handlers + mock data
|-- types/            -> Node types, workflow types, API types
`-- utils/            -> Graph serializer, cycle detector, validator
```

---

## Completed

| Deliverable | Status |
|---|---|
| React application (Vite + React 18 + TypeScript) | Yes |
| React Flow canvas with 5 custom node types | Yes |
| Node config forms for all node types | Yes |
| Mock API (`GET /automations`, `POST /simulate`) via MSW | Yes |
| Workflow simulation panel with execution log | Yes |
| Graph validation (start/end/cycles/disconnected) | Yes |
| Templates for faster workflow creation | Yes |
| Import / export workflow JSON | Yes |
| Undo / redo support | Yes |
| AI workflow analysis via LLM | Yes |
| README with architecture, run steps, design choices, and tradeoffs | Yes |

---

## What I'd Add With More Time

- **Expanded template library** for leave approvals, offboarding, probation review, and policy acknowledgements
- **Auto-layout support** for larger workflows
- **Node version history** for auditability and workflow change tracking
- **Streaming AI responses** for more interactive analysis
- **E2E coverage with Playwright** across template load, editing, simulation, and export/import
- **Collaboration features** such as comments, shared review, and approval states

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Vite + React 18 + TypeScript | Fast iteration, strict typing, clean DX |
| Canvas | @xyflow/react (React Flow v12) | Strong fit for node-based workflow design |
| Styling | Tailwind CSS v3 | Fast composition and consistent UI tokens |
| State | Zustand | Lightweight, selector-driven, canvas-friendly |
| Mock API | MSW v2 | Realistic network behavior without server setup |
| AI | Anthropic / OpenAI-compatible / Gemini | Flexible provider support via direct fetch |
| Icons | Lucide React | Clean and lightweight |

---

## One Tricky Frontend Bug I Solved

One of the more subtle issues in the app was around canvas state fidelity: selection, undo/redo, import/export, and custom node rendering all depend on the graph state staying clean and predictable.

The fix was to normalize workflow state at the store boundary, keep selection explicit, and export only the clean graph shape the app actually needs. That prevented time-travel and import/export flows from carrying extra React Flow internals or stale selection state back into the UI.

This mattered because the canvas is the core product surface. If state handling is unstable, everything layered on top of it - templates, simulation, AI analysis, and editing - feels unreliable.

---

## Other Projects by Me

- [Where Did My Money Go? (Expense Manager)](https://github.com/Madan2418/Where-did-my-money-go-)
