import type { Node, Edge } from '@xyflow/react'
import type { WorkflowNodeData } from '../types/nodes'
import type { WorkflowGraph } from '../types/workflow'

export function serializeGraph(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): WorkflowGraph {
  return {
    nodes: nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: { ...node.data },
      sourcePosition: node.sourcePosition,
      targetPosition: node.targetPosition,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: edge.type,
      label: edge.label,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      animated: edge.animated,
      markerEnd: edge.markerEnd,
    })),
  }
}
