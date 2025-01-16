import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { CollectionConfig } from 'payload'

const Bounties: CollectionConfig = {
  slug: 'bounties',
  admin: { useAsTitle: 'title' },
  hooks: {},
  fields: [
    {
      name: 'title',
      label: 'Bounty Title',
      type: 'text',
      required: true,
      admin: {
        description: 'Mention the title for the bounty.',
      },
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures, defaultFeatures }) => {
          return [
            ...defaultFeatures,
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
          ]
        },
      }),
      label: 'Bounty Requirements.',
      required: true,
      admin: {
        description:
          'Provide a detailed description of the requirements and criteria needed to complete the bounty, also can use markup for increase readability.',
      },
    },
    {
      name: 'completionDate',
      type: 'date',
      label: 'Completion Date',
      required: true,
      admin: {
        description: 'Specify the deadline by which the bounty must be completed.',
        date: {
          minDate: new Date(),
        },
      },
    },
    {
      name: 'status',
      label: 'Bounty Status',
      type: 'select',
      defaultValue: 'pending',
      admin: {
        description: 'Status will be approved by admin only.',
      },
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
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Is Featured',
      defaultValue: false,
      required: true,
      admin: {
        description:
          'Highlight the bounty in the list by marking it as featured. (Allowed to admin only)',
      },
    },
    {
      name: 'price',
      label: 'Bounty Price',
      type: 'number',
      min: 0,
      required: true,
      admin: {
        description: 'Price in credit (1 rupee = 1 credit)',
      },
    },
    {
      name: 'type',
      label: 'Bounty Related To',
      type: 'select',
      defaultValue: 'ai',
      options: [
        { label: 'Web Application', value: 'web' },
        { label: 'Mobile Application', value: 'mobile' },
        { label: 'Blockchain', value: 'blockchain' },
        { label: 'Artificial Intelligence (AI)', value: 'ai' },
        { label: 'Machine Learning (ML)', value: 'ml' },
      ],
      required: true,
      admin: {
        description: 'Mention the category or field the bounty is related to.',
      },
    },
    {
      name: 'attachments',
      label: 'Upload attachments',
      type: 'relationship',
      required: true,
      relationTo: 'product_files',
      hasMany: true,
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'select',
      hasMany: true,
      defaultValue: [],
      options: [
        { label: 'AI/ML', value: 'ai/ml' },
        { label: 'Prompt', value: 'prompt' },
        { label: 'Finetuning', value: 'finetuning' },
        { label: 'Blockchain', value: 'blockchain' },
        { label: 'Frontend', value: 'frontend' },
        { label: 'Backend', value: 'backend' },
        { label: 'UI/UX', value: 'ui/ux' },
        { label: 'Fullstack', value: 'fullstack' },
        { label: 'Design', value: 'design' },
        { label: 'Testing', value: 'testing' },
        { label: 'Assets', value: 'assets' },
        { label: 'Bug', value: 'bug' },
        { label: 'Chatbot', value: 'chatbot' },
      ],
      required: true,
      admin: {
        description: 'Add tag for the bounty based on its type. You can also select multiple tags.',
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      // defaultValue: ({ user }) => user.id,
      hasMany: false,
      admin: {
        allowCreate: false,
        readOnly: true,
      },
    },
    {
      name: 'applicants',
      label: 'Applied Users',
      type: 'array',
      required: true,
      minRows: 0,
      fields: [
        {
          name: 'user',
          label: 'User IDs',
          type: 'relationship',
          relationTo: 'users',
          required: true,
          hasMany: false,
        },
        {
          name: 'userName',
          label: 'User Name',
          type: 'text',
          required: true,
        },
        {
          name: 'linkedin',
          label: 'Linkedin ID',
          type: 'text',
          required: true,
        },
        {
          name: 'phone',
          label: 'Phone Number',
          required: true,
          type: 'number',
        },
        {
          required: true,
          name: 'approach',
          label: 'Approach',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ rootFeatures, defaultFeatures }) => {
              return [
                ...defaultFeatures,
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }),
                FixedToolbarFeature(),
                InlineToolbarFeature(),
                HorizontalRuleFeature(),
              ]
            },
          }),
        },
        {
          name: 'relatedFile',
          label: 'Related Product Files',
          type: 'relationship',
          required: true,
          defaultValue: [],
          relationTo: 'product_files',
          hasMany: true,
        },
      ],
    },
    {
      name: 'createdBy',
      label: 'Created By',
      type: 'text',
      access: {
        read: ({ req: { user } }) => user?.role === 'admin',
      },
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'updatedBy',
      label: 'Updated By',
      type: 'text',
      access: {
        read: ({ req: { user } }) => user?.role === 'admin',
      },
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}
export default Bounties
