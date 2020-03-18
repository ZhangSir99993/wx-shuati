//获取应用实例
const app = getApp()
//api.js
const site = require('../../api/site.js').site;
Page({
    data:{
        title:'',
        itemList:[]
    },
    onLoad: function (options) {
        this.initData(options.title)
    },
    initData: function (title) {
        var that = this
        wx.showLoading({
            title: '加载中...'
        })
        var url = 'process';
        switch (title) {
            case 'knowledge':
                url += `?albumId=${that.options.albumid}`
                break;
            default:
                break;
        }
        wx.request({
            url: site.m + url,
            method: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res.data.code == 200) {
                    that.setData({
                        title:title,
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
    detailClick:function(e){
        wx.navigateTo({
            url:`/pages/process/process?detail=${JSON.stringify(this.data.itemList[e.currentTarget.dataset.index])}`
        })
    }
})