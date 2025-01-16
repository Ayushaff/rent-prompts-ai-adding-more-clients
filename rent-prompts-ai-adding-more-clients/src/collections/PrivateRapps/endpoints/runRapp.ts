import { Model, User } from '@/payload-types'
import addData from '@/utilities/addReqData'
import replaceVariables from '@/utilities/replaceVariables'
import getOutput from '@/utilities/runClients'
import { PayloadHandler } from 'payload'

interface ReqData {
  promptValues?: { [key: string]: string }
  negativeValues?: { [key: string]: string }
  systemValues?: { [key: string]: string }
  settingsRaw?: { [key: string]: any }
  image?: any
  promptRaw?: string
  negativePromptRaw?: string
  systemPromptRaw?: string
  keyRaw?: 'test' | 'prod'
  modelId?: string
}

const runRapp: PayloadHandler = async (req): Promise<Response> => {
  try {
    const { payload, user, routeParams, query } = req

    const id = routeParams?.id as string
    const {  type: rapptype } = query;
    let rapp;

    if (!user) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const {
      promptValues,
      negativeValues,
      systemValues,
      image,
      promptRaw,
      negativePromptRaw,
      systemPromptRaw,
      settingsRaw,
      keyRaw,
      modelId,
    }: ReqData = await addData(req)

    let model: Model,
      key: string,
      prompt: string,
      negativePrompt: string,
      systemPrompt: string,
      settings: { [key: string]: any }

    if (id === 'live') {
      model = await payload.findByID({ collection: 'models', id: modelId as string })
      key = keyRaw ?? 'test'
      prompt = replaceVariables(promptRaw ?? '', promptValues ?? {})
      negativePrompt = replaceVariables(negativePromptRaw ?? '', negativeValues ?? {})
      systemPrompt = replaceVariables(systemPromptRaw ?? '', systemValues ?? {})
      settings = settingsRaw ?? {}
      
      if (user.role === 'entAdmin') {
        if (user.coinBalance < model.cost + (model.commision ?? 0)) {
          return Response.json({ success: false, error: 'Insufficient balance' }, { status: 404 })
        }
      } else if (user.role === 'entUser') {
        const enterpriseDetail = user.associatedWith as User
  
        if (enterpriseDetail.coinBalance < model.cost + (model.commision ?? 0)) {
          return Response.json({ error: 'Insufficient balance' }, { status: 404 })
        }
      }
  
      let apiKey =''
      let modelName =''
  
      if(model.provider === 'openai'){
        apiKey=(key === 'prod' ? model.prodkeys?.openai?.apikey:model.prodkeys?.openai?.apikey) ?? ''
        modelName=(key === 'prod' ? model.prodkeys?.openai?.modelname : model.testkeys?.openai?.modelname) ?? ''
      }else if(model.provider === 'groq'){
        apiKey=(key === 'prod' ? model.prodkeys?.groq?.apikey : model.testkeys?.groq?.apikey) ?? ''
        modelName=(key === 'prod' ? model.prodkeys?.groq?.modelname : model.testkeys?.groq?.modelname) ?? ''
      }else if(model.provider === 'replicate'){
        apiKey=(key==='prod'?model.prodkeys?.replicate?.apikey:model.testkeys?.replicate?.apikey) ?? ''
        modelName=(key==='prod'?model.prodkeys?.replicate?.modelname:model.testkeys?.replicate?.modelname) ?? ''
      }else if(model.provider === 'falai'){
        apiKey=(key==='prod'?model.prodkeys?.falai?.apikey:model.testkeys?.falai?.apikey) ?? ''
        modelName=(key==='prod'?model.prodkeys?.falai?.modelname:model.testkeys?.falai?.modelname) ?? ''
      }
  
  
      const output = await getOutput({
        modelName: modelName,
        apiKey: apiKey,
        provider: model.provider,
        prompt: prompt,
        negativePrompt: negativePrompt,
        systemPrompt: systemPrompt,
        settings: settings,
        image: image,
      })
  
      return Response.json(
        { success: true, message: 'Rapp run successfully', data: output },
        { status: 200 },
      )

    } else {

    if(rapptype === 'private'){
      rapp = await payload.findByID({ collection: 'privateRapps', id: id })
    }else{
      rapp = await payload.findByID({ collection: 'rapps', id: id })
    }
      
      model = rapp.model as Model
      key = rapp.key
      prompt = replaceVariables(rapp.prompt ?? '', promptValues ?? {})
      negativePrompt = replaceVariables(rapp.negativeprompt ?? '', negativeValues ?? {})
      systemPrompt = replaceVariables(rapp.systemprompt ?? '', systemValues ?? {})
      settings = rapp.settings ?? {}
    }

    if (user.role === 'entAdmin') {
      if (user.coinBalance < model.cost + (model.commision ?? 0)) {
        return Response.json({ success: false, error: 'Insufficient balance' }, { status: 404 })
      }
    } else if (user.role === 'entUser') {
      const enterpriseDetail = user.associatedWith as User

      if (enterpriseDetail.coinBalance < model.cost + (model.commision ?? 0)) {
        return Response.json({ error: 'Insufficient balance' }, { status: 404 })
      }
    }

    let apiKey =''
    let modelName =''

    if(model.provider === 'openai'){
      apiKey=(key === 'prod' ? model.prodkeys?.openai?.apikey:model.prodkeys?.openai?.apikey) ?? ''
      modelName=(key === 'prod' ? model.prodkeys?.openai?.modelname : model.testkeys?.openai?.modelname) ?? ''
    }else if(model.provider === 'groq'){
      apiKey=(key === 'prod' ? model.prodkeys?.groq?.apikey : model.testkeys?.groq?.apikey) ?? ''
      modelName=(key === 'prod' ? model.prodkeys?.groq?.modelname : model.testkeys?.groq?.modelname) ?? ''
    }else if(model.provider === 'replicate'){
      apiKey=(key==='prod'?model.prodkeys?.replicate?.apikey:model.testkeys?.replicate?.apikey) ?? ''
      modelName=(key==='prod'?model.prodkeys?.replicate?.modelname:model.testkeys?.replicate?.modelname) ?? ''
    }else if(model.provider === 'falai'){
      apiKey=(key==='prod'?model.prodkeys?.falai?.apikey:model.testkeys?.falai?.apikey) ?? ''
      modelName=(key==='prod'?model.prodkeys?.falai?.modelname:model.testkeys?.falai?.modelname) ?? ''
    }


    const output = await getOutput({
      modelName: modelName,
      apiKey: apiKey,
      provider: model.provider,
      prompt: prompt,
      negativePrompt: negativePrompt,
      systemPrompt: systemPrompt,
      settings: settings,
      image: image,
    })

    return Response.json(
      { success: true, message: 'Rapp run successfully', data: output },
      { status: 200 },
    )
  } catch (e) {
    console.log('Error in run Rapp endpoint', e.message)
    return Response.json({ success: false, error: 'Error in running Rapp' }, { status: 500 })
  }
}

export default runRapp
