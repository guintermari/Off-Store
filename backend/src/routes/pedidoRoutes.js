const express = require('express');

const router = express.Router();

const {
    criarPedido,
    listarPedidos,
    buscarPedidoPorId,
    atualizarPedido,
    deletarPedido
} = require('../controllers/pedidoController');

router.post('/pedidos', criarPedido);

router.get('/pedidos', listarPedidos);

router.get('/pedidos/:id', buscarPedidoPorId);

router.put('/pedidos/:id', atualizarPedido);

router.delete('/pedidos/:id', deletarPedido);

module.exports = router;