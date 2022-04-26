<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-tabs>
        <el-tab-pane label="登录账户设置">
          <el-form ref="userForm" :model="userInfo" :rules="rules" label-width="120px" style="margin-left: 120px; margin-top:30px">
            <el-form-item label="姓名" prop="username">
              <el-input v-model="userInfo.username" style="width:300px"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="userInfo.password" style="width:300px" type="password"
              @focus="userInfo.password=''"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveUser">更新</el-button>
              <el-button type="text" @click="$router.back()">取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="个人详情">
           <el-row type="flex" justify="end">
            <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${userId}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
             </el-tooltip>
          </el-row>
          <!-- 放置内容 -->
          <!-- <UserInfo></UserInfo> -->
          <!-- 动态组件 -->
          <component :is="UserComponent"></component>
        </el-tab-pane>
        <el-tab-pane label="岗位信息">
          <el-row type="flex" justify="end">
              <el-tooltip content="打印岗位信息">
                <router-link :to="`/employees/print/${userId}?type=job`">
                  <i class="el-icon-printer"  />
                </router-link>
              </el-tooltip>
          </el-row>
          <!-- 放置内容 -->
          <JobInfo></JobInfo>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {getUserDetailById} from '@/api/user';
import {saveUserDetailById} from '@/api/employees';
import UserInfo from './components/user-info.vue'
import JobInfo from './components/job-info.vue'
export default {
  components:{
    UserInfo,JobInfo
  },
  data() {
    return {
      UserComponent:UserInfo,
      userId:this.$route.params.id,     //获取员工id
      userInfo: {                 // 专门存放基本信息
        username: '',
        password: ''
      },
      rules:{       //表单校验规则
        username:[
          {required:true,message:'姓名不能为空',trigger:'blur'}
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getUserDetailById()
  },
  methods:{
    //获取员工基本信息
    async getUserDetailById(){
      const result = await getUserDetailById(this.userId)
      this.userInfo = result
    },

    //保存员工信息
    async saveUser(){
      try {
        await this.$refs.userForm.validate()
        await saveUserDetailById(this.userInfo)
        this.$message.success('保存成功')
      } catch (error) {
        this.$message.error(error)
      }
    }
  }
}
</script>

<style>

</style>
