const { getDatabaseConnection } = require('../src/database.js');

async function carregaOrdem(){
    const db = await getDatabaseConnection();
    const resultado = await db.all('SELECT * FROM ordens_servico ORDER BY Id DESC')
    return resultado

}

async function cadastraOrdem(dados){
    const {cliente_id,data_agendamento,valor_total,forma_pagamento,observacoes} = dados
    const db = await getDatabaseConnection();
    const resultado = await db.run(
        `INSERT INTO ordens_servico (cliente_id,data_agendamento,valor_total,forma_pagamento, observacoes) 
        VALUES (?, ?, ?, ?,?)`,
        [cliente_id,data_agendamento,valor_total,forma_pagamento, observacoes])
    return resultado
}


async function atualizaOrdem(dados){
    const id = dados.Id
    const status = "Concluído"
    const conclusao = dados.data_conclusao
    const db = await getDatabaseConnection();
    const resultado = await db.run(
        `UPDATE ordens_servico
         SET status = ?,
             data_conclusao = ?
         WHERE id = ?`,[status, conclusao, id])
    return resultado
}



async function buscaOrdemId(dados){
    const id = dados.form.Id + "%" 
    const chave = dados.chave
    const db = await getDatabaseConnection()
    var ordem = await db.all("SELECT * FROM ordens_servico WHERE Id LIKE ?",[id])
    var itens = await db.all("SELECT * FROM itens_ordem_servico WHERE ordem_servico_id LIKE ?",[id])
    var encomenda =""
    if ((itens == null || itens=="") || chave == true){
          encomenda = ordem
    }else{
        encomenda = {Status:202, dados:[ordem, itens]}
    }
    return encomenda
}


async function buscaOrdemCampo(dado){

    const dadosForm = dado.form
    const chave = dado.chave
    let contagem = 0
    const lista = [8]
    const dados = [8]
    Object.keys(dadosForm).forEach(valor => {
        if(dadosForm[valor] !=''){
            lista[contagem] = valor
            dados[contagem] = "%" + dadosForm[valor] + "%"
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
    const comando = "SELECT * FROM ordens_servico WHERE " + campos
    const db = await getDatabaseConnection()
    var ordem = await db.all(comando,[...dados])
    var itensDesorganizado = await Promise.all(
        ordem.map(async valor=>{
            return await db.all("SELECT * FROM itens_ordem_servico WHERE ordem_servico_id = ?", [valor.id])
        }))
    const itensTodo = []
    contagem = 0
    itensDesorganizado.forEach(valor => {
        valor.forEach(linha =>{
            itensTodo[contagem] = linha
            contagem++
        })
        
    })
    const itens = itensTodo.filter(dado2 => dado2 !== undefined)
    if ((itens == null || itens=="") || chave == true){
        encomenda = ordem
    }else{
        encomenda = {Status:202, dados:[ordem, itens]}
    }
    return encomenda
}




module.exports = {carregaOrdem, cadastraOrdem, atualizaOrdem, buscaOrdemId,buscaOrdemCampo}