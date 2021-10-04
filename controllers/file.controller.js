const fs = require('fs')
const multer = require('multer')
const shortid = require('shortid')
const Link = require('../models/Link')
const { resSuccess } = require('../utils/response')

exports.uploadFile = async (req, res, next) => {
	const configMulter = {
		limit: { fileSize: req.user ? 1024 * 1024 * 10 : 1024 * 1024 }, // limite de 1mb
		storage: (fileStorage = multer.diskStorage({
			destination: (req, file, cb) => {
				cb(null, __dirname + '/../uploads')
			},
			filename: (req, file, cb) => {
				const extention = file.originalname.substring(
					file.originalname.lastIndexOf('.'),
					file.originalname.length
				)
				cb(null, `${shortid.generate()}.${extention}`)
			},
			/* fileFilter: (req, file, cb) => {
        if(file.mimetype === 'application/pdf') {
          return cb(null, true)
        }
      } */
		})),
	}

	const upload = multer(configMulter).single('file')

	// sube el archivo
	upload(req, res, async (error) => {
		if (!error) {
			resSuccess(res, { file: req.file.filename })
		} else {
			console.log(error)
			return next()
		}
	})
}

exports.downloadFile = async (req, res, next) => {
	// obtener enlace
	const { file } = req.params
	const link = await Link.findOne({ name: file })

	const fileToDownload = __dirname + '/../uploads/' + file

	res.download(fileToDownload)

	if (link.downloads === 1) {
		// si las descargas es igual a 1 - borrar la entrada y borrar el archivo
		req.file = link.name

		// eliminar archivo
		// eliminad doc en la db
		await Link.findOneAndRemove(link._id)

		next() // pasamos al controlador de file.deleteFile()
	} else {
		// si las descargas son > 1 - restar 1 a downloads
		link.downloads--
		await link.save()
	}
}

exports.deleteFile = async (req, res) => {
	console.log(req.file)
	try {
		fs.unlinkSync(__dirname + `/../uploads/${req.file}`)
		console.log('archvio eliminado')
	} catch (error) {
		console.log('ERROR AL ELIMINAR ARCHIVO')
		console.log(error)
	}
}
