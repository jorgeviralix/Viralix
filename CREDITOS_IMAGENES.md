# Créditos y licencias de las imágenes

> Documento interno (no se publica en la web gracias a `.vercelignore`). Recoge la procedencia y licencia de **todas las imágenes añadidas en la rama `claude/ampliacion-viralix`**.

## Resumen

| Concepto | Detalle |
|---|---|
| Imágenes añadidas | 17 portadas (JPG + WebP) y 51 imágenes de cuerpo (WebP), más 46 versiones WebP optimizadas de las portadas antiguas, la imagen Open Graph por defecto y el logotipo |
| Tipo | Ilustraciones, mapas, cronologías, fichas y diagramas **de elaboración propia**, generados por código (`scripts/generar_imagenes.cjs`, `scripts/generar_marca.cjs`) |
| Fotografías de personas | **Ninguna**. No hay fotos de víctimas, de menores ni de escenas del crimen |
| Titular | Titular de VIRALIX (obra propia creada para el sitio). Puede licenciarlas como prefiera, por ejemplo CC BY 4.0 |
| Datos de terceros incorporados | Cartografía con licencias abiertas (ver abajo) y tipografías con licencia SIL Open Font License 1.1 |

### ¿Por qué no hay fotografías de Wikimedia Commons, Unsplash, Pexels o Pixabay?

El entorno en el que se hizo este trabajo **no tenía acceso de red** a `commons.wikimedia.org`, `upload.wikimedia.org`, `images.unsplash.com`, `images.pexels.com` ni `pixabay.com` (la política de red los bloqueaba). En lugar de dejar artículos sin imagen o usar imágenes de procedencia dudosa, se aplicó la alternativa prevista en el encargo —imagen temática— con la opción más segura en derechos: **imágenes originales** construidas con datos cartográficos abiertos y tipografías libres. Al final de este documento hay una lista de búsquedas sugeridas en Wikimedia Commons por si se quieren añadir fotografías históricas de dominio público más adelante.

## Fuentes de datos y recursos incorporados en las imágenes

| Recurso | Uso | Licencia | Atribución exigida |
|---|---|---|---|
| Natural Earth (vía paquete npm `world-atlas` 2.x) | Contornos de países y costas en todos los mapas | Dominio público | No (se cita igualmente) |
| Instituto Geográfico Nacional — Equipamiento Geográfico de Referencia Nacional (vía `es-atlas` 0.6) | Límites provinciales en los mapas de España | CC BY 4.0 | Sí: «© Instituto Geográfico Nacional». Incluida en cada mapa y pie de foto |
| U.S. Census Bureau — Cartographic Boundary Files (vía `us-atlas` 3.x) | Estados y condados en los mapas de EE. UU. | Dominio público (obra del Gobierno de EE. UU.) | No (se cita igualmente) |
| Bebas Neue, DM Sans, DM Serif Display, IBM Plex Mono, Source Serif 4 (vía Fontsource) | Texto dentro de las imágenes y tipografías autoalojadas en `assets/fonts/` | SIL Open Font License 1.1 | No para imágenes; la licencia permite incrustarlas |

## Imágenes por artículo

Todas en `images/articulos/`. Formato: portada en `.jpg` (Open Graph) y `.webp` (web), 1200×630; cuerpo en `.webp`, 1200 px de ancho.


### El crimen de la calle Fuencarral — `articulo-calle-fuencarral.html`

| Archivo | Tipo | Texto alternativo (alt) | Procedencia y licencia |
|---|---|---|---|
| `calle-fuencarral-portada.jpg`, `calle-fuencarral-portada.webp` | Portada | Ilustración editorial con un mapa de la Comunidad de Madrid y un marcador sobre la capital, junto al año 1888 y el título del caso | Elaboración propia de VIRALIX. Datos cartográficos: Instituto Geográfico Nacional de España (CC BY 4.0) y Natural Earth (dominio público). |
| `calle-fuencarral-mapa.webp` | Mapa | Mapa de la provincia de Madrid con un marcador sobre la capital, donde se encontraban la vivienda de la víctima y la Cárcel Modelo | Elaboración propia de VIRALIX. Datos cartográficos: Instituto Geográfico Nacional de España (CC BY 4.0) y Natural Earth (dominio público). |
| `calle-fuencarral-cronologia.webp` | Cronología | Infografía con la cronología del crimen de la calle Fuencarral, desde el asesinato en julio de 1888 hasta la ejecución en julio de 1890 | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |
| `calle-fuencarral-ficha.webp` | Ficha del caso | Ficha del caso del crimen de la calle Fuencarral con víctima, lugar, fecha, acusados, juicio, sentencia y ejecución | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |

### El Sacamantecas de Vitoria — `articulo-sacamantecas.html`

| Archivo | Tipo | Texto alternativo (alt) | Procedencia y licencia |
|---|---|---|---|
| `sacamantecas-portada.jpg`, `sacamantecas-portada.webp` | Portada | Ilustración editorial con el mapa de Álava resaltado y un marcador sobre Vitoria, junto a las fechas 1870-1879 | Elaboración propia de VIRALIX. Datos cartográficos: Instituto Geográfico Nacional de España (CC BY 4.0) y Natural Earth (dominio público). |
| `sacamantecas-mapa.webp` | Mapa | Mapa de la provincia de Álava con Vitoria y el pueblo de Eguílaz señalados | Elaboración propia de VIRALIX. Datos cartográficos: Instituto Geográfico Nacional de España (CC BY 4.0) y Natural Earth (dominio público). |
| `sacamantecas-cronologia.webp` | Cronología | Infografía con la cronología del caso del Sacamantecas desde 1821 hasta su ejecución en 1881 | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |
| `sacamantecas-ficha.webp` | Ficha del caso | Ficha del caso del Sacamantecas con nombre, apodo, nacimiento, periodo de los crímenes, víctimas, zona, condena y ejecución | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |

### Enriqueta Martí, la «vampira del Raval» — `articulo-enriqueta-marti.html`

| Archivo | Tipo | Texto alternativo (alt) | Procedencia y licencia |
|---|---|---|---|
| `enriqueta-marti-portada.jpg`, `enriqueta-marti-portada.webp` | Portada | Ilustración editorial con el mapa de la provincia de Barcelona y un marcador sobre el barrio del Raval, junto al año 1912 | Elaboración propia de VIRALIX. Datos cartográficos: Instituto Geográfico Nacional de España (CC BY 4.0) y Natural Earth (dominio público). |
| `enriqueta-marti-mapa.webp` | Mapa | Mapa de la provincia de Barcelona con el barrio del Raval y Sant Feliu de Llobregat señalados | Elaboración propia de VIRALIX. Datos cartográficos: Instituto Geográfico Nacional de España (CC BY 4.0) y Natural Earth (dominio público). |
| `enriqueta-marti-cronologia.webp` | Cronología | Infografía con la cronología del caso de Enriqueta Martí entre 1909 y 1913 | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |
| `enriqueta-marti-ficha.webp` | Ficha del caso | Ficha del caso de Enriqueta Martí con nombre, apodo periodístico, detención, lugar, hecho probado, acusaciones, juicio y muerte | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |

### El crimen de Fago — `articulo-crimen-fago.html`

| Archivo | Tipo | Texto alternativo (alt) | Procedencia y licencia |
|---|---|---|---|
| `crimen-fago-portada.jpg`, `crimen-fago-portada.webp` | Portada | Ilustración editorial con el mapa de la provincia de Huesca y un marcador sobre Fago, en el Pirineo, junto al año 2007 | Elaboración propia de VIRALIX. Datos cartográficos: Instituto Geográfico Nacional de España (CC BY 4.0) y Natural Earth (dominio público). |
| `crimen-fago-mapa.webp` | Mapa | Mapa de la provincia de Huesca con Fago, Jaca y la ciudad de Huesca señalados | Elaboración propia de VIRALIX. Datos cartográficos: Instituto Geográfico Nacional de España (CC BY 4.0) y Natural Earth (dominio público). |
| `crimen-fago-cronologia.webp` | Cronología | Infografía con la cronología del crimen de Fago desde la desaparición del alcalde en 2007 hasta el juicio de 2009 | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |
| `crimen-fago-ficha.webp` | Ficha del caso | Ficha del caso del crimen de Fago con víctima, lugar, fecha, arma, detenido, confesión, juicio y condena | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |

### El crimen de la Guardia Urbana — `articulo-guardia-urbana.html`

| Archivo | Tipo | Texto alternativo (alt) | Procedencia y licencia |
|---|---|---|---|
| `guardia-urbana-portada.jpg`, `guardia-urbana-portada.webp` | Portada | Ilustración editorial con el mapa de la provincia de Barcelona y un marcador en la comarca del Garraf, junto al año 2017 | Elaboración propia de VIRALIX. Datos cartográficos: Instituto Geográfico Nacional de España (CC BY 4.0) y Natural Earth (dominio público). |
| `guardia-urbana-mapa.webp` | Mapa | Mapa de la zona del Garraf y el Penedès con Cubelles, el pantano de Foix y Barcelona señalados | Elaboración propia de VIRALIX. Datos cartográficos: Instituto Geográfico Nacional de España (CC BY 4.0) y Natural Earth (dominio público). |
| `guardia-urbana-cronologia.webp` | Cronología | Infografía con la cronología del crimen de la Guardia Urbana desde mayo de 2017 hasta el estreno de la serie en 2023 | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |
| `guardia-urbana-ficha.webp` | Ficha del caso | Ficha del caso del crimen de la Guardia Urbana con víctima, lugar, hallazgo, detenidos, juicio, condenas y adaptaciones | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |

### El crimen de Los Galindos — `articulo-galindos.html`

| Archivo | Tipo | Texto alternativo (alt) | Procedencia y licencia |
|---|---|---|---|
| `galindos-portada.jpg`, `galindos-portada.webp` | Portada | Ilustración editorial con el mapa de la provincia de Sevilla y un marcador sobre Paradas, junto al año 1975 y el sello «sin resolver» | Elaboración propia de VIRALIX. Datos cartográficos: Instituto Geográfico Nacional de España (CC BY 4.0) y Natural Earth (dominio público). |
| `galindos-mapa.webp` | Mapa | Mapa de la provincia de Sevilla con Paradas y la capital señaladas | Elaboración propia de VIRALIX. Datos cartográficos: Instituto Geográfico Nacional de España (CC BY 4.0) y Natural Earth (dominio público). |
| `galindos-cronologia.webp` | Cronología | Infografía con la cronología del crimen de Los Galindos desde julio de 1975 hasta la prescripción en 1995 | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |
| `galindos-ficha.webp` | Ficha del caso | Ficha del caso del crimen de Los Galindos con lugar, fecha, víctimas, investigación, detenidos, situación judicial y estado | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |

### El caso Jarabo — `articulo-jarabo.html`

| Archivo | Tipo | Texto alternativo (alt) | Procedencia y licencia |
|---|---|---|---|
| `jarabo-portada.jpg`, `jarabo-portada.webp` | Portada | Ilustración editorial con el mapa de la Comunidad de Madrid y un marcador sobre la capital, junto al año 1958 | Elaboración propia de VIRALIX. Datos cartográficos: Instituto Geográfico Nacional de España (CC BY 4.0) y Natural Earth (dominio público). |
| `jarabo-mapa.webp` | Mapa | Mapa de la Comunidad de Madrid con la capital y la antigua prisión de Carabanchel señaladas | Elaboración propia de VIRALIX. Datos cartográficos: Instituto Geográfico Nacional de España (CC BY 4.0) y Natural Earth (dominio público). |
| `jarabo-cronologia.webp` | Cronología | Infografía con la cronología del caso Jarabo entre 1923 y 1959 | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |
| `jarabo-ficha.webp` | Ficha del caso | Ficha del caso Jarabo con autor, nacimiento, fecha de los crímenes, víctimas, lugar, móvil, condena y ejecución | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |

### Jack el Destripador — `articulo-jack-el-destripador.html`

| Archivo | Tipo | Texto alternativo (alt) | Procedencia y licencia |
|---|---|---|---|
| `jack-el-destripador-portada.jpg`, `jack-el-destripador-portada.webp` | Portada | Ilustración editorial con el mapa del sureste de Inglaterra y un marcador sobre el este de Londres, junto al año 1888 | Elaboración propia de VIRALIX. Datos cartográficos: Natural Earth (dominio público). |
| `jack-el-destripador-mapa.webp` | Mapa | Mapa del sureste de Inglaterra con Londres y el barrio de Whitechapel señalados | Elaboración propia de VIRALIX. Datos cartográficos: Natural Earth (dominio público). |
| `jack-el-destripador-cronologia.webp` | Cronología | Infografía con la cronología de los asesinatos de Whitechapel entre agosto y noviembre de 1888 | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |
| `jack-el-destripador-ficha.webp` | Ficha del caso | Ficha del caso de Jack el Destripador con lugar, fechas, víctimas canónicas, apodo, investigación, sospechosos y estado | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |

### El asesino del Zodiaco — `articulo-zodiaco.html`

| Archivo | Tipo | Texto alternativo (alt) | Procedencia y licencia |
|---|---|---|---|
| `zodiaco-portada.jpg`, `zodiaco-portada.webp` | Portada | Ilustración editorial con el mapa de la bahía de San Francisco y un marcador en Vallejo, junto a los años 1968-1969 | Elaboración propia de VIRALIX. Datos cartográficos: U.S. Census Bureau (dominio público) y Natural Earth (dominio público). |
| `zodiaco-mapa.webp` | Mapa | Mapa de la bahía de San Francisco con los cuatro escenarios de los ataques del Zodiaco señalados | Elaboración propia de VIRALIX. Datos cartográficos: U.S. Census Bureau (dominio público) y Natural Earth (dominio público). |
| `zodiaco-cronologia.webp` | Cronología | Infografía con la cronología de los ataques y las cartas del Zodiaco entre 1968 y 2020 | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |
| `zodiaco-ficha.webp` | Ficha del caso | Ficha del caso del asesino del Zodiaco con zona, fechas, víctimas confirmadas y reivindicadas, cartas, cifrados, sospechoso y estado | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |

### El secuestro Lindbergh — `articulo-lindbergh.html`

| Archivo | Tipo | Texto alternativo (alt) | Procedencia y licencia |
|---|---|---|---|
| `lindbergh-portada.jpg`, `lindbergh-portada.webp` | Portada | Ilustración editorial con el mapa de Nueva Jersey y Nueva York y un marcador cerca de Hopewell, junto al año 1932 | Elaboración propia de VIRALIX. Datos cartográficos: U.S. Census Bureau (dominio público) y Natural Earth (dominio público). |
| `lindbergh-mapa.webp` | Mapa | Mapa de Nueva Jersey y Nueva York con la casa de los Lindbergh, Flemington, el cementerio de St. Raymond y Trenton señalados | Elaboración propia de VIRALIX. Datos cartográficos: U.S. Census Bureau (dominio público) y Natural Earth (dominio público). |
| `lindbergh-cronologia.webp` | Cronología | Infografía con la cronología del caso Lindbergh entre 1932 y 1936 | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |
| `lindbergh-ficha.webp` | Ficha del caso | Ficha del caso Lindbergh con víctima, lugar, fecha, rescate, detenido, juicio, condena y consecuencia legal | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |

### El misterio de D. B. Cooper — `articulo-db-cooper.html`

| Archivo | Tipo | Texto alternativo (alt) | Procedencia y licencia |
|---|---|---|---|
| `db-cooper-portada.jpg`, `db-cooper-portada.webp` | Portada | Ilustración editorial con el mapa de los estados de Washington y Oregón, la ruta del vuelo 305 y un marcador en el suroeste de Washington, junto al año 1971 | Elaboración propia de VIRALIX. Datos cartográficos: U.S. Census Bureau (dominio público) y Natural Earth (dominio público). |
| `db-cooper-mapa.webp` | Mapa | Mapa de Washington y Oregón con la ruta del vuelo 305, los aeropuertos de Portland y Seattle, la zona probable del salto y Tena Bar | Elaboración propia de VIRALIX. Datos cartográficos: U.S. Census Bureau (dominio público) y Natural Earth (dominio público). |
| `db-cooper-cronologia.webp` | Cronología | Infografía con la cronología del caso D. B. Cooper entre 1971 y 2016 | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |
| `db-cooper-ficha.webp` | Ficha del caso | Ficha del caso D. B. Cooper con fecha, vuelo, secuestrador, rescate, salto, hallazgo del dinero, investigación y estado | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |

### El caso Lizzie Borden — `articulo-lizzie-borden.html`

| Archivo | Tipo | Texto alternativo (alt) | Procedencia y licencia |
|---|---|---|---|
| `lizzie-borden-portada.jpg`, `lizzie-borden-portada.webp` | Portada | Ilustración editorial con el mapa del sureste de Massachusetts y un marcador sobre Fall River, junto al año 1892 | Elaboración propia de VIRALIX. Datos cartográficos: U.S. Census Bureau (dominio público) y Natural Earth (dominio público). |
| `lizzie-borden-mapa.webp` | Mapa | Mapa del sureste de Massachusetts con Fall River, New Bedford y Taunton señalados | Elaboración propia de VIRALIX. Datos cartográficos: U.S. Census Bureau (dominio público) y Natural Earth (dominio público). |
| `lizzie-borden-cronologia.webp` | Cronología | Infografía con la cronología del caso Lizzie Borden entre 1892 y 1927 | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |
| `lizzie-borden-ficha.webp` | Ficha del caso | Ficha del caso Lizzie Borden con lugar, fecha, víctimas, acusada, juicio, veredicto y estado | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |

### El incidente del paso Diátlov — `articulo-paso-dyatlov.html`

| Archivo | Tipo | Texto alternativo (alt) | Procedencia y licencia |
|---|---|---|---|
| `paso-dyatlov-portada.jpg`, `paso-dyatlov-portada.webp` | Portada | Ilustración editorial con el mapa de los montes Urales y un marcador en el paso Diátlov, junto al año 1959 | Elaboración propia de VIRALIX. Datos cartográficos: Natural Earth (dominio público). |
| `paso-dyatlov-mapa.webp` | Mapa | Mapa del norte de los Urales con el paso Diátlov, la ciudad de Ivdel y Ekaterimburgo señalados | Elaboración propia de VIRALIX. Datos cartográficos: Natural Earth (dominio público). |
| `paso-dyatlov-cronologia.webp` | Cronología | Infografía con la cronología del incidente del paso Diátlov entre 1959 y 2021 | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |
| `paso-dyatlov-ficha.webp` | Ficha del caso | Ficha del caso del paso Diátlov con lugar, fecha, víctimas, superviviente, hallazgo y conclusiones de 1959 y 2020 | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |

### El misterio del Mary Celeste — `articulo-mary-celeste.html`

| Archivo | Tipo | Texto alternativo (alt) | Procedencia y licencia |
|---|---|---|---|
| `mary-celeste-portada.jpg`, `mary-celeste-portada.webp` | Portada | Ilustración editorial con el mapa del Atlántico Norte, la ruta desde Nueva York hacia las Azores y un marcador en el punto del hallazgo, junto al año 1872 | Elaboración propia de VIRALIX. Datos cartográficos: Natural Earth (dominio público). |
| `mary-celeste-mapa.webp` | Mapa | Mapa del Atlántico Norte con la ruta del Mary Celeste desde Nueva York, la isla de Santa María, el punto del hallazgo y Gibraltar | Elaboración propia de VIRALIX. Datos cartográficos: Natural Earth (dominio público). |
| `mary-celeste-cronologia.webp` | Cronología | Infografía con la cronología del caso del Mary Celeste entre 1872 y 1885 | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |
| `mary-celeste-ficha.webp` | Ficha del caso | Ficha del caso del Mary Celeste con barco, salida, carga, personas a bordo, hallazgo, posición, último registro y estado | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |

### Las caras de Bélmez — `articulo-caras-belmez.html`

| Archivo | Tipo | Texto alternativo (alt) | Procedencia y licencia |
|---|---|---|---|
| `caras-belmez-portada.jpg`, `caras-belmez-portada.webp` | Portada | Ilustración editorial con el mapa de la provincia de Jaén y un marcador sobre Bélmez de la Moraleda, junto al año 1971 | Elaboración propia de VIRALIX. Datos cartográficos: Instituto Geográfico Nacional de España (CC BY 4.0) y Natural Earth (dominio público). |
| `caras-belmez-mapa.webp` | Mapa | Mapa de la provincia de Jaén con Bélmez de la Moraleda y la capital señaladas | Elaboración propia de VIRALIX. Datos cartográficos: Instituto Geográfico Nacional de España (CC BY 4.0) y Natural Earth (dominio público). |
| `caras-belmez-cronologia.webp` | Cronología | Infografía con la cronología del caso de las caras de Bélmez desde 1971 hasta la actualidad | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |
| `caras-belmez-ficha.webp` | Ficha del caso | Ficha del caso de las caras de Bélmez con lugar, inicio, protagonista, fenómeno, investigadores, explicaciones y estado | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |

### La perfilación criminal — `articulo-perfil-criminal.html`

| Archivo | Tipo | Texto alternativo (alt) | Procedencia y licencia |
|---|---|---|---|
| `perfil-criminal-portada.jpg`, `perfil-criminal-portada.webp` | Portada | Ilustración editorial abstracta con líneas concéntricas que evocan una huella dactilar sobre fondo oscuro, junto al título del artículo | Elaboración propia de VIRALIX (arte generativo abstracto, sin datos de terceros). |
| `perfil-criminal-cronologia.webp` | Cronología | Infografía con la cronología de la perfilación criminal desde 1888 hasta 2007 | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |
| `perfil-criminal-ficha.webp` | Ficha del caso | Ficha de claves del perfil criminal con definición, origen, utilidad, límites, tipología, enfoques actuales y evidencia | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |
| `perfil-criminal-diagrama.webp` | Diagrama | Diagrama del modelo de seis etapas del FBI: recogida de datos, modelos de decisión, evaluación del crimen, perfil criminal, investigación y detención | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |

### Psicopatía: radiografía de un concepto — `articulo-psicopatia.html`

| Archivo | Tipo | Texto alternativo (alt) | Procedencia y licencia |
|---|---|---|---|
| `psicopatia-portada.jpg`, `psicopatia-portada.webp` | Portada | Ilustración editorial abstracta con líneas concéntricas violetas sobre fondo oscuro, junto al título del artículo sobre la psicopatía | Elaboración propia de VIRALIX (arte generativo abstracto, sin datos de terceros). |
| `psicopatia-cronologia.webp` | Cronología | Infografía con la cronología del concepto de psicopatía entre 1801 y 2013 | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |
| `psicopatia-ficha.webp` | Ficha del caso | Ficha de datos clave sobre la psicopatía con definición, instrumento de referencia, prevalencia, diagnóstico oficial, mitos y diferencias con la psicosis | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |
| `psicopatia-diagrama.webp` | Diagrama | Diagrama del modelo de dos factores y cuatro facetas de la psicopatía: interpersonal, afectiva, estilo de vida y antisocial | Infografía de elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo. |

## Otras imágenes añadidas

| Archivo | Descripción | Procedencia y licencia |
|---|---|---|
| `images/og-viralix.jpg` | Imagen Open Graph por defecto (1200×630) para páginas institucionales y la home | Elaboración propia de VIRALIX (tipografías OFL) |
| `images/logo-viralix.png` | Logotipo cuadrado (512×512) para JSON-LD y RSS | Elaboración propia de VIRALIX (tipografía OFL) |
| `images/optimizadas/img-*-800.webp` y `img-*-1200.webp` (46 archivos) | Versiones redimensionadas y comprimidas de las 23 portadas PNG existentes, usadas en las tarjetas de la home y en «Sigue leyendo» | Derivadas de las imágenes originales del sitio (`img-*.png`), que **no se han modificado ni borrado** |

## Imágenes que ya existían (no añadidas en esta rama)

Las 23 portadas `img-*.png` de la raíz ya estaban en el repositorio. Su procedencia no está documentada en el proyecto y por su aspecto parecen ilustraciones fotorrealistas generadas con herramientas de imagen. **Recomendación**: que el propietario confirme su origen y licencia y lo añada a este documento.

## Búsquedas sugeridas en Wikimedia Commons (para ampliar en el futuro)

Si más adelante se quiere añadir material histórico real, estas búsquedas suelen dar resultados de **dominio público** (comprobar siempre la licencia de cada archivo en su página de Commons y citarla en el pie de foto):

| Artículo | Búsqueda sugerida | Por qué suele ser libre |
|---|---|---|
| Jack el Destripador | «Illustrated Police News 1888», «Whitechapel 1888 map» | Prensa y mapas británicos de 1888 (dominio público por antigüedad) |
| Lindbergh | «Lindbergh kidnapping poster», «Hauptmann trial Flemington» | Carteles oficiales y fotos de prensa de los años treinta, muchos de dominio público en EE. UU. |
| D. B. Cooper | «D. B. Cooper FBI sketch», «Northwest Orient 727» | Los retratos robot del FBI son obra del Gobierno de EE. UU. |
| Zodiaco | «Zodiac Killer composite sketch» | Retrato robot policial difundido por las autoridades |
| Lizzie Borden | «Lizzie Borden house Fall River», «Borden trial 1893» | Fotografías del siglo XIX y fotos actuales con licencia CC |
| Mary Celeste | «Amazon 1861 brigantine painting», «Mary Celeste» | Pintura de 1861 de dominio público |
| Paso Diátlov | «Dyatlov Pass memorial», «Kholat Syakhl» | Fotos actuales del lugar con licencia CC |
| Crimen de la calle Fuencarral | «Higinia Balaguer», «La Correspondencia de España 1888» | Grabados y prensa del siglo XIX |
| Sacamantecas | «Vitoria siglo XIX grabado» | Grabados históricos de dominio público |
| Caras de Bélmez | «Bélmez de la Moraleda» | Fotos del pueblo con licencia CC |

**No usar**: fotografías de víctimas (salvo figuras históricas con licencia libre y uso justificado), imágenes de menores, escenas del crimen ni cualquier imagen con copyright.

