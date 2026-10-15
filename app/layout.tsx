import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { site } from "@/lib/site"
import "./globals.css"

// Everything on this site is content known at build time.
export const ensureStatic = "navigation"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: site.url,
    images: ["/avatar.jpg"],
  },
  twitter: { card: "summary", images: ["/avatar.jpg"] },
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/feed.xml" },
  },
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="mx-auto flex min-h-svh w-full max-w-3xl flex-col px-4 sm:px-6">
            <SiteHeader />
            <main className="flex-1 pb-16">{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
