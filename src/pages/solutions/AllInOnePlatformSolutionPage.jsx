import { SeoArticlePage } from '../../components/seo/SeoArticlePage'

export default function AllInOnePlatformSolutionPage() {
  return (
    <SeoArticlePage
      eyebrow="Solución"
      title="Plataforma todo en uno para administrar tu negocio"
      intro="Una plataforma todo en uno para negocio en México concentra punto de venta, inventario, clientes y reportes en un solo flujo. Dejas de pagar varias apps que no se hablan entre sí, duplicar datos en Excel y descubrir errores solo al cierre del mes."
      metaTitle="Plataforma todo en uno para negocio: POS, inventario y clientes | MoneyMachine"
      metaDescription="Deja de pagar 5 herramientas: una plataforma para vender, controlar stock, clientes y reportes. Para PyMEs en México."
      problemTitle="El costo oculto de las herramientas sueltas"
      problemBody="Muchas PyMEs pagan POS + inventario + facturación + hojas de cálculo + WhatsApp para «reportes». Cada herramienta tiene su verdad; reconciliar toma horas y genera errores que nadie detecta a tiempo."
      problemBullets={[
        'Mismo producto capturado dos veces en sistemas distintos.',
        'Inventario que no baja cuando vendes en mostrador.',
        'Dueño sin dashboard único en el celular.',
        'Costo mensual acumulado de 3–5 suscripciones.',
      ]}
      checklistTitle="Qué debe incluir (y qué puede esperar)"
      checklistItems={[
        'TPV en mostrador, mesa o recepción.',
        'Inventario que se actualiza con cada venta.',
        'Clientes, historial y —en gym— membresías.',
        'Reportes y caja en tiempo real.',
        'Acceso desde laptop (operación) y celular (monitoreo).',
        'Primer mes: domina cobro + un reporte diario; el resto se activa progresivo.',
      ]}
      solutionTitle="Una plataforma, tres giros"
      solutionBody="Restaurante: comandas móviles, cocina y caja. Tienda: stock en vivo y ticket rápido. Gimnasio: membresías, cobros recurrentes y acceso QR. MoneyMachine usa la misma base para los tres sin que cambies de proveedor al crecer."
      solutionNote="Prueba gratis 7 días · Sin tarjeta · Planes en MXN. Requiere internet (nube)."
      benefitsTitle="ROI: menos herramientas, menos errores"
      benefits={[
        'Un solo login para dueño y equipo.',
        'Menos capacitación (un flujo, no cinco).',
        'Datos consistentes para compras y personal.',
        'Menor costo total que stack fragmentado.',
        'Escalable si abres otro punto de venta.',
      ]}
      faqs={[
        {
          q: '¿Reemplaza mi contador o facturación externa?',
          a: 'Centraliza operación diaria (ventas, stock, clientes). La facturación CFDI completa está en roadmap; hoy el foco es operar y vender con control.',
        },
        {
          q: '¿Puedo usar solo inventario sin POS?',
          a: 'El valor máximo está en venta + inventario conectados. Cobrar en mostrador sin registrar ventas deja el stock incompleto.',
        },
        {
          q: '¿Sirve si tengo restaurante y otro negocio?',
          a: 'Puedes evaluar planes por giro. La plataforma está pensada para restaurante, comercio o gimnasio con módulos acordes.',
        },
        {
          q: '¿Cuánto tarda la implementación?',
          a: 'Negocios pequeños suelen arrancar en días: catálogo, usuarios y capacitación básica de caja.',
        },
        {
          q: '¿Cómo se compara con usar Square + Excel?',
          a: 'Un todo-en-uno evita exportar ventas para inventario. Si buscas alternativas a Square en México, tenemos guía comparativa dedicada.',
        },
      ]}
      ctaText="Unifica tu operación: empieza gratis con MoneyMachine hoy."
      ctaHref="/register?utm_source=seo&utm_medium=solucion&utm_campaign=plataforma-todo-en-uno"
      relatedLinks={[
        { label: 'Alternativas a Square en México', href: '/soluciones/alternativas-square-mexico' },
        { label: 'Dashboard de ventas móvil', href: '/soluciones/dashboard-ventas-movil-mexico' },
        { label: 'Mejor app inventario tienda pequeña', href: '/guias/mejor-app-inventario-tienda-pequena-mexico' },
        { label: 'Ver precios', href: '/pricing' },
      ]}
    />
  )
}
