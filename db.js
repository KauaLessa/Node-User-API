const { Sequelize } = require('sequelize');

// Configuração da conexão com SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db.sqlite', // Define o caminho para o arquivo do banco
});

module.exports = sequelize;
