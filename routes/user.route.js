const express = require('express')
const { newUser } = require('../controllers/user.controller')
const { checkUser } = require('../utils/validators')

const router = express.Router()

// api/user

// crear nuevo usuario
router.post('/', checkUser, newUser)

module.exports = router
