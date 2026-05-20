# MoneyMachine — Estrategia de contenido SEO, AEO y conversión

**Mercado:** PyMEs en México (restaurantes, comercios, gimnasios)  
**Producto:** POS + gestión todo-en-uno (inventario, dashboard móvil, comandas QR, membresías, cobros automáticos, facturación CFDI)  
**Objetivos:** Ranking Google · Visibilidad en búsqueda con IA · Intención de compra · Demos / registros

**Convenciones de URL (alineadas al proyecto):**
| Tipo | Ruta | Uso |
|------|------|-----|
| Pilar comercial | `/soluciones/[slug]` | BOFU, categoría, comparativas |
| Landing SEO | `/soluciones/landing/[slug]` | Keywords transaccionales fuertes |
| Guía AEO | `/guias/[slug]` | Preguntas, how-to, IA |
| Hub | `/soluciones`, `/guias` | Distribución de autoridad |

**Plantilla de página:** `SeoArticlePage.jsx` — respuesta directa en párrafo 1, FAQ + JSON-LD, CTA a `/register`.

---

## 1. Arquitectura de clusters

### Cluster A — Visibilidad y control en tiempo real (transversal)
**Pilar:** Dashboard y monitoreo móvil  
**Página pilar sugerida:** `/soluciones/dashboard-ventas-movil-mexico` (landing)  
**Soporte:**
- `/guias/ver-ventas-negocio-celular-tiempo-real` ← keyword prioritaria
- `/guias/monitorear-caja-tiempo-real`
- `/guias/como-llevar-control-de-caja-en-restaurante` ✅ ya existe
- Enlazar desde homepage `#demo` y hero

**Dolor central:** Operar a ciegas hasta el cierre; no saber si la caja cuadra hoy.

---

### Cluster B — Restaurantes (eficiencia + pedidos + ventas)
**Pilar:** `/soluciones/restaurantes` ✅  
**Soporte existente:** POS taquerías, cafeterías, control caja, mermas, tiempos de cobro ✅  
**Nuevos:**
- `/guias/sistema-pedidos-restaurante-celular`
- `/guias/como-aumentar-ventas-restaurante`
- `/soluciones/app-pedidos-meseros` (landing BOFU)
- `/soluciones/landing/sistema-pos-restaurantes-mexico` ✅

**Dolor central:** Errores en comanda, cola en caja, mermas, rotación lenta.

---

### Cluster C — Retail / inventario
**Pilar:** `/soluciones/comercios` (crear si no existe; hoy retail está en homepage)  
**Soporte:**
- `/guias/como-controlar-inventario-negocio` ✅
- `/guias/mejor-app-inventario-tienda-pequena-mexico`
- `/guias/evitar-quiebres-stock-tienda`

**Dolor central:** Vender sin stock, mercancía muerta, sin reportes.

---

### Cluster D — Gimnasios (membresías + cobros)
**Pilar:** `/soluciones/sistema-membresias-gym-mexico` (landing nueva)  
**Soporte:**
- `/guias/automatizar-cobro-mensualidades-gimnasio`
- `/guias/control-asistencia-acceso-qr-gimnasio`
- `/guias/reducir-morosidad-membresias-gym`

**Dolor central:** Excel de membresías, pagos vencidos, acceso manual.

---

### Cluster E — Comparativas y decisión de compra (BOFU)
**Pilar:** `/soluciones/mejor-pos-mexico-2026` (landing)  
**Soporte:**
- `/soluciones/alternativas-square-mexico`
- `/guias/pos-para-restaurantes-pequenos` ✅
- `/soluciones/plataforma-todo-en-uno-negocio`
- Tabla comparativa: MoneyMachine vs Square vs Clip vs Loyverse vs Toast (donde aplique)

**Dolor central:** Demasiadas herramientas; miedo a elegir mal; costos ocultos.

---

### Cluster F — Local SEO México
**Oportunidades (páginas ligeras o secciones en landings):**
- `software POS Ciudad de México` → `/soluciones/pos-cdmx`
- `sistema restaurantes Guadalajara` → `/soluciones/pos-guadalajara`
- `punto de venta Monterrey` → `/soluciones/pos-monterrey`
- Incluir: zonas de servicio, tipos de negocio locales, CTA demo, schema `LocalBusiness` si hay oficina física

**Táctica:** No crear 50 ciudades de golpe; 3 hubs + mención “México” en todas las páginas pilares.

---

## 2. Matriz rápida: prioridad estratégica

| Keyword | Intención compra | Facilidad ranking | IA / AEO | Formato recomendado |
|---------|------------------|-------------------|----------|---------------------|
| ver ventas celular tiempo real | Media-alta | ★★★★ Alta | ★★★★★ | Guía |
| monitorear caja tiempo real | Alta | ★★★★ | ★★★★★ | Guía |
| aumentar ventas restaurante | Media | ★★★ | ★★★★ | Guía |
| automatizar cobro mensualidades gym | Alta | ★★★★ | ★★★★★ | Guía |
| sistema pedidos restaurante celular | Alta | ★★★ | ★★★★ | Guía + landing meseros |
| mejor app inventario tienda pequeña méxico | Alta | ★★★ | ★★★★ | Guía comparativa |
| alternativas square mexico | Muy alta | ★★ | ★★★ | Landing comparativa |
| mejor pos mexico 2026 | Muy alta | ★★ | ★★★ | Landing BOFU |
| plataforma todo en uno negocio | Muy alta | ★★ | ★★★ | Landing pilar |
| sistema membresías gym mexico | Muy alta | ★★★ | ★★★★ | Landing |
| app pedidos meseros | Muy alta | ★★★ | ★★★ | Landing |
| dashboard ventas movil mexico | Alta | ★★★★ | ★★★★★ | Landing |

**Quick wins (publicar primero):** ver ventas celular, monitorear caja, dashboard ventas móvil, automatizar mensualidades gym, app pedidos meseros.  
**Mayor intención de compra:** mejor pos méxico 2026, alternativas square, plataforma todo en uno, sistema membresías gym, app pedidos meseros.  
**Mejor para IA:** preguntas en forma natural (cómo/cuál/qué) + FAQ schema + párrafo respuesta de 40–60 palabras al inicio.

---

## 3. Briefs por keyword prioritaria

---

### KW-01: cómo puedo ver las ventas de mi negocio desde mi celular en tiempo real

| Campo | Contenido |
|-------|-----------|
| **SEO title** | Cómo ver las ventas de tu negocio en tiempo real desde el celular \| Guía 2026 |
| **Meta description** | Aprende a monitorear ventas, ticket y caja desde tu celular sin esperar al cierre. Pasos, apps y qué revisar cada día en tu negocio en México. |
| **Slug** | `/guias/ver-ventas-negocio-celular-tiempo-real` |
| **Intención** | Informacional → comercial (dueño busca solución inmediata) |
| **Dolor** | Cierra el día sin saber si ganó; depende del encargado; Excel desactualizado |

**Outline**
- **H1:** Cómo ver las ventas de tu negocio desde el celular en tiempo real
- **H2:** Por qué el cierre de caja ya no es suficiente
- **H2:** Qué datos debes ver en tiempo real (ventas, ticket, métodos de pago, top productos)
- **H3:** Restaurante vs tienda vs gimnasio — qué cambia
- **H2:** 3 formas de hacerlo hoy (cuaderno/Excel, app de banco, POS en la nube)
- **H2:** Checklist: elegir un sistema de monitoreo móvil
- **H2:** Errores comunes (WiFi, no capacitar staff, no cerrar turnos)
- **H2:** Preguntas frecuentes

**CTAs**
- Primario: «Prueba MoneyMachine 7 días — ve tus ventas hoy en el celular»
- Secundario: Enlace a `/soluciones/dashboard-ventas-movil-mexico`
- Lead magnet: Checklist PDF «5 números que debes revisar antes de las 10 p.m.»

**Enlaces internos**
- → monitorear caja, control de caja restaurante, dashboard ventas móvil, homepage `#demo`
- ← desde landing restaurantes, inventario, pricing

**Screenshots**
- Dashboard móvil con ventas del día
- Gráfica de ventas por hora
- Notificación «caja abierta» / cierre de turno

**Menciones MoneyMachine**
- Bloque «Respuesta rápida» párrafo 1
- Caso: dueño revisa ventas en Uber entre sucursales
- Tabla comparativa simple vs Excel

**FAQ schema**
1. ¿Puedo ver ventas en tiempo real sin estar en el local?  
2. ¿Necesito internet en el negocio?  
3. ¿Funciona para restaurante y tienda?  
4. ¿Cuánto cuesta un sistema con app móvil en México?  
5. ¿Se conecta con inventario y caja?

**Resumen AEO (40–60 palabras)**  
Para ver las ventas de tu negocio en tiempo real desde el celular necesitas un POS o dashboard en la nube que sincronice cada cobro al instante. Revisa ventas del día, ticket promedio y métodos de pago sin esperar al cierre. En México, plataformas como MoneyMachine muestran esos datos en app móvil y laptop con la misma información.

**Social**
- Carrusel: «5 señales de que operas a ciegas»
- Reel: dueño revisa ventas en el celular durante la comida
- LinkedIn: «El dueño que solo ve números el domingo pierde dinero el martes»

**YouTube**
- «Monitoreo de ventas desde el celular en 5 minutos (demo real)»
- Short: antes/después Excel vs dashboard en vivo

---

### KW-02: monitorear caja tiempo real

| Campo | Contenido |
|-------|-----------|
| **SEO title** | Cómo monitorear la caja en tiempo real (sin sorpresas al cerrar) |
| **Meta description** | Control de caja en vivo: fondos, cortes, diferencias y alertas. Guía para restaurantes, tiendas y negocios en México. |
| **Slug** | `/guias/monitorear-caja-tiempo-real` |
| **Intención** | Informacional / operativa → comercial |
| **Dolor** | Faltantes de caja, turnos sin supervisión, efectivo «que no cuadra» |

**Outline**
- **H1:** Cómo monitorear la caja de tu negocio en tiempo real
- **H2:** Qué significa «caja en tiempo real» (no es solo ver el banco)
- **H2:** Señales de alerta antes del robo o el error
- **H3:** Apertura, movimientos, retiros, cierre por turno
- **H2:** Monitoreo remoto para dueños con varios locales
- **H2:** Caja + ventas + inventario: por qué deben estar conectados
- **H2:** Implementación en 48 horas
- **H2:** FAQ

**CTAs:** Demo «Ve tu caja en vivo hoy» · Enlace guía control caja restaurante ✅

**Enlaces internos:** ver ventas celular, control caja restaurante ✅, mejor pos méxico

**Screenshots:** Pantalla caja abierta/cerrada, reporte diferencias, multi-turno

**FAQ:** ¿Puedo ver la caja sin estar en el local? · ¿Cómo evito que el cajero cierre mal? · ¿Qué pasa si se va el internet?

**AEO:** Monitorear la caja en tiempo real implica registrar cada venta, retiro y cierre de turno en un sistema POS conectado a la nube, visible desde celular o laptop. Así detectas diferencias el mismo día, no al final del mes.

**Social:** «Tu cajero cerró $800 de menos — ¿te enteraste hoy o el lunes?»  
**YouTube:** «Cierre de caja en 3 minutos vs 45 minutos con Excel»

---

### KW-03: aumentar ventas restaurante

| Campo | Contenido |
|-------|-----------|
| **SEO title** | Cómo aumentar ventas en tu restaurante (operación, no solo marketing) |
| **Meta description** | Más ticket, menos fila, menos errores: 9 palancas operativas para vender más en restaurante sin subir costos fijos. |
| **Slug** | `/guias/como-aumentar-ventas-restaurante` |
| **Intención** | Informacional (amplio) → nurturing |
| **Dolor** | Mesas lentas, pedidos mal, no saben qué plato empujar |

**Outline**
- **H1:** Cómo aumentar ventas en un restaurante sin gastar más en ads
- **H2:** Ventas = rotación × ticket (define tus palancas)
- **H2:** Acelera el servicio (comandas digitales, menos ida y vuelta a cocina)
- **H2:** Sube el ticket promedio con datos (combos, upsell en POS)
- **H2:** Reduce mermas = margen real (enlace guía mermas ✅)
- **H2:** Horas pico: personal y caja listos
- **H2:** Mide lo que vendes cada día (dashboard)
- **H2:** FAQ

**CTAs:** «Optimiza operación con MoneyMachine» · guías tiempos de cobro ✅, mermas ✅

**Enlaces:** pedidos celular, app meseros, soluciones restaurantes

**AEO:** Para aumentar ventas en restaurante combina rotación más rápida (menos errores y colas), ticket promedio mayor con combos visibles en POS, y control de mermas. La tecnología acelera comandas y da datos para decidir menú y horarios.

**Social:** «No necesitas más likes, necesitas menos errores en cocina»  
**YouTube:** «3 cambios operativos que suben ventas en 30 días»

---

### KW-04: cómo automatizar el cobro de mensualidades en un gimnasio

| Campo | Contenido |
|-------|-----------|
| **SEO title** | Cómo automatizar el cobro de mensualidades en un gimnasio (México) |
| **Meta description** | Deja Excel y cobros manuales: suscripciones recurrentes, recordatorios y acceso automático para gimnasios en México. |
| **Slug** | `/guias/automatizar-cobro-mensualidades-gimnasio` |
| **Intención** | Informacional → alta compra (gimnasios) |
| **Dolor** | Morosidad, persecución de pagos, listas desactualizadas |

**Outline**
- **H1:** Cómo automatizar el cobro de mensualidades en tu gimnasio
- **H2:** Cuánto te cuesta cobrar manualmente (horas + morosidad)
- **H2:** Qué debe hacer un sistema de membresías automático
- **H3:** Suscripción recurrente, recordatorios, bloqueo de acceso
- **H2:** Pagos en México (tarjeta, transferencia, efectivo en recepción)
- **H2:** Integrar acceso QR con membresía activa
- **H2:** Migrar desde Excel en una semana
- **H2:** FAQ

**CTAs:** «Prueba plan gimnasio MoneyMachine» · landing sistema membresías

**Enlaces:** sistema membresías gym, plataforma todo en uno, pricing gym tab

**Screenshots:** Panel membresías vencidas, cobro recurrente, acceso QR

**FAQ:** ¿Puedo cobrar anualidades? · ¿Qué pasa si falla el pago? · ¿El cliente puede pausar?

**AEO:** Automatizar mensualidades en un gimnasio requiere un sistema con suscripciones recurrentes, avisos de pago vencido y control de acceso ligado al estatus. Así reduces morosidad y dejas de perseguir cobros por WhatsApp.

**Social:** «El gym que cobra en Excel pierde 15–20% de ingresos al año»  
**YouTube:** «Configura cobros automáticos de membresía paso a paso»

---

### KW-05: qué sistema usan los restaurantes para tomar pedidos desde el celular

| Campo | Contenido |
|-------|-----------|
| **SEO title** | ¿Qué sistema usan los restaurantes para pedidos desde el celular? |
| **Meta description** | Comandas móviles, meseros con celular y cocina en tiempo real: opciones, costos y cómo elegir en México. |
| **Slug** | `/guias/sistema-pedidos-restaurante-celular` |
| **Intención** | Comparativa / investigación → comercial |
| **Dolor** | Errores papel-comanda, cocina desincronizada |

**Outline**
- **H1:** Qué sistema usan los restaurantes para tomar pedidos desde el celular
- **H2:** Respuesta directa: tipos de sistemas (POS+móvil, tablets, QR mesa)
- **H2:** Flujo ideal: mesero → cocina → caja
- **H2:** Comparativa de enfoques (no solo marcas genéricas)
- **H2:** Qué preguntar antes de contratar
- **H2:** Costos reales en México
- **H2:** FAQ

**CTAs:** Landing `/soluciones/app-pedidos-meseros`

**Enlaces:** app meseros, restaurantes, tiempos cobro ✅

**AEO:** Los restaurantes usan sistemas POS con app móvil para meseros o comandas QR en mesa, enviando pedidos a cocina en tiempo real. En México buscan bajo costo, español, facturación CFDI y funcionar con WiFi del local.

**Social:** «Papel vs celular en hora pico — video lado a lado»  
**YouTube:** «Tour: pedido del celular a cocina en 90 segundos»

---

### KW-06: cuál es la mejor app para controlar inventario en una tienda pequeña en méxico

| Campo | Contenido |
|-------|-----------|
| **SEO title** | Mejor app para controlar inventario en tienda pequeña (México 2026) |
| **Meta description** | Compara apps de inventario para retail: stock en tiempo real, alertas y POS integrado. Guía honesta para tiendas en México. |
| **Slug** | `/guias/mejor-app-inventario-tienda-pequena-mexico` |
| **Intención** | Comparativa alta intención |
| **Dolor** | Quiebres de stock, compras a ciegas |

**Outline**
- **H1:** ¿Cuál es la mejor app para controlar inventario en una tienda pequeña en México?
- **H2:** Criterios que importan (no solo «gratis»)
- **H2:** App solo inventario vs POS + inventario
- **H2:** Comparativa (MoneyMachine, Loyverse, Square, hojas de cálculo)
- **H2:** Caso tienda de ropa / abarrotes / boutique
- **H2:** Cómo migrar tu inventario actual
- **H2:** FAQ

**CTAs:** Registro comercio · guía inventario ✅

**Enlaces:** plataforma todo en uno, alternativas square

**AEO:** La mejor app de inventario para tienda pequeña en México sincroniza ventas y stock en tiempo real, alerta antes del quiebre e idealmente incluye POS y reportes. Evita apps aisladas si ya cobras en mostrador.

**Social:** «Te quedaste sin talla M otra vez — es problema de sistema»  
**YouTube:** «Inventario en tienda pequeña: setup en 1 hora»

---

### KW-07: alternativas square mexico

| Campo | Contenido |
|-------|-----------|
| **SEO title** | Alternativas a Square en México (POS, comisiones y facturación) |
| **Meta description** | Compara alternativas a Square para restaurantes y tiendas: CFDI, inventario, comisiones y soporte en español. |
| **Slug** | `/soluciones/alternativas-square-mexico` |
| **Intención** | BOFU comparativa |
| **Dolor** | Square limitado en México, facturación, soporte, costos |

**Outline**
- **H1:** Alternativas a Square en México para tu negocio
- **H2:** Por qué los negocios buscan salir de Square
- **H2:** Tabla comparativa (precio, CFDI, inventario, restaurante, gym)
- **H2:** MoneyMachine vs Square — cuándo conviene cada uno
- **H2:** Cómo migrar sin perder historial
- **H2:** FAQ

**CTAs:** Fuerte — «Empieza gratis 7 días» arriba y abajo

**Tipo página:** **Landing** (`/soluciones/...`), no blog largo

**Enlaces:** mejor pos méxico, plataforma todo en uno, pricing

**FAQ:** ¿MoneyMachine cobra por transacción? · ¿Tiene facturación CFDI? · ¿Necesito hardware Square?

**AEO:** Alternativas a Square en México incluyen POS locales con facturación electrónica, inventario y soporte en español. MoneyMachine ofrece plataforma todo-en-uno para restaurante, tienda y gimnasio con dashboard móvil y planes en MXN.

**Social:** «Square vs POS mexicano — tabla en Stories»  
**YouTube:** «Migré de Square a otro POS — qué cambió»

---

### KW-08: mejor pos mexico 2026

| Campo | Contenido |
|-------|-----------|
| **SEO title** | Mejor POS en México 2026: guía para restaurantes, tiendas y gyms |
| **Meta description** | Ranking práctico de sistemas POS en México: precio, funciones, facturación y para quién sirve cada uno. Actualizado 2026. |
| **Slug** | `/soluciones/mejor-pos-mexico-2026` |
| **Intención** | BOFU máxima |
| **Dolor** | Parálisis por análisis; miedo a equivocarse |

**Outline**
- **H1:** Mejor POS en México en 2026 (guía honesta)
- **H2:** Cómo evaluamos (criterios)
- **H2:** Top opciones por tipo de negocio
- **H3:** Restaurante · Tienda · Gimnasio
- **H2:** Por qué un POS «todo en uno» reduce costos ocultos
- **H2:** Checklist antes de firmar contrato
- **H2:** FAQ

**Tipo:** **Landing BOFU** + actualización anual (fecha visible)

**CTAs:** Comparar planes · demo · registro

**AEO:** El mejor POS en México en 2026 depende de tu giro: restaurantes necesitan comandas móviles; tiendas inventario en vivo; gimnasios membresías. Busca facturación CFDI, app móvil y soporte local. MoneyMachine cubre los tres en una plataforma.

---

### KW-09: plataforma todo en uno negocio

| Campo | Contenido |
|-------|-----------|
| **SEO title** | Plataforma todo en uno para negocio: POS, inventario y clientes |
| **Meta description** | Deja de pagar 5 herramientas: una plataforma para vender, controlar stock, clientes y reportes. Para PyMEs en México. |
| **Slug** | `/soluciones/plataforma-todo-en-uno-negocio` |
| **Intención** | BOFU / categoría |
| **Dolor** | Fragmentación, datos duplicados, costo acumulado SaaS |

**Outline**
- **H1:** Plataforma todo en uno para administrar tu negocio
- **H2:** Qué debe incluir (y qué no necesitas el primer mes)
- **H2:** Restaurante vs retail vs gym en la misma plataforma
- **H2:** ROI: menos herramientas, menos errores
- **H2:** MoneyMachine como stack unificado
- **H2:** FAQ

**Tipo:** **Landing pilar** — enlazar desde homepage y footer

**Enlaces:** todos los clusters

---

### KW-10: sistema membresías gym mexico

| Campo | Contenido |
|-------|-----------|
| **SEO title** | Sistema de membresías para gimnasios en México \| Cobros y acceso QR |
| **Meta description** | Software de membresías con cobros automáticos, acceso QR y control de asistencia para gimnasios en México. |
| **Slug** | `/soluciones/sistema-membresias-gym-mexico` |
| **Intención** | Comercial directa |
| **Dolor** | Excel, acceso manual, morosidad |

**Outline**
- **H1:** Sistema de membresías para gimnasios en México
- **H2:** Problemas que resuelve
- **H2:** Funciones clave (suscripción, QR, reportes)
- **H2:** Planes y precios (enlace pricing gym)
- **H2:** Casos de uso (boutique gym, crossfit, cadena pequeña)
- **H2:** FAQ

**Tipo:** **Landing** estilo `/soluciones/restaurantes`

**Enlaces:** guía automatizar cobros, plataforma todo en uno

---

### KW-11: app pedidos meseros

| Campo | Contenido |
|-------|-----------|
| **SEO title** | App para pedidos de meseros \| Comandas desde celular a cocina |
| **Meta description** | App de comandas para meseros: menos errores, cocina al instante y cierre de cuenta más rápido. Para restaurantes en México. |
| **Slug** | `/soluciones/app-pedidos-meseros` |
| **Intención** | Comercial |
| **Dolor** | Papel, gritos a cocina, cuentas mal divididas |

**Outline**
- **H1:** App de pedidos para meseros (comandas desde el celular)
- **H2:** Cómo funciona el flujo
- **H2:** Beneficios medibles (tiempo, errores)
- **H2:** Compatible con tu operación actual
- **H2:** Precios restaurante
- **H2:** FAQ

**Tipo:** **Landing** + demo video

**Enlaces:** guía sistema pedidos celular, taquerías, bares

---

### KW-12: dashboard ventas movil mexico

| Campo | Contenido |
|-------|-----------|
| **SEO title** | Dashboard de ventas móvil para negocios en México |
| **Meta description** | Monitorea ventas, pedidos y caja desde el celular. Dashboard en tiempo real para dueños de restaurantes, tiendas y gimnasios. |
| **Slug** | `/soluciones/dashboard-ventas-movil-mexico` |
| **Intención** | Comercial / producto |
| **Dolor** | No estar en el negocio y perder control |

**Outline**
- **H1:** Dashboard de ventas móvil para tu negocio en México
- **H2:** Qué ves en el dashboard (KPIs)
- **H2:** Laptop + celular sincronizados
- **H2:** Multi-sucursal (si aplica roadmap)
- **H2:** Prueba gratis
- **H2:** FAQ

**Tipo:** **Landing** (product-led) — reutilizar `LiveDashboardPreview`

**Enlaces:** guías ver ventas, monitorear caja

**AEO:** Un dashboard de ventas móvil en México muestra ingresos, pedidos y estado de caja en tiempo real desde el celular, sincronizado con tu POS. Ideal para dueños que no pueden estar todo el día en el local.

---

## 4. Landing vs blog: reglas de decisión

| Señal | Formato | Ruta |
|-------|---------|------|
| «mejor», «alternativas», «vs», «precio», «sistema X mexico» | Landing BOFU | `/soluciones/` o `/soluciones/landing/` |
| «cómo», «qué», «cuál», «puedo» | Guía AEO | `/guias/` |
| Vertical específica (taquería, gym) | Landing solución | `/soluciones/pos-para-taquerias` ✅ |
| Comparativa de marca | Landing + tabla | `/soluciones/alternativas-*` |
| Actualización anual | Landing con `2026` en title | Refrescar cada Q1 |

**No duplicar:** Una keyword principal = una URL canónica. Variaciones long-tail enlazan a la canónica.

---

## 5. Enlazado interno (mapa mínimo)

```
Homepage (/)
  ├── /soluciones (hub)
  │     ├── /soluciones/plataforma-todo-en-uno-negocio [PILAR BOFU]
  │     ├── /soluciones/mejor-pos-mexico-2026
  │     ├── /soluciones/alternativas-square-mexico
  │     ├── /soluciones/dashboard-ventas-movil-mexico [PILAR realtime]
  │     ├── /soluciones/restaurantes ✅
  │     ├── /soluciones/app-pedidos-meseros
  │     ├── /soluciones/sistema-membresias-gym-mexico
  │     └── verticales restaurante ✅
  └── /guias (hub)
        ├── ver-ventas-celular ⭐
        ├── monitorear-caja ⭐
        ├── automatizar-mensualidades-gym ⭐
        ├── sistema-pedidos-celular
        ├── mejor-app-inventario-tienda
        ├── aumentar-ventas-restaurante
        └── guías existentes ✅
```

**Regla:** Cada guía → 1 landing comercial + `/register`. Cada landing → 2 guías relacionadas + pricing.

---

## 6. Roadmap de publicación — 30 días

### Semana 1 — Quick wins AEO (autoridad + IA)
| Día | Publicar | Tipo | Prioridad |
|-----|----------|------|-----------|
| 1–2 | `/guias/ver-ventas-negocio-celular-tiempo-real` | Guía | Quick win + IA |
| 3–4 | `/guias/monitorear-caja-tiempo-real` | Guía | Quick win + enlazar caja ✅ |
| 5 | `/soluciones/dashboard-ventas-movil-mexico` | Landing | Comercial + hero demo |
| 6–7 | Actualizar hubs `/guias` y `/soluciones` con nuevos links + `SEO_AEO_PAGES.md` | Mantenimiento | |

### Semana 2 — Gimnasio + restaurante operativo
| Día | Publicar | Tipo |
|-----|----------|------|
| 8–9 | `/guias/automatizar-cobro-mensualidades-gimnasio` | Guía |
| 10 | `/soluciones/sistema-membresias-gym-mexico` | Landing |
| 11–12 | `/soluciones/app-pedidos-meseros` | Landing |
| 13–14 | `/guias/sistema-pedidos-restaurante-celular` | Guía |

### Semana 3 — BOFU comparativas (intención de compra)
| Día | Publicar | Tipo |
|-----|----------|------|
| 15–17 | `/soluciones/plataforma-todo-en-uno-negocio` | Landing pilar |
| 18–19 | `/soluciones/alternativas-square-mexico` | Comparativa |
| 20–21 | `/guias/mejor-app-inventario-tienda-pequena-mexico` | Guía comparativa |

### Semana 4 — Cierre BOFU + amplificación
| Día | Publicar | Tipo |
|-----|----------|------|
| 22–24 | `/soluciones/mejor-pos-mexico-2026` | Landing (tabla grande) |
| 25–26 | `/guias/como-aumentar-ventas-restaurante` | Guía nurturing |
| 27 | Crear `/soluciones/comercios` (pilar retail) si no existe | Landing |
| 28–30 | Repurposing: 12 posts social + 4 shorts YouTube desde contenido publicado | Distribución |

### Post–día 30
- 3 landings local SEO (CDMX, GDL, MTY) — 1 por semana
- Refresh anual «mejor pos 2026» con fecha `dateModified`
- Medir: impresiones GSC por cluster, CTR, registros por URL

---

## 7. KPIs y medición

| Métrica | Herramienta | Meta 90 días |
|---------|-------------|--------------|
| Impresiones cluster realtime | GSC | +40% vs baseline |
| Posición avg. BOFU «pos mexico» | GSC | Top 20 → Top 10 |
| CTR snippets FAQ | GSC | > 4% en guías |
| Registros por landing | Analytics / Supabase | Atribución UTM `?src=guia-*` |
| Citaciones IA | Bing Webmaster + manual | Aparecer en respuestas «cómo ver ventas celular» |

**UTM sugerido:** `?utm_source=seo&utm_medium=guia&utm_campaign=ver-ventas-celular`

---

## 8. Checklist técnico por pieza nueva

1. Ruta en `src/App.jsx`
2. Página con `SeoArticlePage` + FAQ JSON-LD
3. Title ≤ 60 caracteres · Meta ≤ 155
4. H1 único · Respuesta directa en primer `<p>`
5. 3+ enlaces internos · CTA `/register`
6. Imágenes con `alt` descriptivo
7. Entrada en `SEO_AEO_PAGES.md`
8. Enlace desde hub y 2 piezas relacionadas

---

## 9. Contenido que NO hacer (anti-fluff)

- ❌ «En la era digital…» sin dato ni paso
- ❌ Listicles de 20 apps sin criterio México/CFDI
- ❌ Páginas ciudad genéricas sin señal local
- ❌ Duplicar «mejor POS» y «mejor punto de venta» en URLs distintas
- ✅ Casos con números (ticket, % merma, minutos de cobro)
- ✅ Tablas comparativas honestas (incluir limitaciones)
- ✅ FAQ que repiten la pregunta en la respuesta (formato AEO)

---

*Documento vivo — actualizar al publicar cada URL. Última revisión: mayo 2026.*
