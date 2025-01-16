import addData from '@/utilities/addReqData'
import { PayloadHandler } from 'payload'

export interface ApiModel {
  id: string
  name: string
  type: string
  description: string
  cost: number
  imageinput: boolean
  settings: any[]
  systemprompt: boolean
  negativeprompt: boolean
  examples: any[]
  // about: any
}

export interface ApifetchModel {
  id: string
  name: string
  type: string
  description: string
  cost: number
  imageinput: boolean
  examples: any[]
  // about: any
}

export const getAllModels: PayloadHandler = async (req): Promise<Response> => {
  const { payload, user } = req

  if (!user) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { docs } = await payload.find({ collection: 'models' })

    const models: ApiModel[] = docs.map((doc) => {
      return {
        id: doc.id,
        name: doc.name,
        type: doc.type,
        description: doc.description,
        cost: doc.commissionapplicable ? doc.cost + (doc.commision ?? 0) : doc.cost,
        imageinput: doc.imageinput,
        settings: doc.settings,
        systemprompt: doc.systemprompt,
        negativeprompt: doc.negativeprompt,
        examples: doc.examples,
        // about: doc.about,
      }
    })

    return Response.json(
      { success: true, message: 'Models fetched successfully', data: models },
      { status: 200 },
    )
  } catch (error) {
    console.log('Error in getAllModels endpoint', error.message)
    return Response.json({ success: false, error: 'Error fetching models' }, { status: 400 })
  }
}

export const getModelbySlug: PayloadHandler = async (req): Promise<Response> => {
  const { payload, routeParams, user } = req
  const rappId = routeParams?.slug as string

  if (!user) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { docs } = await payload.find({
      collection: 'models',
      where: { name: { equals: rappId } },
    })

    const models: ApifetchModel[] = docs.map((doc) => {
      return {
        id: doc.id,
        name: doc.name,
        type: doc.type,
        description: doc.description,
        cost: doc.commissionapplicable ? doc.cost + (doc.commision ?? 0) : doc.cost,
        imageinput: doc.imageinput,
        examples: doc.examples,
        // about: doc.about,
      }
    })

    return Response.json(
      { success: true, message: 'Models fetched successfully', data: models },
      { status: 200 },
    )
  } catch (error) {
    console.log('Error in getModelbySlug endpoint', error.message)
    return Response.json({ success: false, error: 'Error fetching models' }, { status: 400 })
  }
}
