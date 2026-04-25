import { ModelProviderEnum, ModelProviderType } from '../../types'
import { defineProvider } from '../registry'
import VertexAI from './models/vertex-ai'

export const vertexAIProvider = defineProvider({
  id: ModelProviderEnum.VertexAI,
  name: 'Google Vertex AI',
  type: ModelProviderType.Gemini,
  urls: {
    website: 'https://cloud.google.com/vertex-ai',
    docs: 'https://cloud.google.com/vertex-ai/generative-ai/docs/start/quickstarts/quickstart-multimodal',
    apiKey: 'https://console.cloud.google.com/apis/credentials',
  },
  defaultSettings: {
    // Default Vertex AI API host. Override via the "API Host" field to use a
    // custom endpoint (e.g. a private endpoint or VPC-SC perimeter URL).
    apiHost: 'https://us-central1-aiplatform.googleapis.com/v1',
    models: [
      {
        modelId: 'gemini-2.5-pro',
        capabilities: ['vision', 'reasoning', 'tool_use'],
        contextWindow: 1_048_576,
        maxOutput: 65_536,
      },
      {
        modelId: 'gemini-2.5-flash',
        capabilities: ['vision', 'reasoning', 'tool_use'],
        contextWindow: 1_048_576,
        maxOutput: 65_536,
      },
      {
        modelId: 'gemini-2.0-flash',
        capabilities: ['vision', 'tool_use'],
        contextWindow: 1_048_576,
        maxOutput: 8_192,
      },
      {
        modelId: 'gemini-1.5-pro',
        capabilities: ['vision', 'tool_use'],
        contextWindow: 2_097_152,
        maxOutput: 8_192,
      },
      {
        modelId: 'gemini-1.5-flash',
        capabilities: ['vision', 'tool_use'],
        contextWindow: 1_048_576,
        maxOutput: 8_192,
      },
    ],
  },
  createModel: (config) => {
    return new VertexAI(
      {
        project: config.providerSetting.project || '',
        location: config.providerSetting.location || 'us-central1',
        apiKey: config.providerSetting.apiKey || undefined,
        // apiHost carries the custom endpoint URL; passed as baseURL to createVertex
        apiHost: config.formattedApiHost || undefined,
        model: config.model,
        temperature: config.settings.temperature,
        topP: config.settings.topP,
        maxOutputTokens: config.settings.maxTokens,
        stream: config.settings.stream,
      },
      config.dependencies
    )
  },
  getDisplayName: (modelId, providerSettings) => {
    return `Vertex AI (${providerSettings?.models?.find((m) => m.modelId === modelId)?.nickname || modelId})`
  },
})
