import { memo } from 'react'
import { type NodeProps } from '@xyflow/react'
import { ClipboardList, User, Calendar } from 'lucide-react'
import { BaseNode } from './BaseNode'
import type { TaskNodeData } from '../../types/nodes'

export const TaskNode = memo(function TaskNode({ id, selected, data }: NodeProps & { data: TaskNodeData }) {
  return (
    <BaseNode id={id} selected={selected} accentColor="#6366f1" icon={<ClipboardList size={12} />} typeLabel="Task">
      <div className="flex flex-col gap-2 mt-0.5">
        <p className="font-bold text-white text-[13px] truncate">{data.label}</p>
        
        <div className="flex flex-wrap gap-1.5">
          {data.assignee ? (
            <span className="flex items-center gap-1 text-[10px] text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
              <User size={10} /> {data.assignee}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] text-warning bg-warning/10 px-1.5 py-0.5 rounded border border-warning/20">
              <User size={10} /> Unassigned
            </span>
          )}
          
          {data.dueDate && (
            <span className="flex items-center gap-1 text-[10px] text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
              <Calendar size={10} /> {data.dueDate}
            </span>
          )}
        </div>
      </div>
    </BaseNode>
  )
})
