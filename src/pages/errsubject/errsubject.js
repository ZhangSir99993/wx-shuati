//获取应用实例
const app = getApp()
Page({
    data: {
        itemList: []
    },
    onLoad: function () {
        var error_subject = wx.getStorageSync("error_subject_" + app.globalData.tablename) || []; //获取全部错题集(数组)
        if (error_subject.length) {
            this.setData({
                itemList: error_subject.reverse()
            })
        }
    },
    itemClick: function (e) {
        var index = e.currentTarget.dataset.index
        wx.navigateTo({
            url: '/pages/analysis/analysis?current=' + index
        });
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