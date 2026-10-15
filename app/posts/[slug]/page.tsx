import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { ArrowLeftIcon, ArrowUpRightIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { proseClassName, renderMDX } from "@/lib/mdx"
import { formatDate, getAllPosts, getPost, typeLabel } from "@/lib/posts"

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps<"/posts/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/posts/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      publishedTime: post.date,
      url: `/posts/${post.slug}`,
    },
  }
}

// The back link is shared by every post, so it stays in the App Shell. Everything that
// depends on the slug reads `params` inside Suspense; links to posts use prefetch={true}
// so that part is prefetched (it's static) and the fallback is rarely seen.
export default function PostPage({ params }: PageProps<"/posts/[slug]">) {
  return (
    <article className="py-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" /> All posts
      </Link>
      <Suspense fallback={<PostSkeleton />}>
        <PostContent params={params} />
      </Suspense>
    </article>
  )
}

function PostSkeleton() {
  return (
    <div className="mt-6 space-y-3" aria-busy="true">
      <div className="h-4 w-40 rounded bg-muted" />
      <div className="h-7 w-3/4 rounded bg-muted" />
      <div className="h-4 w-full rounded bg-muted" />
    </div>
  )
}

async function PostContent({ params }: Pick<PageProps<"/posts/[slug]">, "params">) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const content = await renderMDX(post.body)

  return (
    <>
      <header className="mt-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <Badge variant="secondary">{typeLabel[post.type]}</Badge>
          {post.event && <span>{post.event}</span>}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-balance">{post.title}</h1>
        <p className="text-muted-foreground">{post.summary}</p>
        {post.links && post.links.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {post.links.map((link) => (
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
    </>
  )
}
