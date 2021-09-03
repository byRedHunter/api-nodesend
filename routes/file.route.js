const express = require('express')
const { uploadFile, deleteFile } = require('../controllers/file.controller')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/', auth, uploadFile)

router.delete('/:id', deleteFile)

module.exports = router
