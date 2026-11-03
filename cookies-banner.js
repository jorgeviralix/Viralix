// VIRALIX — Banner de consentimiento de cookies (RGPD / LSSI / guía AEPD 2023)
// - No hay consentimiento tácito: nada de "al seguir navegando aceptas".
// - "Rechazar" está al mismo nivel que "Aceptar". La elección se puede cambiar
//   en cualquier momento desde "Configurar cookies" (pie de página) o con
//   window.viralixCookies.open().
// - Transmite la elección a Google (Consent Mode v2) y a AdSense
//   (requestNonPersonalizedAds / pauseAdRequests). El valor por defecto se fija
//   en el <head> de cada página antes de cargar adsbygoogle.js.
// - Mantiene la clave histórica localStorage "viralix_cookies_accepted"
//   ('all' | 'minimal') para respetar las elecciones ya guardadas.
(function () {
  'use strict';
  var KEY = 'viralix_cookies_accepted';
  var DATE_KEY = 'viralix_cookies_date';

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); localStorage.setItem(DATE_KEY, new Date().toISOString()); } catch (e) {} }

  function applyConsent(choice) {
    var granted = choice === 'all' ? 'granted' : 'denied';
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== 'function') { window.gtag = function () { window.dataLayer.push(arguments); }; }
    window.gtag('consent', 'update', { ad_storage: granted, ad_user_data: granted, ad_personalization: granted, analytics_storage: 'denied' });
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.requestNonPersonalizedAds = choice === 'all' ? 0 : 1;
    window.adsbygoogle.pauseAdRequests = 0;
  }

  var css = '' +
    '#cookie-banner{--cb-bg:#11141c;--cb-text:#f1efe9;--cb-muted:rgba(241,239,233,.72);--cb-border:rgba(255,255,255,.14);--cb-accent:#ef3b22;' +
    'position:fixed;left:16px;right:16px;bottom:16px;z-index:99999;max-width:980px;margin:0 auto;background:var(--cb-bg);color:var(--cb-text);' +
    'border:1px solid var(--cb-border);border-top:3px solid var(--cb-accent);border-radius:10px;box-shadow:0 20px 60px rgba(0,0,0,.45);' +
    'font-family:"DM Sans",system-ui,-apple-system,"Segoe UI",sans-serif;font-size:14px;line-height:1.55;padding:18px 20px}' +
    'html[data-theme="light"] #cookie-banner,body.light #cookie-banner{--cb-bg:#fff;--cb-text:#15161b;--cb-muted:#4a4d57;--cb-border:rgba(20,20,30,.16);--cb-accent:#c42810}' +
    '#cookie-banner h2{font-size:15px;margin:0 0 6px;font-weight:700;letter-spacing:.2px}' +
    '#cookie-banner p{margin:0;color:var(--cb-muted)}' +
    '#cookie-banner a{color:var(--cb-text);text-decoration:underline;text-decoration-color:var(--cb-accent);text-underline-offset:2px}' +
    '#cookie-banner .cb-row{display:flex;gap:18px;align-items:center;justify-content:space-between;flex-wrap:wrap}' +
    '#cookie-banner .cb-text{flex:1 1 420px}' +
    '#cookie-banner .cb-actions{display:flex;gap:8px;flex-wrap:wrap}' +
    '#cookie-banner button{font:inherit;font-size:13px;font-weight:600;min-height:42px;padding:0 18px;border-radius:999px;cursor:pointer;border:1px solid var(--cb-accent);background:var(--cb-accent);color:#fff;transition:filter .2s}' +
    '#cookie-banner button:hover{filter:brightness(1.1)}' +
    '#cookie-banner button.cb-ghost{background:transparent;color:var(--cb-text);border-color:var(--cb-border)}' +
    '#cookie-banner button:focus-visible{outline:2px solid var(--cb-accent);outline-offset:2px}' +
    '#cookie-banner .cb-panel{margin-top:14px;padding-top:14px;border-top:1px solid var(--cb-border);display:none}' +
    '#cookie-banner.cb-config .cb-panel{display:block}' +
    '#cookie-banner .cb-opt{display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--cb-border)}' +
    '#cookie-banner .cb-opt:last-of-type{border-bottom:0}' +
    '#cookie-banner .cb-opt input{margin-top:4px;width:18px;height:18px;accent-color:var(--cb-accent)}' +
    '#cookie-banner .cb-opt strong{display:block}' +
    '@media (max-width:600px){#cookie-banner{left:8px;right:8px;bottom:8px;padding:16px}#cookie-banner .cb-actions{width:100%}#cookie-banner .cb-actions button{flex:1 1 30%}}';

  var banner = null;

  function build() {
    if (banner) return banner;
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-labelledby', 'cb-title');
    banner.innerHTML =
      '<div class="cb-row">' +
        '<div class="cb-text">' +
          '<h2 id="cb-title">Tu privacidad en VIRALIX</h2>' +
          '<p>Usamos almacenamiento técnico imprescindible (por ejemplo, para recordar esta elección o el modo claro/oscuro) y, <strong>solo si lo aceptas</strong>, cookies de Google AdSense para mostrar publicidad personalizada. Si rechazas, los anuncios que se muestren no serán personalizados. Más información en la <a href="/cookies.html">Política de cookies</a> y la <a href="/privacidad.html">Política de privacidad</a>.</p>' +
        '</div>' +
        '<div class="cb-actions">' +
          '<button type="button" data-cb="reject">Rechazar</button>' +
          '<button type="button" class="cb-ghost" data-cb="config" aria-expanded="false" aria-controls="cb-panel">Configurar</button>' +
          '<button type="button" data-cb="accept">Aceptar</button>' +
        '</div>' +
      '</div>' +
      '<div class="cb-panel" id="cb-panel">' +
        '<label class="cb-opt"><input type="checkbox" checked disabled><span><strong>Técnicas y necesarias</strong>Imprescindibles para el funcionamiento del sitio y para recordar tus preferencias. Siempre activas.</span></label>' +
        '<label class="cb-opt"><input type="checkbox" id="cb-ads"><span><strong>Publicidad personalizada (Google AdSense)</strong>Permite a Google y a sus socios usar cookies para mostrarte anuncios basados en tus intereses y medir su rendimiento.</span></label>' +
        '<div class="cb-actions" style="margin-top:12px"><button type="button" data-cb="save">Guardar mi elección</button></div>' +
      '</div>';
    document.body.appendChild(banner);

    banner.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cb]');
      if (!b) return;
      var act = b.getAttribute('data-cb');
      if (act === 'accept') choose('all');
      else if (act === 'reject') choose('minimal');
      else if (act === 'config') {
        var open = banner.classList.toggle('cb-config');
        b.setAttribute('aria-expanded', open ? 'true' : 'false');
      } else if (act === 'save') choose(document.getElementById('cb-ads').checked ? 'all' : 'minimal');
    });
    return banner;
  }

  function choose(v) {
    save(v);
    applyConsent(v);
    if (banner) { banner.remove(); banner = null; }
  }

  function open() {
    var b = build();
    var current = read();
    var box = document.getElementById('cb-ads');
    if (box) box.checked = current === 'all';
    b.classList.add('cb-config');
    var cfg = b.querySelector('[data-cb="config"]');
    if (cfg) cfg.setAttribute('aria-expanded', 'true');
    var first = b.querySelector('button');
    if (first) first.focus();
  }

  window.viralixCookies = { open: open, choice: read };

  // Enlaces "Configurar cookies" también en páginas antiguas (home, artículos).
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-cookie-settings]');
    if (t) { e.preventDefault(); open(); }
  });

  var stored = read();
  if (stored) { applyConsent(stored); return; }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
