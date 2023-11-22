// const mongoose = require('mongoose');

// const dbConnection = async() => {

//     try {
//         await mongoose.connect( process.env.DB_CNN, {
//             // useNewUrlParser: true,
//             // useUnifiedTopology: true
//         });

//         console.log('DB Online');

//     } catch (error) {
//         console.log(error);
//         throw new Error('Error en la base de datos - Hable con el admin');
//     }

// }

// module.exports = {
//     dbConnection
// }

const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'clave123',
  port: 5432, // El puerto por defecto de PostgreSQL es 5432
  database: 'parte1',
});

module.exports = {
  pool
}