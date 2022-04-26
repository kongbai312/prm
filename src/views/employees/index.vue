<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools :showBefore="true">
        <!-- 左边插槽 -->
        <template slot="before">
          <span>共{{page.total}}条</span>
        </template>
        <template slot="after">
          <el-button size="small" type="success" @click="$router.push('/import')">excel导入</el-button>
          <el-button size="small" type="danger" @click="exportData">excel导出</el-button>
          <el-button size="small" type="primary" @click="showDialog = true">新增员工</el-button>
          <AddDemployee :showDialog.sync="showDialog" @getEmployeeList="getEmployeeList"></AddDemployee>
        </template>
      </PageTools>
      <!-- 放置表格和分页 -->
      <el-card v-loading="loading" >
        <el-table border :data="list">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column align="center" label="头像" width="120px">
            <template slot-scope="{row}">
              <img
                v-imagerror="require('@/assets/common/bigUserHeader.png')"
                :src="row.staffPhoto " alt=""
                style="cursor:pointer;border-radius: 50%; width: 100px; height: 100px; padding:10px"
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="formatEmployment" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <template slot-scope="{row}">
              {{row.timeOfEntry | formatDate}}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">
            <template slot-scope="{row}">
              <el-switch :value="row.enableState === 1"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)" :disabled="!checkPermission('POINT-USER-UPDATE')">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row)" :disabled="!checkPermission('point-user-delete')">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
          layout="prev, pager, next"
          :current-page="page.page"
          :page-size="page.size"
          :total="page.total"
          @current-change="changePage"
          >
        </el-pagination>
        </el-row>
      </el-card>
    </div>
    <!-- 二维码弹窗 -->
    <el-dialog
      title="二维码"
      :visible.sync="showCodeDialog"
    >
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <canvas ref="myCanvas"></canvas>
        </el-col>
      </el-row>

    </el-dialog>
    <!-- 分配角色弹窗 -->
    <AssignRole ref="assignRole" :showRoleDialog.sync="showRoleDialog" :userId="userId"></AssignRole>
  </div>
</template>

<script>
import {getEmployeeList,delEmployee} from '@/api/employees';
import EmployeeEnum from '@/api/constant/employees';
import AddDemployee from './components/add-employee';
import {formatDate} from '@/filters'
import AssignRole from './components/assign-role.vue'
import QrCode from 'qrcode'
export default {
  name:'employees',
  components:{
    AddDemployee,AssignRole
  },
  data() {
    return {
      loading: false,
      list: [],         // 接受员工数据
      page: {
        page: 1,        // 当前页码
        size: 10,       // 每页条数
        total: 0        // 总数
      },
      showDialog:false,     //控制弹窗显示隐藏
      showCodeDialog:false, //控制二维码弹窗显示隐藏
      showRoleDialog:false, //控制分配角色弹窗
      userId:null,            //存储用户id
    }
  },
  mounted() {
    //获取员工列表
    this.getEmployeeList()
  },
  methods:{
    //获取员工列表
    async getEmployeeList(){
      //给表格绑定loading v-loading="loading"
      this.loading = true
      const {total,rows} = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },

    //删除员工
    async delEmployee(row){
      try {
        await this.$confirm(`是否删除员工：${row.username}`)
        await delEmployee(row.id)
        //重新员工列表
        this.getEmployeeList()
        this.$message.success('删除成功')
      } catch (error) {
        this.$message.info('取消删除')
      }
    },

    //改变当前页 newPage为当前页
    changePage(newPage){
      this.page.page = newPage
      this.getEmployeeList()
    },

    //格式化聘用数据 row当前行对象，cellValue表示当前数据
    formatEmployment(row, column, cellValue, index){
      //自己的写法
      // let value = '未知'
      // EmployeeEnum.hireType.forEach(item=>{
      //   // console.log(item.id === cellValue)
      //   if(item.id === cellValue){
      //     value = item.value
      //   }
      // })
      const obj = EmployeeEnum.hireType.find(item=>{
        return item.id === cellValue
      })
      return obj?obj.value:'未知'
    },

    //导出excel
    exportData(){
      // 表头对应关系
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      //使用script-loader的懒加载 excel中包含所有的方法
      import('@/vendor/Export2Excel').then(async excel=>{
        //获取所有的员工，通过参数一页 一页中包含所有数据查询
        const {rows} = await getEmployeeList({page:1,size:this.page.total})
        //调用封装的方法
        const data = this.formatJson(headers, rows)
        //导出复杂表头相关
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]//表头
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']//单元格合并
        //调用excel中的export_json_to_excel方法
        excel.export_json_to_excel({
          header: Object.keys(headers),//数组
          data,                        //数组套数组 [[]]，一个数据为一条数组
          filename: '员工信息表',       //文档名字
          autoWidth: true,             //单元格是否要自适应宽度
          bookType: 'xlsx'              //导出文件类型 xlsx, csv, txt等
        })
      })
    },

    //将数据转化为可以使用的数据
    formatJson(headers, rows){
      // rows   [{username:'李华',mobile:'13733334444'}]转化为['李华','13733334444']
      //Object.keys(headers) ['姓名','手机号','入职日期']
      return rows.map(item=>{//item  {username:'李华',mobile:'13733334444'}
        return Object.keys(headers).map(key=>{//key ['姓名','手机号']
          if(headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime'){//对日期进行处理
            //使用过滤器中的formatDate方法
            return formatDate(item[headers[key]])
          }
          else if(headers[key] === 'formOfEmployment'){
            //自己写法
            // let value = '未知'
            // EmployeeEnum.hireType.forEach(obj=>{
            //   if(obj.id === item[headers[key]]){
            //     value = obj.value
            //   }
            // })
            // return value

            //老师写法
            var obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]   //headers[key] username


        })
      })
    },

    //显示二维码弹窗
    showQrCode(url){
      //如果url存在才显示弹窗
      if(url){
        this.showCodeDialog = true
        //页面渲染后 ref才存在 为了确保页面渲染完毕，使用nextTick
        this.$nextTick(()=>{
          QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维码
        })
      }
      else{
        this.$message.warning('该用户还未拥有头像')
      }
    },

    //角色按钮
    async editRole(id){
      this.userId = id
      //调用子组件方法
      await this.$refs.assignRole.getUserDetailById(id)
      this.showRoleDialog = true
    }
  }
}
</script>

<style>
</style>
