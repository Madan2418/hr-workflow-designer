import type { Node, Edge } from '@xyflow/react'
import type { WorkflowNodeData } from '../types/nodes'
import type { WorkflowGraph } from '../types/workflow'

export function serializeGraph(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): WorkflowGraph {
  return {
    nodes: nodes.map(n => ({
      ...n,
      data: { ...n.data },
    })),
    edges: edges.map(e => ({ ...e })),
  }
}
