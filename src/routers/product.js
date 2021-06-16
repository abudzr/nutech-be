const express = require('express')
const router = express.Router()
const productController = require('../controllers/product')
const multer = require('../middlewares/multer')

router
    .post('/', multer.uploadImage.single("image"), productController.insertProduct)
    .get('/', productController.findAll)
    .put('/:id', multer.uploadImage.single("image"), productController.update)
    .delete('/:id', productController.delete)

module.exports = router
