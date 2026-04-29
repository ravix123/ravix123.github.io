const mineflayer = require('mineflayer')
const fs = require('fs')
const path = require('path')
const { keepAlive } = require('./keep_alive')

keepAlive()

const configPath = path.join(__dirname, 'config.json')

let data = {}

if (fs.existsSync(configPath)) {
  data = JSON.parse(fs.readFileSync(configPath, 'utf8'))
}

const host = process.env.MC_HOST || data.ip
const username = process.env.MC_NAME || data.name
const port = Number(process.env.MC_PORT || data.port || 25565)
const version = process.env.MC_VERSION || data.version || false

if (!host || !username) {
  console.log('Ошибка: укажите ip и name в config.json или переменные MC_HOST и MC_NAME')
  process.exit(1)
}

let bot
let lasttime = -1
let moving = 0
let connected = 0
let lastaction = null

const actions = ['forward', 'back', 'left', 'right']
const pi = 3.14159
const moveinterval = 2
const maxrandom = 5

function createBot() {
  bot = mineflayer.createBot({
    host: host,
    port: port,
    username: username,
    version: version || undefined
  })

  bot.on('login', () => {
    console.log('Logged In')
  })

  bot.on('spawn', () => {
    connected = 1
    console.log('Bot spawned')
  })

  bot.on('time', () => {
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
        const yaw = Math.random() * pi - (0.5 * pi)
        const pitch = Math.random() * pi - (0.5 * pi)

        bot.look(yaw, pitch, false)
        lastaction = actions[Math.floor(Math.random() * actions.length)]
        bot.setControlState(lastaction, true)

        moving = 1
        lasttime = bot.time.age

        try {
          bot.activateItem()
        } catch (e) {
          // Иногда предмета в руке нет — это не критично.
        }
      }
    }
  })

  bot.on('kicked', (reason) => {
    console.log('Kicked:', reason)
  })

  bot.on('error', (err) => {
    console.log('Error:', err.message)
  })

  bot.on('end', () => {
    connected = 0
    moving = 0
    lasttime = -1
    console.log('Disconnected. Reconnecting in 10 seconds...')

    setTimeout(createBot, 10000)
  })
}

createBot()
