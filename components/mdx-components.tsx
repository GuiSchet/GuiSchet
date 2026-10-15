import type { MDXComponents } from "mdx/types"

import { cn } from "@/lib/utils"

function Callout({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <aside className="not-prose my-6 rounded-lg border bg-muted/40 px-4 py-3 text-sm">
      {title && <p className="mb-1 font-medium">{title}</p>}
      <div className="text-muted-foreground [&_a]:underline [&_li]:my-0.5 [&_p]:my-1 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </aside>
  )
}

function Stats({ children }: { children: React.ReactNode }) {
  return <div className="not-prose my-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{children}</div>
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border px-3 py-2">
      <div className="text-lg font-semibold tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  )
}

// A labelled step in a workshop track (e.g. "Pregunta", "Probá", "Mirá", "Por qué").
// Stays inside the prose styles so code blocks and lists render as usual.
function Step({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="my-6 border-l-2 pl-4 [&>:nth-child(2)]:mt-0 [&>:last-child]:mb-0">
      <p className="not-prose mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {children}
    </section>
  )
}

export const mdxComponents: MDXComponents = {
  a: ({ href = "", ...props }) => {
    const external = /^https?:\/\//.test(href)
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...props}
      />
    )
  },
  table: ({ className, ...props }) => (
    <div className="overflow-x-auto">
      <table className={cn("text-sm", className)} {...props} />
    </div>
  ),
  Callout,
  Stats,
  Stat,
  Step,
}
