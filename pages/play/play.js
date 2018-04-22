const CANVAS_ID = 'canvas'

const CANVAS_WIDTH = 320 // 必须能被2整除
const CANVAS_HEIGHT = 320 // 必须能被2整除

const INITIAL_WIDTH = 20 // 初始蛇块的长宽
const INITIAL_SPEED = 1000 // 初始速度，越小越快，原则上16.667是极限值（60帧）

const ORIGIN_X = CANVAS_WIDTH / 2 // 原点坐标x（不能修改）
const ORIGIN_Y = CANVAS_HEIGHT / 2 // 原点坐标y（不能修改）

class Game {
  constructor (id) {
    this.ctx = wx.createCanvasContext(id)
    this.snake = new Snake()
    this.fat = INITIAL_WIDTH
    this.speed = INITIAL_SPEED
    this.status = 'READY'
    this.timer = null
    this.snake.grow()
    this.snake.grow()
    this.snake.grow()
  }
  setDirection () {

  }
  getBounus () {
    this.snake.grow()
    if (this.snake.getLength() % 3 === 0) {
      this.fat += 1
      this.speed += 10
    }
  }
  start () {
    this.status = 'START'
    this.run()
  }
  run () {

  }
}

class Snake {
  constructor (x, y) {
    this.head = new Muscle(x, y)
    this.direction = 2 // 1上，2右，3下，4左
  }
  grow () {
    let { x, y } = this.getNextOffset()
    this.head = new Muscle(x, y, this.head)
  }
  move () {
    let { x, y } = this.getNextOffset()
    let nextX, nextY, cacheX, cacheY
    nextX = this.head.x + x
    nextY = this.head.y + y
    this.each(function (muscle) {
      cacheX = muscle.x
      cacheY = muscle.y
      muscle.x = nextX
      muscle.y = nextY
      nextX = cacheX
      nextY = cacheY
    })
  }
  each (callback) {
    let target = this.head
    while (target) {
      callback.call(this, target)
      target = target.next
    }
  }
  getLength () {
    let length = 0
    this.each(function () {
      length++
    })
    return length
  }
  getNextOffset () {
    if (this.direction === 1) {
      return { x: 0, y: -1 }
    }
    if (this.direction === 2) {
      return  {x: 1, y: 0 }
    }
    if (this.direction === 3) {
      return  {x: 0, y: 1 }
    }
    if (this.direction === 4) {
      return { x: -1, y: 0 }
    }
  }
}

class Muscle {
  constructor (x, y, next) {
    this.x = x || 0
    this.y = y || 0
    this.next = next || null
  }
}

let game = null

// do for Action
// Thank you!

Page({
  data: {
    CANVAS_ID,
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  },
  doChangeDirection (ev) {
    game.setDirection(+ev.target.dataset.direction)
  },
  onLoad () {
    game = new Game(CANVAS_ID)
    game.start()
  }
})
