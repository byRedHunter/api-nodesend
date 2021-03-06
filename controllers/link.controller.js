const Link = require('../models/Link')
const shortid = require('shortid')
const bcrypt = require('bcrypt')
const { resError, resSuccess } = require('../utils/response')
const { verifyValidator } = require('../utils/validators')

exports.newLink = async (req, res) => {
	// revisar si hay errores
	verifyValidator(req, res)

	// crear el objeto Link
	const { originalName, name } = req.body

	const link = new Link()
	link.url = shortid.generate()
	link.name = name
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

// retorna si el enlace tiene password
exports.hasPassword = async (req, res, next) => {
	const { url } = req.params

	// verificar si existe el enlace
	const link = await Link.findOne({ url: url })

	// si no existe el enlace
	if (!link) return resError(res, 404, 'Este enlace no existe')

	if (link.password) return resSuccess(res, { password: true, link: link.url })

	next()
}

// verificar password
exports.verifyPassword = async (req, res, next) => {
	const { url } = req.params

	// consultar
	const link = await Link.findOne({ url })

	// verificar password
	const { password } = req.body

	if (bcrypt.compareSync(password, link.password)) {
		// permitimos descar el archivo
		next()
	} else {
		return resError(res, 401, 'Ingrese una contraseña válida.')
	}
}

// obtener el enlace
exports.getLinkFile = async (req, res, next) => {
	const { url } = req.params

	// verificar si existe el enlace
	const link = await Link.findOne({ url: url })

	// si no existe el enlace
	if (!link) return resError(res, 404, 'Este enlace no existe')

	resSuccess(res, { file: link.name, password: false })

	next()

	/* if (link.downloads === 1) {
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
	return resSuccess(res, { file: link.name }) */
}

// obtener un listado de todos los enlaces
exports.getAllLinks = async (req, res) => {
	try {
		const links = await Link.find({}).select('url -_id')

		return resSuccess(res, links)
	} catch (error) {
		console.log(error)
		return resError(res, 500, 'Error al crear link.')
	}
}
