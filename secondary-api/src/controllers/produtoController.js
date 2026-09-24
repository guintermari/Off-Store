const db = require('../database/database');

function listarProdutos(req, res) {
    try {
        const produtos = db.prepare(`
            SELECT *
            FROM produtos
            ORDER BY id
        `).all();

        res.json(produtos);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao buscar produtos.'
        });
    }
}

function buscarProdutoPorId(req, res) {
    try {
        const id = Number(req.params.id);

        const produto = db.prepare(`
            SELECT *
            FROM produtos
            WHERE id = ?
        `).get(id);

        if (!produto) {
            return res.status(404).json({
                erro: 'Produto não encontrado.'
            });
        }

        res.json(produto);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao buscar produto.'
        });
    }
}

function criarProduto(req, res) {
    try {
        const {
            nome,
            categoria,
            tamanho,
            preco,
            estoque
        } = req.body;

        if (!nome || !categoria || !tamanho || preco === undefined || estoque === undefined) {
            return res.status(400).json({
                erro: 'Todos os campos são obrigatórios.'
            });
        }

        const resultado = db.prepare(`
            INSERT INTO produtos (
                nome,
                categoria,
                tamanho,
                preco,
                estoque
            )
            VALUES (?, ?, ?, ?, ?)
        `).run(
            nome,
            categoria,
            tamanho,
            preco,
            estoque
        );

        const novoProduto = db.prepare(`
            SELECT *
            FROM produtos
            WHERE id = ?
        `).get(resultado.lastInsertRowid);

        res.status(201).json({
            mensagem: 'Produto criado com sucesso!',
            produto: novoProduto
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao criar produto.'
        });
    }
}

function atualizarProduto(req, res) {
    try {
        const id = Number(req.params.id);

        const produto = db.prepare(`
            SELECT *
            FROM produtos
            WHERE id = ?
        `).get(id);

        if (!produto) {
            return res.status(404).json({
                erro: 'Produto não encontrado.'
            });
        }

        const {
            nome,
            categoria,
            tamanho,
            preco,
            estoque
        } = req.body;

        if (!nome || !categoria || !tamanho || preco === undefined || estoque === undefined) {
            return res.status(400).json({
                erro: 'Todos os campos são obrigatórios.'
            });
        }

        db.prepare(`
            UPDATE produtos
            SET
                nome = ?,
                categoria = ?,
                tamanho = ?,
                preco = ?,
                estoque = ?
            WHERE id = ?
        `).run(
            nome,
            categoria,
            tamanho,
            preco,
            estoque,
            id
        );

        const produtoAtualizado = db.prepare(`
            SELECT *
            FROM produtos
            WHERE id = ?
        `).get(id);

        res.json({
            mensagem: 'Produto atualizado com sucesso!',
            produto: produtoAtualizado
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao atualizar produto.'
        });
    }
}

function deletarProduto(req, res) {
    try {
        const id = Number(req.params.id);

        const produto = db.prepare(`
            SELECT *
            FROM produtos
            WHERE id = ?
        `).get(id);

        if (!produto) {
            return res.status(404).json({
                erro: 'Produto não encontrado.'
            });
        }

        db.prepare(`
            DELETE FROM produtos
            WHERE id = ?
        `).run(id);

        res.json({
            mensagem: 'Produto excluído com sucesso!'
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao excluir produto.'
        });
    }
}

module.exports = {
    listarProdutos,
    buscarProdutoPorId,
    criarProduto,
    atualizarProduto,
    deletarProduto
};