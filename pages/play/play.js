const INITIAL_WIDTH = 320
const INITIAL_HEIGHT = 320

Page({
  data: {
    ctx: null
  },
  onLoad () {
    console.log('onLoad should only be one time')
    this.setData({
      ctx: wx.createCanvasContext('canvas')
    })
    let ctx = this.data.ctx
    ctx.translate(100, 100)
    setInterval(function () {
      this.doDraw()
    }.bind(this), 3000)
  },
  doDraw () {
    console.log('draw')
    let ctx = this.data.ctx
    let x = Math.random() * 10
    let y = Math.random() * 10
    let width = Math.random() * 100
    let height = Math.random() * 100
    ctx.fillRect(x, y, width, height)
    ctx.draw()
  }
})
