import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { formatDate, typeLabel, type Post } from "@/lib/posts"

export function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return <p className="text-sm text-muted-foreground">Nothing here yet.</p>
  }

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
