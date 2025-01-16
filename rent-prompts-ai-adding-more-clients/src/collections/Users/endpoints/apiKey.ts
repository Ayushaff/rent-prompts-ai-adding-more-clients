import { PayloadHandler } from 'payload'
import { v4 as uuidv4 } from 'uuid'

export const enableApikey: PayloadHandler = async (req): Promise<Response> => {
  const { payload, user } = req

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (user.enableAPIKey && user.apiKey) {
    return Response.json({ message: 'API key is already enabled' }, { status: 200 })
  }
  try {
    const key = uuidv4()

    const result = await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        enableAPIKey: true,
        apiKey: key,
      },
    })

    return Response.json(result.apiKey, { status: 200 })
  } catch (e) {
    console.log(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export const getApiKey: PayloadHandler = async (req): Promise<Response> => {
  const { user } = req

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (user.enableAPIKey && user.apiKey) {
    return Response.json(user.apiKey, { status: 200 })
  }

  return Response.json({ message: 'API key is not enabled' }, { status: 200 })
}

export const generateNewApiKey: PayloadHandler = async (req): Promise<Response> => {
  const { payload, user } = req
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!user.enableAPIKey) {
    return Response.json({ message: 'API key is not enabled' }, { status: 200 })
  }

  try {
    const key = uuidv4()

    const result = await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        enableAPIKey: true,
        apiKey: key,
      },
    })

    return Response.json(result.apiKey, { status: 200 })
  } catch (e) {
    console.log(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export const disableApiKey: PayloadHandler = async (req): Promise<Response> => {
  const { payload, user } = req

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!user.enableAPIKey) {
    return Response.json({ message: 'API key is not enabled' }, { status: 200 })
  }
  try {
    const result = await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        enableAPIKey: false,
      },
    })

    return Response.json({ message: 'API key is disabled' }, {})
  } catch (e) {
    console.log(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
