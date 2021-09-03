const { check, validationResult } = require('express-validator')
const { resValidator } = require('./response')

exports.verifyValidator = (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) return resValidator(res, { errors: errors.array() })
}

exports.checkUser = [
	check('name', 'El nombre es obligatorio.').not().isEmpty(),
	check('email', 'No es un correo válido').isEmail(),
	check(
		'password',
		'La contraseña debe de tener mínimo 8 caracteres.'
	).isLength({ min: 8 }),
]

exports.checkAuthUser = [
	check('email', 'No es un correo válido').isEmail(),
	check('password', 'Ingrese su contraseña por favor.').not().isEmpty(),
]

exports.checkCreateLink = [
	check('name', 'Suba un archivo.').not().isEmpty(),
	check('originalName', 'Suba un archivo.').not().isEmpty(),
]
