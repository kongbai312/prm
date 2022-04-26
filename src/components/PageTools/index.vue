<template>
  <el-card class="page-tools">
    <el-row type="flex" justify="space-between" align="middle">
      <!-- 左边 -->
      <el-col>
        <div v-if="showBefore" class="before">
          <i class="el-icon-info"></i>
          <!-- 定义前面得插槽 -->
          <slot name="before"></slot>
        </div>
      </el-col>
      <!-- 右边 -->
      <el-col>
        <el-row type="flex" justify="end">
          <!-- 定义后面的插槽 -->
          <slot name="after" />
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'PageTools',
  props:{
    showBefore:{
      default:false,
      type:Boolean
    }
  }
}
</script>

<style lang='scss' scoped>
 .page-tools {
    margin: 10px 0;
    .before {
      line-height: 34px;
    i {
      margin-right: 5px;
      color: #409eff;
    }
    display: inline-block;
    padding: 0px 10px;
    border-radius: 3px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
  }
 }
</style>
