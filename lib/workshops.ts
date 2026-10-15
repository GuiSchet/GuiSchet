import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import { z } from "zod"

// Each workshop is a folder in content/workshops/<slug>/ with an index.mdx (the
// overview) and one NN-<track>.mdx per track. NN sets the order; <track> is the URL.
const WORKSHOPS_DIR = path.join(process.cwd(), "content/workshops")
const TRACK_FILE = /^(\d+)-([a-z0-9-]+)\.mdx$/

const workshopSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  event: z.string().optional(),
  lang: z.string().default("en"),
  links: z
    .array(z.object({ label: z.string(), href: z.url() }))
    .optional(),
})

const trackSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
})

export type Track = z.output<typeof trackSchema> & {
  slug: string
  order: number
  body: string
}

export type Workshop = z.output<typeof workshopSchema> & {
  slug: string
  body: string
  tracks: Track[]
}

function parse<T extends z.ZodType>(schema: T, file: string) {
  const { data, content } = matter(fs.readFileSync(file, "utf8"))
  const parsed = schema.safeParse(data)
  if (!parsed.success) {
    throw new Error(`Invalid frontmatter in ${file}:\n${z.prettifyError(parsed.error)}`)
  }
  return { data: parsed.data as z.output<T>, body: content }
}

function readWorkshop(slug: string): Workshop {
  const dir = path.join(WORKSHOPS_DIR, slug)
  const { data, body } = parse(workshopSchema, path.join(dir, "index.mdx"))
  const tracks = fs
    .readdirSync(dir)
    .flatMap((file) => {
      const match = TRACK_FILE.exec(file)
      if (!match) return []
      const track = parse(trackSchema, path.join(dir, file))
      return [{ ...track.data, slug: match[2], order: Number(match[1]), body: track.body }]
    })
    .sort((a, b) => a.order - b.order)
  return { ...data, slug, body, tracks }
}

export function getAllWorkshops(): Workshop[] {
  if (!fs.existsSync(WORKSHOPS_DIR)) return []
  return fs
    .readdirSync(WORKSHOPS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => readWorkshop(entry.name))
}

export function getWorkshop(slug: string): Workshop | undefined {
  return getAllWorkshops().find((w) => w.slug === slug)
}
