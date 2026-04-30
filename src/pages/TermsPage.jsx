import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] px-4 py-10 text-[#E5E7EB] sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-3xl rounded-2xl border border-white/10 bg-[#111111] p-6 sm:p-8"
      >
        <Link to="/" className="text-sm text-[#9CA3AF] hover:text-white">
          ← Volver
        </Link>

        <h1 className="mt-4 text-2xl font-semibold text-white">Terminos y Condiciones – Moneymachine</h1>
        <p className="mt-4 text-sm text-[#9CA3AF]">Al usar Moneymachine, aceptas los siguientes terminos:</p>

        <section className="mt-6 space-y-4 text-sm text-[#E5E7EB]">
          <div>
            <h2 className="font-semibold text-white">Uso del servicio</h2>
            <p className="mt-1 text-[#9CA3AF]">
              Moneymachine proporciona herramientas para gestion de ventas y cobros. El usuario es responsable del uso correcto del sistema.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-white">Cuenta</h2>
            <p className="mt-1 text-[#9CA3AF]">Eres responsable de mantener la confidencialidad de tu cuenta y credenciales.</p>
          </div>

          <div>
            <h2 className="font-semibold text-white">Pagos</h2>
            <p className="mt-1 text-[#9CA3AF]">
              Los pagos pueden procesarse a traves de terceros. Moneymachine no almacena directamente informacion sensible de tarjetas.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-white">Disponibilidad</h2>
            <p className="mt-1 text-[#9CA3AF]">
              Nos esforzamos por mantener el servicio disponible, pero no garantizamos funcionamiento ininterrumpido.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-white">Limitacion de responsabilidad</h2>
            <p className="mt-1 text-[#9CA3AF]">Moneymachine no se hace responsable por perdidas derivadas del uso del servicio.</p>
          </div>

          <div>
            <h2 className="font-semibold text-white">Modificaciones</h2>
            <p className="mt-1 text-[#9CA3AF]">Podemos actualizar estos terminos en cualquier momento.</p>
          </div>

          <div>
            <h2 className="font-semibold text-white">Contacto</h2>
            <p className="mt-1 text-[#9CA3AF]">
              Para dudas:{' '}
              <a className="text-[#22C55E] underline" href="mailto:contacto@tudominio.com">
                contacto@tudominio.com
              </a>
            </p>
          </div>
        </section>
      </motion.div>
    </div>
  )
}

