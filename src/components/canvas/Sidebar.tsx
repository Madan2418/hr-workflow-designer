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
    <aside className="w-48 flex flex-col gap-2 p-3 border-r border-border bg-surface overflow-y-auto shrink-0">
      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium px-1 mb-1">
        Node Palette
      </p>
      {nodeItems.map(({ type, label, color, icon, desc }) => (
        <div
          key={type}
          draggable
          onDragStart={e => onDragStart(e, type)}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-grab border border-transparent
            hover:border-border hover:bg-surfaceHover active:cursor-grabbing transition-all select-none"
          style={{ background: `${color}11` }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-white"
            style={{ background: `${color}33`, color }}
          >
            {icon}
          </div>
          <div>
            <p className="text-xs font-semibold text-white">{label}</p>
            <p className="text-xs text-slate-500 leading-tight">{desc}</p>
          </div>
        </div>
      ))}

      <div className="mt-auto border-t border-border pt-3">
        <p className="text-xs text-slate-600 px-1 leading-relaxed">
          Drag nodes onto the canvas to build your workflow.
        </p>
      </div>
    </aside>
  )
}
