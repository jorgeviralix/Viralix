// VIRALIX — Article Features v2
// Breadcrumbs, Next Article, Author, Save, Floating Share, TOC, Reading Time, Schema, Report Error
(function() {
  const article = document.querySelector('.contenido-wrapper, .contenido, article, main');
  if (!article) return;
  const title = document.title.split('|')[0].trim();

  // 1. BREADCRUMBS
  const nav = document.querySelector('nav');
  if (nav) {
    const bc = document.createElement('div');
    bc.style.cssText = 'max-width:760px;margin:0 auto;padding:12px 48px;font-size:12px;color:rgba(244,242,238,0.3);letter-spacing:0.5px;';
    const cat = document.title.includes('Marianas') || document.title.includes('Niño') || document.title.includes('Hantavirus') || document.title.includes('recuerdos') ? 'Ciencia' : 'True Crime';
    bc.innerHTML = '<a href="index.html" style="color:rgba(244,242,238,0.4);text-decoration:none">Inicio</a> <span style="margin:0 8px;opacity:0.4">→</span> <a href="index.html#articulos" style="color:rgba(244,242,238,0.4);text-decoration:none">' + cat + '</a> <span style="margin:0 8px;opacity:0.4">→</span> <span style="color:rgba(244,242,238,0.6)">' + title + '</span>';
    const hero = document.querySelector('.hero-periodico, .hero, .hero-articulo, header');
    if (hero) hero.parentNode.insertBefore(bc, hero.nextSibling);
  }

  // 2. TABLE OF CONTENTS
  const headings = article.querySelectorAll('h2');
  if (headings.length >= 3) {
    const toc = document.createElement('div');
    toc.style.cssText = 'background:rgba(15,17,24,0.8);border:1px solid rgba(255,255,255,0.07);border-left:3px solid #e8321a;padding:20px 24px;margin:32px 0;border-radius:2px;';
    toc.innerHTML = '<div style="font-size:0.6rem;letter-spacing:3px;text-transform:uppercase;color:#e8321a;margin-bottom:14px;font-weight:600">Índice del artículo</div>';
    headings.forEach((h, i) => {
      h.id = 'seccion-' + i;
      const link = document.createElement('a');
      link.href = '#seccion-' + i;
      link.textContent = h.textContent;
      link.style.cssText = 'display:block;padding:6px 0;font-size:0.88rem;color:rgba(244,242,238,0.5);text-decoration:none;transition:color 0.2s;border-bottom:1px solid rgba(255,255,255,0.04);';
      link.onmouseenter = () => link.style.color = '#e8321a';
      link.onmouseleave = () => link.style.color = 'rgba(244,242,238,0.5)';
      toc.appendChild(link);
    });
    headings[0].parentNode.insertBefore(toc, headings[0]);
  }

  // 3. READING TIME REMAINING
  const words = article.textContent.split(/\s+/).length;
  const totalMin = Math.ceil(words / 200);
  const timeEl = document.createElement('div');
  timeEl.style.cssText = 'position:fixed;top:70px;right:20px;background:rgba(15,17,24,0.9);border:1px solid rgba(255,255,255,0.07);padding:8px 14px;border-radius:2px;font-size:10px;letter-spacing:1px;text-transform:uppercase;color:rgba(244,242,238,0.4);z-index:400;opacity:0;transition:opacity 0.3s;';
  document.body.appendChild(timeEl);
  window.addEventListener('scroll', () => {
    const pct = Math.min(window.scrollY / (document.body.scrollHeight - window.innerHeight), 1);
    timeEl.textContent = Math.max(1, Math.ceil(totalMin * (1 - pct))) + ' min restantes';
    timeEl.style.opacity = (window.scrollY > 200 && pct < 0.95) ? '1' : '0';
  });

  // 4. BACK TO TOP
  const btt = document.createElement('button');
  btt.innerHTML = '↑';
  btt.style.cssText = 'position:fixed;bottom:30px;right:30px;width:44px;height:44px;background:#e8321a;border:none;border-radius:50%;color:#fff;font-size:18px;cursor:pointer;z-index:400;opacity:0;transform:translateY(20px);transition:all 0.3s;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(232,50,26,0.3);';
  document.body.appendChild(btt);
  window.addEventListener('scroll', () => {
    btt.style.opacity = window.scrollY > 400 ? '1' : '0';
    btt.style.transform = window.scrollY > 400 ? 'translateY(0)' : 'translateY(20px)';
  });
  btt.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // 5. FLOATING SHARE BAR
  const shareBar = document.createElement('div');
  const url = encodeURIComponent(window.location.href);
  const t = encodeURIComponent(document.title);
  shareBar.style.cssText = 'position:fixed;left:20px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:8px;z-index:400;opacity:0;transition:opacity 0.3s;';
  shareBar.innerHTML = `
    <a href="https://api.whatsapp.com/send?text=${t}%20${url}" target="_blank" style="width:40px;height:40px;background:#25D366;border-radius:50%;display:flex;align-items:center;justify-content:center;text-decoration:none;font-size:16px;box-shadow:0 2px 8px rgba(0,0,0,0.3)">📲</a>
    <a href="https://twitter.com/intent/tweet?url=${url}&text=${t}" target="_blank" style="width:40px;height:40px;background:#000;border:1px solid #333;border-radius:50%;display:flex;align-items:center;justify-content:center;text-decoration:none;font-size:14px;color:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.3)">𝕏</a>
    <a href="https://t.me/share/url?url=${url}&text=${t}" target="_blank" style="width:40px;height:40px;background:#0088cc;border-radius:50%;display:flex;align-items:center;justify-content:center;text-decoration:none;font-size:16px;box-shadow:0 2px 8px rgba(0,0,0,0.3)">✈</a>
    <button onclick="navigator.clipboard.writeText(window.location.href);this.innerHTML='✓';setTimeout(()=>this.innerHTML='🔗',2000)" style="width:40px;height:40px;background:rgba(15,17,24,0.9);border:1px solid rgba(255,255,255,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;color:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.3)">🔗</button>
  `;
  document.body.appendChild(shareBar);
  window.addEventListener('scroll', () => {
    shareBar.style.opacity = window.scrollY > 300 ? '1' : '0';
  });
  // Hide on mobile
  if (window.innerWidth < 900) shareBar.style.display = 'none';

  // 6. AUTHOR BOX
  const conclusion = document.querySelector('.conclusion');
  const authorBox = document.createElement('div');
  authorBox.style.cssText = 'background:rgba(15,17,24,0.6);border:1px solid rgba(255,255,255,0.07);padding:24px 28px;margin:40px 0 0;display:flex;align-items:center;gap:20px;border-radius:4px;';
  authorBox.innerHTML = `
    <div style="width:56px;height:56px;background:rgba(232,50,26,0.15);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0">V</div>
    <div>
      <div style="font-size:14px;font-weight:600;color:#f4f2ee;margin-bottom:4px">Equipo VIRALIX</div>
      <div style="font-size:12px;color:rgba(244,242,238,0.4);line-height:1.5">Investigamos los casos reales que marcaron la historia de España. Contenido verificado con fuentes judiciales y periodísticas.</div>
    </div>
  `;
  if (conclusion) conclusion.parentNode.insertBefore(authorBox, conclusion.nextSibling);
  else article.appendChild(authorBox);

  // 7. NEXT ARTICLE BUTTON
  const allArticles = [
    { url: 'articulo-alcasser.html', title: 'Caso Alcàsser' },
    { url: 'articulo-wanninkhof.html', title: 'Caso Wanninkhof' },
    { url: 'articulo-marta-castillo.html', title: 'Marta del Castillo' },
    { url: 'articulo-asesino-baraja.html', title: 'Asesino de la Baraja' },
    { url: 'articulo-katana.html', title: 'Asesino de la Katana' },
    { url: 'articulo-puerto-hurraco.html', title: 'Puerto Hurraco' },
    { url: 'articulo-crimen-rol.html', title: 'Crímenes del Rol' },
    { url: 'articulo-diana-quer.html', title: 'Diana Quer' },
    { url: 'articulo-asunta.html', title: 'Caso Asunta' },
    { url: 'articulo-urquijo.html', title: 'Marqueses de Urquijo' },
    { url: 'articulo-el-lute.html', title: 'El Lute' },
    { url: 'articulo-marianas.html', title: 'Fosa de las Marianas' },
    { url: 'articulo-hantavirus.html', title: 'Hantavirus' },
    { url: 'articulo-super-elnino.html', title: 'Super El Niño' },
    { url: 'articulo-falsos-recuerdos.html', title: 'Falsos Recuerdos' },
  ];
  const currentFile = window.location.pathname.split('/').pop();
  const currentIdx = allArticles.findIndex(a => a.url === currentFile);
  const nextArticle = allArticles[(currentIdx + 1) % allArticles.length];
  const nextBtn = document.createElement('a');
  nextBtn.href = nextArticle.url;
  nextBtn.style.cssText = 'display:flex;align-items:center;justify-content:space-between;background:rgba(15,17,24,0.6);border:1px solid rgba(255,255,255,0.07);padding:24px 28px;margin:24px 0;text-decoration:none;color:#f4f2ee;transition:all 0.2s;border-radius:4px;';
  nextBtn.innerHTML = '<div><div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(244,242,238,0.3);margin-bottom:6px">Siguiente caso</div><div style="font-size:16px;font-weight:600">' + nextArticle.title + '</div></div><div style="font-size:24px;color:#e8321a;transition:transform 0.2s">→</div>';
  nextBtn.onmouseenter = () => { nextBtn.style.borderColor = 'rgba(232,50,26,0.3)'; nextBtn.querySelector('div:last-child').style.transform = 'translateX(6px)'; };
  nextBtn.onmouseleave = () => { nextBtn.style.borderColor = 'rgba(255,255,255,0.07)'; nextBtn.querySelector('div:last-child').style.transform = 'translateX(0)'; };
  if (authorBox.parentNode) authorBox.parentNode.insertBefore(nextBtn, authorBox.nextSibling);

  // 8. SAVE ARTICLE
  const saveBtn = document.createElement('button');
  const saved = localStorage.getItem('viralix_saved_' + currentFile);
  saveBtn.innerHTML = saved ? '★ Guardado' : '☆ Guardar artículo';
  saveBtn.style.cssText = 'position:fixed;top:70px;right:160px;background:rgba(15,17,24,0.9);border:1px solid rgba(255,255,255,0.07);padding:8px 14px;border-radius:2px;font-size:10px;letter-spacing:1px;text-transform:uppercase;color:' + (saved ? '#e8321a' : 'rgba(244,242,238,0.4)') + ';z-index:400;cursor:pointer;transition:all 0.2s;opacity:0;';
  document.body.appendChild(saveBtn);
  window.addEventListener('scroll', () => {
    saveBtn.style.opacity = window.scrollY > 200 ? '1' : '0';
  });
  saveBtn.onclick = () => {
    if (localStorage.getItem('viralix_saved_' + currentFile)) {
      localStorage.removeItem('viralix_saved_' + currentFile);
      saveBtn.innerHTML = '☆ Guardar artículo';
      saveBtn.style.color = 'rgba(244,242,238,0.4)';
    } else {
      localStorage.setItem('viralix_saved_' + currentFile, title);
      saveBtn.innerHTML = '★ Guardado';
      saveBtn.style.color = '#e8321a';
    }
  };
  if (window.innerWidth < 900) saveBtn.style.display = 'none';

  // 9. REPORT ERROR + DATE
  const reportDiv = document.createElement('div');
  reportDiv.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:16px 0;margin:24px 0;border-top:1px solid rgba(255,255,255,0.05);flex-wrap:wrap;gap:12px;';
  const today = new Date();
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  reportDiv.innerHTML = `
    <span style="font-size:11px;color:rgba(244,242,238,0.25)">Última actualización: ${today.getDate()} de ${months[today.getMonth()]} de ${today.getFullYear()}</span>
    <a href="mailto:viralixweb@gmail.com?subject=Error%20en%20artículo:%20${encodeURIComponent(title)}" style="font-size:11px;color:rgba(244,242,238,0.25);text-decoration:none;display:flex;align-items:center;gap:6px;transition:color 0.2s" onmouseenter="this.style.color='#e8321a'" onmouseleave="this.style.color='rgba(244,242,238,0.25)'">⚠ ¿Has encontrado un error? Avísanos</a>
  `;
  if (nextBtn.parentNode) nextBtn.parentNode.insertBefore(reportDiv, nextBtn);

  // 10. SCHEMA MARKUP
  const schema = document.createElement('script');
  schema.type = 'application/ld+json';
  schema.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "author": { "@type": "Organization", "name": "VIRALIX" },
    "publisher": { "@type": "Organization", "name": "VIRALIX", "url": "https://www.viralixweb.es" },
    "datePublished": "2026-05-01",
    "dateModified": today.toISOString().split('T')[0],
    "mainEntityOfPage": window.location.href,
    "description": document.querySelector('meta[name="description"]')?.content || ''
  });
  document.head.appendChild(schema);

})();
