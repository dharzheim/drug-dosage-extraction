import { DrugDosage } from '@/payload-types'
import { PaginatedDocs, Where } from 'payload'
import { stringify } from 'qs-esm'

type GetDrugDosagesParams = {
  drugNames: string[]
}

const COLLECTION_URL = '/api/drug-dosages/'

export const fetchDrugDosages = async ({
  drugNames,
}: GetDrugDosagesParams): Promise<DrugDosage[]> => {
  const query: Where = {
    praeparat: {
      in: drugNames,
    },
  }

  const stringifiedQuery = stringify(
    {
      limit: '100',
      where: query,
    },
    { addQueryPrefix: true },
  )

  const response = await fetch(`${COLLECTION_URL}${stringifiedQuery}`, {
    method: 'GET',
  })
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  const paginatedDrugDosages: PaginatedDocs<DrugDosage> = await response.json()
  return paginatedDrugDosages.docs
}
