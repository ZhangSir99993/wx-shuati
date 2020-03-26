//获取应用实例
const app = getApp()
const site = require('../../api/site.js').site;
Page({
    data:{
        url:''
    },
    onLoad:function(options){
        this.setData({
            url:`${site.www}acpbook/${options.albumid}.html`
        })
        console.log(this.data.url);
        
    }
})