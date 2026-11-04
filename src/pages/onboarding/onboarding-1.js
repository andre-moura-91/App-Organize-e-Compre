const steps = [
  {
    title: "Organize",
    accent: "suas compras",
    subtitle: "Monte listas com praticidade, planeje e economize tempo no dia a dia.",
    icon: `<img src="/src/assets/imagens/img onboarding 1.png" alt="Ilustração de uma lista de compras com itens organizados">`
  },
  {
    title: "Crie sua",
    accent: "pré-lista",
    subtitle: "Anote produtos com antecedência e deixe sua ida ao mercado muito mais rápida.",
    icon: `<img src="/src/assets/imagens/img onboarding 2.png" alt="Ilustração de uma pré-lista de compras com itens anotados">`
  },
  {
    title: "Controle",
    accent: "o carrinho",
    subtitle: "Adicione itens, ajuste quantidades e acompanhe tudo em uma lista simples e inteligente.",
    icon: `<img src="/src/assets/imagens/img onboarding 3.png" alt="Ilustração de um carrinho de compras com itens adicionados">`
  },
  {
    title: "Acompanhe",
    accent: "seus gastos",
    subtitle: "Veja seu histórico, planeje melhor suas compras e economize com mais clareza.",
    icon: `<img src="/src/assets/imagens/img onboarding 4.png" alt="Ilustração de um gráfico de gastos">`
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
    illustration: document.getElementById("illustration"),
    title: document.getElementById("title"),
    subtitle: document.getElementById("subtitle"),
    dots: document.getElementById("dots"),
    ctaLabel: document.getElementById("ctaLabel"),
    card: document.getElementById("card")
  };

  const s = steps[current];
  if (!s) return;

  if (els.watermark) els.watermark.textContent = s.word;

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

