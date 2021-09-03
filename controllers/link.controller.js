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

// obtener el enlace
exports.getLinkFile = async (req, res, next) => {
	const { url } = req.params

	// verificar si existe el enlace
	const link = await Link.findOne({ url: url })

	// si no existe el enlace
	if (!link) return resError(res, 404, 'Este enlace no existe')

	if (link.downloads === 1) {
		// si las descargas es igual a 1 - borrar la entrada y borrar el archivo
		req.file = link.name

		// eliminar archivo
		// eliminad doc en la db
		await Link.findOneAndRemove(url)

		next() // pasamos al controlador de file.deleteFile()
	} else {
		// si las descargas son > 1 - restar 1 a downloads
		link.downloads--
		await link.save()
	}

	// si existe el enlace
	return resSuccess(res, { file: link.name })
}
