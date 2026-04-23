import { useState, useMemo } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { Workflow, Cpu, FlaskConical, Settings } from 'lucide-react'
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas'
import { Sidebar } from './components/canvas/Sidebar'
import { NodeFormPanel } from './components/forms/NodeFormPanel'
import { SandboxPanel } from './components/sandbox/SandboxPanel'
import { AIAnalysisPanel } from './components/ai/AIAnalysisPanel'
import { useValidation } from './hooks/useValidation'
import { useWorkflowStore } from './hooks/useWorkflowStore'
import { TemplateModal } from './components/canvas/TemplateModal'

type RightTab = 'config' | 'sandbox' | 'ai'

const tabs: { id: RightTab; label: string; icon: React.ReactNode }[] = [
  { id: 'config', label: 'Config', icon: <Settings size={13} /> },
  { id: 'sandbox', label: 'Simulate', icon: <FlaskConical size={13} /> },
  { id: 'ai', label: 'AI', icon: <Cpu size={13} /> },
]

function RightPanel() {
  const [activeTab, setActiveTab] = useState<RightTab>('config')
  const validationErrors = useValidation()
  const errorCount = validationErrors.filter(e => e.severity === 'error').length

  return (
    <div className="w-72 flex flex-col border-l border-border bg-surface shrink-0">
      {/* Tab bar */}
      <div className="flex border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all relative
              ${activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {tab.icon}
            {tab.label}
            {tab.id === 'sandbox' && errorCount > 0 && (
              <span className="absolute top-1.5 right-2 w-4 h-4 flex items-center justify-center rounded-full bg-danger text-white text-[9px] font-bold">
                {errorCount}
              </span>
            )}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'config' && <NodeFormPanel />}
        {activeTab === 'sandbox' && <SandboxPanel />}
        {activeTab === 'ai' && <AIAnalysisPanel />}
      </div>
    </div>
  )
}

export default function App() {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  
  const nodes = useWorkflowStore(s => s.nodes)
  const edges = useWorkflowStore(s => s.edges)
  
  const stats = useMemo(() => {
    const configured = nodes.filter(n => {
      if (n.data.type === 'task') return !!(n.data as { assignee?: string }).assignee
      if (n.data.type === 'automatedStep') return !!(n.data as { actionId?: string }).actionId
      return true
    }).length
    return {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      completeness: nodes.length > 0 ? Math.round((configured / nodes.length) * 100) : 0,
    }
  }, [nodes, edges])

  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow">
              <Workflow size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-none tracking-tight">FlowForge HR</h1>
              <p className="text-[11px] text-slate-500 font-medium">Workflow Designer AI</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {stats.nodeCount > 0 && (
              <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-surfaceBright border border-border text-[11px] font-medium text-slate-400">
                <span className="flex items-center gap-1.5 text-indigo-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" /> Nodes: {stats.nodeCount}
                </span>
                <span className="w-px h-3 bg-border" />
                <span className="flex items-center gap-1.5 text-slate-300">
                  Edges: {stats.edgeCount}
                </span>
                <span className="w-px h-3 bg-border" />
                <span className="flex items-center gap-1.5 text-emerald-400">
                  Ready: {stats.completeness}%
                </span>
              </div>
            )}

            <button 
              onClick={() => setIsTemplateModalOpen(true)}
              className="btn-secondary"
            >
              Templates
            </button>
            <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md font-bold tracking-wide">
              AI-Powered
            </span>
          </div>
        </header>

        {/* Main layout */}
        <div className="flex flex-1 min-h-0 relative">
          <Sidebar />
          <WorkflowCanvas onOpenTemplates={() => setIsTemplateModalOpen(true)} />
          <RightPanel />
        </div>
      </div>
      <TemplateModal isOpen={isTemplateModalOpen} onClose={() => setIsTemplateModalOpen(false)} />
    </ReactFlowProvider>
  )
}
