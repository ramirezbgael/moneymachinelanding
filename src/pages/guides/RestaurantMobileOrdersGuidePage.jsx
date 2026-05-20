import { SeoArticlePage } from '../../components/seo/SeoArticlePage'

export default function RestaurantMobileOrdersGuidePage() {
  return (
    <SeoArticlePage
      eyebrow="Guías"
      title="¿Qué sistema usan los restaurantes para tomar pedidos desde el celular?"
      intro="Los restaurantes en México usan sobre todo sistemas POS con app móvil para meseros o comandas QR en mesa, enviando pedidos a cocina en tiempo real. Buscan bajo costo de implementación, interfaz en español, soporte local y que funcione con el WiFi del local sin complicar al equipo."
      metaTitle="Sistema para pedidos desde celular en restaurantes | Guía México"
      metaDescription="Comandas móviles, meseros con celular y cocina en tiempo real: opciones, costos y cómo elegir en México."
      problemTitle="Por qué el papel y el grito a cocina fallan"
      problemBody="En hora pico, cada error de comanda cuesta tiempo, comida devuelta y propina. Meseros que anotan mal o cocina que no leyó el modificador generan fricción con el cliente y estrés interno."
      problemBullets={[
        'Tickets ilegibles o incompletos.',
        'Platos que salen tarde porque se perdió el pedido.',
        'Cuentas mal divididas entre comensales.',
        'Cero trazabilidad de quién tomó qué orden.',
      ]}
      checklistTitle="Flujo ideal: mesero → cocina → caja"
      checklistItems={[
        'Mesero captura orden en celular con menú actualizado.',
        'Cocina recibe comanda al instante (barra, parrilla, postres).',
        'Modificadores claros (sin cebolla, extra queso).',
        'Cuenta ligada a mesa para cerrar rápido en caja.',
        'Ventas e inventario conectados si aplica.',
        'Dueño ve operación en dashboard móvil.',
      ]}
      solutionTitle="Tres enfoques que verás en el mercado"
      solutionBody="POS + app de mesero: el más usado en servicio completo. Tablets fijas en barra: común en cafeterías rápidas. QR en mesa: el comensal ordena; reduce pasos del mesero pero cambia la experiencia. En México, la mayoría de fondas y restaurantes de mesa eligen POS móvil para meseros por control y velocidad."
      solutionNote="MoneyMachine permite comandas desde celular hacia cocina, integrado con caja y reportes. Requiere internet."
      benefitsTitle="Qué preguntar antes de contratar"
      benefits={[
        '¿Funciona offline o solo con internet estable?',
        '¿Cuánto tarda capacitar a un mesero nuevo?',
        '¿Incluye división de cuenta y propina?',
        '¿Se integra con inventario y facturación?',
        '¿Precio en MXN y soporte en español?',
        '¿Puedo probarlo en mi hora pico real?',
      ]}
      faqs={[
        {
          q: '¿Cuánto cuesta un sistema de comandas móviles en México?',
          a: 'Varía por dispositivos, usuarios y funciones. Compara costo mensual total, no solo el precio del módulo de comandas.',
        },
        {
          q: '¿Necesito comprar celulares para cada mesero?',
          a: 'Muchos restaurantes usan celulares del negocio o del mesero con navegador. Define política de dispositivos con tu proveedor.',
        },
        {
          q: '¿Sirve para taquería o solo restaurante formal?',
          a: 'Sirve donde hay volumen y varios productos. En mostrador puro a veces basta TPV simple; con mesas, comanda móvil ayuda mucho.',
        },
        {
          q: '¿Qué pasa si se cae el WiFi?',
          a: 'Los sistemas en nube dependen de conexión. Evalúa red en comedor y cocina antes de implementar.',
        },
        {
          q: '¿MoneyMachine tiene app para meseros?',
          a: 'Sí. Incluye flujo de comandas desde celular hacia cocina, ligado a ventas y operación del restaurante.',
        },
      ]}
      ctaText="Prueba comandas móviles con MoneyMachine 7 días gratis en tu restaurante."
      ctaHref="/register?utm_source=seo&utm_medium=guia&utm_campaign=sistema-pedidos-celular"
      relatedLinks={[
        { label: 'App de pedidos para meseros', href: '/soluciones/app-pedidos-meseros' },
        { label: 'Solución para restaurantes', href: '/soluciones/restaurantes' },
        { label: 'Mejorar tiempos de cobro', href: '/guias/como-mejorar-tiempos-de-cobro-restaurante' },
        { label: 'Sistema POS para restaurantes', href: '/soluciones/sistema-pos-para-restaurantes' },
      ]}
    />
  )
}
