const Movie = require('../models/movie')

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function isValidMovieId(id) {
  return UUID_REGEX.test(id)
}

// Convierte "Drama, Acción" en ['Drama', 'Acción']
function parseGenre(text) {
  return String(text || '')
    .split(',')
    .map(g => g.trim())
    .filter(Boolean)
}

// Datos del formulario -> objeto para Mongoose
function formData(body) {
  return {
    title: body.title,
    year: Number(body.year),
    director: body.director,
    duration: Number(body.duration),
    genre: parseGenre(body.genre),
    rate: body.rate === '' || body.rate === undefined ? undefined : Number(body.rate),
    poster: body.poster || undefined
  }
}

// Valores que se muestran en el formulario
function formValues(src) {
  return {
    title: src.title || '',
    year: src.year || '',
    director: src.director || '',
    duration: src.duration || '',
    genreText: Array.isArray(src.genre) ? src.genre.join(', ') : (src.genre || ''),
    rate: src.rate ?? '',
    poster: src.poster || ''
  }
}

function notFound(res) {
  return res.status(404).send('Película no encontrada')
}

// Listado
exports.list = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ title: 1 })
    return res.render('list.njk', { movies })
  } catch (error) {
    console.error('Error al listar:', error.message)
    return res.status(500).send('Error al obtener las películas')
  }
}

// Detalle
exports.detail = async (req, res) => {
  try {
    if (!isValidMovieId(req.params.id)) return notFound(res)
    const movie = await Movie.findOne({ id: req.params.id })
    if (!movie) return notFound(res)
    return res.render('detail.njk', { movie })
  } catch (error) {
    console.error('Error en detalle:', error.message)
    return res.status(500).send('Error al obtener la película')
  }
}

// Formulario de alta
exports.showNew = (req, res) => {
  return res.render('form.njk', {
    pageTitle: 'Nueva película',
    action: '/web/movies',
    values: formValues({}),
    error: null
  })
}

// Crear
exports.create = async (req, res) => {
  try {
    await Movie.create(formData(req.body))
    return res.redirect('/web/movies')
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).render('form.njk', {
        pageTitle: 'Nueva película',
        action: '/web/movies',
        values: formValues(req.body),
        error: error.message
      })
    }
    console.error('Error al crear:', error.message)
    return res.status(500).send('Error al crear la película')
  }
}

// Formulario de edición
exports.showEdit = async (req, res) => {
  try {
    if (!isValidMovieId(req.params.id)) return notFound(res)
    const movie = await Movie.findOne({ id: req.params.id })
    if (!movie) return notFound(res)
    return res.render('form.njk', {
      pageTitle: 'Editar película',
      action: `/web/movies/${movie.id}/edit`,
      values: formValues(movie),
      error: null
    })
  } catch (error) {
    console.error('Error al mostrar edición:', error.message)
    return res.status(500).send('Error al obtener la película')
  }
}

// Actualizar
exports.update = async (req, res) => {
  try {
    if (!isValidMovieId(req.params.id)) return notFound(res)
    const movie = await Movie.findOne({ id: req.params.id })
    if (!movie) return notFound(res)

    Object.assign(movie, formData(req.body))
    await movie.save()

    return res.redirect(`/web/movies/${movie.id}`)
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).render('form.njk', {
        pageTitle: 'Editar película',
        action: `/web/movies/${req.params.id}/edit`,
        values: formValues(req.body),
        error: error.message
      })
    }
    console.error('Error al actualizar:', error.message)
    return res.status(500).send('Error al actualizar la película')
  }
}

// Eliminar
exports.remove = async (req, res) => {
  try {
    if (!isValidMovieId(req.params.id)) return notFound(res)
    const movie = await Movie.findOneAndDelete({ id: req.params.id })
    if (!movie) return notFound(res)
    return res.redirect('/web/movies')
  } catch (error) {
    console.error('Error al eliminar:', error.message)
    return res.status(500).send('Error al eliminar la película')
  }
}

// Favorito: 1 clic = favorita, otro clic = deja de serlo
exports.toggleFavorite = async (req, res) => {
  try {
    if (!isValidMovieId(req.params.id)) return notFound(res)
    const movie = await Movie.findOne({ id: req.params.id })
    if (!movie) return notFound(res)

    movie.favorite = !movie.favorite
    await movie.save()

    return res.redirect('/web/movies')
  } catch (error) {
    console.error('Error al cambiar favorito:', error.message)
    return res.status(500).send('Error al cambiar el favorito')
  }
}