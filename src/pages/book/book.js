//获取应用实例
const app = getApp()
//api.js
const site = require('../../api/site.js').site;
Page({
    data:{
        bookDetailList:[],
        firstBookDetail:{}
    },
    onLoad:function(options){
        this.getDetailInfo(options.albumid,options.albumid2,options.albumid3)
    },
    getDetailInfo: function (albumId,albumId2,albumId3) {
        var that = this
        wx.request({
            url: site.m + 'bookdetail/' + 'acpbook',
            method: 'POST',
            data: {
                albumId: albumId,
                albumId2:albumId2,
                albumId3:albumId3
            },
            dataType: 'json',
            success: function (res) {
                if (res.data.code == 200) {
                    that.setData({
                        firstBookDetail:res.data.data[0],
                        bookDetailList:res.data.data
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

            }
        })
    },
    showBigImg: function (e) {
        wx.previewImage({
            current: e.currentTarget.dataset.url, // 当前显示图片的http链接
            urls: [e.currentTarget.dataset.url] // 需要预览的图片http链接列表
        })
    },
})