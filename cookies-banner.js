// VIRALIX — Banner de consentimiento de cookies RGPD
(function() {
  if (localStorage.getItem('viralix_cookies_accepted')) return;

  const banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.innerHTML = `
    <div style="
      position:fixed;bottom:0;left:0;right:0;z-index:99999;
      background:#0f1118;border-top:2px solid #e8321a;
      padding:20px 40px;display:flex;align-items:center;
      justify-content:space-between;gap:24px;flex-wrap:wrap;
      font-family:'DM Sans',sans-serif;font-size:13px;
      color:rgba(244,242,238,0.75);
      box-shadow:0 -4px 32px rgba(0,0,0,0.5);
    ">
      <div style="max-width:700px;line-height:1.6">
        🍪 <strong style="color:#f4f2ee">VIRALIX usa cookies</strong> para mejorar tu experiencia y mostrar publicidad relevante a través de Google AdSense. 
        Al continuar navegando aceptas nuestra <a href="/privacidad.html" style="color:#e8321a;text-decoration:underline">política de privacidad</a> y el uso de cookies.
      </div>
      <div style="display:flex;gap:12px;flex-shrink:0">
        <button id="cookie-reject" style="
          background:transparent;border:1px solid rgba(255,255,255,0.15);
          color:rgba(244,242,238,0.5);font-size:12px;font-weight:500;
          letter-spacing:1px;text-transform:uppercase;padding:10px 20px;
          cursor:pointer;border-radius:2px;transition:all .2s;
        ">Solo necesarias</button>
        <button id="cookie-accept" style="
          background:#e8321a;border:none;color:#fff;
          font-size:12px;font-weight:500;letter-spacing:1px;
          text-transform:uppercase;padding:10px 24px;
          cursor:pointer;border-radius:2px;transition:all .2s;
        ">Aceptar todo</button>
      </div>
    </div>
  `;
  document.body.appendChild(banner);

  document.getElementById('cookie-accept').addEventListener('click', function() {
    localStorage.setItem('viralix_cookies_accepted', 'all');
    banner.remove();
  });

  document.getElementById('cookie-reject').addEventListener('click', function() {
    localStorage.setItem('viralix_cookies_accepted', 'minimal');
    banner.remove();
  });
})();
