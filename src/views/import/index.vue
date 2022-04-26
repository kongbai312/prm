<template>
<!-- 上传excel的组件 -->
<!-- onSuccess用来接收返回的数据header results -->
  <UploadExcel :onSuccess="success"></UploadExcel>
</template>

<script>
import {importEmployee} from '@/api/employees'
export default {
  name: '',
  methods:{
    //接受数据
    async success({header,results}){
      //建立一个对应关系
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      // console.log(header,results)
      //处理数据 将中文转换成英文
      const newArr = results.map(item=>{
        const obj = {}

        Object.keys(item).forEach(key=>{
          if(userRelations[key]==='timeOfEntry' || userRelations[key]==='correctionTime'){
            //转换成date格式才能入库
            obj[userRelations[key]] = new Date(this.formatDate(item[key], '/'))
          }
          else{
            obj[userRelations[key]] = item[key]
          }
        })
        return obj
      })

      //发送请求批量添加员工
      await importEmployee(newArr)
      //跳转回刚刚的位置
      this.$router.back()
      //提示
      this.$message.success('添加成功')

    },
    //将excel日期进行转换
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
