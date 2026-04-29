const express = require('express')

function keepAlive() {
  const app = express()
  const port = process.env.PORT || 8000

  app.get('/', (req, res) => {
    res.send('Afk bot is running!')
  })

  app.listen(port, () => {
    console.log(`Keep alive server is listening on port ${port}`)
  })
}

module.exports = { keepAlive }
