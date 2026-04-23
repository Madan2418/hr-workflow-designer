import { X, Blocks } from 'lucide-react'
import { workflowTemplates } from '../../data/templates'
import { useWorkflowStore } from '../../hooks/useWorkflowStore'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function TemplateModal({ isOpen, onClose }: Props) {
  const { importWorkflow } = useWorkflowStore()

  if (!isOpen) return null

  const handleSelect = (template: typeof workflowTemplates[0]) => {
    importWorkflow(template.nodes, template.edges)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-xl shadow-panel w-full max-w-3xl overflow-hidden flex flex-col animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surfaceBright">
          <div className="flex items-center gap-2">
            <Blocks size={18} className="text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Workflow Templates</h2>
          </div>
          <button onClick={onClose} className="btn-ghost">
            <X size={16} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <p className="text-sm text-slate-400 mb-6">
            Get started quickly by choosing one of our pre-built HR workflow templates. These templates include custom configurations and automated steps.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflowTemplates.map((tpl) => (
              <div 
                key={tpl.id}
                onClick={() => handleSelect(tpl)}
                className="flex flex-col gap-3 p-4 rounded-xl border border-borderBright bg-surface hover:bg-surfaceHover hover:border-indigo-500/50 cursor-pointer transition-all hover:-translate-y-1 group"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow"
                    style={{ backgroundColor: `${tpl.color}15`, color: tpl.color, border: `1px solid ${tpl.color}30` }}
                  >
                    {tpl.icon}
                  </div>
                  <h3 className="text-[15px] font-bold text-slate-200 group-hover:text-white transition-colors">{tpl.name}</h3>
                </div>
                
                <p className="text-xs text-slate-500 leading-relaxed flex-1">
                  {tpl.description}
                </p>
                
                <div className="flex items-center gap-2 mt-2 pt-3 border-t border-border">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    {tpl.nodes.length} Nodes &bull; {tpl.edges.length} Edges
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
