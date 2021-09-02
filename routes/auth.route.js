const express = require('express')
const { authUser, isUserAuth } = require('../controllers/auth.controller')
const auth = require('../middleware/auth')
const { checkAuthUser } = require('../utils/validators')

const router = express.Router()

// api/auth

// crear auth de usuario
router.post('/', checkAuthUser, authUser)

// obtener datos del usuario auth
router.get('/', auth, isUserAuth)

module.exports = router
