# CHANGELOG — Mejoras realizadas por Claude

> Rama: `claude/ampliacion-viralix`. Cada línea explica **qué** se cambió y **por qué**.
> El análisis previo está en `DIAGNOSTICO.md`; la procedencia de las imágenes en `CREDITOS_IMAGENES.md`.

## Fase 1 — Análisis
- Añadido `DIAGNOSTICO.md`: stack, inventario de artículos y páginas, causa del timeline duplicado, estado SEO/RGPD y aptitud AdSense, para tener una línea base antes de tocar nada.

## Fase 2 — Bugs y errores

### Bug crítico: TIMELINE duplicado
- **Qué estaba mal:** en `index.html`, el menú `<nav id="navbar">` contenía `<a href="timeline.html">Timeline</a>` **dos veces** (antes y después de «Sobre nosotros»), porque al insertar a mano el enlace «Sobre nosotros» en el commit `da64a8c` se pegó un bloque que ya incluía Timeline. El mismo bloque pegado duplicaba Timeline en el pie (columna «Legal» + botón superior) y la barra inferior repetía «Aviso Legal» dos veces seguidas. `timeline.html` nunca estuvo duplicada: era marcado repetido en la home.
- **Arreglo:** el menú tiene ahora un único enlace Timeline; la columna «Legal» del pie solo contiene enlaces legales (la navegación ya está en el menú y en el botón Timeline del pie) y «Aviso Legal» aparece una vez.

### Otros bugs
- Comentados (no borrados) los 44 bloques `<ins class="adsbygoogle">` de 15 artículos con `data-ad-slot="auto"`, y retiradas las llamadas `adsbygoogle.push({})` sueltas que quedaban sin bloque: el ID de slot no es válido y AdSense los rechaza; los anuncios automáticos (*Auto ads*) del `<head>` siguen activos.
- Unificado el atributo `rel` duplicado (`rel="noopener noreferrer" rel="nofollow"`) en `rel="noopener noreferrer nofollow sponsored"` en 24 páginas: el navegador ignoraba el segundo `rel`, así que los enlaces de afiliado no se marcaban como patrocinados (exigencia de Google).
- Reemplazados 9 enlaces rotos (404) de «Seguir leyendo» en 4 artículos (`articulo-mayas`, `-tesla`, `-espana`, `-sonido`, `-maquina-tiempo`, que nunca existieron) por artículos reales.
- Eliminado el bloque «SEO HIDDEN LINKS» (`display:none`) de la home: Google considera los enlaces ocultos una práctica de spam y puede motivar el rechazo de AdSense.
- Eliminados bloques CSS vacíos y comentarios sin código (`LOADING SCREEN`, `READER COUNTER`) de la home: código muerto sin referencias.
- `article-features.js`: ya no muestra como «Última actualización» la fecha del día de la visita ni la usa como `dateModified` (era falsa); solo inyecta JSON-LD si la página no trae el suyo, e incluye `image`; enlaces de compartir con `rel="noopener noreferrer"` y `aria-label`.

## Infraestructura nueva (base para las fases 3-6)
- `assets/css/viralix.css`: sistema de diseño compartido (tokens de color, modo oscuro por defecto y modo claro, tipografía editorial con columna de ~70 caracteres, letra capitular, citas, figuras con pie y crédito, ficha del caso, cronología, notas, botones de compartir, tarjetas, pie y formularios) para que las páginas nuevas sean coherentes y accesibles sin repetir CSS en cada archivo.
- `assets/js/viralix.js`: tema claro/oscuro persistente (misma clave `viralix_mode` que la home), menú móvil accesible (`aria-expanded`, Escape), barra de progreso, índice con sección activa, copiar enlace/compartir nativo, animaciones que respetan `prefers-reduced-motion` y no ocultan contenido si no hay JS.
- `cookies-banner.js` reescrito: sin consentimiento tácito, botones Rechazar/Configurar/Aceptar con la misma prominencia, panel de configuración, elección revocable desde «Configurar cookies» y envío de la elección a Google (Consent Mode v2 + `requestNonPersonalizedAds`/`pauseAdRequests`). Conserva la clave `viralix_cookies_accepted` para respetar elecciones previas. Motivo: el banner anterior no era válido según la guía de la AEPD.
- `scripts/construir.py`: genera los artículos y páginas desde Markdown (`contenido/`) con SEO completo, JSON-LD, sitemap, RSS y secciones de la home, para que añadir un artículo no exija copiar 500 líneas de HTML.
- `scripts/generar_imagenes.cjs`: crea portadas 1200×630, mapas, cronologías y fichas con datos cartográficos libres (Natural Earth, IGN, U.S. Census). Motivo: el entorno de trabajo no tenía acceso a Wikimedia Commons, Unsplash, Pexels ni Pixabay (ver `CREDITOS_IMAGENES.md`).
- `images/optimizadas/`: versiones WebP de 800 y 1200 px de las 23 portadas PNG (≈ 30-70 KB frente a ~2 MB). Los PNG originales no se han tocado.
- `.vercelignore`: evita publicar en la web las fuentes Markdown, los scripts y los documentos internos (`DIAGNOSTICO.md`, `CHANGELOG_CLAUDE.md`, `CREDITOS_IMAGENES.md`).

## Fase 3 — Contenido nuevo (17 artículos con imágenes)
- 15 artículos nuevos (`articulo-<slug>.html`, misma nomenclatura que los existentes) y 2 páginas «Próximamente» convertidas en artículos completos (`articulo-galindos.html`, `articulo-jarabo.html`), porque las páginas en construcción son contenido escaso que penaliza en AdSense.
  - True crime España: calle Fuencarral (1888), el Sacamantecas (1870-1879), Enriqueta Martí (1912), crimen de Fago (2007), crimen de la Guardia Urbana (2017), Los Galindos (1975) y caso Jarabo (1958).
  - Internacionales: Jack el Destripador, el Zodiaco, el secuestro Lindbergh, D. B. Cooper y Lizzie Borden.
  - Misterios con base histórica: paso Diátlov, Mary Celeste y caras de Bélmez.
  - Criminología: perfilación criminal y psicopatía.
- Cada artículo: 1.480-2.000 palabras en el cuerpo (más entradilla y fuentes), H1/H2/H3, listas, citas, ficha del caso, cronología, nota de «hechos probados frente a especulación», preguntas frecuentes y fuentes al final. Tono periodístico, sin detalles gráficos de violencia y sin señalar como culpables a personas no condenadas.
- Cada artículo tiene portada 1200×630 (JPG para Open Graph + WebP para la web) y 3 imágenes en el cuerpo (mapa con datos cartográficos reales, cronología visual y ficha/diagrama), todas con `alt` descriptivo en español, pie de foto y línea de crédito. Procedencia y licencias en `CREDITOS_IMAGENES.md`.
- Las fuentes Markdown viven en `contenido/articulos/*.md`; las páginas HTML se regeneran con `python3 scripts/construir.py` (y `--imagenes` para regenerar imágenes).
- `articulo-somosierra.html` se mantiene como «Próximamente» (no había documentación suficiente para escribirlo con rigor); se marca `noindex` en la fase SEO.

## Fase 4 — Páginas legales e institucionales
- **Nuevas**: `cookies.html` (detalle de cada cookie y almacenamiento local, titular, finalidad y duración), `terminos.html` (términos de uso) y `metodologia.html` (selección de casos, jerarquía de fuentes, hechos frente a hipótesis, trato a víctimas, presunción de inocencia, imágenes, correcciones, independencia). Motivo: AdSense y la normativa española esperan estas páginas y no existían.
- **Reescritas con el nuevo diseño y conservando su contenido**: `privacidad.html` (añade tabla de tratamientos, plazos, destinatarios, transferencias, menores y AEPD), `aviso-legal.html` (añade la estructura de datos del titular exigida por el art. 10 LSSI, publicidad, aviso de afiliado de Amazon y derecho de rectificación), `sobre-nosotros.html` («Sobre VIRALIX»: misión, equipo, valores, qué cubrimos) y `contacto.html` (email + formulario que prepara el correo sin enviar datos a terceros).
- **404 personalizada** reescrita con rutas absolutas (`/assets/...`), para que se vea bien también en URLs anidadas inexistentes, con botones a portada, caso al azar y timeline, y tarjetas de artículos. Lleva `noindex`.
- **Datos del titular**: no se han inventado. Privacidad y Aviso legal llevan marcadores `[Nombre y apellidos…]`, `[NIF…]` y `[Dirección…]` que el propietario debe rellenar antes de pasar a producción.
- **`ads.txt` no se ha tocado**: ya contenía el ID real de editor (`pub-5337247644569859`), que coincide con el script de AdSense. Sustituirlo por el *placeholder* pedido habría roto la verificación.
- `images/og-viralix.jpg` (1200×630) y `images/logo-viralix.png` (512×512): imagen Open Graph por defecto de las páginas institucionales y logotipo para JSON-LD y RSS (antes el RSS apuntaba a una imagen inexistente).

## Fase 5 — SEO y Open Graph
- **Artículos antiguos (23)**: cabecera SEO unificada y sin duplicados (6 artículos tenían `og:title`, `og:description`, `og:url` u `og:type` repetidos): canonical, `robots` con `max-image-preview:large`, Open Graph completo (`og:site_name`, `og:locale`, `og:image` con tamaño y `alt`), Twitter Cards con imagen, `article:published_time`/`modified_time` y JSON-LD `Article` estático **con imagen** + `BreadcrumbList`. Se eliminaron los JSON-LD antiguos sin imagen para no duplicar.
- **Descripciones**: corregidas a 150-160 caracteres las que estaban fuera de rango (`crimen-rol`, `diana-quer`, `aguilar`, `envenenadora` —que además estaba cortada a mitad de frase— y `urquijo`), y todas las nuevas.
- **Artículos nuevos y páginas**: title único, description de 150-160 caracteres, canonical, OG/Twitter con la portada 1200×630 en JPG, JSON-LD `Article` (con imagen, fechas, autor y editor con logo) y `BreadcrumbList`; páginas legales con `WebPage`/`AboutPage`/`ContactPage`.
- **Home**: description ampliada, `og:image` propia de 1200×630, `twitter:image`, el `BreadcrumbList` incorrecto de la portada sustituido por `Organization`, `ItemList` real con los 40 artículos (antes decía 14 y listaba 5) y el `SearchAction` ahora funciona (el buscador lee `?q=`).
- **Timeline**: canonical, OG, Twitter, description y JSON-LD `CollectionPage`; añadidos los 7 casos españoles nuevos en orden cronológico.
- **`sitemap.xml`** regenerado: 49 URL (sin el duplicado de `sobre-nosotros.html`), con `<image:image>` por artículo, fechas `lastmod` reales y sin la página `noindex` de Somosierra ni la 404.
- **`feed.xml`**: 17 entradas nuevas con imagen y logo del canal corregido.
- `articulo-somosierra.html` (sigue siendo «Próximamente»): `noindex, follow` para que Google no la considere contenido escaso.
- `robots.txt` no necesitaba cambios (permite todo y declara el sitemap).

## Fase 6 — Diseño, experiencia y RGPD
- **Banner de cookies conforme** en todas las páginas (ver Infraestructura) y **consentimiento por defecto antes de AdSense** insertado en el `<head>` de las 30+ páginas antiguas: hasta que el lector elige no se solicitan anuncios; si rechaza, se piden anuncios no personalizados.
- **Pie con enlaces legales** (Sobre, Metodología, Contacto, Aviso legal, Privacidad, Cookies, Términos y «Configurar cookies») en todos los artículos antiguos y el timeline, que antes solo tenían el logo.
- **Tipografías autoalojadas** (`assets/fonts/`, licencia OFL) en la home, el timeline y todas las páginas nuevas: sin peticiones a Google Fonts, más rápido y sin ceder la IP del lector. Los artículos antiguos mantienen Google Fonts porque usan 15 familias distintas (ver «Qué no se ha hecho»).
- **Home**:
  - Menú reorganizado (True Crime, Internacional, Misterios, Criminología, Mapa, Timeline, Sobre nosotros, Contacto) y adaptado a anchos de 900-1440 px, donde antes se partía en dos líneas.
  - Nuevas secciones generadas automáticamente: «Más casos de España», «Casos internacionales», «Misterios» y «Criminología», con tarjetas con imagen, extracto y tiempo de lectura.
  - Cerrada la `<section>` de artículos, que nunca se cerraba y dejaba «Caso del mes» anidada (bug de marcado).
  - Eliminada la sección «Próximamente», que anunciaba como futuros cuatro artículos ya publicados.
  - Contadores reales (40 artículos, 30 casos de true crime), categorías con recuentos correctos y enlaces a sus secciones, «Caso del mes» actualizado (noviembre de 2026), 6 puntos nuevos en el mapa y leyenda «Misterio».
  - Boletín honesto: ya no simula un registro que no existe ni afirma «Más de 500 lectores»; prepara un correo de alta y ofrece RSS.
  - Imágenes de las tarjetas servidas en **WebP de 800 px** con `width`/`height`, `loading="lazy"` y `decoding="async"` (de ~2 MB a ~30-70 KB por tarjeta) manteniendo el PNG como alternativa.
  - Accesibilidad: enlace «Saltar al contenido», `aria-label` en los botones de icono, `aria-expanded` en el menú móvil, etiquetas en los campos de búsqueda y email, foco visible, mapa con `role="img"` y soporte de `prefers-reduced-motion` (desactiva cursor personalizado, ticker y animaciones).
- **Páginas nuevas**: modo oscuro por defecto con modo claro persistente, índice lateral con sección activa, barra de progreso, botones de compartir (WhatsApp, X, Facebook, Telegram, copiar, compartir nativo), caja de autor, «Sigue leyendo» y botón de volver arriba.

## Fase 7 — Organización
- Nuevas carpetas ordenadas: `assets/` (CSS, JS y fuentes compartidas), `images/articulos/` (imágenes nuevas), `images/optimizadas/` (WebP de las portadas antiguas), `contenido/` (fuentes Markdown y guía `LEEME.md`) y `scripts/` (herramientas). Nada de lo existente se ha movido para no romper URLs indexadas.
- Código muerto eliminado (solo el que no tenía referencias): bloques CSS vacíos y comentario de un contador simulado en la home; enlaces ocultos «SEO».
- `article-features.js`: el botón «Siguiente caso» de los artículos antiguos ya recorre también los 17 nuevos (mejor enlazado interno).
- Duplicados y desorden pendientes de decisión del propietario, documentados en `DIAGNOSTICO.md` (sección 10): `juego/index.html` huérfano y estilos/scripts repetidos en cada artículo antiguo.
- Documentación: `DIAGNOSTICO.md`, este `CHANGELOG_CLAUDE.md`, `CREDITOS_IMAGENES.md` y `contenido/LEEME.md`.

## Qué NO se ha hecho (a propósito) y por qué
- **Datos del titular** en Aviso legal y Privacidad: no se inventaron; el propietario los completó el 4-nov-2026 y las páginas se regeneraron.
- **`ads.txt`**: se mantiene el ID real en lugar del *placeholder* pedido, para no romper la verificación de AdSense.
- **Fotografías reales**: el entorno no tenía acceso a los bancos de imágenes; se usaron imágenes propias con datos abiertos (ver `CREDITOS_IMAGENES.md`).
- **CMP certificada por Google**: el banner propio es conforme a la AEPD, pero AdSense exige para el tráfico del EEE una CMP certificada (la gratuita de Google se activa en el panel de AdSense, «Privacidad y mensajes»). No se puede activar desde el código.
- **Rediseño de los 23 artículos antiguos**: solo se tocaron cabecera, pie, anuncios y enlaces rotos; su diseño individual se mantiene para no romper nada. Tampoco se autoalojaron sus 15 familias tipográficas.
- **Titulares sensacionalistas antiguos** («disolvía los cuerpos en ácido», «quemó a sus hijos»…): en la ampliación no se cambiaron; se suavizaron en la auditoría del 4-nov-2026 (ver abajo) sin cambiar las URL.
- **`articulo-somosierra.html`**: sigue como «Próximamente» con `noindex`; no había documentación verificable suficiente para escribirlo con rigor.
- **Unidades de anuncio manuales**: se comentaron las 44 inválidas; no se crearon unidades nuevas porque requieren IDs de slot del panel de AdSense.

## Actualización 4-nov-2026
- Regeneradas `aviso-legal.html` y `privacidad.html` con los datos del titular aportados por el propietario (nombre, NIF y domicilio), exigidos por el art. 10 de la LSSI y el art. 13 del RGPD. Eliminados los comentarios «PENDIENTE» de las fuentes Markdown.

## Auditoría AdSense y SEO (4-nov-2026, rama `main`)
Objetivo: quitar lo que puede frenar la aprobación de AdSense («contenido de poco valor», «contenido impactante», falta de transparencia sobre el autor) y mejorar el posicionamiento. Un commit por tarea.

- **Reescritura de los 17 artículos nuevos** (`contenido/articulos/*.md`). Se eliminaron los patrones de texto genérico: citas plantilla «— VIRALIX», fórmulas repetidas («En VIRALIX no reproducimos…»), cierres moralizantes calcados, encabezados intercambiables («Por qué sigue fascinando», «Conclusión»), párrafos de longitud uniforme y listas de relleno. Se añadieron valoraciones y matices de autor. Los hechos no cambian; se retiraron las afirmaciones que no se podían respaldar con las fuentes citadas.
- **Nota del autor** al final de cada uno de los 17 (campo `nota_autor`): reflexión, duda abierta o conexión con la actualidad propia de cada caso, firmada y enlazada a la página del autor.
- **`/sobre.html`** (sustituye a `sobre-nosotros.html`, que queda como redirección `noindex`): origen del proyecto, cómo ha crecido, quién escribe, método en 7 pasos, compromiso editorial, financiación y cobertura. Enlazada en el menú principal y en el pie.
- **`/autor/jorge-de-la-fuente.html`**: biografía, cómo trabaja, correo y listado de sus 17 artículos, con `ProfilePage` + `Person`. Cada artículo nuevo muestra «Escrito por Jorge de la Fuente» enlazado y una caja de autor; el pie de todas las páginas generadas enlaza a «El autor».
- **Schema.org `Article` completo** en los 17: `headline`, `author` (`Person` con `url` del perfil), `datePublished`, `dateModified`, `image` (`ImageObject` 1200×630), `publisher` (`Organization` con logo), `articleBody` (extracto), `mainEntityOfPage`.
- **Migas de pan visibles** «Inicio › Categoría › Título» con `BreadcrumbList` en los 17 y mejoradas en los 23 antiguos (`article-features.js`, con `?v=20261104` para saltar la caché de un año de `vercel.json`).
- **«Artículos relacionados»**: 4 enlaces elegidos a mano por tema, época o categoría, antes de la nota del autor. El bloque inferior «Más casos» ya no repite esos cuatro.
- **Meta descriptions**: 13 artículos antiguos con descripciones cortas, cortadas o gráficas pasan a 140-160 caracteres con palabra clave y gancho (también en `og:`, `twitter:` y JSON-LD). Todas las páginas indexables quedan en ese rango.
- **Titulares**: seis artículos antiguos (Asunta, Bretón, crimen de Cuenca, katana, Marta Calvo, Puerto Hurraco) pasan de titulares gráficos a titulares informativos en `title`, H1, OG, JSON-LD, portada, buscador, feed y timeline. URL sin cambios.
- **Restos de esos titulares**: corregidos también en los `alt` de la imagen social, el texto para compartir por WhatsApp, las tarjetas «Seguir leyendo» de otros artículos y los resúmenes del feed y del timeline.
- **Fallo visual en los 23 artículos antiguos y el timeline**: los enlaces legales del pie y las migas de pan son elementos `<nav>` que heredaban la regla `nav{position:fixed}` de cada artículo y se superponían al logo y al menú. Se fija `position:static` solo en esos dos elementos, sin tocar las hojas de estilo del diseño.
- **Páginas legales**: aviso legal, privacidad, cookies, términos y contacto fechadas el 4-nov-2026; cookies y contacto incluyen ya los datos del titular. Las 51 páginas, incluida `juego/`, enlazan a las legales en el pie.
- **Eclipse 2026**: corregidos tres errores factuales (franja de totalidad, eclipse anterior de 1905, siguiente el 2-ago-2027), con nota de corrección fechada.
- **`sitemap.xml`**: añade `/sobre.html` y `/autor/jorge-de-la-fuente.html`; `lastmod` 2026-11-04 en lo modificado de verdad (los artículos antiguos con solo cambios de metadatos conservan su fecha).

### Pendiente (manual)
- Activar en AdSense la CMP certificada de Google («Privacidad y mensajes») y, si se desea, los anuncios automáticos; después pedir la revisión.
- Volver a enviar `sitemap.xml` en Search Console e inspeccionar `/sobre.html` y la página de autor.
- Completar la biografía del autor con datos reales verificables (formación, foto, redes) y revisar las notas del autor, que están escritas en su voz.
- Los 23 artículos antiguos siguen firmados como «Equipo VIRALIX» y conservan pasajes gráficos en el cuerpo (p. ej., Alcàsser) que conviene revisar.
- Opcional: redirección 301 de `/sobre-nosotros.html` a `/sobre.html` en `vercel.json`.

## Lote de noviembre (12-nov-2026, rama `feat/batch-articulos-noviembre-2026`)
Diagnóstico previo en `AUDITORIA.md`. Un commit por artículo y uno por mejora.

- **15 artículos nuevos** escritos desde Markdown con la plantilla del generador: Helena Jubany, Sheila Barrero, Cristina Bergua, Anabel Segura, el robo del Códice Calixtino, el niño de Somosierra, María Soledad Morales, Pedro Alonso López, Juan Fernando Hermosa, José Luis Cabezas, Elisa Lam, la mujer de Isdal, el hombre de Somerton, el Monstruo de Florencia y el robo del museo Gardner.
- **Plantilla**: nueva categoría «Casos Latinoamérica», bloque de libro recomendado con la etiqueta de afiliado `viralixweb-21` y aviso de Amazon, botón de Buy Me a Coffee y comentario HTML final con fecha, checklist y *prompts* de imágenes opcionales.
- **Portada**: bloque «Categorías» generado con recuentos reales, sección de Latinoamérica y `Organization` con `sameAs` (Instagram) y `contactPoint`.
- **Enlazado interno**: listas de relacionados reequilibradas; bloque de relacionados en `articulo-crimen-rol.html`; seis casos nuevos en el timeline.
- **Técnico**: `robots.txt` limpio, `defer` en los scripts de las páginas antiguas, versión en la hoja de estilos para saltar la caché.
- **«Sobre VIRALIX»** actualizada con los 55 artículos y la cobertura de Latinoamérica.

