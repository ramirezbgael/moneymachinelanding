import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function PrivacyPage() {
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

        <h1 className="mt-4 text-2xl font-semibold text-white">Politica de Privacidad – Moneymachine</h1>
        <p className="mt-4 text-sm text-[#9CA3AF]">
          En Moneymachine valoramos tu privacidad. Esta politica explica que informacion recopilamos, como la usamos y como la protegemos.
        </p>

        <section className="mt-6 space-y-4 text-sm text-[#E5E7EB]">
          <div>
            <h2 className="font-semibold text-white">Informacion que recopilamos</h2>
            <p className="mt-1 text-[#9CA3AF]">
              Recopilamos informacion como nombre, correo electronico, datos de negocio y datos de uso de la plataforma. Tambien podemos recopilar informacion de pagos a traves de proveedores externos.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-white">Uso de la informacion</h2>
            <p className="mt-1 text-[#9CA3AF]">Utilizamos la informacion para:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[#9CA3AF]">
              <li>Proveer y mejorar nuestros servicios</li>
              <li>Procesar pagos</li>
              <li>Comunicarnos contigo</li>
              <li>Analizar el uso de la plataforma</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-white">Comparticion de informacion</h2>
            <p className="mt-1 text-[#9CA3AF]">
              No vendemos tu informacion. Podemos compartirla con terceros como proveedores de pago, servicios en la nube o herramientas de analisis, unicamente para operar el servicio.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-white">Seguridad</h2>
            <p className="mt-1 text-[#9CA3AF]">
              Implementamos medidas de seguridad para proteger tu informacion, incluyendo cifrado y acceso restringido.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-white">Cookies</h2>
            <p className="mt-1 text-[#9CA3AF]">Podemos usar cookies para mejorar la experiencia del usuario.</p>
          </div>

          <div>
            <h2 className="font-semibold text-white">Tus derechos</h2>
            <p className="mt-1 text-[#9CA3AF]">Puedes solicitar acceso, correccion o eliminacion de tus datos en cualquier momento.</p>
          </div>

          <div>
            <h2 className="font-semibold text-white">Contacto</h2>
            <p className="mt-1 text-[#9CA3AF]">
              Si tienes dudas, contactanos en:{' '}
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

