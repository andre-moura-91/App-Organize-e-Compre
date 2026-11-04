import { authRequest, removeLegacyCredentials } from '../../script/authApi.js';

const form = document.getElementById('login-form');
const email = document.getElementById('login-email');
const password = document.getElementById('text-password');
const passwordToggle = document.getElementById('toggle-password');
const forgotPassword = document.getElementById('esqueci-senha');
const submitButton = document.getElementById('btn-entrar');
const message = document.getElementById('form-message');

removeLegacyCredentials();

passwordToggle.addEventListener('click', () => {
    const show = password.type === 'password';
    password.type = show ? 'text' : 'password';
    passwordToggle.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
    passwordToggle.setAttribute('aria-pressed', String(show));
});

forgotPassword.addEventListener('click', () => {
    message.textContent = 'A recuperação de senha por e-mail ainda não está configurada. Entre em contato com o suporte.';
});

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    message.textContent = '';
    submitButton.disabled = true;

    try {
        await authRequest('/login', { email: email.value, password: password.value });
        window.location.href = '/src/pages/onboarding/onboarding-1.html';
    } catch (error) {
        message.textContent = error.message;
    } finally {
        submitButton.disabled = false;
    }
});
