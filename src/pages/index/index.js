//api.js
const site = require('../../api/site.js').site;
Page({
    data: {
        itemList: [],
        navArr: ["NPDP"],
        currentTap: 0
    },
    onLoad: function () {
        this.init()
    },
    init: function () {
        var that = this
        wx.request({
            url: site.m + 'list',
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
            complete: function () {}
        })
    },
    onShow: function () {
        console.log("onShow");
    },
    onHide: function () {
        console.log("onHide");
    },
    onPageScroll: function (params) {
        // console.log(params.scrollTop)
    },
    detailClick: function (e) {
        wx.navigateTo({
            url: `/pages/detail/detail?albumId=${e.currentTarget.dataset.albumid}`
        });
    },
    navTap: function (e) {
       
    },
    goNav: function (e) {
        switch (e.currentTarget.dataset.index) {
            case '0':
                wx.navigateTo({
                    url: '/pages/record/record'
                });
                break;
            case '1':
                wx.navigateTo({
                    url: '/pages/errsubject/errsubject'
                });
                break;
            case '2':

                break;
            case '3':

                break;
            default:
                break;
        }
    }
})