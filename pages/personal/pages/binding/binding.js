// pages/personal/pages/drawmoney/drawmoney.js
var app = getApp();
var utils = require('../../../../utils/util.js')
var request = require('../../../../utils/httpRequest.js')

Page({
  data: {
    binding: '', //绑定钱包或手机号判断
    register: false, //ETM注册弹窗
    website: 'https://wallet.entanmo.com', //ETM注册网站

    siteJudge: false, //已绑定钱包地址判断
    isbindingSite: '', //已绑定钱包地址
    phoneJudge: false, //已绑定手机号判断
    isbindingPhone: '', //已绑定手机号
    succeedText: '', //绑定成功文案
    succeed: false, //绑定成功弹窗
  },

  onLoad: function (options) {
    var that = this
    that.setData({
      binding: options.binding,
      isbindingSite: app.globalData.userToken,
      isbindingPhone: app.globalData.userTel,
    })
    if (options.binding == 1){
      wx.setNavigationBarTitle({title: '绑定钱包'})
      if (app.globalData.userToken != ''){
        that.setData({
          siteJudge: true,
        })
      }
      
    } else if (options.binding == 2){
      wx.setNavigationBarTitle({title: '绑定手机号'})
      if (app.globalData.userTel != '') {
        that.setData({
          phoneJudge: true,
        })
      }
    }
  },

  //提交绑定钱包
  formPurse: function (e) {
    var that = this;
    if (e.detail.value.site == "") {
      utils.showToast('请填写钱包地址!', 'warn', 2000)
    } else if (e.detail.value.site.length < 33 || e.detail.value.site.length > 34){
      utils.showToast('钱包地址不正确!', 'warn', 2000)
    }else{
      var param = {
        id: app.globalData.userId,
        userToken: e.detail.value.site,
      }
      request.wxRequest(that, '/user-info/update-user-info', 'POST', param, (res) => {
        app.globalData.userToken = res.data.userToken
        that.setData({
          siteJudge: true,
          isbindingSite: res.data.userToken,
          site:'',
          succeedText:'钱包地址',
          succeed: true,
        })
      })
    }
  },

  //提交绑定手机号
  formPhone: function (e) {
    var that = this;
    if (e.detail.value.phone == "") {
      utils.showToast('请填写手机号!', 'warn', 2000)
    } else if (!(/^1[23456789]\d{9}$/.test(e.detail.value.phone))) {
      utils.showToast('手机号不正确!', 'warn', 2000)
    } else {
      var param = {
        id: app.globalData.userId,
        userTel: e.detail.value.phone,
      }
      request.wxRequest(that, '/user-info/update-user-info', 'POST', param, (res) => {
        app.globalData.userTel = res.data.userTel
        that.setData({
          phoneJudge: true,
          isbindingPhone: res.data.userTel,
          phone:'',
          succeedText: '手机号',
          succeed: true,
        })
      })
    }
  },

  //复制ETM钱包地址
  copy: function (e) {
    var that = this
    wx.setClipboardData({
      data: that.data.website,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },

  register: function(){
    this.setData({
      register: true,
    })
  },
  close: function(){
    this.setData({
      register: false,
    })
  },

  confirm: function () {
    this.setData({
      succeed: false,
    })
  }
})