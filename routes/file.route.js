const express = require('express')
const {
	uploadFile,
	deleteFile,
	downloadFile,
} = require('../controllers/file.controller')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/', auth, uploadFile)

router.get('/:file', downloadFile, deleteFile)

// router.delete('/:id', deleteFile)

module.exports = router
