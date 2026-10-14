import type { Metadata } from "next"

import { PostList } from "@/components/post-list"
import { getAllPosts } from "@/lib/posts"

export const metadata: Metadata = {
  title: "Talks & workshops",
  description: "Slides, materials and recordings from talks and workshops.",
  alternates: { canonical: "/talks" },
}

export default function TalksPage() {
  const posts = getAllPosts().filter((p) => p.type === "talk" || p.type === "workshop")

  return (
    <section className="py-6">
      <h1 className="text-2xl font-semibold tracking-tight">Talks &amp; workshops</h1>
      <p className="mt-2 text-muted-foreground">
        Materials from the talks and workshops I give.
      </p>
      <div className="pt-6">
        <PostList posts={posts} />
      </div>
    </section>
  )
}
