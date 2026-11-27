const Movie = require('../models/movie')

// Obtener todas las películas
exports.listMovies = async (req, res) => {
  try {
    const movies = await Movie.find()
    const genre = req.query.genre

    if (genre) {
      const genreLower = String(genre).toLowerCase()

      const filteredMovies = movies.filter(movie =>
        movie.genre.some(g => g.toLowerCase() === genreLower)
      )

      return res.json(filteredMovies)
    }

    return res.json(movies)

  } catch (error) {
    console.error('Error al obtener películas:', error.message)

    return res.status(500).json({
      message: 'Error retrieving movies'
    })
  }
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function isValidMovieId(id) {
  return UUID_REGEX.test(id)
}

// Funciones auxiliares para validar el body
// y seleccionar únicamente los campos permitidos
const campsPermesos = [
  'title',
  'year',
  'director',
  'duration',
  'genre',
  'rate',
  'poster'
]

function isPlainObject(value) {
  return value !== null &&
         typeof value === 'object' &&
         !Array.isArray(value)
}

function movieData(body) {
  const data = {}

  for (const camp of campsPermesos) {
    if (Object.hasOwn(body, camp)) {
      data[camp] = body[camp]
    }
  }

  return data
}

// Obtener una película por ID
exports.getMovie = async (req, res) => {
  try {
    if (!isValidMovieId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid movie ID'
      })
    }

    const movie = await Movie.findOne({
      id: req.params.id
    })

    if (!movie) {
      return res.status(404).json({
        message: 'Movie not found'
      })
    }

    return res.json(movie)

  } catch (error) {
    console.error('Error al obtener la película:', error.message)

    return res.status(500).json({
      message: 'Error retrieving movie'
    })
  }
}

// Crear una nueva película
exports.createMovie = async (req, res) => {
  try {
    if (!isPlainObject(req.body)) {
      return res.status(400).json({
        message: 'El cuerpo debe ser un objeto JSON'
      })
    }

    const movie = await Movie.create(
      movieData(req.body)
    )

    return res.status(201).json(movie)

  } catch (error) {

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: error.message
      })
    }

    console.error('Error al crear la película:', error.message)

    return res.status(500).json({
      message: 'Error creating movie'
    })
  }
}
// Modificar una película existente
// Este bloque se ha movido desde app.js al controlador
// para aplicar correctamente el patrón MVC
exports.updateMovie = async (req, res) => {
  try {
    if (!isValidMovieId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid movie ID'
      })
    }

    if (!isPlainObject(req.body)) {
      return res.status(400).json({
        message: 'El cuerpo debe ser un objeto JSON'
      })
    }

    const changes = movieData(req.body)

    if (Object.keys(changes).length === 0) {
      return res.status(400).json({
        message: 'No hay campos válidos para modificar'
      })
    }

    const movie = await Movie.findOne({
      id: req.params.id
    })

    if (!movie) {
      return res.status(404).json({
        message: 'Movie not found'
      })
    }

    Object.assign(movie, changes)

    await movie.save()

    return res.json(movie)

  } catch (error) {

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: error.message
      })
    }

    console.error('Error al modificar la película:', error.message)

    return res.status(500).json({
      message: 'Error updating movie'
    })
  }
}

// Eliminar una película por su ID
exports.deleteMovie = async (req, res) => {
  try {
    if (!isValidMovieId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid movie ID' })
    }

    const movie = await Movie.findOneAndDelete({ id: req.params.id })

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    return res.json({ message: 'Movie deleted successfully' })
  } catch (error) {
    console.error('Error al eliminar la película:', error.message)
    return res.status(500).json({ message: 'Error deleting movie' })
  }
}