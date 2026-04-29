const mineflayer = require('mineflayer')
const fs = require('fs')
const { keepAlive } = require('./keep_alive')

keepAlive()

let rawdata = fs.readFileSync('config.json')
let data = JSON.parse(rawdata)

const host = data.ip
const username = data.name
const port = data.port || 25565
const version = data.version || false

let bot = null
let reconnecting = false

let lasttime = -1
let moving = 0
let connected = 0
let lastaction = null

const actions = ['forward', 'back', 'left', 'right']
const pi = 3.14159
const moveinterval = 2
const maxrandom = 5

function connectBot() {
  console.log('Connecting to server...')

  bot = mineflayer.createBot({
    host: host,
    port: port,
    username: username,
    version: version || undefined
  })

  bot.on('login', function () {
    console.log('Logged In')
  })

  bot.on('spawn', function () {
    connected = 1
    reconnecting = false
    console.log('Bot spawned')
  })

  bot.on('time', function () {
    if (connected < 1) return

    if (lasttime < 0) {
      lasttime = bot.time.age
      return
    }

    const randomadd = Math.random() * maxrandom * 20
    const interval = moveinterval * 20 + randomadd

    if (bot.time.age - lasttime > interval) {
      if (moving === 1) {
        bot.setControlState(lastaction, false)
        moving = 0
        lasttime = bot.time.age
      } else {
        const yaw = Math.random() * pi - 0.5 * pi
        const pitch = Math.random() * pi - 0.5 * pi

        bot.look(yaw, pitch, false)

        lastaction = actions[Math.floor(Math.random() * actions.length)]
        bot.setControlState(lastaction, true)

        moving = 1
        lasttime = bot.time.age

        try {
          bot.activateItem()
        } catch (err) {}
      }
    }
  })

  bot.on('kicked', function (reason) {
    console.log('Bot was kicked:', reason)
  })

  bot.on('error', function (err) {
    console.log('Bot error:', err.message)
  })

  bot.on('end', function () {
    console.log('Bot disconnected')

    connected = 0
    moving = 0
    lasttime = -1

    reconnectBot()
  })
}

function reconnectBot() {
  if (reconnecting) return

  reconnecting = true

  console.log('Reconnecting in 10 seconds...')

  setTimeout(function () {
    reconnecting = false
    connectBot()
  }, 10000)
}

connectBot()
