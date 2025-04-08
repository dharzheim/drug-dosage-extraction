import React, { useCallback, useEffect, useState } from 'react'
import Tesseract, { createWorker } from 'tesseract.js'
import ImageDropzone from '@/components/image-dropzone'
import { Progress } from '@/components/ui/progress'

export default function DrugExtractor({
  onDrugNamesExtracted,
}: {
  onDrugNamesExtracted: (drugNames: string[]) => void
}) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const [promisedWorker, setPromisedWorker] = useState<Promise<Tesseract.Worker> | null>(null)

  useEffect(() => {
    if (!promisedWorker) {
      const worker = createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(m.progress * 100)
          }
        },
      })
      setPromisedWorker(worker)
    } else {
      return () => {
        promisedWorker
          .then((worker) => worker.terminate())
          .then(() => console.log('worker terminated'))
      }
    }
  }, [promisedWorker])

  const processFile = (file: File) => {
    setError(null)
    setProgress(0)
    extractTextFromImage(file).then((text) => {
      if (text) {
        onDrugNamesExtracted(text.split('\n').filter((drug) => drug))
      }
    })
  }

  const extractTextFromImage = useCallback(
    async (imageFile: File) => {
      if (promisedWorker === null) {
        return
      }
      setIsLoading(true)
      setProgress(0)
      const worker = await promisedWorker

      try {
        const {
          data: { text },
        } = await worker.recognize(imageFile)
        return text
      } catch (err) {
        console.error('OCR Error:', err)
        setError('Error during OCR processing. Please try again or use a different image')
      } finally {
        setIsLoading(false)
        setProgress(100)
      }
    },
    [promisedWorker],
  )

  return (
    <>
      {!isLoading && <ImageDropzone handleFile={processFile} />}
      {isLoading && <Progress value={progress} />}
      {error && <p className="text-destructive mt-4">{error}</p>}
    </>
  )
}
