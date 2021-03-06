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
    onShow: function () {
        var that = this
        switch (app.globalData.tablename) {
            case 'npdp':
                if (that.data.currentTap!=0) {
                    that.setData({
                        currentTap: 0
                    })
                    that.initData()
                }
                break;
            case 'pmp':
                if (that.data.currentTap!=1) {
                    that.setData({
                        currentTap: 1
                    })
                    that.initData()
                }
                break;
            case 'acp':
                if (that.data.currentTap!=2) {
                    that.setData({
                        currentTap: 2
                    })
                    that.initData()
                }
                break;
            default:
                break;
        }
        if (that.data.itemList.length) {
            that.data.itemList.forEach(element => {
                element.continue = that.getCurrent(element.albumId)
                element.finishCount = that.getProgress(element.albumId)
                if (element.finishCount) {
                    element.progress = (element.finishCount / element.count) * 100
                }
            });
            that.setData({
                itemList: that.data.itemList
            })
        }
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
            url: site.m + 'list/' + app.globalData.tablename,
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
                                element.progress = (element.finishCount / element.count) * 100
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
            complete: function () {
                wx.hideLoading()
                wx.stopPullDownRefresh()
            }
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
    getProgress: function (albumId, count) {
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
            wx.setStorageSync('tablename', app.globalData.tablename);
            this.initData();
            this.setData({
                currentTap: e.currentTarget.dataset.index
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
                wx.navigateTo({
                    url: '/pages/realsubject/realsubject'
                });
                break;
            case '3':

                break;
            default:
                break;
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
            path: "/pages/index/index"
        }
    }
})