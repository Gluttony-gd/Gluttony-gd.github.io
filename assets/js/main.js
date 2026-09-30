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

    const servicesCards = DATA.services.items
      .map(function (s) {
        return (
          '<div class="service-card">' +
          "<h3>" + esc(s.name) + "</h3>" +
          "<p>" + esc(s.desc) + "</p>" +
          '<div class="service-price">' + esc(s.price) + "</div>" +
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

      '<section class="section" id="services"><div class="container">' +
      '<h2 class="section-title">' + esc(DATA.services.title) + "</h2>" +
      '<p class="section-sub">' + esc(DATA.services.subtitle) + "</p>" +
      '<div class="services-grid">' + servicesCards + "</div>" +
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