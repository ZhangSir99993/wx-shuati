//获取应用实例
const app = getApp()
//auth.js
const auth = require('../../api/auth.js');
const site = require('../../api/site.js').site;

Page({
    data: {
        isVip: false,
        validTime:'',
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        isAuthorize: true, //是否需要授权注册登录
        loadingfinish:false,
        itemList: [{
            albumId: '综合冲刺题一',
            finish: 0,
            count: 200,
            right: 0,
            error: 0
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
                that.vipInfo();
            }
            that.setData({
                loadingfinish:true
            })
        });
    },
    initInfo: function () {
        var that = this
        wx.showLoading({
            title:'加载中...'
        })
        wx.request({
            url: site.m + 'listvip/'+app.globalData.tablename,
            method: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res.data.code == 200) {
                    that.setData({
                        itemList: res.data.data
                    }, function () {
                        that.data.itemList.forEach(element => {
                            element.continue = that.getCurrent(element.albumId)
                            element.finishCount = that.getProgress(element.albumId)
                            if (element.finishCount) {
                                element.progress = (element.finishCount/element.count)*100
                            }
                        });
                        that.setData({
                            itemList: that.data.itemList
                        })
                    })
                } else {
                    wx.showToast({
                        title: '服务器出了点问题，请稍候重试',
                        icon: 'none',
                        duration: 2000
                    })
                }
            },
            fail: function (err) {
                wx.showToast({
                    title: '服务器出了点问题，请稍候重试',
                    icon: 'none',
                    duration: 2000
                })
            },
            complete: function () {
                wx.hideLoading();
            }
        })
    },
    getCurrent: function (albumId) {
        var answer_List = wx.getStorageSync(albumId) || []; //获取当前章节的答题列表
        if (answer_List.length) {
            var current;
            var currentAnswerList = answer_List[answer_List.length - 1].currentAnswerList;
            for (let index = 0; index < currentAnswerList.length; index++) {
                if (currentAnswerList[index]) {
                    current = index + 1
                }
            }
            if (current >= currentAnswerList.length) {
                current = 0
            }
            return current;
        } else {
            return null;
        }
    },
    getProgress: function (albumId,count) {
        var answer_List = wx.getStorageSync(albumId) || []; //获取当前章节的答题列表
        if (answer_List.length) {
            var finishCurrent = 0;
            answer_List.forEach(element => {
                var currentAnswerList = element.currentAnswerList;
                for (let index = 0; index < currentAnswerList.length; index++) {
                    if (currentAnswerList[index]) {
                        finishCurrent++;
                    }
                }
            });
            return finishCurrent;
        } else {
            return null;
        }
    },
    vipInfo:function(){
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
    detailClick: function (e) {
        if (this.data.isAuthorize) {
            wx.showToast({
                title: '请先登录',
                icon:'none'
            })
            return
        }
        if (!this.data.isVip) {
            this.openVipClick()
        }
        console.log("进入模拟题详情页");

        wx.navigateTo({
            url: `/pages/detail/detail?albumId=${e.currentTarget.dataset.albumid}&isVip=true`
        });
    },
})