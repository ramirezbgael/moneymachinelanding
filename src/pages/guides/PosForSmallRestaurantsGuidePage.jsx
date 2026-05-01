import { SeoArticlePage } from '../../components/seo/SeoArticlePage'

export default function PosForSmallRestaurantsGuidePage() {
  return (
    <SeoArticlePage
      eyebrow="Guias"
      title="POS para restaurantes pequenos: como elegir sin sobrepagar"
      intro="Un restaurante pequeno necesita un POS que resuelva operacion, no una suite compleja. Esta guia te ayuda a elegir lo necesario para cobrar, controlar inventario y ver reportes."
      metaTitle="POS para restaurantes pequenos | Guia de eleccion"
      metaDescription="Guia para elegir POS en restaurantes pequenos: funciones clave, errores a evitar y como empezar rapido en Mexico."
      problemTitle="Errores comunes al elegir POS en negocio pequeno"
      problemBody="Muchos equipos compran por moda o por promesa de funciones avanzadas que no usan en el dia a dia."
      problemBullets={[
        'Pagar por modulos que no aportan al flujo principal.',
        'Implementar sin estandarizar proceso de cobro.',
        'No considerar soporte y curva de adopcion del staff.',
        'Elegir sin revisar reportes realmente utiles.',
      ]}
      checklistTitle="Que si deberias priorizar"
      checklistItems={[
        'Cobro simple para operar con rapidez.',
        'Inventario conectado a la venta.',
        'Reportes diarios accionables.',
        'Acceso web para revisar negocio desde celular o laptop.',
        'Costo acorde al volumen del restaurante.',
      ]}
      solutionTitle="Enfoque recomendado con MoneyMachine"
      solutionBody="MoneyMachine esta orientado a operacion real: ventas, inventario y reportes desde navegador para equipos que necesitan velocidad y control."
      solutionNote="Al ser sistema en la nube, necesita internet para operar."
      benefitsTitle="Beneficios para restaurante pequeno"
      benefits={[
        'Arranque mas rapido sin implementaciones pesadas.',
        'Mejor control diario sin aumentar carga administrativa.',
        'Menor riesgo de errores de captura.',
        'Mayor claridad para decidir compras y horarios.',
        'Base ordenada para crecer con proceso.',
      ]}
      faqs={[
        { q: 'Que plan conviene para restaurante pequeno?', a: 'Depende de volumen y flujo, pero prioriza simplicidad de cobro e inventario conectado.' },
        { q: 'Cuanto tiempo tarda el equipo en adoptarlo?', a: 'Si el flujo es claro, la adopcion suele ser rapida en equipos chicos.' },
        { q: 'Se puede usar desde el celular?', a: 'Si, al operar desde navegador puedes consultar y gestionar desde telefono.' },
        { q: 'MoneyMachine funciona sin internet?', a: 'No. Requiere internet al operar en la nube.' },
      ]}
      ctaText="Si quieres validar un POS sin sobrecargar tu operacion, puedes probar MoneyMachine y comparar contra tu proceso actual."
      ctaHref="/register"
      relatedLinks={[
        { label: 'Sistema POS para restaurantes', href: '/soluciones/sistema-pos-para-restaurantes' },
        { label: 'Guia de mermas', href: '/guias/como-reducir-mermas-en-restaurante' },
      ]}
    />
  )
}
