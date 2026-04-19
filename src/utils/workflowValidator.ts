import type { Node, Edge } from '@xyflow/react'
import { NodeType } from '../types/nodes'
import type { ValidationError } from '../types/workflow'
import { hasCycle } from './cycleDetector'

export function validateWorkflow(nodes: Node[], edges: Edge[]): ValidationError[] {
  const errors: ValidationError[] = []

  // Rule 1: Exactly one Start node
  const startNodes = nodes.filter(n => n.data.type === NodeType.Start)
  if (startNodes.length === 0)
    errors.push({ message: 'Workflow must have a Start node.', severity: 'error' })
  if (startNodes.length > 1)
    errors.push({ message: 'Only one Start node is allowed.', severity: 'error' })

  // Rule 2: At least one End node
  if (!nodes.some(n => n.data.type === NodeType.End))
    errors.push({ message: 'Workflow must have an End node.', severity: 'error' })

  // Rule 3: No disconnected nodes (when more than 1 node)
  if (nodes.length > 1) {
    const connectedIds = new Set(edges.flatMap(e => [e.source, e.target]))
    nodes.forEach(n => {
      if (!connectedIds.has(n.id))
        errors.push({
          nodeId: n.id,
          message: `Node "${n.data.label as string}" is disconnected.`,
          severity: 'warning',
        })
    })
  }

  // Rule 4: No cycles
  if (hasCycle(nodes, edges))
    errors.push({
      message: 'Workflow contains a cycle — execution would loop forever.',
      severity: 'error',
    })

  return errors
}
