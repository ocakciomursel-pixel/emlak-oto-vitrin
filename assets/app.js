/* ==========================================================================
   PORTFÖYTR — CANLI EMLAK & OTO İLAN MOTORU + YÖNETİM PANELİ SENKRONİZASYONU
   ========================================================================== */
(function () {
  'use strict';

  const STORAGE_KEY = 'portfoytr_listings_v1';
  const SETTINGS_KEY = 'portfoytr_settings_v1';

  // Güvenli SVG Yedek Görseller (sıfır kırık görsel garantisi)
  function fallbackSvg(label, bg) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="${bg}"/><text x="400" y="255" font-family="Inter,sans-serif" font-size="26" font-weight="600" fill="#ffffff" text-anchor="middle">${label}</text></svg>`;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }

  const DEFAULT_LISTINGS = [
    {
      id: 'PRT-1041',
      sector: 'emlak',
      dealType: 'Satılık',
      urgent: true,
      title: 'Kadıköy Suadiye Bağdat Caddesi Yakını Balkonlu Yeni 3+1 Daire',
      city: 'İstanbul',
      district: 'Kadıköy / Suadiye',
      price: 14750000,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
      rooms: '3+1',
      sqm: 138,
      buildingAge: 'Sıfır Bina',
      heating: 'Yerden Isıtma',
      creditOk: 'Krediye Uygun · Kat Mülkiyetli',
      desc: ' Kapalı otoparklı, akıllı ev sistemli, çift banyolu ve geniş peyzaj balkonlu sıfır daire. Tapu hemen devredilebilir.'
    },
    {
      id: 'PRT-2084',
      sector: 'oto',
      dealType: 'Satılık',
      urgent: true,
      title: '2022 BMW 320i First Edition M Sport — Hatasız Boyasız Tramersiz',
      city: 'İstanbul',
      district: 'Ataşehir / Merkez',
      price: 2940000,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80',
      brand: 'BMW 320i M Sport',
      year: 2022,
      km: 34500,
      fuelGear: 'Benzin · Otomatik',
      damage: 'Hatasız · Boyasız · 0 TL Tramer',
      ekspertiz: { Kaput: 'Orijinal', Tavan: 'Orijinal', 'Ön Tampon': 'Orijinal', 'Sol Ön Kapı': 'Orijinal', 'Sağ Ön Kapı': 'Orijinal', Bagaj: 'Orijinal' },
      desc: 'Yetkili servis bakımlı, Harman Kardon ses sistemi, açılır cam tavan, hayalet ekran. Kurumsal ekspertiz raporu mevcuttur.'
    },
    {
      id: 'PRT-1042',
      sector: 'emlak',
      dealType: 'Satılık',
      urgent: false,
      title: 'Çankaya İncek Müstakil Havuzlu 4+1 Modern Bahçeli Villa',
      city: 'Ankara',
      district: 'Çankaya / İncek',
      price: 19500000,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80',
      rooms: '4+1',
      sqm: 265,
      buildingAge: '2 Yaşında',
      heating: 'Isı Pompası + Yerden',
      creditOk: 'Krediye Uygun · Müstakil Parsel',
      desc: '520 m² arsa payı içinde özel yüzme havuzlu, kış bahçeli, şömineli ve 2 araçlık kapalı garajlı lüks villa.'
    },
    {
      id: 'PRT-2085',
      sector: 'oto',
      dealType: 'Satılık',
      urgent: false,
      title: '2023 Volkswagen Tiguan 1.5 TSI Elegance DSG — Cam Tavan',
      city: 'Ankara',
      district: 'Çankaya / Söğütözü',
      price: 2185000,
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80',
      brand: 'VW Tiguan Elegance',
      year: 2023,
      km: 21800,
      fuelGear: 'Benzin · Otomatik',
      damage: 'Hatasız · Boyasız',
      ekspertiz: { Kaput: 'Orijinal', Tavan: 'Orijinal', 'Sol Arka Çamurluk': 'Lokal Boya', 'Sağ Ön Kapı': 'Orijinal', 'Sol Ön Kapı': 'Orijinal', Bagaj: 'Orijinal' },
      desc: 'İlk sahibinden, IQ.Light Matrix farlar, elektrikli bagaj, ısıtmalı koltuklar. Takas değerlendirilir.'
    },
    {
      id: 'PRT-1043',
      sector: 'emlak',
      dealType: 'Kiralık',
      urgent: false,
      title: 'Karşıyaka Mavişehir Site İçi Deniz Manzaralı 2+1 Rezidans',
      city: 'İzmir',
      district: 'Karşıyaka / Mavişehir',
      price: 42500,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
      rooms: '2+1',
      sqm: 105,
      buildingAge: '4 Yaşında',
      heating: 'Merkezi Pay Ölçer',
      creditOk: '7/24 Güvenlik · Havuz & Spor Salonu',
      desc: 'Ankastre mutfak seti takılı, tramvay ve sahil yürüyüş yoluna 3 dakika mesafede kurumsal kiracıya uygun daire.'
    },
    {
      id: 'PRT-2086',
      sector: 'oto',
      dealType: 'Satılık',
      urgent: true,
      title: '2021 Mercedes-Benz C200d AMG 4Matic — Gece Paketi',
      city: 'Bursa',
      district: 'Nilüfer / Özlüce',
      price: 2790000,
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80',
      brand: 'Mercedes C200d AMG',
      year: 2021,
      km: 58000,
      fuelGear: 'Dizel · Otomatik',
      damage: 'Boyasız · 0 TL Tramer',
      ekspertiz: { Kaput: 'Orijinal', Tavan: 'Orijinal', 'Ön Tampon': 'Orijinal', 'Sol Ön Kapı': 'Orijinal', 'Sağ Ön Kapı': 'Orijinal', Bagaj: 'Orijinal' },
      desc: 'Burmester ses sistemi, panoramik tavan, hafızalı elektrikli koltuklar, 4 lastik sıfır Michelin.'
    },
    {
      id: 'PRT-1044',
      sector: 'emlak',
      dealType: 'Satılık',
      urgent: false,
      title: 'Nilüfer Bademli Güvenlikli Sitede Modern 3+1 Bahçe Dubleksi',
      city: 'Bursa',
      district: 'Nilüfer / Bademli',
      price: 8650000,
      image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=80',
      rooms: '3+1',
      sqm: 162,
      buildingAge: '1 Yaşında',
      heating: 'Kombi (Doğalgaz)',
      creditOk: 'Krediye Uygun · Araç Takaslı',
      desc: 'Müstakil bahçe kullanımlı, ebeveyn banyolu, giyinme odalı. Değerinde binek araç takası kabul edilir.'
    },
    {
      id: 'PRT-2087',
      sector: 'oto',
      dealType: 'Satılık',
      urgent: false,
      title: '2024 Renault Megane 1.3 TCe Icon EDC — Sıfır Ayarında',
      city: 'Antalya',
      district: 'Muratpaşa / Lara',
      price: 1560000,
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=80',
      brand: 'Renault Megane Icon',
      year: 2024,
      km: 9400,
      fuelGear: 'Benzin · Otomatik',
      damage: 'Hatasız · Boyasız · Garantili',
      ekspertiz: { Kaput: 'Orijinal', Tavan: 'Orijinal', 'Ön Tampon': 'Orijinal', 'Sol Ön Kapı': 'Orijinal', 'Sağ Ön Kapı': 'Orijinal', Bagaj: 'Orijinal' },
      desc: 'Fabrika garantisi devam ediyor, elmas kesim jant, geri görüş kamerası ve kablosuz CarPlay.'
    }
  ];

  function getSettings() {
    try {
      const s = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
      return {
        siteName: s.siteName || 'PortföyTR',
        siteSub: s.siteSub || 'Gayrimenkul & Vasıta İlan Merkezi',
        phone: s.phone || '905017037004',
        theme: s.theme || 'light',
        accent: s.accent || 'blue'
      };
    } catch {
      return { siteName: 'PortföyTR', siteSub: 'Gayrimenkul & Vasıta İlan Merkezi', phone: '905017037004', theme: 'light', accent: 'blue' };
    }
  }

  function saveSettings(patch) {
    const next = Object.assign(getSettings(), patch);
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(next)); } catch {}
    applyBranding(next);
  }

  function getListings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch {}
    return DEFAULT_LISTINGS.slice();
  }

  function saveListings(arr) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); } catch {}
  }

  function formatTL(n, dealType) {
    const formatted = Number(n || 0).toLocaleString('tr-TR') + ' ₺';
    return dealType === 'Kiralık' ? formatted + ' / Ay' : formatted;
  }

  function applyBranding(cfg) {
    document.documentElement.setAttribute('data-theme', cfg.theme);
    document.documentElement.setAttribute('data-accent', cfg.accent);
    document.querySelectorAll('[data-brand-name]').forEach(el => { el.textContent = cfg.siteName; });
    document.querySelectorAll('[data-brand-sub]').forEach(el => { el.textContent = cfg.siteSub; });
    document.querySelectorAll('[data-set-accent]').forEach(btn => {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-set-accent') === cfg.accent ? 'true' : 'false');
    });
    const darkBtn = document.getElementById('toggleDarkBtn');
    if (darkBtn) darkBtn.textContent = cfg.theme === 'dark' ? 'Açık Tema' : 'Gece Modu';
  }

  applyBranding(getSettings());

  // Üst bar renk & gece modu kontrolleri
  document.querySelectorAll('[data-set-accent]').forEach(btn => {
    btn.addEventListener('click', function () {
      saveSettings({ accent: btn.getAttribute('data-set-accent') });
    });
  });
  const darkBtn = document.getElementById('toggleDarkBtn');
  if (darkBtn) {
    darkBtn.addEventListener('click', function () {
      const cur = getSettings().theme;
      saveSettings({ theme: cur === 'dark' ? 'light' : 'dark' });
    });
  }

  // VİTRİN SAYFASI (index.html)
  const gridEl = document.getElementById('listingsGrid');
  if (gridEl) {
    const state = {
      sector: 'all',
      q: '',
      city: 'all',
      dealType: 'all',
      sort: 'newest',
      minPrice: '',
      maxPrice: '',
      rooms: 'all',
      fuel: 'all',
      maxKm: '',
      undamagedOnly: false
    };

    const countEl = document.getElementById('resultsCount');
    const emlakFilterBox = document.getElementById('emlakSpecificFilters');
    const otoFilterBox = document.getElementById('otoSpecificFilters');

    function syncFilterVisibility() {
      if (emlakFilterBox) emlakFilterBox.hidden = state.sector === 'oto';
      if (otoFilterBox) otoFilterBox.hidden = state.sector === 'emlak';
    }

    function renderGrid() {
      syncFilterVisibility();
      const all = getListings();
      let list = all.filter(item => {
        if (state.sector !== 'all' && item.sector !== state.sector) return false;
        if (state.city !== 'all' && item.city !== state.city) return false;
        if (state.dealType !== 'all' && item.dealType !== state.dealType) return false;
        if (state.minPrice && item.price < Number(state.minPrice)) return false;
        if (state.maxPrice && item.price > Number(state.maxPrice)) return false;
        if (state.q) {
          const hay = (item.title + ' ' + item.city + ' ' + item.district + ' ' + item.id + ' ' + (item.brand || '')).toLowerCase();
          if (!hay.includes(state.q.toLowerCase())) return false;
        }
        if (state.rooms !== 'all' && item.sector === 'emlak' && item.rooms !== state.rooms) return false;
        if (state.fuel !== 'all' && item.sector === 'oto' && !(item.fuelGear || '').toLowerCase().includes(state.fuel.toLowerCase())) return false;
        if (state.maxKm && item.sector === 'oto' && item.km > Number(state.maxKm)) return false;
        if (state.undamagedOnly && item.sector === 'oto' && !(item.damage || '').toLowerCase().includes('boyasız')) return false;
        return true;
      });

      if (state.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
      else if (state.sort === 'price-desc') list.sort((a, b) => b.price - a.price);

      if (countEl) {
        countEl.textContent = list.length + ' aktif ilan listeleniyor';
      }

      if (!list.length) {
        gridEl.innerHTML = '<div style="grid-column:1/-1;background:var(--bg-card);border:1px solid var(--border-std);border-radius:12px;padding:32px;text-align:center;color:var(--ink-muted);">Seçtiğiniz filtrelere uygun ilan bulunamadı. Filtreleri sıfırlayarak tüm portföyü görüntüleyebilirsiniz.</div>';
        return;
      }

      gridEl.innerHTML = list.map(item => {
        const isEmlak = item.sector === 'emlak';
        const sectorBadge = isEmlak
          ? '<span class="pill pill-sector-emlak">EMLAK · ' + item.dealType.toUpperCase() + '</span>'
          : '<span class="pill pill-sector-oto">VASITA · GALERİ</span>';
        const urgentBadge = item.urgent ? '<span class="pill pill-urgent">VİTRİN FIRSATI</span>' : '<span></span>';

        const specsHtml = isEmlak
          ? `<div class="spec-cell"><span>Oda Planı</span><strong>${item.rooms}</strong></div>
             <div class="spec-cell"><span>Net Alan</span><strong class="num">${item.sqm} m²</strong></div>
             <div class="spec-cell"><span>Bina Yaşı</span><strong>${item.buildingAge}</strong></div>`
          : `<div class="spec-cell"><span>Model Yılı</span><strong class="num">${item.year}</strong></div>
             <div class="spec-cell"><span>Kilometre</span><strong class="num">${Number(item.km).toLocaleString('tr-TR')} km</strong></div>
             <div class="spec-cell"><span>Ekspertiz</span><strong>${(item.damage || '').split('·')[0].trim()}</strong></div>`;

        const fb = fallbackSvg(isEmlak ? 'Gayrimenkul Portföyü' : 'Otomotiv Portföyü', isEmlak ? '#0f172a' : '#1e3a8a');

        return `<article class="listing-card">
          <div class="card-media">
            <img src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.onerror=null;this.src='${fb}';">
            <div class="card-badges">${sectorBadge}${urgentBadge}</div>
          </div>
          <div class="card-body">
            <div class="card-price-row">
              <span class="card-price num">${formatTL(item.price, item.dealType)}</span>
              <span class="card-code">#${item.id}</span>
            </div>
            <h3 class="card-title">${item.title}</h3>
            <div class="card-loc">${item.city} · ${item.district}</div>
            <div class="spec-pills">${specsHtml}</div>
            <div class="card-footer">
              <button type="button" class="btn btn-brand" data-open-detail="${item.id}">İlan &amp; Ekspertiz Detayı</button>
              <a class="btn btn-wa" target="_blank" rel="noopener" href="https://wa.me/${getSettings().phone}?text=${encodeURIComponent(item.id + ' nolu ' + item.title + ' ilanı hakkında bilgi almak istiyorum.')}">WhatsApp</a>
            </div>
          </div>
        </article>`;
      }).join('');

      gridEl.querySelectorAll('[data-open-detail]').forEach(btn => {
        btn.addEventListener('click', function () {
          openDetailModal(btn.getAttribute('data-open-detail'));
        });
      });
    }

    // Sekme ve filtre olayları
    document.querySelectorAll('[data-sector-tab]').forEach(tab => {
      tab.addEventListener('click', function () {
        state.sector = tab.getAttribute('data-sector-tab');
        document.querySelectorAll('[data-sector-tab]').forEach(t => t.classList.toggle('is-active', t === tab));
        renderGrid();
      });
    });

    const bindInput = (id, key) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', () => { state[key] = el.value; renderGrid(); });
      el.addEventListener('change', () => { state[key] = el.type === 'checkbox' ? el.checked : el.value; renderGrid(); });
    };

    bindInput('qSearch', 'q');
    bindInput('citySelect', 'city');
    bindInput('dealSelect', 'dealType');
    bindInput('sortSelect', 'sort');
    bindInput('minPriceInp', 'minPrice');
    bindInput('maxPriceInp', 'maxPrice');
    bindInput('maxKmInp', 'maxKm');
    bindInput('undamagedChk', 'undamagedOnly');

    document.querySelectorAll('[data-room-chip]').forEach(chip => {
      chip.addEventListener('click', () => {
        const val = chip.getAttribute('data-room-chip');
        state.rooms = state.rooms === val ? 'all' : val;
        document.querySelectorAll('[data-room-chip]').forEach(c => c.classList.toggle('is-selected', c.getAttribute('data-room-chip') === state.rooms));
        renderGrid();
      });
    });

    document.querySelectorAll('[data-fuel-chip]').forEach(chip => {
      chip.addEventListener('click', () => {
        const val = chip.getAttribute('data-fuel-chip');
        state.fuel = state.fuel === val ? 'all' : val;
        document.querySelectorAll('[data-fuel-chip]').forEach(c => c.classList.toggle('is-selected', c.getAttribute('data-fuel-chip') === state.fuel));
        renderGrid();
      });
    });

    const resetBtn = document.getElementById('resetFiltersBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        Object.assign(state, { sector: 'all', q: '', city: 'all', dealType: 'all', minPrice: '', maxPrice: '', rooms: 'all', fuel: 'all', maxKm: '', undamagedOnly: false });
        ['qSearch', 'minPriceInp', 'maxPriceInp', 'maxKmInp'].forEach(id => { const e = document.getElementById(id); if (e) e.value = ''; });
        ['citySelect', 'dealSelect'].forEach(id => { const e = document.getElementById(id); if (e) e.value = 'all'; });
        const chk = document.getElementById('undamagedChk');
        if (chk) chk.checked = false;
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('is-selected'));
        document.querySelectorAll('[data-sector-tab]').forEach(t => t.classList.toggle('is-active', t.getAttribute('data-sector-tab') === 'all'));
        renderGrid();
      });
    }

    // DETAY MODALI
    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('detailModalContent');
    function openDetailModal(id) {
      const item = getListings().find(x => x.id === id);
      if (!item || !modal || !modalBody) return;
      const isEmlak = item.sector === 'emlak';
      let rightPanelHtml = '';
      if (isEmlak) {
        rightPanelHtml = `
          <div class="ekspertiz-box">
            <strong>Tapu, Konut &amp; Finansman Özeti</strong>
            <div class="part-grid">
              <div class="part-row"><span>Oda / Alan</span><strong>${item.rooms} · ${item.sqm} m²</strong></div>
              <div class="part-row"><span>Bina Yaşı</span><strong>${item.buildingAge}</strong></div>
              <div class="part-row"><span>Isıtma</span><strong>${item.heating || 'Doğalgaz'}</strong></div>
              <div class="part-row"><span>Durum</span><strong style="color:var(--badge-ok);">${item.creditOk || 'Krediye Uygun'}</strong></div>
            </div>
          </div>`;
      } else {
        const parts = item.ekspertiz || { Kaput: 'Orijinal', Tavan: 'Orijinal', 'Ön Tampon': 'Orijinal', 'Yan Kapılar': 'Orijinal', Bagaj: 'Orijinal' };
        const rows = Object.keys(parts).map(k => {
          const v = parts[k];
          const color = v === 'Orijinal' ? 'var(--badge-ok)' : 'var(--badge-warn)';
          return `<div class="part-row"><span>${k}</span><strong style="color:${color};">${v}</strong></div>`;
        }).join('');
        rightPanelHtml = `
          <div class="ekspertiz-box">
            <strong>Kurumsal Kaporta &amp; Ekspertiz Raporu</strong>
            <div style="font-size:0.78rem;color:var(--ink-muted);margin-top:3px;">${item.damage} · ${item.fuelGear}</div>
            <div class="part-grid">${rows}</div>
          </div>`;
      }

      modalBody.innerHTML = `
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
          <div>
            <span class="card-code">#${item.id} · ${item.city} / ${item.district}</span>
            <h2 style="margin:4px 0 0;font-size:1.25rem;">${item.title}</h2>
          </div>
          <button type="button" class="btn btn-outline" id="closeModalBtn">Kapat ✕</button>
        </div>
        <div class="modal-grid">
          <div>
            <img src="${item.image}" alt="${item.title}" style="width:100%;aspect-ratio:16/10;object-fit:cover;border-radius:8px;">
            <p style="margin:12px 0 0;color:var(--ink-body);font-size:0.9rem;">${item.desc}</p>
          </div>
          <div style="display:flex;flex-direction:column;gap:14px;">
            <div style="font-size:1.65rem;font-weight:700;color:var(--brand);" class="num">${formatTL(item.price, item.dealType)}</div>
            ${rightPanelHtml}
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:auto;">
              <a class="btn btn-wa" target="_blank" rel="noopener" href="https://wa.me/${getSettings().phone}?text=${encodeURIComponent(item.id + ' nolu ilan için randevu / teklif görüşmek istiyorum.')}">WhatsApp'tan Yaz</a>
              <a class="btn btn-brand" href="tel:+${getSettings().phone}">Danışmanı Ara</a>
            </div>
          </div>
        </div>`;

      modal.hidden = false;
      const closeBtn = document.getElementById('closeModalBtn');
      if (closeBtn) closeBtn.onclick = () => { modal.hidden = true; };
    }

    if (modal) {
      modal.addEventListener('click', e => { if (e.target === modal) modal.hidden = true; });
    }

    renderGrid();
  }

  // YÖNETİM PANELİ SAYFASI (admin.html)
  const adminTableBody = document.getElementById('adminListingsBody');
  if (adminTableBody) {
    const sectorSel = document.getElementById('admSector');
    const emlakFields = document.getElementById('admEmlakFields');
    const otoFields = document.getElementById('admOtoFields');

    if (sectorSel) {
      sectorSel.addEventListener('change', () => {
        const isOto = sectorSel.value === 'oto';
        if (emlakFields) emlakFields.hidden = isOto;
        if (otoFields) otoFields.hidden = !isOto;
      });
    }

    function renderAdminTable() {
      const list = getListings();
      adminTableBody.innerHTML = list.map(item => `
        <tr>
          <td class="num"><code>${item.id}</code></td>
          <td><span class="pill ${item.sector === 'emlak' ? 'pill-sector-emlak' : 'pill-sector-oto'}">${item.sector === 'emlak' ? 'Emlak' : 'Vasıta'}</span></td>
          <td><strong>${item.title}</strong><div style="font-size:0.75rem;color:var(--ink-muted);">${item.city} · ${item.district}</div></td>
          <td class="num"><strong>${formatTL(item.price, item.dealType)}</strong></td>
          <td>
            <button type="button" class="btn btn-outline" style="height:28px;padding:0 10px;font-size:0.75rem;" data-del-id="${item.id}">Sil</button>
          </td>
        </tr>`).join('');

      adminTableBody.querySelectorAll('[data-del-id]').forEach(btn => {
        btn.addEventListener('click', () => {
          const next = getListings().filter(x => x.id !== btn.getAttribute('data-del-id'));
          saveListings(next);
          renderAdminTable();
        });
      });
    }

    const addForm = document.getElementById('adminAddForm');
    if (addForm) {
      addForm.addEventListener('submit', e => {
        e.preventDefault();
        const sec = document.getElementById('admSector').value;
        const item = {
          id: 'PRT-' + Math.floor(3000 + Math.random() * 6000),
          sector: sec,
          dealType: document.getElementById('admDeal').value,
          urgent: document.getElementById('admUrgent').checked,
          title: document.getElementById('admTitle').value.trim(),
          city: document.getElementById('admCity').value,
          district: document.getElementById('admDistrict').value.trim() || 'Merkez',
          price: Number(document.getElementById('admPrice').value || 1000000),
          image: sec === 'emlak'
            ? 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80'
            : 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80',
          rooms: document.getElementById('admRooms').value,
          sqm: Number(document.getElementById('admSqm').value || 125),
          buildingAge: 'Sıfır Bina',
          year: Number(document.getElementById('admYear').value || 2023),
          km: Number(document.getElementById('admKm').value || 25000),
          fuelGear: document.getElementById('admFuel').value,
          damage: document.getElementById('admDamage').value,
          desc: document.getElementById('admDesc').value.trim() || 'Yönetim panelinden eklenen güncel portföy ilanı.'
        };
        const list = getListings();
        list.unshift(item);
        saveListings(list);
        addForm.reset();
        renderAdminTable();
        const msg = document.getElementById('admSavedNotice');
        if (msg) {
          msg.hidden = false;
          setTimeout(() => { msg.hidden = true; }, 2500);
        }
      });
    }

    const brandForm = document.getElementById('adminBrandForm');
    if (brandForm) {
      const cfg = getSettings();
      document.getElementById('cfgSiteName').value = cfg.siteName;
      document.getElementById('cfgSiteSub').value = cfg.siteSub;
      document.getElementById('cfgPhone').value = cfg.phone;
      brandForm.addEventListener('submit', e => {
        e.preventDefault();
        saveSettings({
          siteName: document.getElementById('cfgSiteName').value.trim() || 'PortföyTR',
          siteSub: document.getElementById('cfgSiteSub').value.trim(),
          phone: document.getElementById('cfgPhone').value.replace(/\D+/g, '') || '905017037004'
        });
      });
    }

    renderAdminTable();
  }
})();
