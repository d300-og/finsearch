// Акции букмекеров. Один объект = одна карточка.
//   bk        — название букмекера (как в фильтре)
//   who       — "new" (новым игрокам) или "current" (действующим)
//   amount    — число (5000) или null, если суммы нет;  unit — "₽" (по умолчанию) или "%"
//   pre       — слово перед суммой: "до", "от", ""
//   title     — суть акции одной фразой
//   minDep, minOdds, stake, wager — условия; пусто = не показывать
//   until     — последний день акции ГГГГ-ММ-ДД, или "" если срок не известен
//   noDep     — true, если депозит не нужен
//   steps     — как получить, по шагам (необязательно)
//   link      — партнёрская ссылка на конкретную акцию (если пусто — берётся aff букмекера из BOOKMAKERS);  erid — маркировка рекламы;  code — СВОЙ промокод из партнёрки
//
// Собрано 26.10.2026 из открытых источников (stavka.tv, bookmaker-ratings.ru).
// unverified: true — условия не сверены на сайте букмекера. Перед публикацией сверить и снять флаг.
const UPDATED = "2026-10-26";

const PROMOS = [
  // ---------- новым игрокам ----------
  { bk: "Fonbet", who: "new", amount: 15000, pre: "до", title: "Фрибет за регистрацию: сумма выпадает случайно, от 100 до 15 000 ₽",
    noDep: true, until: "2026-12-31",
    steps: ["Зарегистрируйтесь по кнопке «Забрать»", "Пройдите идентификацию", "Фрибет появится в разделе бонусов"], unverified: true },
  { bk: "Betcity", who: "new", amount: 200000, pre: "до", title: "Приветственный бонус за первый депозит и ставки",
    noDep: false, until: "2026-12-31", unverified: true },
  { bk: "Marathonbet", who: "new", amount: 21500, pre: "до", title: "Ступенчатый приветственный бонус фрибетами: чем больше депозит и ставки, тем выше ступень",
    minDep: "от 500 ₽", noDep: false, until: "2026-12-30", unverified: true },
  { bk: "Melbet", who: "new", amount: 30000, pre: "до", title: "Приветственный фрибет новым игрокам",
    noDep: false, until: "2026-12-31", unverified: true },
  { bk: "Olimpbet", who: "new", amount: 15000, pre: "до", title: "Фрибет за регистрацию, минимальная сумма — 500 ₽",
    noDep: false, until: "2026-12-31", unverified: true },
  { bk: "Winline", who: "new", amount: 10000, pre: "до", title: "Фрибеты за первые депозиты",
    noDep: false, until: "2026-12-31", unverified: true },
  { bk: "Лига Ставок", who: "new", amount: 8000, pre: "до", title: "Фрибеты за депозиты и ставки на спорт",
    noDep: false, until: "2026-12-31", unverified: true },
  { bk: "PARI", who: "new", amount: 5000, pre: "до", title: "Пять фрибетов за депозит и ставки",
    noDep: false, until: "2026-12-31", unverified: true },
  { bk: "Zenit", who: "new", amount: 5000, pre: "до", title: "Фрибеты за депозит и ставки",
    noDep: false, until: "2026-12-31", unverified: true },
  { bk: "Leon", who: "new", amount: 3000, pre: "до", title: "Фрибет за первый депозит и первую ставку в лайве",
    noDep: false, until: "2026-12-31", unverified: true },
  { bk: "Bettery", who: "new", amount: 2000, pre: "", title: "Фрибет за регистрацию и первый депозит",
    minDep: "от 1 000 ₽", noDep: false, until: "2026-12-30", unverified: true },
  { bk: "BetBoom", who: "new", amount: 1000, pre: "", title: "Фрибет за регистрацию без пополнения счёта",
    noDep: true, until: "2026-12-31", unverified: true },
  { bk: "Leon", who: "new", amount: 500, pre: "", title: "Стартовый фрибет без депозита",
    noDep: true, wager: "2 дня", until: "2026-12-30", unverified: true },

  // ---------- действующим игрокам ----------
  { bk: "Leon", who: "current", amount: 1000000, pre: "до", title: "Турнир «Парад чемпионов»: очки за выигранные ставки, призовой фонд 2 000 000 ₽",
    minOdds: "от 1.40", stake: "от 1 500 ₽", until: "2026-11-01",
    steps: ["Зарегистрируйтесь в турнире на странице акции", "Делайте ставки: очки дают выигранные одинары", "Призы получают лидеры таблицы"], unverified: true },
  { bk: "Zenit", who: "current", amount: 30000, pre: "до", title: "Ежедневные задания в приложении: награды открываются по ступеням, до 75 заданий",
    until: "2026-10-31", unverified: true },
  { bk: "Leon", who: "current", amount: 100000, pre: "до", title: "Гонка по еврокубкам: очко за каждую выигранную ставку на ЛЧ, ЛЕ и Лигу конференций",
    minOdds: "от 1.50", stake: "от 500 ₽", until: "2026-12-11", unverified: true },
  { bk: "Leon", who: "current", amount: 15000000, pre: "до", title: "Юбилейный купон: розыгрыш призов среди игроков, пополнивших счёт",
    minDep: "от 2 500 ₽", until: "2026-12-21", unverified: true },
  { bk: "BetBoom", who: "current", amount: 199800, pre: "до", title: "«Умножь фрибет»: выберите сумму и запустите множитель до x9.99 — результат может как вырасти, так и уменьшиться",
    until: "2026-12-30", unverified: true },
  { bk: "BetBoom", who: "current", amount: null, title: "Гарантированный фрибет за ставку на матч «Локомотива»: призовой фонд делят все участники, за 5+ ставок доля удваивается",
    minOdds: "от 1.30", stake: "от 500 ₽", until: "2026-12-06", unverified: true },
  { bk: "Melbet", who: "current", amount: 50000, pre: "до", title: "Еженедельные турниры по активности, призовой фонд 2 500 000 ₽",
    until: "2026-12-28", unverified: true },
  { bk: "PARI", who: "current", amount: 30, unit: "%", pre: "до", title: "Еженедельный кешбэк за проигранные ставки деньгами: процент растёт вместе с оборотом",
    stake: "от 2 000 ₽ в неделю", until: "2026-12-31", unverified: true },
  { bk: "PARI", who: "current", amount: 10000, pre: "до", title: "Баллы за ставки на спорт и киберспорт и задания в соцсетях — обмен на фрибеты и скины",
    until: "2026-12-31", unverified: true },
  { bk: "PARI", who: "current", amount: 5, unit: "%", pre: "", title: "Фрибет в размере 5% от каждого экспресса",
    until: "2026-12-31", unverified: true },
  { bk: "Winline", who: "current", amount: 1500, pre: "до", title: "Цепочка заданий по вторникам: пополнение и ставки строго по порядку",
    noDep: false, until: "2026-12-31", unverified: true },
  { bk: "Winline", who: "current", amount: 10000, pre: "до", title: "«Бонус-клуб»: ежемесячные фрибеты для активных игроков",
    until: "2026-12-31", unverified: true },
  { bk: "Leon", who: "current", amount: 1000, pre: "до", title: "Бесплатная игра «три в ряд»: набирайте уровни, бонусы с 5-го и 10-го уровня",
    noDep: true, until: "2026-12-31", unverified: true },
  { bk: "Melbet", who: "current", amount: null, title: "Досрочный расчёт: ставка на победу в матче РПЛ рассчитывается выигрышем, как только команда ведёт в два мяча",
    until: "2027-05-30", unverified: true },

  // ---------- действующим, без даты (bookmaker-ratings.ru) ----------
  { bk: "Fonbet", who: "current", amount: 200000, pre: "до", title: "Фрибеты за выигранные ставки на хоккей",
    until: "2026-12-31", unverified: true },
  { bk: "Fonbet", who: "current", amount: 200000, pre: "до", title: "Фрибеты за выигранные ставки на баскетбол",
    until: "2026-12-31", unverified: true },
  { bk: "Fonbet", who: "current", amount: 500000, pre: "до", title: "Прогнозы на НБА: фрибеты, PlayStation 5 и мерч",
    until: "2026-12-31", unverified: true },
  { bk: "Fonbet", who: "current", amount: 100000, pre: "до", title: "Фрибеты за выигранные ставки на «Игры 24/7»",
    until: "2026-12-31", unverified: true },
  { bk: "Winline", who: "current", amount: 250000, pre: "до", title: "Мини-игра «Делай разницу»: фрибеты без пополнения счёта",
    noDep: true, until: "2026-12-31", unverified: true },
  { bk: "Winline", who: "current", amount: 100, unit: "%", pre: "до", title: "Еженедельные фрибеты и кешбэк за ставки",
    until: "2026-12-31", unverified: true },
  { bk: "Betcity", who: "current", amount: 7000, pre: "до", title: "77 фрибетов за подписку на Telegram-канал",
    noDep: true, until: "2026-12-31", unverified: true },
  { bk: "Marathonbet", who: "current", amount: 1000, pre: "", title: "Фрибет за подписку на Telegram-канал",
    noDep: true, until: "2026-12-31", unverified: true },
  { bk: "Marathonbet", who: "current", amount: 66666, pre: "до", title: "Фрибеты за ставки экспрессом",
    until: "2026-12-31", unverified: true },
  { bk: "Olimpbet", who: "current", amount: 100000, pre: "до", title: "Фрибеты за подтверждённый VIP-статус в другой букмекерской конторе",
    until: "2026-12-31", unverified: true },
  { bk: "Лига Ставок", who: "current", amount: 50000, pre: "до", title: "Турнир за ставки в лайве на НХЛ и НБА",
    until: "2026-12-31", unverified: true },
  { bk: "BetBoom", who: "current", amount: 10000, pre: "до", title: "Фрибет за каждого приглашённого друга",
    noDep: true, until: "2026-12-31", unverified: true },
  { bk: "BetBoom", who: "current", amount: 200000, pre: "до", title: "Фрибеты за ставки на спорт",
    until: "2026-12-31", unverified: true },
  { bk: "Zenit", who: "current", amount: 10, unit: "%", pre: "до", title: "Программа лояльности: фрибеты до 5 000 ₽ и кешбэк",
    until: "2026-12-31", unverified: true },
  { bk: "Melbet", who: "current", amount: 10000, pre: "до", title: "Страховка ставки: возврат, если матч европейского футбола закончится 0:0",
    until: "2026-12-31", unverified: true },
  { bk: "Leon", who: "current", amount: 50000, pre: "до", title: "Фрибеты за выигранные ставки на теннис",
    until: "2026-12-31", unverified: true },

  // ---------- завершённые (для блока внизу) ----------
  { bk: "PARI", who: "current", amount: 5000, pre: "до", title: "Колесо фортуны за ставки на баскетбол на 5 000 ₽ за день",
    minOdds: "от 1.70", until: "2026-10-25", unverified: true },
];

// Букмекеры: название (как в акциях) → адрес страницы на сайте и официальный домен
const BOOKMAKERS = [
  { name: "Fonbet",      slug: "fonbet",      domain: "fonbet.ru", aff: "https://rko-group.ru/s/sWriyDNE" },
  { name: "Winline",     slug: "winline",     domain: "winline.ru" },
  { name: "Leon",        slug: "leon",        domain: "leon.ru" },
  { name: "BetBoom",     slug: "betboom",     domain: "betboom.ru" },
  { name: "PARI",        slug: "pari",        domain: "pari.ru", aff: "https://rko-group.ru/s/qJv5ThE5" },
  { name: "Лига Ставок", slug: "ligastavok",  domain: "ligastavok.ru" },
  { name: "Marathonbet", slug: "marathonbet", domain: "marathonbet.ru" },
  { name: "Olimpbet",    slug: "olimpbet",    domain: "olimp.bet" },
  { name: "Melbet",      slug: "melbet",      domain: "melbet.ru" },
  { name: "Zenit",       slug: "zenit",       domain: "zenit.win" },
  { name: "Betcity",     slug: "betcity",     domain: "betcity.ru" },
  { name: "Bettery",     slug: "bettery",     domain: "bettery.ru" },
];
