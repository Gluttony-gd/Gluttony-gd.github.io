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
          '<svg viewBox="0 0 150 268" fill="none" xmlns="http://www.w3.org/2000/svg">' +
          buildMannequin(sinIndex) +
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
      '<a class="logo" href="#"><img class="logo-img" src="assets/img/logo.png" alt="' + esc(DATA.brand.name) + '"></a>' +
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

  // Базовая фигура манекена (одежда) + поза (руки) по индексу греха.
  // Позы: 0 Гордыня, 1 Жадность, 2 Зависть, 3 Гнев, 4 Похоть, 5 Чревоугодие, 6 Лень
  function buildMannequin(si) {
    var skin = '#d6c9a8';
    var base =
      '<rect class="man-accent" x="34" y="250" width="82" height="15" rx="3" fill="#17151c"/>' +
      '<rect class="man-accent" x="34" y="250" width="82" height="3" rx="2" fill="rgba(212,175,55,0.4)"/>' +
      // брюки (низ)
      '<path class="man-bottom" d="M46 122 L104 122 L110 154 L101 160 L95 184 L92 150 L58 150 L55 184 L49 160 L40 154 Z"/>' +
      // нижние брючины (акцент)
      '<path class="man-accent" d="M56 150 L62 150 L64 236 L54 236 Z"/>' +
      '<path class="man-accent" d="M88 150 L94 150 L96 236 L86 236 Z"/>' +
      // торс-рубашка центральная часть (верх)
      '<path class="man-top" d="M75 52 C62 52 56 58 54 68 L48 86 L60 88 C60 82 62 78 66 72 L84 72 C88 78 90 82 90 88 L102 86 L96 68 C94 58 88 52 75 52 Z"/>' +
      // пояс (акцент)
      '<rect class="man-accent" x="43" y="120" width="64" height="7" rx="2"/>' +
      // манжеты
      '<rect class="man-accent" x="36" y="126" width="11" height="9" rx="2"/>' +
      '<rect class="man-accent" x="103" y="126" width="11" height="9" rx="2"/>' +
      // пуговицы
      '<circle class="man-accent" cx="75" cy="86" r="2.2"/>' +
      '<circle class="man-accent" cx="75" cy="100" r="2.2"/>' +
      '<circle class="man-accent" cx="75" cy="112" r="2.2"/>' +
      // воротник
      '<path class="man-accent" d="M69 50 L81 50 L84 60 L75 67 L66 60 Z"/>' +
      // голова и шея
      '<circle cx="75" cy="28" r="20" fill="' + skin + '"/>' +
      '<rect x="70" y="44" width="11" height="13" rx="3" fill="' + skin + '"/>';
    // Позы рук — возвращаем SVG-элементы рук (кожа + рукава как верх)
    var arms = buildPose(si);
    return base + arms;
  }

  // Возвращает SVG-разметку рук для заданной позы греха.
  // Руки рисуются нейтральным цветом поверх одежды, чтобы жест был читаем.
  function buildPose(si) {
    var skin = '#d6c9a8';
    function arm(sx, sy, lx, ly, hx, hy, w) {
      var a1 = Math.atan2(ly - sy, lx - sx), px1 = Math.sin(a1) * w / 2, py1 = Math.cos(a1) * w / 2;
      var a2 = Math.atan2(hy - ly, hx - lx), px2 = Math.sin(a2) * w / 2, py2 = Math.cos(a2) * w / 2;
      var seg = function (x0, y0, x1, y1, px, py) { return [(x0 + px), (y0 - py), (x1 + px), (y1 - py), (x1 - px), (y1 + py), (x0 - px), (y0 + py)]; };
      var pts = [].concat(seg(sx, sy, lx, ly, px1, py1), seg(lx, ly, hx, hy, px2, py2));
      return '<polygon points="' + pts.join(' ') + '" fill="#9a9aab"/>' +
             '<circle cx="' + hx + '" cy="' + hy + '" r="' + Math.round(w * 0.6) + '" fill="' + skin + '"/>';
    }
    var poses = [
      // 0 Гордыня: руки в боки (кисти широко на талии 122)
      arm(57, 68, 40, 90, 44, 122, 7) + arm(93, 68, 110, 90, 106, 122, 7),
      // 1 Жадность: руки перед грудью вместе
      arm(57, 68, 60, 88, 73, 102, 7) + arm(93, 68, 90, 88, 77, 102, 7),
      // 2 Зависть: правая к подбородку, левая вниз
      arm(57, 68, 50, 88, 48, 120, 7) + arm(93, 68, 100, 80, 88, 52, 7),
      // 3 Гнев: обе руки-кулаки подняты над головой
      arm(57, 68, 42, 56, 44, 34, 8) + arm(93, 68, 108, 56, 106, 34, 8),
      // 4 Похоть: одна на бедре, другая к волосам
      arm(57, 68, 50, 92, 62, 120, 7) + arm(93, 68, 104, 82, 86, 38, 7),
      // 5 Чревоугодие: руки широко обхватывают живот
      arm(57, 68, 58, 98, 66, 136, 7) + arm(93, 68, 92, 98, 84, 136, 7),
      // 6 Лень: одна вниз, другая на поясе
      arm(57, 68, 50, 96, 46, 140, 7) + arm(93, 68, 102, 88, 98, 122, 7)
    ];
    return poses[si] || poses[0];
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