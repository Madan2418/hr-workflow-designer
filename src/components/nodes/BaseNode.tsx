import { memo, type ReactNode } from 'react'
import { Handle, Position } from '@xyflow/react'
import { Trash2 } from 'lucide-react'
import { useWorkflowStore } from '../../hooks/useWorkflowStore'
import { useValidation } from '../../hooks/useValidation'

interface BaseNodeProps {
  id: string
  selected?: boolean
  accentColor: string
  icon: ReactNode
  typeLabel: string
  children: ReactNode
  hasTarget?: boolean
  hasSource?: boolean
}

export const BaseNode = memo(function BaseNode({
  id,
  selected,
  accentColor,
  icon,
  typeLabel,
  children,
  hasTarget = true,
  hasSource = true,
}: BaseNodeProps) {
  const deleteNode = useWorkflowStore((s) => s.deleteNode)
  const validationErrors = useValidation()
  const hasError = validationErrors.some(e => e.severity === 'error' && e.nodeId === id)
  const hasWarning = !hasError && validationErrors.some(e => e.severity === 'warning' && e.nodeId === id)

  return (
    <div
      className={`
        relative rounded-xl border min-w-[180px] bg-surface shadow-lg
        transition-all duration-200 cursor-pointer
        ${selected ? 'ring-2 ring-offset-1 ring-offset-canvas' : ''}
        ${hasError ? 'border-danger ring-1 ring-danger' : hasWarning ? 'border-warning ring-1 ring-warning' : 'border-border'}
      `}
      style={selected ? { boxShadow: `0 0 0 2px ${accentColor}` } : undefined}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-t-xl text-xs font-semibold uppercase tracking-wider"
        style={{ background: `${accentColor}22`, borderBottom: `1px solid ${accentColor}44` }}
      >
        <span style={{ color: accentColor }}>{icon}</span>
        <span style={{ color: accentColor }}>{typeLabel}</span>

        <button
          className="ml-auto text-slate-500 hover:text-danger transition-colors"
          onClick={(e) => { e.stopPropagation(); deleteNode(id) }}
          title="Delete node"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Content */}
      <div className="px-3 py-2 text-sm text-slate-200">
        {children}
      </div>

      {/* Handles */}
      {hasTarget && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3"
          style={{ background: accentColor }}
        />
      )}
      {hasSource && (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3"
          style={{ background: accentColor }}
        />
      )}
    </div>
  )
})
