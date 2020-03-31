//获取应用实例
const app = getApp()
const site = require('../../api/site.js').site;
Page({
    data: {
        itemList: []
    },
    onLoad: function () {
        this.getExerciseData();
    },
    getExerciseData: function () {
        var that = this
        let openid = wx.getStorageSync("openid")
        if (!openid) {
            //未登录时数据保存到本地，需要从本地获取数据
            that.addLocalExerciseData()
            return;
        }
        wx.request({
            url: site.m + 'get_exercise_record_list/' + app.globalData.tablename,
            method: 'GET',
            data: {
                openid: openid
            },
            dataType: 'json',
            success: function (res) {
                if (res.data.code) {
                    if (res.data.data.length) {
                        var temData = res.data.data
                        temData.forEach(element => {
                            element.currentAnswerList = JSON.parse(element.currentAnswerList)
                            element.chooseList = JSON.parse(element.chooseList)
                        });
                        that.setData({
                            itemList: temData
                        })                       
                    }
                    that.addLocalExerciseData()
                }
            }
        })
    },
    addLocalExerciseData:function(){
        var exercise_record_list = wx.getStorageSync("exercise_record_list_" + app.globalData.tablename) || []; //获取全部练习列表(数组)
        if (exercise_record_list.length) {
            this.setData({
                itemList: this.data.itemList.concat(exercise_record_list.reverse())
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
        } else {
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
            title: "我发现一个刷题小程序，很棒啊，你也试试",
            path: "/pages/index/index"
        }
    }
})