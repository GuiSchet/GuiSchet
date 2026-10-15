import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { formatDate, typeLabel, type Post } from "@/lib/posts"

// With `initial`, only the first N posts are shown and the rest sit behind a native
// <details> toggle, so the page stays static with no client JavaScript.
export function PostList({ posts, initial }: { posts: Post[]; initial?: number }) {
  if (posts.length === 0) {
    return <p className="text-sm text-muted-foreground">Nothing here yet.</p>
  }

  const visible = initial ? posts.slice(0, initial) : posts
  const hidden = initial ? posts.slice(initial) : []

  return (
    <>
      <PostItems posts={visible} />
      {hidden.length > 0 && (
        <details className="group/more">
          <summary className="cursor-pointer list-none border-t py-4 text-sm text-muted-foreground hover:text-foreground group-open/more:hidden [&::-webkit-details-marker]:hidden">
            Show {hidden.length} more {hidden.length === 1 ? "post" : "posts"}
          </summary>
          <div className="border-t">
            <PostItems posts={hidden} />
          </div>
        </details>
      )}
    </>
  )
}

function PostItems({ posts }: { posts: Post[] }) {
  return (
    <ul className="divide-y">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/posts/${post.slug}`} prefetch={true} className="group block py-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <Badge variant="secondary">{typeLabel[post.type]}</Badge>
              {post.event && <span>{post.event}</span>}
            </div>
            <h3 className="mt-2 font-medium group-hover:underline group-hover:underline-offset-4">
              {post.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{post.summary}</p>
          </Link>
        </li>
      ))}
    </ul>
  )
}
