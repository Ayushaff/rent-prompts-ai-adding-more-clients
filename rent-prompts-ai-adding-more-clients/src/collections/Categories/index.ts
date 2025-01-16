import { admin } from '@/access/admin'
import { anyone } from '@/access/anyone'
import { CollectionConfig } from 'payload'

export const Category: CollectionConfig = {
  slug: 'category',
  admin: {
    // hidden: ({ user }) => user.role !== 'admin',
    group: 'Admin',
    useAsTitle: 'label',
  },
  access: {
    read: anyone,
    create: admin,
    update: admin,
    delete: admin,
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      label: 'Category Name',
    },
    {
      name: 'value',
      type: 'text',
      label: 'Category Value',
      required: true,
    },
  ],
}
