//获取应用实例
const app = getApp()
//api.js
const site = require('../../api/site.js').site;
//auth.js
const auth = require('../../api/auth.js');
const util = require('../../utils/util.js')

Page({
    data: {
        userInfo: {},
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        keyword: '',
        priceItems: [{
            time: '一个月',
            realPrice: '15',
            originalPrice: '20',
            savePrice: '5'
        }, {
            time: '三个月',
            realPrice: '30',
            originalPrice: '60',
            savePrice: '30'
        }, {
            time: '六个月',
            realPrice: '45',
            originalPrice: '120',
            savePrice: '75'
        }],
        privileges: [{
            name: '真题模拟免费做',
            desc: '该科目下所有试卷都能免费不限次数作答'
        }, {
            name: '无限次全书查询',
            desc: '可无限次搜索术语查看解析，方便高效'
        }, {
            name: '一对一答疑',
            desc: '一对一指导备考问题，少走弯路'
        }, {
            name: '免费享有题库更新',
            desc: '定期更新最新题库紧跟最新考试大纲'
        }, {
            name: '会员享有优先服务',
            desc: '优先解决会员需求包括更新最新功能'
        }, {
            name: '免费享有会员新增服务',
            desc: '我们会不断增加会员其他功能'
        }],
        avatarUrlArr: [],
        isAuthorize: true,
        loadingStatus: false, //防重复提交
        currentIndex: 0,
        btnLoading: false,
        subjectList: [
            'npdp',
            'pmp',
            'acp'
        ],
        index:0
    },
    onShow: function () {
        this.setData({
            btnLoading: false
        })
    },
    onLoad: function () {
        //登录授权检测
        this.checkAuthorized();
        this.getUserAvatarUrl();
    },
    getUserAvatarUrl: function () {
        var that = this
        wx.request({
            url: site.m + 'getUserAvatarUrl',
            method: 'POST',
            data: {
                pageNum: 5
            },
            dataType: 'json',
            success: function (res) {
                if (res.data.code == 200) {
                    if (res.data.data && res.data.data.length) {
                        that.setData({
                            avatarUrlArr: res.data.data
                        })
                    }
                }
            }
        })
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
        var vipInfo = {}
        var index = 0
        switch (app.globalData.tablename) {
            case 'npdp':
                if (userInfo.npdpVip) {
                    vipInfo.validTime = util.formatDateTime(userInfo.npdpValidTime, 'yyyy-MM-dd')
                    vipInfo.vip = userInfo.npdpVip
                }
                index = 0
                break;
            case 'pmp':
                if (userInfo.pmpVip) {
                    vipInfo.validTime = util.formatDateTime(userInfo.pmpValidTime, 'yyyy-MM-dd')
                    vipInfo.vip = userInfo.pmpVip
                }
                index = 1
                break;
            case 'acp':
                if (userInfo.acpVip) {
                    vipInfo.validTime = util.formatDateTime(userInfo.acpValidTime, 'yyyy-MM-dd')
                    vipInfo.vip = userInfo.acpVip
                }
                index = 2
                break;
            default:
                break;
        }
        this.setData({
            userInfo: userInfo,
            vipInfo: vipInfo,
            index:index
        })
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
            if (e.currentTarget.dataset.openvip) {
                that.openVipClick()
            }
        })
    },
    bindblur: function (e) {
        this.data.keyword = e.detail.value
    },
    openVipClick: function () {
        var that = this
        if (that.data.keyword) {
            if (that.data.keyword.length >= 15 && that.data.keyword.length <= 18) {
                if (that.data.loadingStatus) {
                    return
                }
                that.data.loadingStatus = true
                wx.showLoading({
                    title: '正在开通...'
                })
                wx.request({
                    url: site.m + 'miniprogram/openvip',
                    method: 'POST',
                    header: auth.setHeader(),
                    data: {
                        code: that.data.keyword,
                        userInfo: JSON.stringify(that.data.userInfo)
                    },
                    dataType: 'json',
                    success: function (res) {
                        if (res.data.code == 200) {
                            if (res.data.data.result) {
                                app.globalData.userInfo = res.data.data.result
                                app.globalData.refreshVip = true
                                wx.redirectTo({
                                    url: '/pages/vipresult/vipresult'
                                })
                            } else {
                                wx.hideLoading();
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
                    complete: function () {
                        that.data.loadingStatus = false
                        wx.hideLoading();
                    }
                })
            } else {
                wx.showToast({
                    title: '授权码位数不对，请联系客服核实授权码',
                    icon: 'none',
                    duration: 2000
                })
            }
        } else {
            wx.showToast({
                title: '请输入会员授权码',
                icon: 'none',
                duration: 2000
            })
        }
    },
    bindPickerChange: function (e) {
        this.setData({
            index: e.detail.value
        })
    },
    priceClick: function (e) {
        if (e.currentTarget.dataset.index) {
            this.setData({
                currentIndex: e.currentTarget.dataset.index
            })
        }
    },
    buySubmit: function () {
        var that = this
        if (that.data.keyword) {
            that.openVipClick()
            return;
        }
        if (!that.data.currentIndex) {
            wx.showToast({
                title: '请选择开通的月份',
                icon: 'none',
                duration: 2000
            })
            return
        }
        if (!that.data.buyEventStatus) {
            return;
        };
        that.data.buyEventStatus = false
        that.setData({
            btnLoading: true
        });
        wx.request({
            url: site.m + 'miniprogram/wxpay',
            method: 'POST',
            data: {
                openid: wx.getStorageSync("openid"),
                tablename: that.data.subjectList[that.data.index],
                total_fee: 1500 * that.data.currentIndex
            },
            dataType: 'json',
            success: function (res) {
                if (res.data.code == 200) {
                    if (res.data.data) {
                        var obj = res.data.data;
                        var path = `/pages/wxpay/wxpay?timeStamp=${obj.timeStamp}&nonceStr=${obj.nonceStr}&prepay_id=${obj.prepay_id}&signType=${obj.signType}&paySign=${obj.paySign}`
                        wx.reLaunch({
                            url: path
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
                    title: '服务器出了点问题，请稍候重试',
                    icon: 'none',
                    duration: 2000
                })
            },
            complete: function () {
                that.data.buyEventStatus = true
                that.setData({
                    btnLoading: false
                });
            }
        })
    }
})