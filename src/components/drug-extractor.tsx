import React, { useEffect, useState } from 'react'
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
  const [imageFile, setImageFile] = useState<File | null>(null)
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

  console.log(promisedWorker)
  const processFile = (file: File) => {
    setError(null)
    setProgress(0)
    setImageFile(file)
  }

  useEffect(() => {
    if (!promisedWorker) return
    if (!imageFile) return

    async function extractTextFromImage(imageFile: File) {
      setIsLoading(true)
      setProgress(0) // Start progress tracking
      const worker = (await promisedWorker) as Tesseract.Worker

      try {
        const {
          data: { text },
        } = await worker.recognize(imageFile)
        onDrugNamesExtracted(text.split('\n').filter((drug) => drug))
      } catch (err) {
        console.error('OCR Error:', err)
        setError('Error during OCR processing. Please try again or use a different image')
      } finally {
        setIsLoading(false)
        setProgress(100) // Mark as complete
      }
    }

    extractTextFromImage(imageFile)
  }, [onDrugNamesExtracted, imageFile, promisedWorker])

  return (
    <>
      {!isLoading && <ImageDropzone handleFile={processFile} />}
      {isLoading && <Progress value={progress} />}
      {error && <p className="text-destructive mt-4">{error}</p>}
    </>
  )
}
