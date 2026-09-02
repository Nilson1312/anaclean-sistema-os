const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function getDatabaseConnection() {
  const db = await open({
    filename: path.resolve(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  await db.exec('PRAGMA foreign_keys = ON;');

  await db.exec(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      telefone TEXT NOT NULL,
      email TEXT,
      endereco TEXT NOT NULL,
      numero TEXT,
      bairro TEXT,
      cidade TEXT DEFAULT 'São Paulo',
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS servicos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      descricao TEXT,
      valor_base REAL NOT NULL,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ordens_servico (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER NOT NULL,
      status TEXT DEFAULT 'Pendente',
      data_agendamento TEXT NOT NULL,
      data_conclusao TEXT,
      valor_total REAL DEFAULT 0.00,
      forma_pagamento TEXT,
      observacoes TEXT,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS itens_ordem_servico (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ordem_servico_id INTEGER NOT NULL,
      servico_id INTEGER NOT NULL,
      quantidade INTEGER NOT NULL DEFAULT 1,
      preco_unitario REAL NOT NULL,
      FOREIGN KEY (ordem_servico_id) REFERENCES ordens_servico(id) ON DELETE CASCADE,
      FOREIGN KEY (servico_id) REFERENCES servicos(id)
    );
  `);

  return db;
}

module.exports = { getDatabaseConnection };