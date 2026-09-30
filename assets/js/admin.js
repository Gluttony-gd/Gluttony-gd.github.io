// ============================================================
//  Админ-панель: открывается кнопкой «✎» в правом нижнем углу.
//  Все изменения сохраняются в localStorage браузера.
//  Чтобы правки увидели все посетители после публикации,
//  нажмите «Выгрузить данные» → скопируйте блок — см. README.
// ============================================================

(function () {
  const toggle = document.getElementById("admin-toggle");
  const panel = document.getElementById("admin-panel");
  const body = document.getElementById("admin-body");
  const closeBtn = document.getElementById("admin-close");
  const saveBtn = document.getElementById("admin-save");
  const resetBtn = document.getElementById("admin-reset");

  let draft;

  function esc(str) {
    var div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  function field(label, id, value, isTextarea) {
    var tag = isTextarea ? "textarea" : "input";
    return (
      '<div class="field"><label for="' + id + '">' + label + "</label>" +
      "<" + tag + ' id="' + id + '">' + (isTextarea ? esc(value) : "") + "</" + tag + ">" +
      "</div>"
    );
  }

  function renderForm() {
    var d = draft;
    var h = "";

    h += "<h4>Бренд</h4>";
    h += field("Название", "brand_name", d.brand.name);
    h += field("Слоган", "brand_tagline", d.brand.tagline);

    h += "<h4>Цвета темы</h4>";
    h += field("Основной цвет", "c_primary", d.colors.primary);
    h += field("Тёмный (кнопок)", "c_primaryDark", d.colors.primaryDark);
    h += field("Фон", "c_bg", d.colors.bg);
    h += field("Цвет текста", "c_text", d.colors.text);
    h += field("Приглушённый текст", "c_muted", d.colors.muted);

    h += "<h4>Главный экран</h4>";
    h += field("Заголовок", "hero_title", d.hero.title, true);
    h += field("Подзаголовок", "hero_subtitle", d.hero.subtitle, true);
    h += field("Текст кнопки", "hero_buttonText", d.hero.buttonText);
    h += field("Ссылка кнопки (например #contact)", "hero_buttonLink", d.hero.buttonLink);

    h += "<h4>О нас</h4>";
    h += field("Заголовок", "about_title", d.about.title);
    h += field("Текст", "about_text", d.about.text, true);

    h += "<h4>Услуги</h4>";
    h += field("Заголовок секции", "services_title", d.services.title);
    h += field("Подзаголовок", "services_subtitle", d.services.subtitle);
    h += '<div id="services_editor"></div>';

    h += "<h4>Частые вопросы</h4>";
    h += field("Заголовок", "faq_title", d.faq.title);
    h += '<div id="faq_editor"></div>';

    h += "<h4>Контакты</h4>";
    h += field("Телефон (текст)", "c_phone", d.contact.phone);
    h += field("Телефон (ссылка, с +7...)", "c_phoneLink", d.contact.phoneLink);
    h += field("Email (текст)", "c_email", d.contact.email);
    h += field("Email (ссылка, mailto:)", "c_emailLink", d.contact.emailLink);
    h += field("Адрес", "c_address", d.contact.address);
    h += field("Текст кнопки", "c_buttonText", d.contact.buttonText);

    h += "<h4>Футер</h4>";
    h += field("Текст внизу страницы", "footer_text", d.footerText);

    body.innerHTML = h;

    // Редакторы списков
    window.__SERVICES_EDITOR = null;
    window.__FAQ_EDITOR = null;
    buildListEditor("services_editor", d.services.items, "services");
    buildListEditor("faq_editor", d.faq.items, "faq");
  }

  function buildListEditor(containerId, items, kind) {
    var container = document.getElementById(containerId);
    function render() {
      var h = "";
      items.forEach(function (item, i) {
        if (kind === "services") {
          h +=
            '<div class="service-item-edit">' +
            '<div class="field"><label>Название</label><input data-f="name" data-i="' + i + '" value="' + esc(item.name) + '"></div>' +
            '<div class="field"><label>Описание</label><textarea data-f="desc" data-i="' + i + '">' + esc(item.desc) + "</textarea></div>" +
            '<div class="field"><label>Цена</label><input data-f="price" data-i="' + i + '" value="' + esc(item.price) + '"></div>' +
            '<button class="remove-btn" data-del="' + i + '">Удалить</button>' +
            "</div>";
        } else {
          h +=
            '<div class="faq-item-edit">' +
            '<div class="field"><label>Вопрос</label><input data-f="q" data-i="' + i + '" value="' + esc(item.q) + '"></div>' +
            '<div class="field"><label>Ответ</label><textarea data-f="a" data-i="' + i + '">' + esc(item.a) + "</textarea></div>" +
            '<button class="remove-btn" data-del="' + i + '">Удалить</button>' +
            "</div>";
        }
      });
      h += '<button class="add-btn" id="add_' + kind + '">+ Добавить</button>';
      container.innerHTML = h;

      container.querySelectorAll("input, textarea[data-f]").forEach(function (el) {
        el.addEventListener("input", function () {
          items[el.dataset.i][el.dataset.f] = el.value;
        });
      });
      container.querySelectorAll("[data-del]").forEach(function (b) {
        b.addEventListener("click", function () {
          items.splice(Number(b.dataset.del), 1);
          render();
        });
      });
      document.getElementById("add_" + kind).addEventListener("click", function () {
        items.push(kind === "services" ? { name: "", desc: "", price: "" } : { q: "", a: "" });
        render();
      });
    }
    render();

    if (kind === "services") window.__SERVICES_EDITOR = items;
    else window.__FAQ_EDITOR = items;
  }

  function collect() {
    var g = function (id) { return document.getElementById(id).value; };
    draft.brand.name = g("brand_name");
    draft.brand.tagline = g("brand_tagline");
    draft.colors.primary = g("c_primary");
    draft.colors.primaryDark = g("c_primaryDark");
    draft.colors.bg = g("c_bg");
    draft.colors.text = g("c_text");
    draft.colors.muted = g("c_muted");
    draft.hero.title = g("hero_title");
    draft.hero.subtitle = g("hero_subtitle");
    draft.hero.buttonText = g("hero_buttonText");
    draft.hero.buttonLink = g("hero_buttonLink");
    draft.about.title = g("about_title");
    draft.about.text = g("about_text");
    draft.services.title = g("services_title");
    draft.services.subtitle = g("services_subtitle");
    draft.faq.title = g("faq_title");
    draft.contact.phone = g("c_phone");
    draft.contact.phoneLink = g("c_phoneLink");
    draft.contact.email = g("c_email");
    draft.contact.emailLink = g("c_emailLink");
    draft.contact.address = g("c_address");
    draft.contact.buttonText = g("c_buttonText");
    draft.footerText = g("footer_text");
    if (window.__SERVICES_EDITOR) draft.services.items = window.__SERVICES_EDITOR;
    if (window.__FAQ_EDITOR) draft.faq.items = window.__FAQ_EDITOR;
  }

  function toast(msg) {
    var t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add("show"); });
    setTimeout(function () {
      t.classList.remove("show");
      setTimeout(function () { t.remove(); }, 400);
    }, 2000);
  }

  toggle.addEventListener("click", function () {
    draft = JSON.parse(JSON.stringify(window.__SITE_DATA_GET()));
    panel.hidden = false;
    renderForm();
  });

  closeBtn.addEventListener("click", function () { panel.hidden = true; });

  saveBtn.addEventListener("click", function () {
    collect();
    window.__SITE_SAVE(draft);
    location.reload();
  });

  resetBtn.addEventListener("click", function () {
    if (confirm("Сбросить все изменения к исходным? Это нельзя отменить.")) {
      window.__SITE_RESET();
      location.reload();
    }
  });

  // Клик вне панели не закрывает её; закрытие только по × или Esc
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !panel.hidden) panel.hidden = true;
  });
})();