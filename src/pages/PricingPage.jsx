import { MarketingHeader } from '../components/MarketingHeader'
import { PricingPlansSection } from '../components/pricing/PricingPlansSection'

export default function PricingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070a] text-[#dce3eb]">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-25" />
      <MarketingHeader />
      <main className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <PricingPlansSection />
      </main>
    </div>
  )
}
