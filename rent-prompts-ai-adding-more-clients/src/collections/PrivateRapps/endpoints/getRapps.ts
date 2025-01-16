import { Model, User } from '../../../payload-types'
import addData from '@/utilities/addReqData'
import { PayloadHandler } from 'payload'
import slugify from 'slugify'
import { toast } from 'sonner'
import axios from 'axios'

interface PrivateRapp {
  prompt: string
  systemprompt: string
  id: string
  slug: string
  modelType: string
  model?: Model
  name: string
  description: string
  computation?: string
  price: number
  images: [{ image: {filename:string} }]
  access: {
    userId: {
      id: string
      email: string
    }
    getAccess: string[]
  }[]
 tokens: number;
  status: string
  commission?: number
  createdAt: string
  updatedAt: string
  creator: {
    profileImage:{filename:string},id: string, user_name:string 
}
  rappAccess?: { rappId: { id: string } }[]
  negativeVariables: []
  systemVariables: []
  promptVariables: []
  negativeprompt: string
  imageinput: Boolean;
  needsApproval:Boolean;
  settings: [];
}

interface Access {
  userId: string
  read: string
  update: string
}

export const getRapps = async (req) => {
  const { payload, user } = req;

  if (!user) {
    return Response.json({ success: false, error: 'Unauthorized User' }, { status: 401 });
  }

  try {
    const data = await req.json().catch(() => null); // Safely handle body parsing
    const targetId = user.id; 

    const { docs: rapps } = await payload.find({
      collection: 'privateRapps',
      where: {
        creator: {
          equals: targetId,
        },
      },
    });

    const { docs: publicRapps } = await payload.find({
      collection: 'rapps',
      where: {
        creator: {
          equals: targetId,
        },
      },
    });
    
    // Fetch user data for rappAccess
    const userToFetch = data?.id
      ? await payload.find({
          collection: 'users',
          where: { id: { equals: targetId } },
        }).then((res) => res.docs[0])
      : user;

    let totalTokens = 0;
    const rappAccessIds = userToFetch.rappAccess.map((accessObj) => {
      totalTokens += accessObj.tokens || 0; 
    
      return typeof accessObj.rappId === 'object' && accessObj.rappId !== null
        ? accessObj.rappId.id
        : accessObj.rappId;
    });

    const { docs: accessRapps } = await payload.find({
      collection: 'privateRapps',
      where: {
        id: {
          in: rappAccessIds,
        },
      },
    });

    //  
    // let rappimage=rapps?.image?.filename

    // rappimage=`https://pub-9991e1a416ba46d0a4bef06e046435a1.r2.dev/${rappimage}`

    // Map data to desired format
    const formatRappData = (doc, totalCost, images) => ({
      id: doc.id,
      slug: doc.slug,
      type: doc.modelType,
      model: doc.model?.name,
      rappName: doc.name,
      rappDes: doc.description,
      cost: totalCost,
      commission: doc.commission,
      rappStatus: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      images: images,
    });
    
    const costField = 'totalCost';
    
    const myRappsData = rapps.map((doc) => {
      // const rappimage = doc?.images?.filename
      //   ? `${process.env.PAYLOAD_PUBLIC_CLOUDFLARE_PUBLIC_R2}/${doc.image.filename}`
      //   : '';

        const images = doc?.images?.map((image) => {
          const filename = image?.image?.filename || '';
          return filename
            ? `${process.env.PAYLOAD_PUBLIC_CLOUDFLARE_PUBLIC_R2}/${filename}`
            : '';
        }) || [];
      const totalCost =
        (doc.model?.cost || 0) + (doc.model?.commission || 0) + (doc.price || 0);
      return formatRappData(doc, totalCost, images); // Ensure the formatted data is returned
    });

    const publicRappsData = publicRapps.map((doc) => {
      
      // const rappimage = doc?.images?.filename
      //   ? `${process.env.PAYLOAD_PUBLIC_CLOUDFLARE_PUBLIC_R2}/${doc.image.filename}`
      //   : '';

        const images = doc?.images?.map((image) => {
          const filename = image?.image?.filename || '';
          return filename
            ? `${process.env.PAYLOAD_PUBLIC_CLOUDFLARE_PUBLIC_R2}/${filename}`
            : '';
        }) || [];
      const totalCost =
        (doc.model?.cost || 0) + (doc.model?.commision || 0) + (doc.price || 0) ;
      return formatRappData(doc, totalCost, images); 
    });
    
    const accessRappsData = accessRapps.map((doc) => {
      // const rappimage = doc?.image?.filename
      //   ? `${process.env.PAYLOAD_PUBLIC_CLOUDFLARE_PUBLIC_R2}/${doc.image.filename}`
      //   : '';

        const images = doc?.images?.map((image) => {
          const filename = image?.image?.filename || '';
          return filename
            ? `${process.env.PAYLOAD_PUBLIC_CLOUDFLARE_PUBLIC_R2}/${filename}`
            : '';
        }) || [];
      const totalCost =
        (doc.model?.cost || 0) + (doc.model?.commission || 0);
      return formatRappData(doc, totalCost, images); // Ensure the formatted data is returned
    });
    
    // Now myRappsData and accessRappsData include the formatted data with images
    
    const response = {
      myRapps: myRappsData,
      publicRapps: publicRappsData,
      accessRapps: accessRappsData,
      totalTokenConsumed : totalTokens,
    };

    return Response.json(
      { success: true, message: 'Rapps data fetched successfully', data: response },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error getting rapps:', error);
    return Response.json({ success: false, error: 'Error getting rapps' }, { status: 500 });
  }
};


//get rapps by id
export const getRappById: PayloadHandler = async (req): Promise<Response> => {
  const { payload, user, routeParams } = req
  const id = routeParams?.id as string

  if (!id) {
    return Response.json({ success: false, error: 'ID parameter is missing.' }, { status: 400 })
  }

  if (!user) {
    return Response.json({ success: false, error: 'Unauthorized User' }, { status: 401 })
  }

  try {
    const rapp = await payload.findByID({
      collection: 'privateRapps',
      id: id,
    })

    if (!rapp) {
      return Response.json(
        { success: false, error: 'Rapp not found or access denied' },
        { status: 404 },
      )
    }

    const doc = rapp as unknown as PrivateRapp

    // // let filename = doc?.images?.filename || ''
    // filename = filename 
    // ? `${process.env.PAYLOAD_PUBLIC_CLOUDFLARE_PUBLIC_R2}/${filename}` 
    // : "";

    const images = doc?.images?.map((image) => {
      const filename = image?.image?.filename || '';
      return filename
        ? `${process.env.PAYLOAD_PUBLIC_CLOUDFLARE_PUBLIC_R2}/${filename}`
        : '';
    }) || [];
  

    const model = doc.model as Model
    const rappData = {
      id: doc.id,
      type: doc.modelType,
      model: model,
      rappName: doc.name,
      rappDes: doc.description,
      cost: doc.price,
      commission: doc.commission,
      rappStatus: doc.status,
      image: images,
      // creatorName: doc.creator.name ,
      // creatorRole: doc.creator.role,
      access: doc.access,
    }

    return Response.json(
      { success: true, message: 'Rapp data fetched successfully', rappData },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error getting rapp by ID:', error)
    return Response.json({ success: false, error: 'Error in getting rapp' }, { status: 500 })
  }
}

//get rapps by id
export const getRappBySlug: PayloadHandler = async (req): Promise<Response> => {
  const { payload, user, routeParams, query } = req;

  const {  type: rapptype } = query;
  const id=routeParams?.id as string
  if (!id) {
    return Response.json({ success: false, error: 'Slug parameter is missing.' }, { status: 400 });
  }

  if (!user) {
    return Response.json({ success: false, error: 'Unauthorized User' }, { status: 401 });
  }

  if (!rapptype) {
    return Response.json({ success: false, error: 'rapptype parameter is missing.' }, { status: 400 });
  }

  try {
    // Determine which collection to query based on rapptype
    let rapp;
    if (rapptype === 'public') {
      rapp = await payload.findByID({
        collection: 'rapps',
        id: id,
      });
    } else if (rapptype === 'private') {
      rapp = await payload.findByID({
        collection: 'privateRapps',
        id: id,
      });
    } else {
      return Response.json({ success: false, error: 'Invalid rapptype provided.' }, { status: 400 });
    }    if (!rapp) {
      return Response.json(
        { success: false, error: 'Rapp not found or access denied' },
        { status: 404 },
      )
    }

    const doc = rapp as unknown as PrivateRapp
    const model = doc?.model as Model
    const access = doc?.access?.map((access) => ({
      userId: {
        id: access?.userId?.id,
        email: access?.userId?.email,
      },
      getAccess: access.getAccess,
    }))

       const images = doc?.images?.map((image) => {
        const filename = image?.image?.filename || '';
        return filename
          ? `${process.env.PAYLOAD_PUBLIC_CLOUDFLARE_PUBLIC_R2}/${filename}`
          : '';
      }) || [];
    
    let creatorImage = doc?.creator?.profileImage?.filename || ''
    creatorImage = creatorImage 
    ? `${process.env.PAYLOAD_PUBLIC_CLOUDFLARE_PUBLIC_R2}/${creatorImage}` 
    : "";
    
    const rappData = {
      id: doc.id,
      type: model.type,
      modelId: model.id,
      modelName: model.name,
      modelType: model.type,
      rappName: doc.name,
      rappDes: doc.description,
      cost: model.cost + (model.commision ?? 0),
      price: doc.price,
      commission: doc.commission,
      rappStatus: doc.status,
      needsApproval: doc.needsApproval,
      prompt: doc.prompt,
      images: images,
      systemVariables: doc.systemVariables,
      promptVariables: doc.promptVariables,
      negativeVariables: doc.negativeVariables,
      access: access,
      tokens: doc.tokens,
      creatorId: doc.creator.id,
      creatorName: doc.creator.user_name,
      creatorImage: creatorImage
    }

    return Response.json(
      { success: true, message: 'Rapp data fetched successfully', rappData },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error getting rapp by ID:', error)
    return Response.json({ success: false, error: 'Error in getting rapp' }, { status: 500 })
  }
}

export const getPromptBySlug: PayloadHandler = async (req): Promise<Response> => {
  const { payload, user, routeParams } = req
  const id = routeParams?.id as string
  const {type:type} = req.query

  if (!id) {
    return Response.json({ success: false, error: 'Slug parameter is missing.' }, { status: 400 })
  }

  if (!user) {
    return Response.json({ success: false, error: 'Unauthorized User' }, { status: 401 })
  }

  try {
    // Determine which collection to query based on type
    let rapp;
    if (type === 'public') {
      rapp = await payload.findByID({
        collection: 'rapps',
        id: id,
      })
    } else if (type === 'private') {
      rapp = await payload.findByID({
        collection: 'privateRapps',
        id: id,
      })
    } else {
      return Response.json({ success: false, error: 'Invalid type provided.' }, { status: 400 })
    }
    if (!rapp) {
      return Response.json(
        { success: false, error: 'Rapp not found or access denied' },
        { status: 404 },
      )
    }

    const doc: any = rapp
    const model = doc?.model as Model;
    const rappData = {
      id: doc.id,
      modelType: doc.model.type,
      modelId: model.id,
      // rappName: doc.name,
      // rappDes: doc.description,
      // cost: doc.price,
      // commission: doc.commission,
      // rappStatus: doc.status,
      images: doc.images,
      imageinput: doc.imageinput,

      promptVariables: doc.promptVariables,
      systemVariables: doc.systemVariables,
      negativeVariables: doc.negativeVariables,

      negativeprompt: doc.negativeprompt,
      systemprompt: doc.systemprompt,
      userprompt: doc.prompt,

      access: doc.access,
      settings: doc.model?.settings,
    }

    return Response.json(
      { success: true, message: 'Rapp prompts fetched successfully', rappData },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error getting rapp by ID:', error)
    return Response.json({ success: false, error: 'Error in getting prompts' }, { status: 500 })
  }
}




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
      collection: 'privateRapps',
      id: id,
    })

    const updatedDoc = await payload.update({
      collection: 'privateRapps',
      id,
      data: {
        systemprompt: promptData.systemprompt,
        prompt: promptData.userprompt,
        negativeprompt: promptData.negativeprompt,

        imageinput: promptData?.imageinput,

        systemVariables: promptData?.systemVariables,
        promptVariables: promptData?.promptVariables,
        negativeVariables: promptData?.negativeVariables,
        slug: rapp?.slug,
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
export const updateAccess: PayloadHandler = async (req): Promise<Response> => {
  const { payload, routeParams, user } = req;
  const id = routeParams?.id as string;
  const type = routeParams?.type as string;

  let formData;

  try {
    formData = await addData(req);
  } catch (e) {
    console.error('Error parsing form data:', e);
    return Response.json({ success: false, error: 'Malformed request body' }, { status: 400 });
  }

  if (!formData) {
    return Response.json({ success: false, error: 'Invalid form data' }, { status: 400 });
  }

  const rapp = await payload.findByID({
    collection: type === 'public'? 'rapps' : 'privateRapps',
    id: id,
  });

  let uploadedImageIds

  if(formData.images &&formData.images.length > 0) {
    uploadedImageIds = formData.images;
  }else{
    const uploadedImageIds = rapp?.images?.map(image => ({
      image: typeof image.image === 'object' ? image?.image?.id : image.image,
    }));
  }

  const users: Access[] = Array.isArray(formData.users) ? formData.users : [];
  const accessArray: any[] = [];
  const usersToUpdate: string[] = [];

  if (type === 'private' && user?.role === 'entAdmin') {
    if (Array.isArray(users)) {
      users.forEach((user) => {
        if (user.read === 'true') {
          const access: ('read' | 'delete' | 'update' | 'create')[] = [];
          if (user.read === 'true') access.push('read');
          if (user.update === 'true') access.push('update');
          accessArray.push({ userId: user.userId, getAccess: access });
        } else if (user.read === 'false') {
          usersToUpdate.push(user.userId);
        }
      });
    }

    const updatedSlug = slugify(formData.rappName, { lower: true, strict: true });

    
    const updatedRapp = await payload.update({
      collection: 'privateRapps',
      id: id,
      data: {
        name: formData.rappName,
        description: formData.rappDes,
        modelType: formData.type,
        status: formData.rappStatus,
        price: parseInt(formData.cost, 10),
        access: accessArray,
        model: formData.model,
        slug: updatedSlug,
        images: uploadedImageIds,
      },
    });

    for (const userId of usersToUpdate) {
      const userRecord = await payload.findByID({
        collection: 'users',
        id: userId,
      });

      const updatedRappAccess = (userRecord.rappAccess || []).filter((rappAccess) => {
        const currentRappId =
          typeof rappAccess.rappId === 'object' ? rappAccess.rappId.id : rappAccess.rappId;
        return currentRappId !== id;
      });

      const ids = updatedRappAccess.map((access) => ({
        rappId: typeof access.rappId === 'object' ? access.rappId.id : access.rappId,
        getAccess: access.getAccess,
      }));

      await payload.update({
        collection: 'users',
        id: userId,
        data: {
          rappAccess: ids,
        },
      });
    }

    for (const user of users) {
      if (user.read === 'true') {
        const access: ('read' | 'delete' | 'update' | 'create')[] = [];
        if (user.read === 'true') access.push('read');
        if (user.update === 'true') access.push('update');

        const userRecord = await payload.findByID({
          collection: 'users',
          id: user.userId,
        });

        const updatedRappAccess = (userRecord.rappAccess || []).map((rapp) => {
          if (
            (typeof rapp.rappId === 'object' && rapp.rappId.id === id) ||
            (typeof rapp.rappId === 'string' && rapp.rappId === id)
          ) {
            return {
              ...rapp,
              getAccess: access,
            };
          }
          return rapp;
        });

        const ids = updatedRappAccess.map((access) => ({
          rappId: typeof access.rappId === 'object' ? access.rappId.id : access.rappId,
          getAccess: access.getAccess,
        }));

        await payload.update({
          collection: 'users',
          id: user.userId,
          data: {
            rappAccess: ids,
          },
        });
      }
    }

    return Response.json(
      { success: true, message: 'Rapp updated successfully' },
      { status: 200 },
    );
  } else {
    const updatedRapp = await payload.update({
      collection: 'rapps',
      id: id,
      data: {
        name: formData.rappName,
        description: formData.rappDes,
        price: parseInt(formData.cost, 10),
        model: formData.model,
        needsApproval: formData.needsApproval,
        images: uploadedImageIds,
      },
    });

    return Response.json(
      { success: true, message: 'Rapp updated successfully' },
      { status: 200 },
    );
  }
};




export const updatePermissions: PayloadHandler = async (req): Promise<Response> => {
  try {
    const { payload, routeParams } = req
    const id = routeParams?.id as string
    let formData
    try {
      formData = await addData(req)
    } catch (e) {
      console.error('Error parsing form data:', e)
      return Response.json({ success: false, error: 'Malformed request body' }, { status: 400 })
    }

    if (!formData && !formData.users) {
      return Response.json({ success: false, error: 'Invalid form data' }, { status: 400 })
    }
    // Parse `users` field if it exists
    let users
    try {
      users = JSON.parse(formData?.users) // Parse stringified `users` into an array
    } catch (e) {
      console.error('Error parsing users:', e)
      return Response.json({ success: false, error: 'Invalid users data' }, { status: 400 })
    }
    // Create access array based on users in formData
    const accessArray = users?.map((user) => ({
      userId: user?.userId,
      getAccess: user?.getAccess || [],
    }))

    const updatedRapp = await payload.update({
      collection: 'privateRapps',
      where: { id: { equals: id } },
      data: {
        access: accessArray,
        model: formData.modelId,
        // slug: updatedSlug,
      },
    })

    return Response.json(
      { success: true, message: 'Rapp updated successfully', updatedRapp },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error updating access:', error)
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
