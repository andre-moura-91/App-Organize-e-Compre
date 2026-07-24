const btnEntrar = document.getElementById('btn-entrar');

function entrar(event) {
    event.preventDefault();

    window.location.href = 'https://mail.google.com';
}

btnEntrar.addEventListener('click', entrar);