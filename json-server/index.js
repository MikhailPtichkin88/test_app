
const fs = require('fs')
const jsonServer = require('json-server')
const path = require('path')


const http = require('http')

const server = jsonServer.create()

const router = jsonServer.router(path.resolve(__dirname, 'db.json'))

server.use(jsonServer.defaults({}))
server.use(jsonServer.bodyParser)

// имитация реального апи
server.use(async (req, res, next) => {
  await new Promise((res) => {
    setTimeout(res, 800)
  })
  next()
})


server.post('/login', (req, res) => {
  try {
    const { username, password } = req.body
    const db = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, 'db.json'), 'UTF-8')
    )
    const { users = [] } = db

    const userFromBd = users.find(
      (user) => user.username === username && user.password === password
    )

    if (userFromBd) {
      return res.json(userFromBd)
    }

    return res.status(403).json({ message: 'User not found' })
  } catch (e) {
    return res.status(500).json({ message: e.message })
  }
})

// проверяем, авторизован ли пользователь
server.use((req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ message: 'AUTH ERROR' })
  }
  next()
})

server.use(router)

const HTTP_PORT = 8002

const httpServer = http.createServer(server)
// запуск сервера

httpServer.listen(HTTP_PORT, () => {
  console.log(`server is running on ${HTTP_PORT} port`)
})
