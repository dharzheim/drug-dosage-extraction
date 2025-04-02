import React, { useMemo } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { Property } from 'csstype'
import { RiImageAiLine } from 'react-icons/ri'
import FlexDirection = Property.FlexDirection

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column' as FlexDirection,
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 'var(--radius)',
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  outline: 'none',
  transition: 'border .1s ease-in-out',
}

const focusedStyle = {
  borderColor: '#2196f3',
}

const acceptStyle = {
  borderColor: '#00e676',
}

const rejectStyle = {
  borderColor: 'var(--color-destructive)',
}

const mapErrorCodes = (errors: FileRejection['errors']) => {
  return errors
    .map((error) => {
      switch (error.code) {
        case 'file-invalid-type':
          return 'Dateityp nicht erlaubt'
        case 'file-too-large':
          return 'Datei zu groß'
        case 'file-too-small':
          return 'Datei zu klein'
        case 'too-many-files':
          return 'Zu viele Dateien'
        default:
          return 'Unbekannter Fehler'
      }
    })
    .join(', ')
}

export default function ImageDropzone({ handleFile }: { handleFile: (file: File) => void }) {
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    fileRejections,
    inputRef,
  } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    maxSize: 10485760,
    onDrop: (acceptedFiles) => {
      handleFile(acceptedFiles[0])
    },
  })

  const handlePasteFile = async (event: React.ClipboardEvent<HTMLDivElement>) => {
    if (event.clipboardData?.files) {
      ;(inputRef.current as unknown as HTMLInputElement).files = event.clipboardData.files
      inputRef.current?.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject],
  )

  return (
    <div className="container" onPaste={handlePasteFile}>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} multiple={false} autoFocus />
        <div className={'bg-interactive mb-6 p-4 rounded-full'}>
          <RiImageAiLine size={48} />
        </div>
        <p>
          <b>Screenshot von Medikamentenliste</b> auswählen oder per Ctrl+V hinzufügen
        </p>
        <p className={'text-muted-foreground mt-6'}>
          Es können aktuell nur Bilder mit einer maximalen Grösse von 10 MB prozessiert werden.
        </p>
      </div>
      {fileRejections.map(({ file, errors }, index) => (
        <p className={'text-destructive mt-4'} key={index}>
          Datei {file.name} konnte nicht hochgeladen werden: {mapErrorCodes(errors)}
        </p>
      ))}
    </div>
  )
}
