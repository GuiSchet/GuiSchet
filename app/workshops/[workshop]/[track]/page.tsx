import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { proseClassName, renderMDX } from "@/lib/mdx"
import { getAllWorkshops, getWorkshop } from "@/lib/workshops"

export function generateStaticParams() {
  return getAllWorkshops().flatMap((w) =>
    w.tracks.map((t) => ({ workshop: w.slug, track: t.slug })),
  )
}

export async function generateMetadata({
  params,
}: PageProps<"/workshops/[workshop]/[track]">): Promise<Metadata> {
  const { workshop: workshopSlug, track: trackSlug } = await params
  const workshop = getWorkshop(workshopSlug)
  const track = workshop?.tracks.find((t) => t.slug === trackSlug)
  if (!workshop || !track) return {}

  const url = `/workshops/${workshop.slug}/${track.slug}`
  return {
    title: `${track.title} · ${workshop.title}`,
    description: track.summary,
    alternates: { canonical: url },
    openGraph: { type: "article", title: track.title, description: track.summary, url },
  }
}

export default function TrackPage({ params }: PageProps<"/workshops/[workshop]/[track]">) {
  return (
    <article className="py-6">
      <Suspense fallback={<TrackSkeleton />}>
        <TrackContent params={params} />
      </Suspense>
    </article>
  )
}

function TrackSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true">
      <div className="h-4 w-40 rounded bg-muted" />
      <div className="h-7 w-3/4 rounded bg-muted" />
      <div className="h-4 w-full rounded bg-muted" />
    </div>
  )
}

async function TrackContent({
  params,
}: Pick<PageProps<"/workshops/[workshop]/[track]">, "params">) {
  const { workshop: workshopSlug, track: trackSlug } = await params
  const workshop = getWorkshop(workshopSlug)
  const index = workshop?.tracks.findIndex((t) => t.slug === trackSlug) ?? -1
  if (!workshop || index === -1) notFound()

  const track = workshop.tracks[index]
  const prev = workshop.tracks[index - 1]
  const next = workshop.tracks[index + 1]
  const base = `/workshops/${workshop.slug}`
  const content = await renderMDX(track.body)

  return (
    <div lang={workshop.lang}>
      <Link
        href={base}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" /> {workshop.title}
      </Link>

      <header className="mt-6 space-y-3">
        <p className="font-mono text-xs text-muted-foreground">
          Track {track.order} / {workshop.tracks.at(-1)?.order}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-balance">{track.title}</h1>
        <p className="text-muted-foreground">{track.summary}</p>
      </header>

      <Separator className="my-8" />

      <div className={proseClassName}>{content}</div>

      <nav className="mt-12 grid grid-cols-2 gap-4 border-t pt-6 text-sm">
        {prev ? (
          <Link href={`${base}/${prev.slug}`} prefetch={true} className="group">
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <ArrowLeftIcon className="size-3.5" /> {prev.order}
            </span>
            <span className="mt-1 block font-medium group-hover:underline group-hover:underline-offset-4">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`${base}/${next.slug}`} prefetch={true} className="group text-right">
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              {next.order} <ArrowRightIcon className="size-3.5" />
            </span>
            <span className="mt-1 block font-medium group-hover:underline group-hover:underline-offset-4">
              {next.title}
            </span>
          </Link>
        )}
      </nav>
    </div>
  )
}
