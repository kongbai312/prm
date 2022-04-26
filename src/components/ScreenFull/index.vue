<template>
  <div>
    <svg-icon icon-class="fullscreen" style="color:#fff; width: 20px; height: 20px" @click="changeScreen" />
  </div>
</template>

<script>
import ScreenFull from 'screenfull'
export default {
  name: '',
  data() {
    return {
      isFullscreen:false
    }
  },
  methods:{
    //更改全屏
    changeScreen(){
      // if(!this.isFullscreen){
      //   this.isFullscreen = true
      //   //原生全屏
      //   document.documentElement.requestFullscreen()
      // }
      // else{
      //   this.isFullscreen = false
      //   //原生退出全屏
      //   document.exitFullscreen()
      // }

      //插件写法
      if (!ScreenFull.isEnabled) {
        // 此时全屏不可用
        this.$message.warning('此时全屏组件不可用')
        return
      }
      //   如果可用 就可以全屏
      ScreenFull.toggle()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
