#!/usr/bin/env python3
"""VIRALIX — constructor de páginas estáticas.

Convierte las fuentes Markdown de `contenido/` en páginas HTML listas para
publicar en la raíz del sitio (mismo formato y nomenclatura que el resto de la
web: `articulo-<slug>.html`), genera las imágenes editoriales y actualiza
sitemap.xml, feed.xml y las secciones automáticas de index.html.

Uso:
    python3 scripts/construir.py              # páginas + sitemap + feed + home
    python3 scripts/construir.py --imagenes   # además regenera las imágenes (Node + Playwright)

No necesita dependencias externas salvo Pillow (para convertir imágenes).
"""
from __future__ import annotations

import datetime as dt
import html
import json
import math
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://www.viralixweb.es"
CONT = ROOT / "contenido"
IMG_DIR = ROOT / "images" / "articulos"
OPT_DIR = ROOT / "images" / "optimizadas"
TMP_PNG = ROOT / "scripts" / ".tmp-png"
HOY = "2026-11-03"
ADSENSE = "ca-pub-5337247644569859"

CATS = {
    "es": {"nombre": "True Crime España", "corto": "True Crime", "ancla": "true-crime", "clase": "cat-es"},
    "intl": {"nombre": "Casos internacionales", "corto": "Internacional", "ancla": "internacional", "clase": "cat-intl"},
    "mist": {"nombre": "Misterios", "corto": "Misterios", "ancla": "misterios", "clase": "cat-mist"},
    "crim": {"nombre": "Criminología", "corto": "Criminología", "ancla": "criminologia", "clase": "cat-crim"},
    "ciencia": {"nombre": "Ciencia", "corto": "Ciencia", "ancla": "ciencia", "clase": "cat-ciencia"},
}

CREDITO_MAPA = {
    "es": "Datos: © Instituto Geográfico Nacional (CC BY 4.0) y Natural Earth (dominio público)",
    "world": "Datos: Natural Earth (dominio público)",
    "us": "Datos: U.S. Census Bureau y Natural Earth (dominio público)",
}

# Artículos publicados antes de esta ampliación (para relacionados, sitemap, RSS y aleatorio).
ARTS: list = []

ANTIGUOS = [
    ("alcasser", "Caso Alcàsser: 30 años de preguntas sin respuesta", "es", "Valencia · 1992"),
    ("wanninkhof", "Caso Wanninkhof: condenaron a una inocente", "es", "Marbella · 1999"),
    ("marta-castillo", "Marta del Castillo: 17 años buscando su cuerpo", "es", "Sevilla · 2009"),
    ("diana-quer", "Caso Diana Quer: 500 días buscándola", "es", "Galicia · 2016"),
    ("asunta", "El caso Asunta", "es", "Santiago · 2013"),
    ("asesino-baraja", "El asesino de la baraja", "es", "Madrid · 2003"),
    ("katana", "El asesino de la katana", "es", "Murcia · 2000"),
    ("puerto-hurraco", "La matanza de Puerto Hurraco", "es", "Badajoz · 1990"),
    ("crimen-rol", "El crimen del rol", "es", "Madrid · 1994"),
    ("urquijo", "El crimen de los marqueses de Urquijo", "es", "Madrid · 1980"),
    ("el-lute", "El Lute: escapó dos veces y se convirtió en leyenda", "es", "España · 1965"),
    ("crimen-cuenca", "El crimen de Cuenca: el error judicial", "es", "Cuenca · 1910"),
    ("marta-calvo", "Caso Marta Calvo", "es", "Valencia · 2019"),
    ("wanninkhof-bis", "Wanninkhof: el asesino que mató de nuevo", "es", "Marbella · 2003"),
    ("aguilar", "Las niñas de Aguilar", "es", "Palencia · 1992"),
    ("arropiero", "El Arropiero", "es", "España · 1964-1971"),
    ("breton", "Caso Bretón", "es", "Córdoba · 2011"),
    ("envenenadora", "La envenenadora de Valencia", "es", "Valencia · 1959"),
    ("eclipse-2026", "Eclipse solar del 12 de agosto de 2026", "ciencia", "España · 2026"),
    ("super-elnino", "Super El Niño 2026", "ciencia", "Global · 2026"),
    ("marianas", "Qué hay realmente en la fosa de las Marianas", "ciencia", "Océano Pacífico"),
    ("hantavirus", "Hantavirus: el brote del crucero Hondius", "ciencia", "Antártida"),
    ("falsos-recuerdos", "Falsos recuerdos: cuando recuerdas lo que nunca pasó", "ciencia", "Psicología"),
]

# ---------------------------------------------------------------------------
# Utilidades
# ---------------------------------------------------------------------------

def e(s) -> str:
    return html.escape(str(s if s is not None else ""), quote=True)


def slugify(t: str) -> str:
    t = t.lower()
    for a, b in (("á", "a"), ("é", "e"), ("í", "i"), ("ó", "o"), ("ú", "u"), ("ü", "u"), ("ñ", "n"), ("à", "a"), ("è", "e"), ("ò", "o"), ("ç", "c")):
        t = t.replace(a, b)
    t = re.sub(r"[^a-z0-9]+", "-", t).strip("-")
    return t[:60] or "seccion"


def leer_md(path: Path):
    txt = path.read_text(encoding="utf-8")
    meta, body = {}, txt
    if txt.startswith("---"):
        _, fm, body = txt.split("---", 2)
        for line in fm.strip().splitlines():
            if not line.strip() or line.lstrip().startswith("#"):
                continue
            k, _, v = line.partition(":")
            v = v.strip()
            if v.startswith("{") or v.startswith("["):
                v = json.loads(v)
            meta[k.strip()] = v
    return meta, body.strip("\n")


def inline(t: str) -> str:
    """Markdown en línea: **negrita**, *cursiva*, [texto](url). Escapa HTML."""
    t = e(t).replace("&#x27;", "'")
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])", r"<em>\1</em>", t)

    def link(m):
        txt, url = m.group(1), html.unescape(m.group(2))
        ext = url.startswith("http")
        attrs = ' target="_blank" rel="noopener noreferrer"' if ext else ""
        return f'<a href="{e(url)}"{attrs}>{txt}</a>'

    t = re.sub(r"\[([^\]]+)\]\(([^)\s]+)\)", link, t)
    return t


def palabras(txt: str) -> int:
    return len(re.findall(r"[\wÀ-ÿ]+", re.sub(r"<[^>]+>", " ", txt)))


def img_size(p: Path):
    try:
        from PIL import Image
        with Image.open(p) as im:
            return im.size
    except Exception:
        return (1200, 800)


# ---------------------------------------------------------------------------
# Markdown por bloques
# ---------------------------------------------------------------------------

class Render:
    def __init__(self, slug: str, meta: dict):
        self.slug = slug
        self.meta = meta
        self.toc = []  # (id, texto)
        self.cronologia = []
        self.ficha = []
        self.fuentes_html = ""
        self.imagenes = []  # (tipo, alt, pie)

    def figura(self, tipo: str, alt: str, pie: str) -> str:
        src = f"images/articulos/{self.slug}-{tipo}.webp"
        w, h = img_size(ROOT / src)
        src = "/" + src
        if tipo == "mapa":
            base = (self.meta.get("mapa") or {}).get("base", "world")
            cred = f"Mapa: elaboración propia de VIRALIX. {CREDITO_MAPA[base]}."
        elif tipo == "portada":
            cred = "Ilustración: elaboración propia de VIRALIX."
        else:
            cred = "Infografía: elaboración propia de VIRALIX a partir de las fuentes citadas."
        self.imagenes.append((tipo, alt, pie))
        wide = " wide" if tipo in ("mapa", "diagrama") else ""
        return (f'<figure class="fx-fade{wide}"><img src="{src}" alt="{e(alt)}" width="{w}" height="{h}" loading="lazy" decoding="async">'
                f'<figcaption>{inline(pie)}<span class="credit">{e(cred)}</span></figcaption></figure>')

    def bloques(self, body: str) -> str:
        out, lines, i = [], body.splitlines(), 0
        para = []

        def flush():
            if para:
                out.append(f"<p>{inline(' '.join(para))}</p>")
                para.clear()

        while i < len(lines):
            ln = lines[i]
            s = ln.strip()
            if not s:
                flush(); i += 1; continue
            if s.startswith(":::"):
                flush()
                kind, _, arg = s[3:].strip().partition(" ")
                j = i + 1
                block = []
                while j < len(lines) and lines[j].strip() != ":::":
                    block.append(lines[j]); j += 1
                i = j + 1
                out.append(self.bloque_especial(kind, arg.strip(), block))
                continue
            if s.startswith("<"):
                flush()
                j = i
                raw = []
                while j < len(lines) and lines[j].strip():
                    raw.append(lines[j]); j += 1
                out.append("\n".join(raw)); i = j; continue
            m = re.match(r"^(#{2,3})\s+(.*)$", s)
            if m:
                flush()
                lvl, txt = len(m.group(1)), m.group(2)
                if lvl == 2:
                    hid = slugify(txt)
                    self.toc.append((hid, txt))
                    out.append(f'<h2 id="{hid}">{inline(txt)}</h2>')
                else:
                    out.append(f"<h3>{inline(txt)}</h3>")
                i += 1; continue
            m = re.match(r'^!\[(.+?)\]\((\w+)(?:\s+"(.+)")?\)$', s)
            if m:
                flush(); out.append(self.figura(m.group(2), m.group(1), m.group(3) or "")); i += 1; continue
            if s.startswith("> "):
                flush()
                q = []
                while i < len(lines) and lines[i].strip().startswith(">"):
                    q.append(lines[i].strip()[1:].strip()); i += 1
                cite = ""
                if q and q[-1].startswith("— "):
                    cite = f"<cite>{inline(q.pop()[2:])}</cite>"
                out.append(f"<blockquote><p>{inline(' '.join(q))}</p>{cite}</blockquote>")
                continue
            if re.match(r"^[-*] ", s) or re.match(r"^\d+\. ", s):
                flush()
                ordered = bool(re.match(r"^\d+\. ", s))
                items = []
                while i < len(lines) and (re.match(r"^\s*[-*] ", lines[i]) or re.match(r"^\s*\d+\. ", lines[i])):
                    items.append(re.sub(r"^\s*(?:[-*]|\d+\.)\s+", "", lines[i])); i += 1
                tag = "ol" if ordered else "ul"
                out.append(f"<{tag}>" + "".join(f"<li>{inline(x)}</li>" for x in items) + f"</{tag}>")
                continue
            if s.startswith("|"):
                flush()
                rows = []
                while i < len(lines) and lines[i].strip().startswith("|"):
                    rows.append([c.strip() for c in lines[i].strip().strip("|").split("|")]); i += 1
                head, body_rows = rows[0], [r for r in rows[2:]]
                t = "<div class=\"table-wrap\"><table><thead><tr>" + "".join(f"<th scope=\"col\">{inline(c)}</th>" for c in head) + "</tr></thead><tbody>"
                t += "".join("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>" for r in body_rows)
                out.append(t + "</tbody></table></div>")
                continue
            if s == "---":
                flush(); out.append("<hr>"); i += 1; continue
            para.append(s); i += 1
        flush()
        return "\n".join(out)

    def bloque_especial(self, kind: str, arg: str, block: list[str]) -> str:
        if kind == "ficha":
            filas = []
            for ln in block:
                if ":" in ln:
                    k, _, v = ln.partition(":")
                    filas.append((k.strip(), v.strip()))
            self.ficha = filas
            titulo = arg or "Ficha del caso"
            dl = "".join(f"<dt>{inline(k)}</dt><dd>{inline(v)}</dd>" for k, v in filas)
            return f'<aside class="ficha fx-fade" aria-label="{e(titulo)}"><p class="ficha__title">{e(titulo)}</p><dl>{dl}</dl></aside>'
        if kind == "cronologia":
            items = []
            for ln in block:
                ln = ln.strip()
                if not ln:
                    continue
                ln = re.sub(r"^-\s*", "", ln)
                f, _, t = ln.partition("|")
                items.append((f.strip(), t.strip()))
            self.cronologia = items
            lis = "".join(f'<li><span class="fecha">{e(f)}</span><span class="hecho">{inline(t)}</span></li>' for f, t in items)
            return f'<ol class="cronologia" aria-label="Cronología">{lis}</ol>'
        if kind == "nota":
            ps = "".join(f"<p>{inline(p)}</p>" for p in " ".join(x.strip() if x.strip() else "\n" for x in block).split("\n") if p.strip())
            return f'<aside class="nota"><span class="nota__title">{e(arg or "Nota")}</span>{ps}</aside>'
        if kind == "fuentes":
            items = [re.sub(r"^\s*(?:[-*]|\d+\.)\s+", "", x) for x in block if x.strip()]
            self.fuentes_html = ('<section class="fuentes" aria-labelledby="fuentes"><h2 id="fuentes">Fuentes y bibliografía</h2><ol>'
                                 + "".join(f"<li>{inline(x)}</li>" for x in items) + "</ol></section>")
            return ""
        raise ValueError(f"Bloque desconocido: {kind}")


# ---------------------------------------------------------------------------
# Plantillas comunes
# ---------------------------------------------------------------------------

FONTS = ("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700"
         "&family=DM+Serif+Display&family=IBM+Plex+Mono&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap")

CONSENT = """<script>/* VIRALIX: consentimiento por defecto antes de AdSense (ver cookies-banner.js) */
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
(function(){var c=null;try{c=localStorage.getItem('viralix_cookies_accepted');}catch(e){}var ok=c==='all';
gtag('consent','default',{ad_storage:ok?'granted':'denied',ad_user_data:ok?'granted':'denied',ad_personalization:ok?'granted':'denied',analytics_storage:'denied'});
window.adsbygoogle=window.adsbygoogle||[];window.adsbygoogle.requestNonPersonalizedAds=ok?0:1;window.adsbygoogle.pauseAdRequests=c?0:1;})();
</script>"""

THEME_INIT = "<script>try{if(localStorage.getItem('viralix_mode')==='light')document.documentElement.setAttribute('data-theme','light')}catch(e){}</script>"

ICON = {
    "moon": '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    "sun": '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 1.5v2.5M12 20v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M1.5 12H4M20 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8"/></svg>',
    "menu": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    "search": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    "up": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
    "wa": '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.6-.3z"/></svg>',
    "x": '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.8 3h3l-6.6 7.6L22 21h-6.1l-4.8-6.2L5.6 21h-3l7.1-8.1L2.2 3h6.2l4.3 5.7L17.8 3zm-1 16.2h1.7L7.3 4.7H5.5l11.3 14.5z"/></svg>',
    "tg": '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.9 4.3 18.7 19.4c-.2 1.1-.9 1.3-1.8.8l-4.8-3.6-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2l-11 6.9-4.7-1.5c-1-.3-1-1 .2-1.5L20.5 3c.9-.3 1.6.2 1.4 1.3z"/></svg>',
    "fb": '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8V6.3c0-.8.2-1.3 1.4-1.3H17V2h-2.6C11.6 2 10.6 3.4 10.6 5.9V8H8v3h2.6v11H14V11h2.7l.4-3H14z"/></svg>',
    "link": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.1 0l3-3A5 5 0 0 0 13 2.9l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.1 0l-3 3A5 5 0 0 0 11 21.1l1.7-1.7"/></svg>',
    "share": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>',
}

NAV = [
    ("/", "Inicio"),
    ("/#true-crime", "True Crime"),
    ("/#internacional", "Internacional"),
    ("/#misterios", "Misterios"),
    ("/#criminologia", "Criminología"),
    ("/timeline.html", "Timeline"),
    ("/sobre.html", "Sobre VIRALIX"),
    ("/contacto.html", "Contacto"),
]


def header(actual: str = "") -> str:
    items = "".join(
        f'<li><a href="{h}"{" aria-current=\"page\"" if actual and h.lstrip("/") == actual else ""}>{t}</a></li>' for h, t in NAV)
    return f"""<a class="skip-link" href="#contenido">Saltar al contenido</a>
<div class="read-progress" aria-hidden="true"><span></span></div>
<header class="site-header">
  <div class="site-header__inner">
    <a href="/" class="brand" aria-label="VIRALIX, ir a la portada">VIRAL<span>I</span>X</a>
    <nav class="main-nav" id="main-nav" aria-label="Principal"><ul>{items}</ul></nav>
    <div class="header-actions">
      <a class="icon-btn" href="/#buscar" aria-label="Buscar en VIRALIX">{ICON['search']}</a>
      <button class="icon-btn theme-toggle" type="button" data-theme-toggle aria-pressed="false" aria-label="Activar modo claro">{ICON['moon']}{ICON['sun']}</button>
      <button class="icon-btn menu-toggle" type="button" data-menu-toggle aria-controls="main-nav" aria-expanded="false" aria-label="Abrir menú">{ICON['menu']}</button>
    </div>
  </div>
</header>"""


FOOTER = f"""<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="/" class="brand">VIRAL<span>I</span>X</a>
        <p>Divulgación rigurosa sobre crímenes reales, misterios y criminología. Contada con fuentes, contexto y respeto por las víctimas.</p>
      </div>
      <div class="footer-col"><h2>Secciones</h2><ul>
        <li><a href="/#true-crime">True crime España</a></li>
        <li><a href="/#internacional">Casos internacionales</a></li>
        <li><a href="/#misterios">Misterios</a></li>
        <li><a href="/#criminologia">Criminología</a></li>
        <li><a href="/timeline.html">Timeline del crimen</a></li>
      </ul></div>
      <div class="footer-col"><h2>VIRALIX</h2><ul>
        <li><a href="/sobre.html">Sobre VIRALIX</a></li>
        <li><a href="/autor/jorge-de-la-fuente.html">El autor</a></li>
        <li><a href="/metodologia.html">Metodología editorial</a></li>
        <li><a href="/contacto.html">Contacto</a></li>
        <li><a href="/feed.xml">RSS</a></li>
      </ul></div>
      <div class="footer-col"><h2>Legal</h2><ul>
        <li><a href="/aviso-legal.html">Aviso legal</a></li>
        <li><a href="/privacidad.html">Política de privacidad</a></li>
        <li><a href="/cookies.html">Política de cookies</a></li>
        <li><a href="/terminos.html">Términos de uso</a></li>
      </ul></div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 VIRALIX · Contenido divulgativo e informativo</span>
      <nav aria-label="Legal"><a href="/privacidad.html">Privacidad</a><a href="/cookies.html">Cookies</a><button type="button" data-cookie-settings>Configurar cookies</button></nav>
    </div>
  </div>
</footer>
<button class="to-top" type="button" aria-label="Volver arriba">{ICON['up']}</button>"""


def head(title: str, desc: str, canonical: str, og_type: str, image: str, image_alt: str,
         extra_meta: str = "", jsonld: list | None = None, robots: str = "index, follow, max-image-preview:large") -> str:
    ld = "".join(f'<script type="application/ld+json">{json.dumps(j, ensure_ascii=False)}</script>\n' for j in (jsonld or []))
    return f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<meta name="robots" content="{robots}">
<link rel="canonical" href="{canonical}">
<meta name="theme-color" content="#07080c">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="manifest" href="/manifest.json">
<link rel="alternate" type="application/rss+xml" title="VIRALIX RSS" href="{SITE}/feed.xml">
<meta property="og:site_name" content="VIRALIX">
<meta property="og:locale" content="es_ES">
<meta property="og:type" content="{og_type}">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="{e(image_alt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{e(title)}">
<meta name="twitter:description" content="{e(desc)}">
<meta name="twitter:image" content="{image}">
<meta name="twitter:image:alt" content="{e(image_alt)}">
{extra_meta}{THEME_INIT}
{CONSENT}
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={ADSENSE}" crossorigin="anonymous"></script>
<link rel="preload" href="/assets/fonts/dm-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/source-serif-4-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/fuentes.css">
<link rel="stylesheet" href="/assets/css/viralix.css">
{ld}</head>"""


SCRIPTS = '<script src="/assets/js/viralix.js" defer></script>\n<script src="/cookies-banner.js" defer></script>'

ORG = {"@type": "Organization", "name": "VIRALIX", "url": SITE + "/",
       "logo": {"@type": "ImageObject", "url": SITE + "/images/logo-viralix.png", "width": 512, "height": 512}}


def share_block(url: str, titulo: str) -> str:
    from urllib.parse import quote
    u, t = quote(url, safe=""), quote(titulo, safe="")
    return f"""<div class="share" aria-label="Compartir este artículo">
  <span class="share__label">Compartir</span>
  <a href="https://api.whatsapp.com/send?text={t}%20{u}" target="_blank" rel="noopener noreferrer">{ICON['wa']}<span>WhatsApp</span></a>
  <a href="https://twitter.com/intent/tweet?url={u}&amp;text={t}" target="_blank" rel="noopener noreferrer">{ICON['x']}<span>X</span></a>
  <a href="https://www.facebook.com/sharer/sharer.php?u={u}" target="_blank" rel="noopener noreferrer">{ICON['fb']}<span>Facebook</span></a>
  <a href="https://t.me/share/url?url={u}&amp;text={t}" target="_blank" rel="noopener noreferrer">{ICON['tg']}<span>Telegram</span></a>
  <button type="button" data-copy-link="{e(url)}">{ICON['link']}<span>Copiar enlace</span></button>
  <button type="button" data-native-share="{e(url)}">{ICON['share']}<span>Más</span></button>
</div>"""


def fecha_larga(iso: str) -> str:
    meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
    d = dt.date.fromisoformat(iso)
    return f"{d.day} de {meses[d.month - 1]} de {d.year}"


# ---------------------------------------------------------------------------
# Artículos
# ---------------------------------------------------------------------------

def cargar_articulos():
    arts = []
    for p in sorted((CONT / "articulos").glob("*.md")):
        meta, body = leer_md(p)
        meta["slug"] = p.stem
        r = Render(p.stem, meta)
        meta["_html"] = r.bloques(body)
        meta["_r"] = r
        meta["_palabras"] = palabras(meta["_html"]) + palabras(meta.get("entradilla", ""))
        arts.append(meta)
    orden = {"es": 0, "intl": 1, "mist": 2, "crim": 3}
    arts.sort(key=lambda a: (orden[a["categoria"]], a.get("orden", "50"), a["slug"]))
    return arts


def card_html(slug, titulo, cat, meta_txt, img, img_w=1200, img_h=630, extra_class="") -> str:
    c = CATS[cat]
    return (f'<article class="card {c["clase"]}{extra_class}">'
            f'<div class="card__img"><img src="/{img}" alt="" width="{img_w}" height="{img_h}" loading="lazy" decoding="async"></div>'
            f'<div class="card__body"><span class="chip">{e(c["corto"])}</span>'
            f'<h3 class="card__title"><a href="/articulo-{slug}.html">{e(titulo)}</a></h3>'
            f'<span class="card__meta">{e(meta_txt)}</span></div></article>')


AUTOR = {"nombre": "Jorge de la Fuente Gutiérrez", "corto": "Jorge de la Fuente", "url": "/autor/jorge-de-la-fuente.html"}


def _ficha_rel(slug, arts):
    """(slug, título, categoría, meta, imagen, ancho, alto) de cualquier artículo, nuevo o antiguo."""
    n = next((x for x in arts if x["slug"] == slug), None)
    if n:
        return (n["slug"], n["titulo_corto"], n["categoria"], f'{n["lugar"]} · {n["anio"]}', f'images/articulos/{n["slug"]}-portada.webp', 1200, 630)
    o = next((x for x in ANTIGUOS if x[0] == slug), None)
    if o:
        return (o[0], o[1], o[2], o[3], f"images/optimizadas/img-{o[0]}-800.webp", 800, 533)
    return None


def relacionados_bloque(a, arts) -> str:
    """Bloque «Artículos relacionados» (4 enlaces elegidos a mano por tema, época o categoría)."""
    fichas = [f for f in (_ficha_rel(x.strip(), arts) for x in a.get("relacionados", "").split(",") if x.strip()) if f][:4]
    if not fichas:
        return ""
    cards = "".join(
        f'<article class="card {CATS[c]["clase"]}"><div class="card__img"><img src="/{img}" alt="" width="{w}" height="{h}" loading="lazy" decoding="async"></div>'
        f'<div class="card__body"><span class="chip">{e(CATS[c]["corto"])}</span><p class="card__title"><a href="/articulo-{s_}.html">{e(t)}</a></p>'
        f'<span class="card__meta">{e(m)}</span></div></article>'
        for s_, t, c, m, img, w, h in fichas)
    return f'<section class="relacionados" aria-labelledby="relacionados"><h2 id="relacionados">Artículos relacionados</h2><div class="cards">{cards}</div></section>'


def relacionados(a, arts):
    """Sección inferior «Más casos en VIRALIX»: otras categorías, sin repetir los relacionados."""
    usados = {x.strip() for x in a.get("relacionados", "").split(",")} | {a["slug"]}
    otros = [x for x in arts if x["slug"] not in usados and x["categoria"] != a["categoria"]]
    otros += [x for x in arts if x["slug"] not in usados and x["categoria"] == a["categoria"] and x not in otros]
    cards = []
    for x in otros[:3]:
        cards.append(card_html(x["slug"], x["titulo_corto"], x["categoria"], f'{x["lugar"]} · {x["anio"]}', f'images/articulos/{x["slug"]}-portada.webp'))
    return "\n".join(cards)



def extracto(html_txt: str, limite: int = 600) -> str:
    """Texto plano de las primeras frases del artículo para articleBody (vista previa)."""
    t = html.unescape(re.sub(r"<(figure|aside|ol|table)[^>]*>.*?</\1>", " ", html_txt, flags=re.S))
    t = re.sub(r"<[^>]+>", " ", t)
    t = re.sub(r"\s+", " ", t).strip()
    if len(t) <= limite:
        return t
    corte = t[:limite].rsplit(" ", 1)[0]
    return corte.rstrip(",;:") + "…"


def nota_autor_html(a) -> str:
    """Bloque «Nota del autor» al final del artículo (campo nota_autor del Markdown)."""
    if not a.get("nota_autor"):
        return ""
    return (f'<aside class="nota nota-autor" aria-label="Nota del autor"><span class="nota__title">Nota del autor</span>'
            f'<p>{inline(a["nota_autor"])}</p>'
            f'<p><em>— <a href="{AUTOR["url"]}">{AUTOR["corto"]}</a>, fundador y editor de VIRALIX</em></p></aside>')


def render_articulo(a, arts):
    slug, r = a["slug"], a["_r"]
    cat = CATS[a["categoria"]]
    url = f"{SITE}/articulo-{slug}.html"
    cover_jpg = f"{SITE}/images/articulos/{slug}-portada.jpg"
    cover_alt = a.get("alt_portada", f"Portada de VIRALIX: {a['titulo_corto']}")
    minutos = max(4, math.ceil(a["_palabras"] / 220))
    title = f'{a["titulo_seo"]} | VIRALIX'
    jsonld = [
        {"@context": "https://schema.org", "@type": "Article", "@id": url + "#articulo",
         "headline": a["titulo"][:110], "alternativeHeadline": a["titulo_seo"], "description": a["descripcion"],
         "image": [{"@type": "ImageObject", "url": cover_jpg, "width": 1200, "height": 630, "caption": cover_alt}],
         "thumbnailUrl": f"{SITE}/images/articulos/{slug}-portada.webp",
         "datePublished": a["publicado"] + "T09:00:00+01:00", "dateModified": a["actualizado"] + "T09:00:00+01:00",
         "inLanguage": "es-ES", "articleSection": cat["nombre"], "keywords": a.get("palabras_clave", ""),
         "wordCount": a["_palabras"], "isAccessibleForFree": True,
         "articleBody": extracto(a["entradilla"] + " " + a["_html"], 600),
         "author": {"@type": "Person", "@id": SITE + AUTOR["url"] + "#persona", "name": AUTOR["nombre"],
                    "url": SITE + AUTOR["url"], "jobTitle": "Fundador y editor de VIRALIX"},
         "publisher": ORG,
         "mainEntityOfPage": {"@type": "WebPage", "@id": url}},
        {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Inicio", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": cat["nombre"], "item": f"{SITE}/#{cat['ancla']}"},
            {"@type": "ListItem", "position": 3, "name": a["titulo_corto"], "item": url}]},
    ]
    extra = (f'<meta property="article:published_time" content="{a["publicado"]}T09:00:00+01:00">\n'
             f'<meta property="article:modified_time" content="{a["actualizado"]}T09:00:00+01:00">\n'
             f'<meta property="article:section" content="{e(cat["nombre"])}">\n'
             f'<meta name="author" content="{AUTOR["nombre"]}">\n')
    toc = "".join(f'<li><a href="#{i}">{inline(t)}</a></li>' for i, t in r.toc)
    estado = f'<span class="status-pill">{e(a["estado"])}</span>' if a.get("estado") else ""
    w, h = img_size(IMG_DIR / f"{slug}-portada.webp")
    page = f"""{head(title, a['descripcion'], url, 'article', cover_jpg, cover_alt, extra, jsonld)}
<body class="page-articulo {cat['clase']}">
{header()}
<main id="contenido">
  <article class="container" itemscope itemtype="https://schema.org/Article">
    <nav class="breadcrumbs" aria-label="Migas de pan"><ol><li><a href="/">Inicio</a></li><li><a href="/#{cat['ancla']}">{e(cat['nombre'])}</a></li><li aria-current="page">{e(a['titulo_corto'])}</li></ol></nav>
    <header class="article-hero">
      <div class="article-hero__head">
        <a class="chip" href="/#{cat['ancla']}">{e(cat['nombre'])}</a>
        <h1 itemprop="headline">{e(a['titulo'])}</h1>
        <p class="article-dek">{inline(a['entradilla'])}</p>
      </div>
      <div class="article-meta">
        <span>Escrito por <a href="{AUTOR['url']}" rel="author"><strong>{AUTOR['corto']}</strong></a></span>
        <span>Publicado el <time datetime="{a['publicado']}">{fecha_larga(a['publicado'])}</time></span>
        <span>{minutos} min de lectura</span>
        <span>{e(a['lugar'])} · {e(a['anio'])}</span>
        {estado}
      </div>
      <figure class="cover">
        <picture><source srcset="/images/articulos/{slug}-portada.webp" type="image/webp"><img src="/images/articulos/{slug}-portada.jpg" alt="{e(cover_alt)}" width="{w}" height="{h}" fetchpriority="high" decoding="async"></picture>
        <figcaption>{inline(a.get('pie_portada', 'Ilustración de portada.'))}<span class="credit">Ilustración: elaboración propia de VIRALIX{('. ' + CREDITO_MAPA[a['mapa']['base']]) if a.get('mapa') else ''}.</span></figcaption>
      </figure>
    </header>
    <div class="article-layout">
      <nav class="toc" aria-label="Índice del artículo"><div class="toc__box"><p class="toc__title">En este artículo</p><ol>{toc}</ol></div></nav>
      <div class="prose" itemprop="articleBody">
{a['_html']}
{r.fuentes_html}
{relacionados_bloque(a, arts)}
{nota_autor_html(a)}
{share_block(url, a['titulo_seo'])}
        <aside class="author-box" aria-label="Sobre el autor"><div class="author-box__avatar" aria-hidden="true">JF</div><div><h2><a href="{AUTOR['url']}" rel="author">{AUTOR['nombre']}</a></h2><p>Fundador y editor de VIRALIX. Escribe sobre crímenes reales, misterios y criminología desde la provincia de Jaén siguiendo nuestra <a href="/metodologia.html">metodología editorial</a>. <a href="{AUTOR['url']}">Ver perfil y artículos</a>. ¿Has visto un error? <a href="/contacto.html">Escríbenos</a> y lo revisamos.</p></div></aside>
        <p class="updated">Última revisión: <time datetime="{a['actualizado']}">{fecha_larga(a['actualizado'])}</time>.</p>
      </div>
    </div>
  </article>
  <section class="related" aria-labelledby="rel-title"><div class="container">
    <h2 class="section-title" id="rel-title">Más casos en <span>VIRALIX</span></h2>
    <div class="cards">{relacionados(a, arts)}</div>
  </div></section>
</main>
{FOOTER}
{SCRIPTS}
</body>
</html>
"""
    (ROOT / f"articulo-{slug}.html").write_text(page, encoding="utf-8")


# ---------------------------------------------------------------------------
# Páginas institucionales
# ---------------------------------------------------------------------------

def render_paginas():
    hechas = []
    for p in sorted((CONT / "paginas").glob("*.md")):
        meta, body = leer_md(p)
        archivo = meta["archivo"]
        r = Render(p.stem, meta)
        cuerpo = r.bloques(body)
        if "{{ALEATORIO}}" in cuerpo or "{{TARJETAS}}" in cuerpo:
            todos = ",".join([f"/articulo-{x[0]}.html" for x in ANTIGUOS] + [f"/articulo-{a['slug']}.html" for a in ARTS])
            tarjetas = '<div class="cards">' + "".join(
                card_html(a["slug"], a["titulo_corto"], a["categoria"], f'{a["lugar"]} · {a["anio"]}', f'images/articulos/{a["slug"]}-portada.webp')
                for a in ARTS[:6:2] + [x for x in ARTS if x["categoria"] in ("mist", "intl")][:3]) + "</div>"
            cuerpo = cuerpo.replace("{{ALEATORIO}}", todos).replace("<p>{{TARJETAS}}</p>", tarjetas)
        url = f"{SITE}/{archivo}" if archivo != "index.html" else SITE + "/"
        title = meta["titulo_seo"]
        robots = meta.get("robots", "index, follow, max-image-preview:large")
        img = f"{SITE}/images/og-viralix.jpg"
        jsonld = [{"@context": "https://schema.org", "@type": meta.get("schema", "WebPage"), "name": meta["titulo_seo"],
                   "description": meta["descripcion"], "url": url, "inLanguage": "es-ES", "isPartOf": {"@type": "WebSite", "name": "VIRALIX", "url": SITE + "/"},
                   "publisher": ORG}]
        actualizado = f'<p class="updated">Última actualización: <time datetime="{meta["actualizado"]}">{fecha_larga(meta["actualizado"])}</time></p>' if meta.get("actualizado") else ""
        page = f"""{head(title, meta['descripcion'], url, 'website', img, 'VIRALIX — true crime y misterios', '', jsonld, robots)}
<body class="page-institucional">
{header(archivo)}
<main id="contenido">
  <div class="container">
    <nav class="breadcrumbs" aria-label="Migas de pan"><ol><li><a href="/">Inicio</a></li><li aria-current="page">{e(meta['miga'])}</li></ol></nav>
    <header class="page-hero">
      <span class="chip">{e(meta['kicker'])}</span>
      <h1>{meta['h1']}</h1>
      {f"<p>{inline(meta['intro'])}</p>" if meta.get('intro') else ''}
      {actualizado}
    </header>
    <div class="page-body"><div class="prose">
{cuerpo}
    </div></div>
  </div>
</main>
{FOOTER}
{SCRIPTS}
</body>
</html>
"""
        (ROOT / archivo).write_text(page, encoding="utf-8")
        hechas.append((archivo, meta))
    return hechas


def render_autor(arts):
    """Página de perfil del autor: /autor/jorge-de-la-fuente.html"""
    url = SITE + AUTOR["url"]
    title = "Jorge de la Fuente Gutiérrez, autor y editor de VIRALIX"
    desc = ("Perfil de Jorge de la Fuente Gutiérrez, fundador y editor de VIRALIX: quién es, cómo trabaja, "
            "qué casos ha escrito y cómo contactar con él para proponer uno.")
    persona = {"@type": "Person", "@id": url + "#persona", "name": AUTOR["nombre"], "alternateName": AUTOR["corto"],
               "url": url, "email": "mailto:viralixweb@gmail.com", "jobTitle": "Fundador y editor",
               "worksFor": {"@type": "Organization", "name": "VIRALIX", "url": SITE + "/"},
               "knowsAbout": ["True crime", "Historia criminal de España", "Criminología", "Misterios históricos"]}
    jsonld = [{"@context": "https://schema.org", "@type": "ProfilePage", "name": title, "url": url, "inLanguage": "es-ES",
               "dateModified": "2026-11-04", "mainEntity": persona},
              {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
                  {"@type": "ListItem", "position": 1, "name": "Inicio", "item": SITE + "/"},
                  {"@type": "ListItem", "position": 2, "name": "Sobre VIRALIX", "item": SITE + "/sobre.html"},
                  {"@type": "ListItem", "position": 3, "name": AUTOR["corto"], "item": url}]}]
    orden = {"es": 0, "intl": 1, "mist": 2, "crim": 3}
    grupos = ""
    for cat in ("es", "intl", "mist", "crim"):
        g = [a for a in arts if a["categoria"] == cat]
        if not g:
            continue
        grupos += f'<h2 id="{CATS[cat]["ancla"]}">{e(CATS[cat]["nombre"])}</h2><div class="cards">' + "".join(
            card_html(a["slug"], a["titulo_corto"], cat, f'{a["lugar"]} · {a["anio"]}', f'images/articulos/{a["slug"]}-portada.webp') for a in g) + "</div>"
    page = f"""{head(title + ' | VIRALIX', desc, url, 'profile', SITE + '/images/og-viralix.jpg', 'VIRALIX — true crime y misterios', '', jsonld)}
<body class="page-institucional page-autor">
{header()}
<main id="contenido">
  <div class="container">
    <nav class="breadcrumbs" aria-label="Migas de pan"><ol><li><a href="/">Inicio</a></li><li><a href="/sobre.html">Sobre VIRALIX</a></li><li aria-current="page">{AUTOR['corto']}</li></ol></nav>
    <header class="page-hero">
      <span class="chip">Autor · Fundador y editor</span>
      <h1>JORGE DE LA <span>FUENTE</span></h1>
      <p>Fundador y editor de VIRALIX. Escribe sobre crímenes reales, misterios y criminología desde la provincia de Jaén.</p>
      <p class="updated">Perfil actualizado el <time datetime="2026-11-04">4 de noviembre de 2026</time></p>
    </header>
    <div class="page-body"><div class="prose">
      <aside class="author-box" aria-label="Ficha del autor"><div class="author-box__avatar" aria-hidden="true">JF</div><div><h2>{AUTOR['nombre']}</h2><p>Fundador y editor de VIRALIX · Provincia de Jaén (Andalucía) · <a href="mailto:viralixweb@gmail.com">viralixweb@gmail.com</a></p></div></aside>
      <h2 id="quien-es">Quién es</h2>
      <p><strong>Jorge de la Fuente Gutiérrez</strong> es el fundador y editor de VIRALIX. Dirige el proyecto desde su lanzamiento en 2026: elige los casos, los documenta en sentencias, archivos y hemerotecas, escribe los artículos y los revisa antes de publicarlos. También es quien lee y contesta los mensajes que llegan al correo de contacto.</p>
      <p>Sus artículos se centran en tres terrenos: los casos en los que el relato mediático se alejó de los hechos, como el <a href="/articulo-calle-fuencarral.html">crimen de la calle Fuencarral</a> o el de <a href="/articulo-enriqueta-marti.html">Enriqueta Martí</a>; los casos sin resolver, como <a href="/articulo-galindos.html">Los Galindos</a>; y la criminología que desmonta tópicos del <em>true crime</em>, como la <a href="/articulo-psicopatia.html">psicopatía</a> o la <a href="/articulo-perfil-criminal.html">perfilación criminal</a>.</p>
      <h2 id="como-trabaja">Cómo trabaja</h2>
      <p>Su forma de trabajar se resume en tres reglas: ir a las fuentes primarias siempre que existen, separar con claridad los hechos probados de las hipótesis y no contar ningún caso desde el morbo. Al final de cada artículo añade una <strong>nota del autor</strong>, separada del relato, donde da su opinión o deja abierta una duda. El proceso completo está en la <a href="/metodologia.html">metodología editorial</a> y en la página <a href="/sobre.html">Sobre VIRALIX</a>.</p>
      <h2 id="contacto">Contacto</h2>
      <p>Para proponer un caso, señalar un error o pedir una rectificación, escribe a <a href="mailto:viralixweb@gmail.com">viralixweb@gmail.com</a> o usa el formulario de la <a href="/contacto.html">página de contacto</a>.</p>
      <h2 id="articulos">Artículos de Jorge de la Fuente</h2>
      <p>{len(arts)} artículos firmados. Los textos de la primera etapa del proyecto aparecen como «Equipo VIRALIX» y pueden consultarse en la <a href="/">portada</a>.</p>
      {grupos}
    </div></div>
  </div>
</main>
{FOOTER}
{SCRIPTS}
</body>
</html>
"""
    out = ROOT / "autor" / "jorge-de-la-fuente.html"
    out.parent.mkdir(exist_ok=True)
    out.write_text(page, encoding="utf-8")


# ---------------------------------------------------------------------------
# Imágenes
# ---------------------------------------------------------------------------

def datos_imagenes(arts):
    data = []
    for a in arts:
        r = a["_r"]
        data.append({
            "slug": a["slug"], "titulo": a["titulo_corto"], "titulo_corto": a["titulo_corto"],
            "titulo_portada": a.get("titulo_portada", a["titulo_corto"]), "categoria": a["categoria"],
            "anio": a["anio"], "lugar": a["lugar"], "estado": a.get("estado", ""),
            "mapa": a.get("mapa"), "cronologia": r.cronologia,
            "ficha": {"titulo": a.get("ficha_titulo", "Ficha del caso"), "filas": r.ficha},
            "diagrama": a.get("diagrama"),
        })
    (ROOT / "scripts" / "imagenes-datos.json").write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")


def convertir_imagenes():
    from PIL import Image
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    for png in sorted(TMP_PNG.glob("*.png")):
        im = Image.open(png).convert("RGB")
        stem = png.stem
        im.save(IMG_DIR / f"{stem}.webp", "WEBP", quality=80, method=6)
        if stem.endswith("-portada"):
            im.save(IMG_DIR / f"{stem}.jpg", "JPEG", quality=84, optimize=True, progressive=True)


def optimizar_antiguas():
    """Versiones WebP ligeras de las portadas PNG antiguas (no se borran los PNG)."""
    from PIL import Image
    OPT_DIR.mkdir(parents=True, exist_ok=True)
    for png in sorted(ROOT.glob("img-*.png")):
        for wdt in (800, 1200):
            out = OPT_DIR / f"{png.stem}-{wdt}.webp"
            if out.exists():
                continue
            im = Image.open(png).convert("RGB")
            h = round(im.height * wdt / im.width)
            im.resize((wdt, h), Image.LANCZOS).save(out, "WEBP", quality=78, method=6)


# ---------------------------------------------------------------------------
# Sitemap, RSS y portada
# ---------------------------------------------------------------------------

def sitemap(arts, paginas):
    urls = [(SITE + "/", HOY, "daily", "1.0", None), (SITE + "/timeline.html", HOY, "monthly", "0.7", None)]
    for archivo, m in paginas:
        if "noindex" in m.get("robots", ""):
            continue
        urls.append((f"{SITE}/{archivo}", m.get("actualizado", HOY), "yearly", "0.4", None))
    urls.append((SITE + AUTOR["url"], "2026-11-04", "monthly", "0.5", None))
    for a in arts:
        urls.append((f"{SITE}/articulo-{a['slug']}.html", a["actualizado"], "monthly", "0.9",
                     (f"{SITE}/images/articulos/{a['slug']}-portada.jpg", a["titulo_corto"])))
    for s, t, c, _ in ANTIGUOS:
        lm = "2026-11-04" if s == "eclipse-2026" else "2026-09-22" if s in ("aguilar", "arropiero", "breton", "envenenadora") else "2026-06-14"
        urls.append((f"{SITE}/articulo-{s}.html", lm, "monthly", "0.8", (f"{SITE}/img-{s}.png", t)))
    x = ['<?xml version="1.0" encoding="UTF-8"?>',
         '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">']
    for loc, lm, cf, pr, img in urls:
        imgx = f"\n    <image:image><image:loc>{img[0]}</image:loc></image:image>" if img else ""
        x.append(f"  <url>\n    <loc>{loc}</loc>\n    <lastmod>{lm}</lastmod>\n    <changefreq>{cf}</changefreq>\n    <priority>{pr}</priority>{imgx}\n  </url>")
    x.append("</urlset>\n")
    (ROOT / "sitemap.xml").write_text("\n".join(x), encoding="utf-8")


def feed(arts):
    old = (ROOT / "feed.xml").read_text(encoding="utf-8")
    old_items = [it for it in re.findall(r"\s*<item>.*?</item>", old, re.S)
                 if not any(f"articulo-{a['slug']}.html" in it for a in arts)]
    new_items = []
    for a in arts:
        url = f"{SITE}/articulo-{a['slug']}.html"
        d = dt.date.fromisoformat(a["publicado"])
        pub = d.strftime("%a, %d %b %Y") + " 09:00:00 +0100"
        new_items.append(f"""
  <item>
    <title>{e(a['titulo'])}</title>
    <link>{url}</link>
    <description>{e(a['descripcion'])}</description>
    <guid>{url}</guid>
    <pubDate>{pub}</pubDate>
    <category>{e(CATS[a['categoria']]['nombre'])}</category>
    <enclosure url="{SITE}/images/articulos/{a['slug']}-portada.jpg" type="image/jpeg" length="0"/>
  </item>""")
    head_xml = old.split("<item>")[0]
    head_xml = re.sub(r"<lastBuildDate>.*?</lastBuildDate>", "<lastBuildDate>Tue, 03 Nov 2026 09:00:00 +0100</lastBuildDate>", head_xml)
    head_xml = head_xml.replace(f"{SITE}/img-og-viralix.png", f"{SITE}/images/logo-viralix.png")
    head_xml = head_xml.rstrip()
    out = head_xml + "".join(new_items) + "".join(old_items) + "\n\n</channel>\n</rss>\n"
    (ROOT / "feed.xml").write_text(out, encoding="utf-8")


def portada(arts):
    """Rellena las secciones automáticas de index.html entre marcadores."""
    idx = ROOT / "index.html"
    s = idx.read_text(encoding="utf-8")
    secciones = []
    titulos = {"es": ("Nuevos expedientes", "MÁS CASOS DE <span>ESPAÑA</span>", "true-crime-nuevos"),
               "intl": ("Grandes casos del mundo", "CASOS <span>INTERNACIONALES</span>", "internacional"),
               "mist": ("Enigmas con base histórica", "<span>MISTERIOS</span>", "misterios"),
               "crim": ("La mente criminal", "<span>CRIMINOLOGÍA</span>", "criminologia")}
    for cat, (label, tit, ancla) in titulos.items():
        grupo = [a for a in arts if a["categoria"] == cat]
        if not grupo:
            continue
        cards = "\n".join(
            f'''    <article class="vx-card {CATS[cat]["clase"]} reveal">
      <a class="vx-card__img" href="articulo-{a['slug']}.html" tabindex="-1" aria-hidden="true"><img src="images/articulos/{a['slug']}-portada.webp" alt="" width="1200" height="630" loading="lazy" decoding="async"></a>
      <div class="vx-card__body">
        <span class="vx-chip">{e(CATS[cat]['corto'])}</span>
        <h3 class="vx-card__title"><a href="articulo-{a['slug']}.html">{e(a['titulo_corto'])}</a></h3>
        <p class="vx-card__desc">{e(a['descripcion'])}</p>
        <span class="vx-card__meta">{e(a['lugar'])} · {e(a['anio'])} · {max(4, math.ceil(a['_palabras'] / 220))} min</span>
      </div>
    </article>''' for a in grupo)
        secciones.append(f'''  <div id="{ancla}" class="section-header reveal" style="margin-top:80px">
    <div><div class="section-label">{label}</div><div class="section-title">{tit}</div></div>
  </div>
  <div class="vx-grid">
{cards}
  </div>''')
    bloque = "<!-- VX:NUEVOS:INICIO (generado por scripts/construir.py) -->\n" + "\n".join(secciones) + "\n  <!-- VX:NUEVOS:FIN -->"
    s = re.sub(r"<!-- VX:NUEVOS:INICIO.*?<!-- VX:NUEVOS:FIN -->", lambda m: bloque, s, flags=re.S)
    # Buscador y artículo aleatorio
    busc = ",\n".join(
        f'  {{ title: {json.dumps(a["titulo_corto"], ensure_ascii=False)}, url: "articulo-{a["slug"]}.html", cat: {json.dumps(CATS[a["categoria"]]["corto"], ensure_ascii=False)}, tags: {json.dumps((a.get("palabras_clave", "") + " " + a["lugar"] + " " + a["anio"]).lower(), ensure_ascii=False)} }}'
        for a in arts)
    s = re.sub(r"/\* VX:BUSCADOR:INICIO \*/.*?/\* VX:BUSCADOR:FIN \*/", lambda m: "/* VX:BUSCADOR:INICIO */\n" + busc + ",\n  /* VX:BUSCADOR:FIN */", s, flags=re.S)
    todos = [f"articulo-{x[0]}.html" for x in ANTIGUOS] + [f"articulo-{a['slug']}.html" for a in arts]
    s = re.sub(r"/\* VX:ALEATORIO:INICIO \*/.*?/\* VX:ALEATORIO:FIN \*/", lambda m: "/* VX:ALEATORIO:INICIO */" + json.dumps(todos) + "/* VX:ALEATORIO:FIN */", s, flags=re.S)
    n_total = len(ANTIGUOS) + len(arts)
    s = re.sub(r"<!-- VX:TOTAL -->\d+<!-- /VX:TOTAL -->", f"<!-- VX:TOTAL -->{n_total}<!-- /VX:TOTAL -->", s)
    n_tc = sum(1 for x in ANTIGUOS if x[2] == "es") + sum(1 for a in arts if a["categoria"] in ("es", "intl"))
    s = re.sub(r"<!-- VX:TC -->\d+<!-- /VX:TC -->", f"<!-- VX:TC -->{n_tc}<!-- /VX:TC -->", s)
    items = [(f"{SITE}/articulo-{a['slug']}.html", a["titulo_corto"]) for a in arts] + [(f"{SITE}/articulo-{x[0]}.html", x[1]) for x in ANTIGUOS]
    itemlist = {"@context": "https://schema.org", "@type": "ItemList", "name": "Artículos de VIRALIX",
                "numberOfItems": len(items),
                "itemListElement": [{"@type": "ListItem", "position": i + 1, "url": u, "name": t} for i, (u, t) in enumerate(items)]}
    s = re.sub(r"<!-- VX:ITEMLIST:INICIO -->.*?<!-- VX:ITEMLIST:FIN -->",
               lambda m: '<!-- VX:ITEMLIST:INICIO --><script type="application/ld+json">' + json.dumps(itemlist, ensure_ascii=False) + "</script><!-- VX:ITEMLIST:FIN -->", s, flags=re.S)
    idx.write_text(s, encoding="utf-8")
    return n_total


def main():
    arts = cargar_articulos()
    datos_imagenes(arts)
    if "--imagenes" in sys.argv:
        slugs = [x for x in sys.argv[1:] if not x.startswith("--")]
        subprocess.run(["node", str(ROOT / "scripts" / "generar_imagenes.cjs"), *slugs], check=True)
        convertir_imagenes()
    optimizar_antiguas()
    arts = cargar_articulos()  # re-render con tamaños reales de imagen
    global ARTS
    ARTS = arts
    for a in arts:
        render_articulo(a, arts)
    paginas = render_paginas() if (CONT / "paginas").exists() else []
    render_autor(arts)
    sitemap(arts, paginas)
    feed(arts)
    total = portada(arts)
    print(f"OK: {len(arts)} artículos, {len(paginas)} páginas, {total} artículos en total")


if __name__ == "__main__":
    main()
