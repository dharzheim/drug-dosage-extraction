import * as React from 'react'
import { ChangeEvent } from 'react'
import { InputWithSuffix } from '@/components/ui/input-with-suffix'
import { Label } from '@/components/ui/label'

export default function PatientInfo({
  weight,
  onChange,
}: {
  weight: number | ''
  onChange: (weight: number | '') => void
}) {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(!isNaN(event.currentTarget.valueAsNumber) ? event.currentTarget.valueAsNumber : '')
  }

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={'weight'}>Gewicht</Label>
      <InputWithSuffix
        id={'weight'}
        type="number"
        pattern="\d*"
        suffix="kg"
        placeholder="Gewicht in kg"
        onChange={handleInputChange}
        value={weight}
      />
    </div>
  )
}
