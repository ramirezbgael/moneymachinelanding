import { SeoArticlePage } from '../../components/seo/SeoArticlePage'

export default function MobileSalesRealtimeGuidePage() {
  return (
    <SeoArticlePage
      eyebrow="Guías"
      title="Cómo ver las ventas de tu negocio desde el celular en tiempo real"
      intro="Para ver las ventas de tu negocio en tiempo real desde el celular necesitas que cada cobro se registre en un sistema en la nube y se refleje al instante en una app o dashboard móvil. Así revisas ingresos del día, ticket promedio y métodos de pago sin esperar al cierre de caja ni depender de que alguien te mande un Excel por WhatsApp."
      metaTitle="Ver ventas del negocio en tiempo real desde el celular | Guía 2026"
      metaDescription="Aprende a monitorear ventas, ticket y caja desde tu celular sin esperar al cierre. Pasos, opciones y qué revisar cada día en tu negocio en México."
      problemTitle="Por qué el cierre de caja ya no alcanza"
      problemBody="Si solo ves números al final del día, reaccionas tarde: no puedes corregir turno, promoción o compra de insumos a tiempo. Eso cuesta dinero en restaurantes (hora pico mal gestionada), en tiendas (quiebre de stock) y en gimnasios (baja en renovaciones que nadie detecta)."
      problemBullets={[
        'El dueño no está en el local y opera a ciegas.',
        'Reportes en Excel que llegan desactualizados.',
        'Varios puntos de cobro sin consolidar.',
        'No hay claridad de ticket promedio ni productos top del día.',
      ]}
      checklistTitle="Qué datos debes ver en tiempo real (mínimo viable)"
      checklistItems={[
        'Ventas acumuladas del día (y comparación vs ayer si puedes).',
        'Número de tickets u órdenes cerradas.',
        'Ticket promedio.',
        'Desglose por método de pago (efectivo, tarjeta, transferencia).',
        'Estado de caja: abierta, por turno o cerrada.',
        'Top productos o servicios vendidos (para decidir compras o promos).',
      ]}
      solutionTitle="Tres formas de hacerlo hoy"
      solutionBody="Cuaderno o Excel al cierre: barato pero siempre tarde. App del banco: ves depósitos, no ticket ni inventario. POS en la nube con app móvil: cada venta actualiza el panel al momento; es lo que usan negocios que quieren control sin estar físicamente en el mostrador."
      solutionNote="MoneyMachine sincroniza ventas, pedidos y caja entre laptop y celular. Requiere internet al operar en la nube."
      benefitsTitle="Qué cambia cuando lo ves en vivo"
      benefits={[
        'Detectas caídas de ventas el mismo día, no el lunes.',
        'Menos discusión con encargados: los números son los mismos para todos.',
        'Compras e inventario con base en lo que ya vendiste.',
        'Tranquilidad si tienes varios turnos o un segundo local.',
        'Mejor decisión en promociones y horarios.',
      ]}
      faqs={[
        {
          q: '¿Puedo ver ventas en tiempo real sin estar en el local?',
          a: 'Sí, si tu POS o dashboard está en la nube y tu celular tiene internet. Entras desde el navegador o app y ves los mismos datos que en el negocio.',
        },
        {
          q: '¿Necesito internet en el negocio?',
          a: 'Sí. Los sistemas en la nube registran cada venta online. Sin conexión en el local no se sincroniza en tiempo real.',
        },
        {
          q: '¿Funciona para restaurante, tienda y gimnasio?',
          a: 'Sí. La lógica es la misma: registrar cada cobro o movimiento y reflejarlo en un panel. Cambian los detalles (comandas, stock, membresías).',
        },
        {
          q: '¿Cuánto cuesta un sistema con app móvil en México?',
          a: 'Hay planes desde niveles básicos para un local hasta multi-dispositivo. Conviene comparar precio mensual, usuarios incluidos y si trae inventario y reportes, no solo cobro.',
        },
        {
          q: '¿Se conecta con inventario y caja?',
          a: 'En un stack todo-en-uno sí: la venta descuenta stock y actualiza caja. Si usas herramientas sueltas, sueles reconciliar a mano.',
        },
      ]}
      ctaText="Prueba MoneyMachine 7 días gratis y revisa las ventas de hoy desde tu celular, sin tarjeta."
      ctaHref="/register?utm_source=seo&utm_medium=guia&utm_campaign=ver-ventas-celular"
      relatedLinks={[
        { label: 'Monitorear caja en tiempo real', href: '/guias/monitorear-caja-tiempo-real' },
        { label: 'Dashboard de ventas móvil (solución)', href: '/soluciones/dashboard-ventas-movil-mexico' },
        { label: 'Control de caja en restaurante', href: '/guias/como-llevar-control-de-caja-en-restaurante' },
        { label: 'Ver demo en la homepage', href: '/#demo' },
      ]}
    />
  )
}
