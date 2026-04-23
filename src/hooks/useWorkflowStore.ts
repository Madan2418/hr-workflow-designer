import { create } from 'zustand'
import { temporal } from 'zundo'
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  MarkerType,
  Position,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type XYPosition,
} from '@xyflow/react'
import { NodeType, type WorkflowNodeData } from '../types/nodes'
import { nanoid } from '../utils/nanoid'

// ─── Default data factories ──────────────────────────────────────────────────

const defaultData: Record<NodeType, (label: string) => WorkflowNodeData> = {
  [NodeType.Start]: (label) => ({
    type: NodeType.Start,
    label,
    metadata: {},
  }),
  [NodeType.Task]: (label) => ({
    type: NodeType.Task,
    label,
    description: '',
    assignee: '',
    dueDate: '',
    customFields: {},
  }),
  [NodeType.Approval]: (label) => ({
    type: NodeType.Approval,
    label,
    approverRole: 'Manager',
    autoApproveThreshold: 0,
  }),
  [NodeType.AutomatedStep]: (label) => ({
    type: NodeType.AutomatedStep,
    label,
    actionId: '',
    actionParams: {},
  }),
  [NodeType.End]: (label) => ({
    type: NodeType.End,
    label,
    endMessage: 'Workflow completed successfully.',
    showSummary: true,
  }),
}

const labelMap: Record<NodeType, string> = {
  [NodeType.Start]: 'Start',
  [NodeType.Task]: 'New Task',
  [NodeType.Approval]: 'Approval',
  [NodeType.AutomatedStep]: 'Automated Step',
  [NodeType.End]: 'End',
}

function normalizeNode(node: Node<WorkflowNodeData>): Node<WorkflowNodeData> {
  const resolvedType = node.type ?? node.data.type

  return {
    ...node,
    type: resolvedType,
    targetPosition: node.targetPosition ?? Position.Left,
    sourcePosition: node.sourcePosition ?? Position.Right,
  }
}

function normalizeEdge(edge: Edge): Edge {
  return {
    ...edge,
    animated: edge.animated ?? true,
    markerEnd: edge.markerEnd ?? { type: MarkerType.ArrowClosed },
  }
}

function normalizeGraph(nodes: Node<WorkflowNodeData>[], edges: Edge[]) {
  return {
    nodes: nodes.map(normalizeNode),
    edges: edges.map(normalizeEdge),
  }
}

// ─── Store interface ─────────────────────────────────────────────────────────

export interface WorkflowStore {
  nodes: Node<WorkflowNodeData>[]
  edges: Edge[]
  selectedNodeId: string | null
  selectedEdgeId: string | null
  simulatingNodeId: string | null

  onNodesChange: OnNodesChange<Node<WorkflowNodeData>>
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  setSelectedNode: (id: string | null) => void
  setSelectedEdge: (id: string | null) => void
  setSimulatingNode: (id: string | null) => void
  updateNodeData: (id: string, data: Partial<WorkflowNodeData>) => void
  addNode: (type: NodeType, position: XYPosition) => void
  deleteNode: (id: string) => void
  deleteEdge: (id: string) => void
  clearSelection: () => void
  clearWorkflow: () => void
  importWorkflow: (nodes: Node<WorkflowNodeData>[], edges: Edge[]) => void
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useWorkflowStore = create<WorkflowStore>()(
  temporal(
    (set) => ({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      selectedEdgeId: null,
      simulatingNodeId: null,

      onNodesChange: (changes) =>
        set((s) => ({ nodes: applyNodeChanges(changes, s.nodes) as Node<WorkflowNodeData>[] })),

      onEdgesChange: (changes) =>
        set((s) => ({ edges: applyEdgeChanges(changes, s.edges) })),

      onConnect: (connection) =>
        set((s) => ({
          edges: addEdge(
            { ...connection, animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
            s.edges
          ),
        })),

      setSelectedNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
      setSelectedEdge: (id) => set({ selectedNodeId: null, selectedEdgeId: id }),
      setSimulatingNode: (id) => set({ simulatingNodeId: id }),
      clearSelection: () => set({ selectedNodeId: null, selectedEdgeId: null }),

      updateNodeData: (id, data) =>
        set((s) => ({
          nodes: s.nodes.map((n) =>
            n.id === id ? { ...n, data: { ...n.data, ...data } as WorkflowNodeData } : n
          ),
        })),

      addNode: (type, position) => {
        const id = nanoid()
        const node = normalizeNode({
          id,
          type,
          position,
          data: defaultData[type](labelMap[type]),
        } as Node<WorkflowNodeData>)
        set((s) => ({ nodes: [...s.nodes, node] }))
      },

      deleteNode: (id) =>
        set((s) => ({
          nodes: s.nodes.filter((n) => n.id !== id),
          edges: s.edges.filter((e) => e.source !== id && e.target !== id),
          selectedNodeId: s.selectedNodeId === id ? null : s.selectedNodeId,
          selectedEdgeId:
            s.selectedEdgeId !== null && s.edges.some((edge) => edge.id === s.selectedEdgeId && edge.source !== id && edge.target !== id)
              ? s.selectedEdgeId
              : null,
        })),

      deleteEdge: (id) =>
        set((s) => ({
          edges: s.edges.filter((e) => e.id !== id),
          selectedEdgeId: s.selectedEdgeId === id ? null : s.selectedEdgeId,
        })),

      clearWorkflow: () =>
        set({ nodes: [], edges: [], selectedNodeId: null, selectedEdgeId: null, simulatingNodeId: null }),

      importWorkflow: (nodes, edges) => {
        const graph = normalizeGraph(nodes, edges)
        set({ ...graph, selectedNodeId: null, selectedEdgeId: null, simulatingNodeId: null })
      },
    }),
    {
      // Only track nodes and edges in history (not UI state)
      partialize: (state) => ({ nodes: state.nodes, edges: state.edges }),
      equality: (past, current) => past.nodes === current.nodes && past.edges === current.edges,
      limit: 40,
    }
  )
)

// ─── Derived selectors ───────────────────────────────────────────────────────

export const getSelectedNode = (store: WorkflowStore) =>
  store.nodes.find((n) => n.id === store.selectedNodeId) ?? null
