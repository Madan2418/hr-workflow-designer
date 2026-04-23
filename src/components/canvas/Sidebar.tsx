import { NodeType } from '../../types/nodes'
import { Play, ClipboardList, ShieldCheck, Zap, Flag } from 'lucide-react'

const nodeItems = [
  { type: NodeType.Start, label: 'Start', color: '#22c55e', icon: <Play size={14} />, desc: 'Workflow entry point' },
  { type: NodeType.Task, label: 'Task', color: '#6366f1', icon: <ClipboardList size={14} />, desc: 'Human task step' },
  { type: NodeType.Approval, label: 'Approval', color: '#f59e0b', icon: <ShieldCheck size={14} />, desc: 'Approval gate' },
  { type: NodeType.AutomatedStep, label: 'Automated', color: '#06b6d4', icon: <Zap size={14} />, desc: 'System action' },
  { type: NodeType.End, label: 'End', color: '#ef4444', icon: <Flag size={14} />, desc: 'Workflow completion' },
]

export function Sidebar() {
  const onDragStart = (e: React.DragEvent<HTMLDivElement>, type: NodeType) => {
    e.dataTransfer.setData('application/reactflow', type)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside className="w-[220px] flex flex-col gap-3 p-4 border-r border-border bg-surface overflow-y-auto shrink-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-1">
        Node Palette
      </p>
      <div className="flex flex-col gap-2">
        {nodeItems.map(({ type, label, color, icon, desc }) => (
          <div
            key={type}
            draggable
            onDragStart={e => onDragStart(e, type)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-grab border border-transparent
              hover:border-border hover:bg-surfaceBright active:cursor-grabbing active:scale-[0.98] transition-all select-none group relative overflow-hidden"
            style={{ background: `linear-gradient(90deg, ${color}0A, transparent)` }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: color }} />
            
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white shadow-sm"
              style={{ background: `${color}1A`, color, border: `1px solid ${color}30` }}
            >
              {icon}
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-200 group-hover:text-white transition-colors">{label}</p>
              <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto border-t border-border pt-3">
        <p className="text-xs text-slate-600 px-1 leading-relaxed">
          Drag nodes onto the canvas to build your workflow.
        </p>
      </div>
    </aside>
  )
}
