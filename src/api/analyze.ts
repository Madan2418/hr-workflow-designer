import type { AIAnalysis, WorkflowGraph } from '../types/workflow'

type AIProvider = 'anthropic' | 'openai' | 'gemini' | 'openai-compatible'

interface AIProviderConfig {
  provider: AIProvider
  label: string
  apiKey: string
  model: string
  baseUrl?: string
}

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

function parseJsonBlock(text: string): AIAnalysis {
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) ?? [null, text]
  return JSON.parse(jsonMatch[1]!.trim()) as AIAnalysis
}

function inferProviderFromKey(apiKey: string): AIProvider {
  if (apiKey.startsWith('sk-ant-')) return 'anthropic'
  if (apiKey.startsWith('AIza')) return 'gemini'
  return 'openai'
}

function normalizeGeminiModel(model: string): string {
  const trimmed = model.trim()
  if (trimmed.startsWith('models/')) {
    return trimmed.slice('models/'.length)
  }

  const normalized = trimmed.toLowerCase().replace(/[_\s]+/g, '-')

  const aliasMap: Record<string, string> = {
    'gemini-flash-2.5': 'gemini-2.5-flash',
    'gemini-2-5-flash': 'gemini-2.5-flash',
    'gemini-2.5-flash': 'gemini-2.5-flash',
    'gemini-2.0-flash': 'gemini-2.0-flash',
    'gemini-flash-2.0': 'gemini-2.0-flash',
    'gemini-pro': 'gemini-1.5-pro',
  }

  return aliasMap[normalized] ?? normalized
}

export function getAIProviderConfig(): AIProviderConfig | null {
  const provider = import.meta.env.VITE_AI_PROVIDER as AIProvider | undefined
  const genericApiKey = import.meta.env.VITE_AI_API_KEY
  const genericModel = import.meta.env.VITE_AI_MODEL
  const genericBaseUrl = import.meta.env.VITE_AI_BASE_URL

  if (genericApiKey) {
    const resolvedProvider = provider ?? (genericBaseUrl ? 'openai-compatible' : inferProviderFromKey(genericApiKey))
    const model =
      genericModel ??
      (resolvedProvider === 'anthropic'
        ? 'claude-3-5-sonnet-20241022'
        : resolvedProvider === 'gemini'
          ? 'gemini-2.0-flash'
          : 'gpt-4o-mini')

    return {
      provider: resolvedProvider,
      label:
        resolvedProvider === 'openai-compatible'
          ? 'OpenAI-compatible'
          : resolvedProvider.charAt(0).toUpperCase() + resolvedProvider.slice(1),
      apiKey: genericApiKey,
      model,
      baseUrl: genericBaseUrl,
    }
  }

  if (import.meta.env.VITE_ANTHROPIC_API_KEY) {
    return {
      provider: 'anthropic',
      label: 'Anthropic',
      apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
      model: import.meta.env.VITE_ANTHROPIC_MODEL ?? 'claude-3-5-sonnet-20241022',
    }
  }

  if (import.meta.env.VITE_OPENAI_API_KEY) {
    return {
      provider: 'openai',
      label: 'OpenAI',
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      model: import.meta.env.VITE_OPENAI_MODEL ?? 'gpt-4o-mini',
      baseUrl: import.meta.env.VITE_OPENAI_BASE_URL,
    }
  }

  if (import.meta.env.VITE_GEMINI_API_KEY) {
    return {
      provider: 'gemini',
      label: 'Gemini',
      apiKey: import.meta.env.VITE_GEMINI_API_KEY,
      model: normalizeGeminiModel(import.meta.env.VITE_GEMINI_MODEL ?? 'gemini-2.0-flash'),
    }
  }

  return null
}

async function analyzeWithAnthropic(config: AIProviderConfig, prompt: string): Promise<AIAnalysis> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: { message?: string } }).error?.message ?? 'Anthropic API error')
  }

  const data = await res.json()
  const text = (data.content?.[0]?.text as string | undefined) ?? ''
  return parseJsonBlock(text)
}

async function analyzeWithOpenAICompatible(config: AIProviderConfig, prompt: string): Promise<AIAnalysis> {
  const baseUrl = config.baseUrl?.replace(/\/$/, '') ?? 'https://api.openai.com/v1'
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const message =
      (err as { error?: { message?: string }; message?: string }).error?.message ??
      (err as { message?: string }).message
    throw new Error(message ?? `${config.label} API error`)
  }

  const data = await res.json()
  const text = (data.choices?.[0]?.message?.content as string | undefined) ?? ''
  return parseJsonBlock(text)
}

async function analyzeWithGemini(config: AIProviderConfig, prompt: string): Promise<AIAnalysis> {
  const model = normalizeGeminiModel(config.model)
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const message = (err as { error?: { message?: string } }).error?.message
    throw new Error(message ?? 'Gemini API error')
  }

  const data = await res.json()
  const text = (data.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined) ?? ''
  return parseJsonBlock(text)
}

export async function analyzeWorkflow(graph: WorkflowGraph): Promise<AIAnalysis> {
  const config = getAIProviderConfig()
  if (!config) {
    throw new Error(
      'Set VITE_AI_API_KEY or one of VITE_ANTHROPIC_API_KEY, VITE_OPENAI_API_KEY, VITE_GEMINI_API_KEY in .env.local'
    )
  }

  const prompt = buildAnalysisPrompt(graph)

  if (config.provider === 'anthropic') {
    return analyzeWithAnthropic(config, prompt)
  }

  if (config.provider === 'gemini') {
    return analyzeWithGemini(config, prompt)
  }

  return analyzeWithOpenAICompatible(config, prompt)
}
