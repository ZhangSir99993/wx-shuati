Page({
    data:{

    },
    onLoad:function () {
        console.log("onLoad")
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
    detailClick:function () {
        wx.navigateTo({
            url: "../detail/detail"
        });
    }
})