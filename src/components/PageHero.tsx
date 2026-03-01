'use client'

interface PageHeroProps {
  title: string
  subtitle?: string
}

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#14171d] pb-14 pt-32 text-white md:pb-16 md:pt-36">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.08)_0,transparent_45%),radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.14),transparent_35%)]" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-serif font-semibold uppercase tracking-[0.05em] md:text-6xl">{title}</h1>
          {subtitle ? <p className="mt-5 text-base leading-relaxed text-white/78 md:text-lg">{subtitle}</p> : null}
        </div>
      </div>
    </section>
  )
}
