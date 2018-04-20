const CANVAS_WIDTH = 320
const CANVAS_HEIGHT = 320

const ORIGIN_X = CANVAS_WIDTH / 2
const ORIGIN_Y = CANVAS_HEIGHT / 2

const INITIAL_WIDTH = 20
const INITIAL_SPEED = 1000

class Snake {
  constructor () {
    this.head = new Muscle()
    this.lv = 1
    this.direction = 3 // 1上，2右，3下，4左
  }
  move () {
    let { offsetX, offsetY } = this.getSnakeOffset()
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
    snakeDraw()
    setTimeout(this.move.bind(this), INITIAL_SPEED / this.lv)
  }
  grow () {
    let { offsetX, offsetY } = this.getSnakeOffset()
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
    let target = this.lv - 1
    while (ORIGIN_X % (INITIAL_WIDTH - target) !== 0) {
      target++
    }
    return INITIAL_WIDTH - target
  }
  getSnakeOffset () {
    let offsetX, offsetY, direction
    direction = +this.direction || 1
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
}

class Muscle {
  constructor (x, y, next) {
    this.x = x || 0
    this.y = y || 0
    this.next = next || null
  }
}

let ctx = null
let snake = null
let drawTasks = 0

function snakeDraw () {
  drawTasks++
  setTimeout(function () {
    drawTasks--
    if (drawTasks <= 0) {
      drawTasks = 0
      ctx.translate(ORIGIN_X, ORIGIN_Y)
      let fat = snake.getHowFat()
      snake.each(function (muscle) {
        ctx.fillRect(muscle.x * fat, muscle.y * fat, fat, fat)
      })
      ctx.draw()
    }
  }, 0)
}

// do for Action
// Thank you!

Page({
  data: {
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  },
  doChangeDirection (ev) {
    let dir = ev.target.dataset.direction
    if (snake) {
      snake.direction = dir
    }
  },
  onLoad () {
    ctx = wx.createCanvasContext('canvas')
    snake = new Snake()
    snake.grow()
    snake.grow()
    snake.grow()
    snake.move()
  }
})
