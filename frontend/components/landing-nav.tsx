"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Image from "next/image";

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
       <Link href="/" className="flex items-center gap-2">
  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary overflow-hidden">
    <Image
      src="/brain-idea-mind-svgrepo-com.svg"
      alt="BrainAI Logo"
      width={36}
      height={36}
      className="object-contain"
      priority
    />
  </div>

  <span className="text-xl font-bold tracking-tight text-foreground">
    Brain<span className="text-primary">AI</span>
  </span>
</Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            How It Works
          </Link>
          <Link href="/login" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Sign In
          </Link>
          <Button asChild>
            <Link href="/login">Get Started</Link>
          </Button>
        </div>

        <button
          type="button"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-foreground">
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            )}
          </svg>
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border/50 bg-background px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link href="#features" className="text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>
              How It Works
            </Link>
            <Button asChild className="w-full">
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
