var app = getApp()
var utils = require('../utils/util.js')

module.exports = {
  wxRequest: wxRequest,//微信接口调用
}

/*微信调用接口*/
function wxRequest(that, url, method, data, successCallBack, errorCallBack) {
  var the = that;
  wx.request({
    url: app.globalData.wxHost + url,
    method: method,
    data: data || {},
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    success: function (res) {
      if (res.data.status == 0) {
        successCallBack(res.data)
        return
      }
      if (res.data.status != 0) {
        console.log(res.data.message)
        // wx.showToast({
        //   title: res.data.message,
        //   icon: 'loading',
        //   duration: 2000
        // })
        return
      }
      if (errorCallBack != null) {
        errorCallBack(res.data)
        return
      }
      return
    },
    // fail执行时当断网处理
    fail: function (res) {
      console.log(res)
      wx.showToast({
        title: '网络有问题！',
        icon: 'loading',
        duration: 2000
      })
    }
  })

}
