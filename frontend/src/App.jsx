import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [checkoutAberto, setCheckoutAberto] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [pedidos, setPedidos] = useState([]);
  const [historicoAberto, setHistoricoAberto] = useState(false);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then((resposta) => resposta.json())
      .then((dados) => {
        setProdutos(dados);
      })
      .catch((erro) => {
        console.error('Erro ao buscar produtos:', erro);
      });
  }, []);

function adicionarAoCarrinho(produto) {
  const produtoExistente = carrinho.find(
    (item) => item.id === produto.id
  );

  if (produtoExistente) {
    setCarrinho(
      carrinho.map((item) =>
        item.id === produto.id
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      )
    );
  } else {
    setCarrinho([
      ...carrinho,
      {
        ...produto,
        quantidade: 1
      }
    ]);
  }
}
function aumentarQuantidade(id) {
  setCarrinho(
    carrinho.map((item) =>
      item.id === id
        ? { ...item, quantidade: item.quantidade + 1 }
        : item
    )
  );
}

function diminuirQuantidade(id) {
  setCarrinho(
    carrinho
      .map((item) =>
        item.id === id
          ? { ...item, quantidade: item.quantidade - 1 }
          : item
      )
      .filter((item) => item.quantidade > 0)
  );
}

async function finalizarPedido() {
  if (!nome || !email) {
    alert('Please enter your name and email.');
    return;
  }

  if (carrinho.length === 0) {
    alert('Your cart is empty.');
    return;
  }

  const itens = carrinho.map((produto) => ({
    produto_id: produto.id,
    quantidade: produto.quantidade
  }));

  try {
    const resposta = await fetch('http://localhost:3000/pedidos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cliente: {
          nome: nome,
          email: email
        },
        itens: itens
      })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      alert(dados.erro || 'Error placing order.');
      return;
    }

    alert('Order placed successfully!');

    setCarrinho([]);
    setNome('');
    setEmail('');
    setCheckoutAberto(false);

  } catch (erro) {
    console.error('Error:', erro);
    alert('Could not connect to the server.');
  }
}

  const categorias = [...new Set(produtos.map((produto) => produto.category))];
  
  const totalCarrinho = carrinho.reduce(
  (total, produto) => total + produto.price * produto.quantidade,
  0
);
async function carregarPedidos() {
  try {
    const resposta = await fetch('http://localhost:3000/pedidos');

    const dados = await resposta.json();

    setPedidos(dados);
    setHistoricoAberto(true);

  } catch (erro) {
    console.error('Erro ao buscar pedidos:', erro);
  }
}

  return (
    <div>
      <header>
        <h1>OFF STORE</h1>
        <p>Fashion & Lifestyle</p>
      </header>

      <main>
        <h2>Our Products</h2>

        {categorias.map((categoria) => (
          <section className="categoria" key={categoria}>

            <h2>{categoria}</h2>

            <div className="produtos">
              {produtos
                .filter((produto) => produto.category === categoria)
                .map((produto) => (
                  <div className="produto" key={produto.id}>

                    <img
                      src={produto.image}
                      alt={produto.title}
                      className="imagem-produto"
                    />

                    <h3>{produto.title}</h3>

                    <p className="preco">
                      ${produto.price.toFixed(2)}
                    </p>

                    <button onClick={() => adicionarAoCarrinho(produto)}>
                      Add to cart
                    </button>

                  </div>
                ))}
            </div>

  </section>
))}
      </main>

      <aside className="carrinho">
        <h2>Shopping Cart</h2>

        <p>{carrinho.length} item(s)</p>

        {carrinho.map((produto) => (
        <div className="item-carrinho" key={produto.id}>

          <strong>{produto.title}</strong>

          <span>
            ${(produto.price * produto.quantidade).toFixed(2)}
          </span>

          <div className="quantidade">

            <button onClick={() => diminuirQuantidade(produto.id)}>
              −
            </button>

            <span>{produto.quantidade}</span>

            <button onClick={() => aumentarQuantidade(produto.id)}>
              +
            </button>

          </div>

        </div>
      ))}
      <div className="total-carrinho">
        <strong>Total:</strong>
        <span>${totalCarrinho.toFixed(2)}</span>
      </div>
        <button
          className="checkout-button"
          onClick={() => setCheckoutAberto(true)}
        >
          Checkout
        </button>
        <button
          className="history-button"
          onClick={carregarPedidos}
        >
          Order History
        </button>
      </aside>
      {checkoutAberto && (
        <div className="checkout">

          <h2>Checkout</h2>

          <label>
            Name
          </label>

          <input
            type="text"
            placeholder="Enter your name"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <label>
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button onClick={finalizarPedido}>
            Place Order
          </button>

          <button
            className="close-button"
            onClick={() => setCheckoutAberto(false)}
          >
            Cancel
          </button>

        </div>
      )}

      {historicoAberto && (
        <div className="historico">

          <h2>Order History</h2>

          {pedidos.map((pedido) => (
            <div className="pedido" key={pedido.id}>

              <div className="pedido-topo">
                <strong>Order #{pedido.id}</strong>

                <span>{pedido.status}</span>
              </div>

              <p>
                Customer: {pedido.cliente}
              </p>

              <p>
                Email: {pedido.email}
              </p>

              <p>
                Total: ${pedido.valor_total.toFixed(2)}
              </p>

              <p>
                Date: {pedido.data}
              </p>

            </div>
          ))}

          <button
            onClick={() => setHistoricoAberto(false)}
          >
            Close
          </button>

        </div>
      )}

    </div>
    
  );
}

export default App;