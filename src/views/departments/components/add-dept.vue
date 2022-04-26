<template>
  <!-- :before-close="dialogBeforeClose" -->
  <el-dialog
    :title="showTitle"
    :visible.sync="showDialog"
    :before-close="btnCancel"
    >
    <el-form ref="deptForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" placeholder="1-50个字符" style="width:80%"></el-input>
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" placeholder="1-50个字符" style="width:80%"></el-input>
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" placeholder="请选择" style="width:80%" @focus="getEmployeeSimple">
          <el-option :label="people.username" :value="people.username" v-for="people in peoples" :key="people.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input type="textarea" v-model="formData.introduce" :row="3" style="width:80%"></el-input>
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {getDepartments,addDepartments,getDepartDetail,updateDepartments} from '@/api/departments';
import {getEmployeeSimple} from '@/api/employees'
export default {
  name: '',
  props:{
    //控制弹窗是否显示
    showDialog:{
      tpye:Boolean,
      default:false
    },
    //当前部门信息
    treeNode:{
      type:Object,
      default:null
    }
  },
  data() {
    //检查部门名字是否重复的校验规则
    const checkNameRepeat = async(rule,value,callback)=>{
      const {depts} = await getDepartments(this.treeNode.id)
      let isRepeat = null
      if(this.formData.id){//id存在则为编辑模式
        //
        isRepeat = depts.filter(item=>{
          //先找除了自己的所有同级部门
          return item.pid === this.treeNode.pid && item.id !==this.treeNode.id
        }).some(item=>{
          return item.name ===value
        })
      }
      else{//新增模式
        isRepeat = depts.filter((item)=>{
          //先去找所有该部门下的子部门
          return item.pid === this.treeNode.id
        }).some((item)=>{
          //从中再找子部门下名称是否有相同 如果有返回true
          return item.name === value
        })
      }

      //如果有重复，则显示名称重复
      isRepeat?callback(new Error(`${value}已存在`)):callback()
    };

    //检查部门编码是否重复的校验规则
    const checkCodeRepeat = async(rule,value,callback)=>{
      const {depts} = await getDepartments(this.treeNode.id)
      let isRepeat = null
      if(this.formData.id){//id存在则为编辑模式
        //找除了自己以外 编码不充分的
        isRepeat = depts.filter(item=>{
          return item.id !== this.treeNode.id
        }).some(item=>{
          return item.code === value && value
        })
      }
      else{//新增模式
        isRepeat = depts.some((item)=>{
          // 这里加一个 value不为空 因为我们的部门有可能没有code
          return item.code === value && value
        })
      }

      //如果有重复，则显示名称重复
      isRepeat?callback(new Error(`${value}的部门编码已存在`)):callback()
    }
    return {
      //表单校验
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules:{
        name: [
          {required: true, message:'部门名称不能为空', trigger: 'blur'},
          {min:1,max:50,message:'部门名称要求1-50个字符',trigger:'blur'},
          {validator:checkNameRepeat,trigger:'blur'}
        ],
        code: [
          {required: true, message:'部门编码不能为空', trigger: 'blur'},
          {min:1,max:50,message:'部门名称要求1-50个字符',trigger:'blur'},
          {validator:checkCodeRepeat,trigger:'blur'}
        ],
        manager: [
          {required: true, message:'部门负责人不能为空', trigger: 'blur'}
        ],
        introduce: [
          {required: true, message:'部门介绍不能为空', trigger: 'blur'},
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }
        ]
      },
      peoples:[],    //用来存储员工列表
    }
  },
  computed:{
    showTitle(){
      //根据是否有id来控制标题
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },
  methods:{
    async getEmployeeSimple(){
      //发送请求获取员工列表
      const result = await getEmployeeSimple()
      //存入data
      this.peoples = result
    },
    //获取部门信息
    async getDepartDetail(id){
      const result = await getDepartDetail(id)
      //将部门信息放入data
      this.formData = result
    },
    //点击确定
    btnOK(){
      //进行表单校验
      this.$refs.deptForm.validate(async(isOk)=>{
        if(isOk){//表示可以提交了
          if(this.formData.id){//id存在则表示修改
            await updateDepartments(this.formData)
          }
          else{//添加
            //收集表单数据进行提交 同时将当天id值赋予pid
            await addDepartments({...this.formData,pid:this.treeNode.id})
          }
          //通知父组件重新拉取数据
          this.$emit('addDepts')
          //通知父组件关闭弹窗,通过sync修饰符
          this.$emit('update:showDialog',false)
          //成功提示
          this.$message.success(this.formData.id?'修改成功':'添加成功')
        }
      })
    },

    //取消按钮
    btnCancel(){
      // 重置数据  因为resetFields 只能重置 表单上的数据 非表单上的 比如 编辑中id 不能重置
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      //重置表单
      this.$refs.deptForm.resetFields()
      //通知父组件关闭弹窗,通过sync修饰符
      this.$emit('update:showDialog',false)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
