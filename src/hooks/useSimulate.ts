import { useState, useCallback } from 'react'
import { simulateWorkflow } from '../api/simulate'
import { useWorkflowStore } from './useWorkflowStore'
import type { WorkflowGraph, SimulationResult, SimulationStep } from '../types/workflow'

export function useSimulate() {
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setSimulatingNode = useWorkflowStore(s => s.setSimulatingNode)

  const simulate = useCallback(async (graph: WorkflowGraph) => {
    setIsLoading(true)
    setError(null)
    setResult(null)
    
    // Clear initial simulation state if exists
    setSimulatingNode(null)

    try {
      const res = await simulateWorkflow(graph)
      
      // Animate execution
      const currentSteps: SimulationStep[] = []
      
      for (const step of res.steps) {
        if (step.status === 'skipped') {
          currentSteps.push(step)
          continue
        }
        
        setSimulatingNode(step.nodeId)
        
        // Show step as pending first so the log shows it actively running
        setResult({ ...res, steps: [...currentSteps, { ...step, status: 'pending' }], summary: 'Executing step: ' + step.label + '...' })
        
        // Wait based on mock duration, min 700ms for visual effect
        const waitTime = Math.max(700, (step.duration || 0) * 500)
        await new Promise(r => setTimeout(r, waitTime))
        
        currentSteps.push(step)
        setResult({ ...res, steps: [...currentSteps], summary: 'Executing...' })
      }
      
      setSimulatingNode(null)
      setResult(res)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Simulation failed')
      setSimulatingNode(null)
    } finally {
      setIsLoading(false)
    }
  }, [setSimulatingNode])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
    useWorkflowStore.getState().setSimulatingNode(null)
  }, [])

  return { result, isLoading, error, simulate, reset }
}
