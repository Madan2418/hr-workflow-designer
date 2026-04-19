import { create } from 'zustand'
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
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
    endMessage: 'Workflow completed.',
    showSummary: true,
  }),
}

// ─── Store interface ─────────────────────────────────────────────────────────

export interface WorkflowStore {
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

// ─── Store ───────────────────────────────────────────────────────────────────

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,

  onNodesChange: (changes) =>
    set((s) => ({ nodes: applyNodeChanges(changes, s.nodes) as Node<WorkflowNodeData>[] })),

  onEdgesChange: (changes) =>
    set((s) => ({ edges: applyEdgeChanges(changes, s.edges) })),

  onConnect: (connection) =>
    set((s) => ({ edges: addEdge({ ...connection, animated: true }, s.edges) })),

  setSelectedNode: (id) => set({ selectedNodeId: id }),

  updateNodeData: (id, data) =>
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } as WorkflowNodeData } : n
      ),
    })),

  addNode: (type, position) => {
    const id = nanoid()
    const labelMap: Record<NodeType, string> = {
      [NodeType.Start]: 'Start',
      [NodeType.Task]: 'New Task',
      [NodeType.Approval]: 'Approval',
      [NodeType.AutomatedStep]: 'Automated Step',
      [NodeType.End]: 'End',
    }
    const node: Node<WorkflowNodeData> = {
      id,
      type,
      position,
      data: defaultData[type](labelMap[type]),
    }
    set((s) => ({ nodes: [...s.nodes, node] }))
  },

  deleteNode: (id) =>
    set((s) => ({
      nodes: s.nodes.filter((n) => n.id !== id),
      edges: s.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: s.selectedNodeId === id ? null : s.selectedNodeId,
    })),

  clearWorkflow: () => set({ nodes: [], edges: [], selectedNodeId: null }),

  importWorkflow: (nodes, edges) => set({ nodes, edges, selectedNodeId: null }),
}))

// ─── Derived selectors ───────────────────────────────────────────────────────

export const getSelectedNode = (store: WorkflowStore) =>
  store.nodes.find((n) => n.id === store.selectedNodeId) ?? null
