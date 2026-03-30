"use client"

import { Suspense } from "react"
import { DashboardContent } from "@/components/dashboard-content"

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
