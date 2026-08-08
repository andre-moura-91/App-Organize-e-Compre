const steps = [
  {
    word: "ORGANIZE",
    title: "Organize",
    accent: "suas compras",
    subtitle: "Monte listas com praticidade, planeje e economize tempo no dia a dia.",
    icon: `<img src="/src/assets/imagens/onboarding 1.svg" alt="Ilustração de uma lista de compras com itens organizados">`
  },
  {
    word: "PRÉ-LISTA",
    title: "Crie sua",
    accent: "pré-lista",
    subtitle: "Anote produtos com antecedência e deixe sua ida ao mercado muito mais rápida.",
    icon: `<svg viewBox="0 0 100 100" fill="none"><rect x="24" y="16" width="52" height="68" rx="8" fill="#fff" stroke="#FF8A1E" stroke-width="4"/><line x1="34" y1="34" x2="66" y2="34" stroke="#E86F00" stroke-width="3" stroke-linecap="round"/><line x1="34" y1="46" x2="66" y2="46" stroke="#E7D9C7" stroke-width="3" stroke-linecap="round"/><line x1="34" y1="58" x2="58" y2="58" stroke="#E7D9C7" stroke-width="3" stroke-linecap="round"/><circle cx="30" cy="34" r="4" fill="#7BC47F"/><circle cx="30" cy="46" r="4" fill="#7BC47F"/><rect x="58" y="66" width="20" height="18" rx="4" fill="#FF8A1E"/></svg>`
  },
  {
    word: "CARRINHO",
    title: "Controle",
    accent: "o carrinho",
    subtitle: "Adicione itens, ajuste quantidades e acompanhe tudo em uma lista simples e inteligente.",
    icon: `<svg viewBox="0 0 100 100" fill="none"><rect x="30" y="14" width="40" height="56" rx="10" fill="#fff" stroke="#FF8A1E" stroke-width="4"/><rect x="38" y="24" width="24" height="18" rx="4" fill="#FF8A1E"/><circle cx="42" cy="56" r="3" fill="#E7D9C7"/><circle cx="50" cy="56" r="3" fill="#7BC47F"/><circle cx="58" cy="56" r="3" fill="#7BC47F"/><path d="M28 78h44l4-12H24z" fill="#FFB868"/><circle cx="36" cy="84" r="4" fill="#E86F00"/><circle cx="60" cy="84" r="4" fill="#E86F00"/></svg>`
  },
  {
    word: "GASTOS",
    title: "Acompanhe",
    accent: "seus gastos",
    subtitle: "Veja seu histórico, planeje melhor suas compras e economize com mais clareza.",
    icon: `<svg viewBox="0 0 100 100" fill="none"><rect x="26" y="20" width="34" height="60" rx="8" fill="#fff" stroke="#FF8A1E" stroke-width="4"/><rect x="34" y="44" width="4" height="20" fill="#FFB868"/><rect x="42" y="36" width="4" height="28" fill="#FF8A1E"/><rect x="50" y="50" width="4" height="14" fill="#7BC47F"/><circle cx="70" cy="30" r="12" fill="#7BC47F"/><path d="M65 30l4 4 8-8" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`
  }
];

let current = 0;

function safeEl(id) {
  return document.getElementById(id);
}

function renderDots(dotsEl, activeIndex) {
  if (!dotsEl) return;
  dotsEl.innerHTML = steps
    .map((_, i) => `<i class="${i === activeIndex ? "active" : ""}"></i>`)
    .join("");
}

function render() {
  const els = {
    watermark: safeEl("watermark"),
    stepLabel: safeEl("stepLabel"),
    illustration: safeEl("illustration"),
    title: safeEl("title"),
    subtitle: safeEl("subtitle"),
    dots: safeEl("dots"),
    ctaLabel: safeEl("ctaLabel"),
    card: safeEl("card")
  };

  const s = steps[current];
  if (!s) return;

  if (els.watermark) els.watermark.textContent = s.word;
  if (els.stepLabel) els.stepLabel.textContent = `Onboarding · Passo ${current + 1}`;

  if (els.illustration) {
    els.illustration.innerHTML =
      s.icon +
      `<div class="badge"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></div>`;
  }

  if (els.title) els.title.innerHTML = `${s.title}<span class="accent">${s.accent}</span>`;
  if (els.subtitle) els.subtitle.textContent = s.subtitle;
  if (els.ctaLabel)
    els.ctaLabel.textContent = current === steps.length - 1 ? "Começar" : "Próximo";

  renderDots(els.dots, current);
}

function transition(callback) {
  const card = safeEl("card");
  if (!card) {
    callback();
    return;
  }

  card.classList.add("fade-out");
  setTimeout(() => {
    callback();
    card.classList.remove("fade-out");
    card.classList.add("fade-in");
    requestAnimationFrame(() => {
      card.classList.remove("fade-in");
    });
  }, 220);
}

function finish() {
  try {
    localStorage.setItem("onboardingDone", "1");
  } catch (_) {}

  const card = safeEl("card");
  if (card) {
    card.style.transition = "opacity .4s ease, transform .4s ease";
    card.style.opacity = "0";
    card.style.transform = "scale(.92)";
  }

  setTimeout(() => {
    window.location.href = "/src/pages/bem-vindo/saudacao.html";
  }, 350);
}

document.addEventListener("DOMContentLoaded", () => {
  const ctaBtn = safeEl("ctaBtn");
  const skipBtn = safeEl("skipBtn");

  if (ctaBtn) {
    ctaBtn.addEventListener("click", () => {
      if (current < steps.length - 1) {
        transition(() => {
          current++;
          render();
        });
      } else {
        finish();
      }
    });
  }

  if (skipBtn) {
    skipBtn.addEventListener("click", finish);
  }

  render();
});

