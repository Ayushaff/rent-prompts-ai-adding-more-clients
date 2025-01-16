import { User } from '@/payload-types'
import addData from '@/utilities/addReqData'
import { PayloadHandler } from 'payload'

export const purchaseRapps: PayloadHandler = async (req) => {
  const { user, payload, query } = req

  const data = await addData(req)
  const { modelId, rappId, type } = data;

  if (!user) {
    return Response.json({ success: false, error: 'User not found' }, { status: 404 })
  }

  if (!modelId) {
    return Response.json({ success: false, error: 'Model not found' }, { status: 404 })
  }

  let rapp;


  try {
    const model = await payload.findByID({
      collection: 'models',
      id: modelId,
    })
    
    
    const totalPrice = model.cost + (model.commision ?? 0);

    await payload.update({
      collection: 'models',
      id: modelId,
      data: {
        tokens: model.tokens + model.cost,
      }
    })

    if(rappId){
      if(type === 'private'){
        rapp = await payload.findByID({
          collection: 'privateRapps',
          id: rappId,
        })
      }else{
        rapp = await payload.findByID({
          collection: 'rapps',
          id: rappId,
        })
      }
      
      try{
        if(type === 'private'){
          await payload.update({
            collection: 'privateRapps',
            id: rappId,
            data: {
              tokens: rapp.tokens + totalPrice,
            }
          })
        }else{
          await payload.update({
            collection: 'rapps',
            id: rappId,
            data: {
              tokens: rapp.tokens + totalPrice,
            }
          })
        }
      }catch(e){
        console.error('Error in updating app tokens', e.message)
        return Response.json(
          { success: false, error: 'Error in updating app tokens' },
          { status: 400 }
        )
      }
    }

    if (user.role === 'entAdmin' || user.role === 'user') {

      if (user.coinBalance < totalPrice) {
        return Response.json(
          { success: false, error: 'Insufficient balance, Please recharge' },
          { status: 401 }
        )
      }

      try {
        const newBalance = user.coinBalance - totalPrice
        await payload.update({
          collection: 'users',
          id: user.id,
          data: {
            coinBalance: newBalance,
          },
        })
        return Response.json({ success: true, message: 'rapp run successful' }, { status: 200 })
      } catch (e) {
        console.error('Error in purchaseRapp while updating enterprise', e.message)
        return Response.json(
          { success: false, error: 'Error while deducting cost' },
          { status: 400 }
        )
      }
    } else {
      // Handle member role
      const enterprise = user.associatedWith as User
      // const rappOwner: any = await payload.findByID({
      //   collection: 'users',
      //   id: user?.associatedWith as string,
      // })

      if (enterprise.coinBalance < totalPrice) {
        return Response.json(
          { success: false, error: 'Insufficient balance, Please recharge' },
          { status: 401 }
        )
      }

      try {
        const newBalance = enterprise.coinBalance - totalPrice
        await payload.update({
          collection: 'users',
          id: enterprise.id,
          data: {
            coinBalance: newBalance,
          },
        })

        await payload.update({
          collection: 'users',
          id: user.id,
          data: {
            tokens: user.tokens + totalPrice,
          }
        })

        if (rappId) {
          const getRappAccessEntry = user.rappAccess?.find((entry) =>
            typeof entry.rappId === 'object' ? entry.rappId.id === rappId : entry.rappId === rappId
          )

          const totalTokens = (getRappAccessEntry?.tokens ?? 0) + totalPrice;
          const updatedRappAccess = user.rappAccess?.map((entry) => {
            const currentRappId =
              typeof entry.rappId === 'object' ? entry.rappId.id : entry.rappId

            if (currentRappId === rappId) {
              return { ...entry, rappId: String(rappId), tokens: totalTokens } // Ensure rappId is a string
            }

            return { ...entry, rappId: String(currentRappId) };
          })

          await payload.update({
            collection: 'users',
            id: user.id,
            data: { rappAccess: updatedRappAccess },
          })
        }

        return Response.json(
          { success: true, message: 'Cost deduction successful' },
          { status: 200 }
        )
      } catch (e) {
        console.error('Error in purchaseRapp while updating enterprise user:', e.message)
        return Response.json(
          { success: false, error: 'Error while deducting cost' },
          { status: 400 }
        )
      }
    }
  } catch (e) {
    console.error('Error in purchaseRapp:', e.message)
    return Response.json(
      { success: false, error: 'Error while processing the request' },
      { status: 400 }
    )
  }
}
