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
