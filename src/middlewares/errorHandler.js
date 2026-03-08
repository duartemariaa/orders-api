/**
 * Middleware para rotas não encontradas (404).
 * É chamado quando nenhuma rota anterior correspondeu à requisição.
 */
function notFound(req, res, next) {
  res.status(404).json({
    error: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
  });
}

/**
 * Middleware global de tratamento de erros.
 * Express identifica este como handler de erro pelo 4º parâmetro (err).
 */
function errorHandler(err, req, res, next) {
  console.error('Erro não tratado:', err.stack);
  res.status(500).json({
    error: 'Erro interno inesperado no servidor.',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
}

module.exports = { notFound, errorHandler };