import type { MDXComponents } from "mdx/types"

import { cn } from "@/lib/utils"

function Callout({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <aside className="not-prose my-6 rounded-lg border bg-muted/40 px-4 py-3 text-sm">
      {title && <p className="mb-1 font-medium">{title}</p>}
      <div className="text-muted-foreground [&_a]:underline [&_p]:my-1">{children}</div>
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
}
