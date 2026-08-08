const nome = document.getElementById('text-nome');
const sobrenome = document.getElementById('text-sobrenome');
const email = document.getElementById('text-email');
const btnCadastro = document.getElementById('btn-cadastro');

const senhaCadastro = document.getElementById('password');
const confirmeSenha = document.getElementById('confirm-password');
const mostrarSenha = document.getElementById('password-mostrar');

let textPassword = {
    'text': (el) => {el.setAttribute('type', 'password')},
    'password': (el) => {el.setAttribute('type', 'text')},
}

mostrarSenha.addEventListener('click', () => { 
    textPassword[senhaCadastro.type](senhaCadastro);
    textPassword[confirmeSenha.type](confirmeSenha);
});


function cadastro(event) {
    event.preventDefault();

    const nomeInput = nome.value.trim();
    const sobrenomeInput = sobrenome.value.trim();
    const emailInput = email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ ;
    const senhaCadastroInput = senhaCadastro.value.trim();
    const confirmeSenhaInput = confirmeSenha.value.trim();

    if (nomeInput === '' || sobrenomeInput === '' || emailInput === '' || senhaCadastroInput === '' || confirmeSenhaInput === '') {
            alert('Por favor, preencha todos os campos.');
            return;
    } 
    
    if (!emailRegex.test(emailInput)) {
            alert('Por favor, insira um email válido.');
            return;
    }
    alert('Cadastro realizado com sucesso!');
    window.location.href = '/src/pages/login/login.html';

    localStorage.setItem('nome', nomeInput);
    localStorage.setItem('sobrenome', sobrenomeInput);
    localStorage.setItem('email', emailInput);
    localStorage.setItem('senhaCadastro', senhaCadastroInput);
    localStorage.setItem('confirmeSenha', confirmeSenhaInput);
}

btnCadastro.addEventListener('click', cadastro);
