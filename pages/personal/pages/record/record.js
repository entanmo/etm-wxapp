//account.js
var app = getApp();
var utils = require('../../../../utils/util.js')
var request = require('../../../../utils/httpRequest.js')

Page({
  data: {
    account_list: [], //积分明细
    pageNumber: 1, //下拉页数
    pages: '', //总页数
    over: false, //分页底线
  },

  onLoad: function (options) {
    var that = this
    var param = {
      currentUserId: app.globalData.userId,
      size: 10,
    }
    request.wxRequest(that, '/score-detail/list-all-by-user-id', 'GET', param, (res) => {
      that.setData({
        account_list: res.data.records,
        pages: res.data.pages
      })
    })
  },

  //上拉加载
  onReachBottom: function () {
    var that = this;
    if (that.data.pageNumber < that.data.pages) {
      wx.showLoading({ title: '玩命加载中' })  // 显示加载图标
      var param = {
        currentUserId: app.globalData.userId,
        size: 10 + that.data.pageNumber * 10,
      }
      request.wxRequest(that, '/score-detail/list-all-by-user-id', 'GET', param, (res) => {
        that.setData({
          account_list: res.data.records,
          pageNumber: ++that.data.pageNumber
        });
        wx.hideLoading();  // 隐藏加载框
      })
    } else {
      that.setData({
        over: true
      })
    }
  },

})
