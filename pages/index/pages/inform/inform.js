//bigshot.js
var app = getApp();

Page({
  data: {
    informLink:'', //活动链接
  },

  onLoad: function (options) {
    console.log(decodeURIComponent(options.informLink), '活动链接')
    var that = this
    that.setData({
      informLink: decodeURIComponent(options.informLink),
    })
  },

})
