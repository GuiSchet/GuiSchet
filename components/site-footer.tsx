import { site } from "@/lib/site"

export function SiteFooter() {
  return (
    <footer className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t py-8 text-sm text-muted-foreground">
      <span>{site.name}</span>
      <div className="flex gap-4">
        <a href={`mailto:${site.email}`} className="hover:text-foreground">
          Email
        </a>
        <a href={site.discordUrl} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
          Discord
        </a>
        <a href={site.github} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
          GitHub
        </a>
      </div>
    </footer>
  )
}
