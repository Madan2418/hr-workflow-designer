import { useState } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { Workflow, Cpu, FlaskConical, Settings } from 'lucide-react'
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas'
import { Sidebar } from './components/canvas/Sidebar'
import { NodeFormPanel } from './components/forms/NodeFormPanel'
import { SandboxPanel } from './components/sandbox/SandboxPanel'
import { AIAnalysisPanel } from './components/ai/AIAnalysisPanel'
import { useValidation } from './hooks/useValidation'

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
              <h1 className="text-sm font-bold text-white leading-none">FlowForge HR</h1>
              <p className="text-xs text-slate-500">HR Workflow Designer</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 hidden sm:block">
              Tredence Full Stack Intern — Case Study
            </span>
            <span className="text-xs bg-accent/20 text-accent border border-accent/30 px-2 py-0.5 rounded-full font-medium">
              AI-Powered
            </span>
          </div>
        </header>

        {/* Main layout */}
        <div className="flex flex-1 min-h-0">
          <Sidebar />
          <WorkflowCanvas />
          <RightPanel />
        </div>
      </div>
    </ReactFlowProvider>
  )
}
