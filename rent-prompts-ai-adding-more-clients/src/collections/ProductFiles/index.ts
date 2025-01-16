import { CollectionConfig } from 'payload'
import addUser from './hooks/addUser'

const ProductFiles: CollectionConfig = {
  slug: 'product_files',
  hooks: {
    beforeChange: [addUser],
  },
  upload: {
    disableLocalStorage: true,
    staticDir: 'product_files',
    // staticURL: "/product_files",
    mimeTypes: [
      'image/*',
      'font/*',
      'application/postscript',
      'text/*',
      'audio/*',
      'video/*',
      'application/*',
    ],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      // defaultValue: ({ user }) => user.id,
      hasMany: false,
      required: true,
    },
  ],
}
export default ProductFiles
