require('dotenv').config(); // Carrega as variáveis do arquivo .env

const app = require('./app');
const { initDatabase } = require('./src/database/init');

const PORT = process.env.PORT || 3000;

initDatabase(); // Inicializa o banco de dados (cria as tabelas se não existirem)

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📋 Endpoints disponíveis:`);
  console.log(`   POST   http://localhost:${PORT}/order`);
  console.log(`   GET    http://localhost:${PORT}/order/:orderId`);
  console.log(`   GET    http://localhost:${PORT}/order/list`);
  console.log(`   PUT    http://localhost:${PORT}/order/:orderId`);
  console.log(`   DELETE http://localhost:${PORT}/order/:orderId`);
});