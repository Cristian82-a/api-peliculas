require('dotenv').config()

const path = require('path')
const express = require('express')
const nunjucks = require('nunjucks')
const connectDB = require('./config/database')

const moviesApiRouter = require('./routes/movies-api')
const moviesViewsRouter = require('./routes/movies-views')

const app = express()

// Configuración de Nunjucks (plantillas en la carpeta views/)
nunjucks.configure(path.join(__dirname, 'views'), {
  autoescape: true,
  express: app
})
app.set('view engine', 'njk')

app.use(express.json({ limit: '100kb' }))
app.use(express.urlencoded({ extended: false })) // para leer formularios HTML

app.use('/', moviesApiRouter)        // API JSON
app.use('/web', moviesViewsRouter)   // páginas web

// Bloque borrado: rutas y lógica de películas.
// Ahora están en routes/ y controllers/ siguiendo MVC.

const PORT = process.env.PORT || 3000

async function startServer() {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
  })
}

startServer()