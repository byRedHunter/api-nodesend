const express = require('express')
const {
	newLink,
	getLinkFile,
	getAllLinks,
} = require('../controllers/link.controller')
const auth = require('../middleware/auth')
const { checkCreateLink } = require('../utils/validators')

const router = express.Router()

router.post('/', checkCreateLink, auth, newLink)

router.get('/:url', getLinkFile)

router.get('/', getAllLinks)

module.exports = router
