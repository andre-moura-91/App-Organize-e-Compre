export async function authRequest(path, body) {
    const csrfResponse = await fetch('/api/auth/csrf', { credentials: 'same-origin' });
    const csrfData = await csrfResponse.json();
    if (!csrfResponse.ok) throw new Error(csrfData.error ?? 'Não foi possível iniciar a sessão.');

    const response = await fetch(`/api/auth${path}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfData.csrfToken
        },
        body: JSON.stringify(body)
    });
    const data = response.status === 204 ? {} : await response.json();
    if (!response.ok) throw new Error(data.error ?? 'Não foi possível concluir a solicitação.');
    return data;
}

export function removeLegacyCredentials() {
    try {
        for (const key of ['senha', 'senhaCadastro', 'confirmeSenha']) {
            localStorage.removeItem(key);
        }
    } catch (error) {
        console.error('Não foi possível limpar credenciais antigas do navegador.', error);
    }
}
