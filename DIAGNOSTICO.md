# DIAGNÓSTICO TÉCNICO Y EDITORIAL — VIRALIX

> Fecha del análisis: 3 de noviembre de 2026 · Rama de trabajo: `claude/ampliacion-viralix`
> Este documento recoge el estado de la web **antes** de las mejoras. Los cambios aplicados se documentan en `CHANGELOG_CLAUDE.md`.

---

## 1. Stack técnico y estructura

| Aspecto | Detalle |
|---|---|
| Tipo de proyecto | Web **estática** en HTML5 + CSS + JavaScript *vanilla*. Sin framework, sin *bundler*, sin `package.json`. |
| Hosting | Vercel (`vercel.json`: cabeceras de seguridad, caché y ruta *catch-all* a `404.html`). |
| Dominios | `www.viralixweb.es` (canónico) y `viralix-theta.vercel.app`. |
| CSS | Embebido (`<style>`) en cada página; cada artículo tiene su propio diseño y variables. |
| JS compartido | `article-features.js` (migas, índice, compartir, autor, siguiente caso, JSON-LD), `audio-reader.js` (lectura por voz), `cookies-banner.js` (banner de cookies). |
| Tipografías | Google Fonts: Bebas Neue, DM Sans, DM Serif Display (home y páginas) y Barlow / Barlow Condensed (artículos). |
| Monetización | Google AdSense (`ca-pub-5337247644569859`) en `<head>` de todas las páginas, `ads.txt` con el ID real, enlaces de afiliado de Amazon y Buy Me a Coffee. |
| Verificación | `googlebd6bb1a7e4b62950.html` (Search Console). |

### Estructura de carpetas (antes)

```
/                       ← todo en la raíz (se despliega tal cual)
├── index.html          ← home (105 KB, CSS y JS embebidos)
├── articulo-*.html     ← 26 archivos de artículo (23 completos + 3 "Próximamente")
├── img-*.png           ← 23 imágenes de portada, 1536×1024 PNG, ~2 MB cada una (≈ 50 MB en total)
├── timeline.html, sobre-nosotros.html, contacto.html, privacidad.html, aviso-legal.html, 404.html
├── article-features.js, audio-reader.js, cookies-banner.js
├── sitemap.xml, robots.txt, feed.xml, manifest.json, ads.txt, favicon.svg, vercel.json
└── juego/index.html    ← minijuego "Caso Abierto" (huérfano: no está enlazado desde ninguna página)
```

---

## 2. Artículos existentes (26 archivos)

### True crime España (19 publicados)
| Archivo | Resumen |
|---|---|
| `articulo-alcasser.html` | Triple crimen de Alcàsser (1992): cronología, juicio a Ricart y paradero desconocido de Antonio Anglés. |
| `articulo-wanninkhof.html` | Asesinato de Rocío Wanninkhof (1999) y condena errónea de Dolores Vázquez. |
| `articulo-wanninkhof-bis.html` | Segunda parte: Tony King y el crimen de Sonia Carabantes (2003). |
| `articulo-marta-castillo.html` | Desaparición de Marta del Castillo (Sevilla, 2009) y las versiones de Miguel Carcaño. |
| `articulo-diana-quer.html` | Caso Diana Quer (2016): 497 días de búsqueda y detención de «El Chicle». |
| `articulo-asunta.html` | Caso Asunta Basterra (Santiago, 2013) y condena de sus padres adoptivos. |
| `articulo-asesino-baraja.html` | Alfredo Galán, «el asesino de la baraja» (Madrid, 2003). |
| `articulo-katana.html` | José Rabadán, «el asesino de la katana» (Murcia, 2000). |
| `articulo-puerto-hurraco.html` | Matanza de Puerto Hurraco (Badajoz, 1990). |
| `articulo-crimen-rol.html` | Crimen del rol (Madrid, 1994). |
| `articulo-urquijo.html` | Asesinato de los marqueses de Urquijo (Madrid, 1980). |
| `articulo-el-lute.html` | Eleuterio Sánchez «El Lute» y sus fugas durante el franquismo. |
| `articulo-crimen-cuenca.html` | Error judicial del crimen de Cuenca (1910-1926). |
| `articulo-marta-calvo.html` | Caso Marta Calvo (Valencia, 2019) y Jorge Ignacio Palma. |
| `articulo-aguilar.html` | Desaparición de Virginia y Manuela en Aguilar de Campoo (1992). |
| `articulo-arropiero.html` | Manuel Delgado Villegas, «el Arropiero» (1964-1971). |
| `articulo-breton.html` | Caso Bretón (Córdoba, 2011). |
| `articulo-envenenadora.html` | Pilar Prades, «la envenenadora de Valencia» (1959). |

### Ciencia y misterios (5 publicados)
| Archivo | Resumen |
|---|---|
| `articulo-eclipse-2026.html` | Eclipse total de sol del 12 de agosto de 2026 en España. |
| `articulo-super-elnino.html` | Previsiones sobre un episodio intenso de El Niño en 2026. |
| `articulo-marianas.html` | Exploración de la fosa de las Marianas. |
| `articulo-hantavirus.html` | Hantavirus y el brote del crucero Hondius. |
| `articulo-falsos-recuerdos.html` | Psicología de los falsos recuerdos. |

### Páginas «Próximamente» (contenido escaso, ~115 palabras, no enlazadas ni en el sitemap)
| Archivo | Estado |
|---|---|
| `articulo-galindos.html` | Crimen de Los Galindos (1975). Solo ficha de «Próximamente». |
| `articulo-jarabo.html` | Caso Jarabo (1958). Solo ficha de «Próximamente». |
| `articulo-somosierra.html` | Niño de Somosierra (2000). Solo ficha de «Próximamente». |

> Extensión media de los artículos publicados: **800–1.950 palabras**. Ningún artículo tenía imágenes `<img>` dentro del cuerpo; la portada se usa como fondo CSS del *hero* (en 13 de ellos) y como `og:image`.

---

## 3. Páginas existentes

`index.html` · `timeline.html` · `sobre-nosotros.html` · `contacto.html` · `privacidad.html` · `aviso-legal.html` · `404.html` · `juego/index.html` (huérfana).

**No existían**: Política de Cookies, Términos de Uso, Metodología editorial (solo un apartado dentro de «Sobre nosotros»).

---

## 4. Componentes reutilizables detectados

No hay un sistema de componentes: cada página repite su HTML/CSS. Patrones recurrentes que se pueden unificar:

- **Navbar** (logo `VIRAL<span>I</span>X` + enlaces) — distinta en cada página.
- **Tarjeta de artículo** (`.article-card` con `.card-img`, `.tag`, `.article-title`, `.card-footer` y botón de WhatsApp) en la home.
- **Bloques editoriales de artículo**: `.caja-datos`, `.cita-destacada`, `.timeline` / `.timeline-card`, `.pregunta-abierta`, `.conclusion`, `.verificado`, `.mas-articulos`.
- **Scripts compartidos**: `article-features.js`, `audio-reader.js`, `cookies-banner.js` (los tres se inyectan con estilos en línea y colores oscuros fijos).
- **Cursor personalizado, barra de progreso y animación `.reveal`** — duplicados en casi todas las páginas.

---

## 5. Causa de la duplicación del TIMELINE (bug crítico)

**Archivo:** `index.html`, menú principal `<nav id="navbar">` (líneas 446-448).

```html
<a href="#mapa">Mapa</a>
<a href="timeline.html">Timeline</a>          ← 1.ª vez
    <a href="sobre-nosotros.html">Sobre nosotros</a>
<a href="timeline.html">Timeline</a>          ← 2.ª vez (duplicado)
<a href="#quiz">Quiz</a>
```

- Se introdujo en el commit `da64a8c` («Add files via upload», 13-jun-2026): al insertar a mano el enlace «Sobre nosotros», se pegó un bloque que ya contenía `Timeline`, de modo que el enlace quedó **dos veces** en el menú (en escritorio aparece «TIMELINE · SOBRE NOSOTROS · TIMELINE» y en el menú móvil, apilado, dos entradas TIMELINE casi seguidas).
- El mismo bloque copiado se pegó en la columna «Legal» del pie de página, que mezcla enlaces de navegación (True Crime, Ciencia, Mapa, **Timeline**) con los legales, y además el pie ya tenía otro botón «Timeline» en `.footer-social-links`.
- En la barra inferior del pie (`.footer-legal`) ocurre lo mismo con **«Aviso Legal» repetido dos veces seguidas**.
- `timeline.html` en sí **no** está duplicada: se renderiza una sola vez. El problema es de marcado repetido en la home.

---

## 6. Otros bugs y errores detectados

| # | Problema | Dónde | Gravedad |
|---|---|---|---|
| 1 | Unidades de anuncio manuales con `data-ad-slot="auto"` (valor inválido: debe ser un ID numérico) → AdSense las rechaza / error `TagError` en consola. | 15 artículos (44 bloques `<ins>`) | Alta |
| 2 | Enlaces ocultos con `display:none` («SEO HIDDEN LINKS»): Google lo considera texto/enlaces ocultos (spam). | `index.html` | Alta (AdSense/SEO) |
| 3 | Sección «Próximamente» anuncia como no publicados casos que **ya están publicados** (Bretón, Arropiero, Aguilar, Envenenadora). | `index.html` | Media |
| 4 | Enlaces rotos (404) en «Seguir leyendo»: `articulo-mayas`, `articulo-tesla`, `articulo-espana`, `articulo-sonido`, `articulo-maquina-tiempo`. | marianas, hantavirus, falsos-recuerdos, asesino-baraja | Media |
| 5 | `feed.xml` apunta a `img-og-viralix.png`, que no existe. | `feed.xml` | Baja |
| 6 | Atributo `rel` duplicado (`rel="noopener noreferrer" rel="nofollow"`): el navegador ignora el segundo, así que los enlaces de afiliado **no** llevan `sponsored`/`nofollow` (incumple las directrices de Google sobre enlaces pagados). | home + artículos | Media |
| 7 | `og:title` duplicado. | `articulo-diana-quer.html` | Baja |
| 8 | `article-features.js` inventa fechas: `datePublished` fijo en 2026-05-01 y `dateModified` / «Última actualización» = **fecha del día de la visita**. Es información falsa para Google y para el lector. | todos los artículos | Media |
| 9 | Newsletter simulado: el formulario dice «✓ Registrado» pero no guarda ni envía nada; y se afirma «Más de 500 lectores ya reciben el newsletter». Afirmación no verificable → riesgo de «tergiversación» en AdSense. | `index.html` | Media |
| 10 | Contadores desactualizados (19 artículos, «13 artículos» True Crime, «14 casos documentados», ItemList con `numberOfItems: 14` pero 5 elementos). | `index.html` | Baja |
| 11 | Botón «artículo aleatorio» solo conoce 13 de los 23 artículos. | `index.html` | Baja |
| 12 | Botones de icono sin `aria-label` (🎲, Aa, ☀️, ☰) y cursor nativo oculto (`cursor:none`) en escritorio. | home y artículos | Media (accesibilidad) |
| 13 | `og:description` cortadas a mitad de palabra («...y las pregunta»). | varios artículos | Baja |
| 14 | Las tarjetas de la home cargan 23 PNG de ~2 MB (≈ 50 MB si se recorre la página). | `index.html` | Alta (rendimiento / Core Web Vitals) |

No se detectaron errores JavaScript (`pageerror`) en ninguna página al cargarlas con Chromium; los únicos fallos de red son los recursos externos bloqueados en el entorno de análisis.

---

## 7. Estado SEO

| Elemento | Estado |
|---|---|
| `<title>` | Presente y único en todas las páginas. |
| Meta description | Presente en artículos (112–160 caracteres; 3 por debajo de 140). Ausente en `404.html`. Corta en `aviso-legal.html` (57) y `contacto.html` (86). |
| Canonical | En todos los artículos y la home. **Falta** en timeline, sobre-nosotros, contacto, privacidad, aviso legal. |
| Open Graph | Completo en artículos publicados (con `og:image` PNG). Falta `og:image` en placeholders y páginas institucionales; falta `og:site_name` / `og:locale` en casi todas. |
| Twitter Cards | En artículos y home. Falta en páginas institucionales. |
| Schema.org | `WebSite`, `BreadcrumbList`, `ItemList` en la home; `Article` estático solo en 4 artículos; el resto lo inyecta `article-features.js` con fechas incorrectas y **sin imagen** (Google exige `image` para resultados enriquecidos de artículos). |
| `sitemap.xml` | Existe, pero con `sobre-nosotros.html` duplicado y sin la mayoría de páginas nuevas (no aplica todavía). |
| `robots.txt` | Correcto (permite todo, declara sitemap). La línea `Disallow` del archivo de verificación es innecesaria pero inocua. |
| RSS | `feed.xml` con 23 entradas; imagen del canal rota. |
| Imágenes | Sin `width/height` (provoca CLS), PNG muy pesados, sin WebP. |

---

## 8. Estado RGPD / LSSI

| Elemento | Estado |
|---|---|
| Banner de cookies | Existe (`cookies-banner.js`), pero: (a) dice «Al continuar navegando aceptas…» (el consentimiento tácito **no es válido** según la AEPD desde 2020); (b) el script de AdSense se carga **antes** del consentimiento y el banner no transmite la elección a Google; (c) no hay forma de cambiar la elección después; (d) no enlaza a una política de cookies (no existía). |
| Política de privacidad | Existe y es razonable (RGPD, LOPDGDD, AdSense, derechos). Mejorable: falta identificar al responsable, plazos de conservación, transferencias internacionales y la AEPD como autoridad de control de forma explícita. |
| Aviso legal | Existe, pero **no identifica al titular** (nombre/razón social, NIF, domicilio, email), datos obligatorios por el art. 10 de la LSSI. |
| Política de cookies | **No existía.** |
| Términos de uso | **No existían.** |

---

## 9. Aptitud para Google AdSense (antes): **5 / 10**

**A favor:** dominio propio, ~23 artículos originales de 800–2.000 palabras, privacidad y aviso legal, contacto con email, `ads.txt` correcto, sitemap, diseño cuidado.

**En contra / qué faltaba:**
1. Páginas «Próximamente» con contenido escaso (Google penaliza «sitio en construcción» / *thin content*).
2. Enlaces ocultos con `display:none`.
3. Unidades de anuncio mal configuradas (`data-ad-slot="auto"`).
4. Falta de política de cookies, términos de uso y metodología como página propia; aviso legal sin titular.
5. Banner de cookies no conforme y sin Consent Mode; ausencia de CMP certificada para el EEE.
6. Afirmaciones no verificables (newsletter con 500 lectores) y fechas de actualización falsas.
7. Enlaces rotos y menús duplicados (señal de baja calidad técnica).
8. Temática true crime con titulares muy explícitos en algunos artículos («disolvía los cuerpos en ácido», «quemó a sus hijos»): AdSense permite el género, pero conviene tono informativo y sin detalles gráficos.
9. Rendimiento: ~2 MB por imagen.

---

## 10. Organización: duplicados, desorden y código muerto

| Hallazgo | Acción tomada |
|---|---|
| Todo en la raíz, sin carpetas para imágenes/estilos. | Las **nuevas** imágenes van a `images/articulos/` y los estilos/JS compartidos a `assets/`. No se movió nada existente para no romper URLs indexadas. |
| `juego/index.html` huérfano. | Se mantiene (no es código muerto: funciona). Se recomienda enlazarlo o retirarlo — decisión del propietario. |
| `articulo-somosierra.html` (placeholder sin contenido). | Se mantiene, pero con `noindex` hasta que se escriba el artículo. |
| Bloques CSS vacíos en `index.html` (`/* LOADING SCREEN */`, `/* READER COUNTER */` sin reglas) y comentario `// READER COUNTER (simulated social proof)` sin código. | Eliminados: comentarios sin código ni referencias. |
| Estilos y scripts de cursor/progreso/reveal duplicados en cada artículo. | Documentado. No se refactorizan los artículos antiguos para no romper sus diseños individuales. |
| `sobre-nosotros.html` aparece dos veces en el sitemap. | Corregido al regenerar el sitemap. |

---

## 11. Propuestas de mejora (que se aplican en esta rama)

1. **Arreglar el timeline duplicado** y el resto de duplicados del menú/pie.
2. **Sistema de diseño compartido** (`assets/css/viralix.css` + `assets/js/viralix.js`) con modo claro/oscuro persistente, tipografía editorial (columna de ~70 caracteres, *drop cap*, citas destacadas, figuras con pie de foto), menú accesible y barra de compartir.
3. **15+ artículos nuevos** (casos españoles, internacionales, misterios con base histórica y criminología) de 1.500–2.500 palabras, con portada 1200×630 y 2-3 imágenes en el cuerpo con `alt`, pie de foto y crédito.
4. **Convertir los placeholders** de Los Galindos y Jarabo en artículos completos.
5. **Páginas nuevas**: Política de Cookies, Términos de Uso, Metodología editorial; mejorar Aviso Legal, Privacidad, Sobre VIRALIX, Contacto (con formulario) y 404.
6. **Banner de cookies conforme** (Aceptar / Rechazar / Configurar con la misma prominencia, sin consentimiento tácito, revocable desde el pie) con **Google Consent Mode v2** y anuncios no personalizados por defecto.
7. **SEO**: JSON-LD `NewsArticle` estático con imagen en todos los artículos, OG/Twitter completos, canonical en todas las páginas, sitemap y RSS actualizados.
8. **Rendimiento**: versiones WebP ligeras de las 23 portadas PNG para la home (sin borrar los PNG originales) con `width/height`, `loading="lazy"` y `decoding="async"`.
9. **Home**: nuevas secciones (Internacional, Misterios, Criminología), contadores reales, buscador y «artículo aleatorio» con todos los artículos, retirada de enlaces ocultos y de la sección «Próximamente» obsoleta.
