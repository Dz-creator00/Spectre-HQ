import './globals.css'

export const metadata = {
  title: 'Spectre-HQ',
  description: 'Financial Management Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
