import Image from "next/image"

import { Contact } from "@/components/contact"
import { PostList } from "@/components/post-list"
import { getAllPosts } from "@/lib/posts"

const external = { target: "_blank", rel: "noopener noreferrer" }
const linkClass = "text-foreground underline underline-offset-4"

export default function HomePage() {
  const posts = getAllPosts()

  return (
    <>
      <section className="space-y-4 py-6">
        <div className="flex items-center gap-4">
          <Image
            src="/avatar.jpg"
            alt="Guille's dachshund in front of a computer"
            width={56}
            height={56}
            priority
            className="size-14 rounded-full border object-cover"
          />
          <h1 className="text-2xl font-semibold tracking-tight">Hi, I&apos;m Guille.</h1>
        </div>
        <p className="text-muted-foreground">
          I&apos;m a Technical Lead for Data &amp; AI Solutions at Flock IT. I also contribute to
          open-source Bitcoin observability projects, supported by a grant from{" "}
          <a href="https://b4os.dev/" {...external} className={linkClass}>
            B4OS
          </a>
          , part of the nonprofit{" "}
          <a href="https://libreriadesatoshi.com/" {...external} className={linkClass}>
            Librería de Satoshi
          </a>
          .
        </p>
        <p className="text-muted-foreground">
          Here I post monthly progress on my projects and the material from the talks and workshops
          I give.
        </p>
        <p className="text-muted-foreground">Feel free to reach out to talk on:</p>
        <Contact />
      </section>
      <section className="pt-8">
        <h2 className="text-sm font-medium text-muted-foreground">Posts</h2>
        <PostList posts={posts} initial={7} />
      </section>
    </>
  )
}
