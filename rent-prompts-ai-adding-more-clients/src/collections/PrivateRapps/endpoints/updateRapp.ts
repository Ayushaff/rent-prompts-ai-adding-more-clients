
import addData from '@/utilities/addReqData';
import { PayloadHandler } from 'payload'
import slugify from 'slugify'

export const updateAccessList: PayloadHandler = async (req): Promise<Response> => {
  try {
    const { payload, routeParams } = req;

    const rappId = routeParams?.id as string;

    if (!rappId) {
      return Response.json({ success: false, error: 'id parameter is missing.' }, { status: 400 });
    }

    const reqData = await addData(req);

    // Fetch the existing Rapp details
    const rappDetails = await payload.findByID({
      collection: 'privateRapps',
      id: rappId,
    });

    const existingAccess = (rappDetails.access || [])
      .map((entry) => ({
        userId: typeof entry.userId === 'object' ? entry.userId.id : entry.userId,
        getAccess: entry.getAccess,
      }))
      .filter((entry) => entry.getAccess?.includes('read'));

    const newAccess = reqData
      .map((entry) => ({
        userId: typeof entry.userId === 'object' ? entry.userId.id : entry.userId,
        getAccess: entry.getAccess,
      }))
      .filter((entry) => entry.getAccess?.includes('read'));

    // Merge existing and new access
    const updatedAccess = [
      ...existingAccess.filter(
        (existing) =>
          !newAccess.some((newEntry) => newEntry.userId === existing.userId)
      ),
      ...newAccess,
    ];

    const updatedSlug = `${slugify(rappDetails.name).toLowerCase()}-${Date.now()}`;

    // Update the Rapp with the merged access list
    const updatedRapp = await payload.update({
      collection: 'privateRapps',
      id: rappId,
      data: { access: updatedAccess, slug: updatedSlug },
    });

    for( const data of reqData) {
      const { userId, getAccess } = data;

      let user;
      try {
        user = await payload.findByID({
          collection: 'users',
          id: userId,
        });
      } catch (error) {
        return Response.json({ success: false, error: "Failed to found users" }, { status: 500 });
      }

      const updatedRappAccess = [
        ...(user.rappAccess || []),
        {
          rappId,      
          getAccess: getAccess, 
        },
      ];
      
      const ids = updatedRappAccess.map((access) => {
        return {
          rappId: typeof access.rappId === 'object' ? access.rappId.id : access.rappId, 
          getAccess: access.getAccess
        };
      });

      await payload.update({
        collection: 'users',
        id: userId,
        data: { rappAccess: ids },
      });
    }

    return Response.json({ success: true, message: 'Access list updated successfully', slug: updatedSlug }, { status: 200 });
  } catch (error) {
    console.error("Error updating access list:", error);
    return Response.json({ success: false, error: "Failed to update access list" }, { status: 500 });
  }
};


export const updateAccessUsers: PayloadHandler = async (req): Promise<Response> => {
  const { payload } = req;

  try {
    const reqData = await addData(req);
    const data = reqData.usersAccessData;
    const rappId = reqData.rappId;
    
    for (const userAccess of data) {
      const { userId, getAccess } = userAccess;
      
      if (!userId || !getAccess) {
        return Response.json({ success: false, error: "UserId and Access not found" }, { status: 500 });
      }
      
      const user = await payload.findByID({
        collection: "users", 
        id: userId,
      });
      
      if (!user) {
        return Response.json({ success: false, error: "Users not found" }, { status: 500 });
      }
      
      const updatedRappAccess = [
        ...(user.rappAccess || []),
        {
          rappId,      
          getAccess: getAccess, 
        },
      ];

      const ids = updatedRappAccess.map((access) => {
        return {
          rappId: typeof access.rappId === 'object' ? access.rappId.id : access.rappId, 
          getAccess: access.getAccess
        };
      });
      
      await payload.update({
        collection: "users", 
        id: userId,
        data: {
          rappAccess: ids,
        },
      });

    }

    return Response.json({ success: true, message: "Access updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating access for users:", error);
    return Response.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
};

