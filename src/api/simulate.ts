import type { WorkflowGraph, SimulationResult } from '../types/workflow'

export async function simulateWorkflow(graph: WorkflowGraph): Promise<SimulationResult> {
  const res = await fetch('/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graph),
  })
  if (!res.ok) throw new Error('Simulation failed')
  return res.json()
}
