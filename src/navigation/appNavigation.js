document.addEventListener('DOMContentLoaded', () => {

let home = document.getElementById('home');
let historico = document.getElementById('historico');
let meuCarrinho = document.getElementById('meu-carrinho');
let lista = document.getElementById('lista');

    if (home) {
    home.onclick = () => {
            window.location.href = '/src/pages/bem-vindo/saudacao.html';

        }
    }

    if (historico) {
    historico.onclick = () => {
            window.location.href = '/src/pages/historico/historical.html';

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