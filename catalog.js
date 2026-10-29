// Отрисовка акций из promos.js на любой странице.
// Что показывать, страница говорит атрибутами:
//   <body data-who="new|current" data-bk="Leon" data-nodep data-kind="cashback">  — пресет каталога
//   #promos, #tabs, #chips, #q, #sort, #total, #updated, #ended          — каталог (все элементы необязательны)
//   <div data-list="new|current|soon|all" data-limit="5">                   — короткая подборка (главная)
//   <span data-count="new|current|nodep|cashback|all">                      — число акций
//   <a data-bklink="Leon">                                                  — «N акций» у букмекера
(function () {
  const $ = (s) => document.querySelector(s);
  const DAY = 864e5;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const money = (n) => n.toLocaleString("ru-RU");
  const plural = (n, a, b, c) => { const m = n % 100, d = n % 10; return m > 10 && m < 20 ? c : d === 1 ? a : d > 1 && d < 5 ? b : c; };
  const promoWord = (n) => `${n} ${plural(n, "акция", "акции", "акций")}`;
  const norm = (s) => s.toLowerCase().replace(/ё/g, "е");
  const daysLeft = (p) => (p.until ? Math.round((new Date(p.until + "T00:00:00") - today) / DAY) : Infinity);
  const dateRu = (iso) => new Date(iso + "T00:00:00").toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
  const bkPage = (name) => { const b = BOOKMAKERS.find((x) => x.name === name); return b ? `bk-${b.slug}.html` : "bukmekery.html"; };
  const isCashback = (p) => /кешб|страхов|возврат/i.test(p.title);
  const linkOf = (p) => p.link || (BOOKMAKERS.find((x) => x.name === p.bk) || {}).aff || "";

  const active = PROMOS.filter((p) => daysLeft(p) >= 0);
  const ended = PROMOS.filter((p) => daysLeft(p) < 0);

  const kinds = {
    all: () => true,
    new: (p) => p.who === "new",
    current: (p) => p.who === "current",
    nodep: (p) => p.noDep,
    cashback: isCashback,
  };

  function left(p) {
    const d = daysLeft(p);
    if (d === Infinity) return `<p class="left">Срок<b>без даты</b>уточняйте у БК</p>`;
    if (d < 0) return `<p class="left ended"><b>Завершена</b>${dateRu(p.until)}</p>`;
    if (d === 0) return `<p class="left soon">Последний день<b>до 23:59</b></p>`;
    return `<p class="left${d <= 3 ? " soon" : ""}">Осталось<b>${d} ${plural(d, "день", "дня", "дней")}</b>до ${dateRu(p.until)}</p>`;
  }

  function card(p) {
    const done = daysLeft(p) < 0;
    const terms = [["Депозит", p.noDep ? "не нужен" : p.minDep], ["Мин. кэф", p.minOdds], ["Ставка", p.stake], ["Срок отыгрыша", p.wager]]
      .filter(([, v]) => v).map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("");
    const amount = p.amount != null
      ? `<p class="amount num">${p.pre ? `<span class="pre">${esc(p.pre)}</span>` : ""}${money(p.amount)}<span class="cur">${p.unit || "₽"}</span></p>` : "";
    const steps = p.steps || ["Перейдите к букмекеру по кнопке «Забрать»", "Войдите в аккаунт или зарегистрируйтесь", "Полные условия — на странице акции у букмекера"];
    return `
      <article class="promo${done ? " is-ended" : ""}">
        <div class="promo-main">
          <div class="promo-top">
            <a class="bk" href="${bkPage(p.bk)}">${esc(p.bk)}</a>
            <span class="who">${p.who === "new" ? "Новым игрокам" : "Действующим игрокам"}</span>
            ${p.noDep ? `<span class="flag">Без депозита</span>` : ""}
          </div>
          ${amount}
          <h3>${esc(p.title)}</h3>
          ${terms ? `<dl class="terms">${terms}</dl>` : ""}
          ${p.code ? `<p class="code">Промокод <b>${esc(p.code)}</b></p>` : ""}
          <details><summary>Как получить</summary><ol>${steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol></details>
        </div>
        <div class="stub">
          ${left(p)}
          <a class="btn" href="${esc(linkOf(p) || "#")}" target="_blank" rel="sponsored noopener"${done ? ` aria-disabled="true" tabindex="-1"` : ""}>${done ? "Акция завершена" : "Забрать"}</a>
          ${p.erid ? `<p class="ad">Реклама. ${esc(p.bk)}. erid: ${esc(p.erid)}</p>` : ""}
        </div>
      </article>`;
  }

  // ---------- счётчики и ссылки на букмекеров (любая страница) ----------
  document.querySelectorAll("[data-count]").forEach((el) => {
    el.textContent = promoWord(active.filter(kinds[el.dataset.count] || kinds.all).length);
  });
  document.querySelectorAll("[data-bklink]").forEach((el) => {
    const n = active.filter((p) => p.bk === el.dataset.bklink).length;
    el.textContent = n ? promoWord(n) : "Нет акций";
  });

  // ---------- короткие подборки ----------
  document.querySelectorAll("[data-list]").forEach((el) => {
    const type = el.dataset.list, limit = +el.dataset.limit || 5;
    let rows = type === "soon"
      ? active.filter((p) => daysLeft(p) !== Infinity).sort((a, b) => daysLeft(a) - daysLeft(b))
      : active.filter(kinds[type] || kinds.all);
    if (type === "new") rows = rows.slice().sort((a, b) => (b.amount || 0) - (a.amount || 0));
    el.innerHTML = rows.slice(0, limit).map(card).join("");
  });

  // ---------- каталог ----------
  const list = $("#promos");
  if (!list) return;

  const preset = document.body.dataset;
  const params = new URLSearchParams(location.search);
  const state = {
    who: params.get("who") || preset.who || "all",
    bk: params.get("bk") || preset.bk || null,
    q: params.get("q") || "",
    sort: "new",
  };
  const base = active.filter((p) => (!("nodep" in preset) || p.noDep) && (preset.kind !== "cashback" || isCashback(p)) && (!preset.bk || p.bk === preset.bk));

  function matches(p) {
    if (state.who !== "all" && p.who !== state.who) return false;
    if (state.bk && p.bk !== state.bk) return false;
    if (state.q) {
      const hay = norm([p.bk, p.title, p.noDep ? "без депозита" : "", p.who === "new" ? "новым регистрация" : "действующим", "фрибет"].join(" "));
      return norm(state.q).split(/\s+/).every((w) => hay.includes(w));
    }
    return true;
  }

  const rub = (p) => (p.amount != null && (p.unit || "₽") === "₽" ? p.amount : 0);
  const sorters = {
    new: (a, b) => PROMOS.indexOf(a) - PROMOS.indexOf(b),
    amount: (a, b) => rub(b) - rub(a),
    soon: (a, b) => daysLeft(a) - daysLeft(b),
  };

  const tabs = $("#tabs"), chips = $("#chips"), q = $("#q"), sort = $("#sort");

  function syncControls() {
    tabs && tabs.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.v === state.who));
    chips && chips.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.v === state.bk));
  }

  function render() {
    const rows = base.filter(matches).sort(sorters[state.sort]);
    list.innerHTML = rows.length
      ? rows.map(card).join("")
      : `<div class="empty"><p>По этому запросу акций нет.</p><button type="button" id="reset">Сбросить фильтры</button></div>`;
    const r = $("#reset");
    if (r) r.onclick = () => { state.who = preset.who || "all"; state.bk = preset.bk || null; state.q = ""; if (q) q.value = ""; syncControls(); render(); };
  }

  if (tabs) {
    const count = (who) => base.filter((p) => who === "all" || p.who === who).length;
    [["all", "Все"], ["new", "Новым"], ["current", "Действующим"]].forEach(([v, label]) => {
      const b = document.createElement("button");
      b.type = "button"; b.dataset.v = v;
      b.innerHTML = `${label}<span class="c num">${count(v)}</span>`;
      b.onclick = () => { state.who = v; syncControls(); render(); };
      tabs.appendChild(b);
    });
  }

  if (chips) {
    const perBk = {};
    base.forEach((p) => (perBk[p.bk] = (perBk[p.bk] || 0) + 1));
    Object.keys(perBk).sort((a, b) => perBk[b] - perBk[a]).forEach((name) => {
      const b = document.createElement("button");
      b.type = "button"; b.dataset.v = name;
      b.innerHTML = `${esc(name)}<span class="c num">${perBk[name]}</span>`;
      b.onclick = () => { state.bk = state.bk === name ? null : name; syncControls(); render(); };
      chips.appendChild(b);
    });
  }

  if (q) { q.value = state.q; q.addEventListener("input", (e) => { state.q = e.target.value.trim(); render(); }); }
  if (sort) sort.addEventListener("change", (e) => { state.sort = e.target.value; render(); });

  const upd = $("#updated");
  if (upd) upd.textContent = new Date(UPDATED + "T00:00:00").toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  const tot = $("#total");
  if (tot) tot.textContent = promoWord(base.length);

  const endedBox = $("#ended");
  if (endedBox) {
    const own = ended.filter((p) => !preset.bk || p.bk === preset.bk);
    endedBox.innerHTML = own.map(card).join("");
    if (!own.length) endedBox.closest("section").hidden = true;
  }

  syncControls();
  render();
})();
