import { CollectionConfig } from 'payload'
import { autoGenerateSlug } from '../PrivateRapps'
import { updatePrompts } from './enpoints/updatePrompts'

const PublicRapps: CollectionConfig = {
  slug: 'rapps',
  endpoints: [
    {
      method: 'post',
      path: '/updatePrompts/:id',
      handler: updatePrompts,
    },
  ],
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
            equals: data?.modelType,
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
    // average rating
    {
      name: 'rating',
      label: 'Rating',
      type: 'number',
      required: true,
      min: 0,
      max: 5,
      defaultValue: 0,
      admin: {
        description: 'Rate between 1 and 5 stars',
        step: 0.1,
        hidden: true,
      },
    },
    // user ratings
    {
      name: 'userRatings',
      label: 'User Ratings',
      type: 'array',
      admin: {
        hidden: true,
      },
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'rating',
          type: 'number',
          required: true,
          min: 0,
          max: 5,
        },
      ],
    },
    // user comments
    {
      name: 'userComment',
      label: 'user comment',
      type: 'array',
      required: false,
      admin: {
        hidden: true,
      },
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'comment',
          type: 'text',
          required: true,
        },
      ],
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
    // needsApproval only public rapp
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
    // isFeatured (no need for private)
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Is Featured',
      defaultValue: false,
      required: true,
      admin: {
        description: 'Highlight the rapp in the list by marking it as featured.',
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
    // affiliated_with
    {
      name: 'affiliated_with',
      label: 'Affiliated With',
      type: 'text',
      required: false,
    },
    // likes
    {
      name: 'likes',
      type: 'array',
      admin: {
        hidden: true,
      },
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
      ],
    },
    // category
    // {
    //   name: 'category',
    //   type: 'relationship',
    //   relationTo: 'category',
    //   hasMany: true,
    //   label: 'Category',
    //   // required: true,
    //   // admin: {
    //   //   description: "Select categories for this Rapp",
    //   // },
    // },
    // // tags
    // {
    //   name: 'tags',
    //   type: 'relationship',
    //   relationTo: 'tags',
    //   hasMany: true,
    //   label: 'Tags',
    // },
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
    // applicable or not (you want to sell this ?)
    {
      type: 'checkbox',
      name: 'priceapplicable',
      label: 'You want to sell this ?',
      required: true,
      defaultValue: false,
    },
    // estimatedPrice
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
    // totalCost (cost + commission) and estimated if applicable
    {
      type: 'number',
      name: 'totalCost',
      required: true,
      label: '(Computation cost + commision cost)',
      admin: {
        position: 'sidebar',
        readOnly: true,
        components: {
          // Field: totalCost,
        },
      },
    },
    //get prompt checkbox for user
    {
      name: 'getprompt',
      defaultValue: false,
      required: true,
      label: 'Sell Prompt',
      type: 'checkbox',
      admin: {
        description: 'Do you want to sell this prompt. ',
        position: 'sidebar',
      },
    },
    //field for revealing prompt cost
    {
      name: 'promptcost',
      label: 'Cost',
      type: 'number',
      admin: {
        condition: (data) => data.getprompt === true, // Field only visible when "Sell Prompt" is checked
        position: 'sidebar',
        description: 'Mention the cost required to buy this prompt. ',
      },
      required: true, // Make it required when visible
      validate: (value, { data }) => {
        if (data.getprompt && !value) {
          return 'Cost is required when selling this prompt.'
        }
        return true
      },
    },
    //prompt purchases field
    {
      name: 'promptpurchase',
      type: 'array',
      admin: {
        hidden: true,
      },
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
      ],
    },
    // images
    {
      name: 'tokens',
      label: 'Tokens (Consumed)',
      type: 'number',
      defaultValue: 0,
      required: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
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
    // images
    // {
      // name: 'images',
      // type:''
      // // type: 'array',
      // // minRows: 1,
      // // maxRows: 4,
      // labels: {
      //   singular: 'Image',
      //   plural: 'Images',
      // },
      // // required: true,
      // admin: {
      //   description: 'Uplaod 4-6 examples generated by this application',
      //   position: 'sidebar',
      // },
      // defaultValue: [],
      // fields: [
      // {
      //   name: 'image',
      //   type: 'upload',
      //   relationTo: 'media',
      //   required: true,
      //   label: 'Example/Sample Image',
      // },
      // ],
      // name: 'image',
      // type: 'upload',
      // relationTo: 'media',
      // // required: true,
      // label: 'Example/Sample Image',
    // },
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

export default PublicRapps
