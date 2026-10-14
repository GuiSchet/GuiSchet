import Link from "next/link"

import { ThemeToggle } from "@/components/theme-toggle"
import { site } from "@/lib/site"

const nav = [
  { href: "/", label: "Posts" },
  { href: "/talks", label: "Talks" },
]

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between py-8">
      <Link href="/" className="font-semibold tracking-tight">
        {site.name}
      </Link>
      <nav className="flex items-center gap-4 text-sm text-muted-foreground">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} className="hover:text-foreground">
            {item.label}
          </Link>
        ))}
        <ThemeToggle />
      </nav>
    </header>
  )
}
