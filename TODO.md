# TODO — Integrar onboarding-1 ao projeto

- [x] Ajustar `src/pages/onboarding/onboarding-1.html` para conter os IDs esperados pelo JS (`watermark`, `stepLabel`, `illustration`).
- [x] Atualizar `src/pages/onboarding/onboarding-1.js` para:
  - [x] remover dependência de IDs inexistentes (evitar `null`)
  - [x] trocar `onclick` inline por listeners no `DOMContentLoaded`
  - [x] no `finish()`: salvar flag no `localStorage` e redirecionar para `src/pages/bem-vindo/saudacao.html`
- [ ] (Se necessário) Verificar se existe ponto de entrada único do app que deve respeitar a flag `onboardingDone`.
- [ ] Testar fluxo no browser:
  - [ ] onboarding aparece quando `localStorage.onboardingDone` não está definido
  - [ ] onboarding não aparece após concluir
  - [ ] botão “Pular” também conclui e redireciona

