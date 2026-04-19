import { useState, useCallback } from 'react'
import { simulateWorkflow } from '../api/simulate'
import type { WorkflowGraph, SimulationResult } from '../types/workflow'

export function useSimulate() {
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const simulate = useCallback(async (graph: WorkflowGraph) => {
    setIsLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await simulateWorkflow(graph)
      setResult(res)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Simulation failed')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return { result, isLoading, error, simulate, reset }
}
