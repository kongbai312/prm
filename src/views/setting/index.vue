<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <!--  @tab-click="handleClick" -->
        <el-tabs>
          <!-- 角色管理部分 -->
          <el-tab-pane label="角色管理" >
            <el-row style="height:60px">
              <!-- 新增角色按钮 -->
              <el-button type="primary" icon="el-icon-plus" size="small" @click="showDialog=true">新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border :data="list">
              <!-- header-align='left'表头对齐方式 align='center' 表格对齐方式-->
              <el-table-column type="index" label="序号" width="120"></el-table-column>
              <el-table-column prop="name" label="角色名" width="240"></el-table-column>
              <el-table-column prop="description" label="描述"></el-table-column>
              <el-table-column label="操作">
                <!-- 插槽 -->
                <template slot-scope="{row}">
                  <el-button size="small" type="success" @click="assignPerm(row)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row)">修改</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height:60px">
              <el-pagination
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                layout="total,->,prev, pager, next"
                @current-change="changePage"
              >
              </el-pagination>
            </el-row>
          </el-tab-pane>
          <!-- 公司信息部分 -->
          <el-tab-pane label="公司信息" >
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <!-- 表单 -->
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="企业名称">
                <el-input v-model="formData.name" disabled style="width:400px"></el-input>
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px"></el-input>
              </el-form-item>
              <el-form-item label="公司电话">
                <el-input v-model="formData.companyPhone" disabled style="width:400px"></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px"></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 定义一个弹层 -->
    <el-dialog
      :title="showTitle"
      :visible="showDialog"
      :before-close="btnCancel"
      >
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" style="width:90%"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="roleForm.description" style="width:90%"></el-input>
        </el-form-item>
      </el-form>
      <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
      <el-row slot="footer" type="flex" justify="center" style="left:-5%;">
        <el-col :span="6">
          <el-button @click="btnCancel">取消</el-button>
          <el-button type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 分配权限的弹窗 -->
    <el-dialog
      title="分配权限"
      :visible="showPermDialog"
      @close="btnPermCancel"
    >
      <!-- default-expand-all 是否将子节点展开 -->
      <!-- show-checkbox 加上选择框 -->
      <!-- check-strictly 是否遵循父子关系 true为不遵循 -->
      <!-- id作为唯一标识 -->
      <!-- default-checked-keys 默认勾选的节点的 key 的数组 -->
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        :default-expand-all="true"
        :check-strictly='true'
        :show-checkbox="true"
        :default-checked-keys="selectCheck"
        node-key="id"
      >
      </el-tree>
      <!-- 确定 取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
          <el-button size="small"  @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {getRoleList,getCompanyInfo,deleteRole,getRoleDetail,updateRole,addRole,assignPerm} from '@/api/setting';
import {mapGetters} from 'vuex';
import { tranListToTreeData } from '@/utils';
import { getPermissionList } from '@/api/permisson'
export default {
  data() {
    return {
      list:[],          //存储所有的角色
      page:{            //存储页面信息
        page:1,         //页码
        pagesize:10,     //每页条数
        total:0         //总页数
      },
      formData:{        //存储公司信息

      },
      roleForm:{        //存储角色信息
        name:'',
        discription:''
      },
      showDialog:false,  //控制弹窗是否显示
      rules:{//表单校验
        name:[
          {required:true,message:'角色名称不能为空',trigger:'blur'}
        ]
      },
      showPermDialog:false,       //控制分配权限弹窗显示隐藏
      permData: [], // 专门用来接收权限数据 树形数据
      defaultProps: {   //配置tree组件
        label: 'name'
      },
      selectCheck: [], // 定义一个数组来接收 已经选中的节点
      roleId: null,    // 用来记录分配角色的id
    }
  },
  mounted() {
    //发送请求获取角色列表
    this.getRoleList()
    //发送请求获取公司信息
    this.getCompanyInfo()
  },
  computed:{
    ...mapGetters(['companyId']),
    showTitle(){
      return this.roleForm.id ? '编辑角色' : '新增角色'
    }
  },
  methods:{
    //获取角色列表
    async getRoleList(){
      const {total,rows} = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },

    //获取公司信息
    async getCompanyInfo(){
      const result = await getCompanyInfo(this.companyId)
      this.formData = result
    },

    //编辑角色
    async editRole(row){
      const {id} = row
      //发送请求获取角色信息
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },

    //删除角色
    async deleteRole(row){
      try {
        await this.$confirm(`是否删除角色：${row.name}`)
        await deleteRole(row.id)
        //重新获取角色列表
        this.getRoleList()
        this.$message.success('删除成功')
      } catch (error) {
        this.$message.info('取消删除')
      }
    },

    //确定按钮
    async btnOK(){
      //进行表单校验, validate若括号内没有回调，则返回一个promise
      try {
        await this.$refs.roleForm.validate()
        //判断是新增还是修改
        if(this.roleForm.id){//有id则为修改
          //调用修改请求
          await updateRole(this.roleForm)
        }
        else{//新增
          await addRole(this.roleForm)
        }
        //重新获取数据列表
        this.getRoleList()
        //提示
        this.$message.success(this.roleForm.id?'修改成功':'添加成功')
        //关闭弹窗
        this.showDialog = false
      } catch (error) {//
        this.$message.error(error)
      }
    },

    //取消按钮
    btnCancel(){
      this.$message.info(this.roleForm.id?'取消修改':'取消添加')
      //重置data
      this.roleForm = {
        name:'',
        description:''
      }
      //重置表单校验
      this.$refs.roleForm.resetFields()
      //关闭弹窗
      this.showDialog = false
    },

    //修改页码
    changePage(newPage){
      this.page.page = newPage
      this.getRoleList()
    },

    //分配权限
    async assignPerm(row){
      //获取权限列表
      const result = await getPermissionList()
      //将数据处理为树形结构
      this.permData = tranListToTreeData(result,'0')
      this.roleId = row.id
      // 应该去获取 这个id的 权限点
      const { permIds } = await getRoleDetail(row.id) // permIds是当前角色所拥有的权限点数据
      this.selectCheck = permIds // 将当前角色所拥有的权限id赋值
      //显示弹窗
      this.showPermDialog = true
    },

    //分配权限的确定按钮
    async btnPermOK(){
      //调用el-tree的方法getCheckedKeys返回被选中的数据组成的数组
      await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
      this.$message.success('分配权限成功')
      this.showPermDialog = false
    },

    //分配权限的取消按钮
    btnPermCancel() {
      this.selectCheck = [] // 重置数据
      this.showPermDialog = false
    }
  }

}
</script>

<style>

</style>
