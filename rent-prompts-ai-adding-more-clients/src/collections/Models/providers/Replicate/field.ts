import { Field } from 'payload'

export const replicate: Field = {
  type: 'group',
  name: 'replicate',
  admin: {
    description: 'Add your Replicate keys',
    condition: (data) => data.provider === 'replicate',
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Keys',
      fields: [
        {
          type: 'text',
          name: 'modelname',
          required: true,
        },
        {
          type: 'text',
          name: 'apikey',
          required: true,
        },
      ],
    },
  ],
}
