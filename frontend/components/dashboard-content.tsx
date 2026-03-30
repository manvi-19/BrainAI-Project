"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MriUpload } from "@/components/mri-upload"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image";

export function DashboardContent() {
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()
  const [showUpload, setShowUpload] = useState(true)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  const handleSignOut = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Nav */}
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


          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role === "doctor" ? "Doctor / Lab" : "Patient"}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {user.role === "doctor" ? "Patient MRI Analysis" : "Upload Your MRI Scan"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {user.role === "doctor"
              ? "Upload patient MRI scans for AI-powered tumour detection and analysis."
              : "Upload your brain MRI scan to get an AI-powered analysis report."}
          </p>
        </div>

        {showUpload && (
          <MriUpload
            userName={user.name}
            userEmail={user.email}
            userRole={user.role}
          />
        )}
      </main>
    </div>
  )
}
