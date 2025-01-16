import { CollectionConfig } from 'payload'

const Purchases: CollectionConfig = {
  slug: 'purchases',
  admin: { useAsTitle: 'type' },
  endpoints: [
    // {
    //   path: '/purchaseProduct',
    //   method: 'post',
    //   handler: purchaseProduct,
    // },
    // {
    //   path: '/purchaseBounty',
    //   method: 'post',
    //   handler: purchaseBounty,
    // },
    // {
    //   path: '/purchasecourse',
    //   method: 'post',
    //   handler: purchaseCourse,
    // },
  ],
  fields: [
    {
      name: 'type',
      label: 'Purchase Type',
      type: 'radio',
      required: true,
      admin: {
        position: 'sidebar',
      },
      options: [
        {
          label: 'Bounty Purchase',
          value: 'bounty',
        },
        {
          label: 'Assets Purchase',
          value: 'assets',
        },
        {
          label: 'Course Purchase',
          value: 'course',
        },
      ],
    },
    {
      name: 'product',
      label: 'Product Purchased',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      defaultValue: [],
    },
    {
      name: 'bounty',
      label: 'Bounty Purchased',
      type: 'relationship',
      relationTo: 'bounties',
      required: true,
      defaultValue: [],
    },
    {
      name: 'course',
      label: 'Course Purchased',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      defaultValue: [],
    },
    {
      name: 'user',
      label: 'UserName',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      required: true,
    },
  ],
}
export default Purchases
