const steps = [
  {
    step: "01",
    title: "Sign In",
    description: "Choose your role as a Patient or Doctor/Lab and securely log in to the platform.",
  },
  {
    step: "02",
    title: "Upload MRI",
    description: "Upload a brain MRI scan image. Our system accepts standard medical imaging formats.",
  },
  {
    step: "03",
    title: "AI Analysis",
    description: "Our deep learning model processes the image and detects tumour type with a confidence score.",
  },
  {
    step: "04",
    title: "Download Report",
    description: "Get a comprehensive PDF report with diagnosis, confidence level, and preventive measures.",
  },
]

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">How It Works</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Four Simple Steps to Diagnosis
          </h2>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item) => (
            <div key={item.step} className="relative text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                {item.step}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
