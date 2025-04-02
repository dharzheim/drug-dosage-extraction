import React, { useEffect, useState } from 'react'
import { createWorker } from 'tesseract.js'
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

  const processFile = (file: File) => {
    setError(null)
    setProgress(0)
    setImageFile(file)
  }

  useEffect(() => {
    if (!imageFile) return

    async function extractTextFromImage(imageFile: File) {
      setIsLoading(true)
      setProgress(0) // Start progress tracking
      const worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(m.progress * 100)
          }
        },
      })

      try {
        const {
          data: { text },
        } = await worker.recognize(imageFile, {}, { blocks: true })
        onDrugNamesExtracted(text.split('\n').filter((drug) => drug))
      } catch (err) {
        console.error('OCR Error:', err)
        setError('Error during OCR processing. Please try again or use a different image')
      } finally {
        await worker.terminate() // Terminate worker to free resources
        setIsLoading(false)
        setProgress(100) // Mark as complete
      }
    }

    extractTextFromImage(imageFile)
  }, [onDrugNamesExtracted, imageFile])

  return (
    <>
      {!isLoading && <ImageDropzone handleFile={processFile} />}
      {isLoading && <Progress value={progress} />}
      {error && <p className="text-destructive mt-4">{error}</p>}
    </>
  )
}
