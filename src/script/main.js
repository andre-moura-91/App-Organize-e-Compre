// Splash screen orchestration (compatible with current HTML/CSS)
document.addEventListener('DOMContentLoaded', () => {
  const splashScreen = document.getElementById('splash-screen');
  const logoV1 = document.getElementById('logo-v1');
  const logoV2 = document.getElementById('logo-v2');
  const formaLogo = document.getElementById('forma');
  const textSection = document.getElementById('text-section');
  const mainContent = document.getElementById('main-content');
  const startBtn = document.getElementById('start-btn');
  const divider = document.querySelector('.divider');
  const marcaDagua = document.getElementById('marca-dagua');

  function startSplash() {
    // Reset states
    splashScreen?.classList.remove('hidden');
    mainContent?.classList.add('hidden');
    logoV1?.classList.add('hidden');
    logoV2?.classList.add('hidden');
    formaLogo?.classList.add('hidden');
    textSection?.classList.add('hidden');
    divider?.classList.remove('active');
    document.body.style.overflow = 'hidden';

    // Step 1: logo 1
    setTimeout(() => {
      formaLogo?.classList.remove('hidden');
      logoV1?.classList.remove('hidden');
    }, 500);

    // Step 2: logo 2
    setTimeout(() => {
      formaLogo?.classList.add('hidden');
      logoV1?.classList.add('hidden');

      logoV2?.classList.remove('logo-card-hidden');
      logoV2?.classList.remove('hidden');
    }, 900);

    // Step 4: Seção de texto, divisor e marca d'água
    setTimeout(() => {
      logoV2?.classList.add('logo-card-hidden');
      logoV2?.classList.add('hidden');

      logoV2?.classList.remove('hidden');
      textSection?.classList.remove('hidden');
      divider?.classList.add('active');
      marcaDagua?.classList.remove('opacity-0');
      marcaDagua?.classList.add('opacity-100');
    }, 2300);
  }

  function completeSplash() {
    splashScreen?.style.setProperty('opacity', '0');
    setTimeout(() => {
      splashScreen?.classList.add('hidden');
      splashScreen?.style.setProperty('opacity', '1');
      mainContent?.classList.remove('hidden');
      document.body.style.overflow = 'auto';
    }, 500);
  }

  // Event Listeners
  startBtn?.addEventListener('click', completeSplash);

  // Initialize
  startSplash();
});