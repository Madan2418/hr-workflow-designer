import type { Node, Edge } from '@xyflow/react'

export function hasCycle(nodes: Node[], edges: Edge[]): boolean {
  const adjacency = new Map<string, string[]>()
  nodes.forEach(n => adjacency.set(n.id, []))
  edges.forEach(e => adjacency.get(e.source)?.push(e.target))

  const visited = new Set<string>()
  const inStack = new Set<string>()

  function dfs(id: string): boolean {
    visited.add(id)
    inStack.add(id)
    for (const neighbor of adjacency.get(id) ?? []) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true
      } else if (inStack.has(neighbor)) {
        return true
      }
    }
    inStack.delete(id)
    return false
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) return true
    }
  }
  return false
}
