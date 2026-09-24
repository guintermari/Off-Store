const express = require('express');

const router = express.Router();

const {
    listarProdutos,
    buscarProdutoPorId,
    criarProduto,
    atualizarProduto,
    deletarProduto
} = require('../controllers/produtoController');

router.get('/produtos', listarProdutos);

router.get('/produtos/:id', buscarProdutoPorId);
    
router.post('/produtos', criarProduto);

router.put('/produtos/:id', atualizarProduto);

router.delete('/produtos/:id', deletarProduto);

module.exports = router;