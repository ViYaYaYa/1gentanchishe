//index.js
//获取应用实例
Page({
  data: {
    console: '',
  },
  doPickerChange (arg1) {
    console.log(arg1)
    this.setData({
      console: arg1
    })
  },
  onLoad () {
  }
})
