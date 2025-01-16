import addData from '@/utilities/addReqData'
import { PayloadHandler } from 'payload'

interface NewRapp {}

const createRapp: PayloadHandler = async (req): Promise<Response> => {
  try {
    const { payload } = req
    const reqData = await addData(req)

    let modelCost
    let totalCost
    try {
      const model = await payload.findByID({ collection: 'models', id: reqData.model })
      modelCost = model.commissionapplicable ? model.cost + (model.commision ?? 0) : model.cost
      totalCost = reqData.priceapplicable ? reqData.price + modelCost : modelCost
    } catch (e) {
      console.log('Error in createRapp endpoint, cannot find model', e.message)
      return Response.json({ success: false, error: 'Model not found' }, { status: 400 })
    }

    const data = {
      modelType: reqData.type,
      model: reqData.model,
      systemprompt: reqData.systemprompt,
      prompt: reqData.prompt,
      negativeprompt: reqData.negativeprompt,
      status: reqData.status,
      imageinput: reqData.imageinput,
      name: reqData.name,
      description: reqData.description,
      priceapplicable: reqData.priceapplicable,
      price: reqData.price,
      totalCost: totalCost,
      images: reqData.images,
      creator: reqData.creator,
      systemVariables: reqData.systemVariables,
      promptVariables: reqData.promptVariables,
      negativeVariables: reqData.negativeVariables,
      key: reqData.key,
      access: reqData.access,
      settings: reqData.settings,
      tokens: 0,
      needsApproval: reqData.needsApproval
    }
    // console.log('reqData', data)
    const rapp = await payload.create({ collection: 'privateRapps', data: data })
    // console.log('newrapp', rapp)
    return Response.json(
      { success: true, message: 'Private Rapp created successfully', data: rapp },
      { status: 200 },
    )
  } catch (e) {
    console.log('Error in createRapp endpoint', e.message)
    return Response.json({ success: false, error: 'Error Creating Private Rapp' }, { status: 400 })
  }
}
export default createRapp
