import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { ArrowLeftIcon, ArrowUpRightIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { proseClassName, renderMDX } from "@/lib/mdx"
import { getAllWorkshops, getWorkshop } from "@/lib/workshops"

export function generateStaticParams() {
  return getAllWorkshops().map((w) => ({ workshop: w.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<"/workshops/[workshop]">): Promise<Metadata> {
  const { workshop: slug } = await params
  const workshop = getWorkshop(slug)
  if (!workshop) return {}

  return {
    title: workshop.title,
    description: workshop.summary,
    alternates: { canonical: `/workshops/${workshop.slug}` },
    openGraph: {
      type: "article",
      title: workshop.title,
      description: workshop.summary,
      url: `/workshops/${workshop.slug}`,
    },
  }
}

// Same shape as the post page: the back link is static, everything that depends on
// the slug reads `params` inside Suspense.
export default function WorkshopPage({ params }: PageProps<"/workshops/[workshop]">) {
  return (
    <article className="py-6">
      <Link
        href="/talks"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" /> Talks &amp; workshops
      </Link>
      <Suspense fallback={<WorkshopSkeleton />}>
        <WorkshopContent params={params} />
      </Suspense>
    </article>
  )
}

function WorkshopSkeleton() {
  return (
    <div className="mt-6 space-y-3" aria-busy="true">
      <div className="h-4 w-40 rounded bg-muted" />
      <div className="h-7 w-3/4 rounded bg-muted" />
      <div className="h-4 w-full rounded bg-muted" />
    </div>
  )
}

async function WorkshopContent({ params }: Pick<PageProps<"/workshops/[workshop]">, "params">) {
  const { workshop: slug } = await params
  const workshop = getWorkshop(slug)
  if (!workshop) notFound()

  const content = await renderMDX(workshop.body)

  return (
    <div lang={workshop.lang}>
      <header className="mt-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary">Workshop</Badge>
          {workshop.event && <span>{workshop.event}</span>}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-balance">{workshop.title}</h1>
        <p className="text-muted-foreground">{workshop.summary}</p>
        {workshop.links && workshop.links.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {workshop.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 underline underline-offset-4 hover:text-muted-foreground"
              >
                {link.label}
                <ArrowUpRightIcon className="size-3.5" />
              </a>
            ))}
          </div>
        )}
      </header>

      <Separator className="my-8" />

      <div className={proseClassName}>{content}</div>

      <ol className="mt-8 divide-y border-y">
        {workshop.tracks.map((track) => (
          <li key={track.slug}>
            <Link
              href={`/workshops/${workshop.slug}/${track.slug}`}
              prefetch={true}
              className="group flex gap-4 py-4"
            >
              <span className="w-6 shrink-0 font-mono text-sm text-muted-foreground tabular-nums">
                {track.order}
              </span>
              <span>
                <span className="font-medium group-hover:underline group-hover:underline-offset-4">
                  {track.title}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">{track.summary}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
