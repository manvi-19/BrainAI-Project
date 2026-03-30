import { LandingHero } from "@/components/landing-hero"
import { LandingFeatures } from "@/components/landing-features"
import { LandingHowItWorks } from "@/components/landing-how-it-works"
import { LandingFooter } from "@/components/landing-footer"
import { LandingNav } from "@/components/landing-nav"

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <LandingNav />
      <LandingHero />
      <LandingFeatures />
      <LandingHowItWorks />
      <LandingFooter />
    </main>
  )
}
