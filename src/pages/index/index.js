Page({
    data:{
        site: "http://localhost",
        url: ':9090/list',
        itemList: [],
        navArr: ["推荐", "情感", "文学", "财商", "传记", "相声", "小说", "音乐"],
        currentTap: 0,
        bannerAudioList: [
            {
                "id": 4,
                "albumId": "相声/郭德纲于谦专场/01郭德纲于谦专场/",
                "isAlbum": "01郭德纲于谦专场",
                "title": "郭德纲于谦专场",
                "detail": "xs",
                "image": "banner/郭德纲.png",
                "listenNum": 0,
                "commentNum": 0,
                "createdAt": 1556537051635,
                "updatedAt": 1556537051635,
                "version": 0
            },
            {
                "id": 1,
                "albumId": "财商/吴晓波/01吴晓波专辑/",
                "isAlbum": "01吴晓波专辑",
                "title": "吴晓波",
                "detail": "cs",
                "image": "banner/吴晓波.png",
                "listenNum": 0,
                "commentNum": 0,
                "createdAt": 1556544376237,
                "updatedAt": 1556544376237,
                "version": 0
            }
        ],
        navList:[{
            name:'学习记录',
            imgUrl:'../images/learnRecord.png'
        },{
            name:'错题本',
            imgUrl:'../../images/errSubject.png'
        },{
            name:'学习记录',
            imgUrl:'../../images/learnRecord.png'
        },{
            name:'错题本',
            imgUrl:'../../images/errSubject.png'
        }]



    },
    onLoad:function () {
        this.init()        
    },
    init: function () {
        var that = this
        wx.request({
            url: that.data.site + that.data.url,
            method: 'GET',
            dataType: 'json',
            success: function (res) {
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
        // console.log(params.scrollTop)
    },
    detailClick:function (e) {
        wx.navigateTo({
            url: `/pages/detail/detail?albumid=${e.currentTarget.dataset.albumid}`
        });
    },
    navTap: function (e) {

    },
    goNav: function(e){
        // wx.navigateTo({
        //     url: `/pages/result/result?albumid=${this.data.itemList[0].albumid}`
        // })
    }
})