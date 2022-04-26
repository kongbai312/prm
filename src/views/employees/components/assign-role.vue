<template>
  <el-dialog
    title="分配角色"
    :visible="showRoleDialog"
    @close="btnCancel">
    <el-checkbox-group v-model="roleIds">
      <!-- label是存储的值 -->
      <el-checkbox v-for="item in list" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" @click="btnOK">确 定</el-button>
        <el-button @click="btnCancel">取 消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  name: '',
  props:{
    showRoleDialog:{
      type:Boolean,
      default:false
    },
    userId:{
      type: String,
      default:null,
    }
  },
  data() {
    return {
      list:[],      //存储角色列表
      roleIds:[],   //存储选择的角色id
    }
  },
  mounted() {
    this.getRoleList()

  },
  methods:{
    //获取所有角色列表
    async getRoleList(){
      const {rows} = await getRoleList({page:1,pagesize:20}) //假设最多只有20个角色
      this.list = rows
    },

    //获取当前用户角色
    async getUserDetailById(id){
      const {roleIds} = await getUserDetailById(id)
      this.roleIds = roleIds
    },

    //确定按钮
    async btnOK(){
      await assignRoles({id:this.userId,roleIds:this.roleIds})
      this.$message.success('分配角色成功')
      this.$emit('update:showRoleDialog',false)
    },

    //取消按钮
    btnCancel(){
      //重置roleIds
      this.roleIds = []
      this.$emit('update:showRoleDialog',false)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
