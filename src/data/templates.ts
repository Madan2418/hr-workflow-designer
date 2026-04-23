import type { Node, Edge } from '@xyflow/react'
import type { WorkflowNodeData } from '../types/nodes'

export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  icon: string
  color: string
  nodes: Node<WorkflowNodeData>[]
  edges: Edge[]
}

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'onboarding',
    name: 'Employee Onboarding',
    description: 'End-to-end new hire flow with task distribution and auto-notifications',
    icon: '🚀',
    color: '#22c55e',
    nodes: [
      { id: 'n1', type: 'start',         position: { x: 60,  y: 160 }, data: { type: 'start',         label: 'Onboarding Start', metadata: { department: 'Engineering', priority: 'high' } } },
      { id: 'n2', type: 'task',          position: { x: 280, y: 60  }, data: { type: 'task',          label: 'Collect Documents', description: 'Gather ID, bank details, emergency contacts', assignee: 'HR Coordinator', dueDate: '2025-01-15', customFields: { checklist: 'ID+Contract+Form16' } } },
      { id: 'n3', type: 'task',          position: { x: 280, y: 240 }, data: { type: 'task',          label: 'Setup Workstation', description: "Configure laptop, tools, and access credentials", assignee: 'IT Team', dueDate: '2025-01-15', customFields: {} } },
      { id: 'n4', type: 'automatedStep', position: { x: 520, y: 60  }, data: { type: 'automatedStep', label: 'Send Welcome Email', actionId: 'send_email', actionParams: { to: 'new_hire@company.com', subject: 'Welcome to the team!' } } },
      { id: 'n5', type: 'approval',      position: { x: 520, y: 240 }, data: { type: 'approval',      label: 'Manager Sign-off', approverRole: 'Manager', autoApproveThreshold: 2 } },
      { id: 'n6', type: 'automatedStep', position: { x: 760, y: 160 }, data: { type: 'automatedStep', label: 'Generate Offer Packet', actionId: 'generate_doc', actionParams: { template: 'offer_letter', recipient: 'new_hire' } } },
      { id: 'n7', type: 'end',           position: { x: 980, y: 160 }, data: { type: 'end',           label: 'Onboarding Complete', endMessage: 'Employee is fully onboarded and ready.', showSummary: true } },
    ],
    edges: [
      { id: 'e1-2', source: 'n1', target: 'n2', animated: true },
      { id: 'e1-3', source: 'n1', target: 'n3', animated: true },
      { id: 'e2-4', source: 'n2', target: 'n4', animated: true },
      { id: 'e3-5', source: 'n3', target: 'n5', animated: true },
      { id: 'e4-6', source: 'n4', target: 'n6', animated: true },
      { id: 'e5-6', source: 'n5', target: 'n6', animated: true },
      { id: 'e6-7', source: 'n6', target: 'n7', animated: true },
    ],
  },
  {
    id: 'leave_approval',
    name: 'Leave Approval',
    description: 'Multi-level leave request routing with auto-approval thresholds',
    icon: '🌴',
    color: '#f59e0b',
    nodes: [
      { id: 'n1', type: 'start',         position: { x: 60,  y: 160 }, data: { type: 'start',         label: 'Leave Request',    metadata: { type: 'annual', requestor: 'employee' } } },
      { id: 'n2', type: 'task',          position: { x: 280, y: 160 }, data: { type: 'task',          label: 'Fill Leave Form',  description: 'Employee submits leave dates and reason', assignee: 'Employee', dueDate: '', customFields: { form: 'L-2025' } } },
      { id: 'n3', type: 'approval',      position: { x: 500, y: 80  }, data: { type: 'approval',      label: 'Manager Approval', approverRole: 'Manager', autoApproveThreshold: 3 } },
      { id: 'n4', type: 'approval',      position: { x: 500, y: 240 }, data: { type: 'approval',      label: 'HR Approval',      approverRole: 'HRBP',    autoApproveThreshold: 0 } },
      { id: 'n5', type: 'automatedStep', position: { x: 720, y: 160 }, data: { type: 'automatedStep', label: 'Update HR System', actionId: 'send_email', actionParams: { to: 'hris@company.com', subject: 'Leave Approved' } } },
      { id: 'n6', type: 'end',           position: { x: 940, y: 160 }, data: { type: 'end',           label: 'Leave Approved',   endMessage: 'Leave request processed successfully.', showSummary: false } },
    ],
    edges: [
      { id: 'e1-2', source: 'n1', target: 'n2', animated: true },
      { id: 'e2-3', source: 'n2', target: 'n3', animated: true },
      { id: 'e2-4', source: 'n2', target: 'n4', animated: true },
      { id: 'e3-5', source: 'n3', target: 'n5', animated: true },
      { id: 'e4-5', source: 'n4', target: 'n5', animated: true },
      { id: 'e5-6', source: 'n5', target: 'n6', animated: true },
    ],
  },
  {
    id: 'doc_verification',
    name: 'Document Verification',
    description: 'Automated document processing with compliance check and sign-off',
    icon: '📄',
    color: '#06b6d4',
    nodes: [
      { id: 'n1', type: 'start',         position: { x: 60,  y: 160 }, data: { type: 'start',         label: 'Doc Submission',   metadata: { category: 'compliance', source: 'portal' } } },
      { id: 'n2', type: 'automatedStep', position: { x: 280, y: 160 }, data: { type: 'automatedStep', label: 'OCR Extraction',   actionId: 'generate_doc', actionParams: { template: 'ocr_extract', recipient: 'system' } } },
      { id: 'n3', type: 'task',          position: { x: 500, y: 160 }, data: { type: 'task',          label: 'Manual Review',    description: 'Compliance officer reviews extracted data', assignee: 'Compliance Officer', dueDate: '', customFields: { sla: '24h' } } },
      { id: 'n4', type: 'approval',      position: { x: 720, y: 160 }, data: { type: 'approval',      label: 'Director Sign-off', approverRole: 'Director', autoApproveThreshold: 1 } },
      { id: 'n5', type: 'automatedStep', position: { x: 940, y: 80  }, data: { type: 'automatedStep', label: 'Archive Document', actionId: 'generate_doc', actionParams: { template: 'archive', recipient: 'dms' } } },
      { id: 'n6', type: 'automatedStep', position: { x: 940, y: 240 }, data: { type: 'automatedStep', label: 'Notify Requester', actionId: 'send_email', actionParams: { to: 'requester@company.com', subject: 'Document Verified' } } },
      { id: 'n7', type: 'end',           position: { x: 1160, y: 160 }, data: { type: 'end',           label: 'Verification Done', endMessage: 'Document verified and archived.', showSummary: true } },
    ],
    edges: [
      { id: 'e1-2', source: 'n1', target: 'n2', animated: true },
      { id: 'e2-3', source: 'n2', target: 'n3', animated: true },
      { id: 'e3-4', source: 'n3', target: 'n4', animated: true },
      { id: 'e4-5', source: 'n4', target: 'n5', animated: true },
      { id: 'e4-6', source: 'n4', target: 'n6', animated: true },
      { id: 'e5-7', source: 'n5', target: 'n7', animated: true },
      { id: 'e6-7', source: 'n6', target: 'n7', animated: true },
    ],
  },
]
