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
    const id = dados + "%" 
    const db = await getDatabaseConnection()
    var ordem = await db.all("SELECT * FROM ordens_servico WHERE Id LIKE ?",[id])    
    return ordem
}


async function buscaOrdemCampo(dado){
    let contagem = 0
    const lista = [5]
    const dados = [5]
    Object.keys(dado).forEach(valor => {
        if(dado[valor] !=''){
            lista[contagem] = valor
            dados[contagem] = "%" + dado[valor] + "%"
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
    return ordem
}




module.exports = {carregaOrdem, cadastraOrdem, atualizaOrdem, buscaOrdemId,buscaOrdemCampo}