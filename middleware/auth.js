const jwt = require('jsonwebtoken')
const { resError } = require('../utils/response')
require('dotenv').config({ path: '.env' })

module.exports = (req, res, next) => {
	const authHeader = req.get('authorization')

	if (authHeader) {
		// obtener el token
		const token = authHeader.split(' ')[1]

		// comprobar jwt
		try {
			const user = jwt.verify(token, process.env.SECRET)
			// retorna al usuario --> pasa usuario al siguiente codigo
			req.user = user
		} catch (error) {
			console.log(error)
			return resError(res, 400, 'Token incorrecto.')
		}
	}

	return next()
}

/* module.exports = (req, res, next) => {
	const authHeader = req.get('authorization')

	if (!authHeader)
		return resError(
			res,
			400,
			'Debe de autenticarse para acceder a la aplicación.'
		)

	// obtener el token
	const token = authHeader.split(' ')[1]

	// comprobar jwt
	try {
		const user = jwt.verify(token, process.env.SECRET)
		// retorna al usuario --> pasa usuario al siguiente codigo
		req.user = user

		return next()
	} catch (error) {
		console.log(error)
		return resError(res, 400, 'Token incorrecto.')
	}
} */
