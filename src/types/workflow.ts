import type { Node, Edge } from '@xyflow/react'
import type { WorkflowNodeData } from './nodes'

export type WorkflowNode = Node<WorkflowNodeData>
export type WorkflowEdge = Edge

export interface WorkflowGraph {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

export interface SimulationStep {
  nodeId: string
  type: string
  label: string
  status: 'completed' | 'pending' | 'skipped' | 'error'
  duration: number | null
  detail?: string
}

export interface SimulationResult {
  steps: SimulationStep[]
  summary: string
}

export interface ValidationError {
  nodeId?: string
  message: string
  severity: 'error' | 'warning'
}

export interface AIAnalysis {
  issues: string[]
  suggestions: string[]
  summary: string
}
