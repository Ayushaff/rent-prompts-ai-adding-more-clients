

export const getPublicData = async (req) => {
  const { payload, user } = req;

  const data = await req.json();
  const { slug } = data;


  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

 try{

    const users = await payload.find({
      collection: 'users',
      where: {
        user_name: {
          equals: slug,
        },
      },
    })

  const userData = users.docs[0];

    let filename=userData?.profileImage?.filename;
    
    filename = filename 
    ? `${process.env.PAYLOAD_PUBLIC_CLOUDFLARE_PUBLIC_R2}/${filename}` 
    : "";
    console.log("userData:", userData)
  
    const data = {
      id: userData?.id,
      name: userData.user_name,
      email: userData.email,
      role: userData.role,
      domain: userData?.domain,
      members: userData.members.length,
      balance: userData.balance,
      associateWith:userData.associatedWith.domain,
      profileImage: filename,
    }
    return Response.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}


export const updateProfile = async (req) => {
  const { payload, user } = req;

  // console.log("yaha aaya?")

  const data = await req.json();
  // console.log("data:", data)

  const {id} = data;


  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

 try{

    const users = await payload.find({
      collection: 'users',
      where: {
        id: {
          equals: id,
        },
      },
    })

  const user = users.docs[0];

    const updatedUser = await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        name: data.name,
        email: data.email,
        profileImage: data.profileImage,
      },
    })
    let filename=updatedUser?.profileImage?.filename;
    
    filename = filename 
    ? `${process.env.PAYLOAD_PUBLIC_CLOUDFLARE_PUBLIC_R2}/${filename}` 
    : ""; 

    const updatedData = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      domain: updatedUser.domain,
      members: updatedUser.members.length,
      associateWith: updatedUser.associateWith,
      profileImage: filename,
    }
    return Response.json({ data:updatedData }, { status: 200 })
  } catch (error) {
    console.error('Error fetching data:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
