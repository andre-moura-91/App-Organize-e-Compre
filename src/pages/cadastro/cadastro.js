import { authRequest, removeLegacyCredentials } from '../../script/authApi.js';

const form = document.getElementById('register-form');
const firstName = document.getElementById('text-nome');
const lastName = document.getElementById('text-sobrenome');
const email = document.getElementById('text-email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
const passwordToggle = document.getElementById('password-mostrar');
const submitButton = document.getElementById('btn-cadastro');
const message = document.getElementById('form-message');

removeLegacyCredentials();

passwordToggle.addEventListener('click', () => {
    const show = password.type === 'password';
    password.type = show ? 'text' : 'password';
    confirmPassword.type = show ? 'text' : 'password';
    passwordToggle.textContent = show ? 'Ocultar senhas' : 'Mostrar senhas';
    passwordToggle.setAttribute('aria-pressed', String(show));
});

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    message.textContent = '';

    if (password.value !== confirmPassword.value) {
        message.textContent = 'As senhas não coincidem.';
        return;
    }

    submitButton.disabled = true;
    try {
        await authRequest('/register', {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            password: password.value
        });
        window.location.href = '/src/pages/onboarding/onboarding-1.html';
    } catch (error) {
        message.textContent = error.message;
    } finally {
        submitButton.disabled = false;
    }
});
