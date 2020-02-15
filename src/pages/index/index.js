//获取应用实例
const app = getApp()
//api.js
const site = require('../../api/site.js').site;
Page({
    data: {
        itemList: [],
        navArr: [{
            title:"NPDP",
            tablename:'npdp'
        },{
            title:"PMP",
            tablename:'pmp'
        }],
        currentTap: 0
    },
    onLoad: function () {
        this.init(app.globalData.tablename)
    },
    init: function () {
        var that = this
        wx.request({
            url: site.m + 'list/'+app.globalData.tablename,
            method: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res.data.code == 200) {
                    that.setData({
                        itemList: res.data.data
                    }, function () {
                        that.data.itemList.forEach(element => {
                            element.continue = that.getCurrent(element.albumId)
                            element.finishCount = that.getProgress(element.albumId)
                            if (element.finishCount) {
                                element.progress = (element.finishCount/element.count)*100
                            }
                        });
                        that.setData({
                            itemList: that.data.itemList
                        })
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
    getCurrent: function (albumId) {
        var answer_List = wx.getStorageSync(albumId) || []; //获取当前章节的答题列表
        if (answer_List.length) {
            var current;
            var currentAnswerList = answer_List[answer_List.length - 1].currentAnswerList;
            for (let index = 0; index < currentAnswerList.length; index++) {
                if (currentAnswerList[index]) {
                    current = index + 1
                }
            }
            if (current >= currentAnswerList.length) {
                current = 0
            }
            return current;
        } else {
            return null;
        }
    },
    getProgress: function (albumId,count) {
        var answer_List = wx.getStorageSync(albumId) || []; //获取当前章节的答题列表
        if (answer_List.length) {
            var finishCurrent = 0;
            answer_List.forEach(element => {
                var currentAnswerList = element.currentAnswerList;
                for (let index = 0; index < currentAnswerList.length; index++) {
                    if (currentAnswerList[index]) {
                        finishCurrent++;
                    }
                }
            });
            return finishCurrent;
        } else {
            return null;
        }
    },
    onShow: function () {
        var that = this
        if (that.data.itemList.length) {
            that.data.itemList.forEach(element => {
                element.continue = that.getCurrent(element.albumId)
                element.finishCount = that.getProgress(element.albumId)
                if (element.finishCount) {
                    element.progress = (element.finishCount/element.count)*100
                }
            });
            that.setData({
                itemList: that.data.itemList
            })
        }
    },
    onHide: function () {},
    onPageScroll: function (params) {
        // console.log(params.scrollTop)
    },
    detailClick: function (e) {
        wx.navigateTo({
            url: `/pages/detail/detail?albumId=${e.currentTarget.dataset.albumid}`
        });
    },
    navTap: function (e) {
        if (e.currentTarget.dataset.tablename) {
            app.globalData.tablename = e.currentTarget.dataset.tablename
            this.init();     
            this.setData({
                currentTap:e.currentTarget.dataset.index
            })     
        }
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
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: "刷题100",
            path: "/pages/index/index"
        }
    }
})