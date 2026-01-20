const { Sequelize } = require('sequelize');
require('dotenv').config();

async function initDb() {
  const sequelize = new Sequelize('', process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  });

  try {
    await sequelize.query(`CREATE DATABASE "${process.env.DB_NAME}";`);
    console.log('Database created successfully');
  } catch (err) {
    if (err.parent && err.parent.code === '42P04') {
      console.log('Database already exists');
    } else {
      console.error('Error creating database:', err);
    }
  } finally {
    await sequelize.close();
  }
}

initDb();
