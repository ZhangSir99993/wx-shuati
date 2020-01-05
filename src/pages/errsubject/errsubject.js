Page({
    data: {
        itemList: []
    },
    onLoad: function () {
        var error_subject = wx.getStorageSync("error_subject"); //获取全部错题集(数组)
        this.setData({
            itemList:error_subject.reverse()
        })
    }
})