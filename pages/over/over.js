Page({
  data: {
    score: 0
  },
  onShow () {
    this.setData({
      score: wx.getStorageSync('score') || 0
    })
  },
  doOnceAgain () {
    wx.setStorageSync('score', 0)
    wx.redirectTo({
      url: '/pages/play/play'
    })
  }
})
