import { CollectionConfig } from 'payload'

const RappPurchases: CollectionConfig = {
  slug: 'rappsPurchases',
  endpoints: [
    // {
    //   path: '/purchaseRapps',
    //   method: 'post',
    //   handler: purchaseRapps,
    // },
  ],
  fields: [
    // {
    //   name: 'rapps',
    //   label: 'Rapps Purchased',
    //   type: 'relationship',
    //   relationTo: 'rapps',
    //   // required: true,
    //   //   admin: {
    //   //     condition: (data) => data.purchaseType === 'rapps',
    //   //   },
    // },
    {
      name: 'user',
      label: 'UserName',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
  ],
}
export default RappPurchases
