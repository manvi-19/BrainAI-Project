import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function LandingHero() {
  return (
    <section className="relative overflow-hidden px-6 py-24 md:py-32 lg:py-40">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/5" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-accent/5" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-6 border-primary/20 bg-primary/10 text-primary">
            AI-Powered Medical Analysis
          </Badge>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Detect Brain Tumours with{" "}
            <span className="text-primary">Precision AI</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Upload MRI scans and get instant AI-powered analysis with tumour classification,
            confidence scores, and downloadable medical reports. Built for patients and healthcare professionals.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/login">Start Analysis</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
              <Link href="#how-it-works">Learn More</Link>
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="mx-auto mt-20 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">98.5%</p>
            <p className="mt-1 text-sm text-muted-foreground">Detection Accuracy</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">{"< 30s"}</p>
            <p className="mt-1 text-sm text-muted-foreground">Analysis Time</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">4 Types</p>
            <p className="mt-1 text-sm text-muted-foreground">Tumour Classification</p>
          </div>
        </div>
      </div>
    </section>
  )
}
