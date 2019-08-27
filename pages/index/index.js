//index.js
var app = getApp();
var utils = require('../../utils/util.js')
var request = require('../../utils/httpRequest.js')

Page({
  data: {
    advertis_list: [],  //广告banner列表
    advertisLink: [],  //广告banner链接集合
    bigshot_list: [],  //热门活动列表
    informLink: [],  //热门活动链接集合

    pageNumber: 1, //下拉页数
    pages: '', //总页数
    over: false, //分页底线
    bonus: false,  //邀请好友弹窗
    convert: false,  //积分兑换ETM弹窗
    signin: false,  //签到成功弹窗
    signinNo: false, //签到失败弹窗

    userScore: app.globalData.userScore,  //用户当前积分
  },

  onShow: function () {
    var that = this
    if (app.globalData.userId == undefined || app.globalData.userId == '') {
      wx.reLaunch({
        url: "/pages/login/login",
      })
    }
    //查询用户信息
    var param = {
      id: app.globalData.userId,
      convertScoreTypeId: "convert",
    }
    request.wxRequest(that, '/user-info/info-by-id', 'GET', param, (res) => {
      that.setData({
        userScore: res.data.userScore
      })
      app.globalData.userTel = res.data.userTel  //添加用户手机号到全局函数
      app.globalData.userToken = res.data.userToken  //添加用户钱包地址到全局函数
      app.globalData.userScore = res.data.userScore  //添加用户积分到全局函数
      app.globalData.totalConvertEtm = res.data.totalConvertEtm  //添加用户已兑换的ETM数量到全局函数
    })
    console.log(app.globalData)
    
    //广告banner
    request.wxRequest(that, '/advertise-info/list', 'GET', null, (res) => {
      var advertis_list = res.data.records
      var advertisLink = new Array();
      for (var i = 0; i < advertis_list.length; i++) {
        advertisLink[i] = encodeURIComponent(advertis_list[i].advertiseUrl)
      }
      that.setData({
        advertis_list: advertis_list,
        advertisLink: advertisLink
      })
    })

    //热门活动
    var param = {
      size: 6,
    }
    request.wxRequest(that, '/activity-info/list', 'GET', param, (res) => {
      var bigshot_list = res.data.records
      var informLink = new Array();
      for (var i = 0; i < bigshot_list.length; i++) {
        informLink[i] = encodeURIComponent(bigshot_list[i].activityUrl)
      }
      that.setData({
        bigshot_list: bigshot_list,
        pages: res.data.pages,
        informLink: informLink
      })
    })
  },

  //选择广告banner
  advertis: function (e) {
    var that = this
    let url = e.currentTarget.dataset.advertislink
    wx.navigateTo({
      url: 'pages/inform/inform?informLink=' + that.data.advertisLink[url],
    })
  },

  //选择活动
  chatBtnHandler: function(e){
    var that = this
    let url = e.currentTarget.dataset.informlink
    wx.navigateTo({
      url: 'pages/inform/inform?informLink=' + that.data.informLink[url],
    })
  },

  //积分兑换跳转
  conversion: function (e) {
    wx.navigateTo({
      url: '../personal/pages/drawmoney/drawmoney',
    })
  },

  //上拉加载
  onReachBottom: function () {
    var that = this;
    if (that.data.pageNumber < that.data.pages) {
      wx.showLoading({ title: '玩命加载中' })  // 显示加载图标
      var param = {
        size: 6 + that.data.pageNumber * 6,
      }
      request.wxRequest(that, '/activity-info/list', 'GET', param, (res) => {
        console.log(res.data, '上拉加载成功')
        that.setData({
          bigshot_list: res.data.records,
          pageNumber: ++that.data.pageNumber
        });
        wx.hideLoading();  // 隐藏加载框
      })
    }else{
      that.setData({
        over: true
      })
    }
  },

  /* 弹出层函数*/
  //签到
  signin: function () {
    var that = this
    //查询用户今日签到状况
    var param = {
      userId: app.globalData.userId,
      signinScoreTypeId: "signin",
    }
    request.wxRequest(that, '/user-info/today-signin-status', 'GET', param, (res) => {
      if (res.data) {  //今天签到了
        that.setData({
          signinNo: true
        })
      } else {   //今天没有签到
        var param = {
          currentUserId: app.globalData.userId,
          signinScoreTypeId: "signin",
        }
        request.wxRequest(that, '/score-detail/signin', 'post', param, (res) => {
          that.setData({
            signin: true,
            userScore: res.data.userScore
          })
        })
      }
    })
  },

  //出现
  bonus: function () {this.setData({ bonus: true })},
  
  //消失
  close: function () {
    this.setData({ 
      bonus: false,  //好友加成弹窗
      convert: false,  //积分兑换ETM弹窗
      signin: false,  //签到弹窗
      signinNo: false,  //签到弹窗
    })
  },

  /* 转发事件*/
  onShareAppMessage: function (res){
    var that = this
    var param = 'inviteUserId=' + app.globalData.userId; //分享链接带自己的id
    console.log(param,'转发事件')
    if(res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target, '来自页面内发按钮')
    }
    return {
      title: '转发好友赚积分',
      path: '/pages/login/login?' + param,
      imageUrl: '/images/invite.png',
    }
  }
}) 