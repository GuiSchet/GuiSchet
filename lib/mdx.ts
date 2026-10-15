import { cacheLife } from "next/cache"
import { compileMDX } from "next-mdx-remote/rsc"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"

import { mdxComponents } from "@/components/mdx-components"

// Cached because syntax highlighting (shiki) reads the clock while it loads, which
// Cache Components rejects during prerendering. The source only changes with a deploy.
export async function renderMDX(source: string) {
  "use cache"
  cacheLife("max")

  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
          [rehypePrettyCode, { theme: { light: "github-light", dark: "github-dark" } }],
        ],
      },
    },
  })
  return content
}

export const proseClassName =
  "prose prose-neutral max-w-none dark:prose-invert prose-headings:scroll-mt-8 prose-headings:font-semibold prose-headings:tracking-tight prose-a:underline-offset-4 prose-code:before:content-none prose-code:after:content-none prose-code:font-normal prose-h2:[&_a]:no-underline prose-h3:[&_a]:no-underline"
