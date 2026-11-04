const loginPath = '/src/pages/login/login.html';

async function verifySession() {
    try {
        const response = await fetch('/api/auth/me', { credentials: 'same-origin', cache: 'no-store' });
        if (response.status === 401) {
            window.location.replace(loginPath);
        } else if (!response.ok) {
            throw new Error('Não foi possível validar sua sessão.');
        }
    } catch (error) {
        const message = document.createElement('main');
        message.setAttribute('role', 'alert');
        message.textContent = `${error.message} Verifique se o serviço está disponível e atualize a página.`;
        document.body.replaceChildren(message);
    }
}

void verifySession();
