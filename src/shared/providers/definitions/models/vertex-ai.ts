import { createVertex } from '@ai-sdk/google-vertex'
import type { LanguageModelV3 } from '@ai-sdk/provider'
import type { GoogleGenerativeAIProviderOptions } from '@ai-sdk/google'
import AbstractAISDKModel, { type CallSettings } from '../../../models/abstract-ai-sdk'
import type { CallChatCompletionOptions } from '../../../models/types'
import type { ProviderModelInfo } from '../../../types'
import type { ModelDependencies } from '../../../types/adapters'
import { normalizeGoogleThinkingConfig } from '../../../utils/google-thinking'

interface Options {
  project: string
  location: string
  apiKey?: string
  apiHost?: string
  model: ProviderModelInfo
  temperature?: number
  topP?: number
  maxOutputTokens?: number
  stream?: boolean
}

export default class VertexAI extends AbstractAISDKModel {
  public name = 'Google Vertex AI'

  constructor(public options: Options, dependencies: ModelDependencies) {
    super(options, dependencies)
    this.injectDefaultMetadata = false
  }

  protected getProvider() {
    return createVertex({
      project: this.options.project,
      location: this.options.location,
      ...(this.options.apiKey ? { apiKey: this.options.apiKey } : {}),
      ...(this.options.apiHost ? { baseURL: this.options.apiHost } : {}),
    })
  }

  protected getChatModel(_options: CallChatCompletionOptions): LanguageModelV3 {
    const provider = this.getProvider()
    return provider.languageModel(this.options.model.modelId as never)
  }

  protected getCallSettings(options: CallChatCompletionOptions): CallSettings {
    const isModelSupportThinking = this.isSupportReasoning()
    let providerParams: GoogleGenerativeAIProviderOptions = {
      safetySettings: [
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      ],
    }

    if (isModelSupportThinking) {
      providerParams = {
        ...providerParams,
        ...(options.providerOptions?.google || {}),
        thinkingConfig: {
          ...(normalizeGoogleThinkingConfig(
            this.options.model.modelId,
            options.providerOptions?.google?.thinkingConfig
          ) || {}),
          includeThoughts: true,
        },
      }
    }

    return {
      temperature: this.options.temperature,
      topP: this.options.topP,
      maxOutputTokens: this.options.maxOutputTokens,
      providerOptions: {
        google: {
          ...providerParams,
        } satisfies GoogleGenerativeAIProviderOptions,
      },
    }
  }
}
