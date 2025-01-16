import { PayloadHandler, PayloadRequest } from "payload";
import addData from "@/utilities/addReqData"; // Adjust the import path

export const updateCreatePermission: PayloadHandler = async (req: PayloadRequest): Promise<Response> => {
  const { payload } = req;

  const { memberId, createRappPermission } = await addData(req);

  if (!memberId || typeof createRappPermission !== "boolean") {
    return Response.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }

  try {
    const updatedUser = await payload.update({
      collection: "users",
      id: memberId,
      data: {
        createRappPermission,
      },
    });

    return Response.json(
      {
        success: true,
        message: "Permission updated successfully",
        data: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating permission:", error);
    return Response.json(
      { success: false, error: "Error updating permission" },
      { status: 400 }
    );
  }
};