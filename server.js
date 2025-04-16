const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const projetosRoutes = require('./routers/projetos');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API
app.use('/projetos', projetosRoutes);

// Para rotas que não forem de API, retorna o index.html (SPA fallback opcional)
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
