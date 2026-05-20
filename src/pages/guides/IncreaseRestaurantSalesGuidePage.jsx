import { SeoArticlePage } from '../../components/seo/SeoArticlePage'

export default function IncreaseRestaurantSalesGuidePage() {
  return (
    <SeoArticlePage
      eyebrow="Guías"
      title="Cómo aumentar ventas en un restaurante sin gastar más en publicidad"
      intro="Para aumentar ventas en un restaurante combina rotación más rápida (menos errores y colas), ticket promedio mayor con ofertas visibles en POS, y control de mermas para proteger margen. No siempre necesitas más clientes: a menudo necesitas vender mejor con la mesa y el turno que ya tienes."
      metaTitle="Cómo aumentar ventas en restaurante | Guía operativa 2026"
      metaDescription="Más ticket, menos fila, menos errores: palancas operativas para vender más en restaurante sin subir costos fijos en México."
      problemTitle="Ventas = rotación × ticket (define tu palanca)"
      problemBody="Si tienes fila en puerta pero mesas lentas, tu palanca es rotación. Si mesas llenas pero ticket bajo, es mix y upsell. Si vendes bien pero margen bajo, son mermas y porciones. Medir sin datos es adivinar."
      problemBullets={[
        'Mesas que se quedan ocupadas esperando cuenta.',
        'Errores de cocina que rehacen platos.',
        'Menú sin empujar lo más rentable.',
        'Hora pico con caja y cocina desincronizadas.',
      ]}
      checklistTitle="9 palancas operativas (sin ads)"
      checklistItems={[
        'Comandas digitales: mesero → cocina sin papel.',
        'Cierre de cuenta más rápido (caja + división clara).',
        'Combos y extras visibles al tomar orden.',
        'Turnos de personal alineados al tráfico real.',
        'Control de mermas en insumos de alta rotación.',
        'Top platillos por hora: prep antes del rush.',
        'Ticket promedio en dashboard diario.',
        'Promos solo en horas valle, no en pico.',
        'Capacitación de 15 min en modificadores de platillos.',
      ]}
      solutionTitle="Tecnología como acelerador (no como magia)"
      solutionBody="Un POS con comandas móviles y reportes en tiempo real no trae clientes nuevos por sí solo: te deja rotar más mesas, cometer menos errores y ver qué plato empujar mañana. MoneyMachine conecta ventas, cocina y caja para que el dueño vea el día desde el celular."
      solutionNote="Requiere internet. Complementa con guías de tiempos de cobro y reducción de mermas."
      benefitsTitle="Qué resultados esperar en 30–60 días"
      benefits={[
        'Menos tiempo muerto entre orden y cobro.',
        'Menos devoluciones por error de comanda.',
        'Decisiones de menú con datos, no con intuición.',
        'Personal más claro en hora pico.',
        'Margen mejor si atacas mermas en paralelo.',
      ]}
      faqs={[
        {
          q: '¿Cuánto puede subir el ticket promedio?',
          a: 'Depende del tipo de local; combos bien puestos suelen mover 5–15% sin subir precios base.',
        },
        {
          q: '¿Necesito delivery para vender más?',
          a: 'No es obligatorio. Muchos locales ganan optimizando salón antes de abrir otro canal.',
        },
        {
          q: '¿Cómo mido rotación de mesas?',
          a: 'Cuenta cubiertos por turno y tiempo promedio de mesa ocupada; un POS ayuda con tickets por hora.',
        },
        {
          q: '¿Qué hago primero si tengo poco presupuesto?',
          a: 'Ordena flujo de cobro y comanda; son cambios de proceso. Luego evalúa POS en prueba gratis.',
        },
        {
          q: '¿MoneyMachine sirve para fondas y taquerías?',
          a: 'Sí, especialmente si hay volumen, mesa o barra con varios productos y necesitas control de caja.',
        },
      ]}
      ctaText="Optimiza operación y ventas: prueba MoneyMachine 7 días gratis."
      ctaHref="/register?utm_source=seo&utm_medium=guia&utm_campaign=aumentar-ventas-restaurante"
      relatedLinks={[
        { label: 'App pedidos para meseros', href: '/soluciones/app-pedidos-meseros' },
        { label: 'Mejorar tiempos de cobro', href: '/guias/como-mejorar-tiempos-de-cobro-restaurante' },
        { label: 'Reducir mermas', href: '/guias/como-reducir-mermas-en-restaurante' },
        { label: 'Ver ventas en tiempo real', href: '/guias/ver-ventas-negocio-celular-tiempo-real' },
      ]}
    />
  )
}
