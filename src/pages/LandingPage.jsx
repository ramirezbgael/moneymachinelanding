import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  ChefHat,
  CheckCircle2,
  Clock3,
  Dumbbell,
  QrCode,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react'
import { MarketingHeader } from '../components/MarketingHeader'
import { LiveDashboardPreview } from '../components/landing/LiveDashboardPreview'
import { useLocale } from '../i18n'
import { HeroMorphVisual } from '../components/landing/HeroMorphVisual'
import { MORPH_ICONS } from '../components/landing/icons'
import { getPlansByBusinessType } from '../lib/pricingPlans'

export default function LandingPage() {
  const { lang, t } = useLocale()
  const [category, setCategory] = useState('restaurant')
  const [sendingOrder, setSendingOrder] = useState(true)
  const [stockShift, setStockShift] = useState(0)
  const [qrValidated, setQrValidated] = useState(false)
  const morphStages = useMemo(
    () =>
      t.heroMorph.map((s, i) => ({
        ...s,
        Icon: MORPH_ICONS[i],
      })),
    [t],
  )
  const categoryTitle = category === 'restaurant' ? 'tu restaurante' : category === 'retail' ? 'tu tienda' : 'tu gym'
  const categoryPlans = useMemo(() => getPlansByBusinessType(category), [category])

  useEffect(() => {
    const orderTimer = setInterval(() => {
      setSendingOrder((prev) => !prev)
    }, 2200)

    const retailTimer = setInterval(() => {
      setStockShift((prev) => (prev + 1) % 3)
    }, 1900)

    const qrTimer = setInterval(() => {
      setQrValidated((prev) => !prev)
    }, 2600)

    return () => {
      clearInterval(orderTimer)
      clearInterval(retailTimer)
      clearInterval(qrTimer)
    }
  }, [])

  return (
    <div className="relative overflow-x-hidden bg-[#05070a] text-[#dce3eb]">
      <MarketingHeader />
      <div className="pointer-events-none absolute inset-0">
        <div className="grid-bg absolute inset-0 opacity-40" />
        <motion.div
          className="absolute -top-36 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,255,159,0.2),transparent_70%)] blur-2xl"
          animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.8, 0.55] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        />
      </div>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-14 pt-6 sm:px-6 lg:px-8">
        <section className="grid gap-6 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:py-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#5ee9b5]">MoneyMachine</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Controla tu negocio
              <span className="block text-[#46f7b4]">como una máquina</span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-[#a5b5c2] sm:text-lg">
              Todo desde tu celular, tan simple como un videojuego: vende más, cobra más rápido y olvídate de los errores.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl bg-[#00ff9f] px-6 py-3 text-sm font-semibold text-[#052014] shadow-[0_0_32px_rgba(0,255,159,0.35)] transition hover:scale-[1.02]"
              >
                Empieza gratis
              </Link>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-medium text-[#d2dee7] backdrop-blur"
              >
                Ver precios
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[440px]">
            <motion.div
              className="pointer-events-none absolute -right-6 -top-8 h-36 w-36 rounded-full bg-[#00ff9f]/10 blur-3xl"
              animate={{ opacity: [0.35, 0.8, 0.35] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <HeroMorphVisual key={lang} stages={morphStages} lang={lang} />
          </div>
        </section>

        <section id="demo" className="mt-10">
          <LiveDashboardPreview />
        </section>

        <section id="funciones" className="mt-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex rounded-full border border-[#00ff9f]/25 bg-[#00ff9f]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#8cffd3]">
              Hecho para tu negocio
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-5xl">
              Un sistema. Tres industrias.
              <span className="block text-[#46f7b4]">Resultados reales.</span>
            </h2>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {[
              {
                title: 'Restaurantes',
                subtitle: 'Toma pedidos desde el celular de tus meseros',
                bullets: ['Comandas digitales', 'Menos errores', 'Mas velocidad'],
                cta: 'Ver planes para restaurantes',
                Icon: UtensilsCrossed,
                badge: 'Mas ventas',
              },
              {
                title: 'Gimnasios',
                subtitle: 'Automatiza accesos y suscripciones',
                bullets: ['QR automatico', 'Pagos recurrentes', 'Control total'],
                cta: 'Ver planes para gimnasios',
                Icon: Dumbbell,
                badge: 'Mas control',
              },
              {
                title: 'Commerce',
                subtitle: 'Controla ventas e inventario sin complicarte',
                bullets: ['TPV rapido', 'Inventario en tiempo real', 'Clientes'],
                cta: 'Ver planes para Commerce',
                Icon: ShoppingBag,
                badge: 'Mas eficiencia',
              },
            ].map((useCase) => (
              <article
                key={useCase.title}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#1b3631] bg-gradient-to-b from-[#0c1419]/95 to-[#060b11] shadow-[0_0_0_1px_rgba(34,197,94,0.06)]"
              >
                <div className="flex-1 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg border border-[#22c55e]/30 bg-[#22c55e]/10 p-1.5">
                        <useCase.Icon className="h-4 w-4 text-[#48f6b4]" />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#59e8b3]">
                        {useCase.title}
                      </p>
                    </div>
                    <span className="rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 px-2 py-0.5 text-[10px] font-semibold text-[#9bffd9]">
                      {useCase.badge}
                    </span>
                  </div>

                  <h3 className="mt-3 text-3xl font-semibold leading-tight text-white">{useCase.subtitle}</h3>

                  <ul className="mt-4 space-y-2 text-sm text-[#d1dee8]">
                    {useCase.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-2">
                        <Check className="h-4 w-4 shrink-0 text-[#00ff9f]" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="#pricing"
                  className="mt-auto flex items-center justify-center gap-2 border-t border-white/[0.08] bg-[#121212] px-4 py-3 text-sm font-medium text-[#e5e7eb] transition group-hover:bg-[#181818]"
                >
                  {useCase.cta}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </a>
              </article>
            ))}
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Ahorra tiempo', text: 'Automatiza tareas y enfocate en lo importante.' },
              { title: 'Vende más', text: 'Toma mejores decisiones con datos reales.' },
              { title: 'Sin errores', text: 'Reduce fallos humanos y perdidas.' },
              { title: 'Siempre contigo', text: 'Accede desde cualquier lugar y dispositivo.' },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-full border border-[#22c55e]/30 bg-[linear-gradient(145deg,rgba(34,197,94,0.16),rgba(12,12,12,0.82))] px-4 py-3 text-center shadow-[0_0_24px_rgba(34,197,94,0.12)] backdrop-blur-xl"
              >
                <div className="flex items-center justify-center gap-2 text-[#9df8d2]">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <p className="text-sm font-semibold">{item.title}</p>
                </div>
                <p className="mt-1 text-xs text-[#c9d7e1]">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-5">
          <div className="grid gap-4 rounded-3xl border border-white/[0.08] bg-[#101010]/92 p-6 backdrop-blur-xl lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#79f2c5]">Operacion restaurante</p>
              <h3 className="mt-2 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                Comanda abierta. Cocina sincronizada.
              </h3>
              <p className="mt-3 max-w-xl text-[#a8b7c4]">
                Tus meseros toman pedidos desde el celular, cocina recibe al instante y caja cobra sin errores.
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-[#141414]/92 p-6">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div className="rounded-xl border border-[#303030] bg-[#191919] p-3">
                  <p className="text-xs text-[#86a0b4]">Mesa 7</p>
                  <p className="mt-1 text-sm text-white">1x Pasta Alfredo</p>
                </div>
                <motion.div
                  animate={{ x: sendingOrder ? [0, 8, 0] : [0, -8, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="rounded-full border border-[#22c55e]/35 bg-[#22c55e]/15 p-2"
                >
                  <ArrowRight className="h-4 w-4 text-[#7bf1c5]" />
                </motion.div>
                <div className="rounded-xl border border-[#303030] bg-[#191919] p-3">
                  <p className="text-xs text-[#86a0b4]">Cocina</p>
                  <p className="mt-1 text-sm text-white">Orden en preparacion</p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-2 text-sm text-[#b9c8d5]">
                <Clock3 className="h-4 w-4" />
                {sendingOrder ? 'Enviando pedido de mesa a cocina...' : 'Pedido enviado. Cocina confirmo recepcion.'}
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm text-[#7bf1c5]">
                <ChefHat className="h-4 w-4" />
                Flujo de comandas activo
              </div>
            </div>
          </div>

          <div className="grid gap-4 rounded-3xl border border-white/[0.08] bg-[#101010]/92 p-6 backdrop-blur-xl lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#79f2c5]">Control Commerce</p>
              <h3 className="mt-2 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                Venta confirmada. Inventario actualizado.
              </h3>
              <p className="mt-3 max-w-xl text-[#a8b7c4]">
                Cada ticket descuenta stock en tiempo real y te ayuda a detectar rapido que producto reponer.
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-[#141414]/92 p-6">
              <div className="space-y-2">
                {[
                  ['Playera Negra', '45'],
                  ['Gorra Logo', '12'],
                  ['Termo Metal', '8'],
                ].map(([product, stock], idx) => (
                  <motion.div
                    key={product}
                    animate={{ borderColor: idx === stockShift ? 'rgba(34,197,94,0.45)' : 'rgba(31,55,70,1)' }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center justify-between rounded-lg border bg-[#191919] px-3 py-2"
                  >
                    <span className="text-sm text-[#d7e3ec]">{product}</span>
                    <motion.span
                      key={`${product}-${stockShift}`}
                      initial={{ opacity: 0.65, y: 2 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm font-semibold text-[#7ef3c7]"
                    >
                      {Number(stock) - (idx === stockShift ? 1 : 0)}
                    </motion.span>
                  </motion.div>
                ))}
              </div>
              <p className="mt-5 text-sm text-[#b9c8d5]">Sincronizando inventario de sucursales...</p>
              <p className="mt-2 text-sm text-[#7bf1c5]">Stock actualizado en todos los puntos</p>
            </div>
          </div>

          <div className="grid gap-4 rounded-3xl border border-white/[0.08] bg-[#101010]/92 p-6 backdrop-blur-xl lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#79f2c5]">Acceso con suscripciones</p>
              <h3 className="mt-2 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                Suscripcion activa. Acceso listo.
              </h3>
              <p className="mt-3 max-w-xl text-[#a8b7c4]">
                Quien tiene suscripcion vigente obtiene un codigo unico. Valida entradas, lleva asistencia y automatiza el acceso.
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-[#141414]/92 p-6">
              <div className="relative mx-auto w-fit rounded-2xl border border-[#303030] bg-[#191919] p-5">
                <QrCode className="h-28 w-28 text-[#6df2c0]" />
                <motion.div
                  className="absolute left-3 right-3 h-1 rounded-full bg-[#64efbc]/80"
                  animate={{ y: [10, 112, 10] }}
                  transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
              <p className="mt-5 text-sm text-[#b9c8d5]">Validando codigo de suscriptor...</p>
              <motion.p
                animate={{ opacity: qrValidated ? 1 : 0.55 }}
                className="mt-2 flex items-center gap-2 text-sm text-[#7bf1c5]"
              >
                <CheckCircle2 className="h-4 w-4" />
                {qrValidated ? 'Acceso validado' : 'Esperando confirmacion del escaneo'}
              </motion.p>
            </div>
          </div>
        </section>

        <section id="pricing" className="mt-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#77f3c3]">
              Planes disenados para tu negocio
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white sm:text-5xl">
              Elige lo ideal
              <span className="block text-[#46f7b4]">para {categoryTitle}</span>
            </h2>
          </div>

          <div className="mx-auto mt-7 flex w-fit flex-wrap rounded-2xl border border-white/10 bg-[#101010]/92 p-1.5">
            {[
              { id: 'restaurant', label: 'Restaurantes' },
              { id: 'retail', label: 'Commerce' },
              { id: 'gym', label: 'Gym' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategory(tab.id)}
                className={`rounded-xl px-5 py-2 text-sm transition ${
                  category === tab.id
                    ? 'border border-[#00ff9f]/40 bg-[#00ff9f]/15 text-[#99ffd8] shadow-[0_0_18px_rgba(0,255,159,0.18)]'
                    : 'border border-transparent bg-transparent text-[#9db0bf]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {categoryPlans.map((plan) => (
              <PricingCard
                key={plan.key}
                name={plan.name}
                price={plan.priceLabel}
                subtitle=""
                bullets={plan.features}
                highlight={plan.key === 'pro'}
                badge={plan.badge ?? ''}
              />
            ))}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Inventario',
                text: 'Nunca te quedes sin producto',
              },
              {
                title: 'Clientes',
                text: 'Vende mas a los que ya te compraron',
              },
              {
                title: 'Suscripciones',
                text: 'Ingresos recurrentes sin esfuerzo',
              },
            ].map((feature) => (
              <article
                key={feature.title}
                className="rounded-[28px] border border-[#22c55e]/30 bg-[linear-gradient(145deg,rgba(34,197,94,0.16),rgba(12,12,12,0.82))] p-4 text-center shadow-[0_0_24px_rgba(34,197,94,0.12)] backdrop-blur-xl"
              >
                <div className="inline-flex items-center justify-center gap-2 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/12 px-2.5 py-1 text-xs text-[#9df8d2]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Resultado real
                </div>
                <h3 className="mt-2 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-1 text-sm text-[#c9d7e1]">{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-5 sm:grid-cols-3">
          {[
            '“Reducimos tiempos de caja y subimos ventas en hora pico.”',
            '“Automatizamos cobros mensuales y recuperamos horas de trabajo.”',
            '“Casi eliminamos errores de captura desde la primera semana.”',
          ].map((quote) => (
            <div key={quote} className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 text-sm text-[#d1dde6] backdrop-blur-xl">
              {quote}
            </div>
          ))}
        </section>

        <footer className="mt-16 rounded-3xl border border-white/[0.1] bg-[linear-gradient(180deg,#121212,#0d0d0d)] p-6 sm:p-8">
          <div className="rounded-2xl border border-white/[0.09] bg-[#151515]/90 p-6 text-center sm:p-8">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">Empieza hoy mismo</h2>
            <Link
              to="/register"
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#00ff9f] px-7 py-3 font-semibold text-[#06160f] shadow-[0_0_24px_rgba(0,255,159,0.22)] transition hover:scale-[1.02]"
            >
              Empieza gratis
            </Link>
            <p className="mt-2 text-sm text-[#a7b4be]">7 dias gratis · Sin tarjeta</p>
          </div>

          <div className="mt-8 grid gap-8 border-t border-white/[0.08] pt-8 lg:grid-cols-[1.2fr_2fr]">
            <div className="text-center lg:text-left">
              <p className="text-lg font-semibold text-white">MoneyMachine</p>
              <p className="mt-2 text-sm text-[#a7b4be]">Controla tu negocio como una maquina</p>
            </div>

            <div className="grid grid-cols-2 gap-6 text-center sm:grid-cols-4 lg:text-left">
              <div>
                <p className="text-sm font-semibold text-white">Producto</p>
                <div className="mt-3 space-y-2 text-sm text-[#a7b4be]">
                  <a href="#funciones" className="block hover:text-white">Funciones</a>
                  <a href="#pricing" className="block hover:text-white">Precios</a>
                  <a href="#demo" className="block hover:text-white">Demo</a>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Negocios</p>
                <div className="mt-3 space-y-2 text-sm text-[#a7b4be]">
                  <a href="#pricing" className="block hover:text-white">Restaurantes</a>
                  <a href="#pricing" className="block hover:text-white">Gimnasios</a>
                  <a href="#pricing" className="block hover:text-white">Commerce</a>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Empresa</p>
                <div className="mt-3 space-y-2 text-sm text-[#a7b4be]">
                  <a href="#contacto" className="block hover:text-white">Contacto</a>
                  <a href="#soporte" className="block hover:text-white">Soporte</a>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Legal</p>
                <div className="mt-3 space-y-2 text-sm text-[#a7b4be]">
                  <a href="/terms" className="block hover:text-white">Terminos</a>
                  <a href="/privacy" className="block hover:text-white">Privacidad</a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/[0.08] pt-4 text-center text-xs text-[#8e9aa4]">
            © 2026 MoneyMachine
          </div>
        </footer>
      </main>
    </div>
  )
}

function PricingCard({ name, price, subtitle = '', bullets, highlight = false, badge = '' }) {
  return (
    <article
      className={`rounded-2xl border p-5 backdrop-blur-xl ${
        highlight
          ? 'border-[#22c55e]/40 bg-gradient-to-br from-[#121212]/95 via-[#101010]/95 to-[#0e1a12]/92 shadow-[0_0_40px_rgba(34,197,94,0.12)]'
          : 'border-white/[0.08] bg-[#121212]/92'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-white">{name}</h3>
        {badge ? (
          <span className="rounded-full border border-[#22c55e]/40 bg-[#22c55e]/15 px-2.5 py-1 text-xs font-medium text-[#92ffd6]">
            {badge}
          </span>
        ) : null}
      </div>
      {subtitle ? <p className="mt-1 text-sm text-[#9fb2c1]">{subtitle}</p> : null}
      <p className="mt-2 text-xl font-semibold text-[#92ffd6]">{price}</p>
      <ul className="mt-4 space-y-2 text-sm text-[#b6c3ce]">
        {bullets.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00ff9f]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <Link
        to="/register"
        className={`mt-5 inline-flex w-full items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
          highlight
            ? 'bg-[#00ff9f] text-[#062016] shadow-[0_0_24px_rgba(0,255,159,0.28)]'
            : 'border border-white/15 bg-white/[0.02] text-[#d9e6ee] hover:border-[#00ff9f]/35'
        }`}
      >
        Empieza gratis
      </Link>
      <p className="mt-2 text-center text-xs text-[#7f92a1]">7 dias gratis · Sin tarjeta</p>
    </article>
  )
}
