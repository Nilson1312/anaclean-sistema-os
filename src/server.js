const express = require('express');
const cors = require('cors');
const { getDatabaseConnection } = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const {carregaClientes, cadastraCliente, atualizaCliente, deletaCliente, buscaClienteId, buscaClienteCampo} = require("../scripts/clientes.js")
const {carregaOrdem, cadastraOrdem, atualizaOrdem, buscaOrdemId, buscaOrdemCampo} = require("../scripts/ordem.js")
const {carregaItens,cadastraItem,verificaOrdem} = require("../scripts/itens_ordem_servico.js")



// Página de teste
// Derruba banco de dados Clientes
app.get("/ClientesDerruba", async ()=>{
  const db = await getDatabaseConnection();
    const resultado = await db.run("DROP TABLE clientes"
  )
})



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

// Cadastrar/Atualizar cliente
app.post('/clientes', async (req, res) => {
  if (req.body.Id==''){
    const resposta = await cadastraCliente(req)
    res.json(resposta)
  }else{
      const resposta = await atualizaCliente(req.body)

      res.json(resposta)
  }
});


///DELETA CLIENTE CONFORME ID
app.post('/Deletacliente', async(req, res) =>{
  const resposta = await deletaCliente(req.body.Id)
  res.json(resposta)   
})

/// Busca clientes através de dados parciais
app.post("/BuscaCliente", async(req,res)=>{
  if (req.body.Id != ""){
    const resposta = await buscaClienteId(req.body.Id)
    res.json(resposta)
  }else{
    const resposta = await buscaClienteCampo(req.body)
    res.json(resposta)
  }
  
})










// Carregar no site
app.get('/ordens', async (req, res) => {
  const resposta = await carregaOrdem()
 
  res.json(resposta)
});
// Cadastra e atualiza Ordens
app.post("/ordens", async(req,res)=>{
    if (req.body.Id == null){
      const resultado = await (cadastraOrdem(req.body))
      res.status(201).json(resultado)
    }else{
      const resultado = await(atualizaOrdem(req.body))
      res.status(201).json(resultado)
      
    }
    
    


})


// Traz ordens através de dados 
app.post("/BuscaOrdem", async(req,res)=>{
  if (req.body.Id != ""){
   const resposta = await buscaOrdemId(req.body.Id)
   res.json(resposta)
  }else{
    const resposta = await buscaOrdemCampo(req.body)
    res.json(resposta)
  }
})

//Parte dos itens
app.get('/itens', async (req, res) => {
  const resposta = await carregaItens()
 
  res.json(resposta)
});
app.post("/cadastraItem", async(req,res)=>{
  try{
    const resultado = await cadastraItem(req.body)
    res.status(201).json(resultado)
  } catch(error){
    
    if (error.code == "SQLITE_CONSTRAINT"){
      res.status(409).json({message:"Dados não batem com o esperado!"})
    }
  }
})

app.get("/buscaItem", async (req,res)=>{
    const resultado = await verificaOrdem()
    res.json(resultado)
})



app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});