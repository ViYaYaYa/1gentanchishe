const CANVAS_WIDTH = 320
const CANVAS_HEIGHT = 320

const ORIGIN_X = CANVAS_WIDTH / 2
const ORIGIN_Y = CANVAS_HEIGHT / 2

const INITIAL_WIDTH = 20

class Snake {
  constructor () {
    this.head = new Muscle()
    this.lv = 0
    this.direction = 2 // 1上，2右，3下，4左
  }
  move (callback) {
    let { offsetX, offsetY } = getSnakeOffset(this.direction)
    let prevX = this.head.x
    let prevY = this.head.y
    this.head.x += offsetX
    this.head.y += offsetY
    let target = this.head.next
    let nextX, nextY
    while (target) {
      nextX = target.x
      nextY = target.y
      target.x = prevX
      target.y = prevY
      prevX = nextX
      prevY = nextY
      target = target.next
    }
    if (typeof callback === 'function') callback()
    setTimeout(this.move.bind(this, callback), 1000)
  }
  grow () {
    let { offsetX, offsetY } = getSnakeOffset(this.direction)
    this.head = new Muscle(this.head.x + offsetX, this.head.y + offsetY, this.head)
  }
  each (callback) {
    let target = this.head
    while (target) {
      callback(target)
      target = target.next
    }
  }
  getHowFat () {
    let target = this.lv
    while (ORIGIN_X % (INITIAL_WIDTH - target) !== 0) {
      target++
    }
    return INITIAL_WIDTH - target
  }
}

class Muscle {
  constructor (x, y, next) {
    this.x = x || 0
    this.y = y || 0
    this.next = next || null
  }
}

function getSnakeOffset (direction) {
  let offsetX, offsetY
  if (direction === 1) {
    offsetX = 0
    offsetY = -1
  }
  if (direction === 2) {
    offsetX = 1
    offsetY = 0
  }
  if (direction === 3) {
    offsetX = 0
    offsetY = 1
  }
  if (direction === 4) {
    offsetX = -1
    offsetY = 0
  }
  return { offsetX, offsetY }
}

// d for Data
// a for Action
// Thank you!

Page({
  data: {
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  },
  dCtx: null,
  dSnake: null,
  aDraw () {
    this.dCtx.translate(ORIGIN_X, ORIGIN_Y)
    let fat = this.dSnake.getHowFat()
    this.dSnake.each(function (muscle) {
      this.dCtx.fillRect(muscle.x * fat, muscle.y * fat, fat, fat)
    }.bind(this))
    this.dCtx.draw()
  },
  onLoad () {
    this.dCtx = wx.createCanvasContext('canvas')
    this.dSnake = new Snake()
    this.dSnake.grow()
    this.dSnake.grow()
    // this.dSnake.grow()
    // this.dSnake.grow()
    this.dSnake.move(this.aDraw)
    setInterval(function () {
      let target = Math.floor(Math.random() * 4 + 1)
      let curr = this.dSnake.direction
      if ((target - curr) % 2) {
        this.dSnake.direction = target
      }
    }.bind(this), 2000)
  }
})
