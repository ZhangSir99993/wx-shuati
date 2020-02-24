//获取应用实例
const app = getApp()
//auth.js
const auth = require('../../api/auth.js');
Page({
    data:{
        vipInfo:{},
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
    },
    onLoad:function(){
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
                that.initInfo();
            }
        });
    },
    initInfo: function () {
        var userInfo;
        if (app.globalData.userInfo) {
            userInfo = app.globalData.userInfo
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                userInfo = res.userInfo
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    userInfo = res.userInfo
                }
            })
        }
        var vipInfo={}
        switch (app.globalData.tablename) {
            case 'npdp':
                if (userInfo.npdpVip) {
                    vipInfo.tablename = 'npdp'
                    vipInfo.validTime = userInfo.npdpValidTime
                    vipInfo.vip = userInfo.npdpVip
                }
                break;
            case 'pmp':
                if (userInfo.pmpVip) {
                    vipInfo.tablename = 'pmp'
                    vipInfo.validTime = userInfo.pmpValidTime
                    vipInfo.vip = userInfo.pmpVip
                }
                break;
            case 'acp':
                if (userInfo.acpVip) {
                    vipInfo.tablename = 'acp'
                    vipInfo.validTime = userInfo.acpValidTime
                    vipInfo.vip = userInfo.acpVip
                }
                break;
            default:
                break;
        }
        this.setData({
            vipInfo:vipInfo
        })
    },
})