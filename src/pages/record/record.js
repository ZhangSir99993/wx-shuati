Page({
    data:{
        itemList:[]
    },
    onLoad:function(){
        var exercise_record = wx.getStorageSync("exercise_record"); //获取全部练习列表(数组)
        this.setData({
            itemList:exercise_record.reverse()
        })
    },
    recordClick:function(e){
        var index = e.currentTarget.dataset.index;
        wx.navigateTo({
            url: '/pages/result/result?currentAnswerList='+JSON.stringify(this.data.itemList[index].currentAnswerList)+'&albumid='+this.data.itemList[index].albumId
        });
    }
})