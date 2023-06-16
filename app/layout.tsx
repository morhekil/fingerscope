import './globals.css'

export const metadata = {
  title: 'Fingerscope',
  viewport:
    'height=device-height, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, target-densitydpi=device-dpi',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white antialiased dark:bg-zinc-900">{children}</body>
    </html>
  )
}
