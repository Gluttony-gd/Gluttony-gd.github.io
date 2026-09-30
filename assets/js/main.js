// ============================================================
//  Рендер лендинга из SITE_DATA. Не трогайте, если не уверены.
// ============================================================

(function () {
  // Берём данные: из localStorage (если были правки через панель) либо из data.js
  function loadData() {
    try {
      const saved = localStorage.getItem("site_data_v2");
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
          '<svg viewBox="0 0 140 260" fill="none" xmlns="http://www.w3.org/2000/svg">' +
          // тень-подставка
          '<ellipse cx="70" cy="250" rx="34" ry="5" fill="rgba(0,0,0,0.4)"/>' +
          // ноги (низ)
          '<rect class="man-legs" x="52" y="150" width="16" height="90" rx="7" fill="#777"/>' +
          '<rect class="man-legs" x="72" y="150" width="16" height="90" rx="7" fill="#777"/>' +
          // голова
          '<circle cx="70" cy="34" r="22" fill="#d6c9a8"/>' +
          // шея
          '<rect x="64" y="52" width="12" height="14" rx="4" fill="#d6c9a8"/>' +
          // торс (верх) с руками
          '<path class="man-top" d="M70 62 C46 62 34 92 34 124 L34 128 L30 132 C26 128 24 122 25 116 C26 106 30 96 40 88 L40 70 C52 60 88 60 100 70 L100 88 C110 96 114 106 115 116 C116 122 114 128 110 132 L106 128 L106 124 C106 92 94 62 70 62 Z" fill="#777"/>' +
          // руки-кисти
          '<circle cx="28" cy="136" r="6" fill="#d6c9a8"/>' +
          '<circle cx="112" cy="136" r="6" fill="#d6c9a8"/>' +
          // низ / брюки прикрывают ноги сверху
          '<path class="man-bottom" d="M34 124 L106 124 L112 176 L104 182 L94 156 L92 178 L98 240 L86 240 L82 184 L70 184 L58 184 L54 240 L42 240 L48 178 L46 156 L36 182 L28 176 Z" fill="#888"/>' +
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
    var legsEls = mannequinEl.querySelectorAll(".man-legs");
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
        else if (partKey === "accent") {
          legsEls.forEach(function (l) { l.style.fill = color; });
        }
      });
    });
  }

  // Сохраняем данные в localStorage, чтобы админ мог обновлять страницу
  window.__SITE_SAVE = function (data) {
    try {
      localStorage.setItem("site_data_v2", JSON.stringify(data));
    } catch (e) {}
  };
  window.__SITE_RESET = function () {
    try {
      localStorage.removeItem("site_data_v2");
    } catch (e) {}
  };
  window.__SITE_DATA_GET = function () {
    return DATA;
  };

  render();
})();