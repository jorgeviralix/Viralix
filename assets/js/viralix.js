/* VIRALIX — JS compartido de artículos nuevos y páginas institucionales.
   Sin dependencias. Todas las funciones comprueban que el elemento existe. */
(function () {
  'use strict';
  var doc = document.documentElement;

  function store(key, value) {
    try { if (value === undefined) return localStorage.getItem(key); localStorage.setItem(key, value); } catch (e) { return null; }
  }

  /* ---- Tema claro/oscuro (misma clave que la home: viralix_mode) ---- */
  var themeBtn = document.querySelector('[data-theme-toggle]');
  function applyTheme(mode) {
    if (mode === 'light') doc.setAttribute('data-theme', 'light'); else doc.removeAttribute('data-theme');
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', mode === 'light' ? 'true' : 'false');
      themeBtn.setAttribute('aria-label', mode === 'light' ? 'Activar modo oscuro' : 'Activar modo claro');
    }
  }
  applyTheme(store('viralix_mode') === 'light' ? 'light' : 'dark');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = doc.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    store('viralix_mode', next); applyTheme(next);
  });

  /* ---- Menú móvil ---- */
  var menuBtn = document.querySelector('[data-menu-toggle]');
  var nav = document.getElementById('main-nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { nav.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.focus(); }
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) { nav.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded', 'false'); } });
  }

  /* ---- Progreso de lectura y botón volver arriba ---- */
  var bar = document.querySelector('.read-progress span');
  var toTop = document.querySelector('.to-top');
  var ticking = false;
  function onScroll() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var y = window.scrollY || window.pageYOffset;
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    if (toTop) toTop.classList.toggle('is-visible', y > 700);
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---- Índice: resalta la sección visible ---- */
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.toc a[href^="#"]'));
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    tocLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          tocLinks.forEach(function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
          var link = map[en.target.id];
          if (link) { link.classList.add('is-active'); link.setAttribute('aria-current', 'true'); }
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    Object.keys(map).forEach(function (id) { var h = document.getElementById(id); if (h) io.observe(h); });
  }

  /* ---- Animación de aparición (solo para elementos aún no visibles; sin JS todo se ve) ---- */
  var fades = document.querySelectorAll('.fx-fade');
  if (fades.length && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var fio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.remove('fx-pending'); fio.unobserve(en.target); } });
    }, { threshold: 0.05 });
    fades.forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add('fx-pending'); fio.observe(el); }
    });
  }

  /* ---- Compartir: copiar enlace y compartir nativo ---- */
  document.querySelectorAll('[data-copy-link]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var url = btn.getAttribute('data-copy-link') || window.location.href;
      var label = btn.querySelector('span');
      var done = function () { if (label) { var t = label.textContent; label.textContent = '¡Copiado!'; setTimeout(function () { label.textContent = t; }, 2000); } };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, done);
      else { var i = document.createElement('input'); i.value = url; document.body.appendChild(i); i.select(); try { document.execCommand('copy'); } catch (e) {} i.remove(); done(); }
    });
  });
  document.querySelectorAll('[data-native-share]').forEach(function (btn) {
    if (!navigator.share) { btn.hidden = true; return; }
    btn.addEventListener('click', function () {
      navigator.share({ title: document.title, url: btn.getAttribute('data-native-share') || window.location.href }).catch(function () {});
    });
  });

  /* ---- Formulario de contacto: compone un correo (no envía datos a terceros) ---- */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = document.getElementById('form-status');
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var data = new FormData(form);
      var subject = '[VIRALIX] ' + (data.get('motivo') || 'Contacto') + ' — ' + (data.get('nombre') || '');
      var body = 'Nombre: ' + data.get('nombre') + '\nEmail: ' + data.get('email') + '\nMotivo: ' + data.get('motivo') + '\n\n' + data.get('mensaje');
      window.location.href = 'mailto:viralixweb@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      if (status) status.textContent = 'Se ha abierto tu programa de correo con el mensaje preparado. Si no se abre, escríbenos directamente a viralixweb@gmail.com.';
    });
  }

  /* ---- Artículo aleatorio (botón de la página 404) ---- */
  document.querySelectorAll('[data-random-article]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var list = (btn.getAttribute('data-random-article') || '').split(',').filter(Boolean);
      if (list.length) window.location.href = list[Math.floor(Math.random() * list.length)];
    });
  });

})();
