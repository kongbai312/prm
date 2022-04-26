<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
          <TreeTools :treeNode='company' :isRoot='true' @addDepts="addDepts"></TreeTools>

          <!-- 树形结构 -->
          <el-tree
            :data="departs"
            :props="defaultProps"
            :default-expand-all='true'
          >
            <TreeTools slot-scope="{data}" :treeNode='data' @delDepts='getDepartments' @addDepts="addDepts" @editDepts='editDepts'></TreeTools>
          </el-tree>

      </el-card>
      <AddDept ref="addDept" :showDialog.sync="showDialog" :treeNode="node" @addDepts='getDepartments'></AddDept>

    </div>
  </div>
</template>

<script>
import AddDept from './components/add-dept.vue'
import TreeTools from './components/tree-tools.vue';
import {getDepartments} from '@/api/departments';
import {tranListToTreeData} from '@/utils'
export default {
  components:{
    TreeTools,
    AddDept
  },
  data() {
    return {
      //头部固定数据
      company: {},
      departs: [//el-tree的数据
        // { name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
        // { name: '行政部', manager: '刘备' },
        // { name: '人事部', manager: '孙权' }
      ],
      defaultProps: {//el-tree的属性配置
        label: 'name',      //表示从这个属性显示内容
        children:'children' //用来表示子节点
      },
      showDialog:false,     //控制弹窗是否出现
      node:{},              //记录当前部门的节点信息
      loading: false // 用来控制进度弹层的显示和隐藏
    }
  },
  mounted() {
    //查询企业的部门列表
    this.getDepartments()
  },
  methods:{
    //查询企业的部门列表
    async getDepartments(){
      this.loading = true
      //发送请求获取数据
      const result = await getDepartments()
      this.company = {name:result.companyName, manager: '负责人',id:''}
      //将处理好的数据存入data
      this.departs = tranListToTreeData(result.depts,'')
      this.loading = false

    },
    //增添部门
    addDepts(node){
      //控制弹窗
      this.showDialog = true
      //将部门信息存入data
      this.node = node
    },
    //编辑部门
    editDepts(node){
      //控制弹窗
      this.showDialog = true
      //将部门信息存入data
      this.node = node
      //通过ref调用子组件方法
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }
}
</script>

<style scoped>
  .tree-card {
    padding: 30px  140px;
    font-size:14px;
  }
</style>
