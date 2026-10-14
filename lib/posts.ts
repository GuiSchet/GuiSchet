import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import { z } from "zod"

const POSTS_DIR = path.join(process.cwd(), "content/posts")

const frontmatterSchema = z.object({
  title: z.string().min(1),
  // YAML parses unquoted dates into Date objects; normalize back to YYYY-MM-DD.
  date: z.union([
    z.iso.date(),
    z.date().transform((d) => d.toISOString().slice(0, 10)),
  ]),
  summary: z.string().min(1),
  type: z.enum(["update", "talk", "workshop"]),
  project: z.string().optional(),
  event: z.string().optional(),
  links: z
    .array(z.object({ label: z.string(), href: z.url() }))
    .optional(),
  tags: z.array(z.string()).optional(),
  draft: z.boolean().optional(),
})

export type PostType = z.output<typeof frontmatterSchema>["type"]

export type Post = z.output<typeof frontmatterSchema> & {
  slug: string
  body: string
}

function readPost(file: string): Post {
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8")
  const { data, content } = matter(raw)
  const parsed = frontmatterSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error(`Invalid frontmatter in ${file}:\n${z.prettifyError(parsed.error)}`)
  }
  return { ...parsed.data, slug: file.replace(/\.mdx$/, ""), body: content }
}

export function getAllPosts(): Post[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map(readPost)
    .filter((p) => !p.draft || process.env.NODE_ENV === "development")
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug)
}

export const typeLabel: Record<PostType, string> = {
  update: "Update",
  talk: "Talk",
  workshop: "Workshop",
}

export function formatDate(date: string): string {
  // Dates are calendar days; format in UTC so the day never shifts.
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
}
