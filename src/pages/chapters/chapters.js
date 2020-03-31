//获取应用实例
const app = getApp()
//api.js
const site = require('../../api/site.js').site;

//util.js
const util = require('../../utils/util.js');
//auth.js
const auth = require('../../api/auth.js');

Page({
    data: {
        isVip: false,
        validTime: '',
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        isAuthorize: true, //是否需要授权注册登录
        loadingfinish: false,
        itemList: [],
        navArr: [{
            title: "NPDP",
            tablename: 'npdp'
        }, {
            title: "PMP",
            tablename: 'pmp'
        }, {
            title: "ACP",
            tablename: 'acp'
        }],
        currentTap: 0
    },
    onLoad: function () {
        switch (app.globalData.tablename) {
            case 'npdp':
                this.setData({
                    currentTap: 0
                })
                break;
            case 'pmp':
                this.setData({
                    currentTap: 1
                })
                break;
            case 'acp':
                this.setData({
                    currentTap: 2
                })
                break;
            default:
                break;
        }
        //登录授权检测
        this.checkAuthorized();
    },
    onShow: function () {
        var that = this
        if (app.globalData.refreshVip) {
            app.globalData.refreshVip = false
            //登录授权检测
            that.checkAuthorized();
        }
    },
    checkAuthorized: function () {
        var that = this;
        auth.wxCheckSession(this, function (session_key) {
            let sessionKey = session_key ? session_key : wx.getStorageSync("session_key");
            if (sessionKey) {
                that.setData({
                    isAuthorize: true //需要授权，注册登录
                });
                //初始化页面信息
                that.initInfo();
            } else {
                that.setData({
                    isAuthorize: false //不需要授权，已登录状态
                });
                //初始化页面信息
                that.initInfo();
                that.vipInfo();
            }
            that.setData({
                loadingfinish: true
            })
        });
    },
    vipInfo: function () {
        var userInfo = app.globalData.userInfo
        switch (app.globalData.tablename) {
            case 'npdp':
                if (userInfo.npdpVip) {
                    this.handleVipInfp(userInfo.npdpValidTime, 'npdp')
                }
                break;
            case 'pmp':
                if (userInfo.pmpVip) {
                    this.handleVipInfp(userInfo.pmpValidTime, 'pmp')
                }
                break;
            case 'acp':
                if (userInfo.acpVip) {
                    this.handleVipInfp(userInfo.acpValidTime, 'acp')
                }
                break;
            default:
                break;
        }
    },
    //处理vip用户信息
    handleVipInfp: function (validTime, tablename) {
        var that = this
        var ms = parseInt(validTime) - new Date().getTime()
        var day = ms / (1000 * 60 * 60 * 24)
        if (day > 0) {
            this.setData({
                isVip: true,
                validTime: util.formatDateTime(validTime, 'yyyy-MM-dd')
            })
            if (day < 3) {
                if (wx.getStorageSync('no_remind')) {
                    return;
                }
                wx.showModal({
                    title: '您的VIP即将过期。',
                    content: '您的VIP有效期不足3天，到期未续期将影响您相关业务的正常使用。',
                    cancelText: '不在提示',
                    confirmText: '立刻续期',
                    success(res) {
                        if (res.confirm) {
                            that.openVipClick()
                        } else if (res.cancel) {
                            wx.setStorageSync('no_remind','true')
                        }
                    }
                })               
            }
        } else {
            //过期vip，关闭用户对应科目vip状态
            wx.request({
                url: site.m + 'miniprogram/closevip',
                method: 'POST',
                header: auth.setHeader(),
                data: {
                    tablename: tablename
                },
                dataType: 'json',
                success: function (res) {
                    if (res.data.code == 200) {
                        if (res.data.data.result) {
                            app.globalData.userInfo = res.data.data.result
                        } else {
                            wx.showModal({
                                title: '提示',
                                showCancel: false,
                                content: res.data.data.message,
                                success: function (res) {}
                            })
                        }
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
                        title: JSON.stringify(err),
                        icon: 'none',
                        duration: 2000
                    })
                },
                complete: function () {}
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
    initInfo: function () {
        var that = this
        wx.showLoading({
            title: '加载中...'
        })
        var url  = site.m + 'secondchapters/' + app.globalData.tablename + 'book'
        if (that.options.book2) {
            url += '2'
        }
        wx.request({
            url: url,
            method: 'POST',
            data:{
                albumId:that.options.albumid
            },  
            dataType: 'json',
            success: function (res) {
                if (res.data.code == 200) {
                    that.setData({
                        itemList: res.data.data
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
                wx.hideLoading()
                wx.stopPullDownRefresh()
            }
        })
    },
    detailClick: function (e) {
        /*
        if (this.data.isAuthorize) {
            wx.showToast({
                title: '请先登录',
                icon: 'none'
            })
            return
        }
        if (!this.data.isVip&&!this.options.isfree) {
            this.openVipClick()
            return
        }*/
        wx.navigateTo({
            url: `/pages/chaptersdetail/chaptersdetail?book2=${this.options.book2}&albumid=${e.currentTarget.dataset.albumid}&albumid2=${e.currentTarget.dataset.albumid2}&albumid3=${e.currentTarget.dataset.albumid3}&albumid4=${e.currentTarget.dataset.albumid4}`
        })
        return;
        if (e.currentTarget.dataset.name) {
            wx.navigateTo({
                url: `/pages/webview/webview?albumid=${e.currentTarget.dataset.name}`
            })
        }
    },
    //下拉刷新
    onPullDownRefresh: function () {
        this.initInfo()
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: "我发现一个刷题小程序，很棒啊，你也试试",
            path: "/pages/study/study"
        }
    }
})