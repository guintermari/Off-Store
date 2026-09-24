const express = require('express');
const cors = require('cors');

const db = require('./database/database');
const produtoRoutes = require('./routes/produtoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use(produtoRoutes);

const PORT = 3001;

app.get('/', (req, res) => {
    res.json({
        message: 'Off Store API Secundária funcionando!'
    });
});

app.listen(PORT, () => {
    console.log(`API Secundária rodando em http://localhost:${PORT}`);
});