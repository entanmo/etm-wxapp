var app = getApp();
var utils = require('../../utils/util.js')
var request = require('../../utils/httpRequest.js')

Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    url: '/pages/index/index',  //首页地址

    loadingshow: '',  //显示1，2判断
    inviteUserId: '' //好友ID
  },
  onLoad: function (options) {
    var that = this;
    var inviteUserId
    //获取分享转发页面时携带的参数
    if (options.inviteUserId == undefined || options.inviteUserId == "" || inviteUserId == app.globalData.userId) { } else {
      that.setData({
        inviteUserId: options.inviteUserId //邀请人id
      })
    }
  },
  onShow: function (options) {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success(res) {
              that.setData({
                loadingshow: "1" //loading显示跳转
              })
              app.globalData.userInfo = res.userInfo;  //添加用户信息到全局函数
              that.getUserInfo();  //用户已授权登录小程序
            }
          })
        }else{
          that.setData({
            loadingshow: '2' //显示授权页面
          })
        }
      }
    })
  },

  bindGetUserInfo: function (e) {
    var that = this;
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      app.globalData.userInfo = e.detail.userInfo;  //添加用户信息到全局函数
      that.getUserInfo();  //用户已授权登录小程序

      wx.showModal({
        title: '提示！',
        content: '授权成功！',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            that.setData({
              loadingshow: '1' //loading显示跳转
            })
          }
        }
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },

  getUserInfo: function (e) {
    var that = this;
    utils.wxLogin((code) => {
      //console.log(code,'code')
      var paramcode = {
        js_code: code,
      }
      request.wxRequest(that, '/wx/get-open-id-by-code', 'GET', paramcode, (res) => {
        app.globalData.openid = res.data.openid
        //邀请好友
        var inviteUserId = that.data.inviteUserId
        if (inviteUserId == undefined || inviteUserId == '') {
          console.log(inviteUserId,'基本登录路线')
          that.login()
        } else {
          var paramInvite = {
            userName: utils.filterEmoji(app.globalData.userInfo.nickName),
            avatarUrl: app.globalData.userInfo.avatarUrl,
            userOpenId: app.globalData.openid, //自己的id
            inviteUserId: inviteUserId,  //邀请用户id
            inviteScoreTypeId: "invite" //邀请积分配置的key
          }
          request.wxRequest(that, '/user-info/create-user', 'POST', paramInvite, (res) => {
            console.log(res,'邀请好友路线')
          })
          setTimeout(function () {
            that.login()
          }, 500)
        }
      })
    })
  },

  login: function(){
    var that = this
    //发起登录注册请求
    var param = {
      userName: utils.filterEmoji(app.globalData.userInfo.nickName),
      avatarUrl: app.globalData.userInfo.avatarUrl,
      userOpenId: app.globalData.openid
    }
    request.wxRequest(that, '/user-info/create-user', 'POST', param, (res) => {
      app.globalData.userId = res.data.id;  //添加userId到全局函数
      wx.reLaunch({
        url: that.data.url,
      })
      //修改用户信息名称
      // var param = {
      //   id: res.data.id,
      //   userName: utils.filterEmoji(app.globalData.userInfo.nickName),
      // }
      // request.wxRequest(that, '/user-info/update-user-info', 'post', param, (res) => {
      // })

      //查询用户信息
      // var param = {
      //   id: app.globalData.userId,
      //   convertScoreTypeId: "convert",
      // }
      // request.wxRequest(that, '/user-info/info-by-id', 'GET', param, (res) => {
      //   app.globalData.userTel = res.data.userTel  //添加用户手机号到全局函数
      //   app.globalData.userToken = res.data.userToken  //添加用户钱包地址到全局函数
      //   app.globalData.userScore = res.data.userScore  //添加用户积分到全局函数
      //   app.globalData.totalConvertEtm = res.data.totalConvertEtm  //添加用户积分到全局函数
      // })
    })
  },

})


