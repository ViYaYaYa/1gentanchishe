//index.js
//获取应用实例
Page({
  data: {
    scrollView1: 0
  },
  doSwiperChange (arg1) {
    console.log(arg1)
  },
  doSwiperFinish (arg1) {
    console.log(arg1)
  },
  doScrollViewUpper (arg1, arg2) {
    console.log(arg1)
    console.log(arg2)
  },
  doScrollViewTop () {
    setTimeout(function () {
      this.setData({
        scrollView1: 300
      })
    }.bind(this), 3000)
  },
  doScrollViewScroll (ev) {
    console.log(ev)
  },
  onLoad () {
    this.doScrollViewTop()
  }
})
