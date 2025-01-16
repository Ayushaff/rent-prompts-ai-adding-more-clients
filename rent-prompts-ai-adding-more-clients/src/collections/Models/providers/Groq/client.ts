import { ChatPromptTemplate } from '@langchain/core/prompts'
import { ChatGroq } from '@langchain/groq'

export interface GroqInputProps {
  apiKey: string

  model: string // default "mixtral-8x7b-32768"

  prompt: string

  systemPrompt?: string

  negativePrompt?: string

  image?: any

  settings: {
    maxConcurrency?: number // The maximum number of concurrent calls that can be made. Defaults to Infinity, which means no limit.

    maxRetries?: number // The maximum number of retries that can be made for a single call, with an exponential backoff between each attempt. Defaults to 6.

    maxTokens?: number // The maximum number of tokens that the model can process in a single response. This limits ensures computational efficiency and resource management.

    // onFailedAttempt?: FailedAttemptHandler; // Custom handler to handle failed attempts. Takes the originally thrown error object as input, and should itself throw an error if the input error is not retryable.

    stopSequences?: string[] // Up to 4 sequences where the API will stop generating further tokens. The returned text will not contain the stop sequence.

    streaming?: boolean // Whether or not to stream responses.

    temperature?: number // The temperature to use for sampling.
  }
}
// TODO: add support for structured output
// TODO: add support for streaming
const runGroq = async (args: GroqInputProps) => {
  const { apiKey, settings, model, prompt, systemPrompt, negativePrompt, image } = args
  const { maxConcurrency, maxRetries, maxTokens, stopSequences, streaming, temperature } = settings

  try {
    const llm = new ChatGroq({
      apiKey: apiKey,
      maxConcurrency: maxConcurrency,
      maxRetries: maxRetries,
      maxTokens: maxTokens,
      model: model,
      stopSequences: stopSequences,
      streaming: streaming,
      temperature: temperature,
    })

    const promptTemplate = ChatPromptTemplate.fromMessages([
      ['system', '{system_prompt}'],
      ['human', '{user_prompt}'],
    ])

    const chain = promptTemplate.pipe(llm)
    const aiMsg = await chain.invoke({
      user_prompt: prompt,
      system_prompt: systemPrompt,
    })

    // console.log('content', aiMsg.content)
    // console.log('usage', aiMsg.usage_metadata)
    return {
      result: aiMsg.content,
      metadata: aiMsg.usage_metadata,
    }
  } catch (e) {
    console.log('Error in the client of groq', e.message)
    return { error: e.message }
  }
}

export default runGroq
