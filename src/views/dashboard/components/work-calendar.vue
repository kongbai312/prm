<template>
  <div>
    <el-row type="flex" justify="end">
      <!-- 年份 -->
      <el-select v-model="currentYear"  size="small" style="width: 120px" @change="dateChange">
        <el-option
          v-for="item in yearList"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <!-- 月份 -->
      <el-select v-model="currentMonth" size="small" style="width: 120px;margin-left:10px" @change="dateChange">
        <el-option
          v-for="item in 12"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </el-row>
    <el-calendar v-model="currentDate">
      <template slot='dateCell' slot-scope="{ date, data }" class="content">
        <div class="date-content">
          <span class="text"> {{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>

export default {
  name: '',
  props:{
    startDate: {  //日期
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    return {
      yearList:[],        //存储当前年份的前5年和后5年
      currentMonth: null, // 当前月份
      currentYear: null, // 当前年份
      currentDay:null,    //当前日
      currentDate: null,
    }
  },
  filters:{
    getDay(date){
      const day = date.split('-')[2]
      return day.startsWith('0')?day.substr(1):day
    }
  },
  created(){
    //获取当前年份
    this.currentYear = this.startDate.getFullYear()
    //获取当前月份
    this.currentMonth = this.startDate.getMonth()+1
    //获取当前日
    this.currentDay = this.startDate.getDate()
    //获取当前年份前后5年的数组
    this.yearList = Array.from(Array(11),(value,index)=>{return this.currentYear-5+index})
    //
    this.dateChange()
  },
  methods:{
    //判断是否是周末
    isWeek(date){
      //getDay() 获取当前日期对象是周几 0是周天 6是周六
      return date.getDay()===0||date.getDay()===6
    },
    //修改日期
    dateChange(){
      const year = this.currentYear
      const month = this.currentMonth
      const day = this.currentDay
      this.currentDate = new Date(`${year}-${month}-${day}`) // 以当前月的1号为起始
    }
  }
}
</script>

<style  scoped>
 /deep/ .el-calendar-day {
  height:  auto;
 }
 /deep/ .el-calendar-table__row td,/deep/ .el-calendar-table tr td:first-child,  /deep/ .el-calendar-table__row td.prev{
  border:none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
 /deep/ .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
 /deep/ .el-calendar__header {
   display: none
 }
</style>
