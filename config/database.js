/*mongoose.connect(): establece la conexión con MongoDB.



process.env.MONGODB_URI: obtiene la dirección desde .env.



try / catch: permite detectar errores de conexión.



process.exit(1): detiene la aplicación si no consigue conectarse.



module.exports: permite utilizar connectDB() desde app.js.*/

const mongoose = require('mongoose')

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Conectado a MongoDB correctamente')
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error.message)
    process.exit(1)
  }
}

module.exports = connectDB