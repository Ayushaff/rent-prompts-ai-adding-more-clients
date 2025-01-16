import { admin } from '@/access/admin'
import { anyone } from '@/access/anyone'
import { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    // hidden: ({ user }) => user.role !== 'admin',
    group: 'Admin',
    useAsTitle: 'label',
  },
  access: {
    read: anyone,
    // create: adminsAndUser,
    // update: adminsAndUser,
    delete: admin,
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      label: 'Tag Name',
    },
    {
      name: 'value',
      type: 'text',
      label: 'Tag Value',
      required: true,
    },
  ],
}
