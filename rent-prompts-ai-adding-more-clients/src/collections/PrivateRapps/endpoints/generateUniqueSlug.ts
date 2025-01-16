import { BeforeChangeHook } from "node_modules/payload/dist/collections/config/types";
import slugify from "slugify";

export const generateUniqueSlug: BeforeChangeHook = async ({ data, req, originalDoc }) => {
    if (data.slug) {
      let slug = slugify(data.slug, { lower: true, strict: true });
  
      if (originalDoc && originalDoc.slug === slug) {
        return data;
      }

      const existingDoc = await req.payload.find({
        collection: 'privateRapps',
        where: { slug: { equals: slug } },
      });
  
      if (existingDoc.totalDocs > 0) {
        slug = `${slug}-${Date.now()}`;
      }

      data.slug = slug;
    }
  
    return data;
  };