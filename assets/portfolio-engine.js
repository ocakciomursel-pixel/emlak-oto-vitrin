/* ==========================================================================
   PORTFÖYTR — ORTAK VERİ, EKSPERTİZ SVG, KREDİ HESABI & TEMA GEÇİŞ MOTORU
   Tüm 3 Tema + Vitrin Hub + Detaylı Admin Paneli tek gerçek veri kaynağını paylaşır.
   ========================================================================== */
(function (global) {
  'use strict';

  const LISTINGS_KEY = 'portfoytr_pro_listings_v3';
  const CONFIG_KEY = 'portfoytr_pro_config_v2';
  const LEADS_KEY = 'portfoytr_pro_leads_v2';

  function makeFallbackSvg(title, color) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600"><rect width="900" height="600" fill="${color}"/><text x="450" y="305" font-family="system-ui,sans-serif" font-size="28" font-weight="600" fill="#ffffff" text-anchor="middle">${title}</text></svg>`;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }

  const DEFAULT_CONFIG = {
    siteName: 'PortföyTR',
    siteSlogan: 'Gayrimenkul & Vasıta İlan Platformu',
    phone: '905017037004',
    phoneDisplay: '0501 703 70 04',
    cityHQ: 'İstanbul · Ataşehir & Bağdat Caddesi',
    announcement: 'Tüm gayrimenkul ve otomobil portföyümüz yerinde ekspertiz, şeffaf tramer ve doğrudan tapu güvencesiyle yayınlanmaktadır.',
    defaultTheme: 'tema-1',
    interestRateEstate: 2.79,
    interestRateAuto: 3.49,
    consultants: [
      { id: 'c1', name: 'Emre Karahan', role: 'Lüks Konut & Ticari Portföy Direktörü', phone: '905017037004' },
      { id: 'c2', name: 'Burak Demirsoy', role: 'Ekspertiz & Otomotiv Galeri Yöneticisi', phone: '905017037004' },
      { id: 'c3', name: 'Selin Arslan', role: 'Arsa, Villa & Yatırım Danışmanı', phone: '905017037004' }
    ]
  };

  const DEFAULT_LISTINGS = [
    {
      id: 'PRT-1041',
      sector: 'emlak',
      subCategory: 'Daire',
      dealType: 'Satılık',
      featured: true,
      urgent: true,
      swapOk: true,
      title: 'Kadıköy Suadiye Bağdat Caddesi Yakını Teras Balkonlu Sıfır 3+1',
      city: 'İstanbul',
      district: 'Kadıköy / Suadiye',
      mapX: 29,
      mapY: 26,
      price: 14750000,
      date: '1 Kasım 2026',
      consultant: 'Emre Karahan',
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=80'
      ],
      rooms: '3+1',
      sqmGross: 165,
      sqmNet: 138,
      floor: '5. Kat / 9',
      buildingAge: 'Sıfır Bina (2026)',
      heating: 'Yerden Isıtma',
      deed: 'Kat Mülkiyetli · Krediye Uygun',
      dues: 3200,
      desc: 'Bağdat Caddesi ve sahil yürüyüş hattına 4 dakika yürüme mesafesinde, 2 araçlık kapalı otoparklı, akıllı ev otomasyonlu, ebeveyn banyolu sıfır rezidans dairesi. Değerinde araç takası değerlendirilir.'
    },
    {
      id: 'PRT-2084',
      sector: 'oto',
      subCategory: 'Sedan',
      dealType: 'Satılık',
      featured: true,
      urgent: true,
      swapOk: true,
      title: '2023 BMW 320i First Edition M Sport — Hatasız Boyasız 0 Tramer',
      city: 'İstanbul',
      district: 'Ataşehir / Finans Merkezi',
      mapX: 34,
      mapY: 28,
      price: 3150000,
      date: '1 Kasım 2026',
      consultant: 'Burak Demirsoy',
      images: [
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=1000&q=80'
      ],
      brand: 'BMW',
      series: '320i M Sport',
      year: 2023,
      km: 24500,
      fuel: 'Benzin',
      gear: 'Otomatik',
      hp: '170 HP',
      tramer: '0 ₺ (Tramersiz)',
      damageSummary: 'Hatasız · Boyasız',
      ekspertiz: {
        kaput: 'orijinal',
        tavan: 'orijinal',
        bagaj: 'orijinal',
        solOnCamurluk: 'orijinal',
        sagOnCamurluk: 'orijinal',
        solOnKapi: 'orijinal',
        sagOnKapi: 'orijinal',
        solArkaKapi: 'orijinal',
        sagArkaKapi: 'orijinal',
        solArkaCamurluk: 'orijinal',
        sagArkaCamurluk: 'orijinal'
      },
      desc: 'Borusan çıkışlı ve yetkili servis bakımlı. Harman Kardon ses sistemi, kavisli Live Cockpit ekran, açılır cam tavan, lazer farlar ve 19 inç M jant. Ekspertiz garantilidir.'
    },
    {
      id: 'PRT-1042',
      sector: 'emlak',
      subCategory: 'Villa',
      dealType: 'Satılık',
      featured: true,
      urgent: false,
      swapOk: true,
      title: 'Çankaya İncek Müstakil Isıtmalı Havuzlu 5+1 Modern Mimari Villa',
      city: 'Ankara',
      district: 'Çankaya / İncek Bulvarı',
      mapX: 52,
      mapY: 42,
      price: 21900000,
      date: '31 Ekim 2026',
      consultant: 'Selin Arslan',
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80'
      ],
      rooms: '5+1',
      sqmGross: 340,
      sqmNet: 285,
      floor: 'Müstakil Triplex',
      buildingAge: '1 Yaşında',
      heating: 'Isı Pompası + Yerden Isıtma',
      deed: 'Müstakil Tapu · Krediye Uygun',
      dues: 4500,
      desc: '600 m² müstakil peyzajlı arsa içerisinde 4 mevsim ısıtmalı yüzme havuzu, şömineli galeri boşluklu salon, kış bahçesi ve 2 araçlık kapalı garaj.'
    },
    {
      id: 'PRT-2085',
      sector: 'oto',
      subCategory: 'SUV',
      dealType: 'Satılık',
      featured: false,
      urgent: false,
      swapOk: true,
      title: '2023 Volkswagen Tiguan 1.5 TSI Elegance DSG — Panoramik Tavan',
      city: 'Ankara',
      district: 'Çankaya / Söğütözü',
      mapX: 50,
      mapY: 45,
      price: 2215000,
      date: '31 Ekim 2026',
      consultant: 'Burak Demirsoy',
      images: [
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80'
      ],
      brand: 'Volkswagen',
      series: 'Tiguan 1.5 TSI Elegance',
      year: 2023,
      km: 19800,
      fuel: 'Benzin',
      gear: 'Otomatik',
      hp: '150 HP',
      tramer: '0 ₺ (Tramersiz)',
      damageSummary: '1 Parça Lokal Boya',
      ekspertiz: {
        kaput: 'orijinal',
        tavan: 'orijinal',
        bagaj: 'orijinal',
        solOnCamurluk: 'orijinal',
        sagOnCamurluk: 'orijinal',
        solOnKapi: 'orijinal',
        sagOnKapi: 'orijinal',
        solArkaKapi: 'orijinal',
        sagArkaKapi: 'orijinal',
        solArkaCamurluk: 'lokal',
        sagArkaCamurluk: 'orijinal'
      },
      desc: 'İlk sahibinden, IQ.Light Matrix LED farlar, elektrikli hafızalı bagaj, koltuk ve direksiyon ısıtma. Sadece sol arka çamurluk ağzında çizik kaynaklı 15 cm lokal boya mevcuttur.'
    },
    {
      id: 'PRT-1043',
      sector: 'emlak',
      subCategory: 'Rezidans',
      dealType: 'Kiralık',
      featured: false,
      urgent: false,
      swapOk: false,
      title: 'Karşıyaka Mavişehir Sahil Önü Deniz Manzaralı 2+1 Akıllı Rezidans',
      city: 'İzmir',
      district: 'Karşıyaka / Mavişehir',
      mapX: 21,
      mapY: 56,
      price: 46000,
      date: '30 Ekim 2026',
      consultant: 'Emre Karahan',
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1000&q=80'
      ],
      rooms: '2+1',
      sqmGross: 122,
      sqmNet: 104,
      floor: '14. Kat / 22',
      buildingAge: '3 Yaşında',
      heating: 'VRV İklimlendirme',
      deed: 'Kurumsal Kiracıya Uygun',
      dues: 3800,
      desc: 'Siemens ankastre setli, kesintisiz körfez manzaralı, açık/kapalı yüzme havuzu, fitness ve 7/24 resepsiyon hizmetli elit rezidans.'
    },
    {
      id: 'PRT-2086',
      sector: 'oto',
      subCategory: 'Sedan',
      dealType: 'Satılık',
      featured: true,
      urgent: true,
      swapOk: true,
      title: '2022 Mercedes-Benz C200 4Matic AMG — Gece Paketi & Burmester',
      city: 'Bursa',
      district: 'Nilüfer / Özlüce',
      mapX: 31,
      mapY: 37,
      price: 3090000,
      date: '30 Ekim 2026',
      consultant: 'Burak Demirsoy',
      images: [
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1000&q=80'
      ],
      brand: 'Mercedes-Benz',
      series: 'C200 4Matic AMG',
      year: 2022,
      km: 41000,
      fuel: 'Hibrit / Benzin',
      gear: 'Otomatik',
      hp: '204 HP',
      tramer: '0 ₺ (Tramersiz)',
      damageSummary: 'Hatasız · Boyasız',
      ekspertiz: {
        kaput: 'orijinal',
        tavan: 'orijinal',
        bagaj: 'orijinal',
        solOnCamurluk: 'orijinal',
        sagOnCamurluk: 'orijinal',
        solOnKapi: 'orijinal',
        sagOnKapi: 'orijinal',
        solArkaKapi: 'orijinal',
        sagArkaKapi: 'orijinal',
        solArkaCamurluk: 'orijinal',
        sagArkaCamurluk: 'orijinal'
      },
      desc: '4 çeker 4Matic, Burmester 3D ses sistemi, Digital Light, soğutmalı ve hafızalı koltuklar. Tüm bakımları Mengerler kayıtlıdır.'
    },
    {
      id: 'PRT-1044',
      sector: 'emlak',
      subCategory: 'Bahçe Dubleksi',
      dealType: 'Satılık',
      featured: false,
      urgent: false,
      swapOk: true,
      title: 'Nilüfer Bademli Korupark Yakını Müstakil Bahçeli 4+1 Dubleks',
      city: 'Bursa',
      district: 'Nilüfer / Bademli',
      mapX: 33,
      mapY: 39,
      price: 9450000,
      date: '29 Ekim 2026',
      consultant: 'Selin Arslan',
      images: [
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'
      ],
      rooms: '4+1',
      sqmGross: 210,
      sqmNet: 178,
      floor: 'Bahçe Dubleksi',
      buildingAge: '2 Yaşında',
      heating: 'Yerden Isıtma',
      deed: 'Kat Mülkiyetli · Araç Takaslı',
      dues: 2600,
      desc: '140 m² müstakil tapulu bahçe kullanım alanlı, güvenlikli butik sitede, geniş kış bahçeli aile konutu.'
    },
    {
      id: 'PRT-2087',
      sector: 'oto',
      subCategory: 'Elektrikli SUV',
      dealType: 'Satılık',
      featured: false,
      urgent: false,
      swapOk: false,
      title: '2024 Togg T10X V2 Uzun Menzil — Cam Tavan & Meridian Ses',
      city: 'Antalya',
      district: 'Muratpaşa / Lara',
      mapX: 43,
      mapY: 74,
      price: 1795000,
      date: '29 Ekim 2026',
      consultant: 'Burak Demirsoy',
      images: [
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1000&q=80'
      ],
      brand: 'Togg',
      series: 'T10X V2 Uzun Menzil',
      year: 2024,
      km: 11200,
      fuel: 'Elektrik',
      gear: 'Otomatik',
      hp: '218 HP',
      tramer: '0 ₺ (Tramersiz)',
      damageSummary: 'Hatasız · Boyasız',
      ekspertiz: {
        kaput: 'orijinal',
        tavan: 'orijinal',
        bagaj: 'orijinal',
        solOnCamurluk: 'orijinal',
        sagOnCamurluk: 'orijinal',
        solOnKapi: 'orijinal',
        sagOnKapi: 'orijinal',
        solArkaKapi: 'orijinal',
        sagArkaKapi: 'orijinal',
        solArkaCamurluk: 'orijinal',
        sagArkaCamurluk: 'orijinal'
      },
      desc: '523 km WLTP menzil, Meridian ses paketi, kış paketi ve panoramik cam tavan. Sıfır kokusu üzerinde.'
    },
    {
      id: 'PRT-1045',
      sector: 'emlak',
      subCategory: 'Ticari & Ofis',
      dealType: 'Kiralık',
      featured: false,
      urgent: true,
      swapOk: false,
      title: 'Konyaaltı Sahil Bulvarı Kurumsal Tabela Değerli Köşe Mağaza & Showroom',
      city: 'Antalya',
      district: 'Konyaaltı / Gürsu',
      mapX: 40,
      mapY: 76,
      price: 135000,
      date: '28 Ekim 2026',
      consultant: 'Selin Arslan',
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1000&q=80'
      ],
      rooms: 'Açık Plan + 2 Ofis',
      sqmGross: 320,
      sqmNet: 290,
      floor: 'Düz Giriş + Asma Kat',
      buildingAge: '4 Yaşında',
      heating: 'Merkezi VRF Klima',
      deed: 'İskanlı Ticari Tapu',
      dues: 2500,
      desc: '18 metre ön cepheli, önünde 6 araçlık müşteri park alanı bulunan kurumsal galeri, klinik veya mağaza kullanımına hazır ticari mülk.'
    }
  ];

  const DEFAULT_LEADS = [
    { id: 'TLP-901', date: 'Bugün 11:42', name: 'Murat Soylu', phone: '0532 410 ** 84', listingId: 'PRT-1041', type: 'Araç Takas + Nakit Teklifi', note: '2022 C200 aracım + nakit ile Suadiye 3+1 daire için randevu talebi.', status: 'Bekliyor' },
    { id: 'TLP-902', date: 'Bugün 10:15', name: 'Gökhan Yıldırım', phone: '0544 822 ** 19', listingId: 'PRT-2084', type: 'Ekspertiz & Test Sürüşü', note: 'Cumartesi 14:00 için Ataşehir şubesinde aracı görmek istiyorum.', status: 'Onaylandı' },
    { id: 'TLP-903', date: 'Dün 17:30', name: 'Elif Şahin', phone: '0505 619 ** 40', listingId: 'PRT-1043', type: 'Kiralama Başvurusu', note: 'Mavişehir 2+1 daire için yıllık peşin ödeme teklifi.', status: 'Görüşülüyor' }
  ];

  function getConfig() {
    try {
      const saved = JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}');
      return Object.assign({}, DEFAULT_CONFIG, saved);
    } catch {
      return Object.assign({}, DEFAULT_CONFIG);
    }
  }

  function saveConfig(patch) {
    const next = Object.assign(getConfig(), patch);
    try { localStorage.setItem(CONFIG_KEY, JSON.stringify(next)); } catch {}
    return next;
  }

  function getListings() {
    try {
      const raw = JSON.parse(localStorage.getItem(LISTINGS_KEY) || 'null');
      if (Array.isArray(raw) && raw.length) return raw;
    } catch {}
    return JSON.parse(JSON.stringify(DEFAULT_LISTINGS));
  }

  function saveListings(list) {
    try { localStorage.setItem(LISTINGS_KEY, JSON.stringify(list)); } catch {}
  }

  function getLeads() {
    try {
      const raw = JSON.parse(localStorage.getItem(LEADS_KEY) || 'null');
      if (Array.isArray(raw) && raw.length) return raw;
    } catch {}
    return JSON.parse(JSON.stringify(DEFAULT_LEADS));
  }

  function saveLeads(list) {
    try { localStorage.setItem(LEADS_KEY, JSON.stringify(list)); } catch {}
  }

  function resetAllDemoData() {
    try {
      localStorage.removeItem(LISTINGS_KEY);
      localStorage.removeItem(CONFIG_KEY);
      localStorage.removeItem(LEADS_KEY);
    } catch {}
  }

  function formatPrice(amount, dealType) {
    const s = Number(amount || 0).toLocaleString('tr-TR') + ' ₺';
    return dealType === 'Kiralık' ? s + ' / Ay' : s;
  }

  function formatShortPin(amount) {
    const n = Number(amount || 0);
    if (n >= 1000000) return (n / 1000000).toFixed(2).replace('.', ',') + ' Mn ₺';
    return Math.round(n / 1000) + ' Bin ₺';
  }

  function calcMonthlyInstallment(principal, monthlyRatePct, months) {
    const P = Number(principal || 0);
    const r = Number(monthlyRatePct || 2.8) / 100;
    const n = Number(months || 60);
    if (P <= 0 || r <= 0 || n <= 0) return 0;
    const factor = Math.pow(1 + r, n);
    return Math.round((P * r * factor) / (factor - 1));
  }

  // İnteraktif Üstten Görünüm Kaporta Ekspertiz SVG Şeması (Hem Tema Detaylarında Hem Admin Panelinde Çalışır!)
  const PART_LABELS = {
    kaput: 'Motor Kaputu',
    tavan: 'Tavan',
    bagaj: 'Bagaj Kapağı',
    solOnCamurluk: 'Sol Ön Çamurluk',
    sagOnCamurluk: 'Sağ Ön Çamurluk',
    solOnKapi: 'Sol Ön Kapı',
    sagOnKapi: 'Sağ Ön Kapı',
    solArkaKapi: 'Sol Arka Kapı',
    sagArkaKapi: 'Sağ Arka Kapı',
    solArkaCamurluk: 'Sol Arka Çamurluk',
    sagArkaCamurluk: 'Sağ Arka Çamurluk'
  };

  const STATUS_COLORS = {
    orijinal: { fill: '#16A34A', bg: '#DCFCE7', text: 'Orijinal' },
    lokal: { fill: '#D97706', bg: '#FEF3C7', text: 'Lokal Boya' },
    boyali: { fill: '#2563EB', bg: '#DBEAFE', text: 'Boyalı' },
    degisen: { fill: '#DC2626', bg: '#FEE2E2', text: 'Değişen' }
  };

  function renderEkspertizSvg(ekspertizObj, interactive) {
    const ek = Object.assign({
      kaput: 'orijinal', tavan: 'orijinal', bagaj: 'orijinal',
      solOnCamurluk: 'orijinal', sagOnCamurluk: 'orijinal',
      solOnKapi: 'orijinal', sagOnKapi: 'orijinal',
      solArkaKapi: 'orijinal', sagArkaKapi: 'orijinal',
      solArkaCamurluk: 'orijinal', sagArkaCamurluk: 'orijinal'
    }, ekspertizObj || {});

    const c = (k) => (STATUS_COLORS[ek[k]] || STATUS_COLORS.orijinal).fill;
    const cur = interactive ? 'cursor:pointer;' : '';

    return `
      <div class="eksp-diagram-wrap" style="display:grid;grid-template-columns:150px minmax(0,1fr);gap:14px;align-items:center;">
        <svg viewBox="0 0 180 320" width="145" height="258" aria-label="Araç kaporta ekspertiz şeması" style="display:block;margin:0 auto;">
          <!-- Gövde dış hat -->
          <rect x="30" y="14" width="120" height="292" rx="34" fill="#1e293b" opacity="0.10" stroke="currentColor" stroke-opacity="0.25" stroke-width="2"/>
          <!-- Kaput -->
          <path data-car-part="kaput" style="${cur}" d="M48 24 Q90 14 132 24 L128 92 L52 92 Z" fill="${c('kaput')}" fill-opacity="0.86" stroke="#ffffff" stroke-width="2"/>
          <!-- Ön Cam -->
          <polygon points="52,95 128,95 122,122 58,122" fill="#0f172a" fill-opacity="0.45"/>
          <!-- Tavan -->
          <rect data-car-part="tavan" style="${cur}" x="58" y="125" width="64" height="86" rx="6" fill="${c('tavan')}" fill-opacity="0.86" stroke="#ffffff" stroke-width="2"/>
          <!-- Arka Cam -->
          <polygon points="58,214 122,214 127,238 53,238" fill="#0f172a" fill-opacity="0.45"/>
          <!-- Bagaj -->
          <path data-car-part="bagaj" style="${cur}" d="M52 241 L128 241 L130 292 Q90 302 50 292 Z" fill="${c('bagaj')}" fill-opacity="0.86" stroke="#ffffff" stroke-width="2"/>
          <!-- Sol Şerit (Çamurluk + Kapılar) -->
          <rect data-car-part="solOnCamurluk" style="${cur}" x="32" y="36" width="16" height="62" rx="5" fill="${c('solOnCamurluk')}" stroke="#ffffff" stroke-width="1.5"/>
          <rect data-car-part="solOnKapi" style="${cur}" x="32" y="102" width="22" height="56" rx="4" fill="${c('solOnKapi')}" stroke="#ffffff" stroke-width="1.5"/>
          <rect data-car-part="solArkaKapi" style="${cur}" x="32" y="162" width="22" height="56" rx="4" fill="${c('solArkaKapi')}" stroke="#ffffff" stroke-width="1.5"/>
          <rect data-car-part="solArkaCamurluk" style="${cur}" x="32" y="222" width="16" height="62" rx="5" fill="${c('solArkaCamurluk')}" stroke="#ffffff" stroke-width="1.5"/>
          <!-- Sağ Şerit -->
          <rect data-car-part="sagOnCamurluk" style="${cur}" x="132" y="36" width="16" height="62" rx="5" fill="${c('sagOnCamurluk')}" stroke="#ffffff" stroke-width="1.5"/>
          <rect data-car-part="sagOnKapi" style="${cur}" x="126" y="102" width="22" height="56" rx="4" fill="${c('sagOnKapi')}" stroke="#ffffff" stroke-width="1.5"/>
          <rect data-car-part="sagArkaKapi" style="${cur}" x="126" y="162" width="22" height="56" rx="4" fill="${c('sagArkaKapi')}" stroke="#ffffff" stroke-width="1.5"/>
          <rect data-car-part="sagArkaCamurluk" style="${cur}" x="132" y="222" width="16" height="62" rx="5" fill="${c('sagArkaCamurluk')}" stroke="#ffffff" stroke-width="1.5"/>
        </svg>
        <div style="display:grid;grid-template-columns:1fr;gap:5px;font-size:12.5px;">
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:6px;font-size:11.5px;font-weight:600;">
            <span style="color:#16A34A;">● Orijinal</span>
            <span style="color:#D97706;">● Lokal Boya</span>
            <span style="color:#2563EB;">● Boyalı</span>
            <span style="color:#DC2626;">● Değişen</span>
          </div>
          ${Object.keys(PART_LABELS).map(k => {
            const st = STATUS_COLORS[ek[k]] || STATUS_COLORS.orijinal;
            return `<div ${interactive ? `data-car-part="${k}" style="cursor:pointer;display:flex;justify-content:space-between;padding:4px 8px;border-radius:5px;background:rgba(148,163,184,0.12);"` : 'style="display:flex;justify-content:space-between;padding:3px 6px;border-bottom:1px solid rgba(148,163,184,0.16);"'}>
              <span>${PART_LABELS[k]}</span>
              <strong style="color:${st.fill};">${st.text}</strong>
            </div>`;
          }).join('')}
        </div>
      </div>`;
  }

  // Her Temanın Altında Yüzen Hızlı Tema & Admin Geçiş Çubuğu
  function mountThemeSwitcher(activeId, prefixPath) {
    const base = prefixPath || '../';
    const bar = document.createElement('nav');
    bar.setAttribute('aria-label', 'Canlı tema geçiş çubuğu');
    bar.style.cssText = 'position:fixed;bottom:14px;right:14px;left:auto;z-index:999;display:flex;align-items:center;gap:6px;padding:6px 8px;border-radius:999px;background:rgba(15,23,42,0.92);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,0.16);box-shadow:0 12px 32px rgba(0,0,0,0.32);font-family:system-ui,-apple-system,sans-serif;font-size:12px;color:#fff;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;max-width:calc(100vw - 28px);';

    const items = [
      { id: 'hub', label: '4 Tema Sunum', href: base + 'index.html' },
      { id: 't1', label: 'Tema 1 · Haritalı Pazar', href: base + 'tema-1-vitrin/index.html' },
      { id: 't2', label: 'Tema 2 · Lüks Galeri', href: base + 'tema-2-prestij/index.html' },
      { id: 't3', label: 'Tema 3 · Pro Portal', href: base + 'tema-3-kurumsal/index.html' },
      { id: 't4', label: 'Tema 4 · Bento Glass', href: base + 'tema-4-bento/index.html' },
      { id: 'adm', label: 'Yönetim Paneli', href: base + 'admin.html' }
    ];

    bar.innerHTML = items.map(it => {
      const isAct = it.id === activeId;
      const bg = isAct ? '#ffffff' : 'transparent';
      const fg = isAct ? '#0f172a' : '#e2e8f0';
      return `<a href="${it.href}" style="padding:6px 11px;border-radius:999px;background:${bg};color:${fg};font-weight:${isAct ? '700' : '500'};text-decoration:none;white-space:nowrap;">${it.label}</a>`;
    }).join('');

    document.body.appendChild(bar);
  }

  global.PortfoyEngine = {
    getConfig,
    saveConfig,
    getListings,
    saveListings,
    getLeads,
    saveLeads,
    resetAllDemoData,
    formatPrice,
    formatShortPin,
    calcMonthlyInstallment,
    makeFallbackSvg,
    renderEkspertizSvg,
    mountThemeSwitcher,
    PART_LABELS,
    STATUS_COLORS
  };
})(window);
