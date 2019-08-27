//personal.js
var app = getApp();
var utils = require('../../utils/util.js')
var request = require('../../utils/httpRequest.js');

Page({
  data: {
    userScore: app.globalData.userScore,  //用户当前积分
    totalConvertEtm: app.globalData.totalConvertEtm  //用户已兑换的ETM数量
  },

  onShow: function () {
    var that = this
    //查询用户信息
    var param = {
      id: app.globalData.userId,
      convertScoreTypeId: "convert",
    }
    request.wxRequest(that, '/user-info/info-by-id', 'GET', param, (res) => {
      that.setData({
        userScore: res.data.userScore,
        totalConvertEtm: res.data.totalConvertEtm
      })
    })
  },

  //拨打电话
  // callme:function(){
  //   wx.makePhoneCall({
  //     phoneNumber: '123456789',
  //   })
  // }
})
