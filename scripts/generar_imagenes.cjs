/* VIRALIX — Generador de imágenes editoriales (portadas, mapas, cronologías, fichas y diagramas).
 *
 * Uso:   node scripts/generar_imagenes.cjs [slug ...]
 * Lee:   scripts/imagenes-datos.json  (lo genera scripts/construir.py a partir de contenido/articulos/*.md)
 * Crea:  scripts/.tmp-png/<slug>-<tipo>.png  (scripts/construir.py los convierte a WebP/JPG en images/articulos/)
 *
 * Datos cartográficos (todos de licencia libre):
 *   - world-atlas  → Natural Earth (dominio público)
 *   - us-atlas     → U.S. Census Bureau, Cartographic Boundary Files (dominio público)
 *   - es-atlas     → Instituto Geográfico Nacional de España (CC BY 4.0)
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const d3 = require('d3-geo');
const topojson = require('topojson-client');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(__dirname, '.tmp-png');
fs.mkdirSync(OUT, { recursive: true });
const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, 'imagenes-datos.json'), 'utf8'));

/* ---------- Fuentes embebidas ---------- */
const nm = (p) => path.join(__dirname, 'node_modules', p);
const f64 = (p) => fs.readFileSync(nm(p)).toString('base64');
const FONTS = `
@font-face{font-family:'Bebas Neue';src:url(data:font/woff2;base64,${f64('@fontsource/bebas-neue/files/bebas-neue-latin-400-normal.woff2')}) format('woff2');}
@font-face{font-family:'DM Sans';font-weight:400;src:url(data:font/woff2;base64,${f64('@fontsource/dm-sans/files/dm-sans-latin-400-normal.woff2')}) format('woff2');}
@font-face{font-family:'DM Sans';font-weight:600;src:url(data:font/woff2;base64,${f64('@fontsource/dm-sans/files/dm-sans-latin-600-normal.woff2')}) format('woff2');}
@font-face{font-family:'DM Sans';font-weight:700;src:url(data:font/woff2;base64,${f64('@fontsource/dm-sans/files/dm-sans-latin-700-normal.woff2')}) format('woff2');}
@font-face{font-family:'DM Serif Display';src:url(data:font/woff2;base64,${f64('@fontsource/dm-serif-display/files/dm-serif-display-latin-400-normal.woff2')}) format('woff2');}
@font-face{font-family:'Plex Mono';font-weight:400;src:url(data:font/woff2;base64,${f64('@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2')}) format('woff2');}
@font-face{font-family:'Plex Mono';font-weight:600;src:url(data:font/woff2;base64,${f64('@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-600-normal.woff2')}) format('woff2');}
`;

/* ---------- Geodatos ---------- */
const world = require('world-atlas/countries-50m.json');
const worldHi = require('world-atlas/countries-10m.json');
const usStates = require('us-atlas/states-10m.json');
const usCounties = require('us-atlas/counties-10m.json');
const esProv = require('es-atlas/es/provinces.json');
// Se descartan los polígonos con el sentido de giro invertido (p. ej., Maldivas en Natural Earth 10m),
// que d3-geo interpreta como «todo el planeta menos el país» y taparían el océano.
const sano = (fs) => fs.filter((f) => d3.geoArea(f) < 2 * Math.PI);
const GEO = {
  world: sano(topojson.feature(world, world.objects.countries).features),
  worldHi: sano(topojson.feature(worldHi, worldHi.objects.countries).features),
  usStates: sano(topojson.feature(usStates, usStates.objects.states).features),
  usCounties: sano(topojson.feature(usCounties, usCounties.objects.counties).features),
  esProv: sano(topojson.feature(esProv, esProv.objects.provinces).features),
};
const CREDITOS = {
  es: 'Datos cartográficos: © Instituto Geográfico Nacional (CC BY 4.0) y Natural Earth',
  world: 'Datos cartográficos: Natural Earth (dominio público)',
  us: 'Datos cartográficos: U.S. Census Bureau y Natural Earth (dominio público)',
};
const COLORS = { es: '#ef3b22', latam: '#35c48f', intl: '#5b93f7', mist: '#d9b04c', crim: '#a587f3' };
const LABELS = { es: 'True crime · España', latam: 'Latinoamérica', intl: 'Casos internacionales', mist: 'Misterios', crim: 'Criminología' };

const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function fmtCoord(lon, lat) {
  const a = Math.abs(lat).toFixed(4) + '° ' + (lat >= 0 ? 'N' : 'S');
  const b = Math.abs(lon).toFixed(4) + '° ' + (lon >= 0 ? 'E' : 'O');
  return a + ' · ' + b;
}

/* Dibuja un mapa SVG.  opts: {w,h,pad,spec,accent,variant:'cover'|'full'|'inset'} */
function mapSVG(opts) {
  const { w, h, spec, accent } = opts;
  const variant = opts.variant || 'full';
  const pad = opts.pad || [0, 0, 0, 0]; // top,right,bottom,left
  const ext = spec.extent;
  const proj = d3.geoMercator().fitExtent([[pad[3], pad[0]], [w - pad[1], h - pad[2]]], { type: 'MultiPoint', coordinates: ext });
  const gp = d3.geoPath(proj);
  const span = Math.max(Math.abs(ext[1][0] - ext[0][0]), Math.abs(ext[1][1] - ext[0][1]));
  const step = span > 60 ? 10 : span > 25 ? 5 : span > 10 ? 2 : span > 4 ? 1 : span > 1.5 ? 0.5 : 0.25;
  const grat = gp(d3.geoGraticule().step([step, step]).extent([[ext[0][0] - 20, ext[0][1] - 20], [ext[1][0] + 20, ext[1][1] + 20]])());
  const hl = spec.resaltar || {};
  const isCover = variant === 'cover';
  const land = isCover ? '#141823' : '#181c27';
  const stroke = isCover ? 'rgba(255,255,255,.16)' : 'rgba(255,255,255,.22)';
  let paths = '';
  const base = spec.base;
  const bigSpan = span > 30;
  const countries = (span < 6 ? GEO.worldHi : GEO.world);
  // Países (siempre, como contexto)
  for (const f of countries) {
    const isHl = (hl.paises || []).includes(f.properties.name);
    if (base === 'es' && f.properties.name === 'Spain') continue;
    const d = gp(f); if (!d) continue;
    paths += `<path d="${d}" fill="${isHl ? accent : land}" fill-opacity="${isHl ? 0.22 : 1}" stroke="${isHl ? accent : stroke}" stroke-width="${isHl ? 1.4 : 0.8}"/>`;
  }
  if (base === 'es') {
    for (const f of GEO.esProv) {
      const isHl = (hl.provincias || []).includes(f.properties.name);
      const d = gp(f); if (!d) continue;
      paths += `<path d="${d}" fill="${isHl ? accent : land}" fill-opacity="${isHl ? 0.24 : 1}" stroke="${isHl ? accent : stroke}" stroke-width="${isHl ? 1.6 : 0.7}"/>`;
    }
  }
  if (base === 'us') {
    if ((hl.condados || []).length) {
      for (const f of GEO.usCounties) {
        if (!(hl.condados || []).includes(f.id)) continue;
        const d = gp(f); if (!d) continue;
        paths += `<path d="${d}" fill="${accent}" fill-opacity=".16" stroke="${accent}" stroke-opacity=".55" stroke-width=".8"/>`;
      }
    }
    for (const f of GEO.usStates) {
      const isHl = (hl.estados || []).includes(f.properties.name);
      const d = gp(f); if (!d) continue;
      paths += `<path d="${d}" fill="${isHl && !(hl.condados || []).length ? accent : 'none'}" fill-opacity="${isHl ? 0.18 : 0}" stroke="${isHl ? accent : stroke}" stroke-width="${isHl ? 1.6 : 0.9}"/>`;
    }
    // La tierra de EE. UU. se rellena con Natural Earth (bucle de países); aquí solo se trazan límites.
  }
  // Ruta
  let route = '';
  if (spec.ruta && spec.ruta.length > 1) {
    const d = gp({ type: 'LineString', coordinates: spec.ruta });
    route = `<path d="${d}" fill="none" stroke="${accent}" stroke-width="${isCover ? 2.5 : 3}" stroke-dasharray="9 7" stroke-linecap="round" marker-end="url(#arrow)"/>`;
  }
  // Etiquetas de contexto
  let ctx = '';
  if (!isCover) for (const e of spec.etiquetas || []) {
    const [x, y] = proj([e.lon, e.lat]);
    const style = e.tipo === 'mar' ? `font-family:'DM Serif Display';font-style:italic;font-size:22px;fill:rgba(160,180,210,.55);letter-spacing:2px` : `font-family:'DM Sans';font-weight:600;font-size:15px;fill:rgba(241,239,233,.55);letter-spacing:2.5px;text-transform:uppercase`;
    ctx += `<text x="${x}" y="${y}" text-anchor="middle" style="${style}">${esc(e.texto)}</text>`;
  }
  // Marcadores
  let marks = '';
  (spec.marcadores || []).forEach((m, i) => {
    const [x, y] = proj([m.lon, m.lat]);
    const main = isCover ? (i === (spec.principal || 0)) : true;
    if (isCover) {
      if (!main) { marks += `<circle cx="${x}" cy="${y}" r="5" fill="${accent}" fill-opacity=".8"/>`; return; }
      marks += `<circle cx="${x}" cy="${y}" r="70" fill="none" stroke="${accent}" stroke-opacity=".18" stroke-width="1.5"/>
        <circle cx="${x}" cy="${y}" r="42" fill="none" stroke="${accent}" stroke-opacity=".35" stroke-width="1.5"/>
        <circle cx="${x}" cy="${y}" r="20" fill="${accent}" fill-opacity=".22"/>
        <circle cx="${x}" cy="${y}" r="8" fill="${accent}" stroke="#fff" stroke-width="2.5"/>
        ${x > w - 330
          ? `<line x1="${x - 10}" y1="${y - 10}" x2="${x - 52}" y2="${y - 52}" stroke="${accent}" stroke-width="1.5"/>
        <text x="${x - 58}" y="${y - 56}" text-anchor="end" style="font-family:'Plex Mono';font-size:15px;fill:rgba(241,239,233,.85);letter-spacing:1px">${esc(fmtCoord(m.lon, m.lat))}</text>`
          : `<line x1="${x + 10}" y1="${y - 10}" x2="${x + 52}" y2="${y - 52}" stroke="${accent}" stroke-width="1.5"/>
        <text x="${x + 58}" y="${y - 56}" style="font-family:'Plex Mono';font-size:15px;fill:rgba(241,239,233,.85);letter-spacing:1px">${esc(fmtCoord(m.lon, m.lat))}</text>`}`;
      return;
    }
    const n = i + 1;
    const right = m.lado !== 'izq';
    const lx = x + (right ? 22 : -22) + (m.dx || 0);
    const ly = y + (m.dy || 0);
    marks += `<circle cx="${x}" cy="${y}" r="17" fill="${accent}" fill-opacity=".18"/>
      <circle cx="${x}" cy="${y}" r="11" fill="${accent}" stroke="#0b0e15" stroke-width="2"/>
      <text x="${x}" y="${y + 4.5}" text-anchor="middle" style="font-family:'DM Sans';font-weight:700;font-size:12px;fill:#fff">${n}</text>
      <text x="${lx}" y="${ly - 2}" text-anchor="${right ? 'start' : 'end'}" style="font-family:'DM Sans';font-weight:700;font-size:19px;fill:#f1efe9;paint-order:stroke;stroke:#0b0e15;stroke-width:5px;stroke-linejoin:round">${esc(m.texto)}</text>
      ${m.sub ? `<text x="${lx}" y="${ly + 19}" text-anchor="${right ? 'start' : 'end'}" style="font-family:'DM Sans';font-size:14px;fill:rgba(241,239,233,.75);paint-order:stroke;stroke:#0b0e15;stroke-width:4px;stroke-linejoin:round">${esc(m.sub)}</text>` : ''}`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs><marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${accent}"/></marker></defs>
    <rect width="${w}" height="${h}" fill="${isCover ? '#0a0c12' : '#0b0f17'}"/>
    <path d="${grat}" fill="none" stroke="rgba(120,140,170,${isCover ? 0.10 : 0.13})" stroke-width="1"/>
    ${paths}${route}${ctx}${marks}
  </svg>`;
}

/* Arte procedural para portadas sin mapa (criminología): huella dactilar */
function fingerprintSVG(w, h, accent, seed) {
  let s = seed || 7;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const cx = w * 0.62, cy = h * 0.52;
  let out = '';
  for (let r = 16; r < 520; r += 11) {
    const pts = [];
    const ph = rnd() * 6.28, amp = 4 + r * 0.02;
    for (let a = 0; a <= 360; a += 4) {
      const t = a * Math.PI / 180;
      const rr = r * (1 + 0.18 * Math.sin(t * 2 + ph * 0.3)) + amp * Math.sin(t * 5 + ph);
      pts.push([cx + rr * Math.cos(t) * 0.82, cy + rr * Math.sin(t) * 1.05]);
    }
    const gap = Math.floor(rnd() * pts.length);
    const seg = pts.slice(gap).concat(pts.slice(0, Math.max(0, gap - 6)));
    out += `<path d="M${seg.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L')}" fill="none" stroke="${r < 200 ? accent : 'rgba(241,239,233,.16)'}" stroke-opacity="${r < 200 ? 0.55 - r / 600 : 1}" stroke-width="2.2" stroke-linecap="round"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="#0a0c12"/>${out}</svg>`;
}

const NOISE = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;
const LOGO = (accent) => `<span style="font-family:'Bebas Neue';letter-spacing:5px;color:#f1efe9">VIRAL<span style="color:${accent}">I</span>X</span>`;

const page = (w, h, body, extraCss = '') => `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}
*{box-sizing:border-box;margin:0;padding:0}html,body{width:${w}px;${h ? 'height:' + h + 'px;' : ''}background:#07080c;color:#f1efe9;font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased}
#card{position:relative;width:${w}px;${h ? 'height:' + h + 'px;' : ''}overflow:hidden}
.noise{position:absolute;inset:0;opacity:.07;mix-blend-mode:overlay;pointer-events:none}
${extraCss}</style></head><body><div id="card">${body}</div></body></html>`;

/* ---------- Plantillas ---------- */
function coverHTML(d) {
  const accent = COLORS[d.categoria];
  const W = 1200, H = 630;
  const bg = d.mapa ? mapSVG({ w: W, h: H, spec: d.mapa, accent, variant: 'cover', pad: [90, 70, 90, 520] }) : fingerprintSVG(W, H, accent, d.slug.length * 13);
  const t = d.titulo_portada || d.titulo;
  const fs_ = t.length <= 26 ? 64 : t.length <= 40 ? 56 : t.length <= 56 ? 48 : 42;
  return page(W, H, `
    <div style="position:absolute;inset:0">${bg}</div>
    <div style="position:absolute;inset:0;background:linear-gradient(90deg,#07080c 0%,rgba(7,8,12,.96) 34%,rgba(7,8,12,.55) 58%,rgba(7,8,12,.15) 100%)"></div>
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse 70% 90% at 75% 50%,transparent 40%,rgba(7,8,12,.7) 100%)"></div>
    <div class="noise">${NOISE}</div>
    <div style="position:absolute;left:64px;top:56px;width:600px;height:518px;display:flex;flex-direction:column">
      <div style="font-weight:700;font-size:15px;letter-spacing:4px;text-transform:uppercase;color:${accent};display:flex;align-items:center;gap:14px"><span style="width:36px;height:2px;background:${accent}"></span>Expediente · ${esc(LABELS[d.categoria])}</div>
      <div style="font-family:'Bebas Neue';font-size:${d.anio.length > 6 ? 104 : 140}px;line-height:.9;letter-spacing:4px;color:transparent;-webkit-text-stroke:2px ${accent};margin-top:22px">${esc(d.anio)}</div>
      <div style="font-family:'DM Serif Display';font-size:${fs_}px;line-height:1.04;margin-top:14px;text-wrap:balance">${esc(t)}</div>
      <div style="margin-top:auto;display:flex;align-items:center;gap:14px;font-size:19px;color:rgba(241,239,233,.78)">
        <svg width="18" height="24" viewBox="0 0 18 24"><path d="M9 0C4 0 0 4 0 9c0 6.5 9 15 9 15s9-8.5 9-15c0-5-4-9-9-9zm0 12.5A3.5 3.5 0 1 1 9 5.5a3.5 3.5 0 0 1 0 7z" fill="${accent}"/></svg>${esc(d.lugar)}</div>
      <div style="margin-top:18px;padding-top:16px;border-top:1px solid rgba(255,255,255,.14);display:flex;justify-content:space-between;align-items:center">
        <div style="font-size:34px;line-height:1">${LOGO(accent)}</div>
        <div style="font-family:'Plex Mono';font-size:13px;letter-spacing:1px;color:rgba(241,239,233,.6)">viralixweb.es</div>
      </div>
    </div>
    <div style="position:absolute;right:56px;top:52px;transform:rotate(-7deg);border:3px solid ${accent};color:${accent};font-family:'Plex Mono';font-weight:600;font-size:17px;letter-spacing:3px;text-transform:uppercase;padding:8px 16px;border-radius:4px;background:rgba(7,8,12,.55)">${esc(d.estado)}</div>
  `);
}

function mapHTML(d) {
  const accent = COLORS[d.categoria];
  const W = 1200, H = 800;
  const m = d.mapa;
  const svg = mapSVG({ w: W, h: H, spec: m, accent, variant: 'full', pad: [150, 60, 70, 60] });
  let inset = '';
  if (m.localizador) {
    const IW = 250, IH = 210;
    const lspec = { base: m.base, extent: m.localizador, resaltar: m.resaltar_localizador || {}, marcadores: [] };
    const isvg = mapSVG({ w: IW, h: IH, spec: lspec, accent, variant: 'inset', pad: [10, 10, 10, 10] });
    const proj = d3.geoMercator().fitExtent([[10, 10], [IW - 10, IH - 10]], { type: 'MultiPoint', coordinates: m.localizador });
    const [x0, y0] = proj(m.extent[0]); const [x1, y1] = proj(m.extent[1]);
    const rx = Math.min(x0, x1), ry = Math.min(y0, y1), rw = Math.max(6, Math.abs(x1 - x0)), rh = Math.max(6, Math.abs(y1 - y0));
    inset = `<div style="position:absolute;left:40px;bottom:40px;width:${IW}px;height:${IH}px;border:1px solid rgba(255,255,255,.25);box-shadow:0 10px 30px rgba(0,0,0,.5);overflow:hidden;border-radius:4px">${isvg}
      <svg style="position:absolute;inset:0" width="${IW}" height="${IH}"><rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="${accent}" fill-opacity=".25" stroke="${accent}" stroke-width="2"/></svg></div>`;
  }
  return page(W, H, `
    <div style="position:absolute;inset:0">${svg}</div>
    <div style="position:absolute;inset:0 0 auto 0;height:170px;background:linear-gradient(#0b0f17 40%,rgba(11,15,23,0))"></div>
    <div style="position:absolute;left:48px;top:36px;right:48px">
      <div style="font-weight:700;font-size:14px;letter-spacing:4px;text-transform:uppercase;color:${accent};display:flex;align-items:center;gap:12px"><span style="width:30px;height:2px;background:${accent}"></span>Mapa · ${esc(d.titulo_corto || d.titulo)}</div>
      <div style="font-family:'DM Serif Display';font-size:36px;margin-top:8px;line-height:1.1">${esc(m.titulo || 'Lugares clave del caso')}</div>
    </div>
    <div style="position:absolute;right:44px;top:40px;text-align:center;font-family:'DM Sans';font-weight:700;font-size:14px;color:rgba(241,239,233,.7)"><svg width="22" height="30" viewBox="0 0 22 30"><path d="M11 0 L20 26 L11 20 L2 26 Z" fill="none" stroke="rgba(241,239,233,.7)" stroke-width="1.6"/><path d="M11 0 L11 20 L2 26 Z" fill="rgba(241,239,233,.7)"/></svg><div>N</div></div>
    ${inset}
    <div style="position:absolute;right:20px;bottom:14px;font-size:12.5px;color:rgba(241,239,233,.7);background:rgba(11,15,23,.75);padding:4px 10px;border-radius:3px">${esc(CREDITOS[m.base])} · Elaboración: VIRALIX</div>
    <div style="position:absolute;right:20px;bottom:44px;font-size:24px">${LOGO(accent)}</div>
  `);
}

function cronoHTML(d) {
  const accent = COLORS[d.categoria];
  const items = d.cronologia.slice(0, 8);
  const rows = items.map((it, i) => `
    <div style="display:grid;grid-template-columns:230px 40px 1fr;align-items:start;min-height:84px">
      <div style="font-family:'Bebas Neue';font-size:34px;letter-spacing:1.5px;color:${accent};text-align:right;line-height:1.05;padding-top:2px">${esc(it[0])}</div>
      <div style="position:relative;height:100%"><div style="position:absolute;left:19px;top:${i === 0 ? 14 : 0}px;bottom:${i === items.length - 1 ? 'auto' : '0'};height:${i === items.length - 1 ? '14px' : 'auto'};width:2px;background:rgba(255,255,255,.18)"></div><div style="position:absolute;left:11px;top:8px;width:18px;height:18px;border-radius:50%;background:#07080c;border:4px solid ${accent}"></div></div>
      <div style="font-size:22px;line-height:1.38;color:rgba(241,239,233,.88);padding:2px 0 22px">${esc(it[1])}</div>
    </div>`).join('');
  return page(1200, 0, `
    <div class="noise">${NOISE}</div>
    <div style="position:relative;padding:48px 64px 40px">
      <div style="font-weight:700;font-size:14px;letter-spacing:4px;text-transform:uppercase;color:${accent};display:flex;align-items:center;gap:12px"><span style="width:30px;height:2px;background:${accent}"></span>Cronología</div>
      <div style="font-family:'DM Serif Display';font-size:40px;margin:8px 0 34px;line-height:1.1">${esc(d.titulo_corto || d.titulo)}</div>
      ${rows}
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:18px;padding-top:16px;border-top:1px solid rgba(255,255,255,.12)">
        <div style="font-size:26px">${LOGO(accent)}</div>
        <div style="font-size:13px;color:rgba(241,239,233,.6)">Infografía: elaboración propia de VIRALIX a partir de las fuentes citadas en el artículo</div>
      </div>
    </div>`, `body{background:#090b10}#card{background:radial-gradient(ellipse 60% 50% at 100% 0%,${accent}22,transparent 70%),#090b10}`);
}

function fichaHTML(d) {
  const accent = COLORS[d.categoria];
  const f = d.ficha;
  const rows = f.filas.slice(0, 9).map((r) => `
    <div style="display:grid;grid-template-columns:260px 1fr;gap:24px;padding:13px 0;border-bottom:1.5px dashed rgba(36,33,28,.28)">
      <div style="font-family:'Plex Mono';font-weight:600;font-size:16px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(36,33,28,.62);padding-top:3px">${esc(r[0])}</div>
      <div style="font-family:'Plex Mono';font-size:20px;line-height:1.42;color:#24211c">${esc(r[1])}</div>
    </div>`).join('');
  const ref = 'VX-' + (d.anio.match(/\d{4}/) || ['0000'])[0] + '-' + String(d.slug.length * 37 % 1000).padStart(3, '0');
  return page(1200, 0, `
    <div style="position:relative;padding:56px 64px 56px">
      <div style="position:absolute;left:64px;top:22px;width:250px;height:44px;background:#d9cfb8;border-radius:8px 8px 0 0;font-family:'Plex Mono';font-weight:600;font-size:14px;letter-spacing:2px;color:rgba(36,33,28,.7);display:flex;align-items:center;padding-left:18px">ARCHIVO · ${esc(ref)}</div>
      <div style="position:relative;background:#ece6d8;border-radius:0 6px 6px 6px;padding:44px 48px 40px;box-shadow:0 20px 50px rgba(0,0,0,.5);overflow:hidden">
        <div style="position:absolute;inset:0;opacity:.35;mix-blend-mode:multiply">${NOISE.replace('0 0 0 .55 0', '0 0 0 .25 0')}</div>
        <div style="position:absolute;right:36px;top:22px;width:22px;height:90px;border:4px solid #8d8a84;border-radius:12px;transform:rotate(8deg)"></div>
        <div style="position:relative;display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid #24211c;padding-bottom:16px;margin-bottom:10px">
          <div>
            <div style="font-family:'Plex Mono';font-weight:600;font-size:15px;letter-spacing:3px;color:${accent === '#d9b04c' ? '#8f6a10' : accent};text-transform:uppercase">${esc(f.titulo || 'Ficha del caso')}</div>
            <div style="font-family:'DM Serif Display';font-size:40px;color:#24211c;margin-top:6px;line-height:1.1">${esc(d.titulo_corto || d.titulo)}</div>
          </div>
          <div style="font-size:28px;line-height:1;filter:invert(1) hue-rotate(180deg)">${LOGO(accent)}</div>
        </div>
        <div style="position:relative">${rows}</div>
        <div style="position:absolute;right:54px;bottom:30px;transform:rotate(-9deg);border:4px solid ${accent === '#d9b04c' ? '#8f6a10' : accent};color:${accent === '#d9b04c' ? '#8f6a10' : accent};opacity:.78;font-family:'Plex Mono';font-weight:600;font-size:24px;letter-spacing:4px;padding:8px 18px;border-radius:6px;text-transform:uppercase;mix-blend-mode:multiply">${esc(d.estado)}</div>
        <div style="position:relative;margin-top:22px;max-width:560px;font-family:'Plex Mono';font-size:13px;color:rgba(36,33,28,.6)">Ficha de elaboración propia de VIRALIX con datos de las fuentes citadas en el artículo. No es un documento oficial.</div>
      </div>
    </div>`, `body{background:#0d0f14}`);
}

/* Diagramas específicos de los artículos de criminología */
function diagramaHTML(d) {
  const accent = COLORS[d.categoria];
  const dg = d.diagrama;
  let inner = '';
  if (dg.tipo === 'flujo') {
    inner = `<div style="display:grid;grid-template-columns:repeat(${dg.pasos.length},1fr);gap:14px;margin-top:10px">` + dg.pasos.map((p, i) => `
      <div style="position:relative;background:#11141c;border:1px solid rgba(255,255,255,.12);border-top:4px solid ${accent};border-radius:6px;padding:20px 16px 22px;min-height:300px">
        <div style="font-family:'Bebas Neue';font-size:54px;line-height:1;color:${accent}">${String(i + 1).padStart(2, '0')}</div>
        <div style="font-weight:700;font-size:21px;line-height:1.2;margin:8px 0 10px">${esc(p[0])}</div>
        <div style="font-size:16.5px;line-height:1.45;color:rgba(241,239,233,.75)">${esc(p[1])}</div>
        ${i < dg.pasos.length - 1 ? `<div style="position:absolute;right:-14px;top:44px;width:14px;height:2px;background:${accent}"></div>` : ''}
      </div>`).join('') + '</div>';
  } else if (dg.tipo === 'facetas') {
    inner = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:6px">` + dg.grupos.map((g) => `
      <div style="background:#11141c;border:1px solid rgba(255,255,255,.12);border-left:5px solid ${accent};border-radius:6px;padding:20px 24px">
        <div style="font-family:'Plex Mono';font-weight:600;font-size:13px;letter-spacing:2.5px;text-transform:uppercase;color:${accent}">${esc(g.factor)}</div>
        <div style="font-family:'DM Serif Display';font-size:30px;margin:4px 0 10px">${esc(g.nombre)}</div>
        <ul style="list-style:none;display:grid;gap:7px">${g.rasgos.map((r) => `<li style="font-size:18px;line-height:1.35;color:rgba(241,239,233,.85);display:flex;gap:10px"><span style="color:${accent}">■</span>${esc(r)}</li>`).join('')}</ul>
      </div>`).join('') + '</div>';
  }
  return page(1200, 0, `
    <div class="noise">${NOISE}</div>
    <div style="position:relative;padding:48px 56px 36px">
      <div style="font-weight:700;font-size:14px;letter-spacing:4px;text-transform:uppercase;color:${accent};display:flex;align-items:center;gap:12px"><span style="width:30px;height:2px;background:${accent}"></span>${esc(dg.kicker || 'Diagrama')}</div>
      <div style="font-family:'DM Serif Display';font-size:40px;margin:8px 0 26px;line-height:1.1">${esc(dg.titulo)}</div>
      ${inner}
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:26px;padding-top:16px;border-top:1px solid rgba(255,255,255,.12)">
        <div style="font-size:26px">${LOGO(accent)}</div>
        <div style="font-size:13px;color:rgba(241,239,233,.6)">${esc(dg.nota || 'Diagrama: elaboración propia de VIRALIX a partir de las fuentes citadas')}</div>
      </div>
    </div>`, `body{background:#090b10}#card{background:radial-gradient(ellipse 60% 50% at 100% 0%,${accent}22,transparent 70%),#090b10}`);
}

(async () => {
  const only = process.argv.slice(2);
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ deviceScaleFactor: 1 });
  const pg = await ctx.newPage();
  const shot = async (html, file, w, h) => {
    await pg.setViewportSize({ width: w, height: h || 900 });
    await pg.setContent(html, { waitUntil: 'load' });
    await pg.evaluate(() => document.fonts.ready);
    await pg.locator('#card').screenshot({ path: path.join(OUT, file) });
  };
  for (const d of DATA) {
    if (only.length && !only.includes(d.slug)) continue;
    await shot(coverHTML(d), `${d.slug}-portada.png`, 1200, 630);
    if (d.mapa) await shot(mapHTML(d), `${d.slug}-mapa.png`, 1200, 800);
    if (d.cronologia && d.cronologia.length) await shot(cronoHTML(d), `${d.slug}-cronologia.png`, 1200);
    if (d.ficha && d.ficha.filas && d.ficha.filas.length) await shot(fichaHTML(d), `${d.slug}-ficha.png`, 1200);
    if (d.diagrama) await shot(diagramaHTML(d), `${d.slug}-diagrama.png`, 1200);
    console.log('✓', d.slug);
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
