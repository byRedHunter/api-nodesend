const Link = require('../models/Link')
const shortid = require('shortid')
const bcrypt = require('bcrypt')
const { resError, resSuccess } = require('../utils/response')
const { verifyValidator } = require('../utils/validators')

exports.newLink = async (req, res) => {
	// revisar si hay errores
	verifyValidator(req, res)

	// crear el objeto Link
	const { originalName } = req.body

	const link = new Link()
	link.url = shortid.generate()
	link.name = shortid.generate()
	link.originalName = originalName

	// si el usuario esta autenticado
	if (req.user) {
		const { password, downloads } = req.body
		// asignar descargas y password
		if (password) {
			const salt = await bcrypt.genSalt(10)
			link.password = await bcrypt.hash(password, salt)
		}
		if (downloads) link.downloads = downloads

		// asignar autor
		link.author = req.user.id
	}

	// almacenar en la db
	try {
		await link.save()

		return resSuccess(res, link)
	} catch (error) {
		console.log(error)
		return resError(res, 500, 'Error al crear link.')
	}
}
