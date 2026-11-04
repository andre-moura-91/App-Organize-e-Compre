const email = document.getElementById('text-email'); 
const btnContinuar = document.getElementById('btn-continuar');

function continuar(event) {
    event.preventDefault();

    const emailInput = email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ ;

    if (emailInput === '') {
        alert('Por favor, digite seu email.');
        return;
    }

    if (!emailRegex.test(emailInput)) {
        alert('Por favor, insira um email válido.');
        return;
    }

    // Guardar dados antes de navegar
    localStorage.setItem('email', emailInput);
    window.location.href = '/src/pages/password/nova-senha.html';
}

btnContinuar.addEventListener('click', continuar);