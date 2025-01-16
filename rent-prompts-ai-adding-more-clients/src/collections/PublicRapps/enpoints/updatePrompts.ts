import { Model, User } from '../../../payload-types'
import addData from '@/utilities/addReqData'
import { PayloadHandler } from 'payload'
import slugify from 'slugify'
export const updatePrompts: PayloadHandler = async (req): Promise<Response> => {
    try {
      const { payload, routeParams, user } = req
      const id = routeParams?.id as string
  
      let promptData
      try {
        promptData = await addData(req)
      } catch (e) {
        console.error('Error parsing form data:', e)
        return Response.json({ success: false, error: 'Malformed request body' }, { status: 400 })
      }
  
      const rapp = await payload.findByID({
        collection: 'rapps',
        id: id,
      })
  
      const updatedDoc = await payload.update({
        collection: 'rapps',
        id,
        data: {
          systemprompt: promptData.systemprompt,
          prompt: promptData.userprompt,
          negativeprompt: promptData.negativeprompt,
          imageinput: promptData?.imageinput,
          systemVariables: promptData?.systemVariables,
          promptVariables: promptData?.promptVariables,
          negativeVariables: promptData?.negativeVariables,
        },
      })
  
      return Response.json(
        { success: true, message: 'Prompt updated successfully', updatedDoc },
        { status: 200 },
      )
    } catch (error) {
      console.error('Error updating prompt:', error)
      return Response.json({ success: false, error: 'Error in updating prompt' }, { status: 500 })
    }
  }