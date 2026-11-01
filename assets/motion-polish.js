/* ==========================================================================
   PORTFÖYTR — 4 TEMA ORTAK RENK DERİN-LİNK, ÇOKLU FOTOĞRAF & HAREKET MOTORU
   ========================================================================== */
(function () {
  'use strict';

  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1) ?palette=... URL parametresiyle doğrudan istenen renk paletinde açılış
  const params = new URLSearchParams(window.location.search);
  const urlPal = params.get('palette');
  if (urlPal) {
    document.documentElement.setAttribute('data-palette', urlPal);
    window.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('[data-pal], [data-palette-btn], [data-set-palette]').forEach(btn => {
        const val = btn.getAttribute('data-pal') || btn.getAttribute('data-palette-btn') || btn.getAttribute('data-set-palette');
        if (val) {
          btn.classList.toggle('active', val === urlPal);
          btn.classList.toggle('is-active', val === urlPal);
        }
      });
    });
  }

  // 2) Tema 3 (Pro Portal) için üst kısma görseli doyurucu "Vitrin Fırsat Şeridi" ekle
  window.addEventListener('DOMContentLoaded', () => {
    const E = window.PortfoyEngine;
    if (!E) return;

    const pMain = document.querySelector('.p-layout') || document.querySelector('#pTableWrap');
    if (pMain && !document.getElementById('t3VisualShowcaseStrip')) {
      const featured = E.getListings().filter(x => x.featured || x.urgent).slice(0, 5);
      const strip = document.createElement('section');
      strip.id = 't3VisualShowcaseStrip';
      strip.setAttribute('aria-label', 'Vitrin Öne Çıkan Fotoğraflı Portföy');
      strip.style.cssText = 'max-width:1400px;margin:14px auto 4px;padding:0 18px;';
      strip.innerHTML = `
        <div style="background:var(--panel);border:1px solid var(--border);border-radius:10px;padding:14px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:8px;">
            <strong style="font-size:13.5px;display:flex;align-items:center;gap:8px;">
              <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--accent);"></span>
              VİTRİN ÖZEL SEÇKİSİ — Ekspertiz &amp; Tapu Garantili Fırsat Portföyü
            </strong>
            <span style="font-size:12px;color:var(--muted);">Detaylı incelemek için kartlara tıklayın</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(225px,1fr));gap:12px;">
            ${featured.map(it => `
              <div data-t3-quick="${it.id}" style="cursor:pointer;border-radius:8px;overflow:hidden;border:1px solid var(--border-soft);background:var(--bg);transition:transform 0.24s cubic-bezier(0.16,1,0.3,1),box-shadow 0.24s ease;">
                <div style="position:relative;height:132px;overflow:hidden;">
                  <img src="${it.images[0]}" alt="${it.title}" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.45s ease;" />
                  <span style="position:absolute;top:8px;left:8px;padding:3px 8px;border-radius:4px;font-size:10.5px;font-weight:700;background:rgba(15,23,42,0.82);color:#fff;">
                    ${it.sector === 'oto' ? 'VASITA' : 'EMLAK'} · ${it.city}
                  </span>
                  <span style="position:absolute;bottom:8px;right:8px;padding:3px 8px;border-radius:4px;font-family:var(--mono);font-size:11.5px;font-weight:700;background:var(--accent);color:var(--accent-fg);">
                    ${E.formatShortPin(it.price)}
                  </span>
                </div>
                <div style="padding:9px 11px;">
                  <div style="font-weight:700;font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${it.title}</div>
                  <div style="font-size:11.5px;color:var(--muted);margin-top:2px;">
                    ${it.sector === 'oto' ? (it.year + ' · ' + Number(it.km).toLocaleString('tr-TR') + ' km · ' + (it.damageSummary || '')) : (it.rooms + ' · ' + it.sqmNet + ' m² · ' + it.dealType)}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      pMain.parentNode.insertBefore(strip, pMain);

      strip.querySelectorAll('[data-t3-quick]').forEach(card => {
        card.addEventListener('pointerenter', () => {
          if (reduced) return;
          card.style.transform = 'translateY(-4px)';
          card.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
          const im = card.querySelector('img');
          if (im) im.style.transform = 'scale(1.06)';
        });
        card.addEventListener('pointerleave', () => {
          card.style.transform = '';
          card.style.boxShadow = '';
          const im = card.querySelector('img');
          if (im) im.style.transform = '';
        });
        card.addEventListener('click', () => {
          const id = card.getAttribute('data-t3-quick');
          const rowBtn = document.querySelector(`[data-open="${id}"], [data-id="${id}"]`);
          if (rowBtn) rowBtn.click();
        });
      });
    }

    // 3) Tema 2 (Lüks Showroom) 3D Kart Perspektif Eğimi & Otomatik Sinematik Hero Döngüsü
    const t2Grid = document.getElementById('t2Grid');
    if (t2Grid && !reduced) {
      t2Grid.addEventListener('pointermove', e => {
        const card = e.target.closest('.sh-card');
        if (!card) return;
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${px * 5}deg) rotateX(${-py * 5}deg) translateY(-4px)`;
      });
      t2Grid.addEventListener('pointerout', e => {
        const card = e.target.closest('.sh-card');
        if (card && !card.contains(e.relatedTarget)) {
          card.style.transform = '';
        }
      });
    }

    // 4) Kart / Satır Girişlerinde Yumuşak Staggered Dalga Animasyonu
    if (!reduced) {
      const animateTargets = document.querySelectorAll('.t1-card, .sh-card, #t3VisualShowcaseStrip [data-t3-quick]');
      animateTargets.forEach((el, idx) => {
        if (el.animate) {
          el.animate(
            [
              { opacity: 0, transform: 'translateY(16px)' },
              { opacity: 1, transform: 'translateY(0)' }
            ],
            { duration: 420, delay: Math.min(idx * 45, 320), easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'both' }
          );
        }
      });
    }
  });
})();
