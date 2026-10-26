// Матч дня. Обновлять раз в день: команды, время начала (с часовым поясом), ссылка на трансляцию у БК.
//   hours — сколько часов после начала показывать «Идёт сейчас» (хоккей ~2.5, футбол ~2, теннис ~3)
//   link  — партнёрская ссылка на букмекера, где есть трансляция;  bk — его название для подписи
const MATCH = {
  sport: "Хоккей",
  league: "КХЛ · регулярный чемпионат",
  home: "Динамо М",
  away: "Авангард",
  start: "2026-10-26T19:30:00+03:00",
  hours: 2.5,
  venue: "ВТБ Арена, Москва",
  link: "",
  bk: "",
};

(function () {
  const box = document.getElementById("match");
  if (!box || !MATCH.home) return;

  const start = new Date(MATCH.start);
  const end = new Date(start.getTime() + MATCH.hours * 36e5);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const time = start.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Moscow" });
  const day = (() => {
    const d = (x) => x.toLocaleDateString("ru-RU", { timeZone: "Europe/Moscow" });
    const now = new Date(), tmr = new Date(now.getTime() + 864e5);
    if (d(start) === d(now)) return "Сегодня";
    if (d(start) === d(tmr)) return "Завтра";
    return start.toLocaleDateString("ru-RU", { day: "numeric", month: "long", timeZone: "Europe/Moscow" });
  })();

  function status() {
    const now = Date.now();
    if (now >= end) return null;
    if (now >= start) return `<span class="live"><i></i>Идёт сейчас</span>`;
    const min = Math.ceil((start - now) / 6e4);
    const h = Math.floor(min / 60), m = min % 60;
    const parts = [h && h + " ч", m && m + " мин"].filter(Boolean).join(" ");
    return `<span class="soon-pill">через ${parts}</span>`;
  }

  function render() {
    const st = status();
    if (!st) { box.hidden = true; box.closest(".page-head").classList.remove("has-match"); return; }
    box.hidden = false;
    box.innerHTML = `
      <div class="m-top"><b>Матч дня</b>${st}</div>
      <p class="m-league">${esc(MATCH.sport)} · ${esc(MATCH.league)}</p>
      <p class="m-teams"><span>${esc(MATCH.home)}</span><span>${esc(MATCH.away)}</span></p>
      <p class="m-when">${day}, <b class="num">${time}</b> МСК · ${esc(MATCH.venue)}</p>
      <a class="btn" href="${esc(MATCH.link || "#")}" target="_blank" rel="sponsored noopener">Смотреть трансляцию</a>
      <p class="m-note">Бесплатно у ${MATCH.bk ? esc(MATCH.bk) : "букмекера"} после регистрации</p>`;
  }

  render();
  setInterval(render, 30000);
})();
