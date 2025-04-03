'use client'

import React, { useState } from 'react'
import DrugExtractor from '@/components/drug-extractor'
import { DrugDosageTable } from '@/components/drug-dosage-table'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RiImageAiLine } from 'react-icons/ri'
import PatientInfo from './patient-info'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const DrugDosages = () => {
  const [weight, setWeight] = useState<number | ''>('')
  const [extractedDrugNames, setExtractedDrugNames] = useState<string[]>([])

  const queryClient = new QueryClient()

  return (
    <div className={'grid grid-cols-4 gap-4'}>
      {extractedDrugNames.length === 0 ? (
        <section className={'col-span-3'}>
          <Card>
            <CardHeader>
              <CardTitle>Medikamentenliste hochladen</CardTitle>
            </CardHeader>
            <CardContent>
              <DrugExtractor onDrugNamesExtracted={setExtractedDrugNames} />
            </CardContent>
          </Card>
        </section>
      ) : (
        <>
          <section className={'col-span-3'}>
            <Card>
              <CardHeader>
                <CardTitle>Medikamentenliste</CardTitle>
                <CardAction>
                  <Button onClick={() => setExtractedDrugNames([])}>
                    <RiImageAiLine />
                    Neue Liste hochladen
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent>
                <QueryClientProvider client={queryClient}>
                  <DrugDosageTable drugNames={extractedDrugNames} weight={weight} />
                </QueryClientProvider>
              </CardContent>
            </Card>
          </section>
          <section className={'col-span-1'}>
            <Card>
              <CardHeader>
                <CardTitle>Patient</CardTitle>
              </CardHeader>
              <CardContent>
                <PatientInfo weight={weight} onChange={setWeight} />
              </CardContent>
            </Card>
          </section>
        </>
      )}
    </div>
  )
}
