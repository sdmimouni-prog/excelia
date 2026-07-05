const formatDh = (value) => `${Math.round(value).toLocaleString("fr-FR")} DH`;

const closeDropdowns = (except = null) => {
  document.querySelectorAll("[data-dropdown]").forEach((dropdown) => {
    if (dropdown !== except) {
      dropdown.classList.remove("open");
      dropdown.querySelector("[data-dropdown-button]")?.setAttribute("aria-expanded", "false");
    }
  });
};

document.querySelectorAll("[data-dropdown]").forEach((dropdown) => {
  const button = dropdown.querySelector("[data-dropdown-button]");
  const value = dropdown.querySelector("[data-dropdown-value]");
  const options = dropdown.querySelectorAll("[data-dropdown-menu] button");

  const syncSelectedOption = () => {
    options.forEach((option) => {
      option.classList.toggle("is-selected", option.textContent.trim() === value?.textContent.trim());
    });
  };

  button?.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = !dropdown.classList.contains("open");
    closeDropdowns(dropdown);
    dropdown.classList.toggle("open", willOpen);
    button.setAttribute("aria-expanded", String(willOpen));
  });

  dropdown.addEventListener("click", (event) => {
    if (event.target.closest("[data-dropdown-menu]") || event.target.closest("[data-dropdown-button]")) return;

    const willOpen = !dropdown.classList.contains("open");
    closeDropdowns(dropdown);
    dropdown.classList.toggle("open", willOpen);
    button?.setAttribute("aria-expanded", String(willOpen));
  });

  options.forEach((option) => {
    option.addEventListener("click", () => {
      if (value) value.textContent = option.textContent.trim();
      syncSelectedOption();
      dropdown.classList.remove("open");
      button?.setAttribute("aria-expanded", "false");
    });
  });

  syncSelectedOption();
});

document.addEventListener("click", () => closeDropdowns());

document.querySelector(".search-panel")?.addEventListener("submit", (event) => {
  event.preventDefault();
});

const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");

menuToggle?.addEventListener("click", () => {
  const isOpen = mobileMenu?.classList.toggle("open") ?? false;
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const tabs = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll(".project-card");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const filter = tab.dataset.filter;
    tabs.forEach((item) => item.classList.toggle("active", item === tab));

    projectCards.forEach((card) => {
      const visible = filter === "all" || card.dataset.city === filter;
      card.classList.toggle("is-hidden", !visible);
    });

    document.querySelector("[data-project-track]")?.scrollTo({ left: 0, behavior: "smooth" });
  });
});

document.querySelector("[data-slider-next]")?.addEventListener("click", () => {
  const track = document.querySelector("[data-project-track]");
  if (!track) return;

  const card = track.querySelector(".project-card:not(.is-hidden)");
  const amount = card ? card.getBoundingClientRect().width + 18 : 260;
  const maxScroll = track.scrollWidth - track.clientWidth;
  const atEnd = track.scrollLeft >= maxScroll - 8;
  const nextLeft = Math.min(track.scrollLeft + amount * 2, maxScroll);

  track.scrollTo({
    left: atEnd ? 0 : nextLeft,
    behavior: "smooth",
  });
});

const amountInput = document.querySelector("[data-amount]");
const downInput = document.querySelector("[data-down]");
const yearsInput = document.querySelector("[data-years]");
const rateInput = document.querySelector("[data-rate]");

const labels = {
  amount: document.querySelector("[data-amount-label]"),
  down: document.querySelector("[data-down-label]"),
  years: document.querySelector("[data-years-label]"),
  rate: document.querySelector("[data-rate-label]"),
  monthly: document.querySelector("[data-monthly]"),
  phoneAmount: document.querySelector("[data-phone-amount]"),
  phoneDown: document.querySelector("[data-phone-down]"),
  phoneYears: document.querySelector("[data-phone-years]"),
  phoneRate: document.querySelector("[data-phone-rate]"),
  phoneMonthly: document.querySelector("[data-phone-monthly]"),
};

const calculateMonthly = () => {
  if (!amountInput || !downInput || !yearsInput || !rateInput) return;

  const amount = Number(amountInput.value);
  const down = Math.min(Number(downInput.value), amount - 10000);
  const years = Number(yearsInput.value);
  const rate = Number(rateInput.value);
  const principal = Math.max(amount - down, 10000);
  const months = years * 12;
  const monthlyRate = rate / 100 / 12;
  const basePayment =
    monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  const insuranceFactor = 1.1033;
  const monthly = basePayment * insuranceFactor;
  const rateLabel = `${rate.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;

  labels.amount.textContent = formatDh(amount);
  labels.down.textContent = formatDh(down);
  labels.years.textContent = `${years} ans`;
  labels.rate.textContent = rateLabel;
  labels.monthly.textContent = `${formatDh(monthly)} / mois`;
  labels.phoneAmount.textContent = formatDh(amount);
  labels.phoneDown.textContent = formatDh(down);
  labels.phoneYears.textContent = `${years} ans`;
  labels.phoneRate.textContent = rateLabel;
  labels.phoneMonthly.textContent = `${formatDh(monthly)} / mois`;
};

[amountInput, downInput, yearsInput, rateInput].forEach((input) => {
  input?.addEventListener("input", calculateMonthly);
});

calculateMonthly();
