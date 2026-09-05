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
    const clientes = await db.all('SELECT * FROM clientes ORDER BY Id DESC');
    res.json(clientes);
    console.log('Dados enviados para a tabela no site!')
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Cadastrar novo cliente
app.post('/clientes', async (req, res) => {
  console.log(req.body)
  const { nome, telefone, email, endereco, numero, bairro, cidade } = req.body;
  console.log(nome)
  
  try {
    const db = await getDatabaseConnection();
    const resultado = await db.run(
      `INSERT INTO clientes (nome, telefone, email, endereco, numero, bairro, cidade) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nome, telefone, email, endereco, numero, bairro, cidade || 'São Paulo']
    );
    res.status(201).json({ id: resultado.lastID, mensagem: 'Cliente salvo com sucesso!' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ erro: error.message });
  }
});


///DELETA CLIENTE CONFORME ID
app.post('/Deletacliente', async(req, res) =>{
  console.log("Chamada Del feita!")
  const id = req.body.Id
  try{
    const db = await getDatabaseConnection()
    await db.run('DELETE FROM clientes WHERE id = ?',[id])
  }
  catch(error){
    res.status(500).json({ erro: error.message });
  }
   
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});