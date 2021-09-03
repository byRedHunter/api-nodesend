const express = require('express')
const { deleteFile } = require('../controllers/file.controller')
const { newLink, getLinkFile } = require('../controllers/link.controller')
const auth = require('../middleware/auth')
const { checkCreateLink } = require('../utils/validators')

const router = express.Router()

router.post('/', checkCreateLink, auth, newLink)

router.get('/:url', getLinkFile, deleteFile)

module.exports = router
