const dbPromisify = require("../dbInteraction/dbPromisify");
const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
}


const connection = new dbPromisify(config)

module.exports = connection;