const scenarioData = {
  biodiversity: {
    text: "Delft is reworked around biodiversity. Rooftops, courtyards and streets use layered planting, pollinator corridors and water systems to create a city that feels alive all year.",
    biodiversity: 76,
    co2: "-14%",
    species: 118
  },
  forest: {
    text: "AI systems care for the forest edge, adjusting irrigation, pest monitoring and species movement predictions. People can watch a living system respond without losing the wild character of the place.",
    biodiversity: 82,
    co2: "-21%",
    species: 134
  },
  return: {
    text: "An extinct species returns to a carefully designed habitat. The public sees a difficult conversation become visible: what counts as restoration, what is feasible and what risks still remain.",
    biodiversity: 70,
    co2: "-9%",
    species: 96
  },
  "without-borders": {
    text: "The garden extends beyond its walls. School programmes, city ecologies and international research partnerships create a living network that blurs the line between the Hortus and the broader city.",
    biodiversity: 88,
    co2: "-16%",
    species: 142
  }
};

const translations = {
  en: {
    "nav.discover": "Discover",
    "nav.research": "Research",
    "nav.exhibitions": "Exhibitions",
    "nav.experiences": "Experiences",
    "nav.agenda": "Agenda",
    "nav.partners": "Partners",
    "nav.support": "Support",
    "nav.visit": "Plan your visit",
    "nav.language": "EN",
    "nav.contrast": "High contrast",
    "hero.eyebrow": "The Green Heart of Technology",
    "hero.title": "The Green Heart of Technology",
    "hero.subtitle": "From plant to technology: let yourself be surprised.",
    "hero.open": "Open 365 days a year.",
    "hero.plan": "Plan your visit",
    "hero.agenda": "See the agenda",
    "quick.title": "Quick links",
    "quick.visit": "Plan your visit",
    "quick.agenda": "Agenda",
    "quick.directions": "Directions",
    "quick.tours": "Guided tours",
    "quick.rental": "Venue rental",
    "today.title": "Today in the Hortus",
    "today.hours": "Opening hours today",
    "today.sensor": "Greenhouse 2: 24°C, 71% humidity, 38 species of pollinators logged this morning.",
    "notice.open": "Open all year round, in every season.",
    "notice.link": "Plan your visit",
    "discover.kicker": "Heritage and future",
    "discover.title": "From 2026 to 2050, the Hortus becomes the Green Heart of Technology.",
    "timeline.title": "From the history garden to the living lab",
    "zones.title": "Garden zones",
    "open.kicker": "Open all year round",
    "open.title": "Every day of the year, with a winter programme and an active summer schedule.",
    "research.kicker": "Research",
    "research.title": "The bridge between technology and biodiversity.",
    "agenda.search": "Search"
  },
  nl: {
    "nav.discover": "Ontdek",
    "nav.research": "Onderzoek",
    "nav.exhibitions": "Tentoonstellingen",
    "nav.experiences": "Ervaringen",
    "nav.agenda": "Agenda",
    "nav.partners": "Partners",
    "nav.support": "Steun ons",
    "nav.visit": "Plan uw bezoek",
    "nav.language": "NL",
    "nav.contrast": "Hoog contrast",
    "hero.eyebrow": "The Green Heart of Technology",
    "hero.title": "The Green Heart of Technology",
    "hero.subtitle": "Van plant naar technologie: laat je verrassen.",
    "hero.open": "Open 365 dagen per jaar.",
    "hero.plan": "Plan uw bezoek",
    "hero.agenda": "Bekijk de agenda",
    "quick.title": "Snelle links",
    "quick.visit": "Plan uw bezoek",
    "quick.agenda": "Agenda",
    "quick.directions": "Route",
    "quick.tours": "Geleide rondleidingen",
    "quick.rental": "Locatieverhuur",
    "today.title": "Vandaag in de Hortus",
    "today.hours": "Openingstijden vandaag",
    "today.sensor": "Kas 2: 24°C, 71% luchtvochtigheid, 38 soorten bestuivers gemeld vanmorgen.",
    "notice.open": "Het hele jaar open, in elk seizoen.",
    "notice.link": "Plan uw bezoek",
    "discover.kicker": "Erfgoed en toekomst",
    "discover.title": "Van 2026 tot 2050 wordt de Hortus het Green Heart of Technology.",
    "timeline.title": "Van historische tuin naar living lab",
    "zones.title": "Tuinzones",
    "open.kicker": "Het hele jaar open",
    "open.title": "Elke dag van het jaar, met winterprogramma en een actief zomerprogramma.",
    "research.kicker": "Onderzoek",
    "research.title": "De brug tussen technologie en biodiversiteit.",
    "agenda.search": "Zoeken"
  }
};

// IMAGES is defined in images.js (loaded before this file).
const state = {
  lang: localStorage.getItem("hortus-lang") || "en",
  contrast: localStorage.getItem("hortus-contrast") === "true"
};

function applyImageBindings() {
  document.querySelectorAll("[data-img]").forEach((element) => {
    const key = element.getAttribute("data-img");
    const image = IMAGES[key] || {
      src: "",
      alt: `${key}: placeholder for missing image`
    };

    if (!image.src || !image.src.trim()) {
      const subject = key.replace(/_/g, " ");
      const svg = `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'>
          <rect width='800' height='600' fill='#dfe4e8'/>
          <rect x='30' y='30' width='740' height='540' fill='#dfe4e8' stroke='#aab5bf' stroke-width='2'/>
          <text x='400' y='290' text-anchor='middle' font-family='Arial' font-size='28' fill='#1f2a37'>${key}</text>
          <text x='400' y='330' text-anchor='middle' font-family='Arial' font-size='18' fill='#1f2a37'>${subject}</text>
        </svg>
      `)}`;
      element.setAttribute("src", svg);
      element.setAttribute("alt", `${key}: ${subject}`);
      return;
    }

    element.setAttribute("src", image.src);
    element.setAttribute("alt", image.alt || key);

    element.onerror = () => {
      const subject = key.replace(/_/g, " ");
      const svg = `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'>
          <rect width='800' height='600' fill='#dfe4e8'/>
          <rect x='30' y='30' width='740' height='540' fill='#dfe4e8' stroke='#aab5bf' stroke-width='2'/>
          <text x='400' y='290' text-anchor='middle' font-family='Arial' font-size='28' fill='#1f2a37'>${key}</text>
          <text x='400' y='330' text-anchor='middle' font-family='Arial' font-size='18' fill='#1f2a37'>${subject}</text>
        </svg>
      `)}`;
      element.setAttribute("src", svg);
      element.setAttribute("alt", `${key}: ${subject}`);
    };
  });
}

function translatePage() {
  const dict = translations[state.lang] || translations.en;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (dict[key]) {
      node.textContent = dict[key];
    }
  });

  document.documentElement.lang = state.lang;
  const navLang = document.querySelector(".nav-lang");
  if (navLang) navLang.textContent = state.lang === "en" ? "EN" : "NL";
}

function applyContrast() {
  document.body.classList.toggle("high-contrast", state.contrast);
  localStorage.setItem("hortus-contrast", String(state.contrast));
}

function setLanguage(nextLang) {
  state.lang = nextLang;
  localStorage.setItem("hortus-lang", nextLang);
  translatePage();
}

function setupLanguageToggle() {
  const toggle = document.querySelector("[data-lang-toggle]");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const nextLang = state.lang === "en" ? "nl" : "en";
      setLanguage(nextLang);
      toggle.textContent = nextLang === "en" ? "NL" : "EN";
    });
  }
}

function setupContrastToggle() {
  const toggle = document.querySelector("[data-contrast-toggle]");
  if (toggle) {
    toggle.addEventListener("click", () => {
      state.contrast = !state.contrast;
      applyContrast();
      toggle.textContent = state.contrast ? "Standard contrast" : "High contrast";
    });
  }
}

function setupMenu() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("is-open");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupScenarioTool() {
  const buttons = document.querySelectorAll(".scenario-button");
  const story = document.querySelector("[data-scenario-text]");
  const biodiv = document.querySelector("[data-metric='biodiversity']");
  const co2 = document.querySelector("[data-metric='co2']");
  const species = document.querySelector("[data-metric='species']");

  if (!story || !biodiv || !co2 || !species) return;

  const update = (key) => {
    const data = scenarioData[key];
    if (!data) return;
    story.textContent = data.text;
    biodiv.textContent = data.biodiversity;
    co2.textContent = data.co2;
    species.textContent = data.species;
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("is-active"));
      button.classList.add("is-active");
      update(button.dataset.scenario);
    });
  });
}

function setupReservationButtons() {
  const buttons = document.querySelectorAll(".reserve-button");
  const storageKey = "hortus-reservations";

  buttons.forEach((button) => {
    const reservationName = button.dataset.reserve;
    const status = button.parentElement.querySelector(".reserve-status");
    const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");

    if (existing.includes(reservationName)) {
      button.textContent = "Reserved";
      if (status) status.textContent = "Saved to your visit plan";
    }

    button.addEventListener("click", () => {
      const list = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (!list.includes(reservationName)) {
        list.push(reservationName);
        localStorage.setItem(storageKey, JSON.stringify(list));
      }
      button.textContent = "Reserved";
      if (status) status.textContent = "Saved to your visit plan";
    });
  });
}

const eventData = [
  { date: "2050-01-01", title: "New Year's Day opening walk", type: "Family", partner: "Hortus team", description: "Start the year outdoors with a slow walk through the heritage garden and the living lab greenhouses.", who: "Families and first-time visitors", price: "Free with entry", month: "January" },
  { date: "2050-02-08", title: "Seed collecting exhibition preview", type: "Exhibition opening", partner: "Heritage Garden Group", description: "A public preview of the seed archive, tracing the older collection and the species that must be protected next.", who: "General public", price: "Included", month: "February" },
  { date: "2050-03-14", title: "Citizen science bioblitz", type: "Workshop", partner: "Hidden Hortus", description: "Join a guided biodiversity count across the garden and record the species you see in the city edge habitat.", who: "Students and families", price: "€8", month: "March" },
  { date: "2050-04-10", title: "School class day", type: "Family", partner: "Delft schools", description: "A day of hands-on learning about biodiversity, climate adaptation and future plant care.", who: "School groups", price: "€6 per pupil", month: "April" },
  { date: "2050-05-02", title: "Outdoor drawing in the Herbarium Lane", type: "Workshop", partner: "Hortus Studio", description: "Draw the garden with a slow observational practice that connects art, climate cues and plant detail.", who: "Adults and teens", price: "€12", month: "May" },
  { date: "2050-05-24", title: "Hortus Plants & Art Fair", type: "Festival", partner: "City partners", description: "A public festival of plant culture, art and climate design, with species exchange and demonstrations.", who: "All visitors", price: "Free", month: "May" },
  { date: "2050-06-01", title: "Atmospheric Bonsai weekend", type: "Workshop", partner: "Bonsai circle", description: "A weekend about miniature trees, species care and climate-sensitive growing in the new urban courtyard.", who: "Garden enthusiasts", price: "€18", month: "June" },
  { date: "2050-06-19", title: "Faculty exhibition opening night", type: "Exhibition opening", partner: "ABE + IDE", description: "The season opens with a public night of architecture, living materials and urban ecologies.", who: "General public", price: "Free", month: "June" },
  { date: "2050-07-09", title: "Synthetic biology open lab day", type: "Live demo", partner: "Applied Sciences", description: "Visitors can observe the public lab window, ask questions and see algae and microbial systems in action.", who: "General public", price: "Included", month: "July" },
  { date: "2050-08-15", title: "Pasar Botanica tropical weekend", type: "Festival", partner: "Delft neighbourhood partners", description: "A respectful remembrance and celebration of plant diversity, food culture and the tropical collections.", who: "All visitors", price: "Free", month: "August" },
  { date: "2050-09-11", title: "International partner symposium", type: "Partner event", partner: "Global Hortus network", description: "Researchers and city partners share lessons on biodiversity, AI and climate adaptation across regions.", who: "Policy and research audiences", price: "€15", month: "September" },
  { date: "2050-09-27", title: "Botanical colour and embroidery weekend", type: "Workshop", partner: "Hortus textiles lab", description: "Create plant-inspired patterns while learning how colour and materials relate to the living garden.", who: "Adults and teens", price: "€14", month: "September" },
  { date: "2050-10-04", title: "Groei & Bloei plant exchange", type: "Family", partner: "City growers", description: "Swap healthy plants and share propagation tips in a practical neighbourhood exchange session.", who: "Residents and growers", price: "Free", month: "October" },
  { date: "2050-10-23", title: "De-extinction ethics debate", type: "Lecture", partner: "TPM + EEMCS", description: "A public debate on ecological risk, public trust and long-term obligations for bringing species back.", who: "Adults and students", price: "€10", month: "October" },
  { date: "2050-11-15", title: "Winter light programme opening", type: "Exhibition opening", partner: "City light lab", description: "The winter season opens with a low-light walk that highlights climate stories, species signals and the architecture of the garden.", who: "All visitors", price: "Included", month: "November" },
  { date: "2050-12-10", title: "Night of the Green Heart", type: "Festival", partner: "All faculties", description: "A glowing public evening with installations, sound loops and a misty walk through the winter garden.", who: "All visitors", price: "€12", month: "December" },
  { date: "2050-12-18", title: "Winter greenhouse workshop", type: "Workshop", partner: "Living Lab team", description: "Learn how climate-resilient species are being grown, monitored and adapted in winter conditions.", who: "Adults and families", price: "€9", month: "December" }
];

function formatWeekday(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  const options = { weekday: "long" };
  return new Intl.DateTimeFormat("en-GB", options).format(date);
}

function renderAgenda() {
  const list = document.getElementById("agenda-list");
  const search = document.getElementById("agenda-search");
  const activeFilter = document.querySelector(".agenda-filter.is-active")?.dataset.agendaFilter || "all";
  const query = search ? search.value.trim().toLowerCase() : "";

  if (!list) return;

  const filtered = eventData.filter((event) => {
    const matchesFilter = activeFilter === "all" || event.type === activeFilter;
    const haystack = `${event.title} ${event.description} ${event.partner}`.toLowerCase();
    const matchesSearch = !query || haystack.includes(query);
    return matchesFilter && matchesSearch;
  });

  if (!filtered.length) {
    list.innerHTML = '<div class="no-results">No events match your search or filter.</div>';
    return;
  }

  list.innerHTML = filtered.map((event) => {
    const day = new Date(`${event.date}T12:00:00`).getDate();
    const weekday = formatWeekday(event.date);
    return `
      <article class="agenda-item">
        <div class="date-box">
          <strong>${day}</strong>
          <span>${weekDayShort(weekday)}</span>
        </div>
        <div>
          <h3>${event.title}</h3>
          <div class="meta-row">
            <span>${weekday}</span>
            <span>${event.month}</span>
            <span>${event.partner}</span>
          </div>
          <p>${event.description}</p>
        </div>
        <div class="tag">${event.type}</div>
      </article>
    `;
  }).join("");
}

function weekDayShort(day) {
  return day.slice(0, 3);
}

function setupAgendaFilters() {
  const buttons = document.querySelectorAll(".agenda-filter");
  const search = document.getElementById("agenda-search");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("is-active"));
      button.classList.add("is-active");
      renderAgenda();
    });
  });

  if (search) {
    search.addEventListener("input", renderAgenda);
  }
}

function setupExhibitionFilters() {
  const buttons = document.querySelectorAll("[data-theme-filter]");
  const cards = document.querySelectorAll(".exhibition-card");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("is-active"));
      button.classList.add("is-active");
      const filter = button.dataset.themeFilter;
      cards.forEach((card) => {
        const visible = filter === "all" || card.dataset.theme === filter;
        card.style.display = visible ? "flex" : "none";
      });
    });
  });
}

function setupDonationButtons() {
  const buttons = document.querySelectorAll(".amount-button");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("is-selected"));
      button.classList.add("is-selected");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyContrast();
  translatePage();
  setupLanguageToggle();
  setupContrastToggle();
  setupMenu();
  setupScenarioTool();
  setupReservationButtons();
  setupAgendaFilters();
  renderAgenda();
  setupExhibitionFilters();
  setupDonationButtons();
  applyImageBindings();

  const toggle = document.querySelector("[data-lang-toggle]");
  if (toggle) toggle.textContent = state.lang === "en" ? "NL" : "EN";

  const contrastToggle = document.querySelector("[data-contrast-toggle]");
  if (contrastToggle) {
    contrastToggle.textContent = state.contrast ? "Standard contrast" : "High contrast";
  }
});
