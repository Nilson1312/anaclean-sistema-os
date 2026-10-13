const { getDatabaseConnection } = require('../src/database.js');

async function carregaItens(){
        const db = await getDatabaseConnection();
        const itens = await db.all('SELECT * FROM itens_ordem_servico ORDER BY Id DESC')
        return itens
}   

async function cadastraItem(dados){
    const  {ordem_servico_id, servico_id, quantidade, preco_unitario} = dados
    const db = await getDatabaseConnection()
    const resultado = await db.run("INSERT INTO itens_ordem_servico (ordem_servico_id, servico_id, quantidade, preco_unitario) values(?,?,?,?)",[ordem_servico_id, servico_id, quantidade || 1, preco_unitario])
    return resultado
}

async function deletaItem(dados){
    const {ordem_servico_id, servico_id} = dados
    const db = await getDatabaseConnection()
    const resultado = await db.run("DELETE FROM itens_ordem_servico WHERE ordem_servico_id = ? AND servico_id = ?",[ordem_servico_id,servico_id])
    return resultado
}
async function verificaOrdem(){
    const db = await getDatabaseConnection()
    const resultado = await db.all("SELECT * FROM ordens_servico WHERE id NOT IN (SELECT ordem_servico_id FROM itens_ordem_servico)")
    return resultado
}

async function buscaItemId(dados){
    const id = dados + "%" 
    const db = await getDatabaseConnection()
    var item = await db.all("SELECT * FROM itens_ordem_servico WHERE Id LIKE ?",[id])  
    return item
}


async function buscaItemCampo(dado){
    let contagem = 0
    const lista = [6]
    const dados = [4]
    Object.keys(dado).forEach(valor => {
        if(dado[valor] !=''){
            lista[contagem] = valor
            dados[contagem] = dado[valor] 
            contagem++
        }
    })
    var campos = ""
    lista.forEach(valor =>{
        if (lista.indexOf(valor)  == lista.length-1){
            campos = campos +(valor + " LIKE ?") 
        }else{
            campos = campos +(valor + " LIKE ? AND ")
        }
    })

    
   
    const comando = "SELECT * FROM itens_ordem_servico WHERE " + campos
    const db = await getDatabaseConnection()
    var itens = await db.all(comando,[...dados])
    return itens
}




module.exports={carregaItens,cadastraItem,deletaItem,buscaItemId, buscaItemCampo, verificaOrdem}