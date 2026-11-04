const welcome = document.getElementById('bem-vindo');
const startButton = document.getElementById('start-btn');

async function loadWelcome() {
    const response = await fetch('/api/auth/me', { credentials: 'same-origin', cache: 'no-store' });
    if (response.status === 401) {
        window.location.replace('/src/pages/login/login.html');
    } else if (!response.ok) {
        throw new Error('Não foi possível carregar sua conta.');
    } else {
        const { user } = await response.json();
        welcome.append(document.createTextNode(`${user.firstName} ${user.lastName}`));
    }
}

startButton.addEventListener('click', () => {
    window.location.href = '/src/pages/lista/lista.html';
});

loadWelcome().catch((error) => {
    welcome.textContent = error.message;
});