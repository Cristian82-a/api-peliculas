require('dotenv').config()

const mongoose = require('mongoose')
const Movie = require('./models/movie')
const connectDB = require('./config/database')
const movies = require('./movies.json')

async function importMovies() {
  try {
    await connectDB()

    let inserted = 0

    for (const movie of movies) {
      const result = await Movie.updateOne(
        { id: movie.id },
        { $setOnInsert: movie },
        { upsert: true, runValidators: true }
      )

      inserted += result.upsertedCount || 0
    }

    console.log(`Películas nuevas importadas: ${inserted}`)
  } catch (error) {
    console.error('Error al importar películas:', error.message)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

importMovies()