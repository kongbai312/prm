<template>
  <!-- 弹窗 -->
  <el-dialog
    title="新增员工"
    :visible="showDialog"
    :before-close="btnCancel"
    @close="btnCancel"
    >
    <el-form label-width="120px" :model="formData" :rules="rules" ref="addEmployee">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
          <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width:50%" placeholder="请选择部门"
          @focus="getDepartments"
        />
        <el-tree
          v-loading="loading"
          v-if="showTree"
          :data="treeData"
          :props="defaultProps"
          :default-expand-all='true'
          @node-click="selectNode">
        </el-tree>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template slot="footer">
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取 消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确 定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/departments';
import {addEmployee} from '@/api/employees'
import { tranListToTreeData } from '@/utils';
import EmployeeEnum from '@/api/constant/employees'
export default {
  name: '',
  props:{
    showDialog:{//控制弹窗显示隐藏
      default:false,
      type:Boolean
    }
  },
  data() {
    return {
      formData: {                   //存储表单数据
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules:{
        username:[
          { required: true, message:'用户姓名不能为空', trigger: 'blur'},
          { min:1,max:4,message: '用户姓名为1-4位',trigger:'blur'}
        ],
        mobile:[
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern:/^1[3-9]\d{9}$/,message: '手机号格式不正确', trigger: 'blur'}
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          //trigger为change的原因是因为选择的时候会离开input，触发了blur，导致校验不对
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [
          { required: true, message: '入职时间', trigger: 'blur' }
        ]
      },
      treeData: [],         // 定义数组接收树形数据
      showTree: false,      // 控制树形的显示或者隐藏
      loading: false, // 控制树的显示或者隐藏进度条
      defaultProps: {//el-tree的属性配置
        label: 'name',      //表示从这个属性显示内容
        children:'children' //用来表示子节点
      },
      EmployeeEnum          //接受数据
    }
  },
  methods:{
    //获取部门列表 tree
    async getDepartments(){
      //控制tree显示
      this.showTree = true
      //进度条
      this.loading = true
      const {depts} = await getDepartments()
      //将数据变为树形结构
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },

    //el-tree的事件
    selectNode(nodeValue){
      //...args 可以打印所有的变量
      // console.log(args)
      //将点击的对象 赋值到表单
      this.formData.departmentName = nodeValue.name
      //控制tree显示
      this.showTree = false
    },

    //确定按钮
    async btnOK(){
      //两种写法
      // this.$refs.addEmployee.validate(async isOK=>{
      //   if(isOK){//如果校验通过
      //     //调用api 添加员工
      //     await addEmployee(this.formData)
      //     //通知父组件重新获取员工列表
      //     this.$emit('getEmployeeList')
      //     //关闭弹窗
      //     this.$emit('update:showDialog',false)
      //     //成功提示
      //     this.$message.success('添加成功')
      //   }
      // })
      //写法二：若validata中没有回调函数则返回promise
      try {
        await this.$refs.addEmployee.validate()
        //调用api 添加员工
        await addEmployee(this.formData)
        //通知父组件重新获取员工列表
        this.$emit('getEmployeeList')
        //关闭弹窗
        this.$emit('update:showDialog',false)
        //成功提示
        this.$message.success('添加成功')
      } catch (error) {
        this.$message.error(`添加失败，原因是：${error}`)
      }
    },

    //取消按钮
    btnCancel(){
      // 重置原来的数据
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      //重置表单校验
      this.$refs.addEmployee.resetFields()
      //关闭弹窗
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
