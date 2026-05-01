import { SeoArticlePage } from '../../components/seo/SeoArticlePage'

export default function RestaurantWasteReductionGuidePage() {
  return (
    <SeoArticlePage
      eyebrow="Guias"
      title="Como reducir mermas en restaurante con control diario"
      intro="Reducir mermas en restaurante no es solo comprar mejor; es controlar consumo real, ventas e inventario con disciplina corta pero constante."
      metaTitle="Como reducir mermas en restaurante | Guia"
      metaDescription="Guia para reducir mermas en restaurante: control de inventario, rotacion y ajustes de compra con datos diarios."
      problemTitle="Por que suben las mermas"
      problemBody="Cuando no hay visibilidad de consumo por producto, las decisiones se toman tarde y el desperdicio se vuelve normal."
      problemBullets={[
        'Compras sin base en rotacion real.',
        'Inventario con conteos irregulares.',
        'Diferencias entre receta, venta y consumo.',
        'Alertas de reposicion inexistentes o tardias.',
      ]}
      checklistTitle="Acciones practicas para bajar mermas"
      checklistItems={[
        'Identifica productos de alto desperdicio semanal.',
        'Define conteo diario para insumos criticos.',
        'Ajusta compra segun rotacion real.',
        'Separa merma operativa de merma por caducidad.',
        'Da seguimiento semanal con metas claras.',
      ]}
      solutionTitle="Como te apoya MoneyMachine"
      solutionBody="Al vincular ventas e inventario, MoneyMachine permite detectar variaciones mas rapido y ajustar compra con datos de operacion real."
      solutionNote="Requiere internet porque funciona como POS en la nube."
      benefitsTitle="Beneficios de control sostenido"
      benefits={[
        'Menor desperdicio en insumos clave.',
        'Compras mas precisas por semana.',
        'Mejor margen por producto.',
        'Menos urgencias por falta de stock.',
        'Operacion mas predecible.',
      ]}
      faqs={[
        { q: 'Que se considera merma en restaurante?', a: 'Producto perdido por caducidad, manejo, produccion o diferencias contra inventario esperado.' },
        { q: 'Cada cuanto revisar mermas?', a: 'Idealmente diario en insumos criticos y semanal para analisis completo.' },
        { q: 'Se puede reducir merma sin subir precios?', a: 'Si, al mejorar control de compra, rotacion y desperdicio operativo.' },
        { q: 'MoneyMachine funciona sin internet?', a: 'No. Necesita internet para operar y sincronizar.' },
      ]}
      ctaText="Si quieres aplicar este control en tu restaurante, puedes probar MoneyMachine y medir la reduccion de merma en tu flujo real."
      ctaHref="/register"
      relatedLinks={[
        { label: 'Guia de control de caja', href: '/guias/como-llevar-control-de-caja-en-restaurante' },
        { label: 'POS para restaurantes', href: '/soluciones/sistema-pos-para-restaurantes' },
      ]}
    />
  )
}
