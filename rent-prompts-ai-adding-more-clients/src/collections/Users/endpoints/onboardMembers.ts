import addData from '@/utilities/addReqData'
import generatePassword from '@/utilities/generatePassword'
import { PayloadHandler, PayloadRequest, User } from 'payload'

export const onboardMember: PayloadHandler = async (req): Promise<Response> => {
  const { payload, user } = req

  try {
    const data = await addData(req)
    const { email }: { email: string } = data

    if (!user || user.role !== 'entAdmin') {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: fix this logic, I think we can improve this
    const enterpriseDomain = typeof user?.domain === 'string' ? user.domain.split('.')[0] : ''

    if (!email.includes(enterpriseDomain)) {
      return Response.json(
        { success: false, error: `The email domain must match the enterprise domain` },
        { status: 400 },
      )
    }

    // Check if a user with the provided email already exists
    const { docs: users } = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (users.length !== 0) {
      return Response.json({ success: false, error: 'User already exists' }, { status: 300 })
    }

    const randomPassword = generatePassword(8)

    const nameFromEmail = email.split('@')[0]

    const newUser = await payload.create({
      collection: 'users',
      data: {
        email,
        password: randomPassword,
        role: 'entUser',
        associatedWith: user.id,
        coinBalance: 0,
        domain: enterpriseDomain,
        user_name: nameFromEmail,
        profileImage: "",
        tokens: 0
      },
    })

    // Extract member IDs from user.members (in case they are objects)
    const currentMembers = Array.isArray(user.members)
      ? user.members.map((member) => (typeof member === 'object' && member.id ? member.id : member))
      : []

    // Prevent adding duplicate IDs
    const updatedMembers = currentMembers.includes(newUser.id)
      ? currentMembers
      : [...currentMembers, newUser.id]

    // Update the user with the new list of member IDs
    const updatedUser = await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        members: updatedMembers,
      },
    })

    return Response.json(
      {
        success: true,
        message: 'User onboarded successfully',
        data: {
          message: 'User onboarded successfully',
          password: randomPassword,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error in onboardMember handler', error.message)
    return Response.json({ success: false, error: 'Error onboarding member' }, { status: 400 })
  }
}

export const onboardedMembersLists: PayloadHandler = async (req): Promise<Response> => {
  const { payload, user } = req

  // Check if the user is authenticated
  if (!user) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  if (!user.members) {
    return Response.json({ success: false, error: 'No members found' }, { status: 400 })
  }

  // Check if the user has members and it's an array
  const memberIds =
    user.members.map((user) => {
      if (typeof user === 'object' && user.id) {
        return user.id
      }
      return user
    }) || []

  try {
    // Fetch users by their IDs
    const members = await payload.find({
      collection: 'users',
      where: {
        id: {
          in: memberIds, // Use the 'in' operator to match multiple IDs
        },
      },
    })

    const privateRapps = await payload.find({
      collection: 'privateRapps',
      where: {
        creator: {
          in: memberIds, // Match creators in the list of member IDs
        },
      },
    });

    const createdAppCounts = privateRapps.docs.reduce((acc, app) => {
      const creatorId = typeof app.creator === 'object' ? app.creator?.id : app.creator;   
      if (creatorId) {
        acc[creatorId] = (acc[creatorId] || 0) + 1;
      } else {
        console.warn("Missing creator in app:", app);
      }
      return acc;
    }, {});

    const memberDetails = members.docs.map((member) => ({
      id: member.id,
      email: member.email,
      userName: member.user_name,
    }))

    return Response.json(
      { success: true, message: 'Members fetched successfully', data: memberDetails },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error in onboardedMembersLists handler:', error.message)
    return Response.json({ success: false, error: 'Error fetching members' }, { status: 400 })
  }
}

export const removeMember: PayloadHandler = async (req): Promise<Response> => {
  try {
    const { payload, user } = req
    const data = await addData(req)
    const { memberId } = data

    if (!user || user.role !== 'entAdmin') {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const memberDetails = await payload.findByID({ collection: 'users', id: memberId })

    if (memberDetails.rappAccess && memberDetails.rappAccess.length > 0) {
      return Response.json(
        { success: false, error: 'Member cannot be removed as they own associated rapps' },
        { status: 400 },
      )
    }

    const currentMembers = Array.isArray(user.members)
      ? user.members.map((member) => (typeof member === 'object' && member.id ? member.id : member))
      : []

    const updatedMembers = currentMembers.filter((id) => id !== memberId)

    const updatedUser = await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        members: updatedMembers,
      },
    })

    await payload.delete({
      collection: 'users',
      id: memberId,
    })

    return Response.json({ success: true, message: 'Member removed successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error in removeMember handler', error.message)
    return Response.json({ success: false, error: 'Error removing member' }, { status: 400 })
  }
}
