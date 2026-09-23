const express = require('express');
const cors = require('cors');
const { getDatabaseConnection } = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const {carregaClientes, cadastraCliente, atualizaCliente, deletaCliente} = require("../scripts/clientes.js")



// Rota de teste
app.get('/', (req, res) => {
  res.json({ status: 'API AnaClean ativa e conectada ao banco!' });
});


// Página Clinte
// Listar clientes cadastrados
app.get('/clientes', async (req, res) => {
  const resposta = await carregaClientes()
 
  res.json(resposta)
});

// Cadastrar novo cliente
app.post('/clientes', async (req, res) => {
  if (req.body.Id==''){
    const resposta = await cadastraCliente(req)
    console.log(resposta)
    res.json(resposta)
  }else{
      const resposta = await atualizaCliente(req.body)
      console.log(resposta)
      res.json(resposta)
  }
});


///DELETA CLIENTE CONFORME ID
app.post('/Deletacliente', async(req, res) =>{
  const resposta = await deletaCliente(req.body.Id)
  res.json(resposta)   
})




app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});