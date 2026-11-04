// Recuperar dados do usuário do localStorage
const nomeGuardado = localStorage.getItem('nome');

// Se não houver usuário logado, redirecionar para login
if (!nomeGuardado) {
    window.location.href = '/src/pages/login/login.html';
}

const bemVindo = document.getElementById('bem-vindo');
const nomeUsuario = document.createElement('span');
nomeUsuario.textContent = nomeGuardado;

bemVindo.appendChild(nomeUsuario);

const btnComecar = document.getElementById('start-btn');

function comecarLista() {
    window.location.href = '/src/pages/lista/lista.html';
}

btnComecar.addEventListener('click', comecarLista);