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
          '<svg viewBox="0 0 120 268" fill="none" xmlns="http://www.w3.org/2000/svg">' +
          // подставка
          '<rect x="24" y="250" width="72" height="15" rx="3" fill="#17151c"/>' +
          '<rect x="24" y="250" width="72" height="3" rx="2" fill="rgba(212,175,55,0.4)"/>' +
          // ступни / низ брючин (отделка - accent)
          '<path class="man-accent" d="M47 150 L53 150 L55 238 L45 238 Z" fill="#555"/>' +
          '<path class="man-accent" d="M67 150 L73 150 L75 238 L65 238 Z" fill="#555"/>' +
          // брюки (низ - bottom)
          '<path class="man-bottom" d="M36 122 L84 122 L90 154 L81 160 L75 180 L72 150 L48 150 L45 180 L39 160 L30 154 Z" fill="#777"/>' +
          // предплечья (кожа)
          '<path d="M32 74 C27 92 25 110 25 130 L34 130 C34 110 36 94 40 82 Z" fill="#d6c9a8"/>' +
          '<path d="M88 74 C93 92 95 110 95 130 L86 130 C86 110 84 94 80 82 Z" fill="#d6c9a8"/>' +
          // торс-рубашка с рукавами (верх - top)
          '<path class="man-top" d="M60 52 C44 52 36 60 33 70 L27 88 L40 90 C40 84 42 78 46 72 L60 68 L74 72 C78 78 80 84 80 90 L93 88 L87 70 C84 60 76 52 60 52 Z"/>' +
          '<path class="man-top" d="M40 88 L30 90 L31 72 L38 71 Z"/>' +
          '<path class="man-top" d="M80 88 L90 90 L89 72 L82 71 Z"/>' +
          // пояс (отделка - accent)
          '<rect class="man-accent" x="35" y="120" width="50" height="7" rx="2" fill="#c9a24b"/>' +
          // манжеты (отделка - accent)
          '<rect class="man-accent" x="28" y="126" width="9" height="8" rx="2" fill="#c9a24b"/>' +
          '<rect class="man-accent" x="83" y="126" width="9" height="8" rx="2" fill="#c9a24b"/>' +
          // пуговицы (отделка - accent)
          '<circle class="man-accent" cx="60" cy="86" r="2" fill="#d4af37"/>' +
          '<circle class="man-accent" cx="60" cy="100" r="2" fill="#d4af37"/>' +
          '<circle class="man-accent" cx="60" cy="112" r="2" fill="#d4af37"/>' +
          // воротник (отделка - accent)
          '<path class="man-accent" d="M55 50 L65 50 L68 60 L60 66 L52 60 Z" fill="#e8e2d0"/>' +
          // голова и шея
          '<circle cx="60" cy="30" r="19" fill="#d6c9a8"/>' +
          '<rect x="55" y="45" width="10" height="12" rx="2" fill="#d6c9a8"/>' +
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

    // Манекены: применяем стартовые цвета из данных и клик открывает плашку
    var mannequins = app.querySelectorAll(".mannequin");
    mannequins.forEach(function (m) {
      applyOutfit(m, DATA.sins.items[Number(m.dataset.sin)], null, true);
      m.addEventListener("click", function () {
        openOutfitPanel(Number(m.dataset.sin), m);
      });
    });
  }

  // Применяет цвета одежды к манекену. mode 'start' красит по первым вариантам данных.
  function applyOutfit(mannequinEl, sin, selected, isStart) {
    var topEl = mannequinEl.querySelector(".man-top");
    var bottomEl = mannequinEl.querySelector(".man-bottom");
    var accentEls = mannequinEl.querySelectorAll(".man-accent");
    var get = function (partKey) {
      var part = sin.parts[partKey];
      if (!part || !part.options.length) return "#777";
      if (selected && selected[partKey] !== undefined) {
        var i = Number(selected[partKey]);
        if (part.options[i]) return part.options[i].color;
      }
      return part.options[0].color;
    };
    if (topEl) topEl.style.fill = get("top");
    if (bottomEl) bottomEl.style.fill = get("bottom");
    accentEls.forEach(function (el) { el.style.fill = get("accent"); });
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
    var accentEls = mannequinEl.querySelectorAll(".man-accent");
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
          accentEls.forEach(function (el) { el.style.fill = color; });
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