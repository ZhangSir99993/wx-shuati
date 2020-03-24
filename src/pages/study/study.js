//获取应用实例
const app = getApp()
//api.js
const site = require('../../api/site.js').site;
import '../../images/knowledge.png'
import '../../images/keyword.png'
import '../../images/abbreviate.png'
import '../../images/process.png'
import '../../images/inputoutput.png'
import '../../images/icontable.png'
Page({
    data: {
        itemList: [],
        itemList2:[],
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
        currentTap: 0,
        navList:[
            {
                tablename:'npdp',
                buttonList:[{
                    title:"术语",
                    count: '287',
                    image:'keyword.png'
                },{
                    title:"图表",
                    count: '126',
                    image:'icontable.png'
                }]
            },
            {
                tablename:'pmp',
                buttonList:[{
                    title:"知识体系",
                    count: '10',
                    image:'knowledge.png'
                },{
                    title:"过程组",
                    count: '49',
                    image:'process.png'
                },{
                    title:"输入/工具/输出",
                    count: '144',
                    image:'inputoutput.png'
                },{
                    title:"术语",
                    count: '467',
                    image:'keyword.png'
                },{
                    title:"缩写",
                    count: '45',
                    image:'abbreviate.png'
                },{
                    title:"图表",
                    count: '229',
                    image:'icontable.png'
                }]
            },
            {
                tablename:'acp',
                buttonList:[{
                    title:"术语",
                    count: '83',
                    image:'keyword.png'
                },{
                    title:"缩写",
                    count: '17',
                    image:'abbreviate.png'
                },{
                    title:"图表",
                    count: '69',
                    image:'icontable.png'
                }]
            }
        ]
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
        wx.request({
            url: site.m + 'firstchapters/' + app.globalData.tablename + 'book',
            method: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res.data.code == 200) {
                    that.setData({
                        itemList: res.data.data
                    })
                    if (app.globalData.tablename == 'pmp') {
                        that.initData2();
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
            }
        })
    },
    initData2: function () {
        var that = this
        wx.showLoading({
            title: '加载中...'
        })
        wx.request({
            url: site.m + 'firstchapters/' + app.globalData.tablename + 'book2',
            method: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res.data.code == 200) {
                    that.setData({
                        itemList2: res.data.data
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
            this.setData({
                currentTap: e.currentTarget.dataset.index
            })
            this.initData();
        }
    },
    detailClick: function (e) {
        wx.navigateTo({
            url: `/pages/chapters/chapters?albumid=${e.currentTarget.dataset.albumid}&albumid2=${e.currentTarget.dataset.albumid2}&albumid3=${e.currentTarget.dataset.albumid3}&albumid4=${e.currentTarget.dataset.albumid4}`
        })
        return;
        if (e.currentTarget.dataset.name) {
            wx.navigateTo({
                url: `/pages/webview/webview?albumid=${e.currentTarget.dataset.name}`
            })
        }
    },
    detailClick2: function(e){
        wx.navigateTo({
            url: `/pages/chapters/chapters?book2=true&albumid=${e.currentTarget.dataset.albumid}&albumid2=${e.currentTarget.dataset.albumid2}&albumid3=${e.currentTarget.dataset.albumid3}&albumid4=${e.currentTarget.dataset.albumid4}`
        })
    },
    goNav: function (e) {
        switch (e.currentTarget.dataset.title) {
            case '知识体系':
                wx.navigateTo({
                    url: `/pages/explain/explain?title=knowledge`
                })
                break;
            case '过程组':
                wx.navigateTo({
                    url: `/pages/explain/explain?title=process`
                })
                break;
            case '输入/工具/输出':
                wx.navigateTo({
                    url: `/pages/explain/explain?title=inputoutput`
                })
                break;
            case '术语':
                wx.navigateTo({
                    url: `/pages/explain/explain?title=keyword`
                })
                break;
            case '缩写':
                wx.navigateTo({
                    url: `/pages/explain/explain?title=abbreviate`
                })
                break;
            case '图表':
                wx.navigateTo({
                    url: `/pages/explain/explain?title=icontable`
                })
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
            path: "/pages/study/study"
        }
    }
})