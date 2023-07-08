const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')

const app = express()
const http = require('http').createServer(app)

// Express App Config
app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))

if (process.env.NODE_ENV === 'production') {
  // Express serve static files on production environment
  app.use(express.static(path.resolve(__dirname, 'public')))
} else {
  // Configuring CORS
  const corsOptions = {
    // Make sure origin contains the url your frontend is running on
    origin: [
      'http://127.0.0.1:5173',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://localhost:3000',
      'https://mistertoy-frontend.onrender.com',
      'https://mistertoy-backend.onrender.com'
    ],
    credentials: true,
  }
  app.use(cors(corsOptions))
}

const authRoutes = require('./api/auth/auth.routes')
const userRoutes = require('./api/user/user.routes')
const toyRoutes = require('./api/toy/toy.routes')

app.use('/api/auth', authRoutes)
console.log('Auth routes loaded')

app.use('/api/user', userRoutes)
console.log('User routes loaded')

app.use('/api/toy', toyRoutes)
console.log('Toy routes loaded')

// Catch-all route
app.get('/**', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const logger = require('./services/logger.service')
logger.info('Hi', 90, 'Bobo')

const port = process.env.PORT || 3030
http.listen(port, () => {
  logger.info('Server is running on port: ' + port)
})

// const express = require('express')
// const cors = require('cors')

// const app = express()
// const toyService = require('./services/toy.service')

// const port = process.env.PORT || 3030
// const corsOptions = {
//     origin: [
//         'http://127.0.0.1:5173',
//         'http://localhost:5173',
//     ],
//     credentials: true
// }

// app.use(cors(corsOptions))
// app.use(express.json())
// app.use(express.static('public'))

// app.listen(port, () => {
//     console.log(`ToyApp listening on: http://localhost:${port}`)
// })

// app.get('/api/toy', (req, res) => {
//     const filterBy = {
//         name: req.query.name || '',
//         labels: req.query.labels || [],
//         inStock: req.query.inStock || false,
//         sortBy: req.query.sortBy || {},
//         page: req.query.page || 0,
//     }
//     toyService
//         .query(filterBy)
//         .then(toys => {
//             res.status(201).send(toys)
//         })
//         .catch((err) => {
//             console.log('Backend had error: ', err)
//             res.status(401).send('Failed to get toys')
//         })
// })

// app.get('/api/toy/:toyId', (req, res) => {
//     const { toyId } = req.params
//     toyService
//         .getById(toyId)
//         .then(toy => {
//             res.status(201).send(toy)
//         })
//         .catch((err) => {
//             console.log('Backend had error: ', err)
//             res.status(401).send(`Failed to get toy with id: ${toyId}`)
//         })
// })

// app.post('/api/toy', (req, res) => {
//     const toyToSave = {
//         name: req.body.name,
//         price: req.body.price,
//         labels: req.body.labels,
//         inStock: req.body.inStock,
//     }
//     toyService
//         .save(toyToSave)
//         .then((savedToy) => {
//             res.status(201).send(savedToy)
//         })
//         .catch((err) => {
//             console.log('Backend had error: ', err)
//             res.status(401).send('Cannot create Toy')
//         })
// })

// app.put('/api/toy', (req, res) => {
//     const toyToSave = {
//         _id: req.body._id,
//         name: req.body.name,
//         price: req.body.price,
//         labels: req.body.labels,
//         inStock: req.body.inStock,
//         createdAt: req.body.createdAt
//     }
//     toyService
//         .save(toyToSave)
//         .then(savedtoy => {
//             res.status(201).send(savedtoy)
//         })
//         .catch((err) => {
//             console.log('Backend had error: ', err)
//             res.status(401).send('Cannot remove Toy')
//         })
// })

// app.delete('/api/toy/:toyId', (req, res) => {
//     const { toyId } = req.params
//     toyService.remove(toyId)
//         .then(() => {
//             res.send('OK, deleted')
//         })
//         .catch((err) => {
//             console.log('Error:', err)
//             res.status(400).send('Cannot remove toy')
//         })
// })
