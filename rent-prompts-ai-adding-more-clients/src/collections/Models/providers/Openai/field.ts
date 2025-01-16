import { Field } from 'payload'

export const openai: Field = {
  type: 'group',
  name: 'openai',
  admin: {
    description: 'Add your OpenAI keys',
    condition: (data) => data.provider === 'openai',
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
