//获取应用实例
const app = getApp()
//api.js
const site = require('../../api/site.js').site;
Page({
    data: {
        title: '',
        detail: {},
        itemList: [],
        bookList: [],
        bookList2: []
    },
    onLoad: function () {
        this.initData()
    },
    initData: function () {
        this.getProcessData()
        this.getKeyWordData()
        this.getChaptersData()
    },
    getProcessData: function () {
        var that = this
        wx.showLoading({
            title: '加载中...'
        })
        wx.request({
            url: site.m + `process?knowledgeSystem=${this.options.name}`,
            method: 'GET',
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
    getKeyWordData: function () {
        var that = this
        wx.showLoading({
            title: '加载中...'
        })
        wx.request({
            url: site.m + `keyword/${app.globalData.tablename}?name=${that.options.name}`,
            method: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res.data.code == 200) {
                    that.setData({
                        detail: res.data.data[0]
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
    getChaptersData: function () {
        var that = this
        wx.showLoading({
            title: '加载中...'
        })
        var name = that.options.name;
        if (app.globalData.tablename == 'pmp') {
            name = that.options.name.replace(/\s/g,'')
        }
        wx.request({
            url: site.m + `chaptersPosition/${app.globalData.tablename}book?name=${name}`,
            method: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res.data.code == 200) {
                    if (res.data.data && res.data.data.length) {
                        that.setData({
                            bookList: res.data.data
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
                wx.hideLoading()
                wx.stopPullDownRefresh()
                that.getChaptersData2()
            }
        })
    },
    getChaptersData2: function () {
        var that = this
        var name = that.options.name;
        if (app.globalData.tablename == 'pmp') {
            name = that.options.name.replace(/\s/g,'')
        }
        wx.request({
            url: site.m + `chaptersPosition/${app.globalData.tablename}book2?name=${name}`,
            method: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res.data.code == 200) {
                    if (res.data.data && res.data.data.length) {
                        that.setData({
                            bookList2: res.data.data
                        })
                    }
                }
            }
        })
    },
    detailClick: function (e) {
        var itemObj = this.data.itemList[e.currentTarget.dataset.index];
        app.globalData.itemDetail = {
            input: itemObj.input.split('/'),
            tool: itemObj.tool.split('/'),
            output: itemObj.output.split('/')
        };
        wx.navigateTo({
            url: `/pages/process/process?name=${e.currentTarget.dataset.name}`
        })
    },
    bookClick: function (e) {
        wx.navigateTo({
            url: `/pages/position/position?name=${this.options.name}&index=${e.currentTarget.dataset.index}`
        })
    },
    bookClick2: function (e) {
        wx.navigateTo({
            url: `/pages/position/position?book2=true&name=${this.options.name}&index=${e.currentTarget.dataset.index}`
        })
    }
})