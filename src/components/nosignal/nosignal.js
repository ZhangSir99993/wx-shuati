import { site } from "../../api/site.js";
Component({
  data: {             // 私有数据，可用于模版渲染
    site: site,             //站点配置
    btn:'点击重新加载',
    isShow:false
  },
  properties: {
    // 弹窗标题
    content: {            // 属性名
      type: String,       // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '内容'        // 属性初始值（可选），如果未指定则会根据类型选择一个
    }
  },
  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function(){},
  moved: function(){},
  detached: function(){},

  methods: {
    showSignal: function(){
      this.setData({
        isShow: true
      })
    },
    hideSignal: function(){
      this.setData({
        isShow: false
      })
    },
    _reload: function(){
      //触发取消回调
      this.triggerEvent("reload")
    }
  }

})
