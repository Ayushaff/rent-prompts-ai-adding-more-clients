import runFalAi from '@/collections/Models/providers/Falai/client'
import runGroq from '@/collections/Models/providers/Groq/client'
import runOpenAi from '@/collections/Models/providers/Openai/client'
import runReplicate from '@/collections/Models/providers/Replicate/client'

interface GetOutputPropts {
  provider: 'groq' | 'openai' | 'replicate' | 'falai'
  apiKey: string
  modelName: any
  prompt: string
  negativePrompt?: string
  systemPrompt?: string
  settings?: any
  image?: any
}

const getOutput = async (props: GetOutputPropts) => {
  const { modelName, apiKey, image, negativePrompt, prompt, systemPrompt, settings, provider } =
    props
  let output
  switch (provider) {
    case 'groq': {
      output = await runGroq({
        apiKey: apiKey,
        model: modelName,
        prompt: prompt,
        negativePrompt: negativePrompt,
        systemPrompt: systemPrompt,
        settings: settings,
        image: image,
      })
      break
    }
    case 'openai':{
      // Handle OpenAI integration
      output=await runOpenAi({
        apiKey: apiKey,
        model: modelName,
        prompt: prompt,
        image: image,
        maxTokens: settings.maxTokens,
      })
      break
    }
    case 'replicate':{
      // Handle Replicate integration
      output=await runReplicate({
        model: modelName,
        userPrompt: prompt,
        systemPrompt: systemPrompt,
        settings: settings,
        apiKey: apiKey,
        image: image,
      })
      break
    }
    case 'falai':{
      // Handle Falai integration
      output=await runFalAi({
        apiKey: apiKey,
        model: modelName,
        prompt: prompt,
        image: image,
        settings: settings,
      })
      break
    }
  }
  return output
}
export default getOutput
