//获取应用实例
const app = getApp()
//api.js
const site = require('../../api/site.js').site;
//util.js
const util = require('../../utils/util.js');
var debounce = util.createDebounce(1000);
//auth.js
const auth = require('../../api/auth.js');
Page({
    data: {
        isVip: false,
        validTime: '',
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        isAuthorize: true, //是否需要授权注册登录
        // loadingfinish: false,
        //数据信息
        currentPage: 0,
        pageNum: 15,
        isHaveMore: true,
        isLoading: false,
        title: '',
        itemList: [],
        defaultList: [],
        keyword: ''
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
            // that.setData({
            //     loadingfinish: true
            // })
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
    initInfo: function (more) {
        var that = this
        that.setData({
            isLoading: true
        })
        var url = that.options.title;
        if (url == 'keyword' || url == 'abbreviate' || url == 'icontable') {
            url += `/${app.globalData.tablename}`
        }
        wx.request({
            url: site.m + url,
            method: 'POST',
            dataType: 'json',
            data: {
                currentPage: more ? that.data.currentPage : 0,
                pageNum: that.data.pageNum
            },
            success: function (res) {
                if (res.data.code == 200) {
                    if (res.data.data && res.data.data.length) {
                        that.setData({
                            title: that.options.title,
                            itemList: more ? that.data.itemList.concat(res.data.data) : res.data.data
                        })
                        that.data.defaultList = more ? that.data.itemList.concat(res.data.data) : res.data.data
                    } else {
                        that.data.isHaveMore = false
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
                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();
                that.setData({
                    isLoading: false
                })
            }
        })
    },
    setKeyWord: function (event) {
        var that = this,
            value = event.detail.value;
        debounce(() => {
            if (event.detail.value.length > 50) {
                value = value.slice(0, 50);
            }
            if (value) {
                that.searchSuggest(value);
            } else {
                that.setData({
                    keyword: '',
                    itemList: that.data.defaultList
                });
            }
        })
    },
    clearKeyWord: function () {
        var that = this;
        that.setData({
            keyword: '',
            searchFocus: true,
            itemList: that.data.defaultList
        });
    },
    searchSuggest: function (value) {
        var that = this;
        if (that.requestTask != null) that.requestTask.abort(); //中断上一次的请求
        that.requestTask = wx.request({
            url: site.m + `searchSuggest/${app.globalData.tablename}`,
            method: 'POST',
            data: {
                subject: that.options.title,
                keyword: value,
                pageNum: 30
            },
            dataType: 'json',
            success: function (res) {
                if (res.data.code == 200) {
                    if (res.data.data && res.data.data.length) {
                        switch (that.options.title) {
                            case 'knowledge':
                                res.data.data.forEach(element => {
                                    if (element.knowledgeSystem.includes(value)) {
                                        element.colorname = element.knowledgeSystem.replace(value, `<span style="color:red;">${value}</span>`)
                                    }
                                });
                                break;
                            case 'process':
                                res.data.data.forEach(element => {
                                    if (element.processGroup.includes(value)) {
                                        element.colorname = element.processGroup.replace(value, `<span style="color:red;">${value}</span>`)
                                    }
                                });
                                break;
                            case 'inputoutput':
                                res.data.data.forEach(element => {
                                    if (element.inputoutput.includes(value)) {
                                        element.colorname = element.inputoutput.replace(value, `<span style="color:red;">${value}</span>`)
                                    }
                                });
                                break;
                            default:
                                res.data.data.forEach(element => {
                                    if (element.name.includes(value)) {
                                        element.colorname = element.name.replace(value, `<span style="color:red;">${value}</span>`)
                                    }
                                });
                                break;
                        }
                        that.setData({
                            keyword: value,
                            itemList: res.data.data
                        });
                    } else {
                        that.setData({
                            keyword: value,
                            itemList: []
                        });
                    }
                }
            },
            fail: function (err) {
                that.setData({
                    keyword: value,
                    itemList: []
                });
            },
            complete: function (err) {

            }
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
        if (!this.data.isVip && e.currentTarget.dataset.index>2) {
            this.openVipClick()
            return
        }
        switch (this.options.title) {
            case 'knowledge':
                wx.navigateTo({
                    url: `/pages/knowledge/knowledge?name=${e.currentTarget.dataset.name}`
                })
                break;
            case 'process':
                var itemObj = this.data.itemList[e.currentTarget.dataset.index];
                app.globalData.itemDetail = {
                    input:itemObj.input.split('/'),
                    tool:itemObj.tool.split('/'),
                    output:itemObj.output.split('/')
                };
                wx.navigateTo({
                    url: `/pages/process/process?name=${e.currentTarget.dataset.name}`
                })
                break;
            case 'inputoutput':
                wx.navigateTo({
                    url: `/pages/inputoutput/inputoutput?name=${e.currentTarget.dataset.name}`
                })
                break;
            case 'keyword':
                app.globalData.itemDetail = this.data.itemList[e.currentTarget.dataset.index];
                wx.navigateTo({
                    url: `/pages/keyword/keyword?name=${e.currentTarget.dataset.name}&keyword=true`
                })
                break;
            case 'abbreviate':
                app.globalData.itemDetail = this.data.itemList[e.currentTarget.dataset.index];
                wx.navigateTo({
                    url: `/pages/keyword/keyword?name=${e.currentTarget.dataset.name}`
                })
                break;
            case 'icontable':
                wx.navigateTo({
                    url: `/pages/icontable/icontable?name=${e.currentTarget.dataset.name}&prefix=${e.currentTarget.dataset.prefix}`
                })
                break;
            default:

                break;
        }
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh: function () {
        // 显示顶部刷新图标
        if (!this.data.keyword) {
            wx.showNavigationBarLoading();
            this.initInfo()
        }
    },
    */
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.isHaveMore && !this.data.keyword) {
            this.data.currentPage++;
            this.initInfo(true)
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        var that = this
        var path = `pages/explain/explain?title=${that.options.title}`
        return {
            title: '名词解释',
            path: path
        }
    }
})