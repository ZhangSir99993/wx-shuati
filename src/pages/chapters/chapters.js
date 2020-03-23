//获取应用实例
const app = getApp()
//api.js
const site = require('../../api/site.js').site;
Page({
    data: {
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
        this.initData()
    },
    initData: function () {
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

    navTap: function (e) {
        if (e.currentTarget.dataset.tablename) {
            app.globalData.tablename = e.currentTarget.dataset.tablename
            wx.setStorageSync('tablename', app.globalData.tablename);
            this.initData();
            this.setData({
                currentTap: e.currentTarget.dataset.index
            })
        }
    },
    detailClick: function (e) {
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
        this.initData()
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