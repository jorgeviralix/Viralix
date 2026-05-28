// VIRALIX — Article features: Table of Contents + Reading Time + Back to Top + Share buttons
(function() {
  const article = document.querySelector('.contenido-wrapper, .contenido, article, main');
  if (!article) return;

  // 1. TABLE OF CONTENTS
  const headings = article.querySelectorAll('h2');
  if (headings.length >= 3) {
    const toc = document.createElement('div');
    toc.style.cssText = 'background:rgba(15,17,24,0.8);border:1px solid rgba(255,255,255,0.07);border-left:3px solid #e8321a;padding:20px 24px;margin:32px 0;border-radius:2px;';
    let tocTitle = document.createElement('div');
    tocTitle.textContent = 'ÍNDICE DEL ARTÍCULO';
    tocTitle.style.cssText = 'font-size:0.6rem;letter-spacing:3px;text-transform:uppercase;color:#e8321a;margin-bottom:14px;font-weight:600;';
    toc.appendChild(tocTitle);
    headings.forEach((h, i) => {
      h.id = 'seccion-' + i;
      const link = document.createElement('a');
      link.href = '#seccion-' + i;
      link.textContent = h.textContent;
      link.style.cssText = 'display:block;padding:6px 0;font-size:0.88rem;color:rgba(244,242,238,0.5);text-decoration:none;transition:color 0.2s;border-bottom:1px solid rgba(255,255,255,0.04);';
      link.addEventListener('mouseenter', () => { link.style.color = '#e8321a'; });
      link.addEventListener('mouseleave', () => { link.style.color = 'rgba(244,242,238,0.5)'; });
      toc.appendChild(link);
    });
    const firstH2 = headings[0];
    if (firstH2) firstH2.parentNode.insertBefore(toc, firstH2);
  }

  // 2. READING TIME REMAINING
  const words = article.textContent.split(/\s+/).length;
  const totalMinutes = Math.ceil(words / 200);
  const timeWidget = document.createElement('div');
  timeWidget.style.cssText = 'position:fixed;top:70px;right:20px;background:rgba(15,17,24,0.9);border:1px solid rgba(255,255,255,0.07);padding:8px 14px;border-radius:2px;font-size:10px;letter-spacing:1px;text-transform:uppercase;color:rgba(244,242,238,0.4);z-index:400;transition:opacity 0.3s;opacity:0;';
  document.body.appendChild(timeWidget);
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.body.scrollHeight - window.innerHeight;
    const pct = Math.min(scrolled / total, 1);
    const remaining = Math.max(1, Math.ceil(totalMinutes * (1 - pct)));
    timeWidget.textContent = remaining + ' min restantes';
    timeWidget.style.opacity = (scrolled > 200 && pct < 0.95) ? '1' : '0';
  });

  // 3. BACK TO TOP for articles
  const btt = document.createElement('button');
  btt.innerHTML = '↑';
  btt.style.cssText = 'position:fixed;bottom:30px;right:30px;width:44px;height:44px;background:#e8321a;border:none;border-radius:50%;color:#fff;font-size:18px;cursor:pointer;z-index:400;opacity:0;transform:translateY(20px);transition:all 0.3s;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(232,50,26,0.3);';
  document.body.appendChild(btt);
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) { btt.style.opacity = '1'; btt.style.transform = 'translateY(0)'; }
    else { btt.style.opacity = '0'; btt.style.transform = 'translateY(20px)'; }
  });
  btt.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // 4. EXPANDED SHARE BUTTONS
  const waBtn = document.querySelector('.whatsapp-btn, .wa-btn, .whatsapp-share a');
  if (waBtn) {
    const shareRow = document.createElement('div');
    shareRow.style.cssText = 'display:flex;gap:8px;justify-content:center;margin-top:12px;flex-wrap:wrap;';
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    shareRow.innerHTML = `
      <a href="https://twitter.com/intent/tweet?url=${url}&text=${title}" target="_blank" style="background:#000;color:#fff;border:1px solid #333;font-size:0.7rem;letter-spacing:1px;text-transform:uppercase;padding:6px 12px;text-decoration:none;border-radius:2px;display:inline-flex;align-items:center;gap:4px">𝕏 Twitter</a>
      <a href="https://t.me/share/url?url=${url}&text=${title}" target="_blank" style="background:#0088cc;color:#fff;font-size:0.7rem;letter-spacing:1px;text-transform:uppercase;padding:6px 12px;text-decoration:none;border-radius:2px;display:inline-flex;align-items:center;gap:4px">✈ Telegram</a>
      <button onclick="navigator.clipboard.writeText(window.location.href);this.textContent='✓ Copiado'" style="background:rgba(15,17,24,0.9);color:rgba(244,242,238,0.5);border:1px solid rgba(255,255,255,0.07);font-size:0.7rem;letter-spacing:1px;text-transform:uppercase;padding:6px 12px;cursor:pointer;border-radius:2px">📋 Copiar enlace</button>
    `;
    waBtn.parentNode.insertBefore(shareRow, waBtn.nextSibling);
  }
})();
