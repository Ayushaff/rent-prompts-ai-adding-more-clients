import { Field } from 'payload'

export const groq: Field = {
  type: 'group',
  name: 'groq',
  admin: {
    description: 'Add your Groq keys',
    condition: (data) => data.provider === 'groq',
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
