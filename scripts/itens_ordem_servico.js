/** esqeuce é tudo not null '-' */
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
async function verificaOrdem(){
    const db = await getDatabaseConnection()
    const resultado = await db.all("SELECT * FROM ordens_servico WHERE id NOT IN (SELECT ordem_servico_id FROM itens_ordem_servico)")
    return resultado
}



module.exports={carregaItens,cadastraItem, verificaOrdem}