const db = require('../database/database');

async function criarPedido(req, res) {
    try {
        const { cliente, itens } = req.body;

        if (!cliente || !cliente.nome || !cliente.email) {
            return res.status(400).json({
                erro: 'Nome e email do cliente são obrigatórios.'
            });
        }

        if (!itens || itens.length === 0) {
            return res.status(400).json({
                erro: 'O pedido precisa ter pelo menos um item.'
            });
        }
        
        for (const item of itens) {
            const resposta = await fetch(
                `https://fakestoreapi.com/products/${item.produto_id}`
            );

            if (!resposta.ok) {
                return res.status(404).json({
                    erro: `Product ${item.produto_id} not found.`
                });
            }

            const produto = await resposta.json();

            item.nome_produto = produto.title;
            item.preco = produto.price;
}

        // Verifica se o cliente já existe
        let clienteExistente = db
            .prepare('SELECT * FROM clientes WHERE email = ?')
            .get(cliente.email);

        // Se não existir, cria
        if (!clienteExistente) {
            const resultadoCliente = db
                .prepare('INSERT INTO clientes (nome, email) VALUES (?, ?)')
                .run(cliente.nome, cliente.email);

            clienteExistente = {
                id: resultadoCliente.lastInsertRowid,
                nome: cliente.nome,
                email: cliente.email
            };
        }

        // Calcula o valor total
        const valorTotal = itens.reduce((total, item) => {
            return total + (item.preco * item.quantidade);
        }, 0);

        // Cria o pedido
        const resultadoPedido = db
            .prepare(`
                INSERT INTO pedidos (cliente_id, valor_total)
                VALUES (?, ?)
            `)
            .run(clienteExistente.id, valorTotal);

        const pedidoId = resultadoPedido.lastInsertRowid;

        // Insere os itens
        const inserirItem = db.prepare(`
            INSERT INTO itens_pedido
            (pedido_id, produto_id, nome_produto, preco, quantidade)
            VALUES (?, ?, ?, ?, ?)
        `);

        for (const item of itens) {
            inserirItem.run(
                pedidoId,
                item.produto_id,
                item.nome_produto,
                item.preco,
                item.quantidade
            );
        }

        return res.status(201).json({
            mensagem: 'Pedido criado com sucesso!',
            pedido: {
                id: pedidoId,
                cliente: clienteExistente,
                itens: itens,
                valor_total: valorTotal
            }
        });

    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            erro: 'Erro ao criar pedido.'
        });
    }
}
function listarPedidos(req, res) {
    try {
        const pedidos = db.prepare(`
            SELECT 
                pedidos.id,
                clientes.nome AS cliente,
                clientes.email,
                pedidos.valor_total,
                pedidos.status,
                pedidos.data
            FROM pedidos
            INNER JOIN clientes
                ON pedidos.cliente_id = clientes.id
            ORDER BY pedidos.id DESC
        `).all();

        return res.json(pedidos);

    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            erro: 'Erro ao buscar pedidos.'
        });
    }
}

function buscarPedidoPorId(req, res) {
    try {
        const { id } = req.params;

        const pedido = db.prepare(`
            SELECT
                pedidos.id,
                clientes.nome AS cliente,
                clientes.email,
                pedidos.valor_total,
                pedidos.status,
                pedidos.data
            FROM pedidos
            INNER JOIN clientes
                ON pedidos.cliente_id = clientes.id
            WHERE pedidos.id = ?
        `).get(id);

        if (!pedido) {
            return res.status(404).json({
                erro: 'Pedido não encontrado.'
            });
        }

        const itens = db.prepare(`
            SELECT
                produto_id,
                nome_produto,
                preco,
                quantidade
            FROM itens_pedido
            WHERE pedido_id = ?
        `).all(id);

        return res.json({
            id: pedido.id,
            cliente: {
                nome: pedido.cliente,
                email: pedido.email
            },
            itens: itens,
            valor_total: pedido.valor_total,
            status: pedido.status,
            data: pedido.data
        });

    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            erro: 'Erro ao buscar pedido.'
        });
    }
}

function atualizarPedido(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const statusPermitidos = [
            'Pendente',
            'Processando',
            'Enviado',
            'Entregue',
            'Cancelado'
        ];

        if (!status) {
            return res.status(400).json({
                erro: 'O status é obrigatório.'
            });
        }

        if (!statusPermitidos.includes(status)) {
            return res.status(400).json({
                erro: 'Status inválido.'
            });
        }

        const pedido = db.prepare(`
            SELECT *
            FROM pedidos
            WHERE id = ?
        `).get(id);

        if (!pedido) {
            return res.status(404).json({
                erro: 'Pedido não encontrado.'
            });
        }

        db.prepare(`
            UPDATE pedidos
            SET status = ?
            WHERE id = ?
        `).run(status, id);

        const pedidoAtualizado = db.prepare(`
            SELECT
                pedidos.id,
                clientes.nome AS cliente,
                clientes.email,
                pedidos.valor_total,
                pedidos.status,
                pedidos.data
            FROM pedidos
            INNER JOIN clientes
                ON pedidos.cliente_id = clientes.id
            WHERE pedidos.id = ?
        `).get(id);

        return res.json({
            mensagem: 'Pedido atualizado com sucesso!',
            pedido: pedidoAtualizado
        });

    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            erro: 'Erro ao atualizar pedido.'
        });
    }
}
function deletarPedido(req, res) {
    try {
        const { id } = req.params;

        const pedido = db.prepare(`
            SELECT *
            FROM pedidos
            WHERE id = ?
        `).get(id);

        if (!pedido) {
            return res.status(404).json({
                erro: 'Pedido não encontrado.'
            });
        }

        // Primeiro remove os itens do pedido
        db.prepare(`
            DELETE FROM itens_pedido
            WHERE pedido_id = ?
        `).run(id);

        // Depois remove o pedido
        db.prepare(`
            DELETE FROM pedidos
            WHERE id = ?
        `).run(id);

        return res.json({
            mensagem: 'Pedido excluído com sucesso!'
        });

    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            erro: 'Erro ao excluir pedido.'
        });
    }
}

module.exports = {
    criarPedido,
    listarPedidos,
    buscarPedidoPorId,
    deletarPedido,
    atualizarPedido
    
};