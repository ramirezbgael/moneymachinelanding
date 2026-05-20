import { SeoArticlePage } from '../../components/seo/SeoArticlePage'

export default function RestaurantCashControlGuidePage() {
  return (
    <SeoArticlePage
      eyebrow="Guias"
      title="Como llevar control de caja en restaurante sin enredarte"
      intro="Controlar caja en restaurante no depende solo de disciplina: depende de tener flujo de cobro claro y registro consistente. Esta guia te da pasos simples para evitar diferencias."
      metaTitle="Control de caja en restaurante | Guia practica"
      metaDescription="Aprende como mejorar control de caja en restaurante con un proceso claro de cobro, cortes y seguimiento diario."
      problemTitle="Por que se descuadra la caja"
      problemBody="La mayoria de diferencias aparecen cuando hay ventas fuera de flujo, cambios sin registro o cortes incompletos."
      problemBullets={[
        'Cobros sin registro en sistema.',
        'Descuentos aplicados sin criterio.',
        'Cortes de caja tardios o incompletos.',
        'Poca visibilidad de movimientos por turno.',
      ]}
      checklistTitle="Pasos para ordenar el proceso"
      checklistItems={[
        'Define un unico flujo de cobro para todo el equipo.',
        'Limita y registra ajustes o descuentos.',
        'Realiza cortes por turno con responsables claros.',
        'Compara ventas registradas vs efectivo al cierre.',
        'Analiza variaciones diarias para corregir rapido.',
      ]}
      solutionTitle="Donde ayuda MoneyMachine"
      solutionBody="MoneyMachine centraliza ventas y reportes para detectar diferencias de caja antes de que se vuelvan recurrentes."
      solutionNote="Como plataforma en la nube, necesita internet para operar y sincronizar."
      benefitsTitle="Que mejora cuando aplicas este control"
      benefits={[
        'Menos diferencias de caja por turno.',
        'Mayor trazabilidad de cobros y ajustes.',
        'Cierre diario mas rapido.',
        'Menos discusiones operativas por faltantes.',
        'Mejor control para crecer con orden.',
      ]}
      faqs={[
        { q: 'Cada cuanto hacer corte de caja?', a: 'Idealmente por turno y siempre al cierre diario.' },
        { q: 'Que hacer si hay diferencias pequenas?', a: 'Registrar, investigar causa y corregir el proceso, no solo absorber la diferencia.' },
        { q: 'Un POS evita todas las diferencias?', a: 'No todas, pero reduce errores de registro y facilita detectarlas mas rapido.' },
        { q: 'MoneyMachine funciona sin internet?', a: 'No. Requiere internet al ser nube.' },
      ]}
      ctaText="Si quieres probar este flujo en tu operacion, puedes probar MoneyMachine y medir mejora en control de caja."
      ctaHref="/register"
      relatedLinks={[
        { label: 'Monitorear caja en tiempo real', href: '/guias/monitorear-caja-tiempo-real' },
        { label: 'Ver ventas desde el celular', href: '/guias/ver-ventas-negocio-celular-tiempo-real' },
        { label: 'Guía para reducir mermas', href: '/guias/como-reducir-mermas-en-restaurante' },
        { label: 'Solución para restaurantes', href: '/soluciones/restaurantes' },
      ]}
    />
  )
}
