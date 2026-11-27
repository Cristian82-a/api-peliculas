const express = require('express') // importamos express
const moviesController = require('../controllers/movies') // importamos controlador

const router = express.Router() // creamos el router

// Obtener todas las películas
router.get('/movies', moviesController.listMovies)

// Obtener una película por ID
router.get('/movies/:id', moviesController.getMovie)

// Crear una película
router.post('/movies', moviesController.createMovie)

// Modificar una película
router.patch('/movies/:id', moviesController.updateMovie)

// Eliminar una película
router.delete('/movies/:id', moviesController.deleteMovie)

module.exports = router // exportamos el router