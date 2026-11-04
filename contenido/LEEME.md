# Cómo añadir o editar contenido en VIRALIX

Las páginas nuevas se escriben en Markdown y se convierten en HTML con un script. El HTML generado (`articulo-<slug>.html`, páginas legales…) es lo que se publica; esta carpeta no se despliega (`.vercelignore`).

## Requisitos (solo la primera vez)

```bash
cd scripts && npm install
```

Necesitas Python 3 con Pillow y Node 18+ con Playwright/Chromium (solo para regenerar imágenes).

## Añadir un artículo

1. Copia un archivo de `contenido/articulos/` (por ejemplo `crimen-fago.md`) con el nuevo slug como nombre: `mi-caso.md` → generará `articulo-mi-caso.html`.
2. Rellena la cabecera: `titulo`, `titulo_seo`, `titulo_corto`, `descripcion` (150-160 caracteres), `entradilla`, `categoria` (`es`, `intl`, `mist` o `crim`), `anio`, `lugar`, `estado`, fechas, `palabras_clave`, `alt_portada`, `pie_portada` y el bloque `mapa` (coordenadas en grados) o `diagrama`.
3. Escribe el cuerpo con `##`/`###`, listas, `> citas` y los bloques especiales `:::ficha`, `:::cronologia`, `:::nota` y `:::fuentes`.
4. Inserta las imágenes con `![texto alternativo](mapa "pie de foto")` (tipos: `mapa`, `cronologia`, `ficha`, `diagrama`).
5. Genera páginas e imágenes:

```bash
python3 scripts/construir.py --imagenes mi-caso
```

El script también actualiza `sitemap.xml`, `feed.xml`, las secciones nuevas de la portada, el buscador y el botón de artículo aleatorio.

## Editar una página legal

Edita el archivo correspondiente de `contenido/paginas/` y ejecuta `python3 scripts/construir.py`.

**Importante**: no edites a mano los `articulo-*.html` generados desde Markdown; los cambios se perderían en la siguiente construcción. Los artículos antiguos (los que no tienen `.md`) sí se editan directamente en su HTML.
