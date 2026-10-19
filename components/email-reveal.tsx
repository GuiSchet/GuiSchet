"use client"

import { useState } from "react"
import { MailIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { site } from "@/lib/site"

const decodeEmail = () => atob(site.emailEncoded)

export function EmailButton() {
  const [email, setEmail] = useState<string | null>(null)

  if (!email) {
    return (
      <Button variant="outline" size="sm" onClick={() => setEmail(decodeEmail())}>
        <MailIcon />
        Show email
      </Button>
    )
  }

  return (
    <Button variant="outline" size="sm" nativeButton={false} render={<a href={`mailto:${email}`} />}>
      <MailIcon />
      {email}
    </Button>
  )
}

export function EmailLink() {
  return (
    <button
      type="button"
      onClick={() => (window.location.href = `mailto:${decodeEmail()}`)}
      className="cursor-pointer hover:text-foreground"
    >
      Email
    </button>
  )
}
