// ============================================================
//  Рендер лендинга из SITE_DATA. Не трогайте, если не уверены.
// ============================================================

(function () {
  // Берём данные: из localStorage (если были правки через панель) либо из data.js
  function loadData() {
    try {
      const saved = localStorage.getItem("site_data_v1");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return window.SITE_DATA;
  }

  const DATA = loadData();

  // Применяем цвета темы
  function applyColors(d) {
    const c = d.colors;
    const root = document.documentElement.style;
    root.setProperty("--primary", c.primary);
    root.setProperty("--primary-dark", c.primaryDark);
    root.setProperty("--bg", c.bg);
    root.setProperty("--text", c.text);
    root.setProperty("--muted", c.muted);
  }

  // Escape спецсимволов, чтобы вставленный текст не сломал разметку
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
        return (
          '<div class="sin-card">' +
          '<div class="mannequin" data-sin="' + sinIndex + '" role="button" title="Сменить одежду">' +
          '<svg viewBox="0 0 120 240" fill="none" xmlns="http://www.w3.org/2000/svg">' +
          '<ellipse cx="60" cy="228" rx="30" ry="6" fill="rgba(0,0,0,0.5)"/>' +
          '<circle cx="60" cy="26" r="17" fill="#d6c9a8"/>' +
          '<rect x="55" y="40" width="10" height="14" fill="#d6c9a8"/>' +
          '<path class="man-top" d="M60 52 C34 52 24 88 22 120 L98 120 C96 88 86 52 60 52 Z" fill="#777" stroke="none"/>' +
          '<path class="man-sleeves" d="M22 120 C20 96 22 74 34 62 L22 120 Z M98 120 C100 96 98 74 86 62 L98 120 Z" fill="#666" stroke="none"/>' +
          '<path class="man-bottom" d="M22 120 L98 120 L104 196 L16 196 Z" fill="#888" stroke="none"/>' +
          '<circle cx="26" cy="128" r="6" fill="#d6c9a8"/>' +
          '<circle cx="94" cy="128" r="6" fill="#d6c9a8"/>' +
          '</svg>' +
          '<div class="mannequin-hint">Нажмите, чтобы изменить</div>' +
          '</div>' +
          '<div class="sin-name">' + esc(s.name) + "</div>" +
          '<div class="sin-desc">' + esc(s.desc) + "</div>" +
          "</div>"
        );
      })
      .join("");

    const faqItems = DATA.faq.items
      .map(function (f) {
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
      '<p>📞 <a href="' + esc(DATA.contact.phoneLink) + '">' + esc(DATA.contact.phone) + "</a></p>" +
      '<p>✉️ <a href="' + esc(DATA.contact.emailLink) + '">' + esc(DATA.contact.email) + "</a></p>" +
      "<p>📍 " + esc(DATA.contact.address) + "</p>" +
      '<p style="margin-top:24px"><a class="btn" href="' + esc(DATA.contact.emailLink) + '">' + esc(DATA.contact.buttonText) + "</a></p>" +
      "</div></div></section>" +

      '<footer class="site-footer">' + esc(DATA.footerText) + "</footer>";

    // FAQ: раскрытие по клику
    var qs = app.querySelectorAll(".faq-question");
    qs.forEach(function (q) {
      q.addEventListener("click", function () {
        q.parentElement.classList.toggle("open");
      });
    });

    // Манекены: клик открывает плашку с выбором деталей
    var mannequins = app.querySelectorAll(".mannequin");
    mannequins.forEach(function (m) {
      m.addEventListener("click", function () {
        openOutfitPanel(Number(m.dataset.sin), m);
      });
    });
  }

  // Открывает модальное окно редактирования деталей одежды манекена
  function openOutfitPanel(sinIndex, mannequinEl) {
    var sin = DATA.sins.items[sinIndex];
    var modal = document.getElementById("outfit-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "outfit-modal";
      modal.className = "outfit-modal";
      modal.innerHTML =
        '<div class="outfit-overlay"></div>' +
        '<div class="outfit-panel">' +
        '<button class="outfit-close" title="Закрыть">×</button>' +
        '<div class="outfit-content"></div>' +
        "</div>";
      document.body.appendChild(modal);
      modal.querySelector(".outfit-close").addEventListener("click", function () { modal.classList.remove("show"); });
      modal.querySelector(".outfit-overlay").addEventListener("click", function () { modal.classList.remove("show"); });
    }

    modal.querySelector(".outfit-content").innerHTML =
      '<h3 class="outfit-sin-title">' + esc(sin.name) + " — соберите свой наряд</h3>" +
      '<p class="outfit-sub">Выберите каждую деталь ниже</p>' +
      buildPartSwitcher("top", sin) +
      buildPartSwitcher("bottom", sin) +
      buildPartSwitcher("accent", sin);

    wirePartSwitchers(modal, sin, mannequinEl);

    modal.classList.add("show");
  }

  // Строит переключатель детали (ряд кнопок-кружков)
  function buildPartSwitcher(partKey, sin) {
    var part = sin.parts[partKey];
    var btns = part.options.map(function (op, oi) {
      return '<button class="part-opt" data-part="' + partKey + '" data-oi="' + oi + '" style="background:' + op.color + '" title="' + esc(op.name) + '"></button>';
    }).join("");
    return (
      '<div class="part-block">' +
      '<div class="part-label">' + esc(part.label) + "</div>" +
      '<div class="part-opts">' + btns + "</div>" +
      "</div>"
    );
  }

  // Навешивает клики на кнопки выбора деталей
  function wirePartSwitchers(modal, sin, mannequinEl) {
    var topEl = mannequinEl.querySelector(".man-top");
    var bottomEl = mannequinEl.querySelector(".man-bottom");
    var sleevesEl = mannequinEl.querySelector(".man-sleeves");
    var r = function (hex, k) {
      var n = parseInt(hex.slice(1), 16);
      var ch = function (v) { return Math.max(0, Math.min(255, Math.round(v))); };
      return "rgb(" + ch((n >> 16 & 255) * k) + "," + ch((n >> 8 & 255) * k) + "," + ch((n & 255) * k) + ")";
    };
    modal.querySelectorAll(".part-opt").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var partKey = btn.dataset.part;
        var oi = Number(btn.dataset.oi);
        var color = sin.parts[partKey].options[oi].color;
        modal.querySelectorAll('.part-opt[data-part="' + partKey + '"]').forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        if (partKey === "top") topEl.style.fill = color;
        else if (partKey === "bottom") bottomEl.style.fill = color;
        else if (partKey === "accent") sleevesEl.style.fill = r(color, 0.85);
      });
    });
  }

  // Сохраняем данные в localStorage, чтобы админ мог обновлять страницу
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