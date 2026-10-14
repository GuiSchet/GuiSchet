import Link from "next/link"

export default function NotFound() {
  return (
    <section className="py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Not found</h1>
      <p className="mt-2 text-muted-foreground">This page doesn&apos;t exist.</p>
      <Link href="/" className="mt-6 inline-block text-sm underline underline-offset-4">
        Back to posts
      </Link>
    </section>
  )
}
