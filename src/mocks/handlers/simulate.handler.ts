import { http, HttpResponse } from 'msw'
import type { WorkflowGraph, SimulationResult, SimulationStep } from '../../types/workflow'
import type { Edge } from '@xyflow/react'

function topologicalSort(nodes: WorkflowGraph['nodes'], edges: Edge[]): WorkflowGraph['nodes'] {
  const adjacency = new Map<string, string[]>()
  const inDegree = new Map<string, number>()

  nodes.forEach(n => { adjacency.set(n.id, []); inDegree.set(n.id, 0) })
  edges.forEach(e => {
    adjacency.get(e.source)?.push(e.target)
    inDegree.set(e.target, (inDegree.get(e.target) ?? 0) + 1)
  })

  const queue = nodes.filter(n => inDegree.get(n.id) === 0)
  const sorted: WorkflowGraph['nodes'] = []

  while (queue.length > 0) {
    const node = queue.shift()!
    sorted.push(node)
    adjacency.get(node.id)?.forEach(neighborId => {
      const deg = (inDegree.get(neighborId) ?? 1) - 1
      inDegree.set(neighborId, deg)
      if (deg === 0) {
        const neighbor = nodes.find(n => n.id === neighborId)
        if (neighbor) queue.push(neighbor)
      }
    })
  }

  return sorted.length === nodes.length ? sorted : nodes
}

const durationMockByType: Record<string, number> = {
  start: 0,
  task: 3,
  approval: 2,
  automatedStep: 1,
  end: 0,
}

/** Approval: auto-approves if autoApproveThreshold > 0, otherwise pending */
function resolveStatus(node: WorkflowGraph['nodes'][number]): SimulationStep['status'] {
  const t = node.data.type as string
  if (t === 'approval') {
    const threshold = (node.data as Record<string, unknown>).autoApproveThreshold as number ?? 0
    return threshold > 0 ? 'completed' : 'pending'
  }
  const defaults: Record<string, SimulationStep['status']> = {
    start: 'completed', task: 'completed', automatedStep: 'completed', end: 'completed',
  }
  return defaults[t] ?? 'completed'
}

function resolveDetail(node: WorkflowGraph['nodes'][number], status: SimulationStep['status']): string | undefined {
  const t = node.data.type as string
  if (t === 'approval' && status === 'completed') {
    const threshold = (node.data as Record<string, unknown>).autoApproveThreshold as number ?? 0
    return `Auto-approved after ${threshold}-day SLA`
  }
  if (status === 'pending') return 'Waiting for human action — set Auto-Approve Threshold > 0 to bypass'
  if (t === 'automatedStep') {
    const actionId = (node.data as Record<string, unknown>).actionId as string
    return actionId ? `Executed: ${actionId}` : undefined
  }
  return undefined
}

export const simulateHandler = http.post('/simulate', async ({ request }) => {
  const graph = await request.json() as WorkflowGraph
  const sorted = topologicalSort(graph.nodes, graph.edges)

  let hitPending = false
  const steps: SimulationStep[] = sorted.map(node => {
    const nodeType = node.data.type as string
    const status: SimulationStep['status'] = hitPending ? 'skipped' : resolveStatus(node)
    if (status === 'pending') hitPending = true

    return {
      nodeId: node.id,
      type: nodeType,
      label: (node.data.label as string) ?? 'Unnamed',
      status,
      duration: status === 'skipped' ? null : durationMockByType[nodeType] ?? 0,
      detail: resolveDetail(node, status),
    }
  })

  const pendingStep = steps.find(s => s.status === 'pending')
  const allDone = steps.every(s => s.status === 'completed')

  const summary = allDone
    ? `✅ Workflow executed successfully across all ${steps.length} step(s).`
    : pendingStep
      ? `⏳ Paused at "${pendingStep.label}" — awaiting human approval. Set Auto-Approve Threshold > 0 on the Approval node to auto-complete it.`
      : `Workflow completed with ${steps.filter(s => s.status === 'skipped').length} skipped step(s).`

  return HttpResponse.json({ steps, summary } as SimulationResult)
})
