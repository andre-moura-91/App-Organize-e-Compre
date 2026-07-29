document.addEventListener('DOMContentLoaded', () => {

let home = document.getElementById('home');
let historico = document.getElementById('historico');
let profile = document.getElementById('profile');
let meuCarrinho = document.getElementById('meu-carrinho');
let lista = document.getElementById('lista');

const navItens = document.querySelectorAll('.nav-item')
const title = document.querySelectorAll('title-icon')

title.forEach(item => {
    item.addEventListener('click', function(event) {
    event.preventDefault();
    title.forEach(title => title.classList.remove('active'));
    title.style.display = 'block';
    this.classList.add('active');
    
    });
});

navItens.forEach(item => {
    item.addEventListener('click', function(event) {
    event.preventDefault();
    navItens.forEach(nav => nav.classList.remove('active'));

    this.classList.add('active');
    });
});

/* if (home) {
    home.onclick = () => {
        window.location.href = '/src/pages/bem-vindo/saudacao.html';

    }
}

if (historico) {
historico.onclick = () => {
        window.location.href = '/src/pages/historico/historical.html';

        navItens.forEach(item => {
            item.addEventListener('click', function(event) {
            event.preventDefault();

            navItens.forEach(nav => nav.classList.remove('active'));

            this.classList.add('active');
            });
        });

    };
}

if (profile) {
profile.onclick = () => {
        window.location.href = '/src/pages/profile/perfil.html';
        perfil.classList.add('hover-ativo')
    }
}

if (meuCarrinho) {
meuCarrinho.onclick = () => {
        window.location.href = '/src/pages/lista/lista.html';

        navItens.forEach(item => {
            item.addEventListener('click', function(event) {
            event.preventDefault();

            navItens.forEach(nav => nav.classList.remove('active'));

            this.classList.add('active');
            });
        });

    }        
}        

if (lista) {
lista.onclick = () => {
        window.location.href = '/src/pages/pre-lista/pre-lista.html';

        navItens.forEach(item => {
            item.addEventListener('click', function(event) {
            event.preventDefault();

            navItens.forEach(nav => nav.classList.remove('active'));

            this.classList.add('active');
            });
        });

    }                                           
}         */                                    
});