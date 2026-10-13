const { getDatabaseConnection } = require('../src/database.js');


async function carregaServicos (){
    try{
        const db = await getDatabaseConnection();
        const servicos = await db.all('SELECT * FROM servicos ORDER BY Id DESC')
        return servicos
    } catch (error){
        return error
    }
}




async function cadastraServico(dados){
    try{
    const {titulo,descricao,valor_base} = dados.body
    const db = await getDatabaseConnection();
    const resultado = await db.run(
        `INSERT INTO servicos (titulo,descricao,valor_base) 
        VALUES (?, ?, ?)`,
        [titulo,descricao,valor_base])
    const encomenda = {Status:200, Mensagem: "Serviço cadastrado!"
    }
    return encomenda

    }catch(error){
        return error
    }
}


async function atualizaServico(dados){
    const id = dados.Id

    const camposselecionados = ["titulo","descricao","valor_base"]
     try {
    const campos = Object.keys(dados).filter(campo => camposselecionados.includes(campo) && dados[campo] !== '') 
    const valores = campos.map(campo => dados[campo])

    const set = campos
    .map(campo => `${campo} = ?`)
    .join(', ')
   
    const db = await getDatabaseConnection();
    db.run(
        `UPDATE servicos
        SET ${set}
        WHERE id = ?`,[...valores, id])
        const encomenda = {Status:200, Mensagem: "Serviço atualizado!" }
        return encomenda
    } catch(error){
        return error
    }
}

async function deletaServico(id){
    try{
        const db = await getDatabaseConnection()
        await db.run("DELETE FROM servicos WHERE id = ?", [id])
        const resultado = {Status:200, Mensagem:"Serviço deletado com sucesso!"}
        return resultado
    } catch(error){
        if (error.code == "SQLITE_CONSTRAINT"){
            const erro = {Status:402, Mensagem:"Incapaz de deletar serviço, ainda ligado em alguma ordem"}
            return erro
        }
        
    }
    
}



async function buscaServicoId(dados){
    const id = dados + "%" 
    const db = await getDatabaseConnection()
    var cliente = await db.all("SELECT * FROM servicos WHERE Id LIKE ?",[id])    
    return cliente
}


async function buscaServicoCampo(dado){
    let contagem = 0
    const lista = [4]
    const dados = [4]
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

    
   
    const comando = "SELECT * FROM servicos WHERE " + campos
    const db = await getDatabaseConnection()
    var servico = await db.all(comando,[...dados])
    return servico
}












module.exports = {carregaServicos, cadastraServico, atualizaServico, deletaServico, buscaServicoId, buscaServicoCampo}