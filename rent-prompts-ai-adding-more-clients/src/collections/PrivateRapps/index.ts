import { CollectionConfig } from 'payload'
import { FieldHook } from 'payload'
import slugify from 'slugify'
import { generateUniqueSlug } from './endpoints/generateUniqueSlug'
import endpoints from './endpoints'

export const autoGenerateSlug: FieldHook = ({ data, value }) => {
  if (data?.name && !value) {
    return slugify(data.name, { lower: true, strict: true })
  }
  return value
}

const PrivateRapps: CollectionConfig = {
  slug: 'privateRapps',
  // auth: {
  //   useAPIKey: true,
  //   disableLocalStrategy: true,
  // },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  endpoints: endpoints,
  hooks: {
    beforeChange: [generateUniqueSlug],
  },
  fields: [
    // type
    {
      name: 'modelType',
      type: 'select',
      label: 'Rent Application Type',
      admin: { description: 'Select the type of application you want to rent' },
      defaultValue: 'text',
      required: true,
      options: [
        {
          label: 'Text Rapp',
          value: 'text',
        },
        {
          label: 'Image Rapp',
          value: 'image',
        },
        {
          label: 'Audio Rapp',
          value: 'audio',
        },
        {
          label: 'Video Rapp',
          value: 'video',
        },
      ],
    },
    // model
    {
      type: 'relationship',
      relationTo: 'models',
      name: 'model',
      label: 'Generation Model',
      required: true,
      admin: {
        allowCreate: false,
        description: 'Select the AI model',
      },
      filterOptions: ({ data }) => {
        return {
          type: {
            equals: data.modelType,
          },
        }
      },
    },
    // key
    {
      name: 'key',
      label: 'Model key to run this Rapp',
      type: 'select',
      required: true,
      defaultValue: 'test',
      options: [
        {
          label: 'Test',
          value: 'test',
        },
        {
          label: 'Prod',
          value: 'prod',
        },
      ],
    },
    // systemprompt
    {
      name: 'systemprompt',
      type: 'textarea',
      label: 'System Prompt',
      admin: {
        placeholder: 'give instructions to the model',
        description: 'Set context for the model',
        // condition: (data) => data.type === 'text',
      },
      // required: true,
    },
    // prompt
    {
      type: 'textarea',
      name: 'prompt',
      label: 'User Prompt',
      // required: true,
      admin: {
        placeholder: 'a cute minimalistic simple [hedgehog] side profile Clipart',
        description: 'Put any variables in [square brackets]',
      },
    },
    // negativeprompt
    {
      type: 'textarea',
      name: 'negativeprompt',
      label: 'Negative Prompt',
      // required: true,
      admin: {
        placeholder: 'give negative prompt',
        description: 'Add something to neglect',
        // condition: (data) => data.type === 'image',
      },
    },
    // public => rentprompts admin
    // private => creator will change
    // status
    {
      name: 'status',
      label: 'Rapps Status',
      type: 'select',
      defaultValue: 'pending',
      required: true,
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
    // slug
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      required: false,
      unique: true,
      hooks: {
        beforeValidate: [autoGenerateSlug], // Use the field-level hook here for real-time slug generation
      },
      admin: {
        readOnly: true, // Make it read-only so users cannot change it manually
        position: 'sidebar',
      },
    },
    // imageinput (disables if model doesn't accept image)
    {
      type: 'checkbox',
      name: 'imageinput',
      label: 'Allow user to send image as Input',
      admin: {
        description: 'User will be able to give image as input to your Rapp',
        // condition: (data) => data.modelType === "image",
      },
      defaultValue: false,
      required: true,
    },
    {
      type: 'checkbox',
      name: 'needsApproval',
      label: 'Send for Approval',
      admin: {
        description: 'Mark this item as needing approval.',
        position: 'sidebar',
      },
      defaultValue: false,
      required: true,
    },
    // purchases
    {
      name: 'purchases',
      label: 'Purchases',
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
    // name
    {
      type: 'text',
      name: 'name',
      label: 'Rapp Name',
      admin: {
        description: 'Title of your Rent application',
        placeholder: 'ex: Funky Sticker Generator',
        position: 'sidebar',
      },
      required: true,
    },
    // description
    {
      type: 'textarea',
      name: 'description',
      label: 'Rapp Description',
      admin: {
        description: `Describe what your application does to a potential buyer.
        A more detailed description will increase your sales, also can use markup for increase readability.`,
        placeholder: 'Generates amazing high quality stickers',
        position: 'sidebar',
      },
      required: true,
    },
    {
      label: 'Estimated Price',
      name: 'price',
      type: 'number',
      defaultValue: 0,
      admin: {
        // condition: (data) => data.priceapplicable,
        description: 'What do you think the price of this application should as per Cycle',
        placeholder: 'Mention estimated price in coins',
        position: 'sidebar',
      },
      // required: true,
    },
    // totalCost (cost + commission)
    {
      type: 'number',
      name: 'totalCost',
      required: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        components: {
          // Field: totalCost,
        },
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
        position: 'sidebar',
      }
    },
    // images
    // {
    //   // name: 'images',
    //   // type:''
    //   // // type: 'array',
    //   // // minRows: 1,
    //   // // maxRows: 4,
    //   // labels: {
    //   //   singular: 'Image',
    //   //   plural: 'Images',
    //   // },
    //   // // required: true,
    //   // admin: {
    //   //   description: 'Uplaod 4-6 examples generated by this application',
    //   //   position: 'sidebar',
    //   // },
    //   // defaultValue: [],
    //   // fields: [
    //   // {
    //   //   name: 'image',
    //   //   type: 'upload',
    //   //   relationTo: 'media',
    //   //   required: true,
    //   //   label: 'Example/Sample Image',
    //   // },
    //   // ],
    //   name: 'images',
    //   type: 'upload',
    //   relationTo: 'media',
    //   hasMany: true,
    //   // required: true,
    //   label: 'Example/Sample Image',
    // },
    {
      name: "images",
      type: "array",
      label: "ai apps images",
      minRows: 1,
      maxRows: 4,
      // required: true,
      labels: {
        singular: "Image",
        plural: "Images",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          // required: true,
        },
      ],
      admin: {
        description: "Atleast one image is required.",
      },
    },
    // creator
    {
      name: 'creator',
      label: 'Created By',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      defaultValue: ({ user }) => user?.id,
      hasMany: false,
      admin: {
        allowCreate: false,
        readOnly: true,
        position: 'sidebar',
      },
    },
    // systemVariables
    {
      type: 'array',
      name: 'systemVariables',
      label: 'Variables',
      // required: true,
      // defaultValue: [],
      fields: [
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          required: true,
        },
        {
          name: 'identifier',
          type: 'text',
          required: true,
          label: 'Identifier',
        },
        {
          name: 'displayName',
          type: 'text',
          required: true,
          label: 'Display Name',
        },
        {
          name: 'description',
          type: 'text',
          required: true,
          label: 'Description',
        },
        {
          name: 'placeholder',
          type: 'text',
          label: 'Placeholder',
        },
        {
          name: 'type',
          label: 'Type',
          type: 'select',
          options: [
            {
              label: 'String',
              value: 'string',
            },
            {
              label: 'Number',
              value: 'number',
            },
            {
              label: 'Boolean',
              value: 'boolean',
            },
            {
              label: 'Select',
              value: 'select',
            },
          ],
          required: true,
        },
        {
          name: 'allowMultiple',
          type: 'checkbox',
          label: 'Allow Multiple',
          required: true,
          defaultValue: false,
        },
        {
          name: 'options',
          type: 'text',
          hasMany: true,
        },
      ],
    },
    // promptVariables
    {
      type: 'array',
      name: 'promptVariables',
      label: 'Variables',
      // required: true,
      // defaultValue: [],
      fields: [
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          required: true,
        },
        {
          name: 'identifier',
          type: 'text',
          required: true,
          label: 'Identifier',
        },
        {
          name: 'displayName',
          type: 'text',
          required: true,
          label: 'Display Name',
        },
        {
          name: 'description',
          type: 'text',
          required: true,
          label: 'Description',
        },
        {
          name: 'placeholder',
          type: 'text',
          label: 'Placeholder',
        },
        {
          name: 'type',
          label: 'Type',
          type: 'select',
          options: [
            {
              label: 'String',
              value: 'string',
            },
            {
              label: 'Number',
              value: 'number',
            },
            {
              label: 'Boolean',
              value: 'boolean',
            },
            {
              label: 'Select',
              value: 'select',
            },
          ],
          required: true,
        },
        {
          name: 'allowMultiple',
          type: 'checkbox',
          label: 'Allow Multiple',
          required: true,
          defaultValue: false,
        },
        {
          name: 'options',
          type: 'text',
          hasMany: true,
        },
      ],
    },
    // negativeVariables
    {
      type: 'array',
      name: 'negativeVariables',
      label: 'Variables',
      // required: true,
      // defaultValue: [],
      fields: [
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          required: true,
        },
        {
          name: 'identifier',
          type: 'text',
          required: true,
          label: 'Identifier',
        },
        {
          name: 'displayName',
          type: 'text',
          required: true,
          label: 'Display Name',
        },
        {
          name: 'description',
          type: 'text',
          required: true,
          label: 'Description',
        },
        {
          name: 'placeholder',
          type: 'text',
          label: 'Placeholder',
        },
        {
          name: 'type',
          label: 'Type',
          type: 'select',
          options: [
            {
              label: 'String',
              value: 'string',
            },
            {
              label: 'Number',
              value: 'number',
            },
            {
              label: 'Boolean',
              value: 'boolean',
            },
            {
              label: 'Select',
              value: 'select',
            },
          ],
          required: true,
        },
        {
          name: 'allowMultiple',
          type: 'checkbox',
          label: 'Allow Multiple',
          required: true,
          defaultValue: false,
        },
        {
          name: 'options',
          type: 'text',
          hasMany: true,
        },
      ],
    },
    // access
    {
      name: 'access',
      label: 'Access to',
      type: 'array',
      required: false,
      access: {
        update: () => true,
      },
      // admin: {
      //   readOnly: true,
      // },
      fields: [
        {
          name: 'userId',
          label: 'User ID',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'getAccess',
          label: 'Get Access',
          type: 'select',
          hasMany: true, // This allows multiple selections
          required: true,
          options: [
            { label: 'Read', value: 'read' },
            { label: 'Delete', value: 'delete' },
            { label: 'Update', value: 'update' },
          ],
        },
      ],
    },
    // settings
    {
      name: 'settings',
      type: 'json',
      label: 'Settings',
      jsonSchema: {
        fileMatch: ['a://b/foo.json'],
        schema: {
          type: 'object',
          additionalProperties: true,
          properties: {},
        },
        uri: 'a://b/foo.json',
      },
    },
  ],
}
export default PrivateRapps
