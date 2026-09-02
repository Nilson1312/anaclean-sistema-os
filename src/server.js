const express = require('express');
const cors = require('cors');
const { getDatabaseConnection } = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.json({ status: 'API AnaClean ativa e conectada ao banco!' });
});

// Listar clientes cadastrados
app.get('/clientes', async (req, res) => {
  try {
    const db = await getDatabaseConnection();
    const clientes = await db.all('SELECT * FROM clientes');
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Cadastrar novo cliente
app.post('/clientes', async (req, res) => {
  const { nome, telefone, email, endereco, numero, bairro, cidade } = req.body;
  try {
    const db = await getDatabaseConnection();
    const resultado = await db.run(
      `INSERT INTO clientes (nome, telefone, email, endereco, numero, bairro, cidade) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nome, telefone, email, endereco, numero, bairro, cidade || 'São Paulo']
    );
    res.status(201).json({ id: resultado.lastID, mensagem: 'Cliente salvo com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});