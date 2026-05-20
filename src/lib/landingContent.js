/** Copy y estructura de la homepage — ES / EN */
export function getLandingContent(isEn) {
  if (isEn) {
    return landingEn
  }
  return landingEs
}

const landingEs = {
  hero: {
    badge: 'POS y gestión de negocio en la nube',
    headline: 'Punto de venta todo-en-uno para restaurantes, comercios y gimnasios',
    subheadline:
      'Cobra, controla inventario, gestiona clientes y revisa tus números desde un solo sistema. Sin Excel, sin apps sueltas ni cuadernos.',
    ctaPrimary: 'Empieza gratis',
    ctaSecondary: 'Ver demo',
    trust: ['7 días gratis', 'Sin tarjeta', 'Listo en minutos', 'Datos en tiempo real'],
    visualLabel: 'Vista del panel MoneyMachine',
  },
  pain: {
    eyebrow: 'El problema',
    title: 'Si tu operación depende de procesos manuales, pierdes dinero todos los días',
    subtitle:
      'Hojas de cálculo, WhatsApp y sistemas que no hablan entre sí generan errores, lentitud y cero visibilidad real.',
    segments: [
      {
        id: 'restaurant',
        title: 'Restaurantes',
        pains: [
          { title: 'Mermas de inventario', text: 'Compras de más, pierdes insumos y no sabes en qué se fue el margen.' },
          { title: 'Errores en comandas', text: 'Pedidos mal capturados entre cocina y mesa cuestan tiempo y clientes.' },
          { title: 'Operación lenta', text: 'Colas en caja y cierres tardíos frenan rotación en horas pico.' },
        ],
      },
      {
        id: 'retail',
        title: 'Comercios',
        pains: [
          { title: 'Stock descontrolado', text: 'Vendes productos que ya no tienes o acumulas mercancía muerta.' },
          { title: 'Cobro lento', text: 'Filas en mostrador y cierres manuales restan ventas al día.' },
          { title: 'Sin visibilidad de ventas', text: 'No sabes qué vende, cuándo ni con qué margen hasta que es tarde.' },
        ],
      },
      {
        id: 'gym',
        title: 'Gimnasios',
        pains: [
          { title: 'Membresías en Excel', text: 'Altas, renovaciones y accesos en hojas que nadie actualiza a tiempo.' },
          { title: 'Pagos que se pierden', text: 'Cobros vencidos sin recordatorio automático = ingresos que no entran.' },
          { title: 'Clientes sin seguimiento', text: 'No ves asistencia, retención ni quién está por cancelar.' },
        ],
      },
    ],
  },
  solution: {
    eyebrow: 'La solución',
    title: 'Un solo sistema para operar, cobrar y crecer',
    subtitle:
      'MoneyMachine reemplaza procesos fragmentados con un flujo conectado: venta → inventario → cliente → reporte.',
    items: [
      {
        problem: 'Datos dispersos',
        solution: 'Todo en un panel',
        text: 'Ventas, stock, clientes y caja sincronizados en laptop y celular.',
      },
      {
        problem: 'Decisiones a ciegas',
        solution: 'Reportes en vivo',
        text: 'Ve ingresos, ticket promedio y productos top sin esperar al cierre.',
      },
      {
        problem: 'Herramientas que no escalan',
        solution: 'POS + gestión integrada',
        text: 'Cobra en mostrador, mesa o recepción sin saltar entre apps.',
      },
    ],
    cta: 'Probar gratis 7 días',
  },
  product: {
    eyebrow: 'Producto',
    title: 'Tu negocio completo en una pantalla',
    subtitle: 'Dashboard en laptop para operar el día. App móvil para cobrar y monitorear desde cualquier lugar.',
    demos: {
      heading: 'Así se ve MoneyMachine en operación real',
      subheading: 'Grabaciones de comercios, restaurantes y gimnasios usando la plataforma — sin mockups.',
      liveBadge: 'En vivo',
      playLabel: 'Reproducir demo',
      items: [
        {
          id: 'retail',
          video: '/assets/video/gif1.mp4',
          poster: '/assets/video/gif1-poster.jpg',
          label: 'Comercios',
          tag: 'TPV, inventario y ventas del día',
          alt: 'Demo de MoneyMachine en una tienda: punto de venta e inventario',
        },
        {
          id: 'restaurant',
          video: '/assets/video/gif2.mp4',
          poster: '/assets/video/gif2-poster.jpg',
          label: 'Restaurantes',
          tag: 'Comandas, cocina y caja conectadas',
          alt: 'Demo de MoneyMachine en restaurante: comandas y operación en cocina',
        },
        {
          id: 'gym',
          video: '/assets/video/gif3.mp4',
          poster: '/assets/video/gif3-poster.jpg',
          label: 'Gimnasios',
          tag: 'Membresías, acceso QR y asistencia',
          alt: 'Demo de MoneyMachine en gimnasio: membresías y control de acceso',
        },
      ],
    },
  },
  features: {
    eyebrow: 'Funciones principales',
    title: 'Todo lo que necesitas para dejar de improvisar',
    subtitle: 'Módulos pensados para operación diaria, no para impresionar en una demo.',
    items: [
      {
        title: 'Punto de venta (TPV)',
        text: 'Cobros rápidos en mostrador, mesa o recepción. Tickets claros y menos errores.',
      },
      {
        title: 'Inventario en tiempo real',
        text: 'Entradas, salidas y alertas de stock. Sabes qué reponer antes de quedarte sin producto.',
      },
      {
        title: 'Clientes y membresías',
        text: 'Historial de compras, suscripciones recurrentes y acceso con QR para gimnasios.',
      },
      {
        title: 'Reportes y caja',
        text: 'Cierres de turno, ventas por periodo y visibilidad para tomar decisiones hoy.',
      },
      {
        title: 'Multi-dispositivo',
        text: 'Opera desde laptop en el negocio y revisa números desde el celular.',
      },
      {
        title: 'Facturación electrónica',
        text: 'Preparado para CFDI (próximamente). Un solo flujo de venta a factura.',
      },
    ],
  },
  results: {
    eyebrow: 'Resultados',
    title: 'Menos fricción. Más control. Mejor margen.',
    items: [
      { stat: '−40%', label: 'menos errores en pedidos', note: 'con comandas digitales' },
      { stat: '2×', label: 'más rápido en caja', note: 'vs. cobro manual' },
      { stat: '100%', label: 'visibilidad de ventas', note: 'en tiempo real' },
      { stat: '1', label: 'solo sistema', note: 'en lugar de 4–5 herramientas' },
    ],
  },
  industries: {
    eyebrow: 'Industrias',
    title: 'Hecho para cómo operas tu negocio',
    subtitle: 'Misma plataforma, flujos adaptados a restaurante, tienda o gimnasio.',
    cards: [
      {
        id: 'restaurant',
        title: 'Restaurantes',
        headline: 'Comandas, cocina y caja conectadas',
        bullets: ['Comandas desde celular', 'Menos errores en cocina', 'Control de mermas'],
        cta: 'Ver planes para restaurantes',
      },
      {
        id: 'retail',
        title: 'Comercios',
        headline: 'Vende más rápido, controla tu stock',
        bullets: ['TPV ágil en mostrador', 'Inventario sincronizado', 'Clientes recurrentes'],
        cta: 'Ver planes para comercios',
      },
      {
        id: 'gym',
        title: 'Gimnasios',
        headline: 'Membresías y accesos sin papeleo',
        bullets: ['Suscripciones automáticas', 'Acceso con QR', 'Control de asistencia'],
        cta: 'Ver planes para gimnasios',
      },
    ],
  },
  testimonials: {
    eyebrow: 'Clientes',
    title: 'Negocios que ya operan con MoneyMachine',
    subtitle: 'Testimonios reales próximamente. Estas son referencias de operación típica.',
    items: [
      {
        quote:
          'Pasamos de cuaderno y Excel a ver ventas del día en el celular. El cierre de caja ya no nos quita una hora.',
        name: 'María G.',
        role: 'Dueña, taquería · CDMX',
      },
      {
        quote:
          'El inventario dejó de ser un dolor. Sabemos qué reponer y dejamos de perder ventas por falta de stock.',
        name: 'Carlos R.',
        role: 'Gerente, boutique · Guadalajara',
      },
      {
        quote:
          'Las membresías y el acceso QR nos ahorraron el caos de listas en recepción. Los cobros recurrentes se pagan solos.',
        name: 'Ana L.',
        role: 'Directora, gimnasio · Monterrey',
      },
    ],
  },
  finalCta: {
    title: 'Deja de operar a ciegas',
    subtitle: 'Prueba MoneyMachine 7 días gratis. Sin tarjeta. Configura tu negocio en minutos.',
    ctaPrimary: 'Crear cuenta gratis',
    ctaSecondary: 'Ver precios',
    note: 'Cancela cuando quieras · Soporte en español',
  },
  pricing: {
    eyebrow: 'Precios',
    title: 'Elige el plan para tu negocio',
    yearlyHint: 'La anualidad te sale más barata a largo plazo.',
    tabs: [
      { id: 'restaurant', label: 'Restaurantes' },
      { id: 'retail', label: 'Comercios' },
      { id: 'gym', label: 'Gimnasios' },
    ],
    cycles: [
      { id: 'monthly', label: 'Mensual' },
      { id: 'yearly', label: 'Anual' },
    ],
    categoryLabel: (type) =>
      type === 'restaurant' ? 'tu restaurante' : type === 'retail' ? 'tu tienda' : 'tu gimnasio',
  },
  footer: {
    tagline: 'POS y gestión de negocio para restaurantes, comercios y gimnasios en México.',
    links: {
      product: 'Producto',
      problems: 'Problemas',
      features: 'Funciones',
      pricing: 'Precios',
      demo: 'Demo',
      solutions: 'Soluciones',
      guides: 'Guías',
      restaurants: 'Restaurantes',
      gyms: 'Gimnasios',
      retail: 'Comercios',
      terms: 'Términos',
      privacy: 'Privacidad',
    },
  },
}

const landingEn = {
  hero: {
    badge: 'Cloud POS & business management',
    headline: 'All-in-one POS for restaurants, retail stores, and gyms',
    subheadline:
      'Run checkout, inventory, customers, and reports from one system. No spreadsheets, scattered apps, or paper logs.',
    ctaPrimary: 'Start free',
    ctaSecondary: 'Watch demo',
    trust: ['7-day free trial', 'No card required', 'Setup in minutes', 'Real-time data'],
    visualLabel: 'MoneyMachine dashboard preview',
  },
  pain: {
    eyebrow: 'The problem',
    title: 'Manual operations leak money every single day',
    subtitle:
      'Spreadsheets, WhatsApp, and disconnected tools create errors, slow service, and zero real visibility.',
    segments: [
      {
        id: 'restaurant',
        title: 'Restaurants',
        pains: [
          { title: 'Inventory shrinkage', text: 'Over-ordering, waste, and no clear view of where margin disappears.' },
          { title: 'Order mistakes', text: 'Miscommunication between floor and kitchen costs time and guests.' },
          { title: 'Slow operations', text: 'Checkout lines and late closings kill turnover at peak hours.' },
        ],
      },
      {
        id: 'retail',
        title: 'Retail',
        pains: [
          { title: 'Poor stock control', text: 'You sell items you do not have—or sit on dead inventory.' },
          { title: 'Slow checkout', text: 'Lines at the counter and manual closes cost daily revenue.' },
          { title: 'No sales visibility', text: 'You only learn what sold, when, and at what margin—too late.' },
        ],
      },
      {
        id: 'gym',
        title: 'Gyms',
        pains: [
          { title: 'Spreadsheet memberships', text: 'Sign-ups, renewals, and access tracked in sheets nobody updates.' },
          { title: 'Missed payments', text: 'Overdue charges without automation mean revenue that never lands.' },
          { title: 'Weak member tracking', text: 'No clear view of attendance, retention, or who is about to churn.' },
        ],
      },
    ],
  },
  solution: {
    eyebrow: 'The solution',
    title: 'One system to run, charge, and grow',
    subtitle:
      'MoneyMachine replaces fragmented workflows with one connected flow: sale → inventory → customer → report.',
    items: [
      {
        problem: 'Scattered data',
        solution: 'One dashboard',
        text: 'Sales, stock, customers, and cash drawer synced on laptop and phone.',
      },
      {
        problem: 'Blind decisions',
        solution: 'Live reports',
        text: 'See revenue, average ticket, and top products without waiting for close.',
      },
      {
        problem: 'Tools that do not scale',
        solution: 'Integrated POS + ops',
        text: 'Charge at counter, table, or front desk without switching apps.',
      },
    ],
    cta: 'Try free for 7 days',
  },
  product: {
    eyebrow: 'Product',
    title: 'Your entire business on one screen',
    subtitle: 'Laptop dashboard for daily ops. Mobile app to charge and monitor from anywhere.',
    demos: {
      heading: 'See MoneyMachine in real operation',
      subheading: 'Screen recordings from retail, restaurants, and gyms—no mockups.',
      liveBadge: 'Live',
      playLabel: 'Play demo',
      items: [
        {
          id: 'retail',
          video: '/assets/video/gif1.mp4',
          poster: '/assets/video/gif1-poster.jpg',
          label: 'Retail',
          tag: 'POS, inventory, and daily sales',
          alt: 'MoneyMachine demo in a store: POS and inventory',
        },
        {
          id: 'restaurant',
          video: '/assets/video/gif2.mp4',
          poster: '/assets/video/gif2-poster.jpg',
          label: 'Restaurants',
          tag: 'Orders, kitchen, and connected checkout',
          alt: 'MoneyMachine demo in a restaurant: orders and kitchen flow',
        },
        {
          id: 'gym',
          video: '/assets/video/gif3.mp4',
          poster: '/assets/video/gif3-poster.jpg',
          label: 'Gyms',
          tag: 'Memberships, QR access, and attendance',
          alt: 'MoneyMachine demo in a gym: memberships and access control',
        },
      ],
    },
  },
  features: {
    eyebrow: 'Core features',
    title: 'Everything you need to stop improvising',
    subtitle: 'Built for daily operations—not demo theater.',
    items: [
      { title: 'Point of sale', text: 'Fast checkout at counter, table, or front desk. Clear tickets, fewer errors.' },
      { title: 'Real-time inventory', text: 'Stock in/out and alerts. Replenish before you run out.' },
      { title: 'Customers & memberships', text: 'Purchase history, recurring billing, and QR access for gyms.' },
      { title: 'Reports & cash control', text: 'Shift closes, period sales, and visibility to decide today.' },
      { title: 'Multi-device', text: 'Run on laptop in-store and check numbers from your phone.' },
      { title: 'E-invoicing', text: 'CFDI-ready workflow (coming soon). One path from sale to invoice.' },
    ],
  },
  results: {
    eyebrow: 'Outcomes',
    title: 'Less friction. More control. Better margin.',
    items: [
      { stat: '−40%', label: 'fewer order errors', note: 'with digital tickets' },
      { stat: '2×', label: 'faster checkout', note: 'vs. manual POS' },
      { stat: '100%', label: 'sales visibility', note: 'in real time' },
      { stat: '1', label: 'single system', note: 'instead of 4–5 tools' },
    ],
  },
  industries: {
    eyebrow: 'Industries',
    title: 'Built for how you actually operate',
    subtitle: 'Same platform, workflows tuned for restaurant, store, or gym.',
    cards: [
      {
        id: 'restaurant',
        title: 'Restaurants',
        headline: 'Tickets, kitchen, and checkout connected',
        bullets: ['Mobile ordering', 'Fewer kitchen errors', 'Shrinkage control'],
        cta: 'View restaurant plans',
      },
      {
        id: 'retail',
        title: 'Retail',
        headline: 'Sell faster, control your stock',
        bullets: ['Fast counter POS', 'Synced inventory', 'Repeat customers'],
        cta: 'View retail plans',
      },
      {
        id: 'gym',
        title: 'Gyms',
        headline: 'Memberships and access without paperwork',
        bullets: ['Auto subscriptions', 'QR access', 'Attendance tracking'],
        cta: 'View gym plans',
      },
    ],
  },
  testimonials: {
    eyebrow: 'Customers',
    title: 'Businesses running on MoneyMachine',
    subtitle: 'Real testimonials coming soon. Typical operational outcomes below.',
    items: [
      {
        quote:
          'We went from notebooks and Excel to seeing today’s sales on our phone. Closing the register no longer takes an hour.',
        name: 'María G.',
        role: 'Owner, taco shop · Mexico City',
      },
      {
        quote:
          'Inventory stopped being a headache. We know what to restock and stopped losing sales to out-of-stock items.',
        name: 'Carlos R.',
        role: 'Manager, boutique · Guadalajara',
      },
      {
        quote:
          'Memberships and QR access ended the front-desk chaos. Recurring charges basically run themselves.',
        name: 'Ana L.',
        role: 'Director, gym · Monterrey',
      },
    ],
  },
  finalCta: {
    title: 'Stop running blind',
    subtitle: 'Try MoneyMachine free for 7 days. No card. Set up your business in minutes.',
    ctaPrimary: 'Create free account',
    ctaSecondary: 'View pricing',
    note: 'Cancel anytime · Support in Spanish',
  },
  pricing: {
    eyebrow: 'Pricing',
    title: 'Choose the plan for your business',
    yearlyHint: 'Yearly billing saves more over time.',
    tabs: [
      { id: 'restaurant', label: 'Restaurants' },
      { id: 'retail', label: 'Retail' },
      { id: 'gym', label: 'Gyms' },
    ],
    cycles: [
      { id: 'monthly', label: 'Monthly' },
      { id: 'yearly', label: 'Yearly' },
    ],
    categoryLabel: (type) =>
      type === 'restaurant' ? 'your restaurant' : type === 'retail' ? 'your store' : 'your gym',
  },
  footer: {
    tagline: 'POS and business management for restaurants, retail, and gyms in Mexico.',
    links: {
      product: 'Product',
      problems: 'Problems',
      features: 'Features',
      pricing: 'Pricing',
      demo: 'Demo',
      solutions: 'Solutions',
      guides: 'Guides',
      restaurants: 'Restaurants',
      gyms: 'Gyms',
      retail: 'Retail',
      terms: 'Terms',
      privacy: 'Privacy',
    },
  },
}
