//获取应用实例
const app = getApp()
Page({
    data: {
        itemList: []
    },
    onLoad: function () {
        var exercise_record_list = wx.getStorageSync("exercise_record_list_" + app.globalData.tablename) || []; //获取全部练习列表(数组)
        if (exercise_record_list.length) {
            this.setData({
                itemList: exercise_record_list.reverse()
            })
        }
    },
    recordClick: function (e) {
        var index = e.currentTarget.dataset.index;
        var exercise_record = this.data.itemList[index];

        if (exercise_record.tablename.includes('vip')) {
            wx.navigateTo({
                url: `/pages/result/result?exercise_record=${JSON.stringify(exercise_record)}&isVip=true`
            });
        }else{
            wx.navigateTo({
                url: `/pages/result/result?exercise_record=${JSON.stringify(exercise_record)}`
            });
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