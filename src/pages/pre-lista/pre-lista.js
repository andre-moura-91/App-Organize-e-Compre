let carrinhosItens = JSON.parse(localStorage.getItem('minhaLista')) || [];

document.addEventListener('DOMContentLoaded', () => {
    const itemInput = document.getElementById('item_input');
    const addButton = document.getElementById('add_button');
    if (!itemInput || !addButton) return;

    const upgradeButtonState = () => {
        addButton.disabled = itemInput.value.trim().length === 0;  
    };

    itemInput.addEventListener('input', upgradeButtonState);
    // Inicializa o estado do botão
    upgradeButtonState();

    // ligar o botão 'Adicionar' à função adicionarItem
    addButton.onclick = adicionarItem;

    let excluirTudo = document.getElementById('nav_trash');
    if (excluirTudo) {
    excluirTudo.onclick = () => limparLista();
    }

    let saveAll = document.getElementById('save');
    if (saveAll) {
    saveAll.onclick = () => salvarTudo();
    }
});

function adicionarItem() {
    const itemInput = document.getElementById('item_input');
    const addButton = document.getElementById('add_button');
    // Assumindo um ID para a qtde atual
    const quantidadeDisplay = document.getElementById('quanti_Numeros_valor');

    let novoItemObj = { 
        nome: itemInput.value.trim(),
    };

    carrinhosItens.push(novoItemObj);

    //Limpeza de campos
    itemInput.value = '';
    addButton.disabled = true;

    renderizarItensLista()

    let mensagemItem = document.getElementById('mensagemSucesso');
    if (mensagemItem) {
        mensagemItem.style.display = 'block';

        setTimeout(function() {
            mensagemItem.style.display = 'none';
        }, 2000);
        return;
    }
}

function renderizarItensLista() {
    const listaCarrinho = document.getElementById('carrinhoLista');
    if (!listaCarrinho) return;
    listaCarrinho.innerHTML = '';

    carrinhosItens.forEach((item, i) => {
        let itemLista = document.createElement('li');

        let texto = document.createElement('span');
        texto.textContent = item.nome;

        let itemLimpar = document.createElement('button');
        itemLimpar.className = 'itemExcluir';
        itemLimpar.textContent = 'x';
        itemLimpar.onclick = () => limparItem(i);

        itemLista.append(texto, itemLimpar);
        listaCarrinho.appendChild(itemLista);

    });

    let listaVazia = document.getElementById("carrinho_container");
        if (carrinhosItens.length > 0) {
             listaVazia.style.display = 'none';
        } else {
            listaVazia.style.display = 'flex';
        }
}

function salvarTudo() {
    if (confirm('Deseja salvar tudo?')) {
        localStorage.setItem('minhaLista', JSON.stringify(carrinhosItens));
        renderizarItensLista();
    }
}

function limparItem(i) {
    carrinhosItens.splice(i, 1);
    renderizarItensLista();
    salvarTudo();

}

function limparLista() {
    if (confirm('Deseja excluir tudo?')) {
        carrinhosItens = [];
        renderizarItensLista();
        salvarTudo();
    }
}

