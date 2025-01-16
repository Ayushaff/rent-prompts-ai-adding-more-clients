import { PayloadHandler } from 'payload'

const livePreview: PayloadHandler = async (req): Promise<Response> => {
  const { routeParams, payload, user } = req
  const id = routeParams?.id as string

  if (!user) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  if (!id) {
    return Response.json({ success: false, error: 'No id provided' }, { status: 400 })
  }

  try {
    const res = await payload.findByID({ collection: 'models', id: id })
    const model = {
      id: res.id,
      name: res.name,
      description: res.description,
      type: res.type,
      imageinput: res.imageinput,
      settings: res.settings,
      cost: res.commision ? res.commision + res.cost : res.cost,
      systemprompt: res.systemprompt,
      negativeprompt: res.negativeprompt,
      examples: res.examples,
      // about: res.about,
    }

    return Response.json(
      { success: true, message: 'Model fetched successfully', data: model },
      { status: 200 },
    )
  } catch (error) {
    console.log('Error in livePreview endpoint', error.message)
    return Response.json({ success: false, error: 'Error fetching model' }, { status: 400 })
  }
}
export default livePreview
