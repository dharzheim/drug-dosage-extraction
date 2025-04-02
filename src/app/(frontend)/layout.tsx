import React from 'react'
import './globals.css'

export const metadata = {
  description: 'A tool to display drug dosage information',
  title: 'Drug Dosage Extraction',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className="m-12">
        <main>{children}</main>
      </body>
    </html>
  )
}
