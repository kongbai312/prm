<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px;width:100%">
    <el-col>
      <span>{{treeNode.name}}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{treeNode.manager}}</el-col>
        <el-col>
          <!-- 下拉菜单 -->
          <el-dropdown @command="operateDepts">
            <span>
              操作<i class="el-icon-arrow-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="delete">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import {delDepartments} from '@/api/departments'
export default {
  name: '',
  props:{
    treeNode:{
      type:Object,
      required:true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    //操作组织结构
    operateDepts(command){
      if(command==='add'){
        //传出添加部门需要的数据
        this.$emit('addDepts',this.treeNode)
      }
      else if(command==='edit'){
        //通知父组件以及传出部门需要的数据
        this.$emit('editDepts',this.treeNode)
      }
      else if(command==='delete'){
        console.log(this.treeNode)
        //弹出提示框
        this.$confirm(`是否要删除:${this.treeNode.name}`).then(
          ()=>{
            return delDepartments(this.treeNode.id)
          }
        ).then(
          //发送请求重新获取组织结构列表
          ()=>{
            //通过自定义事件，通知父组件
            this.$emit('delDepts')
            this.$message.success('删除部门成功')
          }
        )
      }
    }
  },
}
</script>

<style lang="less" scoped>

</style>
