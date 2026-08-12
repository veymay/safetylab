import Link from "next/link";
import { content } from "@/lib/content";
import { stations, hazards } from "@/lib/environment";
import Logo from "@/components/ui/Logo";

export default function LandingPage() {
  const t = content.landing;
  const allHazards = [...stations.map((s) => s.hazard), ...hazards];

  return (
    <div className="flex flex-1 flex-col bg-white">
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="text-lg font-bold text-brand-navy">SafetyLab</span>
        </div>
        <Link
          href="/training"
          className="rounded-full border border-brand-navy/15 px-5 py-2 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
        >
          {t.ctaStart}
        </Link>
      </header>

      <section className="relative overflow-hidden bg-brand-navy px-6 pb-20 pt-12 text-white sm:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-brand-gold/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-brand-gold/10 blur-3xl"
        />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-gold-light">
            {t.badge}
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">{t.heroTitle}</h1>
          <p className="mt-6 max-w-2xl text-lg text-white/70">{t.heroSubtitle}</p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/training"
              className="rounded-full bg-brand-gold px-8 py-4 text-lg font-semibold text-brand-navy transition-colors hover:bg-brand-gold-light"
            >
              {t.ctaStart}
            </Link>
            <a
              href="#qanday-ishlaydi"
              className="rounded-full border border-white/25 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-white/10"
            >
              {t.ctaHow}
            </a>
          </div>
        </div>

        <div className="relative mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
          {t.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-brand-gold-light sm:text-4xl">{stat.value}</div>
              <div className="mt-1 text-sm text-white/60">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-brand-navy">{t.featuresTitle}</h2>
            <p className="mt-4 text-slate-600">{t.featuresSubtitle}</p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {t.features.map((feature, i) => (
              <div key={feature.title} className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold/15 text-lg font-bold text-brand-gold">
                  {i + 1}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-brand-navy">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="qanday-ishlaydi" className="bg-slate-50 px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-brand-navy">{t.stepsTitle}</h2>

          <div className="mt-12 grid gap-8 sm:grid-cols-4">
            {t.steps.map((step, i) => (
              <div key={step.title} className="relative text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-navy text-lg font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="mt-4 font-semibold text-brand-navy">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-brand-navy">{t.hazardsTitle}</h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {allHazards.map((hazard) => (
              <span
                key={hazard.id}
                className="rounded-full border border-brand-navy/10 bg-white px-5 py-2.5 text-sm font-medium text-brand-navy shadow-sm"
              >
                {hazard.title}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-navy px-6 py-16 text-center text-white sm:px-10">
        <h2 className="text-2xl font-bold sm:text-3xl">{t.finalCtaTitle}</h2>
        <p className="mt-3 text-white/70">{t.finalCtaSubtitle}</p>
        <Link
          href="/training"
          className="mt-8 inline-block rounded-full bg-brand-gold px-8 py-4 text-lg font-semibold text-brand-navy transition-colors hover:bg-brand-gold-light"
        >
          {t.ctaStart}
        </Link>
      </section>

      <footer className="flex items-center justify-center px-6 py-8 text-center text-xs text-slate-400 sm:px-10">
        {t.footerNote}
      </footer>
    </div>
  );
}
