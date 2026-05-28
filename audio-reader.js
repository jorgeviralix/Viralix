// VIRALIX — Escuchar artículo con voz del navegador
(function() {
  const article = document.querySelector('.contenido-wrapper, .contenido, article, main');
  if (!article || !('speechSynthesis' in window)) return;

  // Crear botón
  const btn = document.createElement('button');
  btn.className = 'audio-btn';
  btn.innerHTML = '🎧 Escuchar artículo';
  btn.style.cssText = 'display:inline-flex;align-items:center;gap:10px;background:rgba(15,17,24,0.9);border:1px solid rgba(255,255,255,0.07);color:#f4f2ee;font-family:inherit;font-size:12px;font-weight:500;letter-spacing:2px;text-transform:uppercase;padding:12px 24px;cursor:pointer;border-radius:2px;transition:all .2s;margin:16px 0 32px;';

  // Insertar después del primer h2 o lead
  const lead = article.querySelector('.lead, h2, .hero-lead');
  if (lead) {
    lead.parentNode.insertBefore(btn, lead.nextSibling);
  } else {
    article.prepend(btn);
  }

  let speaking = false;
  let utterance = null;

  btn.addEventListener('click', () => {
    if (speaking) {
      speechSynthesis.cancel();
      btn.innerHTML = '🎧 Escuchar artículo';
      btn.style.borderColor = 'rgba(255,255,255,0.07)';
      btn.style.color = '#f4f2ee';
      speaking = false;
      return;
    }

    const paragraphs = article.querySelectorAll('p');
    let text = '';
    paragraphs.forEach(p => {
      if (!p.closest('.ad-slot') && !p.closest('footer') && !p.closest('.newsletter') && p.textContent.trim().length > 20) {
        text += p.textContent + '. ';
      }
    });

    if (!text) return;

    utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.95;
    utterance.pitch = 1;

    // Intentar usar voz española
    const voices = speechSynthesis.getVoices();
    const esVoice = voices.find(v => v.lang.startsWith('es'));
    if (esVoice) utterance.voice = esVoice;

    utterance.onend = () => {
      btn.innerHTML = '🎧 Escuchar artículo';
      btn.style.borderColor = 'rgba(255,255,255,0.07)';
      btn.style.color = '#f4f2ee';
      speaking = false;
    };

    speechSynthesis.speak(utterance);
    btn.innerHTML = '⏸️ Pausar audio';
    btn.style.borderColor = '#e8321a';
    btn.style.color = '#e8321a';
    speaking = true;
  });
})();
