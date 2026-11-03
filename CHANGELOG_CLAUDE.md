# CHANGELOG — Mejoras realizadas por Claude

> Rama: `claude/ampliacion-viralix`. Cada línea explica **qué** se cambió y **por qué**.
> El análisis previo está en `DIAGNOSTICO.md`; la procedencia de las imágenes en `CREDITOS_IMAGENES.md`.

## Fase 1 — Análisis
- Añadido `DIAGNOSTICO.md`: stack, inventario de artículos y páginas, causa del timeline duplicado, estado SEO/RGPD y aptitud AdSense, para tener una línea base antes de tocar nada.

## Fase 2 — Bugs y errores

### Bug crítico: TIMELINE duplicado
- **Qué estaba mal:** en `index.html`, el menú `<nav id="navbar">` contenía `<a href="timeline.html">Timeline</a>` **dos veces** (antes y después de «Sobre nosotros»), porque al insertar a mano el enlace «Sobre nosotros» en el commit `da64a8c` se pegó un bloque que ya incluía Timeline. El mismo bloque pegado duplicaba Timeline en el pie (columna «Legal» + botón superior) y la barra inferior repetía «Aviso Legal» dos veces seguidas. `timeline.html` nunca estuvo duplicada: era marcado repetido en la home.
- **Arreglo:** el menú tiene ahora un único enlace Timeline; la columna «Legal» del pie solo contiene enlaces legales (la navegación ya está en el menú y en el botón Timeline del pie) y «Aviso Legal» aparece una vez.
