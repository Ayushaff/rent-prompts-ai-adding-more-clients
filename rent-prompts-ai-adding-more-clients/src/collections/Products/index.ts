import { admin } from '@/access/admin'
import { CollectionConfig } from 'payload'

const Products: CollectionConfig = {
  slug: 'products',
  admin: { useAsTitle: 'name' },
  access: {},
  endpoints: [
    // {
    //   // http://localhost:3000/api/products/likes
    //   path: '/likes/:productId',
    //   method: 'get',
    //   handler: likes,
    // },
    // {
    //   // http://localhost:3000/api/products/secure-data
    //   path: '/:productID/secure-data',
    //   method: 'get',
    //   handler: secureProductData,
    // },
  ],
  fields: [
    {
      name: 'name',
      label: 'Product Name',
      type: 'text',
      required: true,
      admin: {
        description: 'This will be the title of the product.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Product Description',
      admin: {
        description:
          'Highlight what makes your product unique and valuable to potential buyers. A thorough and engaging description can help boost your sales, also can use markup for increase readability.',
      },
    },
    {
      name: 'price',
      label: 'Product Price',
      min: 0,
      type: 'number',
      required: true,
      admin: {
        description: 'Price in credit (1 rupee = 1 credit)',
      },
    },
    {
      name: 'type',
      label: 'Product Type',
      type: 'select',
      options: [
        {
          label: 'Text',
          value: 'text',
        },
        {
          label: 'Image',
          value: 'image',
        },
        {
          label: 'Video',
          value: 'video',
        },
        {
          label: 'Music',
          value: 'music',
        },
        {
          label: '3D',
          value: 'threed',
        },
      ],
      required: true,
      admin: {
        description: 'Select the type for the product.',
      },
    },
    {
      name: 'category',
      label: 'Model Category',
      type: 'select',
      options: [
        {
          label: 'All',
          value: 'all',
        },
        {
          label: 'Image',
          value: 'image',
        },
        {
          label: 'Text',
          value: 'text',
        },
      ],
      required: true,
      admin: {
        description: 'Choose the model category that best fits for the application.',
      },
    },
    {
      name: 'productFiles',
      label: 'Product File(s)',
      type: 'relationship',
      required: true,
      relationTo: 'product_files',
      hasMany: false,
    },
    {
      name: 'status',
      label: 'Product Status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      access: {
        update: admin,
      },
      admin: {
        description: 'Product status will be approved by admin only.',
      },
      options: [
        {
          label: 'Pending verification',
          value: 'pending',
        },
        {
          label: 'Approved',
          value: 'approved',
        },
        {
          label: 'Denied',
          value: 'denied',
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Is Featured',
      defaultValue: false,
      required: true,
      admin: {
        description: 'Highlight the product in the list by marking it as featured.',
      },
    },
    {
      name: 'images',
      type: 'array',
      label: 'Product images',
      minRows: 1,
      maxRows: 4,
      required: true,
      labels: {
        singular: 'Image',
        plural: 'Images',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
      admin: {
        description: 'Atleast one image is required.',
      },
    },
    {
      type: 'checkbox',
      name: 'needsApproval',
      label: 'Send for Approval',
      admin: {
        description: 'Mark this item as needing approval.',
        position: 'sidebar',
      },
      required: true,
      defaultValue: false,
    },
    {
      name: 'affiliated',
      label: 'Affiliated With',
      type: 'array',
      required: true,
      defaultValue: [],
      fields: [
        {
          type: 'text',
          name: 'link',
          required: true,
        },
      ],
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      // defaultValue: ({ user }) => user.id,
      hasMany: false,
      admin: {
        allowCreate: false,
        readOnly: true,
      },
    },
    {
      name: 'likes',
      type: 'array',
      required: true,
      defaultValue: [],
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
      ],
    },
  ],
  timestamps: true,
}
export default Products
