import { SeoArticlePage } from '../../components/seo/SeoArticlePage'

export default function RestaurantCheckoutSpeedGuidePage() {
  return (
    <SeoArticlePage
      eyebrow="Guias"
      title="Como mejorar tiempos de cobro en restaurante"
      intro="Si la fila en caja se vuelve cuello de botella, pierdes ventas y experiencia. Esta guia te ayuda a acelerar cobro con cambios operativos simples."
      metaTitle="Mejorar tiempos de cobro en restaurante | Guia"
      metaDescription="Aprende como mejorar tiempos de cobro en restaurante con flujo de venta claro, menos friccion en caja y mejor control operativo."
      problemTitle="Que provoca cobros lentos"
      problemBody="El problema casi siempre es una combinacion de flujo confuso, captura lenta y falta de estandar para el equipo."
      problemBullets={[
        'Pantallas o pasos innecesarios al cobrar.',
        'Productos mal organizados en el catalogo.',
        'Ajustes manuales repetitivos.',
        'Falta de seguimiento por horario pico.',
      ]}
      checklistTitle="Cambios puntuales que si mueven el tiempo de cobro"
      checklistItems={[
        'Simplifica el flujo de cobro en menos pasos.',
        'Ordena productos segun frecuencia de venta.',
        'Estandariza proceso para todo el staff.',
        'Mide tiempo promedio por ticket.',
        'Corrige semanalmente con datos de uso real.',
      ]}
      solutionTitle="Aplicacion practica con MoneyMachine"
      solutionBody="MoneyMachine permite operar ventas con un flujo mas directo y revisar reportes para detectar donde se atora la caja."
      solutionNote="MoneyMachine funciona en la nube, por eso requiere internet."
      benefitsTitle="Impacto operativo esperado"
      benefits={[
        'Menor tiempo promedio de cobro.',
        'Mas tickets atendidos en hora pico.',
        'Menos friccion para el equipo nuevo.',
        'Mejor experiencia en punto de pago.',
        'Mayor visibilidad para ajustar turnos.',
      ]}
      faqs={[
        { q: 'Como medir si realmente mejoro el cobro?', a: 'Usa tiempo promedio por ticket y tickets atendidos por hora en franjas pico.' },
        { q: 'Conviene cambiar todo el flujo de golpe?', a: 'No, funciona mejor ajustar por etapas y medir impacto semana a semana.' },
        { q: 'Que tanto ayuda el catalogo en velocidad?', a: 'Mucho. Un catalogo ordenado reduce clics y errores en captura.' },
        { q: 'MoneyMachine funciona sin internet?', a: 'No. Requiere internet por ser nube.' },
      ]}
      ctaText="Si quieres medir mejora real en cobro, puedes probar MoneyMachine y comparar tiempos por ticket en tu operacion."
      ctaHref="/register"
      relatedLinks={[
        { label: 'Software para restaurantes', href: '/soluciones/software-para-restaurantes-en-mexico' },
        { label: 'Guia para restaurantes pequenos', href: '/guias/pos-para-restaurantes-pequenos' },
      ]}
    />
  )
}
