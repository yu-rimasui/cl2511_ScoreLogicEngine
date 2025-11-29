import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../styles/globals.css"
import { GolfProvider } from "./context/GolfContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Golf AI Partner",
  description: "AI Golf Score Analysis",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <GolfProvider>
          {children}
        </GolfProvider>
      </body>
    </html>
  )
}