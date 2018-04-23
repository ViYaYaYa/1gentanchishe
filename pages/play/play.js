const CANVAS_ID = 'canvas'

const CANVAS_WIDTH = 320 // 必须能被2整除
const CANVAS_HEIGHT = 320 // 必须能被2整除

const INITIAL_WIDTH = 20 // 初始蛇块的长宽（能被CANVAS_WIDTH与CANVAS_HEIGHT整除的值）
const INITIAL_SPEED = 800 // 初始速度，越小越快，原则上16.667是极限值（60帧）

const ORIGIN_X = CANVAS_WIDTH / 2 // 原点坐标x（不能修改）
const ORIGIN_Y = CANVAS_HEIGHT / 2 // 原点坐标y（不能修改）

class Game {
  constructor (id) {
    this.ctx = wx.createCanvasContext(id)
    this.snake = new Snake()
    this.snakeNextDir = this.snake.direction
    this.bonusX = null
    this.bonusY = null
    this.fat = INITIAL_WIDTH
    this.speed = INITIAL_SPEED
    this.status = 'READY' // START | DIED
    this.moveTimer = null
    this.drawTimer = null
  }
  setDirection (dir) {
    if (this.status === 'START' && dir !== this.snake.direction) {
      this.snakeNextDir = dir
      this.run()
    }
  }
  setBonus () {
    let table = this.snake.getDimensionHashTable()
    let maxX = ORIGIN_X / this.fat
    let maxY = ORIGIN_Y / this.fat
    let x = Math.floor(Math.random() * maxX * 2) - maxX
    let y = Math.floor(Math.random() * maxY * 2) - maxY
    if (table[x] && table[x].indexOf(y) !== -1) {
      let originX = x
      let originY = y
      while (table[x] && table[x].indexOf(y) !== -1) {
        while (table[x].indexOf(y !== -1)) {
          if (++y === originY) break
        }
        if (++x === originX) break
      }
      if (originX === x && originY === y) {
        // 所有空间都被画满了
        this.bonusX = this.bonusY = null
      } else {
        this.bonusX = x
        this.bonusY = y
      }
    } else {
      this.bonusX = x
      this.bonusY = y
    }
    this.draw()
  }
  getBounus () {
    this.snake.grow()
    let length = this.snake.getLength()
    if (length % 5 === 0) {
      this.fat -= 1
      while ((ORIGIN_X % this.fat) || (ORIGIN_Y % this.fat)) this.fat--
      if (this.fat < 1) this.fat = 1
    }
    if (length % 2 === 0) {
      this.speed *= 0.7
      if (this.speed < 16.6667) this.speed = 16.6667
    }
    this.setBonus()
    this.draw()
  }
  start () {
    this.status = 'START'
    this.snake.grow()
    this.snake.grow()
    this.snake.grow()
    this.setBonus()
    this.draw()
    this.run()
  }
  run () {
    clearTimeout(this.moveTimer)
    // 调整方向
    if ((this.snakeNextDir - this.snake.direction) % 2) {
      this.snake.direction = this.snakeNextDir
    } else {
      this.snakeNextDir = this.snake.direction
    }
    let { x, y } = this.snake.getNextDimension()
    let actualX = this.fat * x
    let actualY = this.fat * y
    if (actualX > ORIGIN_X || actualX < -ORIGIN_X) {
      // 水平撞墙，带！
      this.boom()
    } else if (actualY >= ORIGIN_Y || actualY < -ORIGIN_Y) {
      // 垂直撞墙，带！
      this.boom()
    } else if (this.snake.getEatingItself()) {
      this.boom()
    } else {
      if (x === this.bonusX && y === this.bonusY) {
        // 吃糖就脖子变长
        this.getBounus()
      } else {
        // 没吃糖就往前走一步
        this.snake.move()
      }
      this.moveTimer = setTimeout(this.run.bind(this), this.speed)
    }
    this.draw()
  }
  boom () {
    clearTimeout(this.moveTimer)
    this.moveTimer = null
    this.status = 'DIED'
    wx.showToast({ title: '你带了！' })
  }
  draw () {
    let t = this
    if (t.drawTimer) return
    t.drawTimer = setTimeout(function () {
      t.ctx.translate(ORIGIN_X, ORIGIN_Y)
      t.snake.each(function (muscle) {
        t.ctx.fillRect(muscle.x * t.fat, muscle.y * t.fat, t.fat, t.fat)
      })
      if (typeof t.bonusX === 'number' && typeof t.bonusY === 'number') {
        t.ctx.setFillStyle('red')
        t.ctx.fillRect(t.bonusX * t.fat, t.bonusY * t.fat, t.fat, t.fat)
      }
      t.ctx.draw()
      clearTimeout(t.drawTimer)
      t.drawTimer = null
    }, 0)
  }
}

class Snake {
  constructor (x, y) {
    this.head = new Muscle(x, y)
    this.direction = 2 // 1上，2右，3下，4左
    this.directionNext = 2
  }
  grow () {
    let { x, y } = this.getNextDimension()
    this.head = new Muscle(x, y, this.head)
  }
  move () {
    let { x, y } = this.getNextDimension()
    let nextX, nextY, cacheX, cacheY
    nextX = x
    nextY = y
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
  getNextDimension () {
    let { x, y } = this.getNextOffset()
    return {
      x: this.head.x + x,
      y: this.head.y + y
    }
  }
  getDimensionHashTable () {
    let table = []
    this.each(function (muscle) {
      if (!table[muscle.x]) table[muscle.x] = []
      if (table[muscle.x].indexOf(muscle.y) === -1) table[muscle.x].push(muscle.y)
    })
    return table
  }
  getEatingItself () {
    let flag = false
    let x = this.head.x
    let y = this.head.y
    let target = this.head.next
    while (target) {
      if (target.x === x && target.y === y) {
        flag = true
        break
      }
      target = target.next
    }
    return flag
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
