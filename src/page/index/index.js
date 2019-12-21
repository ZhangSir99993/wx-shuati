Page({
    data:{
        site: "http://localhost",
        url: ':9090/list',
        itemList: []
    },
    onLoad:function () {
        console.log("onLoad")
        this.init()        
    },
    init: function () {
        var that = this
        wx.request({
            url: that.data.site + that.data.url,
            method: 'GET',
            dataType: 'json',
            success: function (res) {
                console.log(res)
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
    onShow:function(){
        console.log("onShow");
    },
    onHide: function () {
        console.log("onHide");
    },
    onPageScroll:function (params) {
        console.log(params.scrollTop)
    },
    detailClick:function (e) {
        wx.navigateTo({
            url: "/page/detail/detail?albumid="+e.currentTarget.dataset.albumid
        });
    }
})