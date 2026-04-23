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

  const simulatingNodeId = useWorkflowStore((s) => s.simulatingNodeId)
  const isSimulating = simulatingNodeId === id

  return (
    <div
      className={`
        relative rounded-2xl min-w-[220px] bg-surface/90 backdrop-blur-md shadow-node overflow-hidden
        transition-all duration-300 cursor-pointer
        ${isSimulating ? 'node-simulating' : ''}
      `}
      style={{
        border: `1px solid ${selected ? accentColor : hasError ? '#ef4444' : hasWarning ? '#f59e0b' : '#2e3148'}`,
        ...(selected ? { boxShadow: `0 0 0 1px ${accentColor}, 0 4px 30px ${accentColor}33` } : {})
      }}
    >
      {/* Dynamic top highlight line */}
      <div 
        className="absolute top-0 left-0 right-0 h-1" 
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} 
      />

      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold uppercase tracking-wider relative"
        style={{ 
          background: `linear-gradient(180deg, ${accentColor}1A 0%, transparent 100%)`, 
          borderBottom: `1px solid ${accentColor}2A` 
        }}
      >
        <span className="flex items-center justify-center w-6 h-6 rounded-md shadow-sm" style={{ background: `${accentColor}2A`, color: accentColor }}>
          {icon}
        </span>
        <span style={{ color: accentColor }}>{typeLabel}</span>

        {/* Validation badges */}
        <div className="ml-auto flex items-center gap-1">
          {hasError && (
            <span className="w-5 h-5 rounded-full bg-danger/10 text-danger flex items-center justify-center shadow-[0_0_8px_#ef444455]" title="Missing required configuration">
              <span className="font-bold text-[10px]">!</span>
            </span>
          )}
          {hasWarning && !hasError && (
            <span className="w-5 h-5 rounded-full bg-warning/10 text-warning flex items-center justify-center" title="Suboptimal configuration">
              <span className="font-bold text-[10px]">?</span>
            </span>
          )}

          <button
            className="ml-1 w-6 h-6 flex items-center justify-center rounded-md text-slate-500 hover:bg-danger/10 hover:text-danger transition-colors"
            onClick={(e) => { e.stopPropagation(); deleteNode(id) }}
            title="Delete node"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 text-sm text-slate-300">
        {children}
      </div>

      {/* Handles */}
      {hasTarget && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !border-2"
          style={{
            background: accentColor,
            borderColor: '#080b14',
            top: '50%',
            left: -7,
            transform: 'translateY(-50%)',
          }}
        />
      )}
      {hasSource && (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !border-2"
          style={{
            background: accentColor,
            borderColor: '#080b14',
            top: '50%',
            right: -7,
            transform: 'translateY(-50%)',
          }}
        />
      )}
    </div>
  )
})
