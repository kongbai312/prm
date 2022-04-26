<template>
  <el-dropdown trigger="click" @command="changeLanguage">
    <!-- 这里必须加一个div -->
    <div>
      <svg-icon style="color:#fff;font-size:20px" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh" :disabled="'zh'=== $i18n.locale ">中文</el-dropdown-item>
      <el-dropdown-item command="en" :disabled="'en'=== $i18n.locale ">English</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import Cookie from 'js-cookie' // 引入cookie包
export default {
  name: '',
  methods:{
    //点击切换语言
    changeLanguage(type){
      let language = ''
      //存入Cookie
      Cookie.set('language',type)
      //同时切换i18n语言
      this.$i18n.locale = type
      //修改语言成功
      if(type==='zh'){
        language='中文'
      }
      else{
        language='英文'
      }
      this.$message.success(`成功切换成${language}`)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
