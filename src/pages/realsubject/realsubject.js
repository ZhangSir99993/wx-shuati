//获取应用实例
const app = getApp()
//auth.js
const auth = require('../../api/auth.js');
const site = require('../../api/site.js').site;
const util = require('../../utils/util.js')
Page({
    data: {
        isVip: false,
        validTime: '',
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        isAuthorize: true, //是否需要授权注册登录
        loadingfinish: false,
        itemList: [],
        currentPage: 0,
        haveMore: true

    },
    onLoad: function () {
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
        if (that.data.itemList.length) {
            that.data.itemList.forEach(element => {
                var currentCount = that.getCurrent(element.albumId);
                element.finishCount = currentCount.finishCount
                element.rightCount = currentCount.rightCount
                element.errorCount = currentCount.errorCount
                element.isContinue = currentCount.isContinue
            });
            that.setData({
                itemList: that.data.itemList
            })
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
    initInfo: function (next) {
        var that = this
        if (that.data.loadingStatus) {
            return
        }
        that.data.loadingStatus = true
        wx.showLoading({
            title: '加载中...'
        })
        if (next) {
            that.data.currentPage += 1
        }
        wx.request({
            url: site.m + 'listvip/' + app.globalData.tablename,
            method: 'POST',
            data: {
                currentPage: that.data.currentPage
            },
            dataType: 'json',
            success: function (res) {
                if (res.data.code == 200) {
                    if (res.data.data.length) {
                        that.setData({
                            itemList: next ? that.data.itemList.concat(res.data.data) : res.data.data
                        }, function () {
                            that.data.itemList.forEach(element => {
                                var currentCount = that.getCurrent(element.albumId);
                                element.finishCount = currentCount.finishCount
                                element.rightCount = currentCount.rightCount
                                element.errorCount = currentCount.errorCount
                                element.isContinue = currentCount.isContinue
                            });
                            that.setData({
                                itemList: that.data.itemList
                            })
                        })
                        if (res.data.data.length < 15) {
                            that.data.haveMore = false
                        }
                    } else {
                        that.data.haveMore = false
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
                    title: '服务器出了点问题，请稍候重试',
                    icon: 'none',
                    duration: 2000
                })
            },
            complete: function () {
                that.data.loadingStatus = false
                wx.hideLoading();
            }
        })
    },
    getCurrent: function (albumId) {
        var answer_List = wx.getStorageSync(albumId) || []; //获取当前章节的答题列表
        var finishCount = 0,
            rightCount = 0,
            errorCount = 0,
            isContinue = false;
        if (answer_List.length) {
            var tempAnswerList = answer_List[answer_List.length - 1].currentAnswerList;
            for (let index = 0; index < tempAnswerList.length; index++) {
                if (tempAnswerList[index]) {
                    if (tempAnswerList[index] == 1) {
                        rightCount++
                    } else if (tempAnswerList[index] == 2) {
                        errorCount++
                    }
                    finishCount++
                }
            }
            if (0 < finishCount < tempAnswerList.length) {
                isContinue = true
            }
        }
        return {
            isContinue: isContinue,
            finishCount: finishCount,
            rightCount: rightCount,
            errorCount: errorCount
        };
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
    detailClick: function (e) {
        if (this.data.isAuthorize) {
            wx.showToast({
                title: '请先登录',
                icon: 'none'
            })
            return
        }
        if (this.data.isVip) {
            wx.navigateTo({
                url: `/pages/detail/detail?albumId=${e.currentTarget.dataset.albumid}&isVip=true`
            });
        } else {
            this.openVipClick()
        }
    },
    onReachBottom: function () {
        if (this.data.haveMore) {
            this.initInfo(true);
        }
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: "我发现一个刷题小程序，很棒啊，你也试试",
            path: "/pages/index/index"
        }
    }
})