Page({
    data:{

    },
    onLoad:function(){
        
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: "擦，我发现一个刷题小程序，很棒啊，你也试试",
            path: "/pages/index/index"
        }
    }
})