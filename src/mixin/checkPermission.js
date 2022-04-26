//mixin
//检测按钮是否有权限
import store from '@/store'
export default{
  methods: {
    checkPermission(key){
      const { userInfo } = store.state.user
      if (userInfo.roles.points && userInfo.roles.points.length) {
        return userInfo.roles.points.some(item => item === key)
      }
      //如果if条件进不去，也代表没有权限
      return false
    }
  },
}
