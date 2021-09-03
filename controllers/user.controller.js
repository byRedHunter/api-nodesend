const bcrypt = require('bcrypt')
const User = require('../models/User')
const { resError, resSuccess } = require('../utils/response')

exports.newUser = async (req, res) => {
	// verificar errores de express-validator
	verifyValidator(req, res)

	try {
		const { email, password } = req.body
		// verificar si el usuario ya esta registrado
		let user = await User.findOne({ email })

		if (user) return resError(res, 400, 'El correo ya ha sido registrado')

		// crear un nuevo usuario
		user = new User(req.body)
		// hashear el password
		const salt = await bcrypt.genSalt(10)
		user.password = await bcrypt.hash(password, salt)

		// guardar usuario en la db
		await user.save()

		return resSuccess(res, user)
	} catch (error) {
		console.log(error)
		return resError(res, 500, 'Error al crear usuario.')
	}
}
