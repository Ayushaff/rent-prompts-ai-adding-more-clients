import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { admin } from '@/access/admin'
import endpoints from './endpoints'

export const User_Interests = [
  {
    label: "Prompt Engineering",
    value: "prompt engineering" as const,
  },
  {
    label: "Content Creation",
    value: "content creation" as const,
  },
  {
    label: "Assets",
    value: "assets" as const,
  },
  {
    label: "AI Applications",
    value: "ai applications" as const,
  },
  {
    label: "Learning and Courses",
    value: "learning and courses" as const,
  },
  {
    label: "Blogs",
    value: "blogs" as const,
  },
  {
    label: "Bounties",
    value: "bounties" as const,
  },
  {
    label: "Community Collaboration",
    value: "community collaboration" as const,
  },
];

const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: () => true,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['user_name', 'email', 'coinBalance'],
    useAsTitle: 'user_name',
  },
  auth: { useAPIKey: true },
  endpoints: endpoints,
  fields: [
    {
      name: 'user_name',
      type: 'text',
      label: 'User Name',
      required: true,
    },
    {
      name: 'coinBalance',
      type: 'number',
      label: 'Credit Balance',
      required: true,
      defaultValue: 0,
      validate: (val) => {
        if (val < 0) {
          return 'Balance cannot be negative'
        }
        return true
      },
      access: {
        update: admin,
      },
    },
    {
      name: 'tokens',
      label: 'Tokens (Consumed)',
      type: 'number',
      defaultValue: 0,
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'role',
      required: true,
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Enterprise Admin', value: 'entAdmin' },
        { label: 'Enterprise User', value: 'entUser' },
        { label: 'User', value: 'user' },
      ],
      saveToJWT: true,
      access: {
        update: admin,
      },
    },
    {
      name: 'products',
      label: 'Products',
      admin: {
        condition: () => false,
      },
      type: 'relationship',
      required: true,
      relationTo: 'products',
      hasMany: true,
    },
    {
      name: 'product_files',
      label: 'Product files',
      admin: {
        condition: () => false,
      },
      type: 'relationship',
      required: true,
      defaultValue: [],
      relationTo: 'product_files',
      hasMany: true,
    },
    {
      name: 'purchases',
      label: 'Purchases',
      required: true,
      defaultValue: [],
      type: 'relationship',
      relationTo: 'purchases',
      hasMany: true,
      admin: {
        condition: () => false,
      },
    },
    {
      name: 'rappsPurchases',
      label: 'Rapps Purchases',
      type: 'relationship',
      required: true,
      defaultValue: [],
      relationTo: 'rappsPurchases',
      hasMany: true,
      admin: {
        condition: () => false,
      },
    },
    {
      name: 'bounties',
      label: 'Bounties',
      required: true,
      defaultValue: [],
      type: 'relationship',
      relationTo: 'bounties',
      hasMany: true,
      admin: {
        condition: () => false,
      },
    },
    {
      name: 'rapps',
      label: 'Public Rapps',
      type: 'relationship',
      relationTo: 'rapps',
      required: false,
      defaultValue: [],
      filterOptions: ({ data }) => {
        return {
          creator: {
            equals: data.id,
          },
        }
      },
      hasMany: true,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      // TODO: we have to add default images in this
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'genInfo',
      label: 'General Information',
      type: 'group',
      fields: [
        {
          // TODO: change its type later
          name: 'education',
          type: 'text',
          label: 'Education',
        },
        {
          // TODO: change its type later
          name: "skills",
          type: "text",
          label: "Skills",
        },
        {
          name: "gender",
          type: "select",
          label: "Gender",
          hasMany: false,
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Other", value: "other" },
          ],
        },
        {
          name: 'age',
          type: 'number',
          label: 'Age',
        },
        {
          name: 'profession',
          type: 'text',
          label: 'Profession',
        },
        {
          name: 'workExperience',
          type: 'number',
          label: 'Work Experience',
        },
        {
          name: "interests",
          label: "Interests",
          type: "select",
          hasMany: true,
          options: User_Interests.map(({ label, value }) => ({ label, value })),
          required: false,
        },
      ],
    },
    {
      name: 'socialMediaLinks',
      label: 'Social Media Links',
      type: 'group',
      fields: [
        {
          name: 'facebook',
          type: 'text',
          label: 'Facebook',
        },
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram',
        },
        {
          name: 'twitter',
          type: 'text',
          label: 'Twitter',
        },
        {
          name: 'github',
          type: 'text',
          label: 'GitHub',
        },
        {
          name: 'discord',
          type: 'text',
          label: 'Discord',
        },
      ],
    },
    {
      name: 'likes',
      type: 'array',
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
      ],
      admin: {
        hidden: true,
      },
    },
    {
      name: 'following',
      type: 'array',
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
      ],
      admin: {
        hidden: true,
      },
    },
    {
      name: 'followers',
      type: 'array',
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
      ],
      admin: {
        hidden: true,
      },
    },
    {
      name: 'productListing',
      type: 'number',
      label: 'Product Listing',
      admin: {
        condition: () => false,
      },
    },
    {
      name: "userType",
      // defaultValue: null,
      type: "radio",
      options: [
        { label: "Individual", value: "individual" },
        { label: "Enterprise", value: "enterprise" },
        { label: "Student", value: "student" },
      ],
      // access: {
      //   update: admins,
      // },
    },
    {
      name: "over18",
      type: "checkbox",
      label: "Is Adult",
      defaultValue: false,
    },
    {
      name: 'domain',
      required: false,
      label: 'Domain',
      defaultValue: '',
      type: 'text',
    },
    {
      name: 'members',
      label: 'Members',
      defaultValue: [],
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
    {
      name: 'associatedWith',
      label: 'Associated with',
      type: 'relationship',
      relationTo: 'users',
      filterOptions: () => {
        return {
          role: {
            equals: 'entAdmin',
          },
        }
      },
    },
    // normalize this
    {
      name: 'rappAccess',
      label: 'Rapps Access',
      type: 'array',
      required: false,
      access: {
        update: () => true,
      },
      admin: {
        readOnly: true,
      },
      fields: [
        {
          name: 'rappId',
          label: 'Rapp ID',
          type: 'relationship',
          relationTo: 'privateRapps',
          required: true,
        },
        {
          name: 'getAccess',
          label: 'Get Access',
          type: 'select',
          hasMany: true, // This allows multiple selections
          required: false,
          options: [
            { label: 'Read', value: 'read' },
            { label: 'Delete', value: 'delete' },
            { label: 'Create', value: 'create' },
            { label: 'Update', value: 'update' },
          ],
        },
        {
          name: 'tokens',
          label: 'Tokens (consumed)',
          type: 'number',
          required: true,
          defaultValue: 0
        }
      ],
    },
    {
      name: 'privateRapps',
      label: 'Private Rapps',
      required: false,
      defaultValue: [],
      type: 'relationship',
      relationTo: 'privateRapps',
      filterOptions: ({ data }) => {
        return {
          creator: {
            equals: data.id,
          },
        }
      },
      hasMany: true,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'createRappPermission',
      type: 'checkbox',
      label: 'Give Create Rapp Permission',
      required: false,
      defaultValue: false,
      access: {
        update: admin,
      },
    },
    // {
    //   name: 'publicRapps',
    //   label: 'Public Rapps',
    //   type: 'relationship',
    //   relationTo: 'rapps',
    //   required: false,
    //   defaultValue: [],
    //   filterOptions: ({ data }) => {
    //     return {
    //       creator: {
    //         equals: data.id,
    //       },
    //     };
    //   },
    //   hasMany: true,
    //   admin: {
    //     hidden: true,
    //   },
    // }

  ],
  timestamps: true,
}

export default Users
