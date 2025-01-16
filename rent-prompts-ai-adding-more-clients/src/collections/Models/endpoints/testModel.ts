import { PayloadHandler } from 'payload'
import runChatGroq from '../providers/Groq/client'
import addData from '@/utilities/addReqData'
import getOutput from '@/utilities/runClients'

interface ReqBody {
  prompt: string
  keyToUse: 'prod' | 'test'
  systemprompt?: string
  negativeprompt?: string
  image?: any
  settings?: any
}

const testModel: PayloadHandler = async (req): Promise<Response> => {
  const { routeParams, payload, user } = req
  const id = routeParams?.id as string

  if (!user) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  if (!id) {
    return Response.json({ success: false, error: 'No id provided' }, { status: 400 })
  }

  try {
    const model = await payload.findByID({ collection: 'models', id: id })

    const data = await addData(req)

    const { prompt, keyToUse, systemprompt, negativeprompt, image, settings }: ReqBody = data

    // const apiKey =
    //   (keyToUse === 'prod' ? model.prodkeys?.groq?.apikey : model.testkeys?.groq?.apikey) ?? ''
    // const modelName =
    //   (keyToUse === 'prod' ? model.prodkeys?.groq?.modelname : model.testkeys?.groq?.modelname) ??
    //   ''

    let apiKey = ''
    let modelName = ''

    if (model.provider === 'openai') {
      apiKey =
        (keyToUse === 'prod' ? model.prodkeys?.openai?.apikey : model.testkeys?.openai?.apikey) ??
        ''
      modelName =
        (keyToUse === 'prod'
          ? model.prodkeys?.openai?.modelname
          : model.testkeys?.openai?.modelname) ?? ''
    } else if (model.provider === 'groq') {
      apiKey =
        (keyToUse === 'prod' ? model.prodkeys?.groq?.apikey : model.testkeys?.groq?.apikey) ?? ''
      modelName =
        (keyToUse === 'prod' ? model.prodkeys?.groq?.modelname : model.testkeys?.groq?.modelname) ??
        ''
    } else if (model.provider === 'replicate') {
      apiKey =
        (keyToUse === 'prod'
          ? model.prodkeys?.replicate?.apikey
          : model.testkeys?.replicate?.apikey) ?? ''
      modelName =
        (keyToUse === 'prod'
          ? model.prodkeys?.replicate?.modelname
          : model.testkeys?.replicate?.modelname) ?? ''
    } else if (model.provider === 'falai') {
      apiKey =
        (keyToUse === 'prod' ? model.prodkeys?.falai?.apikey : model.testkeys?.falai?.apikey) ?? ''
      modelName =
        (keyToUse === 'prod'
          ? model.prodkeys?.falai?.modelname
          : model.testkeys?.falai?.modelname) ?? ''
    }
    
    const output = await getOutput({
      modelName: modelName,
      apiKey: apiKey,
      provider: model.provider,
      prompt: prompt,
      negativePrompt: negativeprompt,
      systemPrompt: systemprompt,
      settings: settings,
      image: image,
    })
    if (output.error) {
      return Response.json({ success: false, error: output.error }, { status: 400 })
    }
    return Response.json(
      { success: true, message: 'Model run successfully', data: output },
      { status: 200 },
    )
  } catch (error) {
    console.log('Error in testModel endpoint livepreview run', error.message)
    return Response.json({ success: false, error: 'Error running model' }, { status: 400 })
  }
}
export default testModel
