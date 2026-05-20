import { SeoArticlePage } from '../../components/seo/SeoArticlePage'

export default function SquareAlternativesSolutionPage() {
  return (
    <SeoArticlePage
      eyebrow="Comparativa"
      title="Alternativas a Square en México para tu negocio"
      intro="Alternativas a Square en México incluyen POS locales con inventario integrado, reportes en español, planes en MXN y flujos para restaurante, tienda o gimnasio. Square funciona bien para cobro simple; muchos negocios cambian cuando necesitan operación completa, facturación local y monitoreo desde el celular."
      metaTitle="Alternativas a Square en México (POS, comisiones y facturación)"
      metaDescription="Compara alternativas a Square para restaurantes y tiendas: inventario, reportes, soporte en español y plataforma todo en uno en México."
      problemTitle="Por qué los negocios buscan salir de Square"
      problemBody="No es que Square sea «malo»: es que muchas PyMEs en México superan lo que ofrece para su día a día. Cuando el dolor es inventario, comandas, membresías o visibilidad del dueño, un POS generalista queda corto."
      problemBullets={[
        'Inventario y reportes limitados para retail serio.',
        'Facturación CFDI no es el foco principal del stack.',
        'Comisiones por transacción que suman con volumen.',
        'Operación de restaurante con mesa poco profunda.',
        'Soporte y flujos pensados más para mercado US.',
      ]}
      checklistTitle="Tabla mental: qué comparar antes de cambiar"
      checklistItems={[
        'Precio mensual total (no solo el terminal).',
        '¿Inventario en tiempo real con cada venta?',
        '¿Comandas / meseros o solo mostrador?',
        '¿Membresías y acceso (si eres gym)?',
        '¿Dashboard móvil para el dueño?',
        '¿Facturación electrónica México (CFDI) en roadmap o incluida?',
        '¿Contrato, soporte y onboarding en español?',
      ]}
      solutionTitle="MoneyMachine vs Square: cuándo conviene cada uno"
      solutionBody="Square puede bastar si solo cobras ocasionalmente con poco catálogo. MoneyMachine conviene si operas restaurante con mesa, tienda con stock que no puede quiebrar, o gimnasio con membresías — y quieres ventas, caja e inventario en un solo panel, con monitoreo desde el celular."
      solutionNote="Honestidad: evalúa tu volumen de transacciones y costo de comisiones vs suscripción fija. Prueba MoneyMachine 7 días sin tarjeta antes de migrar."
      benefitsTitle="Cómo migrar sin perder el control"
      benefits={[
        'Exporta catálogo y clientes si tu proveedor actual lo permite.',
        'Configura menú o productos en MoneyMachine en paralelo.',
        'Corre un día piloto en horario bajo antes del corte total.',
        'Capacita caja y encargado con un solo flujo nuevo.',
        'Mantén Square activo solo hasta validar el primer cierre limpio.',
      ]}
      faqs={[
        {
          q: '¿MoneyMachine cobra comisión por transacción?',
          a: 'Revisa planes en la página de precios: el modelo es suscripción según giro y nivel, no el modelo típico por swipe de Square.',
        },
        {
          q: '¿Tiene facturación CFDI?',
          a: 'Está en roadmap. Hoy el foco es POS, inventario, clientes, caja y reportes en tiempo real.',
        },
        {
          q: '¿Necesito hardware de Square?',
          a: 'No. Operas desde navegador en laptop y celular con internet; usa terminal de tarjeta que ya tengas según tu adquirente.',
        },
        {
          q: '¿Puedo usar ambos en paralelo?',
          a: 'Sí durante transición; no es ideal a largo plazo por datos duplicados.',
        },
        {
          q: '¿Hay alternativas además de MoneyMachine?',
          a: 'Sí: Loyverse, Clip, Toast (restaurantes grandes), entre otras. Compara según tu giro; esta página destaca el stack todo-en-uno de MoneyMachine.',
        },
      ]}
      ctaText="Empieza gratis 7 días — valida si es mejor fit que Square para tu operación."
      ctaHref="/register?utm_source=seo&utm_medium=solucion&utm_campaign=alternativas-square"
      relatedLinks={[
        { label: 'Plataforma todo en uno', href: '/soluciones/plataforma-todo-en-uno-negocio' },
        { label: 'Mejor app inventario tienda', href: '/guias/mejor-app-inventario-tienda-pequena-mexico' },
        { label: 'Dashboard ventas móvil', href: '/soluciones/dashboard-ventas-movil-mexico' },
        { label: 'Ver precios', href: '/pricing' },
      ]}
    />
  )
}
