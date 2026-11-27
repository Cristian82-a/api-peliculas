const express = require('express')
const viewsController = require('../controllers/movies-views')

const router = express.Router()

router.get('/movies', viewsController.list)
router.get('/movies/new', viewsController.showNew)   // antes que /:id
router.post('/movies', viewsController.create)
router.get('/movies/:id', viewsController.detail)
router.get('/movies/:id/edit', viewsController.showEdit)
router.post('/movies/:id/edit', viewsController.update)
router.post('/movies/:id/delete', viewsController.remove)
router.post('/movies/:id/favorite', viewsController.toggleFavorite)

module.exports = router