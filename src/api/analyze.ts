import type { WorkflowGraph, AIAnalysis } from '../types/workflow'

function buildAnalysisPrompt(graph: WorkflowGraph): string {
  return `You are an HR workflow expert. Analyze this workflow graph and respond ONLY with valid JSON in this exact shape:
{
  "issues": ["issue1", "issue2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "summary": "one sentence plain-English description of the workflow"
}

Workflow JSON:
${JSON.stringify(graph, null, 2)}`
}

export async function analyzeWorkflow(graph: WorkflowGraph): Promise<AIAnalysis> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('VITE_ANTHROPIC_API_KEY is not set. Add it to .env.local')
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{ role: 'user', content: buildAnalysisPrompt(graph) }],
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: { message?: string } }).error?.message ?? 'Anthropic API error')
  }

  const data = await res.json()
  const text: string = data.content[0].text

  // Parse JSON response — handle markdown code fences if present
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) ?? [null, text]
  const parsed: AIAnalysis = JSON.parse(jsonMatch[1]!.trim())
  return parsed
}
