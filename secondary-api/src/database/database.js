const Database = require('better-sqlite3');

const db = new Database('produtos.db');

console.log('Banco de produtos conectado!');

db.exec(`
    CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        categoria TEXT NOT NULL,
        tamanho TEXT NOT NULL,
        preco REAL NOT NULL,
        estoque INTEGER NOT NULL
    );
`);

console.log('Tabela de produtos verificada/criada!');

module.exports = db;