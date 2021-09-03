const multer = require('multer')
const shortid = require('shortid')
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

exports.deleteFile = async (req, res) => {}
