var app = getApp();

module.exports = {
  wxLogin: wxLogin,//微信登陆获取Code码
  checkPhoneNum: checkPhoneNum,//验证手机号格式
  showToast: showToast,//提示框
  getUserInfoRight: getUserInfoRight,//获取用户信息授权
  getLocationInfo: getLocationInfo,//获取地理信息授权
  laterDo: laterDo,//延时函数
  getNowFormatDate: getNowFormatDate,//获取当前时间
  getNowFormatDay: getNowFormatDay,//转换某个时间为(年-月-日)此格式
  objKeySort: objKeySort, //参数排序函数
  wxWebSocket: wxWebSocket, //webSocket接口
  weight: weight,  //数组权重排序
  filterEmoji: filterEmoji,  //过滤emoji表情
  filterSpace: filterSpace  //过滤所有空格键 
}

/*wx.Login*/
function wxLogin(successCallBack) {
  wx.login({
    success: function (res) {
      if (res.code) {
        successCallBack(res.code)
      } else {
        console.log('登录失败！' + res.errMsg)
      }
    }
  })
}

/*获取用户信息（userInfo）授权*/
function getUserInfoRight(that,userInfo) {
  //获取用户授权
  wx.getSetting({
    success(res) {
      if (res.authSetting['scope.userInfo']) { // 成功授权
        wx.getUserInfo({
          success: function (res) {
            wx.setStorageSync('userInfo', res.userInfo);//存储userInfo
            userInfo(res.userInfo)
          },
        });
      }
    }
  })
}


/*验证手机号格式*/
function checkPhoneNum(phoneNum) {
  var myreg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
  var tempStatus = false;
  if (phoneNum.length != 11 || !myreg.test(phoneNum)) {
    tempStatus = true;
  }
  return tempStatus;
}


/*微信提示框封装*/
function showToast(title, toastType, time) {
  var imgUrl = null;
  if (toastType == "success") { imgUrl = "/images/success.png" } //正确
  if (toastType == "warn") { imgUrl = "/images/wrong.png" }  //错误
  wx.showToast({
    title: title,
    image: imgUrl,
    duration: time,
  })
}

/*获取用户通讯地址（address）授权*/
function getLocationInfo() {
  //查看是否授权
  wx.getSetting({
    success(res) {
      if (!res.authSetting['scope.address']) {   //如果没有授权
        wx.authorize({
          scope: 'scope.address',
          success() {   //保存用户信息
            wx.chooseAddress()
          },
          fail() {
            wx.openSetting({
              success: (res) => {
                res.authSetting = {
                  "scope.address": true
                }
              }
            })
          }
        })
      } else {
        //保存用户信息
        wx.getUserInfo({
          success: function (res) {
            wx.setStorageSync('userInfo', res.userInfo); //存储userInfo在本地缓存
          },
        });
      }
    }
  })
}

/*延时函数*/
function laterDo(that, time, doSomething) {
  var timeOut = time;
  count_down();
  function count_down() {
    // 渲染倒计时时钟
    if (timeOut <= 0) {
      // timeout则跳出递归
      return;
    }
    setTimeout(function () {
      // 放在最后--
      timeOut -= 10;
      count_down();
    }, 10)
  }
}

/*获取当前时间*/
function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    + " " + date.getHours() + seperator2 + date.getMinutes()
    + seperator2 + date.getSeconds();
  console.log(currentdate)
  return currentdate;
}

/*转换某个时间为(年-月-日)此格式*/
function getNowFormatDay(date) {
  var date = new Date(date);
  var seperator1 = "-";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
  return currentdate;
}


/*排序函数*/
function objKeySort(obj) {//排序的函数
  var newkey = Object.keys(obj).sort();
  //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
  var newObj = {};//创建一个新的对象，用于存放排好序的键值对
  for (var i = 0; i < newkey.length; i++) {//遍历newkey数组
    newObj[newkey[i]] = obj[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
  }
  return newObj;//返回排好序的新对象
}


/*WebSocket打开*/
function wxWebSocket(successCallBack) {
  if (!app.globalData.socketOpen) {
    wx.connectSocket({
      url: 'ws://169.254.107.60:8080/xcx/chat/456'
    })
    //监听WebSocket打开
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
      app.globalData.socketOpen = true
    })
  }
  //监听WebSocket错误
  wx.onSocketError(function (res) {
    console.log('WebSocket连接打开失败，请检查！')
    app.globalData.socketOpen = false
    if (!app.globalData.socketOpen) {
      wx.connectSocket({
        url: 'ws://169.254.107.60:8080/xcx/chat/456'
      })
      //监听WebSocket打开
      wx.onSocketOpen(function (res) {
        console.log('WebSocket连接已打开！')
        app.globalData.socketOpen = true
      })
    }
  })
  //接受WebSocket消息
  wx.onSocketMessage(function (res) {
    console.log('收到服务器内容：' + res.data)
    //调用查询信息接口
    successCallBack(res.data)
  })
  //监听WebSocket关闭
  wx.onSocketClose(function () {
    console.log('WebSocket已经关闭！')
    app.globalData.socketOpen = false
    if (!app.globalData.socketOpen) {
      wx.connectSocket({
        url: 'ws://169.254.107.60:8080/xcx/chat/456'
      })
      //监听WebSocket打开
      wx.onSocketOpen(function (res) {
        console.log('WebSocket连接已打开！')
        app.globalData.socketOpen = true
      })
    }
  })
}


/* 数组权重排序 */
function weight(obj1, obj2) {
  var val1 = obj1.heatRate;
  var val2 = obj2.heatRate;
  if (val1 < val2) {
    return 1;
  } else if (val1 > val2) {
    return -1;
  } else {
    return 0;
  }
}

/* 过滤emoji表情 */
function filterEmoji(name) {
  var str = name.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, "");
  return str;
}

/* 过滤所有空格键 */
function filterSpace(name) {
  var str = name.replace(/\s+/g, '');
  return str;
}








