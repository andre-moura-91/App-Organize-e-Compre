import { authRequest } from '../../script/authApi.js';

const toastTimers = new WeakMap();

function goTo(screen) {
    document.querySelectorAll('.screen').forEach((element) => element.classList.remove('active'));
    document.getElementById(`screen-${screen}`)?.classList.add('active');
}

function showToast(message) {
    const activeScreen = document.querySelector('.screen.active');
    const toast = activeScreen?.querySelector('.toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimers.get(toast));
    toastTimers.set(toast, setTimeout(() => toast.classList.remove('show'), 1800));
}

async function loadProfile() {
    const response = await fetch('/api/auth/me', { credentials: 'same-origin', cache: 'no-store' });
    if (!response.ok) throw new Error('Não foi possível carregar os dados da conta.');

    const { user } = await response.json();
    const fullName = `${user.firstName} ${user.lastName}`;
    document.querySelector('.user-name').textContent = fullName;
    document.querySelector('.user-email').textContent = user.email;
    document.getElementById('nome').value = fullName;
    document.getElementById('email').value = user.email;
}

async function logout() {
    const action = document.querySelector('[data-action="sair"]');
    action?.setAttribute('aria-busy', 'true');
    try {
        await authRequest('/logout', {});
        window.location.replace('/src/pages/login/login.html');
    } catch (error) {
        showToast(error.message);
        action?.removeAttribute('aria-busy');
    }
}

function activateAction(element) {
    switch (element.dataset.action) {
        case 'editar':
            goTo('editar');
            break;
        case 'voltar':
            goTo('perfil');
            break;
        case 'mostrar-senha': {
            const input = document.getElementById('senha');
            const show = input.type === 'password';
            input.type = show ? 'text' : 'password';
            element.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
            element.setAttribute('aria-pressed', String(show));
            break;
        }
        case 'sair':
            void logout();
            break;
        case 'salvar':
            showToast('A edição de perfil ainda não está disponível.');
            break;
        case 'seguranca':
            showToast('A alteração de senha ainda não está disponível.');
            break;
        case 'configuracoes':
            showToast('As configurações ainda não estão disponíveis.');
            break;
        case 'tema':
            showToast('A seleção de tema ainda não está disponível.');
            break;
        case 'notificacoes':
            showToast('As notificações ainda não estão disponíveis.');
            break;
        case 'deletar':
            showToast('A exclusão de conta ainda não está disponível.');
            break;
        case 'feedback':
            showToast('O envio de feedback ainda não está disponível.');
            break;
        case 'ajuda':
            showToast('O suporte ainda não está disponível.');
            break;
        case 'foto':
            showToast('A alteração de foto ainda não está disponível.');
            break;
    }
}

document.querySelectorAll('[data-action]').forEach((element) => {
    element.addEventListener('click', () => activateAction(element));
    if (element.getAttribute('role') === 'button') {
        element.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                activateAction(element);
            }
        });
    }
});

loadProfile().catch((error) => showToast(error.message));
