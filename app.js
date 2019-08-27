//app.js
import configLink from './configLink.js'

App({
  globalData: {
    //用户信息
    userId: '', //小程序用户ID
    userTel: '', //用户手机号
    userToken: '', //	用户钱包地址
    userScore: '', //用户当前积分
    totalConvertEtm: '', //用户已兑换的ETM数量

    // 存取包相关
    appid: wx.getAccountInfoSync().miniProgram.appId, //小程序appid
    secret: '67bddfff4f2fbd45ed99bc558f8adc61', //小程序密钥
    openid: null, //用户的唯一openid
    userInfo: null, //微信用户信息
    //token: null, //token

    //接口地址相关
    wxHost: configLink.wxHost,   //微信项目接口
  },

  onShow: function(){
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    }
  },

})


