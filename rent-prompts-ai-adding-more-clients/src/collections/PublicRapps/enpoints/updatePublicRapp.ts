import addData from "@/utilities/addReqData";
import { PayloadHandler } from "payload";
import slugify from "slugify";

export const updatePublicRapp: PayloadHandler = async (req): Promise<Response> => {
  const { payload, routeParams } = req;
  const id = routeParams?.id as string;

  try {
    let formData;
    try {
      formData = await addData(req); // Parse the request body
    } catch (e) {
      console.error("Error parsing form data:", e);
      return Response.json({ success: false, error: "Malformed request body" }, { status: 400 });
    }

    if (!formData) {
      return Response.json({ success: false, error: "Invalid form data" }, { status: 400 });
    }

    // Generate a new slug based on the updated RAPP name
    const updatedSlug = slugify(formData.rappName, { lower: true, strict: true });

    // Update the public RAPP
    const updatedRapp = await payload.update({
      collection: "rapps",
      id: id,
      data: {
        name: formData.rappName,
        description: formData.rappDes,
        modelType: formData.type,
        status: formData.rappStatus,
        price: parseInt(formData.cost, 10),
        model: formData.model,
        images: formData.image, 
      },
    });

    return Response.json(
      {
        success: true,
        message: "Public RAPP updated successfully",
        data: updatedRapp,
        slug: updatedSlug,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating public RAPP:", error);
    return Response.json(
      { success: false, error: "Error updating public RAPP" },
      { status: 500 }
    );
  }
};