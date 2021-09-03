const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '.env' })
const User = require('../models/User')
const { resError, resSuccess } = require('../utils/response')

exports.authUser = async (req, res) => {
	// revisar si hay errores
	verifyValidator(req, res)

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
	const user = req.user

	if (user) return resSuccess(res, req.user)

	return resError(res, 401, 'Debe de autenticarse.')
}
