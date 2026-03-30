import Link from "next/link"
import Image from "next/image";
export function LandingFooter() {
  return (
    <footer className="border-t border-border/50 bg-card px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            {/* <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-primary-foreground">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
            </svg> */}
            <Image
                  src="/brain-idea-mind-svgrepo-com.svg"
                  alt="BrainAI Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                  priority
                />
          </div>
          <span className="text-lg font-bold text-card-foreground">
            Brain<span className="text-primary">AI</span>
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Disclaimer: This tool is for educational and research purposes. Always consult a qualified medical professional.
        </p>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Sign In
          </Link>
          <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Features
          </Link>
        </div>
      </div>
    </footer>
  )
}
