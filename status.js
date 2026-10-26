// Статус матча по времени начала: «через 2 ч» / «идёт сейчас» / счёт или «завершён».
// Плюс фильтр новостей по теме на странице новостей.
(function () {
  const HOURS = 2.5;
  function tick() {
    const now = Date.now();
    document.querySelectorAll(".st[data-start]").forEach((el) => {
      const start = new Date(el.dataset.start).getTime(), end = start + HOURS * 36e5;
      if (now < start) {
        const min = Math.ceil((start - now) / 6e4), h = Math.floor(min / 60), m = min % 60;
        el.className = "st";
        el.textContent = min > 24 * 60 ? "" : "через " + [h && h + " ч", m && m + " мин"].filter(Boolean).join(" ");
      } else if (now < end) {
        el.className = "st live"; el.innerHTML = "<i></i>Идёт сейчас";
      } else {
        el.className = "st done"; el.textContent = el.dataset.result ? "Счёт " + el.dataset.result : "Завершён";
      }
    });
  }
  tick();
  setInterval(tick, 30000);

  const tabs = document.querySelector(".news-tabs");
  if (tabs) tabs.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    tabs.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b));
    const tag = b.dataset.tag;
    document.querySelectorAll(".news-item").forEach((n) => {
      const t = n.querySelector(".tag").textContent;
      n.hidden = tag === "Фрибеты" ? t !== "Фрибеты" : tag === "Спорт" ? t === "Фрибеты" : false;
    });
  });
})();
