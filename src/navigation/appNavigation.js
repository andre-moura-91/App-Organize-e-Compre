document.addEventListener('DOMContentLoaded', () => {

let home = document.getElementById('home');
let historico = document.getElementById('historico');
let profile = document.getElementById('profile');
let meuCarrinho = document.getElementById('meu-carrinho');
let lista = document.getElementById('lista');

const navItens = document.querySelectorAll('.nav-item');

const currentPath = window.location.pathname;
navItens.forEach(item => {
    const href = item.getAttribute('href');
    if (href && currentPath.endsWith(href)) {
        item.classList.add('active');
    }

    item.addEventListener('click', function() {
        navItens.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
    });
});

if (home) {
    home.onclick = () => {
        window.location.href = '/src/pages/bem-vindo/saudacao.html';

    }
}

if (historico) {
historico.onclick = () => {
        window.location.href = '/src/pages/historico/historical.html';


    };
}

if (profile) {
profile.onclick = () => {
        window.location.href = '/src/pages/profile/perfil.html';


    }
}

if (meuCarrinho) {
meuCarrinho.onclick = () => {
        window.location.href = '/src/pages/lista/lista.html';


    }        
}        

if (lista) {
lista.onclick = () => {
        window.location.href = '/src/pages/pre-lista/pre-lista.html';


    }                                           
}   

});