const { getDatabaseConnection } = require('../src/database.js');



async function carregaClientes (){
    try{
        const db = await getDatabaseConnection();
        const clientes = await db.all('SELECT * FROM clientes ORDER BY Id DESC')
        return clientes
    } catch (error){
        return error
    }
}




async function cadastraCliente(dados){
    try{
    const {nome, telefone, email, endereco, numero, bairro, cidade} = dados.body
    const db = await getDatabaseConnection();
    const resultado = await db.run(
        `INSERT INTO clientes (nome, telefone, email, endereco, numero, bairro, cidade) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [nome, telefone, email, endereco, numero, bairro, cidade || "São Paulo"])
    const encomenda = {Id:resultado.lastID, Mensagem: "Cadastrou"
    }
    return encomenda

    }catch(error){
        return error
    }
}


async function atualizaCliente(dados){
    const id = dados.Id

    const camposselecionados = ['nome','telefone','email','endereco','numero','bairro','cidade']
     try {
    const campos = Object.keys(dados).filter(campo => camposselecionados.includes(campo) && dados[campo] !== '') 
    const valores = campos.map(campo => dados[campo])

    const set = campos
    .map(campo => `${campo} = ?`)
    .join(', ')
   
    const db = await getDatabaseConnection();
    const resultado = await db.run(
        `UPDATE clientes
        SET ${set}
        WHERE id = ?`,[...valores, id])
        const encomenda = {Id:id, Mensagem: "Atualixou" }
        return encomenda
    } catch(error){
        return error
    }
}

async function deletaCliente(id){
    try{
        const db = await getDatabaseConnection()
        await db.run("DELETE FROM clientes WHERE id = ?", [id])
        return "Deletou"
    } catch(error){
        return error
    }
    
}
module.exports = {carregaClientes, cadastraCliente, atualizaCliente, deletaCliente}