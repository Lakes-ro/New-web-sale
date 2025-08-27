// Array de dados dos produtos
const produtos = [
    {
        id: 'danix',
        nome: 'Danix',
        preco: 3.00,
        precoTexto: 'R$ 3',
        imagem: 'https://www.arcor.com.br/wp-content/uploads/2019/06/Danix-Chocolate-130g.png',
        sabores: ['Morango', 'Chocogelato', 'Chocolate']
    },
    {
        id: 'guaravita',
        nome: 'Guaravita',
        preco: 3.00,
        precoTexto: 'R$ 3',
        imagem: 'https://img.cdndsgni.com/preview/10927054.jpg',
        sabores: []
    },
    {
        id: 'bis',
        nome: 'Bis Xtra',
        preco: 3.00,
        promocao: { quantidade: 4, preco: 10.00 },
        precoTexto: '1 por R$ 3 e 4 por R$ 10',
        imagem: 'https://drogariasp.vteximg.com.br/arquivos/ids/1188291-1000-1000/_0001_627470---Chocolate-Bis-Xtra-ao-Leite-Lacta-45g.png.png?v=638699584396430000',
        sabores: []
    },
    {
        id: 'suco',
        nome: 'Suco gelado',
        preco: 3.00,
        promocao: { quantidade: 4, preco: 10.00 },
        precoTexto: '1 Suco por R$3 e 4 por R$10',
        imagem: 'https://cdn.shoppub.io/cdn-cgi/image/w=1000,h=1000,q=80,f=auto/pereirao/media/uploads/produtos/foto/bd5f4fbac0911file.png',
        sabores: ['Uva', 'Pêssego', 'Laranja', 'Manga']
    },
    {
        id: 'pipoca',
        nome: 'Pipoca',
        preco: 3.00,
        precoTexto: 'R$ 3',
        imagem: 'https://www.kisabor.com.br/fotos-lojista/?img=mockup-pizza-1701692181.png',
        sabores: ['Salgada', 'Mantega', 'pizza']
    },
    {
        id: 'chocolate',
        nome: 'Chocolate',
        preco: 3.00,
        promocao: { quantidade: 4, preco: 10.00 },
        precoTexto: '1 por R$ 3 e 4 por R$ 10',
        imagem: 'https://w7.pngwing.com/pngs/242/528/png-transparent-chocolate-bar-milk-white-chocolate-the-hershey-company-chocolate-meio-amargo-milk.png',
        sabores: []
    },
    {
        id: 'kitkat',
        nome: 'Kit Kat',
        preco: 3.00,
        promocao: { quantidade: 4, preco: 10.00 },
        precoTexto: '1 por R$ 3 e 4 por R$ 10',
        imagem: 'https://img.cdndsgni.com/preview/10001765.jpg',
        sabores: []
    },
    {
        id: 'tortilhas',
        nome: 'Tortilhas',
        preco: 3.00,
        promocao: { quantidade: 4, preco: 10.00 },
        precoTexto: '1 por R$ 3 e 4 por R$ 10',
        imagem: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/75531923/biscoito-recheio-chocolate-adria-tortinhas-140g-1.jpg?v=637994707491870000',
        sabores: []
    },
    {
        id: 'tortilhas',
        nome: 'Tortilhas',
        preco: 3.00,
        promocao: { quantidade: 4, preco: 10.00 },
        precoTexto: '1 por R$ 3 e 4 por R$ 10',
        imagem: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/75531923/biscoito-recheio-chocolate-adria-tortinhas-140g-1.jpg?v=637994707491870000',
        sabores: []
    }
];

// Carrinho de compras. Cada item tem um identificador único para remoção
let carrinho = [];

// Função para gerar o HTML de um único card de produto
function criarCardProduto(produto) {
    // Verifica se o produto tem sabores para incluir o <select>
    const selectSabores = produto.sabores && produto.sabores.length > 0
        ? `
        <select id="sabor-${produto.id}" class="w-full mt-2 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
            <option value="">Escolha o sabor</option>
            ${produto.sabores.map(sabor => `<option value="${sabor}">${sabor}</option>`).join('')}
        </select>
        `
        : '';

    // Retorna a string HTML completa para o card
    return `
        <div id="${produto.id}" class="card bg-white p-4 rounded-lg shadow-md hover:shadow-xl flex flex-col items-center text-center">
            <h1 class="text-xl font-bold text-gray-900">${produto.nome}</h1>
            <h2 class="text-md text-gray-600">${produto.precoTexto}</h2>
            <img src="${produto.imagem}" alt="${produto.nome} Foto" class="product-img w-full rounded-md mt-2">
            ${selectSabores}
            <select id="quantidade-${produto.id}" class="w-full mt-2 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                <option value="0">Quantidade</option>
                ${Array.from({length: 10}, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
            </select>
            <button onclick="adicionarAoCarrinho('${produto.id}')" class="btn-add-cart mt-4">
                Adicionar
            </button>
        </div>
    `;
}

// Função para atualizar a exibição do carrinho
function atualizarCarrinhoUI() {
    const listaNomes = document.getElementById('lista-nomes');
    listaNomes.innerHTML = ''; // Limpa a lista antes de reconstruir

    let total = 0;

    // Usando um objeto para agrupar itens e adicionar um índice para remoção
    const itemsAgrupados = {};

    carrinho.forEach((item, index) => {
        const chave = `${item.id}-${item.sabor || 'sem_sabor'}`;
        if (!itemsAgrupados[chave]) {
            itemsAgrupados[chave] = {
                quantidade: 0,
                preco: item.preco,
                promocao: item.promocao,
                nome: item.nome,
                sabor: item.sabor,
                indices: []
            };
        }
        itemsAgrupados[chave].quantidade++;
        itemsAgrupados[chave].indices.push(index);
    });

    // Cria os <li> para cada item agrupado
    for (const chave in itemsAgrupados) {
        const item = itemsAgrupados[chave];
        const quantidade = item.quantidade;

        let precoTotalItem = item.preco * quantidade;
        if (item.promocao && quantidade >= item.promocao.quantidade) {
            const numPromocoes = Math.floor(quantidade / item.promocao.quantidade);
            const restante = quantidade % item.promocao.quantidade;
            precoTotalItem = (numPromocoes * item.promocao.preco) + (restante * item.preco);
        }

        total += precoTotalItem;
        
        // Crie o <li> com um botão de remoção individual
        const li = document.createElement('li');
        li.className = 'list-group-item bg-gray-50 p-3 rounded-md shadow-sm flex justify-between items-center';
        li.innerHTML = `
            <span class="text-gray-800">${quantidade}x ${item.nome}${item.sabor ? ` (${item.sabor})` : ''}</span>
            <span class="text-gray-800 font-bold">R$ ${precoTotalItem.toFixed(2).replace('.', ',')}</span>
            <button onclick="removerItemDoCarrinho('${chave}')" class="btn-remover-item">
                &times;
            </button>
        `;
        listaNomes.appendChild(li);
    }

    // Atualiza o valor total no rodapé
    document.getElementById('totalValue').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Função para adicionar um produto ao carrinho
function adicionarAoCarrinho(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    const selectQuantidade = document.getElementById(`quantidade-${produtoId}`);
    const selectSabor = document.getElementById(`sabor-${produtoId}`);

    const quantidade = parseInt(selectQuantidade.value);
    const sabor = selectSabor ? selectSabor.value : '';

    if (quantidade > 0) {
        for (let i = 0; i < quantidade; i++) {
            carrinho.push({ ...produto, sabor: sabor });
        }
        atualizarCarrinhoUI();
        
        alert(`Adicionado ${quantidade}x ${produto.nome} ao carrinho!`);

    } else {
        alert('Por favor, selecione uma quantidade.');
    }
}

// Função para remover um único item do carrinho
function removerItemDoCarrinho(chave) {
    const itensParaRemover = carrinho.filter(item => `${item.id}-${item.sabor || 'sem_sabor'}` === chave);
    if (itensParaRemover.length > 0) {
        // Remove apenas uma unidade do item do carrinho
        const indexParaRemover = carrinho.findIndex(item => `${item.id}-${item.sabor || 'sem_sabor'}` === chave);
        if (indexParaRemover > -1) {
            carrinho.splice(indexParaRemover, 1);
            atualizarCarrinhoUI();
        }
    }
}

// Função para remover todos os produtos do carrinho
function removerTodosDoCarrinho() {
    if (carrinho.length > 0) {
        if (confirm('Tem certeza que deseja remover todos os produtos do carrinho?')) {
            carrinho = []; // Esvazia o array do carrinho
            atualizarCarrinhoUI(); // Atualiza a interface
            alert('Todos os produtos foram removidos do carrinho!');
        }
    } else {
        alert('O carrinho já está vazio.');
    }
}

// Função para enviar o pedido
function enviarPedido() {
    const nome = document.getElementById('nome').value;
    const quarto = document.getElementById('quarto').value;

    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio. Adicione itens antes de enviar o pedido.');
        return;
    }

    if (!nome || !quarto) {
        alert('Por favor, preencha seu nome e número do quarto.');
        return;
    }

    // Construir a mensagem do pedido
    let mensagem = `Novo Pedido!\n\nNome: ${nome}\nQuarto: ${quarto}\n\nItens do Pedido:\n`;
    let total = 0;

    const itemsAgrupados = {};
    carrinho.forEach(item => {
        const key = `${item.nome}${item.sabor ? ` (${item.sabor})` : ''}`;
        if (!itemsAgrupados[key]) {
            itemsAgrupados[key] = {
                quantidade: 0,
                preco: item.preco,
                promocao: item.promocao
            };
        }
        itemsAgrupados[key].quantidade++;
    });

    for (const key in itemsAgrupados) {
        const item = itemsAgrupados[key];
        const quantidade = item.quantidade;
        const precoUnitario = item.preco;
        
        let precoCalculado = precoUnitario * quantidade;

        if (item.promocao && quantidade >= item.promocao.quantidade) {
            const numPromocoes = Math.floor(quantidade / item.promocao.quantidade);
            const restante = quantidade % item.promocao.quantidade;
            precoCalculado = (numPromocoes * item.promocao.preco) + (restante * precoUnitario);
        }

        mensagem += `- ${key}: ${quantidade}x (R$ ${precoCalculado.toFixed(2).replace('.', ',')})\n`;
        total += precoCalculado;
    }

    mensagem += `\nTotal: R$ ${total.toFixed(2).replace('.', ',')}`;

    alert(mensagem); // Exibe o pedido em uma janela de alerta simples
    
    // Limpa o carrinho após o envio do pedido
    carrinho = [];
    atualizarCarrinhoUI();
}

// Esta função é executada quando a página é completamente carregada
document.addEventListener('DOMContentLoaded', () => {
    const produtosContainer = document.getElementById('produtos-container');
    
    // Mapeia o array de produtos para um array de strings HTML e junta tudo
    const produtosHTML = produtos.map(criarCardProduto).join('');
    
    // Insere o HTML gerado no contêiner
    produtosContainer.innerHTML = produtosHTML;

    // Anexando o evento de clique ao botão "Enviar pedido"
    document.getElementById('enviar-pedido-btn').addEventListener('click', enviarPedido);

    // Anexando o evento de clique ao novo botão "Remover Todos"
    document.getElementById('remover-tudo-btn').addEventListener('click', removerTodosDoCarrinho);
});
