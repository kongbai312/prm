//这里用来存储所有的指令功能

export const imagerror = {
  // 指令对象 会在当前的dom元素插入到节点之后执行
  // dom是当前指令的dom对象
  // options是指令中的变量的解释 其中有个属性叫value
  inserted(dom,options){
    //防止dom.src为空
    dom.src = dom.src || options.value
    //图片错误的时候，输入变量（data中默认变量）
    //图片报错时，触发error事件
    dom.onerror = ()=>{
      // 当图片出现异常的时候 会将指令配置的默认图片设置为该图片的内容
      dom.src = options.value
    }
  },
  //同inserted也是钩子函数
  //该钩子函数会在当前指令作用的组件 更新完毕后执行
  componentUpdated(dom,options){
    //防止dom.src为空
    dom.src = dom.src || options.value
  }
}
