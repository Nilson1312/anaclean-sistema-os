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



async function buscaClienteId(dados){
    const id = dados + "%" 
    const db = await getDatabaseConnection()
    var cliente = await db.all("SELECT * FROM clientes WHERE Id LIKE ?",[id])    
    return cliente
}


async function buscaClienteCampo(dado){
    let contagem = 0
    const lista = [7]
    const dados = [7]
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

    
   
    const comando = "SELECT * FROM clientes WHERE " + campos
    
    const db = await getDatabaseConnection()
    var cliente = await db.all(comando,[...dados])
    return cliente
}












module.exports = {carregaClientes, cadastraCliente, atualizaCliente, deletaCliente, buscaClienteId, buscaClienteCampo}