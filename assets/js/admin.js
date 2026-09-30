// ============================================================
//  РђРґРјРёРЅ-РїР°РЅРµР»СЊ: РѕС‚РєСЂС‹РІР°РµС‚СЃСЏ РєРЅРѕРїРєРѕР№ В«вњЋВ» РІ РїСЂР°РІРѕРј РЅРёР¶РЅРµРј СѓРіР»Сѓ.
//  Р’СЃРµ РёР·РјРµРЅРµРЅРёСЏ СЃРѕС…СЂР°РЅСЏСЋС‚СЃСЏ РІ localStorage Р±СЂР°СѓР·РµСЂР°.
//  Р§С‚РѕР±С‹ РїСЂР°РІРєРё СѓРІРёРґРµР»Рё РІСЃРµ РїРѕСЃРµС‚РёС‚РµР»Рё РїРѕСЃР»Рµ РїСѓР±Р»РёРєР°С†РёРё,
//  РЅР°Р¶РјРёС‚Рµ В«Р’С‹РіСЂСѓР·РёС‚СЊ РґР°РЅРЅС‹РµВ» в†’ СЃРєРѕРїРёСЂСѓР№С‚Рµ Р±Р»РѕРє вЂ” СЃРј. README.
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

    h += "<h4>Р‘СЂРµРЅРґ</h4>";
    h += field("РќР°Р·РІР°РЅРёРµ", "brand_name", d.brand.name);
    h += field("РЎР»РѕРіР°РЅ", "brand_tagline", d.brand.tagline);

    h += "<h4>Р¦РІРµС‚Р° С‚РµРјС‹</h4>";
    h += field("РћСЃРЅРѕРІРЅРѕР№ С†РІРµС‚", "c_primary", d.colors.primary);
    h += field("РўС‘РјРЅС‹Р№ (РєРЅРѕРїРѕРє)", "c_primaryDark", d.colors.primaryDark);
    h += field("Р¤РѕРЅ", "c_bg", d.colors.bg);
    h += field("Р¦РІРµС‚ С‚РµРєСЃС‚Р°", "c_text", d.colors.text);
    h += field("РџСЂРёРіР»СѓС€С‘РЅРЅС‹Р№ С‚РµРєСЃС‚", "c_muted", d.colors.muted);

    h += "<h4>Р“Р»Р°РІРЅС‹Р№ СЌРєСЂР°РЅ</h4>";
    h += field("Р—Р°РіРѕР»РѕРІРѕРє", "hero_title", d.hero.title, true);
    h += field("РџРѕРґР·Р°РіРѕР»РѕРІРѕРє", "hero_subtitle", d.hero.subtitle, true);
    h += field("РўРµРєСЃС‚ РєРЅРѕРїРєРё", "hero_buttonText", d.hero.buttonText);
    h += field("РЎСЃС‹Р»РєР° РєРЅРѕРїРєРё (РЅР°РїСЂРёРјРµСЂ #contact)", "hero_buttonLink", d.hero.buttonLink);

    h += "<h4>Рћ РЅР°СЃ</h4>";
    h += field("Р—Р°РіРѕР»РѕРІРѕРє", "about_title", d.about.title);
    h += field("РўРµРєСЃС‚", "about_text", d.about.text, true);

    h += "<h4>РњР°РЅРµРєРµРЅС‹ (РіСЂРµС…Рё)</h4>";
    h += field("Р—Р°РіРѕР»РѕРІРѕРє СЃРµРєС†РёРё", "sins_title", d.sins.title);
    h += field("РџРѕРґР·Р°РіРѕР»РѕРІРѕРє", "sins_subtitle", d.sins.subtitle);
    h += '<div id="sins_editor"></div>';

    h += "<h4>Р§Р°СЃС‚С‹Рµ РІРѕРїСЂРѕСЃС‹</h4>";
    h += field("Р—Р°РіРѕР»РѕРІРѕРє", "faq_title", d.faq.title);
    h += '<div id="faq_editor"></div>';

    h += "<h4>РљРѕРЅС‚Р°РєС‚С‹</h4>";
    h += field("РўРµР»РµС„РѕРЅ (С‚РµРєСЃС‚)", "c_phone", d.contact.phone);
    h += field("РўРµР»РµС„РѕРЅ (СЃСЃС‹Р»РєР°, СЃ +7...)", "c_phoneLink", d.contact.phoneLink);
    h += field("Email (С‚РµРєСЃС‚)", "c_email", d.contact.email);
    h += field("Email (СЃСЃС‹Р»РєР°, mailto:)", "c_emailLink", d.contact.emailLink);
    h += field("РђРґСЂРµСЃ", "c_address", d.contact.address);
    h += field("РўРµРєСЃС‚ РєРЅРѕРїРєРё", "c_buttonText", d.contact.buttonText);

    h += "<h4>Р¤СѓС‚РµСЂ</h4>";
    h += field("РўРµРєСЃС‚ РІРЅРёР·Сѓ СЃС‚СЂР°РЅРёС†С‹", "footer_text", d.footerText);

    body.innerHTML = h;

    // Р РµРґР°РєС‚РѕСЂС‹ СЃРїРёСЃРєРѕРІ
    window.__SINS_EDITOR = null;
    window.__FAQ_EDITOR = null;
    buildSinsEditor("sins_editor", d.sins.items);
    buildListEditor("faq_editor", d.faq.items, "faq");
  }

  function buildSinsEditor(containerId, sins) {
    var container = document.getElementById(containerId);
    var PART_KEYS = ["top", "bottom", "accent"];
    var PART_LABELS = { top: "Р’РµСЂС…", bottom: "РќРёР·", accent: "Р СѓРєР°РІР°/Р°РєС†РµРЅС‚" };
    function render() {
      var h = "";
      sins.forEach(function (sin, si) {
        var partsHtml = PART_KEYS.map(function (pk) {
          var part = sin.parts[pk];
          if (!part) return "";
          var opts = part.options.map(function (o, oi) {
            return (
              '<div class="part-edit" data-si="' + si + '" data-pk="' + pk + '" data-oi="' + oi + '">' +
              '<input data-f="name" value="' + esc(o.name) + '" placeholder="РРјСЏ">' +
              '<input data-f="color" value="' + esc(o.color) + '" placeholder="#aabbcc">' +
              '<button class="remove-btn" data-del-part="' + si + ':' + pk + ':' + oi + '">Г—</button>' +
              "</div>"
            );
          }).join("");
          return (
            '<div class="part-group">' +
            '<label class="mini-label">' + esc(PART_LABELS[pk]) + "</label>" +
            opts +
            '<button class="add-btn" data-addopt="' + si + ':' + pk + '">+ Р’Р°СЂРёР°РЅС‚</button>' +
            "</div>"
          );
        }).join("");

        h +=
          '<div class="sin-item-edit">' +
          '<div class="field"><label>РќР°Р·РІР°РЅРёРµ РіСЂРµС…Р°</label><input data-f="name" data-si="' + si + '" value="' + esc(sin.name) + '"></div>' +
          '<div class="field"><label>РћРїРёСЃР°РЅРёРµ</label><textarea data-f="desc" data-si="' + si + '">' + esc(sin.desc) + "</textarea></div>" +
          '<label class="mini-label">Р”РµС‚Р°Р»Рё РѕРґРµР¶РґС‹</label>' +
          partsHtml +
          '<button class="remove-btn" data-del-sin="' + si + '">РЈРґР°Р»РёС‚СЊ РіСЂРµС…</button>' +
          "</div>";
      });
      h += '<button class="add-btn" id="add_sin">+ Р”РѕР±Р°РІРёС‚СЊ РіСЂРµС…</button>';
      container.innerHTML = h;

      container.querySelectorAll("input[data-si], textarea[data-si]").forEach(function (el) {
        el.addEventListener("input", function () {
          if (el.hasAttribute("data-si") && !el.hasAttribute("data-pk")) sins[el.dataset.si][el.dataset.f] = el.value;
        });
      });
      container.querySelectorAll(".part-edit input").forEach(function (el) {
        el.addEventListener("input", function () {
          var d = el.closest(".part-edit").dataset;
          sins[d.si].parts[d.pk].options[d.oi][el.dataset.f] = el.value;
        });
      });
      container.querySelectorAll("[data-del-part]").forEach(function (b) {
        b.addEventListener("click", function () {
          var p = b.dataset.delPart.split(":");
          sins[p[0]].parts[p[1]].options.splice(Number(p[2]), 1);
          render();
        });
      });
      container.querySelectorAll("[data-addopt]").forEach(function (b) {
        b.addEventListener("click", function () {
          var p = b.dataset.addopt.split(":");
          sins[p[0]].parts[p[1]].options.push({ name: "Р’Р°СЂРёР°РЅС‚", color: "#888888" });
          render();
        });
      });
      container.querySelectorAll("[data-del-sin]").forEach(function (b) {
        b.addEventListener("click", function () {
          sins.splice(Number(b.dataset.delSin), 1);
          render();
        });
      });
      document.getElementById("add_sin").addEventListener("click", function () {
        sins.push({
          name: "Р“СЂРµС…", desc: "РћРїРёСЃР°РЅРёРµ",
          parts: {
            top: { label: "Р’РµСЂС…", options: [{ name: "Р’РµСЂС…", color: "#777777" }] },
            bottom: { label: "РќРёР·", options: [{ name: "РќРёР·", color: "#888888" }] },
            accent: { label: "Р СѓРєР°РІР°", options: [{ name: "Р СѓРєР°РІР°", color: "#666666" }] }
          }
        });
        render();
      });
    }
    render();
    window.__SINS_EDITOR = sins;
  }

  function buildListEditor(containerId, items, kind) {
    var container = document.getElementById(containerId);
    function render() {
      var h = "";
      items.forEach(function (item, i) {
        h +=
          '<div class="faq-item-edit">' +
          '<div class="field"><label>Р’РѕРїСЂРѕСЃ</label><input data-f="q" data-i="' + i + '" value="' + esc(item.q) + '"></div>' +
          '<div class="field"><label>РћС‚РІРµС‚</label><textarea data-f="a" data-i="' + i + '">' + esc(item.a) + "</textarea></div>" +
          '<button class="remove-btn" data-del="' + i + '">РЈРґР°Р»РёС‚СЊ</button>' +
          "</div>";
      });
      h += '<button class="add-btn" id="add_' + kind + '">+ Р”РѕР±Р°РІРёС‚СЊ</button>';
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
        items.push({ q: "", a: "" });
        render();
      });
    }
    render();

    window.__FAQ_EDITOR = items;
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
    draft.sins.title = g("sins_title");
    draft.sins.subtitle = g("sins_subtitle");
    draft.faq.title = g("faq_title");
    draft.contact.phone = g("c_phone");
    draft.contact.phoneLink = g("c_phoneLink");
    draft.contact.email = g("c_email");
    draft.contact.emailLink = g("c_emailLink");
    draft.contact.address = g("c_address");
    draft.contact.buttonText = g("c_buttonText");
    draft.footerText = g("footer_text");
    if (window.__SINS_EDITOR) draft.sins.items = window.__SINS_EDITOR;
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
    if (confirm("РЎР±СЂРѕСЃРёС‚СЊ РІСЃРµ РёР·РјРµРЅРµРЅРёСЏ Рє РёСЃС…РѕРґРЅС‹Рј? Р­С‚Рѕ РЅРµР»СЊР·СЏ РѕС‚РјРµРЅРёС‚СЊ.")) {
      window.__SITE_RESET();
      location.reload();
    }
  });

  // РљР»РёРє РІРЅРµ РїР°РЅРµР»Рё РЅРµ Р·Р°РєСЂС‹РІР°РµС‚ РµС‘; Р·Р°РєСЂС‹С‚РёРµ С‚РѕР»СЊРєРѕ РїРѕ Г— РёР»Рё Esc
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !panel.hidden) panel.hidden = true;
  });
})();