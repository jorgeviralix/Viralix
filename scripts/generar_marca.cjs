/* VIRALIX — genera la imagen Open Graph por defecto (images/og-viralix.jpg)
   y el logotipo cuadrado para JSON-LD/RSS (images/logo-viralix.png). */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const nm = (p) => fs.readFileSync(path.join(__dirname, 'node_modules', p)).toString('base64');
const FONTS = `@font-face{font-family:'Bebas Neue';src:url(data:font/woff2;base64,${nm('@fontsource/bebas-neue/files/bebas-neue-latin-400-normal.woff2')})}
@font-face{font-family:'DM Serif Display';src:url(data:font/woff2;base64,${nm('@fontsource/dm-serif-display/files/dm-serif-display-latin-400-italic.woff2')});font-style:italic}
@font-face{font-family:'DM Sans';font-weight:600;src:url(data:font/woff2;base64,${nm('@fontsource/dm-sans/files/dm-sans-latin-600-normal.woff2')})}`;
const OG = `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;background:radial-gradient(ellipse 70% 80% at 80% 40%,rgba(239,59,34,.22),transparent 60%),#07080c;color:#f1efe9;font-family:'DM Sans';overflow:hidden;position:relative}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:60px 60px}
.k{position:absolute;left:80px;top:80px;font-size:18px;letter-spacing:6px;text-transform:uppercase;color:#ef3b22;display:flex;gap:16px;align-items:center}.k:before{content:'';width:48px;height:2px;background:#ef3b22}
.logo{position:absolute;left:72px;top:150px;font-family:'Bebas Neue';font-size:230px;letter-spacing:14px;line-height:1}.logo span{color:#ef3b22}
.s{position:absolute;left:82px;top:405px;font-family:'DM Serif Display';font-style:italic;font-size:44px;color:rgba(241,239,233,.82);max-width:900px;line-height:1.2}
.u{position:absolute;left:82px;bottom:60px;font-size:20px;letter-spacing:3px;color:rgba(241,239,233,.6)}</style></head><body><div class="grid"></div>
<div class="k">True crime · Misterios · Criminología</div><div class="logo">VIRAL<span>I</span>X</div>
<div class="s">Crímenes reales y misterios, contados con fuentes y sin sensacionalismo.</div><div class="u">viralixweb.es</div></body></html>`;
const LOGO = `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}*{margin:0}body{width:512px;height:512px;background:#07080c;display:grid;place-items:center;border-radius:0}
div{font-family:'Bebas Neue';font-size:380px;line-height:1;color:#f1efe9;padding-top:40px}span{color:#ef3b22}</style></head><body><div>V<span>.</span></div></body></html>`;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.setViewportSize({ width: 1200, height: 630 });
  await p.setContent(OG, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.join(__dirname, '..', 'images', 'og-viralix.jpg'), type: 'jpeg', quality: 86 });
  await p.setViewportSize({ width: 512, height: 512 });
  await p.setContent(LOGO, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.join(__dirname, '..', 'images', 'logo-viralix.png') });
  await b.close();
  console.log('ok');
})();
