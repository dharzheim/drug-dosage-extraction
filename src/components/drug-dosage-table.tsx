'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { useMemo } from 'react'
import { isNullOrUndefined } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { fetchDrugDosages } from '@/api/fetch-drug-dosages'

export type DosageErrorCode = 'drug-not-found' | 'appropriate-dosage-not-found' | null

export type DosageRecommendation = {
  drugName: string
  dosage: string | undefined
  errorCode: DosageErrorCode
}

function mapDosageErrorCode(errorCode: DosageErrorCode) {
  switch (errorCode) {
    case 'drug-not-found':
      return 'Präparat nicht gefunden'
    case 'appropriate-dosage-not-found':
      return 'Keine passende Dosierung gefunden'
    case null:
      return ''
    default:
      return 'Unbekannter Fehler'
  }
}

function isAppropriateDosageForWeight(
  drugDosageByWeight: {
    min_kg?: number | null
    max_kg?: number | null
    dosierung: string
    id?: string | null
  },
  weight: number,
): boolean {
  return (
    (isNullOrUndefined(drugDosageByWeight.min_kg) || drugDosageByWeight.min_kg! <= weight) &&
    (isNullOrUndefined(drugDosageByWeight.max_kg) || drugDosageByWeight.max_kg! >= weight)
  )
}

export const DrugDosageTable = ({
  weight,
  drugNames,
}: {
  weight: number | ''
  drugNames: string[]
}) => {
  const { data: drugDosages } = useQuery({
    queryKey: ['drug-dosages', drugNames],
    queryFn: () => fetchDrugDosages({ drugNames }),
  })

  const dosageRecommendations: DosageRecommendation[] = useMemo(() => {
    if (!drugDosages) {
      return []
    }
    return drugNames.map((drug) => {
      const drugWithDosages = drugDosages.find((d) => d.praeparat === drug)
      const appropriateDosage = weight
        ? drugWithDosages?.dosierung_nach_gewicht?.find((drug) =>
            isAppropriateDosageForWeight(drug, weight),
          )?.dosierung
        : drugWithDosages?.dosierung_standard
      return {
        drugName: drug,
        dosage: appropriateDosage,
        errorCode: !drugWithDosages
          ? 'drug-not-found'
          : !appropriateDosage
            ? 'appropriate-dosage-not-found'
            : null,
      }
    })
  }, [weight, drugNames, drugDosages])

  return (
    <>
      {drugDosages && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Präparat</TableHead>
              <TableHead className="w-1/3">Dosierung</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dosageRecommendations.map((recommendation, index) => (
              <TableRow key={index} className={recommendation.errorCode ? 'text-destructive' : ''}>
                <TableCell>{recommendation.drugName}</TableCell>
                <TableCell>
                  {recommendation.dosage || mapDosageErrorCode(recommendation.errorCode)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}
