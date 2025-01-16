import { CollectionConfig } from 'payload'
import { groq } from './providers/Groq/field'
import { replicate } from './providers/Replicate/field'
import { openai } from './providers//Openai/field'
// import { lexicalEditor } from '@payloadcms/richtext-lexical'
import endpoints from './endpoints'
import { falai } from './providers/Falai/field'

const Models: CollectionConfig = {
  slug: 'models',
  admin: {
    useAsTitle: 'name',
    livePreview: {
      url: ({ data }) => {
        return `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/dashboard/livepreview/models?id=${data.id}`
      },
    },
  },
  endpoints: endpoints,
  fields: [
    // name
    {
      type: 'text',
      name: 'name',
      label: 'Model Name',
      required: true,
      admin: {
        placeholder: 'Enter name of your model',
      },
    },
    // description
    {
      type: 'textarea',
      label: 'Model Description',
      name: 'description',
      required: true,
      admin: { placeholder: 'Some details about the model' },
    },
    // about model Page (seo benefit)
    // {
    //   type: 'richText',
    //   name: 'about',
    //   editor: lexicalEditor({}),
    //   required: true,
    //   label: 'About Model Page',
    // },
    // type
    {
      name: 'type',
      type: 'select',
      label: 'Model Type',
      admin: { description: 'Select what your Gen AI model generates' },
      defaultValue: 'text',
      options: [
        {
          label: 'Text Model',
          value: 'text',
        },
        {
          label: 'Image Model',
          value: 'image',
        },
        {
          label: 'Audio Model',
          value: 'audio',
        },
        {
          label: 'Video Model',
          value: 'video',
        },
      ],
      required: true,
    },
    // imageinput
    {
      type: 'checkbox',
      name: 'imageinput',
      label: 'Model accepts image as input',
      defaultValue: false,
      required: true,
    },
    // provider
    {
      name: 'provider',
      type: 'select',
      label: 'Model Provider',
      defaultValue: 'groq',
      required: true,
      options: [
        { label: 'Groq', value: 'groq' },
        { label: 'OpenAI', value: 'openai' },
        { label: 'Replicate', value: 'replicate' },
        { label: 'Fal AI', value: 'falai' },
        // { label: 'Azure OpenAI', value: 'azureopenai' },
        // { label: 'Hugging Face', value: 'huggingface' },
      ],
      admin: {
        description: 'Select where your model is hosted',
      },
    },
    // settings
    {
      name: 'settings',
      type: 'array',
      required: true,
      defaultValue: [],
      label: 'Model Settings',
      admin: { description: 'Select the settings that your model accepts' },
      fields: [
        {
          type: 'text',
          name: 'name',
          label: 'Setting Name',
          required: true,
          admin: { placeholder: `Name as mentioned in model's docs` },
        },
        {
          type: 'select',
          name: 'type',
          label: 'Setting Type',
          required: true,
          defaultValue: 'integer',
          admin: { description: `Data type as mentioned in model's docs` },
          options: [
            { label: 'integer', value: 'integer' },
            { label: 'string', value: 'string' },
            { label: 'boolean', value: 'boolean' },
            { label: 'select', value: 'select' },
          ],
        },
        {
          type: 'text',
          label: 'Setting Description',
          name: 'description',
          required: true,
          admin: {
            placeholder: 'Add information like the range of input',
            description: `Description as mentioned in model's docs`,
          },
        },
        {
          name: 'options',
          type: 'text',
          hasMany: true,
          // required: true,
          // defaultValue: [],
          label: 'Options for "select" type',
        },
        {
          name: 'allowMultiple',
          type: 'checkbox',
          label: 'Allow Multiple',
          required: true,
          defaultValue: false,
          admin: {
            description: 'Allow user to select multiple options for "select" type',
          },
        },
      ],
    },
    // allow prompt
    {
      type: 'checkbox',
      name: 'enablePrompt',
      label: 'Accepts Prompt',
      defaultValue: true,
      required: true,
    },
    // allow systemprompt
    {
      type: 'checkbox',
      name: 'systemprompt',
      label: 'Accepts System Prompt',
      defaultValue: false,
      required: true,
    },
    // allow negativeprompt
    {
      type: 'checkbox',
      name: 'negativeprompt',
      label: 'Accepts Negative Prompt',
      defaultValue: false,
      required: true,
    },
    // prodkeys
    {
      name: 'prodkeys',
      label: 'Prod Provider Keys',
      type: 'group',
      fields: [groq, replicate, openai,falai],
    },
    // testkeys
    {
      name: 'testkeys',
      label: 'Test Provider Keys',
      type: 'group',
      fields: [groq, replicate, openai,falai],
    },
    // cost
    {
      type: 'number',
      name: 'cost',
      label: 'Computation Cost',
      required: true,
      defaultValue: 0,
      validate: (val) => {
        if (val < 0) {
          return 'Cost cannot be negative'
        }
        return true
      },
      admin: {
        description: 'Enter the cost of your model',
      },
    },
    // applicable or not
    {
      type: 'checkbox',
      label: 'Commission Applicable',
      name: 'commissionapplicable',
      required: true,
      defaultValue: false,
    },
    // commision
    {
      type: 'number',
      name: 'commision',
      label: 'Commission',
      required: true,
      defaultValue: 0,
      validate: (val) => {
        if (val < 0) {
          return 'Commission cannot be negative'
        }
        return true
      },
      admin: {
        condition: (data) => data.commissionapplicable,
        description: 'Enter the commission',
      },
    },
    {
      name: 'tokens',
      label: 'Tokens',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    // examples
    {
      type: 'array',
      name: 'examples',
      required: true,
      defaultValue: [],
      label: 'Prompt Examples',
      admin: {
        description: 'Give user some prompt examples',
      },
      maxRows: 5,
      fields: [
        {
          type: 'text',
          name: 'example',
          label: 'Example Prompt',
          required: true,
          admin: {
            placeholder: 'write your prompt here',
          },
        },
      ],
    },
  ],
}
export default Models
