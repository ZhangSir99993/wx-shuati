//获取应用实例
const app = getApp()
//api.js
const site = require('../../api/site.js').site;
Page({
    data:{
        itemList:[]
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
            url: site.m + 'keyword/acp',
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
            }
        })
    },
    itemClick: function(e) {
        wx.navigateTo({
            url:`/pages/kwdetail/kwdetail?detail=${JSON.stringify(e.currentTarget.dataset.detail)}`
        })
    }
})