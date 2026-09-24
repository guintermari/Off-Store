const express = require('express');
const cors = require('cors');


const db = require('./database/database');
const pedidoRoutes = require('./routes/pedidoRoutes');


const app = express();

app.use(cors());
app.use(express.json());

app.use(pedidoRoutes);

const PORT = 3000;

app.get('/', (req, res) => {
    res.json({
        message: 'Off Store API funcionando!'
    });
});

app.listen(PORT, () => {
    console.log(`Off Store API rodando em http://localhost:${PORT}`);
});