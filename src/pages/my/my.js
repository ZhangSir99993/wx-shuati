// pages/my/my.js
//获取应用实例
const app = getApp()
//auth.js
const auth = require('../../api/auth.js');
//api.js
const site = require('../../api/site.js').site;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isAuthorize: true

  },
  onLoad: function () {
    //登录授权检测
    this.checkAuthorized();
  },
  checkAuthorized: function () {
    var that = this;
    auth.wxCheckSession(this, function (session_key) {
      let sessionKey = session_key ? session_key : wx.getStorageSync("session_key");
      if (sessionKey) {
        that.setData({
          isAuthorize: true //需要授权，注册登录
        });
      } else {
        that.setData({
          isAuthorize: false //不需要授权，已登录状态
        });
        //初始化页面信息
        that.initInfo();
      }
    });
  },
  initInfo: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
      return;
    }
    var that = this
    app.globalData.userInfo = e.detail.userInfo
    auth.wxRegister(this, function () {
      that.setData({
        isAuthorize: false,
        userInfo: e.detail.userInfo
      })
    })
  },
  buttonClick: function (e) {
    switch (e.currentTarget.dataset.index) {
      case '0':
        wx.navigateTo({
          url: '/pages/myvip/myvip'
        });
        break;
      case '1':
        wx.showModal({
          content: '领取PMP NPDP ACP PBA 软考等资料，请添加微信：xiaobaiyi68',
          confirmText: '复制微信',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              wx.setClipboardData({
                data: 'xiaobaiyi68',
                success: function (res) {
                  wx.getClipboardData({
                    success: function (res) {
                      wx.showToast({
                        title: '微信号已复制',
                      });
                    }
                  })
                }
              })
            }
          }
        })
        break;
      case '2':
        break;
      case '3':

        break;
      default:
        break;
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "刷题100-个人中心",
      path: "/pages/my/my"
    }
  }
})