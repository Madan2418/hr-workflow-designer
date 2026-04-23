import { Sparkles, Loader2, RotateCcw, AlertCircle } from 'lucide-react'
import { getAIProviderConfig } from '../../api/analyze'
import { useWorkflowStore } from '../../hooks/useWorkflowStore'
import { useAIAnalysis } from '../../hooks/useAIAnalysis'
import { serializeGraph } from '../../utils/graphSerializer'
import { AIInsightCard } from './AIInsightCard'

export function AIAnalysisPanel() {
  const nodes = useWorkflowStore((s) => s.nodes)
  const edges = useWorkflowStore((s) => s.edges)
  const { analysis, isLoading, error, analyze, reset } = useAIAnalysis()
  const aiConfig = getAIProviderConfig()

  const handleAnalyze = () => {
    const graph = serializeGraph(nodes, edges)
    analyze(graph)
  }

  if (nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 text-slate-500 gap-3">
        <div className="text-4xl">AI</div>
        <p className="text-sm">Design a workflow, then let AI analyze it for issues and suggestions.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full p-4 gap-4 overflow-hidden">
      {!aiConfig && (
        <div className="flex items-start gap-2 rounded-lg border border-warning/40 bg-warning/5 p-3">
          <AlertCircle size={14} className="text-warning mt-0.5 shrink-0" />
          <p className="text-xs text-amber-300">
            AI analysis requires <code className="bg-surface px-1 rounded">VITE_AI_API_KEY</code> or one of{' '}
            <code className="bg-surface px-1 rounded">VITE_ANTHROPIC_API_KEY</code>,{' '}
            <code className="bg-surface px-1 rounded">VITE_OPENAI_API_KEY</code>,{' '}
            <code className="bg-surface px-1 rounded">VITE_GEMINI_API_KEY</code> in{' '}
            <code className="bg-surface px-1 rounded">.env.local</code>.
          </p>
        </div>
      )}

      {aiConfig && (
        <div className="rounded-lg border border-border bg-surfaceBright/60 px-3 py-2 text-xs text-slate-400">
          Provider: <span className="text-white">{aiConfig.label}</span>
          {' | '}
          Model: <span className="text-white">{aiConfig.model}</span>
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={isLoading}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-medium text-sm transition-all
          bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500
          disabled:opacity-40 disabled:cursor-not-allowed text-white shadow"
      >
        {isLoading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
        {isLoading ? `Analyzing with ${aiConfig?.label ?? 'AI'}...` : 'Analyze with AI'}
      </button>

      {error && (
        <div className="text-xs text-danger bg-danger/10 border border-danger/30 rounded-lg p-3">
          {error}
        </div>
      )}

      {analysis && (
        <div className="flex flex-col gap-3 overflow-y-auto flex-1">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">AI Insights</p>
            <button onClick={reset} className="text-slate-500 hover:text-white transition-colors">
              <RotateCcw size={13} />
            </button>
          </div>

          <div className="rounded-lg border border-accent/30 bg-accent/5 p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-1">Summary</p>
            <p className="text-xs text-slate-300 leading-relaxed">{analysis.summary}</p>
          </div>

          <AIInsightCard title="Issues Detected" items={analysis.issues} color="danger" />
          <AIInsightCard title="Suggestions" items={analysis.suggestions} color="accent" />
        </div>
      )}
    </div>
  )
}
