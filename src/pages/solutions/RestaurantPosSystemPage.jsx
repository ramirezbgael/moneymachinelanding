import { SeoArticlePage } from '../../components/seo/SeoArticlePage'

export default function RestaurantPosSystemPage() {
  return (
    <SeoArticlePage
      eyebrow="Soluciones"
      title="Sistema POS para restaurantes: guia practica para elegir en Mexico"
      intro="Si buscas un sistema POS para restaurante, lo clave es que agilice cobro, ordene inventario y te de reportes utiles para decidir rapido. Esta guia resume que revisar antes de contratar."
      metaTitle="Sistema POS para restaurantes en Mexico | Guia practica"
      metaDescription="Aprende que revisar al elegir un sistema POS para restaurante en Mexico: ventas, inventario, reportes y operacion real."
      problemTitle="Problemas que aparecen sin un POS bien implementado"
      problemBody="Muchos restaurantes venden bien pero operan con procesos sueltos. Eso termina en errores acumulados y menos control del dia a dia."
      problemBullets={[
        'Cobros lentos en hora pico.',
        'Errores de captura en pedidos.',
        'Inventario fuera de sincronizacion.',
        'Reportes tardios o poco claros.',
      ]}
      checklistTitle="Checklist minimo para evaluarlo"
      checklistItems={[
        'Flujo de cobro rapido y facil de aprender.',
        'Inventario conectado a cada venta.',
        'Reportes diarios por producto y horario.',
        'Acceso desde navegador en laptop o telefono.',
        'Soporte para operacion en Mexico.',
      ]}
      solutionTitle="Como lo resuelve MoneyMachine sin friccion"
      solutionBody="MoneyMachine conecta ventas, inventario y reportes en un solo flujo para que el equipo opere mas ordenado y con menos errores de captura."
      solutionNote="Importante: MoneyMachine es en la nube y requiere internet para operar."
      benefitsTitle="Resultados operativos que suelen mejorar"
      benefits={[
        'Menor tiempo de cobro por ticket.',
        'Menos diferencias de caja al cierre.',
        'Mejor control de productos de alta rotacion.',
        'Datos mas claros para decidir compras.',
        'Visibilidad remota de la operacion diaria.',
      ]}
      faqs={[
        {
          q: 'Que es un POS para restaurante?',
          a: 'Es un sistema para registrar ventas, cobrar, controlar inventario y consultar reportes desde un flujo unico.',
        },
        {
          q: 'Cuanto tarda implementarlo?',
          a: 'Depende del menu y del proceso actual, pero en equipos pequenos puede arrancar rapido con una configuracion ordenada.',
        },
        {
          q: 'Se puede operar desde telefono?',
          a: 'Si, al correr en navegador puedes consultar operacion desde telefono o laptop con internet.',
        },
        {
          q: 'Funciona sin internet?',
          a: 'No. Al ser nube requiere conexion para operar y sincronizar.',
        },
      ]}
      ctaText="Si quieres validarlo con tu operacion real, puedes probar MoneyMachine y comparar el flujo contra tu proceso actual."
      ctaHref="/register"
      relatedLinks={[
        { label: 'Solucion para restaurantes', href: '/soluciones/restaurantes' },
        { label: 'Guia de control de caja', href: '/guias/como-llevar-control-de-caja-en-restaurante' },
      ]}
    />
  )
}
