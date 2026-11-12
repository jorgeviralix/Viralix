# AUDITORÍA VIRALIX — 12 de noviembre de 2026

Revisión previa al lote de artículos de noviembre. Rama: `feat/batch-articulos-noviembre-2026`.
Motivo del último rechazo de AdSense: «contenido de poco valor».

## 1. Estado real del repositorio

- **40 artículos publicados**, no 23: 23 escritos a mano en HTML (cada uno con su CSS propio) y 17 generados desde Markdown con `scripts/construir.py`.
- El generador ya produce, para cada artículo, la plantilla completa: metas, Open Graph, Twitter Card, `Article` + `BreadcrumbList`, migas visibles, índice con anclas, barra de compartir, relacionados, caja de autor, sitemap, feed y tarjetas de portada.
- **Plantilla de referencia** (los tres artículos más completos del generador): `articulo-calle-fuencarral.html`, `articulo-jack-el-destripador.html` y `articulo-perfil-criminal.html`. Los 15 artículos nuevos usan esa misma plantilla.
- Imágenes: el repo tiene un generador propio (`scripts/generar_imagenes.cjs`) que crea portadas, mapas, cronologías, fichas y diagramas a partir de datos abiertos. Ninguna muestra caras ni personas.

## 2. Problemas detectados

| # | Problema | Gravedad | Estado |
|---|----------|----------|--------|
| 1 | Volumen de contenido original todavía corto para un medio (40 piezas) y sin casos de Latinoamérica | Alta | Resuelto: 15 artículos nuevos |
| 2 | Artículos antiguos cortos: `marta-calvo` (≈800 palabras), `wanninkhof-bis` (≈800), `eclipse-2026` (≈890), `crimen-cuenca` (≈920) | Alta | Pendiente (ver PR) |
| 3 | `articulo-somosierra.html` es una página «Próximamente» de 104 palabras | Media | Resuelto: artículo completo |
| 4 | Enlazado interno pobre: 7 artículos reciben menos de 2 enlaces desde otros artículos (`crimen-rol`, `marta-calvo` y `wanninkhof-bis` no reciben ninguno) | Alta | Resuelto: los 55 reciben 2 o más |
| 5 | `articulo-crimen-rol.html` solo enlaza a 1 artículo | Media | Resuelto |
| 6 | El bloque de Amazon y el botón de Buy Me a Coffee solo existen en los 23 artículos antiguos; los generados no los tenían. El identificador `viralixweb-21` no aparece en ningún enlace (los antiguos usan enlaces cortos `link.amazon`) | Media | Resuelto en la plantilla |
| 7 | Schema `Organization` de la portada sin `sameAs` ni `contactPoint` | Media | Resuelto |
| 8 | Bloque «Categorías» de la portada con recuentos escritos a mano (desfasados) y sin grupo de Latinoamérica | Media | Resuelto: se genera solo |
| 9 | `robots.txt`: la línea `Disallow` del archivo de verificación de Google queda fuera del grupo `User-agent` y bloquea un archivo que Google debe poder leer | Baja | Resuelto |
| 10 | 72 etiquetas `<script src>` sin `defer` en los 23 artículos antiguos y páginas hechas a mano | Baja | Resuelto |
| 11 | Los 23 artículos antiguos siguen firmados como «Equipo VIRALIX» | Media | Pendiente (decisión del editor) |
| 12 | El consentimiento de cookies es propio; AdSense exige una CMP certificada para el EEE | Alta | Pendiente (solo se activa en el panel de AdSense) |

## 3. Comprobado y correcto

- Meta descriptions: todas únicas, sin duplicados ni vacías en páginas indexables.
- Títulos: todos únicos.
- Open Graph e imagen de portada: presentes en todas las páginas indexables.
- Imágenes: todas con `width` y `height`; carga diferida en la portada (40 de 40).
- `ads.txt`: correcto (`google.com, pub-5337247644569859, DIRECT, f08c47fec0942fa0`).
- Páginas legales (aviso legal, privacidad, cookies, términos), contacto, «Sobre VIRALIX», metodología y página de autor: completas y fechadas el 4 de noviembre de 2026.
- `sitemap.xml` y `feed.xml`: se regeneran con cada construcción.

## 4. Decisiones tomadas en este lote

- **Temas sustituidos** porque ya estaban publicados: Wanninkhof, Puerto Hurraco, Marta Calvo, Fago y D. B. Cooper. En su lugar: Anabel Segura, el robo del Códice Calixtino, el niño de Somosierra, José Luis Cabezas y el robo del museo Gardner.
- **Imágenes**: se generan imágenes reales (portada, mapa, cronología, ficha y diagrama) en lugar de dejar `placeholder.jpg`, porque una imagen rota perjudica la revisión de AdSense. Los *prompts* para fotografías de ambiente opcionales quedan en un comentario al final de cada artículo y en el PR.
- **Autoría**: los artículos nuevos mantienen la firma de Jorge de la Fuente con enlace a su página de autor (decisión de la auditoría del 4 de noviembre), con VIRALIX como `publisher`.
- **Enlaces de Amazon**: enlaces de búsqueda en amazon.es con la etiqueta `viralixweb-21`, que siempre funcionan y no dependen de un código de producto que no se pueda comprobar.

## 5. Estado al cerrar el lote (12 de noviembre de 2026)

- **55 artículos** publicados: 15 nuevos, de entre 1.850 y 2.360 palabras, cada uno con 6 imágenes propias (portada, mapa, diagrama, cronología y ficha).
- Enlazado interno: todos los artículos enlazan a 3 o más y reciben enlaces de 2 o más.
- Metas: títulos y descripciones únicos; las 15 descripciones nuevas tienen entre 148 y 157 caracteres.
- `sitemap.xml`: 65 URL, con los 15 artículos nuevos fechados el 12 de noviembre.
- Portada: seis grupos de categorías con recuento automático, sección nueva de Latinoamérica y `Organization` con `sameAs` y `contactPoint`.
- Comprobado en navegador: ninguna página da errores de consola y los 124 bloques JSON-LD son válidos.

### Pendiente

1. Ampliar los cuatro artículos antiguos más cortos (`marta-calvo`, `wanninkhof-bis`, `eclipse-2026`, `crimen-cuenca`).
2. Decidir la firma de los 23 artículos antiguos («Equipo VIRALIX»).
3. Activar en AdSense la CMP certificada de Google.
4. Revisar los hechos de los 15 artículos nuevos antes de darlos por definitivos, en especial los casos con proceso judicial abierto (Helena Jubany) y las cifras que varían según la fuente (Juan Fernando Hermosa, José Luis Cabezas).
5. Los enlaces de Amazon son búsquedas con la etiqueta `viralixweb-21`; conviene sustituirlos por el enlace directo al producto cuando se confirme cada libro.
