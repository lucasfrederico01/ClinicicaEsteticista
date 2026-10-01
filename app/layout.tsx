import type { Metadata } from "next"
import localFont from "next/font/local"
import { clinic } from "@/lib/content"
import "./globals.css"
const serif = localFont({
  src: [
    {
      path: "./fonts/cormorant-garamond-latin-wght-normal.woff2",
      weight: "300 700",
      style: "normal",
    },
    {
      path: "./fonts/cormorant-garamond-latin-wght-italic.woff2",
      weight: "300 700",
      style: "italic",
    },
  ],
  variable: "--font-editorial",
  display: "swap",
})
const sans = localFont({
  src: "./fonts/manrope-latin-wght-normal.woff2",
  variable: "--font-body",
  display: "swap",
})
const title = "Dra. Gisele Nasário | Harmonização Facial e Corporal em Curitiba"
const description =
  "Tratamentos personalizados de harmonização facial e corporal em Curitiba, com planejamento individualizado, técnica e naturalidade."
export const metadata: Metadata = {
  title,
  description,
  ...(clinic.siteUrl
    ? { metadataBase: new URL(clinic.siteUrl), alternates: { canonical: "/" } }
    : { robots: { index: false, follow: false } }),
  openGraph: {
    title,
    description,
    locale: "pt_BR",
    type: "website",
    images: [
      { url: "/images/dra1.webp", width: 1440, height: 1920, alt: clinic.name },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/dra1.webp"],
  },
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
