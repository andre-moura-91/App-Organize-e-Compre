
const nome = document.getElementById('text-nome'); 
const senha = document.getElementById('text-password');
const btnEntrar = document.getElementById('btn-entrar');
const passwordLine = document.getElementById('password-line');
const passwordOffline = document.getElementById('password-offline');
const esqueciSenha = document.getElementById('esqueci-senha');

passwordOffline.style.display = 'none';

let textPassword = {
    'text': (el) => {el.setAttribute('type', 'password')},
    'password': (el) => {el.setAttribute('type', 'text')},
}

passwordLine.addEventListener('click', function() {
    textPassword[senha.type](senha);
    passwordLine.style.display = 'none';
    passwordOffline.style.display = 'block';
});

passwordOffline.addEventListener('click', function() {
    textPassword[senha.type](senha);
    passwordOffline.style.display = 'none';
    passwordLine.style.display = 'block';
});

function entrar(event) {
    event.preventDefault();

    const nomeInput = nome.value.trim();
    const senhaInput = senha.value.trim();

    if (nomeInput === '' || senhaInput === '') {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Guardar dados antes de navegar
    localStorage.setItem('nome', nomeInput);
    localStorage.setItem('senha', senhaInput);

    alert('Login realizado com sucesso!');
    window.location.href = '/src/pages/bem-vindo/saudacao.html';
}

esqueciSenha.addEventListener('click', function() {
    window.location.href = '/src/pages/password/redefinir-senha.html';
});

btnEntrar.addEventListener('click', entrar);