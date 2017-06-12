let app = require('express')(),
  cfenv = require('cfenv'),
  bodyParser = require('body-parser'),
  appEnv = cfenv.getAppEnv(),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  rr = require('./src/RetrieveAndRank')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

http.listen(appEnv.port, () => {
  console.log(`server starting on ${appEnv.url}`)
})

rr(app)

let sockets = []
io.on('connection', socket => {
  console.log('client connected')
  sockets.push(socket)
  console.log(
    `index: ${sockets.indexOf(socket)}, sockets length: ${sockets.length}`
  )
  socket.on('disconnect', () => {
    let result = sockets.splice(sockets.indexOf(socket), 1)
    console.log(`user disconnected (${sockets.length} remaining)`)
    if (result.length == 0) {
      console.log('old socket not found')
      console.log(
        `index: ${sockets.indexOf(socket)}, sockets length: ${sockets.length}`
      )
    }
  })
})

app.post('/tweetupdate', (req, res) => {
  sockets.forEach(socket => socket.emit('tweet-update', req.body))
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.status(200).send(req.body)
})

app.post('/personality', (req, res) => {
  let query = ''
  for (let key in req.body) {
    if (key == 'handle') query = req.body[key]
  }
  let response = personalityPosts[query]
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.status(200).send(response)
})

app.get('/users', (req, res) => {
  let response = usersGet
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.status(200).send(response)
})

app.get('/classifiers', (req, res) => {
  let response = classifiersGet
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.status(200).send(response)
})

app.get('/products', (req, res) => {
  let response = productsGet
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.status(200).send(response)
})

app.post('/products', (req, res) => {
  let query = ''
  for (let key in req.body) {
    if (key == 'code') query = req.body[key]
  }
  let response = productsGet.filter(product => product.PRODUCTCODE == query)
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.status(200).send(response)
})

app.post('/twitter', (req, res) => {
  let query = ''
  for (let key in req.body) {
    if (key == 'handle') query = req.body[key]
  }
  let response = twitterPosts[query]
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.status(200).send(response)
})

app.post('/phoneoffers', (req, res) => {
  let query = ''
  for (let key in req.body) {
    if (key == 'handle') query = req.body[key]
  }
  let response = phoneoffersPosts[query]
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.status(200).send(response)
})

app.post('/serviceoffers', (req, res) => {
  let query = ''
  for (let key in req.body) {
    if (key == 'handle') query = req.body[key]
  }
  let response = serviceoffersPosts[query]
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.status(200).send(response)
})

app.post('/cognitive', (req, res) => {
  let query = ''
  for (let key in req.body) {
    if (key == 'handle') query = req.body[key]
  }
  let response = cognitivePosts[query]
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.status(200).send(response)
})
