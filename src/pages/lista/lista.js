$('#valor_input').mask("#.##0,00", {reverse: true});

let carrinhosItens = []

document.addEventListener('DOMContentLoaded', () => {

    const itemInput = document.getElementById('item_input');
    const valorInput = document.getElementById('valor_input');
    const addButton = document.getElementById('add_button');

    if (!itemInput || !valorInput || !addButton) return;


    const upgradeButtonState = () => {
        addButton.disabled = itemInput.value.trim().length === 0 || valorInput.value.trim().length === 0;  
    };

    itemInput.addEventListener('input', upgradeButtonState);
    valorInput.addEventListener('input', upgradeButtonState);
    // Inicializa o estado do botão
    upgradeButtonState();

    // ligar o botão 'Adicionar' à função adicionarItem
    addButton.onclick = adicionarItem;

    let saveAll = document.getElementById('save');
    if (saveAll) {
    saveAll.onclick = () => salvarLista();
    }

    let excluirTudo = document.getElementById('nav_trash');
    if (excluirTudo) {
    excluirTudo.onclick = () => limparLista();
    }
});

function adicionarItem() {
    const itemInput = document.getElementById('item_input');
    const valorInput = document.getElementById('valor_input');
    const addButton = document.getElementById('add_button');
    // Assumindo um ID para a qtde atual
    const quantidadeDisplay = document.getElementById('quanti_Numeros_valor');

    let qtdSelecionada = parseInt(document.getElementById('quantidade-itens')?.textContent) || 1;

    let novoItemObj = { 
        nome: itemInput.value.trim(),
        valor: Number(valorInput.value.replace(',', '.')) || 0,
        quantidade: qtdSelecionada,
        checado: false 
    };

    carrinhosItens.push(novoItemObj);

    //Limpeza de campos
    itemInput.value = '';
    valorInput.value = '';
    addButton.disabled = true;

    renderizarItensValor();

    let mensagemItem = document.getElementById('mensagemSucesso');
    if (mensagemItem) {
        mensagemItem.style.display = 'block';

        setTimeout(function() {
            mensagemItem.style.display = 'none';
        }, 2000);
        return;
    }
    
    return upgradeButtonState();
}


function renderizarItensValor(listaParaExibir = carrinhosItens) {
    const listaCarrinho = document.getElementById('carrinhoLista');
    if (!listaCarrinho) return;
    listaCarrinho.innerHTML = '';

    listaParaExibir.forEach((item, i) => {

        const i = carrinhosItens.indexOf(item);

        let itemLista = document.createElement('li');

        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('meu-check');
        checkbox.checked = item.checado;
        checkbox.onclick = () => {
            item.checado = !item.checado;
            renderizarItensValor();
        };

        let texto = document.createElement('span');
        texto.textContent = `${item.nome} (x${item.quantidade})`;

        let textoValor = document.createElement('span');
        let subtotalItem = item.quantidade * item.valor;
        texto.textContent = item.nome;
        textoValor.textContent = 'R$ ' + subtotalItem.toFixed(2).replace(".", ",");
        textoValor.className = 'item_valor';

        let itens = document.createElement('span');
        itens.className = 'qnt-itens';
        itens.textContent = item.quantidade + ' Itens';

        // define estilo inicial conforme estado `checado`
        if (item.checado) {
            texto.style.textDecoration = 'line-through';
            textoValor.style.textDecoration = 'line-through';
            itens.style.textDecoration = 'line-through';
            itemLista.style.opacity = '0.6';
            checkbox.checked = true;
        }

        // único listener que atualiza estado, total e re-renderiza
        checkbox.addEventListener('change', () => {
            item.checado = checkbox.checked;
            atualizarTotal();
            renderizarItensValor();
        });

        let itemLimpar = document.createElement('button');
        itemLimpar.className = 'itemExcluir';
        itemLimpar.textContent = 'x';
        itemLimpar.onclick = () => limparItem(i);

        itemLista.append(checkbox, texto, itens,textoValor, itemLimpar);
        listaCarrinho.appendChild(itemLista);

        if (noCarrinho) {
            noCarrinho.textContent = 'No Carrinho' + ' ('+ carrinhosItens.filter(item => item.checado).length + ')';
        } else {
            noCarrinho.textContent = 'No Carrinho' + '(0)';
        }

        if (pedenteFilter) {
            pedenteFilter.textContent = 'Pendentes' + ' (' + carrinhosItens.filter(item => !item.checado).length + ')';
        } else {            
            pedenteFilter.textContent = 'Pendentes' + ' (0)';
        }

    });
    

    let listaVazia = document.getElementById("carrinho_container");
        if (carrinhosItens.length > 0) {
             listaVazia.style.display = 'none';
        } else {
            listaVazia.style.display = 'flex';
        }

    atualizarTotal();
}

let todosFilter = document.getElementById('todos-lista');
let noCarrinho = document.getElementById('no-carrinho');
let pedenteFilter = document.getElementById('lista-pendentes');

const abas = {
    todosFilter: document.getElementById('todos-lista'),
    noCarrinho: document.getElementById('no-carrinho'),
    pedenteFilter: document.getElementById('lista-pendentes')
};

const ativarAbaVisualmente = (abaAtiva) => {
    Object.values(abas).forEach(aba => aba.classList.remove('ativa'));
    abaAtiva.classList.add('ativa');
};

abas.todosFilter.addEventListener('click', () => {
    ativarAbaVisualmente(abas.todosFilter);
    renderizarItensValor();
});

abas.noCarrinho.addEventListener('click', () => {
    const itensNoCarrinho = carrinhosItens.filter(item => item.checado === true);
    
    ativarAbaVisualmente(abas.noCarrinho);
    renderizarItensValor(itensNoCarrinho);
});

abas.pedenteFilter.addEventListener('click', () => {
    ativarAbaVisualmente(abas.pedenteFilter);

    const itensPedentes = carrinhosItens.filter(item => item.checado === false);
    renderizarItensValor(itensPedentes);
});

let elementPendent = document.getElementById('pendente');

function atualizarTotal() {
    let carrinhoElement = document.getElementById('carrinho');
    let totalElement = document.getElementById('total');

    // Soma apenas itens checados: (valor * quantidade)
    let somaTotal = carrinhosItens
        .filter(item => item.checado)
        .reduce((acc, item) => acc + item.valor * item.quantidade, 0);

    let valorFormatado = 'R$ ' + somaTotal.toFixed(2).replace(".", ",");

    if (totalElement) totalElement.textContent = valorFormatado;
    if (carrinhoElement) carrinhoElement.textContent = valorFormatado;

    let pendentValor = elementPendent;
    let pedenteValor = carrinhosItens
        .filter(item => item.valor > 0)
        .reduce((acc, item) => acc + item.quantidade * item.valor, 0);
        
    let valorPedente = 'R$ ' + pedenteValor.toFixed(2).replace(".", ",");
    if (pendentValor) pendentValor.textContent = valorPedente;

    let totalConvert = valorFormatado.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
    let pedenteConvert = valorPedente.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
    let totalElementConvert = parseFloat(totalConvert);
    let pedenteItensConvert = parseFloat(pedenteConvert);

        if (totalElement.textContent !== 'R$ 0,00') {
            if (elementPendent) elementPendent.textContent = 'R$ ' + (pedenteItensConvert - totalElementConvert).toFixed(2).replace(".", ",");
        }

    let qtnPedente = document.getElementById('qtn-pendente');
    let qtnCarrinho = document.getElementById('qtn-carrinho');
    let qtnTotal = document.getElementById('qtn-total');

    if (todosFilter) todosFilter.textContent = 'Todos' + ' (' + carrinhosItens.length + ')';

    let itemTotal = carrinhosItens
        .filter(item => item.checado)
        .reduce((acc, item) => acc + item.quantidade, 0);
    
    let itemFormatado = itemTotal + ' Itens';
    if (qtnTotal) qtnTotal.textContent = itemFormatado;
    if (qtnCarrinho) qtnCarrinho.textContent = itemFormatado;

    let quantidadeItens = carrinhosItens
        .filter(item => item.quantidade)
        .reduce((acc, item) => acc + item.quantidade, 0);

    let pedenteItens = quantidadeItens + ' Itens';
    if (qtnPedente) qtnPedente.textContent = pedenteItens;

    let quantidadeTotal = itemFormatado.replace(' Itens', '');
    let quantidadePendente = pedenteItens.replace(' Itens', '');
    let qtnTotalConvert = parseInt(quantidadeTotal);
    let qtnPendenteConvert = parseInt(quantidadePendente);
    
        if (qtnTotal.textContent !== '0 Itens') {
                if (qtnPedente) qtnPedente.textContent = (qtnPendenteConvert - qtnTotalConvert) + ' Itens';
            }
}

// Funções auxiliares (Certifique-se que os IDs batem com seu HTML)
function limparItem(i) {
    carrinhosItens.splice(i, 1);
    renderizarItensValor();
}

function limparLista() {
    if (confirm('Deseja excluir tudo?')) {
        carrinhosItens = [];
        renderizarItensValor();
    }
}

function salvarLista() {
    if (confirm('Deseja salvar a lista?')) {
        let saveAll = document.getElementById('save');
        let saveMark = document.getElementById('save-mark');
        saveMark.style.display = 'block';
        saveAll.style.display = 'none';

        localStorage.setItem('minhaLista', JSON.stringify(carrinhosItens));
        renderizarItensValor();
    }
}

let listaQuantidade = document.getElementById('quanti_Numeros');
let quantidadeItens = document.createElement('span');
let sinalMenos = document.createElement('button');
let sinalMais = document.createElement('button');

quantidadeItens.id = 'quantidade-itens';
sinalMenos.classList.add('menos-qntd');
sinalMais.classList.add('mais-qntd');
quantidadeItens.textContent = '1';
sinalMenos.textContent = '-';
sinalMais.textContent = '+';

if (listaQuantidade) {
    listaQuantidade.appendChild(sinalMenos);
    listaQuantidade.appendChild(quantidadeItens);
    listaQuantidade.appendChild(sinalMais);
}

let qtnItens = document.getElementById('quantidade_itens');

if (qtnItens) qtnItens.onclick = () => listaQtn();
sinalMenos.onclick = () => itensMenos();
sinalMais.onclick = () => itensMais();

function itensMais() {
    quantidadeItens.textContent = parseInt(quantidadeItens.textContent) + 1;
    atualizarTotal();
}

function itensMenos() {
    if (parseInt(quantidadeItens.textContent) > 1) {
    quantidadeItens.textContent = parseInt(quantidadeItens.textContent) - 1;
    atualizarTotal();
}
}

function listaQtn() {
    listaQuantidade.style.display = 'block';
    setTimeout(function() {
        listaQuantidade.style.display = 'none';
    }, 5000);
    quantidadeItens.textContent = '1';
}
