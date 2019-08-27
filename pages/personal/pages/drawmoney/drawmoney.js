// pages/personal/pages/drawmoney/drawmoney.js
var app = getApp();
var utils = require('../../../../utils/util.js')
var request = require('../../../../utils/httpRequest.js')

Page({
  data: {
    site: '', //钱包地址表单
    phone: '', //手机号码表单
    money: '',  //兑换积分表单
    amount:'',  //可兑换积分总数
    informLink: '',  //注册ETM钱包
    register: false, //ETM注册弹窗
    website: 'https://wallet.entanmo.com', //ETM注册网站

    present: false,  //成功提交弹窗
    hint: false,   //错误提示弹窗
    hintText:'', //错误提示弹窗文案

    scoreProportion: '', //积分占比
    etmProportion: '',//ETM占比

    typeScore:''
  },

  onLoad: function () {
    var that = this
    that.setData({
      site: app.globalData.userToken,
      phone: app.globalData.userTel,
    })
  },
  
  onShow: function () {
    var that = this
    //查询积分和ETM占比
    request.wxRequest(that, '/score-etm-proportion/get-score-etm-proportion', 'GET', null, (res) => {
      that.setData({
        scoreProportion: res.data.scoreProportion,
        etmProportion: res.data.etmProportion
      })
    })
    var param = {
      id: 'fee'
    }
    //主键查看积分配置
    request.wxRequest(that, '/score-type/info-by-id', 'GET', param, (res) => {
      that.setData({
        typeScore: res.data.typeScore,
      })
      //查询用户信息
      var param = {
        id: app.globalData.userId,
        convertScoreTypeId: "convert",
      }
      request.wxRequest(that, '/user-info/info-by-id', 'GET', param, (res) => {
        let amount = res.data.userScore - that.data.typeScore
        if (amount <= 0){
          that.setData({
            amount: 0
          })
        }else{
          that.setData({
            amount: res.data.userScore - that.data.typeScore
          })
        }
      })
    })
  },


  //全部兑换
  moneyWhole:function(){
    var that = this
    that.setData({
      money: that.data.amount
    })
  },
  
  //提交表单
  formSubmit: function (e) {
    var that = this;
    if (e.detail.value.site == "") {
      that.setData({hint: true, hintText:'钱包地址是否填写！'})
    } else if (e.detail.value.site.length < 33 || e.detail.value.site.length > 34) {
      that.setData({ hint: true, hintText: '钱包地址是否正确！' })
    } else if (e.detail.value.phone == "") {
      that.setData({ hint: true, hintText: '手机号是否填写！' })
    } else if (!(/^1[23456789]\d{9}$/.test(e.detail.value.phone))) {
      that.setData({hint: true,hintText: '手机号是否填写正确！'})
    } else if (e.detail.value.money == "") {
      that.setData({hint: true, hintText: '兑换数量是否填写！'})
    } else if (e.detail.value.money > that.data.amount) {
      that.setData({hint: true, hintText: '兑换数量是否超过！'})
    } else if (e.detail.value.money <= 0) {
      that.setData({ hint: true, hintText: '兑换数量是否大于0！'})
    } else {
      var param = {
        userId: app.globalData.userId,
        userToken: e.detail.value.site,
        userTel: e.detail.value.phone,
        score: e.detail.value.money,
        convertScoreTypeId:"convert",
        feeScoreTypeId:"fee",
      }
      request.wxRequest(that, '/score-detail/convert', 'POST', param, (res) => {
        let amount = res.data.userScore - that.data.typeScore
        if (amount <= 0) {
          that.setData({
            amount: 0
          })
        } else {
          that.setData({
            amount: res.data.userScore - that.data.typeScore
          })
        }

        that.setData({ 
          present: true,
          money: '',
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
            console.log(res.data) // data复制
          }
        })
      }
    })
  },
  register: function () {
    this.setData({
      register: true,
    })
  },
  close: function () {
    this.setData({
      register: false,
    })
  },

  //消失
  confirm: function () {
    this.setData({
      present: false,  //好友加成弹窗
      hint: false   //提示弹窗
    })
  },

})