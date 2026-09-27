#  OFF STORE

> E-commerce desenvolvido como projeto acadêmico utilizando React, Node.js, APIs REST, SQLite e Docker.

##  Sobre o projeto

O **OFF STORE** é uma aplicação de loja virtual que permite:

- Visualizar produtos por categoria;
- Adicionar produtos ao carrinho;
- Realizar o checkout;
- Criar pedidos;
- Consultar o histórico de pedidos.

Os produtos são obtidos através da **Fake Store API**, enquanto o backend é responsável pelo processamento e armazenamento dos pedidos.

##  Tecnologias

| Componente | Tecnologias |
|---|---|
| Frontend | React, Vite, JavaScript, CSS |
| Backend | Node.js, Express, SQLite |
| API Secundária | Node.js, Express, SQLite |
| API Externa | Fake Store API |
| Containerização | Docker e Docker Compose |


##  Funcionalidades

-  Catálogo de produtos
-  Produtos separados por categoria
-  Carrinho de compras
-  Checkout
-  Criação de pedidos
-  Histórico de pedidos
-  APIs REST
-  Banco de dados SQLite
-  Integração com API externa
-  Docker e Docker Compose

##  API Externa

O projeto utiliza a Fake Store API como fonte externa de dados dos produtos.

A API é pública e pode ser utilizada sem cadastro ou chave de API.

Link API: https://fakestoreapi.com/

### Rota utilizada

GET https://fakestoreapi.com/products

Essa rota é consumida diretamente pelo frontend, e os dados recebidos são tratados e apresentados dentro da aplicação.

##  Fluxograma 

[![Fluxograma da arquitetura](./docs/arquitetura-off-store.svg)](https://github.com/guintermari/Off-Store/blob/main/Docs/arquitetura.png)

##  Projeto acadêmico

Projeto desenvolvido para aplicação prática de conceitos de **arquitetura de software** aprendido na sprint.
