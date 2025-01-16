import { Field } from "payload";

export const falai: Field= {
  type: "group",
  name: "falai",
  admin: {
    description: "Add your FalAI keys",
    condition: (data) => data.provider === "falai",
  },
  fields: [
    {
      type: "collapsible",
      label: "Keys",
      fields: [
        {
          type: "text",
          name: "modelname",
          required: true,
        },
        {
          type: "text",
          name: "apikey",
          required: true,
        },
      ],
    },
  ],
};
