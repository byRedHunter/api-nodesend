const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '.env' })
const User = require('../models/User')
const { resError, resSuccess, resValidator } = require('../utils/response')

exports.authUser = async (req, res) => {
	// revisar si hay errores
	const errors = validationResult(req)
	if (!errors.isEmpty()) return resValidator(res, { errors: errors.array() })

	// buscar usuario si esta registrado
	const { email, password } = req.body
	const user = await User.findOne({ email })

	if (!user) return resError(res, 401, 'Este usuario no existe.') // 401 credenciales incorrectas

	// verificar password
	if (!bcrypt.compareSync(password, user.password))
		return resError(res, 401, 'El Correo o la contraseña son incorrectos.')

	// autenticar usuario
	const token = jwt.sign(
		{
			id: user._id,
			name: user.name,
			email: user.email,
		},
		process.env.SECRET,
		{
			expiresIn: '4h',
		}
	)

	return resSuccess(res, { token })
}

exports.isUserAuth = async (req, res) => {
	return resSuccess(res, req.user)
}
