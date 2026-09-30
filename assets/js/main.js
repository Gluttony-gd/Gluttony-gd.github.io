// ============================================================
//  Р РµРЅРґРµСЂ Р»РµРЅРґРёРЅРіР° РёР· SITE_DATA. РќРµ С‚СЂРѕРіР°Р№С‚Рµ, РµСЃР»Рё РЅРµ СѓРІРµСЂРµРЅС‹.
// ============================================================

(function () {
  // Р‘РµСЂС‘Рј РґР°РЅРЅС‹Рµ: РёР· localStorage (РµСЃР»Рё Р±С‹Р»Рё РїСЂР°РІРєРё С‡РµСЂРµР· РїР°РЅРµР»СЊ) Р»РёР±Рѕ РёР· data.js
  function loadData() {
    try {
      const saved = localStorage.getItem("site_data_v1");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return window.SITE_DATA;
  }

  const DATA = loadData();

  // РџСЂРёРјРµРЅСЏРµРј С†РІРµС‚Р° С‚РµРјС‹
  function applyColors(d) {
    const c = d.colors;
    const root = document.documentElement.style;
    root.setProperty("--primary", c.primary);
    root.setProperty("--primary-dark", c.primaryDark);
    root.setProperty("--bg", c.bg);
    root.setProperty("--text", c.text);
    root.setProperty("--muted", c.muted);
  }

  // Escape СЃРїРµС†СЃРёРјРІРѕР»РѕРІ, С‡С‚РѕР±С‹ РІСЃС‚Р°РІР»РµРЅРЅС‹Р№ С‚РµРєСЃС‚ РЅРµ СЃР»РѕРјР°Р» СЂР°Р·РјРµС‚РєСѓ
  function esc(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  function render() {
    applyColors(DATA);

    document.title = DATA.brand.name;
    const app = document.getElementById("app");

    const heroBtns = DATA.hero.buttonLink
      ? '<a class="btn" href="' + esc(DATA.hero.buttonLink) + '">' + esc(DATA.hero.buttonText) + "</a>"
      : "";

    const sinsCards = DATA.sins.items
      .map(function (s, sinIndex) {
        // SVG-РјР°РЅРµРєРµРЅ: РґРµС‚Р°Р»РёР·РёСЂРѕРІР°РЅРЅР°СЏ С„РёРіСѓСЂР°, РѕРґРµР¶РґР° РїРµСЂРµРєР»СЋС‡Р°РµС‚СЃСЏ
        const dots = s.outfits
          .map(function (o, oi) {
            return '<button class="outfit-dot' + (oi === 0 ? " active" : "") +
              '" style="background:' + o.top + '" data-sin="' + sinIndex + '" data-outfit="' + oi + '" title="' + esc(o.label) + '"></button>';
          })
          .join("");
        return (
          '<div class="sin-card">' +
          '<div class="mannequin">' +
          '<svg viewBox="0 0 120 240" fill="none" xmlns="http://www.w3.org/2000/svg">' +
          // С‚РµРЅСЊ-РїРѕРґСЃС‚Р°РІРєР°
          '<ellipse cx="60" cy="228" rx="30" ry="6" fill="rgba(0,0,0,0.5)"/>' +
          // РіРѕР»РѕРІР°
          '<circle cx="60" cy="26" r="17" fill="#d6c9a8"/>' +
          // С€РµСЏ
          '<rect x="55" y="40" width="10" height="14" fill="#d6c9a8"/>' +
          // РІРµСЂС…РЅСЏСЏ С‡Р°СЃС‚СЊ (РѕРґРµР¶РґР° РІРµСЂС… + СЂСѓРєРё)
          '<path class="man-top" d="M60 52 C34 52 24 88 22 120 L98 120 C96 88 86 52 60 52 Z" fill="#888" stroke="none"/>' +
          '<path class="man-sleeves" d="M22 120 C20 96 22 74 34 62 L22 120 Z M98 120 C100 96 98 74 86 62 L98 120 Z" fill="#777" stroke="none"/>' +
          // С‚РµР»Рѕ-РѕСЃРЅРѕРІР° (РѕРґРµР¶РґР° РЅРёР·)
          '<path class="man-body" d="M22 120 L98 120 L104 196 L16 196 Z" fill="#999" stroke="none"/>' +
          // СЂСѓРєРё-РєРёСЃС‚Рё
          '<circle cx="26" cy="128" r="6" fill="#d6c9a8"/>' +
          '<circle cx="94" cy="128" r="6" fill="#d6c9a8"/>' +
          '</svg>' +
          '</div>' +
          '<div class="sin-name">' + esc(s.name) + "</div>" +
          '<div class="sin-desc">' + esc(s.desc) + "</div>" +
          '<div class="outfit-label">' + esc(s.outfits[0].label) + "</div>" +
          '<div class="outfit-dots">' + dots + "</div>" +
          "</div>"
        );
      })
      .join("");

    const faqItems = DATA.faq.items
      .map(function (f, i) {
        return (
          '<div class="faq-item">' +
          '<button class="faq-question">' + esc(f.q) + "</button>" +
          '<div class="faq-answer">' + esc(f.a) + "</div>" +
          "</div>"
        );
      })
      .join("");

    app.innerHTML =
      '<header class="site-header"><div class="container header-inner">' +
      '<a class="logo" href="#">' + esc(DATA.brand.name) + "</a>" +
      "</div></header>" +

      '<section class="hero"><div class="container">' +
      "<h1>" + esc(DATA.hero.title) + "</h1>" +
      "<p>" + esc(DATA.hero.subtitle) + "</p>" +
      heroBtns +
      "</div></section>" +

      '<section class="section" id="about"><div class="container">' +
      '<h2 class="section-title">' + esc(DATA.about.title) + "</h2>" +
      '<p class="about-text">' + esc(DATA.about.text) + "</p>" +
      "</div></section>" +

      '<section class="section" id="sins"><div class="container">' +
      '<h2 class="section-title">' + esc(DATA.sins.title) + "</h2>" +
      '<p class="section-sub">' + esc(DATA.sins.subtitle) + "</p>" +
      '<div class="sins-grid">' + sinsCards + "</div>" +
      "</div></section>" +

      '<section class="section" id="faq"><div class="container">' +
      '<h2 class="section-title">' + esc(DATA.faq.title) + "</h2>" +
      '<div style="margin-top:28px">' + faqItems + "</div>" +
      "</div></section>" +

      '<section class="section" id="contact"><div class="container">' +
      '<h2 class="section-title">' + esc(DATA.contact.title) + "</h2>" +
      '<div class="contact-block" style="margin-top:20px">' +
      '<p>рџ“ћ <a href="' + esc(DATA.contact.phoneLink) + '">' + esc(DATA.contact.phone) + "</a></p>" +
      '<p>вњ‰пёЏ <a href="' + esc(DATA.contact.emailLink) + '">' + esc(DATA.contact.email) + "</a></p>" +
      "<p>рџ“Ќ " + esc(DATA.contact.address) + "</p>" +
      '<p style="margin-top:24px"><a class="btn" href="' + esc(DATA.contact.emailLink) + '">' + esc(DATA.contact.buttonText) + "</a></p>" +
      "</div></div></section>" +

      '<footer class="site-footer">' + esc(DATA.footerText) + "</footer>";

    // FAQ: СЂР°СЃРєСЂС‹С‚РёРµ РїРѕ РєР»РёРєСѓ
    var qs = app.querySelectorAll(".faq-question");
    qs.forEach(function (q) {
      q.addEventListener("click", function () {
        q.parentElement.classList.toggle("open");
      });
    });

    // РњР°РЅРµРєРµРЅС‹: РїРµСЂРµРєР»СЋС‡РµРЅРёРµ РЅР°СЂСЏРґР° РїРѕ РєР»РёРєСѓ РЅР° С‚РѕС‡РєСѓ
    var sinEls = app.querySelectorAll(".sin-card");
    sinEls.forEach(function (card, sinIndex) {
      var dots = card.querySelectorAll(".outfit-dot");
      var top = card.querySelector(".man-top");
      var body = card.querySelector(".man-body");
      var sleeves = card.querySelector(".man-sleeves");
      var label = card.querySelector(".outfit-label");
      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          var oi = Number(dot.dataset.outfit);
          var outfit = DATA.sins.items[sinIndex].outfits[oi];
          var r = function (hex, k) {
            var n = parseInt(hex.slice(1), 16);
            var ch = function (v) { return Math.max(0, Math.min(255, Math.round(v))); };
            return "rgb(" + ch((n >> 16 & 255) * k) + "," + ch((n >> 8 & 255) * k) + "," + ch((n & 255) * k) + ")";
          };
          top.style.fill = outfit.top;
          body.style.fill = outfit.body;
          sleeves.style.fill = r(outfit.top, 0.9);
          label.textContent = outfit.label;
          dots.forEach(function (d) { d.classList.remove("active"); });
          dot.classList.add("active");
        });
      });
    });
  }

  // РЎРѕС…СЂР°РЅСЏРµРј РґР°РЅРЅС‹Рµ РІ localStorage, С‡С‚РѕР±С‹ Р°РґРјРёРЅ РјРѕРі РѕР±РЅРѕРІР»СЏС‚СЊ СЃС‚СЂР°РЅРёС†Сѓ
  window.__SITE_SAVE = function (data) {
    try {
      localStorage.setItem("site_data_v1", JSON.stringify(data));
    } catch (e) {}
  };
  window.__SITE_RESET = function () {
    try {
      localStorage.removeItem("site_data_v1");
    } catch (e) {}
  };
  window.__SITE_DATA_GET = function () {
    return DATA;
  };

  render();
})();