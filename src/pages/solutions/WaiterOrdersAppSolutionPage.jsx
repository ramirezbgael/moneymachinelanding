import { SeoArticlePage } from '../../components/seo/SeoArticlePage'

export default function WaiterOrdersAppSolutionPage() {
  return (
    <SeoArticlePage
      eyebrow="Solución"
      title="App de pedidos para meseros: comandas desde el celular a cocina"
      intro="Una app de pedidos para meseros envía comandas del celular directo a cocina en tiempo real, reduce errores de papel y acelera el cierre de cuenta. Es la pieza operativa que más impacto da en restaurantes de mesa durante la hora pico en México."
      metaTitle="App para pedidos de meseros | Comandas a cocina | MoneyMachine"
      metaDescription="App de comandas para meseros: menos errores, cocina al instante y cierre de cuenta más rápido. Para restaurantes en México."
      problemTitle="El dolor de operar sin comanda digital"
      problemBody="Papel, notas a mano y gritos a cocina funcionan hasta que el volumen sube. Ahí aparecen platos equivocados, tiempos muertos y clientes que esperan la cuenta demasiado."
      problemBullets={[
        'Errores al transcribir orden a cocina.',
        'Meseros caminando de más al punto de comandas.',
        'Cuentas que no cuadran con lo servido.',
        'Dueño sin visibilidad de mesas activas.',
      ]}
      checklistTitle="Cómo funciona el flujo con MoneyMachine"
      checklistItems={[
        'Mesero abre mesa y toma orden en celular.',
        'Cocina ve ticket digital al instante.',
        'Modificadores y notas claras por platillo.',
        'Cuenta lista para cobrar en caja o móvil.',
        'Venta registrada para reportes del día.',
        'Dueño monitorea desde dashboard móvil.',
      ]}
      solutionTitle="Beneficios medibles en operación"
      solutionBody="Restaurantes que digitalizan comandas suelen bajar errores de cocina, rotar mesas más rápido y cerrar turnos con menos discusión en caja. El equipo aprende en minutos si el menú está bien configurado."
      solutionNote="Incluido en planes de restaurante según nivel. Prueba 7 días sin tarjeta."
      benefitsTitle="Para qué tipo de restaurante conviene"
      benefits={[
        'Fonda o restaurante de mesa con varios meseros.',
        'Taquería con servicio en mesa y alto volumen.',
        'Bar o cantina con comida y bebidas.',
        'Cafetería grande con servicio a mesa.',
        'Cualquier operación con cocina separada del mostrador.',
      ]}
      faqs={[
        {
          q: '¿Necesito una app instalada desde la tienda?',
          a: 'Puedes operar desde navegador en celular del negocio. Consulta compatibilidad con tu proveedor.',
        },
        {
          q: '¿La cocina necesita pantalla?',
          a: 'Recomendable: tablet o monitor con vista de comandas. También puede verse en laptop de cocina.',
        },
        {
          q: '¿Se integra con inventario?',
          a: 'En MoneyMachine la venta puede reflejarse en inventario según tu configuración de productos.',
        },
        {
          q: '¿Funciona con QR en mesa además de meseros?',
          a: 'Puedes combinar estrategias; esta landing enfoca el flujo con meseros móviles.',
        },
        {
          q: '¿Cuánto tarda implementarlo?',
          a: 'Con menú definido, muchos locales arrancan en 1–2 días de configuración y prueba en servicio real.',
        },
      ]}
      ctaText="Prueba comandas para meseros gratis 7 días en tu restaurante."
      ctaHref="/register?utm_source=seo&utm_medium=solucion&utm_campaign=app-pedidos-meseros"
      relatedLinks={[
        { label: 'Guía: pedidos desde celular', href: '/guias/sistema-pedidos-restaurante-celular' },
        { label: 'Solución para restaurantes', href: '/soluciones/restaurantes' },
        { label: 'Mejorar tiempos de cobro', href: '/guias/como-mejorar-tiempos-de-cobro-restaurante' },
        { label: 'POS para taquerías', href: '/soluciones/pos-para-taquerias' },
      ]}
    />
  )
}
