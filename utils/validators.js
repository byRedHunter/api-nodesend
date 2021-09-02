const { check } = require('express-validator')

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
