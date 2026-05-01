import { SeoArticlePage } from '../../components/seo/SeoArticlePage'

export default function RestaurantSoftwareMexicoPage() {
  return (
    <SeoArticlePage
      eyebrow="Soluciones"
      title="Software para restaurantes en Mexico: que debe incluir para operar mejor"
      intro="El mejor software para restaurante no es el que tiene mas pantallas, sino el que reduce errores y acelera operacion en caja, inventario y reportes."
      metaTitle="Software para restaurantes en Mexico | MoneyMachine"
      metaDescription="Conoce que debe incluir un software para restaurantes en Mexico para mejorar ventas, inventario y control diario."
      problemTitle="Donde se atora la operacion"
      problemBody="Cuando el software no esta pensado para servicio real, el equipo compensa con procesos manuales y eso genera costos ocultos."
      problemBullets={[
        'Tiempo muerto entre pedido y cobro.',
        'Inventario desordenado por falta de trazabilidad.',
        'Poca claridad para detectar horas o productos rentables.',
        'Dependencia de hojas de calculo para cerrar el dia.',
      ]}
      checklistTitle="Lo que conviene pedir antes de contratar"
      checklistItems={[
        'Proceso de venta simple para staff nuevo.',
        'Sincronizacion entre ventas e inventario.',
        'Reportes accionables, no solo listados.',
        'Acceso web para revisar desde cualquier lugar.',
        'Facilidad de implementacion en negocio pequeno o mediano.',
      ]}
      solutionTitle="Enfoque practico con MoneyMachine"
      solutionBody="MoneyMachine esta diseñado para negocios que quieren operar desde navegador con informacion centralizada y sin depender de procesos sueltos."
      solutionNote="Funciona en la nube y requiere internet para mantener datos en tiempo real."
      benefitsTitle="Ventajas operativas frecuentes"
      benefits={[
        'Cobro mas estable en horarios de alta demanda.',
        'Menos errores en captura de venta.',
        'Inventario mas confiable para reposicion.',
        'Mejor lectura de desempeno diario.',
        'Menos trabajo manual al cierre.',
      ]}
      faqs={[
        {
          q: 'Que diferencia hay entre software local y en la nube?',
          a: 'El local depende de un equipo especifico; en nube accedes desde navegador y centralizas informacion en tiempo real.',
        },
        {
          q: 'Sirve para varios tipos de restaurante?',
          a: 'Si, siempre que el flujo de venta e inventario se configure segun tu operacion.',
        },
        {
          q: 'MoneyMachine es solo para cadenas grandes?',
          a: 'No. Tambien aplica para negocios pequenos y medianos que quieren orden operativo.',
        },
        {
          q: 'Necesita internet?',
          a: 'Si, porque corre en la nube.',
        },
      ]}
      ctaText="Si quieres revisarlo en contexto real, puedes probar MoneyMachine y evaluar si encaja con tu flujo de restaurante."
      ctaHref="/register"
      relatedLinks={[
        { label: 'Sistema POS para restaurantes', href: '/soluciones/sistema-pos-para-restaurantes' },
        { label: 'Guia para mejorar cobros', href: '/guias/como-mejorar-tiempos-de-cobro-restaurante' },
      ]}
    />
  )
}
