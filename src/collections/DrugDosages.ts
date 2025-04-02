import { addDataAndFileToRequest, CollectionConfig } from 'payload'

export const DrugDosages: CollectionConfig = {
  slug: 'drug-dosages',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'praeparat',
      type: 'text',
      required: true,
    },
    {
      name: 'dosierung_standard',
      type: 'text',
      required: true,
    },
    {
      name: 'dosierung_nach_gewicht',
      type: 'array',
      fields: [
        {
          name: 'min_kg',
          type: 'number',
          required: false,
        },
        {
          name: 'max_kg',
          type: 'number',
          required: false,
        },
        {
          name: 'dosierung',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  endpoints: [
    {
      path: '/batch',
      method: 'post',
      handler: async (req) => {
        await addDataAndFileToRequest(req)
        const drugDosages = req.data
        if (drugDosages && Array.isArray(drugDosages)) {
          for (const dosage of drugDosages) {
            await req.payload.create({
              collection: 'drug-dosages',
              data: dosage,
            })
          }
          return Response.json({
            message: 'successfully updated drug-dosages',
          })
        }
        return Response.json({
          status: 403,
          statusText: 'Invalid data',
        })
      },
    },
  ],
}
