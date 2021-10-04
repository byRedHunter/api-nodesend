const express = require('express')
const {
	newLink,
	getLinkFile,
	getAllLinks,
	hasPassword,
	verifyPassword,
} = require('../controllers/link.controller')
const auth = require('../middleware/auth')
const { checkCreateLink } = require('../utils/validators')

const router = express.Router()

router.post('/', checkCreateLink, auth, newLink)

router.get('/:url', hasPassword, getLinkFile)

router.get('/', getAllLinks)

router.post('/:url', verifyPassword, getLinkFile)

module.exports = router
