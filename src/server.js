const express = require('express');
const cors = require('cors');
const { getDatabaseConnection } = require('./database');

const app = express();
const PORT = 3000;
const path = require("path")

app.use(cors());
app.use(express.json());


const {carregaServicos, cadastraServico, atualizaServico, deletaServico, buscaServicoId, buscaServicoCampo} = require("../scripts/servicos.js")
const {carregaClientes, cadastraCliente, atualizaCliente, deletaCliente, buscaClienteId, buscaClienteCampo} = require("../scripts/clientes.js")
const {carregaOrdem, cadastraOrdem, atualizaOrdem, buscaOrdemId, buscaOrdemCampo} = require("../scripts/ordem.js")
const {carregaItens,cadastraItem,deletaItem,buscaItemId, buscaItemCampo, verificaOrdem} = require("../scripts/itens_ordem_servico.js")


app.use(express.static(path.join(__dirname, "..", "HTML")))
app.use("/css", express.static(path.join(__dirname, "..", "CSS")))
// Página de teste
// Derruba banco de dados Clientes
app.get("/ClientesDerruba", async ()=>{
  const db = await getDatabaseConnection();
    const resultado = await db.run("DROP TABLE clientes")
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


// Carrega os dados do banco Serviços
app.get('/servicos', async (req, res) => {
  const resposta = await carregaServicos()
  res.json(resposta)
});

// Cadastrar/Atualizar serviços
app.post('/servicos', async (req, res) => {
  if (req.body.Id==null){
      const resposta = await cadastraServico(req)
      res.json(resposta)
  }else{
      const resposta = await atualizaServico(req.body)
      res.json(resposta)
  }
});


///DELETA SERVIÇO CONFORME ID
app.post('/DeletaServico', async(req, res) =>{
  const resposta = await deletaServico(req.body.Id)
  res.json(resposta)   
})

/// Busca serviços através de dados parciais
app.post("/BuscaServico", async(req,res)=>{
  if (req.body.Id != null && req.body.Id != ""){
    const resposta = await buscaServicoId(req.body.Id)
    res.json(resposta)
  }else{
    const resposta = await buscaServicoCampo(req.body)
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
    if (req.body.Id == null && req.body.form.Id !=""){
      const resultado = await (cadastraOrdem(req.body))
      res.status(201).json(resultado)
    }else{
      const resultado = await(atualizaOrdem(req.body))
      res.status(201).json(resultado)
      
    }
    
    


})


// Traz ordens através de dados 
app.post("/BuscaOrdem", async(req,res)=>{
  if (req.body.form.Id != "" && req.body.form.Id != null){
   const resposta = await buscaOrdemId(req.body)
   res.json(resposta)
  }else{
    const resposta = await buscaOrdemCampo(req.body)
    res.json(resposta)
  }
})

// Carrega os itens 
app.get('/itens', async (req, res) => {
  const resposta = await carregaItens()
  res.json(resposta)
})


// Cadastra os itens
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

app.post("/deletaItem", async(req,res) =>{
  const resultado = await deletaItem(req.body)
  res.json(resultado)
})

// Verifica se existem ordens sem serviços
app.get("/VerificaItem", async (req,res)=>{
    const resultado = await verificaOrdem()
    res.json(resultado)
})

// Faz a busca dos itens da ordem
app.post("/BuscaItem", async(req,res)=>{
  if (req.body.Id != "" && req.body.Id != null){
   const resposta = await buscaItemId(req.body.Id)
   res.json(resposta)
  }else{
    const resposta = await buscaItemCampo(req.body)
    res.json(resposta)
  }
})



app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

