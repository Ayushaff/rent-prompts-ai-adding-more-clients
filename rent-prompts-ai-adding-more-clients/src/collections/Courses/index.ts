import { CollectionConfig } from 'payload'

const Courses: CollectionConfig = {
  slug: 'courses',
  endpoints: [
    // {
    //   path: '/purchaseCourse',
    //   method: 'post',
    //   handler: purchaseCourse,
    // },
  ],
  admin: { useAsTitle: 'title' },
  hooks: {},
  fields: [
    {
      name: 'title',
      label: 'Course Title',
      type: 'text',
      required: true,
      admin: {
        description: 'Title of the Course',
      },
    },
    {
      name: 'description',
      label: 'Course Description',
      type: 'textarea',
      required: true,
      admin: {
        description:
          'Short description about the course by which user will get clear understanding about the course, also can use markup for increase readability.',
      },
    },
    {
      name: 'price',
      label: 'Course Price',
      type: 'number',
      required: true,
      admin: {
        description: 'Mention course price in Joule (1 rupee = 1 credit)',
      },
    },
    {
      name: 'level',
      label: 'Course Level',
      type: 'select',
      defaultValue: 'beginner',
      required: true,
      admin: {
        description:
          'To correctly categorize the course in level will helps learners choose the course that best fits their current skill level.',
      },
      options: [
        {
          label: 'Beginner',
          value: 'beginner',
        },
        {
          label: 'Intermediate',
          value: 'intermediate',
        },
        {
          label: 'Advance',
          value: 'advance',
        },
      ],
    },
    {
      name: 'status',
      label: 'Course Status',
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
          'Highlight the course in the list by marking it as featured. (Allowed to admin only)',
      },
    },
    {
      name: 'images',
      label: 'Upload Course Thumbnail ',
      type: 'relationship',
      required: true,
      defaultValue: [],
      relationTo: 'media',
      hasMany: true,
      admin: {
        description: 'Select Image which you want to display as thumbnail for the course.',
      },
    },
    {
      name: 'duration',
      label: 'Course Time Period',
      type: 'select',
      defaultValue: '1 week',
      admin: {
        description: 'Mention time required to complete the course by the leaners.',
      },
      required: true,
      options: [
        { label: '1 day', value: '1day' },
        { label: '2 days', value: '2days' },
        { label: '4 days', value: '4days' },
        { label: '1 week', value: '1week' },
        { label: '2 week', value: '2week' },
        { label: '1 month', value: '1month' },
        { label: 'Above 1 month', value: 'above 1month' },
      ],
    },
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'AI Assistants / Agents', value: 'AI Assistants / Agents' },
        { label: 'Prompt Engineering', value: 'Advance Prompt Eng' },
        { label: 'Knowledge Graph', value: 'Agent Graph' },
        { label: 'RAG', value: 'RAG' },
        { label: 'Blockchain', value: 'Basics of DL' },
        { label: 'UI/UX', value: 'Basics of Prompt Eng' },
      ],
      required: true,
      admin: {
        description: 'Select course type like web development, programming, data science etc.',
      },
    },
    {
      name: 'pdf',
      label: 'Upload Related Document (pdf format)',
      type: 'upload', // Use the 'upload' field type to handle file uploads
      relationTo: 'product_files', // You need a media collection to handle file uploads
      required: true,
      admin: {
        description: 'Upload Course file',
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

export default Courses
