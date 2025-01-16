import { ChatOpenAI } from '@langchain/openai'
import { HumanMessage } from '@langchain/core/messages'

interface args {
  model: string
  apiKey: string
  maxTokens?: number
  prompt: string
  image?: string | null
}
export default async function runOpenAi({ model, apiKey, maxTokens, prompt, image }: args) {
  // console.log("first,", model, apiKey, maxTokens, prompt, image);
  try {
    const chat = new ChatOpenAI({
      model: model,
      maxTokens: maxTokens,
      apiKey: apiKey,
    })

    const textContent = {
      type: 'text',
      text: prompt,
    }
    const imageContent = {
      type: 'image_url',
      image_url: {
        url: image,
      },
    }

    let message
    if (image) {
      message = new HumanMessage({
        content: [textContent, imageContent],
      })
    } else {
      message = new HumanMessage({
        content: [textContent],
      })
    }

    const res = await chat.invoke([message])
    return res.content
  } catch (error) {
    console.log('OpenAIClient', error)
    throw new Error(`Please contact support team`)
  }
}
