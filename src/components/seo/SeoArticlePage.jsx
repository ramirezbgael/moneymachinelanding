import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MarketingHeader } from '../MarketingHeader'

/**
 * @param {{
 *  title: string,
 *  eyebrow: string,
 *  intro: string,
 *  metaTitle?: string,
 *  metaDescription?: string,
 *  problemTitle: string,
 *  problemBody: string,
 *  problemBullets: string[],
 *  checklistTitle: string,
 *  checklistItems: string[],
 *  solutionTitle: string,
 *  solutionBody: string,
 *  solutionNote: string,
 *  benefitsTitle: string,
 *  benefits: string[],
 *  faqs: Array<{q: string, a: string}>,
 *  ctaText: string,
 *  ctaHref: string,
 *  relatedLinks?: Array<{label: string, href: string}>,
 * }} props
 */
export function SeoArticlePage(props) {
  const {
    title,
    eyebrow,
    intro,
    metaTitle,
    metaDescription,
    problemTitle,
    problemBody,
    problemBullets,
    checklistTitle,
    checklistItems,
    solutionTitle,
    solutionBody,
    solutionNote,
    benefitsTitle,
    benefits,
    faqs,
    ctaText,
    ctaHref,
    relatedLinks = [],
  } = props

  useEffect(() => {
    if (metaTitle) document.title = metaTitle
    if (metaDescription) {
      let meta = document.querySelector('meta[name="description"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', 'description')
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', metaDescription)
    }
  }, [metaTitle, metaDescription])

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#05070a] text-[#dce3eb]">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-25" />
      <MarketingHeader />
      <main className="relative z-10 mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <article className="rounded-3xl border border-white/10 bg-[#0d1117]/95 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.45)] sm:p-8">
          <p className="inline-flex rounded-full border border-[#00ff9f]/30 bg-[#00ff9f]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#95ffd8]">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">{title}</h1>
          <p className="mt-4 text-[#b5c5d1]">{intro}</p>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-white">{problemTitle}</h2>
            <p className="mt-3 text-[#a9bbc8]">{problemBody}</p>
            <ul className="mt-4 space-y-2 text-[#d4e0e8]">
              {problemBullets.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-white">{checklistTitle}</h2>
            <ol className="mt-4 space-y-2 text-[#d4e0e8]">
              {checklistItems.map((item, idx) => (
                <li key={item}>
                  {idx + 1}. {item}
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-white">{solutionTitle}</h2>
            <p className="mt-3 text-[#a9bbc8]">{solutionBody}</p>
            <p className="mt-3 text-[#9fefc8]">{solutionNote}</p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-white">{benefitsTitle}</h2>
            <ul className="mt-4 space-y-2 text-[#d4e0e8]">
              {benefits.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-white">Preguntas frecuentes</h2>
            <div className="mt-4 space-y-4">
              {faqs.map((item) => (
                <div key={item.q} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <h3 className="font-medium text-white">{item.q}</h3>
                  <p className="mt-2 text-sm text-[#a9bbc8]">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-[#00ff9f]/25 bg-[#00ff9f]/8 p-5">
            <p className="text-sm text-[#d5f8ea]">{ctaText}</p>
            <Link
              to={ctaHref}
              className="mt-4 inline-flex rounded-xl border border-[#00ff9f]/70 bg-transparent px-4 py-2.5 text-sm font-semibold text-[#9affde] transition-all duration-300 hover:bg-[#00ff9f] hover:text-[#052014] hover:shadow-[0_0_24px_rgba(0,255,159,0.3)]"
            >
              Probar MoneyMachine
            </Link>
          </section>

          {relatedLinks.length ? (
            <section className="mt-8 border-t border-white/10 pt-6">
              <h2 className="text-lg font-semibold text-white">Contenido relacionado</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {relatedLinks.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-[#cfe0ea] transition hover:border-[#00ff9f]/35 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </article>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </div>
  )
}
