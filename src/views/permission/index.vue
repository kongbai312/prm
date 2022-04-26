<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools>
        <template slot="after">
          <el-button type="primary" size="small" @click="addPermission(1,'0')">添加权限</el-button>
        </template>
      </PageTools>
      <!-- 表格 -->
      <el-table border :data="list" row-key="id">
        <el-table-column label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{row}">
            <el-button v-if="row.type===1" type="text" @click="addPermission(2,row.id)">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹窗 -->
      <el-dialog :title="showText" :visible="showDialog" @close="btnCancel">
        <!-- 表单 -->
        <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="formData.code" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description" style="width:90%" />
          </el-form-item>
          <el-form-item label="开启">
            <!-- active-value设置值为多少开启  inactive-value设置值为多少关闭-->
            <el-switch
              v-model="formData.enVisible"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-form>
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" type="primary" @click="btnOK">确定</el-button>
            <el-button size="small" @click="btnCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {getPermissionList,addPermission,updatePermission,delPermission,getPermissionDetail} from '@/api/permisson';
import { tranListToTreeData } from '@/utils'
export default {
  data() {
    return {
      list:[],        //存储所有权限点
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules:{//表单校验
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      showDialog: false,     //控制弹窗显示隐藏
    }
  },
  mounted() {
    this.getPermissionList()
  },
  computed:{
    showText(){
      return this.formData.id?'编辑权限':'新增权限'
    }
  },
  methods: {
    //获取权限列表
    async getPermissionList(){
      const result = await getPermissionList()
      //将数据转换成树形结构
      this.list = tranListToTreeData(result,'0')
    },

    //删除权限
    async delPermission(row){
      try {
        await this.$confirm(`是否删除:${row.name}`)
        await delPermission(row.id)
        //重新获取列表
        this.getPermissionList()
        this.$message.success('删除成功')
      } catch (error) {
        this.$message.error(error)
      }
    },

    //新增权限
    //根据tpye判断是否为根权限
    //tpye为1则为根 type为2则为子
    //根权限的pid为'0' 子权限的pid为父权限的id
    addPermission(type,pid){
      this.formData.type = type
      this.formData.pid = pid
      this.showDialog = true
    },

    //编辑权限
    async editPermission(id){
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    },

    //确定按钮
    async btnOK(){
      try {
        //表单校验
        await this.$refs.perForm.validate()
        //判断是新增还是修改 有id则为修改
        if(this.formData.id){//修改
          await updatePermission(this.formData)
        }
        else{
          await addPermission(this.formData)
        }
        //重新获取数据列表
        this.getPermissionList()
        //成功提示
        this.$message.success(this.formData.id?'编辑成功':'添加成功')
        //关闭弹窗
        this.showDialog = false
      } catch (error) {
        this.$message.error(`添加失败，原因是：${error}`)
      }
    },

    //取消按钮
    btnCancel(){
      //重置表单数据
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      //重置校验规则
      this.$refs.perForm.resetFields()
      //关闭弹窗
      this.showDialog = false
    }
  }
}
</script>

<style>

</style>
