const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')

// crea el servidor
const app = express()
// connectar a la db
connectDB()

// habilitar cors
app.use(cors())
// habilitar valores de body
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// puesto de la app
const port = process.env.PORT || 5000

// habilitar carpeta publica
app.use(express.static('uploads'))

// rutas de la app
app.use('/api/user', require('./routes/user.route'))
app.use('/api/auth', require('./routes/auth.route'))
app.use('/api/link', require('./routes/link.route'))
app.use('/api/file', require('./routes/file.route'))

// iniciar al app
app.listen(port, () => {
	console.log('Server run on http://localhost:5000')
})
