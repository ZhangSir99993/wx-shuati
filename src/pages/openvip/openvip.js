//获取应用实例
const app = getApp()
//api.js
const site = require('../../api/site.js').site;
//auth.js
const auth = require('../../api/auth.js');
Page({
    data: {
        userInfo: {},
        tablename:"",
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        keyword: '',
        priceItems: [{
            time: '一个月',
            realPrice: '9.9',
            originalPrice: '15',
            savePrice: '5'
        }, {
            time: '三个月',
            realPrice: '24.9',
            originalPrice: '45',
            savePrice: '20'
        }, {
            time: '六个月',
            realPrice: '34.9',
            originalPrice: '90',
            savePrice: '55'
        }],
        privileges: [{
            name: '真题模拟免费做',
            desc: '该科目下所有试卷都能免费不限次数作答'
        }, {
            name: '无限次术语查询',
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
            userInfo: userInfo,
            vipInfo:vipInfo,
            tablename:app.globalData.tablename
        })
    },
    bindblur: function (e) {
        this.data.keyword = e.detail.value
    },
    openVipClick: function () {
        if (this.data.keyword) {
            if (this.data.keyword.length >= 15 && this.data.keyword.length <= 18) {
                wx.showLoading({
                    title: '正在开通...'
                })
                wx.request({
                    url: site.m + 'miniprogram/openvip',
                    method: 'POST',
                    header: auth.setHeader(),
                    data: {
                        code: this.data.keyword,
                        userInfo: JSON.stringify(this.data.userInfo)
                    },
                    dataType: 'json',
                    success: function (res) {
                        if (res.data.code == 200) {
                            if (res.data.data.result) {
                                app.globalData.userInfo = res.data.data.result
                                wx.redirectTo({
                                    url: '/pages/vipresult/vipresult'
                                })
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
                    complete: function () {
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
    }
})