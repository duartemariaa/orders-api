# 📦 Orders API

API REST para gerenciamento de pedidos, desenvolvida com Node.js, Express e SQLite.
Permite criar, consultar, atualizar e remover pedidos, armazenando os dados em um banco de dados SQLite.

## 🚀 Como executar

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o servidor
npm start

```

## 📋 Endpoints

| Método | URL | Descrição |
|--------|-----|-----------|
| POST   | `/order` | Criar pedido |
| GET    | `/order/list` | Listar todos os pedidos |
| GET    | `/order/:orderId` | Buscar pedido por ID |
| PUT    | `/order/:orderId` | Atualizar pedido |
| DELETE | `/order/:orderId` | Deletar pedido |

## 📥 Exemplo de requisição (POST /order)

```json
{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}
```

## 🗄️ Estrutura do Banco de Dados (SQLite)

**Tabela: Order**
- `orderId` TEXT PRIMARY KEY
- `value` REAL
- `creationDate` TEXT

**Tabela: Items**
- `id` INTEGER (auto)
- `orderId` TEXT (FK → Order)
- `productId` INTEGER
- `quantity` INTEGER
- `price` REAL
