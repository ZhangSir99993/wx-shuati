//获取应用实例
const app = getApp()
//auth.js
const auth = require('../../api/auth.js');
Page({
    data:{
        userInfo:{},
    },
    onLoad:function(){
        this.checkAuthorized()
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
                    isAuthorize: false, //不需要授权，已登录状态
                    userInfo:app.globalData.userInfo
                });
            }
        });
    }
})