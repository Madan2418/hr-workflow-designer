import { Play, Loader2, RotateCcw } from 'lucide-react'
import { useWorkflowStore } from '../../hooks/useWorkflowStore'
import { useSimulate } from '../../hooks/useSimulate'
import { useValidation } from '../../hooks/useValidation'
import { serializeGraph } from '../../utils/graphSerializer'
import { ValidationBanner } from './ValidationBanner'
import { ExecutionLog } from './ExecutionLog'

export function SandboxPanel() {
  const nodes = useWorkflowStore((s) => s.nodes)
  const edges = useWorkflowStore((s) => s.edges)
  const { result, isLoading, error, simulate, reset } = useSimulate()
  const validationErrors = useValidation()
  const hasBlockingErrors = validationErrors.some(e => e.severity === 'error')

  const handleSimulate = () => {
    const graph = serializeGraph(nodes, edges)
    simulate(graph)
  }

  if (nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 text-slate-500 gap-3">
        <div className="text-4xl">⚡</div>
        <p className="text-sm">Add nodes to the canvas, then run the simulation here.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full p-4 gap-4 overflow-hidden">
      <ValidationBanner errors={validationErrors} />

      <button
        onClick={handleSimulate}
        disabled={isLoading || hasBlockingErrors}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-medium text-sm transition-all
          bg-accent hover:bg-accentHover disabled:opacity-40 disabled:cursor-not-allowed text-white"
      >
        {isLoading ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} />}
        {isLoading ? 'Simulating…' : 'Run Simulation'}
      </button>

      {error && (
        <div className="text-xs text-danger bg-danger/10 border border-danger/30 rounded-lg p-3">
          {error}
        </div>
      )}

      {result && (
        <div className="flex flex-col gap-3 overflow-y-auto flex-1">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Execution Log</p>
            <button onClick={reset} className="text-slate-500 hover:text-white transition-colors">
              <RotateCcw size={13} />
            </button>
          </div>
          <ExecutionLog steps={result.steps} />
          <div className="rounded-lg bg-slate-800/50 border border-border p-3 text-xs text-slate-300">
            <span className="text-slate-500 mr-1">Summary:</span>
            {result.summary}
          </div>
        </div>
      )}
    </div>
  )
}
