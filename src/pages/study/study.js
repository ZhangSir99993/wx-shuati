//获取应用实例
const app = getApp()
//api.js
const site = require('../../api/site.js').site;
Page({
    data: {
        itemList: [

        ]
    },
    onLoad: function () {
        this.initData()
    },
    initData: function () {
        var that = this
        wx.showLoading({
            title: '加载中...'
        })
        wx.request({
            url: site.m + 'listbook/' + 'acpbook',
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
  
    detailClick: function (e) {
        if (e.currentTarget.dataset.albumid) {
            wx.navigateTo({
                url:`/pages/book/book?albumid=${e.currentTarget.dataset.albumid}&albumid2=${e.currentTarget.dataset.albumid2}&albumid3=${e.currentTarget.dataset.albumid3}`
            })
        }
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