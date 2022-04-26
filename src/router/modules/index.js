//收集所有的动态路由
// 引入多个模块的规则
import approvalsRouter from './approvals'
import departmentsRouter from './departments'
import employeesRouter from './employees'
import permissionRouter from './permission'
import attendancesRouter from './attendances'
import salarysRouter from './salarys'
import settingRouter from './setting'
import socialRouter from './social'

export default [
  approvalsRouter,
  socialRouter,
  attendancesRouter,
  salarysRouter,
  departmentsRouter,
  employeesRouter,
  permissionRouter,
  settingRouter
]
