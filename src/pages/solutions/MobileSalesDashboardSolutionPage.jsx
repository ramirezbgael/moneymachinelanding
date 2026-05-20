import { SeoArticlePage } from '../../components/seo/SeoArticlePage'

export default function MobileSalesDashboardSolutionPage() {
  return (
    <SeoArticlePage
      eyebrow="Solución"
      title="Dashboard de ventas móvil para tu negocio en México"
      intro="Un dashboard de ventas móvil en México te muestra ingresos, pedidos y estado de caja en tiempo real desde el celular, sincronizado con lo que ocurre en mostrador o recepción. Es la forma práctica de dejar de operar a ciegas cuando no puedes estar todo el día en el local."
      metaTitle="Dashboard de ventas móvil para negocios en México | MoneyMachine"
      metaDescription="Monitorea ventas, pedidos y caja desde el celular. Dashboard en tiempo real para dueños de restaurantes, tiendas y gimnasios en México."
      problemTitle="El problema de no tener visibilidad móvil"
      problemBody="Dueños de PyME en México suelen delegar el día a día pero siguen responsables del resultado. Sin panel en el celular, dependes de mensajes, fotos de tickets o cortes tardíos. Eso retrasa decisiones y facilita errores."
      problemBullets={[
        'No sabes si hoy va bien hasta que cierran.',
        'Varios canales de cobro sin consolidar.',
        'Encargados con versiones distintas de la verdad.',
        'Imposible actuar en hora pico o en quiebre de stock.',
      ]}
      checklistTitle="Qué incluye un buen dashboard móvil"
      checklistItems={[
        'Ventas del día actualizadas al instante.',
        'Ticket promedio y volumen de operaciones.',
        'Estado de caja y turnos.',
        'Vista coherente en laptop (operación) y celular (monitoreo).',
        'Datos útiles para restaurante, tienda o gimnasio.',
        'Acceso seguro con usuario dueño o gerente.',
      ]}
      solutionTitle="Cómo lo resuelve MoneyMachine"
      solutionBody="MoneyMachine concentra POS, inventario, clientes y reportes en una plataforma. El equipo cobra y opera desde laptop en el negocio; tú monitoreas ventas y caja desde el celular con la misma información, sin exportar hojas de cálculo."
      solutionNote="Prueba gratis 7 días · Sin tarjeta · Configuración en minutos. Requiere internet."
      benefitsTitle="Resultados que buscan los dueños"
      benefits={[
        'Control remoto sin microgestionar en piso.',
        'Menos sorpresas en el cierre de caja.',
        'Decisiones el mismo día (compras, personal, promos).',
        'Un solo sistema en lugar de apps sueltas.',
        'Escalable si abres otro punto de venta.',
      ]}
      faqs={[
        {
          q: '¿Qué veo exactamente en el dashboard móvil?',
          a: 'Ventas del día, métricas clave como ticket y pedidos, y estado operativo de caja según tu giro. La vista se alinea con lo que registra tu POS.',
        },
        {
          q: '¿Sirve para restaurante, tienda y gimnasio?',
          a: 'Sí. MoneyMachine adapta flujos por industria: comandas y mesa en restaurante, inventario en tienda, membresías y acceso en gimnasio.',
        },
        {
          q: '¿Necesito comprar hardware especial?',
          a: 'Operas desde navegador en laptop y celular con internet. No dependes de una terminal cerrada propietaria.',
        },
        {
          q: '¿Puedo probarlo antes de pagar?',
          a: 'Sí. Hay prueba de 7 días sin tarjeta para validar con tu operación real.',
        },
        {
          q: '¿Cómo se relaciona con facturación CFDI?',
          a: 'La facturación electrónica está en roadmap. Hoy el foco es ventas, caja, inventario y monitoreo en tiempo real.',
        },
      ]}
      ctaText="Empieza gratis y abre tu dashboard de ventas hoy desde el celular."
      ctaHref="/register?utm_source=seo&utm_medium=solucion&utm_campaign=dashboard-movil"
      relatedLinks={[
        { label: 'Guía: ver ventas en tiempo real', href: '/guias/ver-ventas-negocio-celular-tiempo-real' },
        { label: 'Guía: monitorear caja en vivo', href: '/guias/monitorear-caja-tiempo-real' },
        { label: 'Solución para restaurantes', href: '/soluciones/restaurantes' },
        { label: 'Ver demo interactiva', href: '/#demo' },
      ]}
    />
  )
}
