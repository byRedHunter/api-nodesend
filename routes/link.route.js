const express = require('express')
const { newLink } = require('../controllers/link.controller')
const auth = require('../middleware/auth')
const { checkCreateLink } = require('../utils/validators')

const router = express.Router()

router.post('/', checkCreateLink, auth, newLink)

module.exports = router
