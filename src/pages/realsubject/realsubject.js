//获取应用实例
const app = getApp()
//auth.js
const auth = require('../../api/auth.js');
Page({
    data: {
        isVip: false,
        validTime:'',
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        isAuthorize: true, //是否需要授权注册登录
        loadingfinish:false,
        itemList: [{
            title: '综合冲刺题一',
            finish: 100,
            total: 200,
            right: 50,
            error: 50
        }, {
            title: '综合冲刺题一',
            finish: 100,
            total: 200,
            right: 50,
            error: 50
        }, {
            title: '综合冲刺题一',
            finish: 100,
            total: 200,
            right: 50,
            error: 50
        }]
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
            that.setData({
                loadingfinish:true
            })
        });
    },
    initInfo:function(){
        var userInfo = app.globalData.userInfo
        switch (app.globalData.tablename) {
            case 'npdp':
                if (userInfo.npdpVip) {
                    this.setData({
                        isVip:true,
                        validTime:userInfo.npdpValidTime
                    })
                }
                break;
            case 'pmp':
                if (userInfo.pmpVip) {
                    this.setData({
                        isVip:true,
                        validTime:userInfo.pmpValidTime
                    })
                }
                break;
            case 'acp':
                if (userInfo.acpVip) {
                    this.setData({
                        isVip:true,
                        validTime:userInfo.acpValidTime
                    })
                }
                break;
            default:
                break;
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
                isAuthorize: false
            })
            that.openVipClick()
        })
    },
    openVipClick: function () {
        wx.navigateTo({
            url: '/pages/openvip/openvip'
        })
    },
    itemClick: function () {
        if (this.data.isAuthorize) {
            wx.showToast({
                title: '请先登录'
            })
            return
        }
        if (!this.data.isVip) {
            this.openVipClick()
        }
        console.log("进入模拟题详情页");

    }
})