import { useState, useCallback } from 'react'
import { analyzeWorkflow } from '../api/analyze'
import type { WorkflowGraph, AIAnalysis } from '../types/workflow'

export function useAIAnalysis() {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyze = useCallback(async (graph: WorkflowGraph) => {
    setIsLoading(true)
    setError(null)
    setAnalysis(null)
    try {
      const res = await analyzeWorkflow(graph)
      setAnalysis(res)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'AI analysis failed')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setAnalysis(null)
    setError(null)
  }, [])

  return { analysis, isLoading, error, analyze, reset }
}
